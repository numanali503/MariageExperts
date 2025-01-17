import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/data";
import { useNavigate } from "react-router-dom";

const ProposalsPage = () => {
  const navigate = useNavigate();
  const { authURL } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    maritalStatus: "",
    qualification: "",
    profession: "",
    religion: "",
    nationality: "",
    status: "",
  });

  const ITEMS_PER_PAGE = 12;

  // Extract unique values for LOVs
  const getUniqueValues = (field, nestedField = null) => {
    return [...new Set(proposals.map(p =>
      nestedField
        ? p[field]?.[nestedField]
        : p[field]
    ))].filter(Boolean);
  };

  const fetchProposals = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`${authURL}/get-proposals?page=${page}&limit=${ITEMS_PER_PAGE}`, {
        headers: {
          "x-api-key": "Imran@ME",
        },
      });
      
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      
      const data = await response.json();
      setProposals(data.proposals || []);
      setTotalCount(data.total || 0);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch proposals:", error);
      setLoading(false);
    }
  };

  const handlePageChange = async (newPage) => {
    setCurrentPage(newPage);
    await fetchProposals(newPage);
    window.scrollTo(0, 0);
  };

  const handleCardClick = (code) => {
    navigate(`/dashboard/proposals/${code}`);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    fetchProposals(1);
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
    setCurrentPage(1);
    fetchProposals(1);
  };

  const getFilteredProposals = () => {
    return proposals.filter((proposal) => {
      const searchMatch = !searchTerm || (
        proposal.personalInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.proposalCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.agentAssigned?.some(agent =>
          agent.agentCode?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      const filterMatches = Object.entries(filters).every(([key, value]) => {
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
  };

  useEffect(() => {
    fetchProposals(1);
  }, []);

  const filteredProposals = getFilteredProposals();
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="border-2 border-rose-200 p-12 bg-white min-h-screen">
      <div className="flex flex-col gap-12">
        <div className="flex items-end justify-between">
          <h1 className="text-6xl font-bold text-rose-900">Proposals List</h1>
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
              onClick={() => fetchProposals(currentPage)}
            >
              <i className="fas fa-sync-alt mr-2"></i>
              Refresh
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-6">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by Name, Proposal Code, or Agent Code"
              className="w-full pl-10 pr-4 py-2 border border-rose-200 rounded-lg focus:outline-rose-300"
            />
          </div>

          {/* LOV Filters */}
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
        </div>
      </div>

      {/* Proposals Display */}
      {loading ? (
        <div className="w-full h-96 flex items-center justify-center">
          <i className="fas fa-spinner fa-spin text-4xl text-rose-900"></i>
        </div>
      ) : (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <p className="text-rose-900 text-xs font-bold">
              Click on refresh to see the updated changes
            </p>
          </div>

          <div className="w-full grid grid-cols-3 gap-8">
            {filteredProposals.map((proposal) => (
              <div
                key={proposal._id}
                onClick={() => handleCardClick(proposal.proposalCode)}
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
            ))}
          </div>
          {/* Pagination Controls */}
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
        </div>
      )}
    </div>
  );
};

export default ProposalsPage;