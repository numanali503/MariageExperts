import React, { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Loader from "./components/Loader";
import Login from "./components/Auth/Login";
import ProtectedRoute from "./Pages/ProtectedRoute";
import Layout from "./Pages/Layout";
import Dashboard from "./Pages/Dashboard";
import Register from "./components/Auth/Register";
import ProposalsPage from "./Pages/Proposals/ProposalPage";
import PricingPage from "./Pages/Pricing/PricingPage";
import PaymentVerificationPage from "./Pages/Pricing/PaymentVarification";
import ProposalDetails from "./Pages/Proposals/ProposalDetails";
import Tracking from "./Pages/Tracking";
import AllProposals from "./Pages/Proposals/AllProposals";
import NewProposal from "./Pages/NewProposal/NewProposal";
import AllProposalDetails from "./Pages/Proposals/AllProposalDetails";
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
          <Route path="proposals" element={<ProposalsPage />} />
          <Route path="track" element={<Tracking />} />
          <Route path="all-proposals" element={<AllProposals />} />
          <Route path="new-proposal" element={<NewProposal />} />
          <Route
            path="/dashboard/proposals/:proposalCode"
            element={<ProposalDetails />}
          />
          <Route
            path="/dashboard/all-proposals-cEXWtfylYF9K3wQ/:proposalCode"
            element={<AllProposalDetails />}
          />
          <Route path="pricing" element={<PricingPage />} />
          <Route
            path="pricing/payment-verification"
            element={<PaymentVerificationPage />}
          />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
