process.env.NODE_ENV = 'test';
import assert from 'assert';
import app from '../app.ts';

async function testHttpEndpoints() {
  console.log('--- Running End-to-End HTTP Integration Tests ---');
  const port = 5099;

  const server = app.listen(port, '127.0.0.1');

  await new Promise((resolve) => server.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Test server running on ${baseUrl}`);

  try {
    // 1. Health check
    console.log('1. Testing GET /api/health');
    const healthRes = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(healthRes.status, 200);
    const healthData = await healthRes.json();
    assert.strictEqual(healthData.status, 'healthy');
    console.log('✓ GET /api/health passed.');

    // 2. Gateway config
    console.log('2. Testing GET /api/payment/config');
    const configRes = await fetch(`${baseUrl}/api/payment/config`);
    assert.strictEqual(configRes.status, 200);
    const configData = await configRes.json();
    assert.strictEqual(configData.gateway, 'Cashfree Payment Gateway');
    assert.strictEqual(configData.currency, 'INR');
    console.log('✓ GET /api/payment/config passed.');

    // 3. Products list
    console.log('3. Testing GET /api/products');
    const productsRes = await fetch(`${baseUrl}/api/products`);
    assert.strictEqual(productsRes.status, 200);
    const productsData = await productsRes.json();
    assert.strictEqual(productsData.count, 8);
    assert.strictEqual(productsData.products[0].id, 'web-designing-course');
    console.log('✓ GET /api/products passed.');

    // 4. Create Order
    console.log('4. Testing POST /api/payment/create-order');
    const createRes = await fetch(`${baseUrl}/api/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: {
          name: 'Priya Patel',
          email: 'priya@example.com',
          phone: '9876543210',
        },
        items: [
          { productId: 'web-designing-course', quantity: 1 },
          { productId: 'python-course', quantity: 1 },
        ],
      }),
    });
    assert.strictEqual(createRes.status, 201);
    const createData = await createRes.json();
    assert.strictEqual(createData.success, true);
    assert.ok(createData.orderId);
    assert.ok(createData.paymentSessionId);
    assert.strictEqual(createData.orderAmount, 9999 + 99999);
    console.log(`✓ POST /api/payment/create-order passed. OrderID=${createData.orderId}`);

    const orderId = createData.orderId;

    // 5. Get Order
    console.log(`5. Testing GET /api/payment/order/${orderId}`);
    const getRes = await fetch(`${baseUrl}/api/payment/order/${orderId}`);
    assert.strictEqual(getRes.status, 200);
    const getData = await getRes.json();
    assert.strictEqual(getData.order.orderId, orderId);
    assert.strictEqual(getData.order.customer.email, 'priya@example.com');
    console.log('✓ GET /api/payment/order/:id passed.');

    // 6. Simulate Payment
    console.log('6. Testing POST /api/payment/simulate-pay');
    const simRes = await fetch(`${baseUrl}/api/payment/simulate-pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });
    assert.strictEqual(simRes.status, 200);
    const simData = await simRes.json();
    assert.strictEqual(simData.success, true);
    assert.strictEqual(simData.order.status, 'PAID');
    assert.strictEqual(simData.order.deliverablesAvailable, true);
    console.log('✓ POST /api/payment/simulate-pay passed.');

    // 7. Verify Payment Status
    console.log(`7. Testing GET /api/payment/status/${orderId}`);
    const verifyRes = await fetch(`${baseUrl}/api/payment/status/${orderId}`);
    assert.strictEqual(verifyRes.status, 200);
    const verifyData = await verifyRes.json();
    assert.strictEqual(verifyData.success, true);
    assert.strictEqual(verifyData.status, 'PAID');
    assert.ok(verifyData.accessLinks?.length > 0);
    console.log('✓ GET /api/payment/status/:id passed.');

    // 8. List Orders
    console.log('8. Testing GET /api/payment/orders');
    const ordersRes = await fetch(`${baseUrl}/api/payment/orders`);
    assert.strictEqual(ordersRes.status, 200);
    const ordersData = await ordersRes.json();
    assert.ok(ordersData.count >= 1);
    console.log('✓ GET /api/payment/orders passed.');

    // 9. Webhook Processing
    console.log('9. Testing POST /api/payment/webhook');
    const webhookPayload = JSON.stringify({
      type: 'PAYMENT_SUCCESS_WEBHOOK',
      data: {
        order: { order_id: orderId, order_amount: 109998, order_currency: 'INR' },
        payment: {
          cf_payment_id: 'cf_wh_999',
          payment_status: 'SUCCESS',
          payment_amount: 109998,
          payment_currency: 'INR',
          payment_time: new Date().toISOString(),
        },
      },
    });

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const { config } = await import('../config/cashfree.config.ts');
    const { default: crypto } = await import('crypto');
    const webhookHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (config.secretKey) {
      const sig = crypto
        .createHmac('sha256', config.secretKey)
        .update(`${timestamp}${webhookPayload}`)
        .digest('base64');
      webhookHeaders['x-webhook-signature'] = sig;
      webhookHeaders['x-webhook-timestamp'] = timestamp;
    }

    const webhookRes = await fetch(`${baseUrl}/api/payment/webhook`, {
      method: 'POST',
      headers: webhookHeaders,
      body: webhookPayload,
    });
    assert.strictEqual(webhookRes.status, 200);
    const webhookData = await webhookRes.json();
    assert.strictEqual(webhookData.success, true);
    console.log('✓ POST /api/payment/webhook passed.');

    console.log('\n--- All HTTP End-to-End API Tests Passed! 🎉 ---');
    process.exit(0);
  } finally {
    server.close();
  }
}

testHttpEndpoints().catch((err) => {
  console.error('E2E Test Error:', err);
  process.exit(1);
});
