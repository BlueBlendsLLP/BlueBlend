import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  CartItemInput,
  CustomerInput,
  OrderRecord,
  OrderPaymentStatus,
  CashfreeWebhookPayload,
} from '../models/types.ts';
import { validateAndCalculateItems } from '../data/products.ts';
import { CashfreeService } from './cashfree.service.ts';
import { config } from '../config/cashfree.config.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ORDERS_FILE = path.resolve(__dirname, '../data/orders.json');

export class OrderService {
  private static orders: Map<string, OrderRecord> = new Map();

  static init(): void {
    try {
      if (fs.existsSync(ORDERS_FILE)) {
        const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
        const list: OrderRecord[] = JSON.parse(data);
        for (const order of list) {
          this.orders.set(order.orderId, order);
        }
        console.log(`[OrderService] Loaded ${this.orders.size} orders from persistent store.`);
      }
    } catch (err) {
      console.warn('[OrderService] Could not read existing orders.json, starting empty.', err);
    }
  }

  private static persist(): void {
    try {
      const dir = path.dirname(ORDERS_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const data = JSON.stringify(Array.from(this.orders.values()), null, 2);
      fs.writeFileSync(ORDERS_FILE, data, 'utf-8');
    } catch (err) {
      console.error('[OrderService] Failed to persist orders:', err);
    }
  }

  /**
   * Generates secure digital access tokens & deliverables for purchased courses
   */
  private static generateDeliverables(items: OrderRecord['items']) {
    return items.map((item) => {
      const code = Math.random().toString(36).substring(2, 6).toUpperCase();
      const num = Math.floor(1000 + Math.random() * 9000);
      return {
        courseTitle: item.title,
        accessPortalUrl: `https://learn.blueblends.com/access/${item.productId}?token=BB-${code}-${num}`,
        licenseKey: `BB-LIC-${code}-${num}`,
      };
    });
  }

  /**
   * Creates an order and initiates a Cashfree payment session
   */
  static async createOrder(
    customerInput: CustomerInput,
    itemsInput: CartItemInput[],
    customReturnUrl?: string
  ): Promise<{
    success: boolean;
    order?: OrderRecord;
    paymentSessionId?: string;
    cfOrderId?: string | number;
    error?: string;
    isSimulated?: boolean;
  }> {
    // 1. Validate customer details
    if (!customerInput.name?.trim()) {
      return { success: false, error: 'Customer name is required' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerInput.email?.trim() || !emailRegex.test(customerInput.email.trim())) {
      return { success: false, error: 'Valid customer email is required for digital delivery' };
    }
    const cleanPhone = customerInput.phone?.replace(/\D/g, '') || '';
    if (cleanPhone.length < 10) {
      return { success: false, error: 'Valid 10-digit phone number is required' };
    }

    // 2. Validate items and compute authoritative server total
    const validation = validateAndCalculateItems(itemsInput);
    if (!validation.valid) {
      return { success: false, error: validation.error || 'Invalid cart items' };
    }

    // 3. Generate unique order ID
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const orderId = `order_${timestamp}_${randomSuffix}`;
    const customerId =
      customerInput.customerId || `cust_${cleanPhone.slice(-6)}_${randomSuffix}`;

    let returnUrl =
      customReturnUrl ||
      `${config.appUrl}/?order_id={order_id}&payment_status=check`;

    // Cashfree strictly requires return_url to start with https://
    if (returnUrl && returnUrl.startsWith('http://')) {
      returnUrl = returnUrl.replace(/^http:\/\//i, 'https://');
    }

    let notifyUrl: string | undefined = `${config.appUrl}/api/payment/webhook`;
    if (notifyUrl.startsWith('http://')) {
      notifyUrl = notifyUrl.replace(/^http:\/\//i, 'https://');
    }
    // Omit notify_url if on localhost as Cashfree's production servers cannot reach localhost
    if (notifyUrl.includes('localhost') || notifyUrl.includes('127.0.0.1')) {
      notifyUrl = undefined;
    }

    const orderMeta: any = {
      return_url: returnUrl,
    };
    if (notifyUrl) {
      orderMeta.notify_url = notifyUrl;
    }

    // 4. Create order in Cashfree
    const cashfreeRes = await CashfreeService.createOrder({
      order_id: orderId,
      order_amount: validation.totalAmount,
      order_currency: 'INR',
      customer_details: {
        customer_id: customerId,
        customer_name: customerInput.name.trim(),
        customer_email: customerInput.email.trim(),
        customer_phone: cleanPhone.slice(-10),
      },
      order_meta: orderMeta,
      order_note: `Blueblends digital order: ${validation.orderItems
        .map((i) => i.title)
        .join(', ')}`,
      order_tags: {
        source: 'blueblends_web',
      },
    });

    if (cashfreeRes.error || !cashfreeRes.data) {
      return {
        success: false,
        error: cashfreeRes.error || 'Failed to create payment session with Cashfree',
      };
    }

    // 5. Store order locally
    const now = new Date().toISOString();
    const orderRecord: OrderRecord = {
      orderId,
      cfOrderId: String(cashfreeRes.data.cf_order_id),
      paymentSessionId: cashfreeRes.data.payment_session_id,
      amount: validation.totalAmount,
      currency: 'INR',
      status: 'ACTIVE',
      customer: {
        customerId,
        name: customerInput.name.trim(),
        email: customerInput.email.trim(),
        phone: cleanPhone,
      },
      items: validation.orderItems,
      orderNote: cashfreeRes.data.order_note,
      createdAt: now,
      updatedAt: now,
      deliverablesAvailable: false,
    };

    this.orders.set(orderId, orderRecord);
    this.persist();

    return {
      success: true,
      order: orderRecord,
      paymentSessionId: cashfreeRes.data.payment_session_id,
      cfOrderId: cashfreeRes.data.cf_order_id,
      isSimulated: cashfreeRes.isSimulated,
    };
  }

  /**
   * Retrieves order by ID
   */
  static getOrder(orderId: string): OrderRecord | undefined {
    return this.orders.get(orderId);
  }

  /**
   * Retrieves all orders (sorted newest first)
   */
  static getAllOrders(): OrderRecord[] {
    return Array.from(this.orders.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Verifies the order payment status against Cashfree API
   */
  static async verifyPayment(orderId: string): Promise<{
    success: boolean;
    order?: OrderRecord;
    status: OrderPaymentStatus;
    error?: string;
  }> {
    const order = this.orders.get(orderId);
    if (!order) {
      return { success: false, status: 'FAILED', error: 'Order not found' };
    }

    if (order.status === 'PAID') {
      return { success: true, order, status: 'PAID' };
    }

    const cfOrderRes = await CashfreeService.getOrder(orderId);
    const paymentsRes = await CashfreeService.getOrderPayments(orderId);

    const now = new Date().toISOString();

    if (cfOrderRes.data?.order_status === 'PAID') {
      const successfulPayment = paymentsRes.data?.find(
        (p) => p.payment_status === 'SUCCESS'
      );

      order.status = 'PAID';
      order.updatedAt = now;
      order.paidAt = successfulPayment?.payment_time || now;
      order.cfPaymentId = successfulPayment
        ? String(successfulPayment.cf_payment_id)
        : undefined;
      order.bankReference = successfulPayment?.bank_reference;
      order.paymentMethod =
        successfulPayment?.payment_group || 'cashfree_standard';
      order.deliverablesAvailable = true;
      order.accessLinks = this.generateDeliverables(order.items);

      this.orders.set(orderId, order);
      this.persist();

      return { success: true, order, status: 'PAID' };
    }

    const successfulPayment = paymentsRes.data?.find(
      (p) => p.payment_status === 'SUCCESS'
    );
    if (successfulPayment) {
      order.status = 'PAID';
      order.updatedAt = now;
      order.paidAt = successfulPayment.payment_time || now;
      order.cfPaymentId = String(successfulPayment.cf_payment_id);
      order.bankReference = successfulPayment.bank_reference;
      order.paymentMethod = successfulPayment.payment_group || 'cashfree_standard';
      order.deliverablesAvailable = true;
      order.accessLinks = this.generateDeliverables(order.items);

      this.orders.set(orderId, order);
      this.persist();

      return { success: true, order, status: 'PAID' };
    }

    if (cfOrderRes.data?.order_status === 'EXPIRED') {
      order.status = 'EXPIRED';
      order.updatedAt = now;
      this.orders.set(orderId, order);
      this.persist();
      return { success: false, order, status: 'EXPIRED' };
    }

    const failedPayment = paymentsRes.data?.find(
      (p) => p.payment_status === 'FAILED'
    );
    if (failedPayment) {
      order.status = 'FAILED';
      order.updatedAt = now;
      this.orders.set(orderId, order);
      this.persist();
      return {
        success: false,
        order,
        status: 'FAILED',
        error: failedPayment.payment_message || 'Payment transaction failed',
      };
    }

    return {
      success: false,
      order,
      status: order.status,
      error: 'Payment pending or not completed yet',
    };
  }

  /**
   * Processes Cashfree Webhooks with idempotency
   */
  static async handleWebhook(
    payload: CashfreeWebhookPayload
  ): Promise<{ processed: boolean; orderId?: string; event: string }> {
    const eventType = payload.type;
    const orderData = payload.data?.order;
    const paymentData = payload.data?.payment;

    if (!orderData?.order_id) {
      console.warn('[OrderService] Webhook received without order_id:', payload);
      return { processed: false, event: eventType };
    }

    const orderId = orderData.order_id;
    const order = this.orders.get(orderId);
    const now = new Date().toISOString();

    if (!order) {
      console.warn(`[OrderService] Webhook order ${orderId} not found in local store.`);
      return { processed: false, orderId, event: eventType };
    }

    if (
      eventType === 'PAYMENT_SUCCESS_WEBHOOK' ||
      eventType === 'ORDER_PAID'
    ) {
      if (order.status !== 'PAID') {
        order.status = 'PAID';
        order.updatedAt = now;
        order.paidAt = paymentData?.payment_time || now;
        if (paymentData?.cf_payment_id) {
          order.cfPaymentId = String(paymentData.cf_payment_id);
        }
        if (paymentData?.bank_reference) {
          order.bankReference = paymentData.bank_reference;
        }
        order.paymentMethod = paymentData?.payment_group || 'cashfree_webhook';
        order.deliverablesAvailable = true;
        order.accessLinks = this.generateDeliverables(order.items);

        this.orders.set(orderId, order);
        this.persist();
        console.log(`[OrderService] Order ${orderId} successfully marked PAID via webhook.`);
      }
      return { processed: true, orderId, event: eventType };
    }

    if (eventType === 'PAYMENT_FAILED_WEBHOOK') {
      if (order.status !== 'PAID') {
        order.status = 'FAILED';
        order.updatedAt = now;
        this.orders.set(orderId, order);
        this.persist();
      }
      return { processed: true, orderId, event: eventType };
    }

    return { processed: true, orderId, event: eventType };
  }

  /**
   * Sandbox simulation helper: simulates successful payment in test environments
   */
  static simulatePaymentSuccess(orderId: string): {
    success: boolean;
    order?: OrderRecord;
    error?: string;
  } {
    const order = this.orders.get(orderId);
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    const now = new Date().toISOString();
    order.status = 'PAID';
    order.updatedAt = now;
    order.paidAt = now;
    order.cfPaymentId = `sim_pay_${Date.now()}`;
    order.bankReference = `BANK_${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    order.paymentMethod = 'UPI_SIMULATED';
    order.deliverablesAvailable = true;
    order.accessLinks = this.generateDeliverables(order.items);

    this.orders.set(orderId, order);
    this.persist();

    return { success: true, order };
  }
}

OrderService.init();
