import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Loader from './components/Loader';
import Header from './components/Header'
import HomeContainer from './Pages/Landing/HomeContainer';
import Footer from './components/Footer'
import ContactContainer from './Pages/Contact/ContactContainer';
import RegisterContainer from './Pages/Dashboard/Register/Container'
import ProposalsContainer from './Pages/Proposals/ProposalsContainer';
import ProtectedRoutes from './Pages/Dashboard/ProtectRoute';
import Layout from './Pages/Dashboard/Layout';
import Dashboard from './Pages/Dashboard/Dashboard';
import SignIn from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import PricingPage from './Pages/Pricing/PricingPage';
import Acknowledgment from './Pages/Dashboard/Register/Acknowledgment';
import Container from './Pages/Dashboard/TrackHistory/Container';
import ProposalEditContainer from './Pages/Dashboard/EditProposal/Container';
import ClientPaymentVerification from './Pages/Pricing/ClinetPaymentVerification';

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
    <div className='bg-rose-50'>
      <Header></Header>
      <Routes>
        <Route path='/' element={<HomeContainer />} />
        <Route path='/contact' element={<ContactContainer />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/pricing' element={<PricingPage />} />
        <Route path='/pricing/payment-verification' element={<ClientPaymentVerification />} />
        <Route path='/terms-and-conditions' element={<Acknowledgment />} />
        <Route path='/proposals' element={<ProposalsContainer />} />

        <Route path='/dashboard' element={<ProtectedRoutes Component={Layout} />}>
          <Route index element={<Dashboard />} />
          <Route path='register' element={<RegisterContainer />} />
          <Route path='track' element={<Container />} />
          <Route path='history' element={<ProposalEditContainer />} />
        </Route>


      </Routes>
      <Footer></Footer>
      <Toaster />
    </div>
  );
}

export default App;
