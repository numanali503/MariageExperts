import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/data';
import { ClerkProvider, ClerkLoading, ClerkLoaded } from '@clerk/clerk-react';
import Loader from './components/Loader';

const PUBLISHABLE_KEY = "pk_test_YW1hemVkLWdob3VsLTI3LmNsZXJrLmFjY291bnRzLmRldiQ";
// const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/" signUpFallbackRedirectUrl="/dashboard/register" signInFallbackRedirectUrl="/dashboard">

        <ClerkLoading>
          <Loader />
        </ClerkLoading>

        <ClerkLoaded>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ClerkLoaded>

      </ClerkProvider>
    </React.StrictMode>
  </AuthProvider>
);


reportWebVitals();
