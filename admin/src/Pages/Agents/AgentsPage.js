import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/data";

function AgentsPage() {
  const { authURL } = useAuth();
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${authURL}/get-all-agents`, {
        headers: {
          "x-api-key": "Imran@ME",
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setAgents(data);
      setFilteredAgents(data);
    } catch (error) {
      console.error("Failed to fetch agents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    let result = agents;

    if (searchTerm) {
      result = result.filter((agent) => {
        const fullName = (agent.fullName || "").toLowerCase();
        const agentCode = (agent.agentCode || "").toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        return (
          fullName.includes(searchLower) || agentCode.includes(searchLower)
        );
      });
    }

    if (statusFilter !== "all") {
      result = result.filter((agent) => agent.status === statusFilter);
    }

    if (typeFilter !== "all") {
      result = result.filter((agent) => agent.agentType === typeFilter);
    }

    if (locationFilter) {
      result = result.filter((agent) => {
        const location = `${agent.city || ""} ${agent.area || ""} ${
          agent.country || ""
        }`.toLowerCase();
        return location.includes(locationFilter.toLowerCase());
      });
    }

    setFilteredAgents(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, typeFilter, locationFilter, agents]);

  const handleStatusChange = async (agentCode, field, value) => {
    try {
      const response = await fetch(
        `${authURL}/update-agent-status?agentCode=${agentCode}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "Imran@ME",
          },
          body: JSON.stringify({ [field]: value }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      setAgents((prevAgents) =>
        prevAgents.map((agent) =>
          agent.agentCode === agentCode ? { ...agent, [field]: value } : agent
        )
      );
    } catch (error) {
      console.error("Error updating agent status:", error);
    }
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAgents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);

  // Pagination controls
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="border-2 border-rose-200 p-12 bg-white">
      <div className="flex items-end justify-between mb-6">
        <h1 className="text-6xl font-bold text-rose-900">Agents List</h1>
        <button
          onClick={fetchAgents}
          className="py-2 px-4 bg-red-950 text-white rounded-full"
        >
          Refresh
        </button>
      </div>

      {/* Filters Section */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-rose-200 focus:outline-rose-300 flex-1"
        />

        <input
          type="text"
          placeholder="Search by location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="px-4 py-2 border border-rose-200 focus:outline-rose-300"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-rose-200 focus:outline-rose-300"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-rose-200 focus:outline-rose-300"
        >
          <option value="all">All Agent Types</option>
          <option value="basic">Basic</option>
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      <div className="w-full mt-2">
        {loading ? (
          <div className="w-full h-96 flex items-center justify-center">
            <i className="fas fa-spinner fa-spin text-4xl text-rose-900"></i>
          </div>
        ) : (
          <>
            <div className="overflow-hidden">
              <p className="text-rose-900 text-xs text-end mb-2 font-bold">
                Click on refresh to see the updated changes
              </p>
              <table
                className="w-full text-left border border-collapse rounded xs:border-separate border-slate-200 "
                cellSpacing="0"
              >
                <thead>
                  <tr>
                    <th className="h-12 px-6 text-xs font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-rose-100">
                      Image
                    </th>
                    <th className="h-12 px-6 text-xs font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-rose-100">
                      Code
                    </th>
                    <th className="h-12 px-6 text-xs font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-rose-100">
                      Name
                    </th>
                    <th className="h-12 px-6 text-xs font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-rose-100">
                      Phone / WhatsApp
                    </th>
                    <th className="h-12 px-6 text-xs font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-rose-100">
                      Location
                    </th>
                    <th className="h-12 px-6 text-xs font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-rose-100">
                      Proposal Assigned
                    </th>
                    <th className="h-12 px-6 text-xs font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-rose-100">
                      Agent Type
                    </th>
                    <th className="h-12 px-6 text-xs font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-rose-100">
                      Current Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((agent, index) => (
                      <tr key={index}>
                        <td className="h-12 text-xs transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500">
                          <img
                            src={agent.image}
                            alt={agent.name}
                            className="w-12 h-12 rounded-full"
                          />
                        </td>
                        <td className="h-12 px-6 text-xs transition uppercase duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500">
                          {agent.agentCode || ""}
                        </td>
                        <td className="h-12 px-6 text-xs transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500">
                          {agent.fullName || ""}
                        </td>
                        <td className="h-12 px-6 text-xs transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500">
                          {agent.phone || ""}
                        </td>
                        <td className="h-12 px-6 text-xs transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500">
                          {agent.city || ""}, {agent.area || ""},{" "}
                          {agent.country || ""}
                        </td>
                        <td className="h-12 px-6 text-xs transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500">
                          {agent.registeredProposals ? (
                            <Link
                              to={`/dashboard/agents/${agent.agentCode}`}
                              className="bg-red-950 px-4 py-1 rounded-full text-white"
                            >
                              (
                              {Array.isArray(agent.registeredProposals)
                                ? agent.registeredProposals.length
                                : agent.registeredProposals}
                              )
                            </Link>
                          ) : (
                            "No Proposals Assigned"
                          )}
                        </td>
                        <td className="h-12 px-6 text-xs capitalize transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500">
                          {agent.agentType || ""}
                        </td>
                        <td className="h-12 px-6 text-xs capitalize transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500">
                          <select
                            value={agent.status}
                            onChange={(event) =>
                              handleStatusChange(
                                agent.agentCode,
                                "status",
                                event.target.value
                              )
                            }
                            className="border rounded px-2 py-1"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">Pending</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="h-12 px-6 text-center text-xs transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500"
                      >
                        No agents found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredAgents.length > 0 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-rose-100 text-rose-900 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded bg-rose-100 text-rose-900 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AgentsPage;