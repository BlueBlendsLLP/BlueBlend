import dotenv from 'dotenv';

dotenv.config();

export interface CashfreeConfig {
  appId: string;
  secretKey: string;
  environment: 'SANDBOX' | 'PRODUCTION';
  apiVersion: string;
  baseUrl: string;
  port: number;
  appUrl: string;
  isConfigured: boolean;
}

const appId =
  process.env.CASHFREE_APP_ID || process.env.CASHFREE_CLIENT_ID || '';
const secretKey =
  process.env.CASHFREE_SECRET_KEY || process.env.CASHFREE_CLIENT_SECRET || '';

const rawEnv = (process.env.CASHFREE_ENVIRONMENT || '').toUpperCase();
let environment: 'SANDBOX' | 'PRODUCTION' =
  rawEnv === 'PRODUCTION' ? 'PRODUCTION' : 'SANDBOX';

// Auto-detect production key if secret begins with cfsk_ma_prod_
if (secretKey.startsWith('cfsk_ma_prod_')) {
  if (environment !== 'PRODUCTION') {
    console.log(
      '[CashfreeConfig] Note: Key prefix "cfsk_ma_prod_" is a Production credential. Auto-routing to Cashfree PRODUCTION gateway.'
    );
  }
  environment = 'PRODUCTION';
} else if (secretKey.startsWith('cfsk_ma_test_')) {
  environment = 'SANDBOX';
}

const isConfigured = Boolean(
  appId &&
    secretKey &&
    !appId.includes('your_cashfree') &&
    !secretKey.includes('your_cashfree')
);

const baseUrl =
  environment === 'PRODUCTION'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

export const config: CashfreeConfig = {
  appId,
  secretKey,
  environment,
  apiVersion: process.env.CASHFREE_API_VERSION || '2023-08-01',
  baseUrl,
  port: Number(process.env.PORT) || 5000,
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  isConfigured,
};
