import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { CreditCard, Smartphone, Building, AlertCircle } from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { PaymentMethod } from '../types/payment';
import { useNotifications } from '../hooks/useNotifications';

interface PaymentFormProps {
  amount: number;
  bookingId: string;
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentError: (error: string) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  bookingId,
  onPaymentSuccess,
  onPaymentError
}) => {
  const { addNotification } = useNotifications();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [paymentDetails, setPaymentDetails] = useState({
    phone: '',
    bankAccount: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [processing, setProcessing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const paymentMethods = paymentService.getAvailablePaymentMethods();

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setShowDetails(true);
    setPaymentDetails({
      phone: '',
      bankAccount: '',
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    });
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      addNotification({
        type: 'warning',
        title: 'Payment Method Required',
        message: 'Please select a payment method to continue.'
      });
      onPaymentError('Please select a payment method');
      return;
    }

    setProcessing(true);
    try {
      addNotification({
        type: 'info',
        title: 'Processing Payment',
        message: 'Please wait while we process your payment...'
      });

      // Create payment intent
      const paymentIntent = await paymentService.createPaymentIntent(bookingId, amount);
      
      // Update payment method with user details
      const paymentMethodWithDetails = {
        ...selectedMethod,
        details: {
          ...selectedMethod.details,
          phone: paymentDetails.phone,
          bank: paymentDetails.bankAccount,
          last4: paymentDetails.cardNumber.slice(-4)
        }
      };

      // Process payment
      const payment = await paymentService.processPayment(
        paymentIntent.id, 
        paymentMethodWithDetails
      );

      if (payment.status === 'completed') {
        addNotification({
          type: 'success',
          title: 'Payment Successful!',
          message: `Your payment of ${amount} ETB has been processed successfully.`
        });
        onPaymentSuccess(payment.id);
      } else {
        addNotification({
          type: 'error',
          title: 'Payment Failed',
          message: 'Payment failed. Please try again.'
        });
        onPaymentError('Payment failed. Please try again.');
      }
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Payment Error',
        message: error.message || 'Payment processing failed. Please try again.'
      });
      onPaymentError(error.message || 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  const renderPaymentIcon = (type: string) => {
    switch (type) {
      case 'mobile_money':
        return <Smartphone className="w-6 h-6" />;
      case 'bank_transfer':
        return <Building className="w-6 h-6" />;
      case 'card':
        return <CreditCard className="w-6 h-6" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  const renderPaymentDetails = () => {
    if (!selectedMethod || !showDetails) return null;

    return (
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Enter {selectedMethod.name} Details
          </h3>
          
          {selectedMethod.type === 'mobile_money' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                placeholder="+251 911 123 456"
                value={paymentDetails.phone}
                onChange={(e) => setPaymentDetails(prev => ({ ...prev, phone: e.target.value }))}
                className="mb-4"
              />
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Payment Instructions:</p>
                    <p>1. Dial *847# on your phone</p>
                    <p>2. Select "Send Money"</p>
                    <p>3. Enter the merchant code when prompted</p>
                    <p>4. Confirm payment of {amount.toLocaleString()} ETB</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedMethod.type === 'bank_transfer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Account Number
              </label>
              <Input
                type="text"
                placeholder="Account number"
                value={paymentDetails.bankAccount}
                onChange={(e) => setPaymentDetails(prev => ({ ...prev, bankAccount: e.target.value }))}
                className="mb-4"
              />
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Bank Transfer Details:</p>
                    <p>Account Name: Rentiva Car Rental</p>
                    <p>Account Number: 1234567890</p>
                    <p>Bank: Commercial Bank of Ethiopia</p>
                    <p>Amount: {amount.toLocaleString()} ETB</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedMethod.type === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <Input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={paymentDetails.cardNumber}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <Input
                    type="text"
                    placeholder="MM/YY"
                    value={paymentDetails.expiryDate}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <Input
                    type="text"
                    placeholder="123"
                    value={paymentDetails.cvv}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, cvv: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <div className="grid gap-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedMethod?.id === method.id
                    ? 'border-[#000080] bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleMethodSelect(method)}
              >
                <div className="flex items-center gap-3">
                  {renderPaymentIcon(method.type)}
                  <div className="flex-1">
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-gray-500">
                      {method.type === 'mobile_money' && 'Mobile Money'}
                      {method.type === 'bank_transfer' && 'Bank Transfer'}
                      {method.type === 'card' && 'Credit/Debit Card'}
                    </div>
                  </div>
                  {method.isDefault && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Popular
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {renderPaymentDetails()}

      <div className="flex justify-between items-center p-6 bg-gray-50 rounded-lg">
        <div>
          <div className="text-sm text-gray-600">Total Amount</div>
          <div className="text-2xl font-bold text-[#000080]">
            {amount.toLocaleString()} ETB
          </div>
        </div>
        <Button
          onClick={handlePayment}
          disabled={!selectedMethod || processing}
          className="bg-[#000080] hover:bg-[#000060] px-8 py-3 text-lg"
        >
          {processing ? 'Processing...' : 'Pay Now'}
        </Button>
      </div>
    </div>
  );
};