import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.ts';

const router = Router();

// Gateway Configuration (status & public details)
router.get('/config', PaymentController.getConfig);

// Order & Payment Lifecycle
router.post('/create-order', PaymentController.createOrder);
router.post('/verify', PaymentController.verifyPayment);
router.get('/status/:orderId', PaymentController.verifyPayment);

// Order Queries
router.get('/order/:orderId', PaymentController.getOrder);
router.get('/orders', PaymentController.getAllOrders);

// Cashfree Webhook
router.post('/webhook', PaymentController.handleWebhook);

// Dev / Testing Simulation
router.post('/simulate-pay', PaymentController.simulatePay);

export default router;
