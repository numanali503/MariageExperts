import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/data";

const ClientsPayments = () => {
  const { authURL } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [codeFilter, setCodeFilter] = useState("");
  const [clientTypeFilter, setclientTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch proposals data
  const fetchProposals = async () => {
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
      setProposals(data.proposals || []); // Fixed: Access proposals from data and provide fallback
    } catch (error) {
      console.error("Failed to fetch proposals:", error);
    }
  };

  // Function to handle status change
  const handleStatusChange = async (proposalCode, field, value) => {
    try {
      const updatedFields = { [field]: value };

      const response = await fetch(
        `${authURL}/update-proposal?proposalCode=${proposalCode}`,
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

      setProposals((prevProposals) =>
        prevProposals.map((proposal) =>
          proposal.proposalCode === proposalCode
            ? { ...proposal, ...updatedFields }
            : proposal
        )
      );
    } catch (error) {
      console.error("Error updating proposal status:", error);
    }
  };

  // Get unique plan types for filter dropdown
  const uniqueclientTypes = [
    ...new Set(
      proposals.map((proposal) => proposal.clientType).filter(Boolean)
    ),
  ];

  // Filter proposals based on all criteria with null checks
  const filteredProposals = proposals.filter((proposal) => {
    const nameMatch = (proposal.personalInfo.name || "")
      .toLowerCase()
      .includes(nameFilter.toLowerCase());
    const codeMatch = (proposal.proposalCode || "")
      .toLowerCase()
      .includes(codeFilter.toLowerCase());
    const planMatch =
      !clientTypeFilter || proposal.clientType === clientTypeFilter;
    const statusMatch =
      !statusFilter || proposal.paymentStatus === statusFilter;
    return nameMatch && codeMatch && planMatch && statusMatch;
  });

  // Initial fetch when component mounts
  useEffect(() => {
    fetchProposals();
  }, []);

  return (
    <div className="border-2 border-rose-200 p-12 bg-white">
      <div className="flex items-end justify-between">
        <h1 className="text-6xl font-bold text-rose-900">Client Payments</h1>
        <button
          className="py-2 px-4 bg-red-950 text-white rounded-full"
          onClick={fetchProposals}
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
            placeholder="Search by client name..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded w-full outline-none"
          />
        </div>
        <div className="relative">
          <i className="fas fa-hashtag absolute left-3 top-3 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search by proposal code..."
            value={codeFilter}
            onChange={(e) => setCodeFilter(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded w-full outline-none"
          />
        </div>
        <select
          value={clientTypeFilter}
          onChange={(e) => setclientTypeFilter(e.target.value)}
          className="px-4 py-2 border rounded w-full outline-none"
        >
          <option value="">All Plan Types</option>
          {uniqueclientTypes.map((type) => (
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
                  Client Name
                </th>
                <th className="h-12 px-6 text-xs font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-rose-100">
                  Plan Type
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
              {filteredProposals.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-red-500">
                    No proposals available
                  </td>
                </tr>
              ) : (
                filteredProposals.map((proposal) => (
                  <tr key={proposal.proposalCode}>
                    <td className="h-12 px-6 text-xs transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500">
                      {proposal.proposalCode || ""}
                    </td>
                    <td className="h-12 px-6 text-xs transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500">
                      {proposal.personalInfo.name || ""}
                    </td>
                    <td className="h-12 px-6 text-xs capitalize transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500">
                      {proposal.clientType || ""}
                    </td>
                    <td className="h-12 px-6 text-xs transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500">
                      <span
                        className={`px-2 py-1 rounded-full text-white ${
                          (proposal.paymentStatus || "").toLowerCase() ===
                          "paid"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {proposal.paymentStatus || "un-paid"}
                      </span>
                    </td>
                    <td className="h-12 px-6 text-xs transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500">
                      <select
                        className="border rounded px-4 py-2 outline-none"
                        value={proposal.paymentStatus || ""}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          handleStatusChange(
                            proposal.proposalCode,
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

export default ClientsPayments;
