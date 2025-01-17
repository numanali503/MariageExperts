import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/data";
import { useNavigate } from "react-router-dom";

function ProposalsPage() {
  const navigate = useNavigate();
  const { authURL } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [agentType, setAgentType] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    maritalStatus: "",
    qualification: "",
    profession: "",
    religion: "",
    nationality: "",
    status: "",
  });

  // Extract unique values for LOVs
  const getUniqueValues = (field, nestedField = null) => {
    return [...new Set(proposals.map(p => 
      nestedField 
        ? p[field]?.[nestedField] 
        : p[field]
    ))].filter(Boolean);
  };

  const fetchAgentDetails = async (code) => {
    try {
      const response = await fetch(
        `${authURL}/get-agentType?agentCode=${code}`,
        {
          headers: {
            "x-api-key": "Imran@ME",
          },
        }
      );
      
      if (response.status === 412) {
        setHasAccess(false);
        return;
      }
      
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      
      const data = await response.json();
      setAgentType(data.agentType?.toLowerCase() || "");
      setPaymentStatus(data.paymentStatus?.toLowerCase() || "");
      setHasAccess((data.agentType?.toLowerCase() === "standard" || 
                    data.agentType?.toLowerCase() === "premium") && 
                    data.paymentStatus?.toLowerCase() === "paid");
    } catch (error) {
      console.error("Failed to fetch agent details:", error);
      setHasAccess(false);
    }
  };

  // Check if agent should have access to filters
  const hasFilterAccess = () => {
    return hasAccess;
  };

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const code = localStorage.getItem("agentCode");
      await fetchAgentDetails(code);

      const response = await fetch(
        `${authURL}/get-proposal-by-agent?agentCode=${code}`,
        {
          headers: {
            "x-api-key": "Imran@ME",
          },
        }
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();

      let proposalsArray = [];
      if (data.proposal && Array.isArray(data.proposal)) {
        proposalsArray = data.proposal;
      } else if (data.proposal && !Array.isArray(data.proposal)) {
        proposalsArray = [data.proposal];
      }
      setProposals(proposalsArray);
      setFilteredProposals(proposalsArray);
    } catch (error) {
      console.error("Failed to fetch proposals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (code) => {
    navigate(`/dashboard/proposals/${code}`);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    filterProposals(value, filters);
  };

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    filterProposals(searchTerm, newFilters);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilters({
      maritalStatus: "",
      qualification: "",
      profession: "",
      religion: "",
      nationality: "",
      status: "",
    });
    setFilteredProposals(proposals);
  };

  const filterProposals = (search, currentFilters) => {
    const filtered = proposals.filter((proposal) => {
      // Combined search for name and proposal code
      const searchMatch = search.toLowerCase() === '' || (
        proposal.personalInfo?.name?.toLowerCase().includes(search.toLowerCase()) ||
        proposal.proposalCode?.toLowerCase().includes(search.toLowerCase())
      );

      // Filter matches (only applied for paid standard/premium agents)
      const filterMatches = !hasFilterAccess() || Object.entries(currentFilters).every(([key, value]) => {
        if (!value) return true;
        
        switch (key) {
          case 'maritalStatus':
            return proposal.personalInfo?.maritalStatus?.toLowerCase() === value.toLowerCase();
          case 'qualification':
            return proposal.educationalDetails?.qualification?.toLowerCase() === value.toLowerCase();
          case 'profession':
            return proposal.professionalDetails?.profession?.toLowerCase() === value.toLowerCase();
          case 'religion':
            return proposal.religion?.religion?.toLowerCase() === value.toLowerCase();
          case 'nationality':
            return proposal.residenceDetails?.nationality?.toLowerCase() === value.toLowerCase();
          case 'status':
            return proposal.status?.toLowerCase() === value.toLowerCase();
          default:
            return true;
        }
      });

      return searchMatch && filterMatches;
    });

    setFilteredProposals(filtered);
  };

  useEffect(() => {
    fetchProposals();
  }, [authURL]);

  return (
    <div className="border-2 border-rose-200 p-12 bg-white">
      <div className="flex flex-col gap-12">
        <div className="flex items-end justify-between">
          <h1 className="text-6xl font-bold text-rose-900">Assigned Proposals List</h1>
          {hasFilterAccess() && (
            <div className="flex gap-4">
              <button
                className="py-2 px-4 bg-rose-100 text-rose-900 rounded-full hover:bg-rose-200 transition-colors"
                onClick={clearAllFilters}
              >
                <i className="fas fa-times-circle mr-2"></i>
                Clear Filters
              </button>
              <button
                className="py-2 px-4 bg-red-950 text-white rounded-full hover:bg-red-900 transition-colors"
                onClick={fetchProposals}
              >
                <i className="fas fa-sync-alt mr-2"></i>
                Refresh
              </button>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="space-y-6">
          {/* Search Field (visible to all agent types) */}
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by Name or Proposal Code"
              className="w-full pl-10 pr-4 py-2 border border-rose-200 rounded-lg focus:outline-rose-300"
            />
          </div>

          {/* LOV Filters (only visible to paid standard and premium agents) */}
          {hasFilterAccess() && (
            <div className="flex flex-wrap gap-4">
              <select
                value={filters.maritalStatus}
                onChange={(e) => handleFilterChange('maritalStatus', e.target.value)}
                className="border border-rose-200 p-2 rounded-lg focus:outline-rose-300"
              >
                <option value="">Select Marital Status</option>
                {getUniqueValues('personalInfo', 'maritalStatus').map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <select
                value={filters.qualification}
                onChange={(e) => handleFilterChange('qualification', e.target.value)}
                className="border border-rose-200 p-2 rounded-lg focus:outline-rose-300"
              >
                <option value="">Select Qualification</option>
                {getUniqueValues('educationalDetails', 'qualification').map(qual => (
                  <option key={qual} value={qual}>{qual}</option>
                ))}
              </select>

              <select
                value={filters.profession}
                onChange={(e) => handleFilterChange('profession', e.target.value)}
                className="border border-rose-200 p-2 rounded-lg focus:outline-rose-300"
              >
                <option value="">Select Profession</option>
                {getUniqueValues('professionalDetails', 'profession').map(prof => (
                  <option key={prof} value={prof}>{prof}</option>
                ))}
              </select>

              <select
                value={filters.religion}
                onChange={(e) => handleFilterChange('religion', e.target.value)}
                className="border border-rose-200 p-2 rounded-lg focus:outline-rose-300"
              >
                <option value="">Select Religion</option>
                {getUniqueValues('religion', 'religion').map(rel => (
                  <option key={rel} value={rel}>{rel}</option>
                ))}
              </select>

              <select
                value={filters.nationality}
                onChange={(e) => handleFilterChange('nationality', e.target.value)}
                className="border border-rose-200 p-2 rounded-lg focus:outline-rose-300"
              >
                <option value="">Select Nationality</option>
                {getUniqueValues('residenceDetails', 'nationality').map(nat => (
                  <option key={nat} value={nat}>{nat}</option>
                ))}
              </select>

              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="border border-rose-200 p-2 rounded-lg focus:outline-rose-300"
              >
                <option value="">Select Status</option>
                {getUniqueValues('status').map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Proposals List with Loading State */}
      {loading ? (
        <div className="w-full h-96 flex items-center justify-center">
          <i className="fas fa-spinner fa-spin text-4xl text-rose-900"></i>
        </div>
      ) : (
        <div className="w-full mt-12 grid grid-cols-3 gap-x-8 gap-y-8">
          {filteredProposals.map((proposal) => (
            <div
              key={proposal._id}
              onClick={() => handleCardClick(proposal.proposalCode)}
              className="bg-red-50 w-72 h-72 border-red-200 border flex items-center justify-center space-y-2 flex-col cursor-pointer hover:shadow-lg transition-shadow"
            >
              <img
                src={proposal.personalInfo?.image[0] || "/api/placeholder/128/128"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
              <div className="text-center px-4">
                <h1 className="text-xs font-semibold">{proposal.proposalCode}</h1>
                <h1 className="font-bold">{proposal.personalInfo?.name}</h1>
                <h1 className="text-sm font-semibold capitalize">
                  {proposal.personalInfo?.maritalStatus} || {proposal.educationalDetails?.qualification} || {proposal.professionalDetails?.profession}
                </h1>
                <h1 className="text-xs font-semibold text-rose-950 capitalize">
                  {proposal.clientType} || {proposal.residenceDetails?.nationality}
                </h1>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProposalsPage;