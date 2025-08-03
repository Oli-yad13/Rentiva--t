/**
 * TypeScript type definitions for payment-related functionality
 */

// Payment method types
export type PaymentMethodType = 'card' | 'bank_account' | 'digital_wallet' | 'cash';
export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'diners' | 'jcb' | 'unionpay' | 'unknown';
export type PaymentStatus = 
  | 'requires_payment_method'
  | 'requires_confirmation' 
  | 'requires_action'
  | 'processing'
  | 'succeeded'
  | 'canceled'
  | 'refunded'
  | 'failed';

// Card information
export interface CardInfo {
  brand: CardBrand;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  country?: string;
  fingerprint?: string;
}

// Digital wallet information
export interface DigitalWalletInfo {
  type: 'apple_pay' | 'google_pay' | 'samsung_pay' | 'paypal';
  email?: string;
}

// Bank account information
export interface BankAccountInfo {
  bankName: string;
  accountType: 'checking' | 'savings';
  last4: string;
  routingNumber?: string;
}

// Payment method
export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  card?: CardInfo;
  digitalWallet?: DigitalWalletInfo;
  bankAccount?: BankAccountInfo;
  isDefault?: boolean;
  customerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Payment intent
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description: string;
  customerId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
  clientSecret: string;
  paymentMethod?: PaymentMethod;
  receiptEmail?: string;
  receiptUrl?: string;
}

// Payment result
export interface PaymentResult {
  success: boolean;
  paymentIntent: PaymentIntent;
  error?: PaymentError;
  transactionId?: string;
  receiptUrl?: string;
  metadata?: Record<string, any>;
}

// Payment error types
export type PaymentErrorCode = 
  | 'CARD_DECLINED'
  | 'INSUFFICIENT_FUNDS'
  | 'INVALID_CARD'
  | 'EXPIRED_CARD'
  | 'INVALID_CVC'
  | 'PROCESSING_ERROR'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'INVALID_AMOUNT'
  | 'INVALID_CURRENCY'
  | 'INVALID_PAYMENT_METHOD'
  | 'INVALID_DESCRIPTION'
  | 'NOT_INITIALIZED'
  | 'INITIALIZATION_FAILED'
  | 'PAYMENT_FAILED'
  | 'REFUND_FAILED'
  | 'UNKNOWN_ERROR';

// Payment error class
export class PaymentError extends Error {
  public readonly code: PaymentErrorCode;
  public readonly details?: Record<string, any>;

  constructor(code: PaymentErrorCode, message: string, details?: Record<string, any>) {
    super(message);
    this.name = 'PaymentError';
    this.code = code;
    this.details = details;
  }
}

// Billing address
export interface BillingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Customer information
export interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: BillingAddress;
  paymentMethods?: PaymentMethod[];
  defaultPaymentMethod?: string;
  createdAt: string;
  updatedAt?: string;
}

// Rental-specific payment types
export interface RentalPayment {
  rentalId: string;
  customerId: string;
  amount: number;
  currency: string;
  description: string;
  paymentIntent?: PaymentIntent;
  status: PaymentStatus;
  dueDate: string;
  paidAt?: string;
  refundedAt?: string;
  refundAmount?: number;
  fees: {
    rentalFee: number;
    insurance?: number;
    taxes: number;
    processingFee: number;
    deposit?: number;
    additionalFees?: number;
  };
  metadata?: {
    vehicleId?: string;
    pickupDate?: string;
    returnDate?: string;
    location?: string;
  };
}

// Payment form data
export interface PaymentFormData {
  paymentMethod: PaymentMethodType;
  cardNumber?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cvc?: string;
  cardholderName?: string;
  billingAddress?: BillingAddress;
  savePaymentMethod?: boolean;
  customerId?: string;
}

// Payment configuration
export interface PaymentConfig {
  publicKey: string;
  currency: string;
  environment: 'sandbox' | 'production';
  supportedPaymentMethods: PaymentMethodType[];
  minimumAmount?: number;
  maximumAmount?: number;
  fees?: {
    processingFeePercentage: number;
    processingFeeFixed: number;
    taxPercentage: number;
  };
}

// Refund information
export interface RefundInfo {
  id: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  reason?: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  createdAt: string;
  processedAt?: string;
  metadata?: Record<string, any>;
}

// Payment analytics
export interface PaymentAnalytics {
  totalTransactions: number;
  totalAmount: number;
  successRate: number;
  averageTransactionAmount: number;
  topPaymentMethods: Array<{
    type: PaymentMethodType;
    count: number;
    percentage: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    transactions: number;
    amount: number;
  }>;
  errorBreakdown: Array<{
    code: PaymentErrorCode;
    count: number;
    percentage: number;
  }>;
}

// Webhook event types
export type WebhookEventType = 
  | 'payment_intent.succeeded'
  | 'payment_intent.failed'
  | 'payment_intent.canceled'
  | 'payment_method.attached'
  | 'payment_method.detached'
  | 'refund.created'
  | 'refund.succeeded'
  | 'refund.failed';

// Webhook event
export interface WebhookEvent {
  id: string;
  type: WebhookEventType;
  data: {
    object: PaymentIntent | PaymentMethod | RefundInfo;
  };
  createdAt: string;
  processed: boolean;
}

// Export utility type guards
export const isCardPaymentMethod = (method: PaymentMethod): method is PaymentMethod & { card: CardInfo } => {
  return method.type === 'card' && !!method.card;
};

export const isDigitalWalletPaymentMethod = (method: PaymentMethod): method is PaymentMethod & { digitalWallet: DigitalWalletInfo } => {
  return method.type === 'digital_wallet' && !!method.digitalWallet;
};

export const isBankAccountPaymentMethod = (method: PaymentMethod): method is PaymentMethod & { bankAccount: BankAccountInfo } => {
  return method.type === 'bank_account' && !!method.bankAccount;
};

// Export validation functions
export const validateCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, '');
  return /^\d{13,19}$/.test(cleaned);
};

export const validateExpiryDate = (month: number, year: number): boolean => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  if (month < 1 || month > 12) return false;
  
  return true;
};

export const validateCVC = (cvc: string, cardBrand?: CardBrand): boolean => {
  const cleaned = cvc.replace(/\s/g, '');
  
  if (cardBrand === 'amex') {
    return /^\d{4}$/.test(cleaned);
  }
  
  return /^\d{3}$/.test(cleaned);
};

export const formatCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, '');
  const groups = cleaned.match(/.{1,4}/g) || [];
  return groups.join(' ').substr(0, 19);
};

export const getCardBrand = (cardNumber: string): CardBrand => {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';
  if (/^6/.test(cleaned)) return 'discover';
  if (/^30[0-5]/.test(cleaned)) return 'diners';
  if (/^35/.test(cleaned)) return 'jcb';
  if (/^62/.test(cleaned)) return 'unionpay';
  
  return 'unknown';
};
