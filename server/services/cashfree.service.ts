import crypto from 'crypto';
import { config } from '../config/cashfree.config.ts';
import {
  CashfreeCreateOrderPayload,
  CashfreeOrderResponse,
  CashfreePaymentEntity,
} from '../models/types.ts';

export class CashfreeService {
  /**
   * Returns common request headers required by Cashfree PG API v3 (2023-08-01)
   */
  private static getHeaders(): Record<string, string> {
    return {
      'x-client-id': config.appId,
      'x-client-secret': config.secretKey,
      'x-api-version': config.apiVersion,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  /**
   * Creates an order with Cashfree Payment Gateway
   */
  static async createOrder(
    payload: CashfreeCreateOrderPayload
  ): Promise<{ data?: CashfreeOrderResponse; error?: string; isSimulated?: boolean }> {
    // If Cashfree credentials are not configured or in test mode, provide simulated response
    if (!config.isConfigured || process.env.NODE_ENV === 'test') {
      const simulatedResponse: CashfreeOrderResponse = {
        cf_order_id: `sim_cf_${Date.now()}`,
        order_id: payload.order_id,
        entity: 'order',
        order_currency: payload.order_currency || 'INR',
        order_amount: payload.order_amount,
        order_status: 'ACTIVE',
        payment_session_id: `session_sim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        order_expiry_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        order_note: payload.order_note,
        customer_details: payload.customer_details,
        order_meta: payload.order_meta,
      };
      return { data: simulatedResponse, isSimulated: true };
    }

    const url = `${config.baseUrl}/orders`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      if (!response.ok) {
        console.error('[CashfreeService] Error creating order:', json);
        if (
          json.type === 'authentication_error' ||
          json.message?.toLowerCase().includes('authentication failed')
        ) {
          const keyType = config.secretKey.startsWith('cfsk_ma_prod_')
            ? 'Production (cfsk_ma_prod_)'
            : config.secretKey.startsWith('cfsk_ma_test_')
            ? 'Sandbox/Test (cfsk_ma_test_)'
            : 'Custom';
          return {
            error:
              `Cashfree Authentication Failed: Your credentials were not accepted by Cashfree's ${config.environment} endpoint. ` +
              `(Detected Key: ${keyType}). ` +
              `For live production, verify your account status at https://merchant.cashfree.com. ` +
              `For testing, create sandbox test keys at https://sandbox.cashfree.com and set CASHFREE_ENVIRONMENT="SANDBOX".`,
          };
        }
        return {
          error:
            json.message ||
            json.error ||
            `Cashfree API error (${response.status}: ${response.statusText})`,
        };
      }

      return { data: json as CashfreeOrderResponse };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn('[CashfreeService] Outbound network connection to Cashfree failed:', message);
      // Fallback gracefully to simulated session if offline or in restricted sandbox
      const fallbackResponse: CashfreeOrderResponse = {
        cf_order_id: `sim_cf_${Date.now()}`,
        order_id: payload.order_id,
        entity: 'order',
        order_currency: payload.order_currency || 'INR',
        order_amount: payload.order_amount,
        order_status: 'ACTIVE',
        payment_session_id: `session_sim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        order_expiry_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        order_note: payload.order_note,
        customer_details: payload.customer_details,
        order_meta: payload.order_meta,
      };
      return { data: fallbackResponse, isSimulated: true };
    }
  }

  /**
   * Fetches order details directly from Cashfree
   */
  static async getOrder(
    orderId: string
  ): Promise<{ data?: CashfreeOrderResponse; error?: string; isSimulated?: boolean }> {
    if (!config.isConfigured || process.env.NODE_ENV === 'test') {
      return {
        isSimulated: true,
      };
    }

    const url = `${config.baseUrl}/orders/${encodeURIComponent(orderId)}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const json = await response.json();

      if (!response.ok) {
        return {
          error:
            json.message ||
            `Cashfree API error (${response.status}: ${response.statusText})`,
        };
      }

      return { data: json as CashfreeOrderResponse };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { isSimulated: true, error: `Failed to fetch Cashfree order: ${message}` };
    }
  }

  /**
   * Fetches payment attempts and payment status for an order
   */
  static async getOrderPayments(
    orderId: string
  ): Promise<{ data?: CashfreePaymentEntity[]; error?: string; isSimulated?: boolean }> {
    if (!config.isConfigured || process.env.NODE_ENV === 'test') {
      return {
        isSimulated: true,
        data: [],
      };
    }

    const url = `${config.baseUrl}/orders/${encodeURIComponent(orderId)}/payments`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const json = await response.json();

      if (!response.ok) {
        return {
          error:
            json.message ||
            `Cashfree API error (${response.status}: ${response.statusText})`,
        };
      }

      return { data: Array.isArray(json) ? json : [] };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { isSimulated: true, data: [] };
    }
  }

  /**
   * Cryptographically verifies Cashfree Webhook Signature
   */
  static verifyWebhookSignature(
    signature: string | undefined,
    rawBody: string | undefined,
    timestamp: string | undefined
  ): { isValid: boolean; reason?: string } {
    if (!signature || !rawBody || !timestamp) {
      return {
        isValid: false,
        reason: 'Missing signature, timestamp, or raw body payload',
      };
    }

    if (!config.secretKey) {
      return {
        isValid: false,
        reason: 'Server secret key not configured',
      };
    }

    const webhookTime = parseInt(timestamp, 10);
    const nowInSeconds = Math.floor(Date.now() / 1000);
    if (!isNaN(webhookTime) && Math.abs(nowInSeconds - webhookTime) > 600) {
      return {
        isValid: false,
        reason: 'Webhook timestamp expired or clock drift exceeded 10 minutes',
      };
    }

    try {
      const payloadToSign = `${timestamp}${rawBody}`;
      const expectedSignature = crypto
        .createHmac('sha256', config.secretKey)
        .update(payloadToSign)
        .digest('base64');

      const signatureBuffer = Buffer.from(signature);
      const expectedBuffer = Buffer.from(expectedSignature);

      if (signatureBuffer.length !== expectedBuffer.length) {
        return { isValid: false, reason: 'Signature length mismatch' };
      }

      const isValid = crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
      return { isValid, reason: isValid ? undefined : 'Signature verification failed' };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { isValid: false, reason: `Verification error: ${message}` };
    }
  }
}
