import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/data";
import male from "../../assets/male.png";
import female from "../../assets/female.png";

function ProposalsPage() {
  const navigate = useNavigate();
  const { authURL } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [agentType, setAgentType] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [filters, setFilters] = useState({
    maritalStatus: "",
    qualification: "",
    designation: "",
    religion: "",
    nationality: "",
    caste: "",
    sect: "",
  });

  // Get unique values for filter options
  const getUniqueValues = (field, nestedField = null) => {
    return [
      ...new Set(
        proposals.map((p) => (nestedField ? p[field]?.[nestedField] : p[field]))
      ),
    ].filter(Boolean);
  };

  const fetchAgentType = async (code) => {
    try {
      const response = await fetch(
        `${authURL}/get-agentType?agentCode=${code}`,
        {
          headers: {
            "x-api-key": "Imran@ME",
          },
        }
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setAgentType(data.agentType?.toLowerCase() || "");
      setPaymentStatus(data.paymentStatus || "");
    } catch (error) {
      console.error("Failed to fetch agent type:", error);
    }
  };

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const code = localStorage.getItem("agentCode");
      await fetchAgentType(code);

      const response = await fetch(`${authURL}/get-proposals`, {
        headers: {
          "x-api-key": "Imran@ME",
        },
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setProposals(data.proposals || []);
      setFilteredProposals(data.proposals || []);
    } catch (error) {
      console.error("Failed to fetch proposals:", error);
    } finally {
      setLoading(false);
    }
  };

  const isPremiumUser = () => {
    return (
      (agentType === "standard" || agentType === "premium") &&
      paymentStatus === "paid"
    );
  };

  const handleCardClick = (code) => {
    if (isPremiumUser()) {
      navigate(`/dashboard/all-proposals-cEXWtfylYF9K3wQ/${code}`);
    } else {
      if (agentType === "basic") {
        alert("This feature is only available for Standard and Premium users");
      } else {
        alert("Please complete your payment to access this feature");
      }
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    filterProposals(value, filters);
  };

  const handleFilterChange = (name, value) => {
    if (!isPremiumUser()) {
      alert("Filters are only available for paid Standard and Premium users");
      return;
    }
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    filterProposals(searchTerm, newFilters);
  };

  const clearAllFilters = () => {
    if (!isPremiumUser()) {
      alert("Filters are only available for paid Standard and Premium users");
      return;
    }
    setSearchTerm("");
    setFilters({
      maritalStatus: "",
      qualification: "",
      designation: "",
      religion: "",
      nationality: "",
      caste: "",
      sect: "",
    });
    setFilteredProposals(proposals);
  };

  const filterProposals = (search, currentFilters) => {
    const filtered = proposals.filter((proposal) => {
      // Search filter
      const searchMatch =
        !search ||
        proposal.personalInfo?.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        proposal.proposalCode?.toLowerCase().includes(search.toLowerCase());

      // Filter matches (only applied for standard/premium agents with paid status)
      const filterMatches =
        !isPremiumUser() ||
        Object.entries(currentFilters).every(([key, value]) => {
          if (!value) return true;

          switch (key) {
            case "maritalStatus":
              return (
                proposal.personalInfo?.maritalStatus?.toLowerCase() ===
                value.toLowerCase()
              );
            case "qualification":
              return (
                proposal.educationalDetails?.qualification?.toLowerCase() ===
                value.toLowerCase()
              );
            case "designation":
              return (
                proposal.professionalDetails?.designation?.toLowerCase() ===
                value.toLowerCase()
              );
            case "religion":
              return (
                proposal.religion?.religion?.toLowerCase() ===
                value.toLowerCase()
              );
            case "nationality":
              return (
                proposal.residenceDetails?.nationality?.toLowerCase() ===
                value.toLowerCase()
              );
            case "caste":
              return (
                proposal.religion?.caste?.toLowerCase() === value.toLowerCase()
              );
            case "sect":
              return (
                proposal.religion?.sect?.toLowerCase() === value.toLowerCase()
              );
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
    <div className="max-w-[85rem] mx-auto px-3 lg:px-0 py-12">
      {/* Search and Filters Section */}
      <div className="space-y-6 mb-8">
        {/* Search Field (visible to all) */}
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by Name or Code"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-red-300"
          />
        </div>

        {/* Filters (only visible to paid non-basic agents) */}
        {isPremiumUser() && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-red-950 text-white rounded-lg hover:bg-red-900"
              >
                Clear Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(filters).map(([key, value]) => (
                <select
                  key={key}
                  value={value}
                  onChange={(e) => handleFilterChange(key, e.target.value)}
                  className="p-2 border rounded-lg w-full outline-none"
                >
                  <option value="">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </option>
                  {getUniqueValues(
                    key === "designation"
                      ? "professionalDetails"
                      : key === "maritalStatus"
                      ? "personalInfo"
                      : key === "qualification"
                      ? "educationalDetails"
                      : key === "nationality"
                      ? "residenceDetails"
                      : "religion",
                    key
                  ).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <i className="fas fa-spinner fa-spin text-4xl text-red-950"></i>
        </div>
      ) : (
        /* Profiles Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {filteredProposals.map((profile, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(profile.proposalCode)}
              className="h-full w-full bg-red-200 rounded-lg flex flex-col items-center justify-center space-y-3 p-6 cursor-pointer"
            >
              {isPremiumUser() ? (
                <img
                  src={
                    profile.personalInfo?.image?.[0] ||
                    "/api/placeholder/128/128"
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <img
                  src={profile.personalInfo?.gender === "male" ? male : female}
                  alt="image not available"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full"
                />
              )}

              <h1 className="font-bold text-lg sm:text-xl italicFont text-center">
                {profile.personalInfo?.name}
              </h1>
              <h1 className="tracking-wider text-center">
                {profile.educationalDetails?.qualification} |{" "}
                {profile.personalInfo?.age} |{" "}
                {profile.personalInfo?.maritalStatus} |{" "}
                {profile.religion?.religion}
              </h1>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProposalsPage;
