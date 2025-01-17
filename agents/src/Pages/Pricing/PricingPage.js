import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/data';

function PricingPage() {
    const navigate = useNavigate();
    const { authURL } = useAuth();
    const [currentStatus, setCurrentStatus] = useState("");
    const [agentData, setAgentData] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showBankModal, setShowBankModal] = useState(false);
    const [showWalletModal, setShowWalletModal] = useState(false);

    const plans = [
        {
            type: "basic",
            name: "Basic Plan",
            price: "0",
            features: [
                "Basic Profile Listing",
                "3 Proposals",
                "Email Support",
                "Basic Analytics"
            ],
        },
        {
            type: "standard",
            name: "Premium Plan",
            price: "2999",
            features: [
                "Enhanced Profile Listing",
                "50 Proposals",
                "Priority Email Support",
                "Advanced Analytics",
                "Featured Listing"
            ],
        },
    ];

    // Bank account details
    const bankDetails = {
        bankName: "HBL Bank",
        accountTitle: "Your Company Name",
        accountNumber: "1234-5678-9012-3456",
        branchCode: "0123",
        iban: "PK36HABB0000123456789012"
    };

    // E-wallet details
    const walletDetails = {
        jazzCash: {
            accountName: "Your Company Name",
            accountNumber: "0300-1234567"
        },
        easyPaisa: {
            accountName: "Your Company Name",
            accountNumber: "0333-1234567"
        }
    };

    const fetchAgentData = async () => {
        try {
            const agentCode = localStorage.getItem('agentCode');
            const response = await fetch(`${authURL}/get-agent?agentCode=${agentCode}`, {
                headers: {
                    'x-api-key': 'Imran@ME',
                },
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            setAgentData(data);
            setCurrentStatus(data?.agentType || "");
        } catch (error) {
            console.error('Failed to fetch agent data:', error);
        }
    };

    useEffect(() => {
        fetchAgentData();
    }, []);

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
    };

    const handleVerifyPayment = async () => {
        try {
            if (!selectedPlan) {
                alert("Please select a plan before verifying payment.");
                return;
            }

            const agentCode = localStorage.getItem('agentCode');
            const purchasedAmount = Number(selectedPlan.price.replace(/,/g, ''));
            const currentDate = new Date().toISOString();
            const updateData = {
                agentType: selectedPlan.type,
                proposalLimit: selectedPlan.proposals,
                purchasedAmount: purchasedAmount,
                purchasedOn: currentDate,
                paymentStatus: "unpaid",
            };

            const response = await fetch(`${authURL}/update-agent-status?agentCode=${agentCode}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'Imran@ME',
                },
                body: JSON.stringify(updateData),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Payment verified and agent updated successfully!");
                setAgentData(data.updatedAgent);
                setCurrentStatus(data.updatedAgent.agentType);
                navigate('payment-verification');
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Failed to verify payment and update agent:', error);
            alert('An error occurred while verifying the payment.');
        }
    };

    // Modal component
    const Modal = ({ isOpen, onClose, children }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
                <div className="relative bg-white rounded-lg max-w-md w-full m-4">
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                            <span className="text-2xl">×</span>
                        </button>
                    </div>
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className='border-2 border-rose-200 p-12 bg-white'>
            <div className='flex items-end justify-between mb-8'>
                <h1 className='text-6xl font-bold text-rose-900'>Upgrade Plan</h1>
                <Link to='payment-verification'
                    className="inline-flex items-center px-6 py-3 bg-rose-100 text-rose-700 rounded-full hover:bg-rose-200 transition-colors duration-200 font-semibold"
                >
                    <i className="fa-solid fa-receipt mr-2"></i>
                    Check Verification Status
                </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
                {plans.map((plan) => (
                    <div
                        key={plan.type}
                        className={`bg-rose-50 border-rose-200 border rounded-lg shadow-sm p-6 relative hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col ${currentStatus === plan.type ? 'border-rose-600' : ''}`}
                    >
                        {currentStatus === plan.type && (
                            <span className="absolute top-4 right-4 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                Current Plan
                            </span>
                        )}
                        <div className="mb-4">
                            <h3 className="text-base font-bold text-gray-900">{plan.name}</h3>
                            <p className="text-xs text-gray-600">Upgrade to this plan</p>
                        </div>
                        <div className="flex-grow mb-6">
                            <div className="text-2xl font-bold text-gray-900 mb-6">
                                Rs. {plan.price}
                            </div>
                            <ul className="space-y-3">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-center text-sm text-gray-700">
                                        <i className="fa-solid fa-check text-green-500 mr-2"></i>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <button
                                className="w-full py-2 px-4 rounded-full font-semibold bg-rose-600 text-white hover:bg-rose-700"
                                onClick={() => handleSelectPlan(plan)}
                            >
                                Select Plan
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedPlan && (
                <div className='flex items-center justify-center space-x-4 bg-red-50 p-8 mt-12 rounded-lg border border-rose-200'>
                    <div className='w-full'>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>
                        <div className="bg-white border border-rose-200 p-7 rounded-lg">
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="font-medium">Plan</span>
                                    <span>{selectedPlan.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Proposals</span>
                                    <span>{selectedPlan.proposals} Proposals</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-4">
                                    <span>Total Amount</span>
                                    <span>Rs. {selectedPlan.price}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Select Payment Method</h3>
                        <div className="grid gap-6 bg-white rounded-lg border border-rose-200 px-4 py-2">
                            <div 
                                className="p-4 border rounded-lg transition-all border-gray-50 hover:border-rose-200 cursor-pointer"
                                onClick={() => setShowBankModal(true)}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0 text-gray-600">
                                        <i className="fa-solid fa-building-columns text-xl"></i>
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="text-sm font-semibold text-gray-900">Direct Bank Transfer</h4>
                                        <p className="text-gray-600 text-xs">Transfer directly to our bank account</p>
                                    </div>
                                </div>
                            </div>

                            <div 
                                className="p-4 border rounded-lg transition-all border-gray-50 hover:border-rose-200 cursor-pointer"
                                onClick={() => setShowWalletModal(true)}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0 text-gray-600">
                                        <i className="fa-solid fa-wallet text-xl"></i>
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="text-sm font-semibold text-gray-900">E-Wallet</h4>
                                        <p className="text-gray-600 text-xs">Pay using your preferred e-wallet</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bank Details Modal */}
            <Modal isOpen={showBankModal} onClose={() => setShowBankModal(false)}>
                <h2 className="text-xl font-bold mb-6">Bank Account Details</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="font-semibold">Bank Name:</div>
                        <div>{bankDetails.bankName}</div>
                        <div className="font-semibold">Account Title:</div>
                        <div>{bankDetails.accountTitle}</div>
                        <div className="font-semibold">Account Number:</div>
                        <div>{bankDetails.accountNumber}</div>
                        <div className="font-semibold">Branch Code:</div>
                        <div>{bankDetails.branchCode}</div>
                        <div className="font-semibold">IBAN:</div>
                        <div className="break-all">{bankDetails.iban}</div>
                    </div>
                </div>
            </Modal>

            {/* E-Wallet Modal */}
            <Modal isOpen={showWalletModal} onClose={() => setShowWalletModal(false)}>
                <h2 className="text-xl font-bold mb-6">E-Wallet Payment Details</h2>
                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-4">JazzCash</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="font-semibold">Account Name:</div>
                            <div>{walletDetails.jazzCash.accountName}</div>
                            <div className="font-semibold">Account Number:</div>
                            <div>{walletDetails.jazzCash.accountNumber}</div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-4">EasyPaisa</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="font-semibold">Account Name:</div>
                            <div>{walletDetails.easyPaisa.accountName}</div>
                            <div className="font-semibold">Account Number:</div>
                            <div>{walletDetails.easyPaisa.accountNumber}</div>
                        </div>
                    </div>
                </div>
            </Modal>

            <div className='bg-rose-100 border border-rose-200 px-4 py-2 mt-4 rounded-full'>
                <p className="text-gray-600 text-xs text-center font-bold">
                    After Payment, send screenshot to you the this number <span className='text-red-600'>0323242321</span> for verification
                </p>
            </div>

            <button
                className='mt-6 bg-rose-600 w-full text-center rounded-full py-2 text-white font-semibold'
                onClick={handleVerifyPayment}
            >
                Click here to verify your Payment
            </button>
        </div>
    );
}

export default PricingPage;