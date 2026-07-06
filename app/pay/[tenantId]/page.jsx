'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
export default function PaymentPortal() {
  const [paymentData, setPaymentData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const params = useParams();
  const tenantId = params.tenantId;
  useEffect(() => {
    setPaymentData({ amount: 1250, tenant_name: 'John Doe', property_address: '123 Main St, Unit 2A' });
    setLoading(false);
  }, [tenantId]);
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('✓ Payment recorded. Settlement in 1-3 days.');
    setSuccess(true);
  };
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!paymentData) return <div className="flex items-center justify-center min-h-screen">Payment data not found</div>;
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100 flex items-center justify-center px-4">
        <div className="card text-center max-w-md">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Received</h1>
          <p className="text-gray-600 mb-6">Your payment has been recorded. Settlement expected in 1-3 business days.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100">
      <header className="bg-white border-b border-green-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-3xl font-bold text-[#2d6a4f]">🏠 RentFast</div>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card mb-8">
          <div className="mb-6">
            <p className="text-gray-600 text-sm mb-2">Property</p>
            <h1 className="text-2xl font-bold text-gray-900">{paymentData.property_address}</h1>
          </div>
          <div className="grid grid-cols-2 gap-6 p-6 bg-green-50 rounded-lg border border-green-100">
            <div>
              <p className="text-gray-600 text-sm mb-1">Amount Due</p>
              <div className="text-3xl font-bold text-[#2d6a4f]">${paymentData.amount.toFixed(2)}</div>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Settlement</p>
              <div className="text-lg font-medium text-green-700">1-3 Days</div>
            </div>
          </div>
        </div>
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Select Payment Method</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4 mb-6">
              <label className="flex items-center">
                <input type="radio" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-3" />
                <span className="font-medium">Credit/Debit Card</span>
              </label>
              <label className="flex items-center">
                <input type="radio" value="ach" checked={paymentMethod === 'ach'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-3" />
                <span className="font-medium">ACH Bank Transfer</span>
              </label>
              <label className="flex items-center">
                <input type="radio" value="check" checked={paymentMethod === 'check'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-3" />
                <span className="font-medium">Check Payment</span>
              </label>
            </div>
            <button type="submit" className="btn-primary w-full">Submit Payment</button>
          </form>
          {message && <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-900 text-sm mt-4">{message}</div>}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900 mt-4">
            <strong>Settlement Timeline:</strong> Payments settle in 1-3 business days.
          </div>
        </div>
      </main>
    </div>
  );
}
