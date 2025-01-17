import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/data";
import { useUser } from "@clerk/clerk-react";
import male from "../../assets/male.png";
import female from "../../assets/female.png";

const FilteredProposals = () => {
  const { user } = useUser();
  const { authURL } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
        profiles.map((p) => (nestedField ? p[field]?.[nestedField] : p[field]))
      ),
    ].filter(Boolean);
  };

  // Fetch user's proposal to check client type
  useEffect(() => {
    const fetchProposal = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${authURL}/get-proposal-by-email?email=${user.primaryEmailAddress.emailAddress}`,
          {
            headers: {
              "x-api-key": "Imran@ME",
            },
          }
        );
        const data = await response.json();
        setProposal(data.proposal);
        // Set access based on client type
        setHasAccess(data.proposal?.clientType?.toLowerCase() !== "basic");
      } catch (error) {
        console.error("Error fetching proposal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [authURL, user.primaryEmailAddress.emailAddress]);

  // Fetch all profiles
  const fetchProfiles = async () => {
    try {
      const response = await fetch(`${authURL}/get-proposals`, {
        headers: {
          "x-api-key": "Imran@ME",
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setProfiles(data.proposals || []);
    } catch (error) {
      console.error("Failed to fetch profiles:", error);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearAllFilters = () => {
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
  };

  // Filter profiles based on search and filters
  const filteredProfiles = profiles.filter((profile) => {
    // Search filter
    const searchMatch =
      !searchTerm ||
      profile.personalInfo?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      profile.code?.toLowerCase().includes(searchTerm.toLowerCase());

    // Other filters (only applied if user has access)
    const filterMatches =
      !hasAccess ||
      Object.entries(filters).every(([key, value]) => {
        if (!value) return true;

        switch (key) {
          case "maritalStatus":
            return (
              profile.personalInfo?.maritalStatus?.toLowerCase() ===
              value.toLowerCase()
            );
          case "qualification":
            return (
              profile.educationalDetails?.qualification?.toLowerCase() ===
              value.toLowerCase()
            );
          case "designation":
            return (
              profile.professionalDetails?.designation?.toLowerCase() ===
              value.toLowerCase()
            );
          case "religion":
            return (
              profile.religion?.religion?.toLowerCase() === value.toLowerCase()
            );
          case "nationality":
            return (
              profile.residenceDetails?.nationality?.toLowerCase() ===
              value.toLowerCase()
            );
          case "caste":
            return (
              profile.religion?.caste?.toLowerCase() === value.toLowerCase()
            );
          case "sect":
            return (
              profile.religion?.sect?.toLowerCase() === value.toLowerCase()
            );
          default:
            return true;
        }
      });

    return searchMatch && filterMatches;
  });

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

        {/* Filters (only visible to non-basic users)
        {hasAccess && (
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
              <select
                value={filters.maritalStatus}
                onChange={(e) =>
                  handleFilterChange("maritalStatus", e.target.value)
                }
                className="p-2 border rounded-lg w-full outline-none"
              >
                <option value="">Marital Status</option>
                {getUniqueValues("personalInfo", "maritalStatus").map(
                  (status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  )
                )}
              </select>

              <select
                value={filters.qualification}
                onChange={(e) =>
                  handleFilterChange("qualification", e.target.value)
                }
                className="p-2 border rounded-lg w-full outline-none"
              >
                <option value="">Qualification</option>
                {getUniqueValues("educationalDetails", "qualification").map(
                  (qual) => (
                    <option key={qual} value={qual}>
                      {qual}
                    </option>
                  )
                )}
              </select>

              <select
                value={filters.designation}
                onChange={(e) =>
                  handleFilterChange("designation", e.target.value)
                }
                className="p-2 border rounded-lg w-full outline-none"
              >
                <option value="">Designation</option>
                {getUniqueValues("professionalDetails", "designation").map(
                  (desig) => (
                    <option key={desig} value={desig}>
                      {desig}
                    </option>
                  )
                )}
              </select>

              <select
                value={filters.religion}
                onChange={(e) => handleFilterChange("religion", e.target.value)}
                className="p-2 border rounded-lg w-full outline-none"
              >
                <option value="">Religion</option>
                {getUniqueValues("religion", "religion").map((rel) => (
                  <option key={rel} value={rel}>
                    {rel}
                  </option>
                ))}
              </select>

              <select
                value={filters.nationality}
                onChange={(e) =>
                  handleFilterChange("nationality", e.target.value)
                }
                className="p-2 border rounded-lg w-full outline-none"
              >
                <option value="">Nationality</option>
                {getUniqueValues("residenceDetails", "nationality").map(
                  (nat) => (
                    <option key={nat} value={nat}>
                      {nat}
                    </option>
                  )
                )}
              </select>

              <select
                value={filters.caste}
                onChange={(e) => handleFilterChange("caste", e.target.value)}
                className="p-2 border rounded-lg w-full outline-none"
              >
                <option value="">Caste</option>
                {getUniqueValues("religion", "caste").map((caste) => (
                  <option key={caste} value={caste}>
                    {caste}
                  </option>
                ))}
              </select>

              <select
                value={filters.sect}
                onChange={(e) => handleFilterChange("sect", e.target.value)}
                className="p-2 border rounded-lg w-full outline-none"
              >
                <option value="">Sect</option>
                {getUniqueValues("religion", "sect").map((sect) => (
                  <option key={sect} value={sect}>
                    {sect}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div> */}

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {filteredProfiles.map((profile, index) => (
            <div
              key={index}
              className="h-full w-full bg-red-200 rounded-lg flex flex-col items-center justify-center space-y-3 p-6"
            >
              <img
                src={profile.personalInfo?.gender === "male" ? male : female}
                alt="image not available"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full"
              />
              <h1 className="font-bold text-lg sm:text-xl italicFont text-center">
                {profile.personalInfo?.name}
              </h1>
              <h1 className="tracking-wider text-center">
                {profile.educationalDetails?.qualification} |{" "}
                {profile.personalInfo?.age} |{" "}
                {profile.personalInfo?.maritalStatus} |{" "}
                {profile.religion?.religion}
              </h1>
              <h1 className="tracking-wider text-xs text-center">
                {profile.code}
              </h1>
              <Link
                to="/register"
                className="py-2 px-4 bg-red-950 text-white rounded-full text-sm hover:bg-red-900 transition-colors"
              >
                Connect Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilteredProposals;
