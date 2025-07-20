// Payment system types
export interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile_money' | 'bank_transfer';
  name: string;
  details: {
    last4?: string;
    brand?: string;
    phone?: string;
    bank?: string;
  };
  isDefault: boolean;
}

export interface Payment {
  id: string;
  booking_id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  payment_method: PaymentMethod;
  transaction_id?: string;
  created_at: string;
  completed_at?: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  description: string;
  metadata: {
    booking_id: string;
    user_id: string;
  };
}

export interface PaymentProvider {
  name: string;
  initialize(config: any): Promise<void>;
  createPaymentIntent(amount: number, currency: string, metadata: any): Promise<PaymentIntent>;
  processPayment(paymentIntent: PaymentIntent, paymentMethod: PaymentMethod): Promise<Payment>;
  refundPayment(paymentId: string, amount?: number): Promise<Payment>;
}