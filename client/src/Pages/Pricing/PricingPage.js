import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useAuth } from '../../context/data';

function PricingSection() {
  const { user } = useUser();
  const { authURL } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const paymentSectionRef = useRef(null);

  const plans = [
    {
      type: 'basic',
      name: 'Basic Plan',
      price: '499',
      features: [
        'Basic venue decoration',
        'Photography service (1 hour)',
        'Rose petals arrangement',
        'Background music',
      ],
    },
    {
      type: 'premium',
      name: 'Premium Plan',
      price: '999',
      features: [
        'Premium venue decoration',
        'Photography & Video (2 hours)',
        'Customized flower arrangement',
        'Live musician',
        'Champagne celebration',
      ],
    },
    {
      type: 'luxury',
      name: 'Luxury Plan',
      price: '1999',
      features: [
        'Luxury venue decoration',
        'Full day photography & video',
        'Premium flower arrangements',
        'Live band performance',
        'Gourmet dinner for two',
        'Luxury car service',
      ],
    },
  ];

  const paymentMethods = {
    bank: {
      title: 'Bank Transfer',
      icon: 'fa-building-columns',
      accountTitle: 'John Doe',
      accountNumber: '1234-5678-9012-3456',
      bankName: 'HBL Bank',
      branchCode: '0123',
    },
    easypaisa: {
      title: 'Easypaisa',
      icon: 'fa-wallet',
      accountTitle: 'John Doe',
      accountNumber: '0323-1234567',
    },
    jazzcash: {
      title: 'JazzCash',
      icon: 'fa-money-bill-wave',
      accountTitle: 'John Doe',
      accountNumber: '0321-7654321',
    },
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setTimeout(() => {
      paymentSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  const handleSelectPaymentMethod = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleProceedToPayment = async () => {
    try {
        if (!selectedPlan) {
            alert('Please select a plan before verifying payment.');
            return;
        }

        const purchasedAmount = Number(selectedPlan.price.replace(/,/g, ''));
        const currentDate = new Date().toISOString();
        const updateData = {
            clientType: selectedPlan.type,
            status: selectedPlan.features.length,
            purchasedAmount: selectedPlan.price,
            purchasedOn: currentDate,
            paymentStatus: 'unpaid',
        };

        console.log('Update Data:', updateData);

        if (!user?.primaryEmailAddress) {
            alert('User email address is not available.');
            return;
        }

        const url = `${authURL}/update-proposal-email?email=${user.primaryEmailAddress}`;
        console.log('Request URL:', url);

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'Imran@ME',
            },
            body: JSON.stringify(updateData),
        });

        const data = await response.json();
        console.log('Response:', data);

        if (response.ok) {
            alert('Payment verified and agent updated successfully!');
           navigate('payment-verification'); 
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Failed to verify payment and update agent:', error);
        alert('An error occurred while verifying the payment.');
    }
};

  const PaymentModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Processing Payment</h3>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
            <p className="text-gray-600">Please wait while we process your request...</p>
            <p className="text-sm text-gray-500">You will be redirected to the verification page shortly.</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-rose-50">
      <div className="max-w-[85rem] mx-auto pt-32">
        <div className="flex flex-col md:flex-row items-center justify-center w-full px-4 lg:px-0 md:space-y-0">
          <h2 className="text-4xl font-light text-rose-950 text-start w-full">
            Choose your perfect <span className="font-bold italicFont pl-2">proposal plan</span>
          </h2>
          <div className="bg-rose-950 h-0.5 md:w-full"></div>
        </div>
        <h2 className="text-md mt-3 font-light text-rose-950 text-center lg:text-start px-4 lg:px-0 capitalize">
          Select the perfect package to make your special moment unforgettable!
        </h2>
      </div>

      <div className="max-w-[85rem] mx-auto py-16 px-4 lg:px-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.type}
              className={`${plan.type === 'premium'
                ? 'bg-rose-200 transform scale-105'
                : 'bg-rose-100'
                } border border-rose-200 rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow flex flex-col`}
            >
              <div>
                {plan.type === 'premium' && (
                  <div className="bg-rose-950 text-white text-sm px-4 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-rose-950 mb-4">{plan.name}</h3>
                <p className="text-4xl font-bold text-rose-950 mb-6">${plan.price}</p>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-rose-950">
                      <span className="mr-2">✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto">
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className="w-full bg-rose-950 text-white py-3 rounded-lg hover:bg-rose-900 transition-colors"
                >
                  Select Plan
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedPlan && (
          <div ref={paymentSectionRef} className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-rose-50 p-8 rounded-lg border border-rose-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Plan</span>
                  <span>{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Features</span>
                  <span>{selectedPlan.features.length} Items</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-4">
                  <span>Total Amount</span>
                  <span>${selectedPlan.price}</span>
                </div>
              </div>
            </div>

            <div className="bg-rose-50 p-8 rounded-lg border border-rose-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Select Payment Method</h3>
              <div className="space-y-4">
                {['bank', 'easypaisa', 'jazzcash'].map((method) => (
                  <div
                    key={method}
                    onClick={() => handleSelectPaymentMethod(method)}
                    className={`p-4 border rounded-lg cursor-pointer ${selectedPaymentMethod === method ? 'border-rose-500 bg-rose-50' : 'hover:border-rose-200'
                      }`}
                  >
                    <div className="flex items-center space-x-4">
                      <i className={`fa-solid ${paymentMethods[method].icon} text-xl text-gray-600`}></i>
                      <div>
                        <h5 className="font-semibold">{paymentMethods[method].title}</h5>
                        <p className="text-sm text-gray-600">
                          {method === 'bank' ? paymentMethods.bank.bankName : 'Mobile Payment'}
                        </p>
                      </div>
                    </div>
                    {selectedPaymentMethod === method && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="grid gap-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Account Title:</span>
                            <span className="font-medium">{paymentMethods[method].accountTitle}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Account Number:</span>
                            <span className="font-medium">{paymentMethods[method].accountNumber}</span>
                          </div>
                          {method === 'bank' && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Branch Code:</span>
                              <span className="font-medium">{paymentMethods.bank.branchCode}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleProceedToPayment}
                disabled={!selectedPaymentMethod}
                className={`w-full mt-8 py-3 rounded-lg transition-colors ${selectedPaymentMethod
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}
      </div>

      <PaymentModal />
    </div>
  );
}

export default PricingSection;
