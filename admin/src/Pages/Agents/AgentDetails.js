import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/data";

function AgentDetails() {
  const navigate = useNavigate();
  const { agentCode } = useParams();
  const [proposals, setProposals] = useState([]);
  const [agentData, setAgentData] = useState(null);
  const { authURL } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalProposals, setTotalProposals] = useState(0);

  const fetchProposals = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${authURL}/get-proposal-by-agent?agentCode=${agentCode}&page=${page}`,
        {
          headers: {
            "x-api-key": "Imran@ME",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      
      if (data.proposal && Array.isArray(data.proposal)) {
        setProposals(data.proposal);
        setTotalPages(data.totalPages || 1);
        setTotalProposals(data.total || 0);
      } else if (data.proposal && !Array.isArray(data.proposal)) {
        setProposals([data.proposal]);
        setTotalPages(1);
        setTotalProposals(1);
      }
    } catch (error) {
      console.error("Failed to fetch proposals:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgentData = async () => {
    try {
      const response = await fetch(
        `${authURL}/get-agent?agentCode=${agentCode}`,
        {
          headers: {
            "x-api-key": "Imran@ME",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setAgentData(data);
    } catch (error) {
      console.error("Failed to fetch agent data:", error);
    }
  };

  const handleCardClick = (agentCode, proposalCode) => {
    navigate(`/dashboard/agents/${agentCode}/${proposalCode}`);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchProposals(newPage);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (agentCode) {
      fetchProposals(1);
      fetchAgentData();
    }
  }, [agentCode]);

  return (
    <div className="border-2 border-rose-200 p-12 bg-white min-h-screen">
      <div className="flex flex-col gap-12">
        <div className="flex items-end justify-between">
          <h1 className="text-6xl font-bold text-rose-900">Agent Details</h1>
          <button
            className="py-2 px-4 bg-red-950 text-white rounded-full hover:bg-red-900 transition-colors"
            onClick={() => fetchProposals(currentPage)}
          >
            <i className="fas fa-sync-alt mr-2"></i>
            Refresh
          </button>
        </div>

        {agentData && (
          <div className="bg-gradient-to-r from-rose-50 to-white">
            <div className="p-6 border-2 border-rose-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-id-badge text-rose-500 text-xl"></i>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Agent Code</p>
                    <p className="text-sm font-bold text-gray-700">{agentData.agentCode}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="fas fa-user text-rose-500 text-xl"></i>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Name</p>
                    <p className="text-sm font-bold text-gray-700">{agentData.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="fas fa-file-contract text-rose-500 text-xl"></i>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Total Proposals</p>
                    <p className="text-sm font-bold text-gray-700">{totalProposals}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="fas fa-circle-check text-rose-500 text-xl"></i>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Status</p>
                    <p className="text-sm font-bold text-gray-700">{agentData.status}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="fas fa-user-tag text-rose-500 text-xl"></i>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Agent Type</p>
                    <p className="text-sm font-bold text-gray-700">{agentData.agentType}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="fas fa-chart-line text-rose-500 text-xl"></i>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Proposal Limit</p>
                    <p className="text-sm font-bold text-gray-700">{agentData.proposalLimit}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="w-full h-96 flex items-center justify-center">
            <i className="fas fa-spinner fa-spin text-4xl text-rose-900"></i>
          </div>
        ) : (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <p className="text-rose-900 text-sm">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalProposals)} of {totalProposals} proposals
              </p>
              <p className="text-rose-900 text-xs text-end mb-2 font-bold">
                Click on refresh to see the updated changes
              </p>
            </div>

            <div className="w-full grid grid-cols-3 gap-8">
              {proposals.length > 0 ? (
                proposals.map((proposal) => (
                  <div
                    key={proposal._id}
                    onClick={() => handleCardClick(agentCode, proposal.proposalCode)}
                    className="bg-red-50 w-72 h-72 border-red-200 border flex items-center justify-center space-y-2 flex-col cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={proposal.personalInfo?.image?.[0] || "/api/placeholder/128/128"}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                    <div className="text-center px-4">
                      <h1 className="text-xs font-semibold">{proposal.proposalCode}</h1>
                      <h1 className="font-bold">{proposal.personalInfo?.name}</h1>
                      <h1 className="text-sm font-semibold capitalize">
                        {proposal.personalInfo?.maritalStatus} || {proposal.educationalDetails?.qualification} || {proposal.professionalDetails?.profession}
                      </h1>
                      <p className="text-xs text-gray-600">
                        Agent: {proposal.agentAssigned?.[0]?.agentCode || 'N/A'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-lg text-gray-500">
                  No proposals available.
                </p>
              )}
            </div>

            {proposals.length > 0 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-rose-100 text-rose-900 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-rose-200 text-rose-900 rounded-lg">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-rose-100 text-rose-900 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AgentDetails;