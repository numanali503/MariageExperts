import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/data';

function Track() {
    const { authURL } = useAuth();
    const [proposalCode, setProposalCode] = useState('');
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(false);
    const [newStep, setNewStep] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (proposal && proposal.agentAssigned) {
            const localAgentCode = localStorage.getItem('agentCode');
            const authorized = proposal.agentAssigned.some(agent => agent.agentCode === localAgentCode);
            setIsAuthorized(authorized);
        }
    }, [proposal]);

    const fetchProposal = async () => {
        if (!proposalCode) return;
        setLoading(true);
        try {
            const response = await fetch(`${authURL}/get-proposal-by-code?proposalCode=${proposalCode}`, {
                headers: {
                    'x-api-key': 'Imran@ME',
                },
            });
            const data = await response.json();
            setProposal(data.proposal);
        } catch (error) {
            console.error('Error fetching proposal:', error);
        } finally {
            setLoading(false);
        }
    };

    const addTimelineStep = async () => {
        if (!newStep || !proposalCode) return;

        try {
            const response = await fetch(`${authURL}/update-proposal-timeline?proposalCode=${proposalCode}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'Imran@ME',
                },
                body: JSON.stringify({
                    timeline: [...proposal.timeline, { step: newStep, timestamp: new Date() }]
                })
            });

            if (response.ok) {
                const data = await response.json();
                setProposal(data.proposal);
                setNewStep('');
            }
        } catch (error) {
            console.error('Error adding timeline step:', error);
        }
    };

    const getStatusColor = (status) => {
        const statusColors = {
            'active': 'bg-green-100 text-green-800',
            'pending': 'bg-yellow-100 text-yellow-800',
            'rejected': 'bg-red-100 text-red-800',
            'completed': 'bg-blue-100 text-blue-800'
        };
        return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-4xl font-bold text-rose-900 mb-8">Track Proposals</h1>

            {/* Search Bar */}
            <div className="flex items-center gap-4 mb-8">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Enter Proposal Code - PR123"
                        value={proposalCode}
                        onChange={(e) => setProposalCode(e.target.value)}
                        className="w-full py-3 px-4 pl-12 rounded-lg border border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                    />
                    <svg className="absolute left-4 top-3.5 text-rose-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <button
                    onClick={fetchProposal}
                    className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2"
                >
                    Track
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-200 border-t-rose-600"></div>
                </div>
            ) : proposal ? (
                <div className="space-y-8">
                    {/* Proposal Details Card */}
                    <div className="bg-white rounded-lg border border-rose-200 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Proposal Details</h3>
                                <p className="mt-2 text-lg font-semibold text-gray-900">{proposal.proposalCode}</p>
                                <p className="mt-1 text-gray-600">{proposal.personalInfo.name}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Status & Type</h3>
                                <div className="mt-2 space-y-1">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                                        {proposal.status}
                                    </span>
                                    <p className="text-gray-600">Client Type: {proposal.clientType}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Assigned Agents</h3>
                                <div className="mt-2">
                                    {proposal.agentAssigned.map((agent, index) => (
                                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 mr-2">
                                            {agent.agentCode}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Section */}
                    {isAuthorized && (
                        <div className="flex gap-2 mb-6">
                            <input
                                type="text"
                                value={newStep}
                                onChange={(e) => setNewStep(e.target.value)}
                                placeholder="Enter new timeline step"
                                className="flex-1 py-2 px-4 rounded-lg border border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none"
                            />
                            <button
                                onClick={addTimelineStep}
                                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                            >
                                Add Step
                            </button>
                        </div>
                    )}

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-rose-200"></div>

                        {/* Timeline Items */}
                        {proposal.timeline.map((item, index) => (
                            <div key={index} className="relative flex items-start mb-8 last:mb-0">
                                {/* Timeline Dot */}
                                <div className="absolute left-8 -translate-x-1/2 w-4 h-4 bg-rose-600 rounded-full border-4 border-white"></div>

                                {/* Timeline Content */}
                                <div className="ml-12 bg-white p-4 rounded-lg shadow-sm border border-rose-100 w-full">
                                    <div className="font-medium text-rose-900">{item.step}</div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {new Date(item.timestamp).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default Track;