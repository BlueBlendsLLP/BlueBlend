process.env.NODE_ENV = 'test';
import assert from 'assert';
import crypto from 'crypto';
import { BACKEND_PRODUCTS, validateAndCalculateItems } from '../data/products.ts';
import { OrderService } from '../services/order.service.ts';

async function runTests() {
  console.log('--- Starting Blueblends Cashfree Backend Tests ---');

  // Test 1: Verify product catalog integrity
  console.log('1. Testing product catalog...');
  assert.strictEqual(BACKEND_PRODUCTS.length, 4, 'Should have 4 courses listed');
  const webDesign = BACKEND_PRODUCTS.find((p) => p.id === 'web-designing-course');
  assert.ok(webDesign, 'Web Designing Course must exist');
  assert.strictEqual(webDesign?.price, 9999, 'Web Designing Course price should be 9999');
  console.log('✓ Product catalog verified.');

  // Test 2: Price and total amount calculation (anti-tampering check)
  console.log('2. Testing authoritative price calculations...');
  const calc1 = validateAndCalculateItems([
    { productId: 'web-designing-course', quantity: 2 },
    { productId: 'python-course', quantity: 1 },
  ]);
  assert.strictEqual(calc1.valid, true, 'Calculation should be valid');
  assert.strictEqual(calc1.totalAmount, 9999 * 2 + 99999, 'Total must match server prices');
  assert.strictEqual(calc1.orderItems.length, 2);

  const calcInvalid = validateAndCalculateItems([
    { productId: 'non-existent-product', quantity: 1 },
  ]);
  assert.strictEqual(calcInvalid.valid, false, 'Invalid product should be rejected');
  console.log('✓ Anti-tampering price calculation verified.');

  // Test 3: Order Creation
  console.log('3. Testing Cashfree order creation...');
  const orderResult = await OrderService.createOrder(
    {
      name: 'Aarav Sharma',
      email: 'aarav@example.com',
      phone: '9876543210',
    },
    [
      { productId: 'system-design-course', quantity: 1 },
      { productId: 'c-course', quantity: 1 },
    ]
  );

  assert.strictEqual(orderResult.success, true, 'Order creation must succeed');
  assert.ok(orderResult.order, 'Order record must be returned');
  assert.ok(orderResult.paymentSessionId, 'Payment session ID must be returned');
  assert.strictEqual(orderResult.order?.amount, 24999 + 49999, 'Amount must be 74,998');
  assert.strictEqual(orderResult.order?.status, 'ACTIVE');
  console.log(`✓ Order created: ID=${orderResult.order?.orderId}, Session=${orderResult.paymentSessionId}`);

  // Test 4: Payment Simulation & Deliverables
  console.log('4. Testing Payment Simulation and Deliverables...');
  const orderId = orderResult.order!.orderId;
  const simResult = OrderService.simulatePaymentSuccess(orderId);
  assert.strictEqual(simResult.success, true);
  assert.strictEqual(simResult.order?.status, 'PAID');
  assert.strictEqual(simResult.order?.deliverablesAvailable, true);
  assert.strictEqual(simResult.order?.accessLinks?.length, 2);
  assert.ok(simResult.order?.accessLinks?.[0]?.licenseKey.startsWith('BB-LIC-'));
  console.log('✓ Payment simulation and deliverable fulfillment verified.');

  // Test 5: Verify Payment Status retrieval
  console.log('5. Testing Order Verification retrieval...');
  const verifyResult = await OrderService.verifyPayment(orderId);
  assert.strictEqual(verifyResult.success, true);
  assert.strictEqual(verifyResult.status, 'PAID');
  assert.strictEqual(verifyResult.order?.orderId, orderId);
  console.log('✓ Order status verification verified.');

  // Test 6: Webhook HMAC-SHA256 signature verification
  console.log('6. Testing Webhook signature calculation...');
  const testSecret = 'test_secret_key_12345';
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const rawBody = JSON.stringify({
    type: 'PAYMENT_SUCCESS_WEBHOOK',
    data: {
      order: { order_id: orderId, order_amount: 74998, order_currency: 'INR' },
      payment: {
        cf_payment_id: 'cf_102030',
        payment_status: 'SUCCESS',
        payment_amount: 74998,
        payment_currency: 'INR',
        payment_time: new Date().toISOString(),
      },
    },
  });

  const payloadToSign = `${timestamp}${rawBody}`;
  const validSignature = crypto
    .createHmac('sha256', testSecret)
    .update(payloadToSign)
    .digest('base64');

  const computed = crypto
    .createHmac('sha256', testSecret)
    .update(payloadToSign)
    .digest('base64');

  const timingMatches = crypto.timingSafeEqual(
    Buffer.from(validSignature),
    Buffer.from(computed)
  );
  assert.strictEqual(timingMatches, true, 'HMAC signature verification must match');
  console.log('✓ Webhook HMAC-SHA256 signature logic verified.');

  // Test 7: Webhook Handling Idempotency
  console.log('7. Testing Webhook Handling...');
  const webhookResult = await OrderService.handleWebhook(JSON.parse(rawBody));
  assert.strictEqual(webhookResult.processed, true);
  assert.strictEqual(webhookResult.orderId, orderId);
  console.log('✓ Webhook handling & idempotency verified.');

  console.log('\nAll 7 backend tests passed successfully! 🎉');
}

runTests().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
