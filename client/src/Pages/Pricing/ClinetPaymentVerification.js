import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/data';
import { useUser } from '@clerk/clerk-react';

function ClientPaymentVerification() {
    const { authURL } = useAuth();
    const { user } = useUser();
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchPaymentDetails = async () => {
        try {
            const response = await fetch(
                `${authURL}/get-proposal-by-email?email=${user.primaryEmailAddress.emailAddress}`,
                {
                    headers: {
                        'x-api-key': 'Imran@ME',
                    },
                }
            );
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            console.log(data)

            setPaymentDetails(data.proposal);
        } catch (error) {
            console.error('Failed to fetch payment details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaymentDetails();
    }, [authURL]);

    const renderStatusIcon = (status) => {
        if (status === 'paid') {
            return (
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                    <i className="fa-solid fa-check text-3xl text-green-600"></i>
                </div>
            );
        }
        return (
            <div className="h-20 w-20 rounded-full bg-yellow-100 flex items-center justify-center">
                <i className="fa-solid fa-clock-rotate-left text-3xl text-yellow-600"></i>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Loading payment details...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-24">
            <div className="max-w-[85rem] mx-auto">
                <div className="bg-white p-8 border-2 border-rose-200">
                    {/* Status Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            {paymentDetails ? renderStatusIcon(paymentDetails.paymentStatus) : null}
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            {paymentDetails?.paymentStatus === 'paid'
                                ? 'Payment Verified'
                                : 'Payment Verification Pending'}
                        </h2>
                        <p className="text-gray-600">
                            {paymentDetails?.paymentStatus === 'paid'
                                ? 'Your payment has been successfully verified!'
                                : 'Your payment is being verified by our admin team'}
                        </p>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
                        {paymentDetails ? (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Status</span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${paymentDetails.paymentStatus === 'paid'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                    >
                                        {paymentDetails.paymentStatus}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Amount</span>
                                    <span className="text-gray-900 font-medium">
                                        ${paymentDetails.purchasedAmount || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Purchase Date</span>
                                    <span className="text-gray-900 font-medium">
                                        {paymentDetails.purchasedOn}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Client Type</span>
                                    <span className="text-gray-900 font-medium capitalize">
                                        {paymentDetails.clientType || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-600">No payment details found</p>
                        )}
                    </div>

                    {/* Instructions */}
                    {paymentDetails?.paymentStatus !== 'paid' && (
                        <div className="bg-rose-50 rounded-lg p-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-rose-200 flex items-center justify-center text-sm font-medium text-rose-800">
                                        1
                                    </div>
                                    <p className="ml-3 text-gray-600">
                                        Please ensure you've sent the payment screenshot to our admin number:
                                        <span className="text-rose-600 font-semibold"> 0323242321</span>
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-rose-200 flex items-center justify-center text-sm font-medium text-rose-800">
                                        2
                                    </div>
                                    <p className="ml-3 text-gray-600">
                                        Our admin team will verify your payment within 24 hours
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-rose-200 flex items-center justify-center text-sm font-medium text-rose-800">
                                        3
                                    </div>
                                    <p className="ml-3 text-gray-600">
                                        Once verified, your account will be automatically updated
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Support Section */}
                    <div className="text-center">
                        <p className="text-gray-600 mb-4">Need help? Contact our support team</p>
                        <button className="inline-flex items-center justify-center px-6 py-3 border border-rose-300 text-rose-600 rounded-full hover:bg-rose-50 transition-colors duration-200">
                            <i className="fa-solid fa-headset mr-2"></i>
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClientPaymentVerification;