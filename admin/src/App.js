import React, { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Loader from "./components/Loader";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import ProtectedRoute from "./Pages/ProtectedRoute";
import Layout from "./Pages/Layout";
import Dashboard from "./Pages/Dashboard";
import AgentsPage from "./Pages/Agents/AgentsPage";
import AgentDetails from "./Pages/Agents/AgentDetails";
import ProposalList from "./Pages/Proposals/ProposalsPage";
import ProposalDetails from "./Pages/Proposals/ProposalDetails";
import AgentsPayments from "./Pages/Payments/AgentsPayments";
import ClientsPayments from "./Pages/Payments/ClientsPayments";
import AgentProposalDetails from "./Pages/Agents/AgentProposalDetails";
import Track from "./Pages/Track/Track";
import NewProposal from "./Pages/NewProposal/NewProposal";
import ExtraProposal from "./Pages/ExtraProposal/ExtraProposal";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={<ProtectedRoute Component={Layout} />}
        >
          <Route index element={<Dashboard />} />
          <Route path="agents" element={<AgentsPage />} />
          <Route path="agents/:agentCode" element={<AgentDetails />} />
          <Route path="proposals" element={<ProposalList />} />
          <Route path="agents-payments" element={<AgentsPayments />} />
          <Route path="clients-payments" element={<ClientsPayments />} />
          <Route path="track-proposal" element={<Track />} />
          <Route path="new-proposal" element={<NewProposal />} />
          <Route path="extra-proposal" element={<ExtraProposal />} />
          <Route
            path="/dashboard/proposals/:proposalCode"
            element={<ProposalDetails />}
          />
          <Route
            path="/dashboard/agents/:agentCode/:proposalCode"
            element={<AgentProposalDetails />}
          />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
