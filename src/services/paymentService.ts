import { supabase } from '../lib/supabaseClient';
import { Payment, PaymentMethod, PaymentIntent } from '../types/payment';

// Ethiopian payment service integration
class PaymentService {
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    // Initialize payment SDKs here (Stripe, PayPal, Chapa, etc.)
    this.initialized = true;
  }

  // Create payment intent for booking
  async createPaymentIntent(bookingId: string, amount: number): Promise<PaymentIntent> {
    await this.initialize();

    // Get current user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('User not authenticated');

    // Create payment record in database
    const { data: payment, error } = await supabase
      .from('payments')
      .insert([{
        booking_id: bookingId,
        user_id: session.user.id,
        amount: amount,
        currency: 'ETB',
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      id: payment.id,
      amount,
      currency: 'ETB',
      description: `Car rental booking payment`,
      metadata: {
        booking_id: bookingId,
        user_id: session.user.id
      }
    };
  }

  // Process payment with Ethiopian payment methods
  async processPayment(
    paymentIntentId: string, 
    paymentMethod: PaymentMethod
  ): Promise<Payment> {
    await this.initialize();

    try {
      // Simulate payment processing
      const success = await this.simulatePaymentProcessing(paymentMethod);
      
      const status = success ? 'completed' : 'failed';
      const transaction_id = success ? `txn_${Date.now()}` : undefined;

      // Update payment in database
      const { data: payment, error } = await supabase
        .from('payments')
        .update({
          status,
          transaction_id,
          payment_method: paymentMethod,
          completed_at: success ? new Date().toISOString() : undefined
        })
        .eq('id', paymentIntentId)
        .select()
        .single();

      if (error) throw error;

      // If successful, update booking status
      if (success) {
        await supabase
          .from('bookings')
          .update({ payment_status: 'paid' })
          .eq('id', payment.booking_id);
      }

      return payment;
    } catch (error) {
      // Mark payment as failed
      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('id', paymentIntentId);
      
      throw error;
    }
  }

  // Simulate payment processing (replace with real payment gateway)
  private async simulatePaymentProcessing(paymentMethod: PaymentMethod): Promise<boolean> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate 90% success rate
    return Math.random() > 0.1;
  }

  // Get payment history for user
  async getPaymentHistory(userId: string): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        bookings:booking_id (
          pickup_date,
          return_date,
          cars:car_id (make, model, year)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Refund payment
  async refundPayment(paymentId: string, amount?: number): Promise<Payment> {
    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (error) throw error;
    if (payment.status !== 'completed') {
      throw new Error('Cannot refund non-completed payment');
    }

    // Process refund (simulate)
    const refundAmount = amount || payment.amount;
    
    // Create refund record
    const { data: refund, error: refundError } = await supabase
      .from('payments')
      .insert([{
        booking_id: payment.booking_id,
        user_id: payment.user_id,
        amount: -refundAmount,
        currency: payment.currency,
        status: 'completed',
        transaction_id: `refund_${Date.now()}`,
        payment_method: payment.payment_method
      }])
      .select()
      .single();

    if (refundError) throw refundError;
    return refund;
  }

  // Get Ethiopian payment methods
  getAvailablePaymentMethods(): PaymentMethod[] {
    return [
      {
        id: 'telebirr',
        type: 'mobile_money',
        name: 'TeleBirr',
        details: {},
        isDefault: true
      },
      {
        id: 'cbe_birr',
        type: 'mobile_money', 
        name: 'CBE Birr',
        details: {},
        isDefault: false
      },
      {
        id: 'awash_wallet',
        type: 'mobile_money',
        name: 'Awash Wallet',
        details: {},
        isDefault: false
      },
      {
        id: 'bank_transfer',
        type: 'bank_transfer',
        name: 'Bank Transfer',
        details: {},
        isDefault: false
      }
    ];
  }
}

export const paymentService = new PaymentService();