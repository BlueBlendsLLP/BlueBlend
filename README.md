# Blueblends - Digital Products & Cashfree Payment Gateway Backend

Blueblends is a modern digital commerce and learning platform offering technical courses and creative digital products by BlueBlends Digital Services LLP.

This repository includes a production-ready **Node.js / Express backend** integrating **Cashfree Payment Gateway (PG API v3, 2023-08-01)** with authoritative server-side pricing, cryptographic webhook signature verification, order fulfillment, and seamless frontend checkout.

---

## Listed Products & Authoritative Pricing

| Product ID | Title | Level & Duration | Price (INR) |
| :--- | :--- | :--- | :--- |
| `web-designing-course` | **Web Designing Course** | Beginner to Intermediate · 6 Weeks | ₹9,999.00 |
| `system-design-course` | **System Design Course** | Intermediate to Senior · 8 Weeks | ₹24,999.00 |
| `c-course` | **C++ Course** | Foundation to Advanced · 10 Weeks | ₹49,999.00 |
| `python-course` | **Python Course** | Comprehensive Mastery · 12 Weeks | ₹99,999.00 |

> **Anti-Tampering Security:** The backend recalculates order subtotals and totals from server-side definitions. Price values submitted from the client are never trusted.

---

## Backend Architecture

```
server/
├── index.ts                  # Express server entry point, CORS, raw body retention, static fallback
├── config/
│   └── cashfree.config.ts    # Cashfree credentials, base URLs, environment toggle, port settings
├── controllers/
│   └── payment.controller.ts # Handlers for createOrder, verifyPayment, webhook, simulatePay, config
├── services/
│   ├── cashfree.service.ts   # Cashfree PG REST API client (Orders, Payments, HMAC verification)
│   └── order.service.ts      # Authoritative order store, license key & course deliverable generator
├── routes/
│   ├── payment.routes.ts     # /api/payment routes
│   └── product.routes.ts     # /api/products routes
├── models/
│   └── types.ts              # Strongly typed TypeScript interfaces (Orders, Deliverables, Cashfree)
├── data/
│   ├── products.ts           # Authoritative course catalog with syllabus and deliverables
│   └── orders.json           # Persistent order store
└── test/
    ├── payment.test.ts       # Backend unit test suite (Catalog, Pricing, Orders, HMAC SHA256)
    └── e2e.test.ts           # End-to-end HTTP integration test suite
```

---

## Cashfree Payment Gateway Integration

### 1. Order Creation (`POST /api/payment/create-order`)
* Calls Cashfree PG API (`POST https://sandbox.cashfree.com/pg/orders` or production URL)
* Sends `x-client-id`, `x-client-secret`, `x-api-version: 2023-08-01`
* Returns `payment_session_id`, `order_id`, and `order_amount`
* In development/demo environments when keys are not yet configured, automatically provides sandbox simulation mode without breaking the workflow.

### 2. Payment Verification (`POST /api/payment/verify` or `GET /api/payment/status/:orderId`)
* Queries Cashfree PG: `GET /pg/orders/{order_id}` and `GET /pg/orders/{order_id}/payments`
* Verifies transaction status (`order_status === 'PAID'` and successful transaction)
* Generates digital course deliverables, license keys (`BB-LIC-...`), and learning portal access links.

### 3. Webhook Signature Verification (`POST /api/payment/webhook`)
* Captures raw request buffer via `express.json({ verify: ... })`
* Cryptographically verifies `x-webhook-signature` using HMAC-SHA256 (`timestamp + rawBody` hashed with `CASHFREE_SECRET_KEY`)
* Protects against replay attacks with a 10-minute validity window
* Timing-safe buffer comparison via `crypto.timingSafeEqual`
* Idempotent handling of `PAYMENT_SUCCESS_WEBHOOK` and `ORDER_PAID`.

---

## API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Healthcheck and gateway status |
| `GET` | `/api/payment/config` | Public Cashfree gateway configuration & environment |
| `GET` | `/api/products` | Retrieve catalog of all products |
| `GET` | `/api/products/:id` | Retrieve single product details |
| `POST` | `/api/payment/create-order` | Create order & retrieve Cashfree `payment_session_id` |
| `POST` | `/api/payment/verify` | Verify payment status with Cashfree |
| `GET` | `/api/payment/status/:orderId` | Check status and fetch deliverables |
| `GET` | `/api/payment/order/:orderId` | Get stored order details by ID |
| `GET` | `/api/payment/orders` | List stored orders |
| `POST` | `/api/payment/webhook` | Cashfree webhook receiver with signature validation |
| `POST` | `/api/payment/simulate-pay` | Test helper to simulate payment in dev/sandbox |

---

## Configuration & Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set your Cashfree credentials from the [Cashfree Merchant Dashboard](https://merchant.cashfree.com):

```env
# Cashfree Credentials
CASHFREE_APP_ID="your_cashfree_app_id"
CASHFREE_SECRET_KEY="your_cashfree_secret_key"
CASHFREE_ENVIRONMENT="SANDBOX" # or "PRODUCTION"
CASHFREE_API_VERSION="2023-08-01"

# Server Settings
PORT=5000
APP_URL="http://localhost:3000"
```

---

## Running the Application

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Run Backend Server
```bash
npm run server
```
*Server starts on `http://localhost:5000` with API health check at `/api/health`.*

### 3. Run Frontend Development Server
```bash
npm run dev
```
*Vite dev server starts on `http://localhost:3000` with automatic `/api` proxy to the Express backend.*

### 4. Run Test Suites
```bash
# Run backend unit tests (catalog, price calculations, HMAC verification, idempotency)
npm run test:server

# Run end-to-end HTTP integration tests
npm run test:e2e
```

### 5. Build for Production
```bash
npm run build
npm start
```
