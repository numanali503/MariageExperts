import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/data";

const AgentsPayments = () => {
  const { authURL } = useAuth();
  const [agents, setAgents] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [codeFilter, setCodeFilter] = useState("");
  const [planTypeFilter, setPlanTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch agents data
  const fetchAgents = async () => {
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
    } catch (error) {
      console.error("Failed to fetch agents:", error);
    }
  };

  // Function to handle status change
  const handleStatusChange = async (agentCode, field, value) => {
    try {
      const updatedFields = { [field]: value };
      if (field === "paymentStatus" && value.toLowerCase() === "paid") {
        const agent = agents.find((agent) => agent.agentCode === agentCode);
        if (agent) {
          updatedFields.proposalLimit = agent.proposalLimit + 50;
        }
      }

      const response = await fetch(
        `${authURL}/update-agent-status?agentCode=${agentCode}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "Imran@ME",
          },
          body: JSON.stringify(updatedFields),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      setAgents((prevAgents) =>
        prevAgents.map((agent) =>
          agent.agentCode === agentCode ? { ...agent, ...updatedFields } : agent
        )
      );
    } catch (error) {
      console.error("Error updating agent status:", error);
    }
  };

  // Get unique plan types for filter dropdown
  const uniquePlanTypes = [...new Set(agents.map((agent) => agent.agentType))];

  // Filter agents based on all criteria
  const filteredAgents = agents.filter((agent) => {
    const nameMatch = agent.fullName
      .toLowerCase()
      .includes(nameFilter.toLowerCase());
    const codeMatch = agent.agentCode
      .toLowerCase()
      .includes(codeFilter.toLowerCase());
    const planMatch = !planTypeFilter || agent.agentType === planTypeFilter;
    const statusMatch = !statusFilter || agent.paymentStatus === statusFilter;
    return nameMatch && codeMatch && planMatch && statusMatch;
  });

  // Initial fetch when component mounts
  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div className="border-2 border-rose-200 p-12 bg-white">
      <div className="flex items-end justify-between">
        <h1 className="text-6xl font-bold text-rose-900">Agents Payments</h1>
        <button
          className="py-2 px-4 bg-red-950 text-white rounded-full"
          onClick={fetchAgents}
        >
          Refresh
        </button>
      </div>

      {/* Filter Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 mb-4">
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search by name..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded w-full outline-none"
          />
        </div>
        <div className="relative">
          <i className="fas fa-hashtag absolute left-3 top-3 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search by code..."
            value={codeFilter}
            onChange={(e) => setCodeFilter(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded w-full outline-none"
          />
        </div>
        <select
          value={planTypeFilter}
          onChange={(e) => setPlanTypeFilter(e.target.value)}
          className="px-4 py-2 border rounded w-full outline-none"
        >
          <option value="">All Plan Types</option>
          {uniquePlanTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded w-full outline-none"
        >
          <option value="">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="un-paid">Un-Paid</option>
        </select>
      </div>

      <div className="w-full mt-2">
        <div className="overflow-auto max-h-96">
          <p className="text-rose-900 text-xs text-end mb-2 font-bold">
            Click on refresh to see the updated changes
          </p>
          <table
            className="w-full text-left border border-collapse rounded xs:border-separate border-slate-200"
            cellSpacing="0"
          >
            <thead>
              <tr>
                <th className="h-12 px-6 text-xs font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-rose-100">
                  Code
                </th>
                <th className="h-12 px-6 text-xs font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-rose-100">
                  Name
                </th>
                <th className="h-12 px-6 text-xs font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-rose-100">
                  Plan Type
                </th>
                <th className="h-12 px-6 text-xs font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-rose-100">
                  Proposal Limit
                </th>
                <th className="h-12 px-6 text-xs font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-rose-100">
                  Status
                </th>
                <th className="h-12 px-6 text-xs font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-rose-100">
                  Update Payment
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-red-500">
                    No agents available
                  </td>
                </tr>
              ) : (
                filteredAgents.map((payment) => (
                  <tr key={payment.username}>
                    <td className="h-12 px-6 text-xs transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500">
                      {payment.agentCode}
                    </td>
                    <td className="h-12 px-6 text-xs transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500">
                      {payment.fullName}
                    </td>
                    <td className="h-12 px-6 text-xs capitalize transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500">
                      {payment.agentType}
                    </td>
                    <td className="h-12 px-6 text-xs transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500">
                      {payment.proposalLimit}
                    </td>
                    <td className="h-12 px-6 text-xs transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500">
                      <span
                        className={`px-2 py-1 rounded-full text-white ${
                          payment.paymentStatus.toLowerCase() === "paid"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {payment.paymentStatus}
                      </span>
                    </td>
                    <td className="h-12 px-6 text-xs transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500">
                      <select
                        className="border rounded px-4 py-2 outline-none"
                        value={payment.paymentStatus}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          handleStatusChange(
                            payment.agentCode,
                            "paymentStatus",
                            newStatus
                          );
                        }}
                      >
                        <option value="">Select Option</option>
                        <option value="paid">Paid</option>
                        <option value="un-paid">Un-Paid</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgentsPayments;
