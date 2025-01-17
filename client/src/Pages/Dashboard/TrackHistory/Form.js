import React, { useState } from "react";
import { useAuth } from "../../../context/data";

function Track() {
  const { authURL } = useAuth();
  const [proposalCode, setProposalCode] = useState("");
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newStep, setNewStep] = useState("");

  const fetchProposal = async () => {
    if (!proposalCode) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${authURL}/get-proposal-by-code?proposalCode=${proposalCode}`,
        {
          headers: {
            "x-api-key": "Imran@ME",
          },
        }
      );
      const data = await response.json();
      setProposal(data.proposal);
    } catch (error) {
      console.error("Error fetching proposal:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      Pending: "bg-yellow-100 text-yellow-800",
      Approved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
      "In Progress": "bg-blue-100 text-blue-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white  overflow-hidden p-8 border-2 border-rose-200">
      {/* Header */}
      <h1 className="text-4xl font-bold text-rose-900">Track Proposals</h1>

      {/* Content */}
      <div className="p-6">
        {/* Search Section */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter Proposal Code - PR123"
              value={proposalCode}
              onChange={(e) => setProposalCode(e.target.value)}
              className="w-full py-3 px-4 pl-12 rounded-lg border border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
            />
            <svg
              className="absolute left-4 top-3.5 text-rose-400 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            onClick={fetchProposal}
            className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Track
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-200 border-t-rose-600"></div>
          </div>
        ) : proposal ? (
          <div className="space-y-6">
            {/* Proposal Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-rose-900 mb-2">
                  Proposal {proposal.proposalCode}
                </h2>
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                    proposal.status
                  )}`}
                >
                  {proposal.status}
                </span>
              </div>
              <div className="text-right space-y-2">
                <div className="flex items-center justify-end gap-2 text-gray-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span>{proposal.clientType}</span>
                </div>
              </div>
            </div>

            {/* Agents Section */}
            {proposal.agentAssigned?.length > 0 && (
              <div className="bg-rose-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-rose-900 mb-3 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Assigned Agents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {proposal.agentAssigned.map((agent, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-white p-3 rounded-md border border-rose-100"
                    >
                      <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-rose-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {agent.agentCode}
                        </div>
                        {agent.role && (
                          <div className="text-sm text-gray-600">
                            {agent.role}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline Section */}
            <div className="relative">
              {/* Timeline Display */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-rose-200"></div>
              {proposal.timeline.map((item, index) => (
                <div key={index} className="relative pl-12 pb-8 last:pb-0">
                  <div className="absolute left-0 w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                    <i class="fa-solid fa-check text-rose-950"></i>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-rose-100">
                    <div className="font-medium text-rose-900">{item.step}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(item.timestamp).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          proposalCode && <div className="text-center py-8 text-gray-500"></div>
        )}
      </div>
    </div>
  );
}

export default Track;
