import { Request, Response } from 'express';
import { OrderService } from '../services/order.service.ts';
import { CashfreeService } from '../services/cashfree.service.ts';
import { config } from '../config/cashfree.config.ts';

export class PaymentController {
  /**
   * POST /api/payment/create-order
   * Creates a new Cashfree checkout order
   */
  static async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { items, customer, returnUrl } = req.body;

      if (!items || !customer) {
        res.status(400).json({
          success: false,
          error: 'Missing required payload: "items" and "customer" are required.',
        });
        return;
      }

      const result = await OrderService.createOrder(customer, items, returnUrl);

      if (!result.success || !result.order) {
        res.status(400).json({
          success: false,
          error: result.error || 'Unable to create order',
        });
        return;
      }

      res.status(201).json({
        success: true,
        orderId: result.order.orderId,
        cfOrderId: result.cfOrderId,
        paymentSessionId: result.paymentSessionId,
        orderAmount: result.order.amount,
        orderCurrency: result.order.currency,
        itemsCount: result.order.items.length,
        environment: config.environment.toLowerCase(),
        message: 'Order created successfully with Cashfree.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[PaymentController.createOrder] Unexpected error:', msg);
      res.status(500).json({
        success: false,
        error: `Internal server error: ${msg}`,
      });
    }
  }

  /**
   * POST /api/payment/verify
   * or GET /api/payment/status/:orderId
   * Verifies the order payment with Cashfree
   */
  static async verifyPayment(req: Request, res: Response): Promise<void> {
    try {
      const orderId =
        req.body?.orderId || req.params?.orderId || (req.query?.order_id as string);

      if (!orderId) {
        res.status(400).json({
          success: false,
          error: 'Missing orderId parameter.',
        });
        return;
      }

      const result = await OrderService.verifyPayment(orderId);

      if (!result.success || !result.order) {
        res.status(result.status === 'FAILED' ? 400 : 200).json({
          success: false,
          orderId,
          status: result.status,
          error: result.error || 'Payment not verified',
          order: result.order,
        });
        return;
      }

      res.status(200).json({
        success: true,
        orderId: result.order.orderId,
        status: result.order.status,
        amount: result.order.amount,
        customer: result.order.customer,
        items: result.order.items,
        cfPaymentId: result.order.cfPaymentId,
        bankReference: result.order.bankReference,
        paidAt: result.order.paidAt,
        accessLinks: result.order.accessLinks,
        deliverablesAvailable: result.order.deliverablesAvailable,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[PaymentController.verifyPayment] Unexpected error:', msg);
      res.status(500).json({
        success: false,
        error: `Internal server error: ${msg}`,
      });
    }
  }

  /**
   * GET /api/payment/order/:orderId
   * Fetches single order details from the database
   */
  static async getOrder(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const order = OrderService.getOrder(orderId);

      if (!order) {
        res.status(404).json({
          success: false,
          error: `Order with ID "${orderId}" not found.`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        order,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(500).json({
        success: false,
        error: `Internal server error: ${msg}`,
      });
    }
  }

  /**
   * GET /api/payment/orders
   * Lists all stored orders
   */
  static async getAllOrders(_req: Request, res: Response): Promise<void> {
    try {
      const orders = OrderService.getAllOrders();
      res.status(200).json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(500).json({
        success: false,
        error: `Internal server error: ${msg}`,
      });
    }
  }

  /**
   * POST /api/payment/webhook
   * Cashfree Webhook endpoint with HMAC-SHA256 signature verification
   */
  static async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const signature = req.headers['x-webhook-signature'] as string | undefined;
      const timestamp = req.headers['x-webhook-timestamp'] as string | undefined;
      const rawBody = (req as unknown as { rawBody?: string }).rawBody || '';

      console.log('[PaymentController.handleWebhook] Received webhook:', {
        type: req.body?.type,
        timestamp,
        hasSignature: Boolean(signature),
      });

      // If secret key is configured, verify HMAC signature
      if (config.secretKey) {
        const verification = CashfreeService.verifyWebhookSignature(
          signature,
          rawBody,
          timestamp
        );

        if (!verification.isValid) {
          console.warn(
            '[PaymentController.handleWebhook] Webhook signature rejected:',
            verification.reason
          );
          res.status(400).json({
            success: false,
            error: 'Invalid webhook signature',
            reason: verification.reason,
          });
          return;
        }
      }

      // Process webhook event
      const result = await OrderService.handleWebhook(req.body);

      res.status(200).json({
        success: true,
        message: 'Webhook processed successfully',
        data: result,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[PaymentController.handleWebhook] Error processing webhook:', msg);
      res.status(500).json({
        success: false,
        error: `Webhook processing error: ${msg}`,
      });
    }
  }

  /**
   * POST /api/payment/simulate-pay
   * Simulates successful payment for testing without active Cashfree keys
   */
  static async simulatePay(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.body;
      if (!orderId) {
        res.status(400).json({ success: false, error: 'orderId is required' });
        return;
      }

      const result = OrderService.simulatePaymentSuccess(orderId);
      if (!result.success || !result.order) {
        res.status(400).json({ success: false, error: result.error });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Order simulated as PAID successfully.',
        order: result.order,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(500).json({ success: false, error: msg });
    }
  }

  /**
   * GET /api/payment/config
   * Returns current gateway configuration (environment & sandbox status, never secrets)
   */
  static async getConfig(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      gateway: 'Cashfree Payment Gateway',
      environment: config.environment.toLowerCase(),
      isConfigured: config.isConfigured,
      apiVersion: config.apiVersion,
      currency: 'INR',
    });
  }
}
