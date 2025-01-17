import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/Loader'
import { useAuth } from '../context/data';

function ProtectedRoute(props) {
    const { authURL } = useAuth();
    const { Component } = props;
    const [redirectToLogin, setRedirectToLogin] = useState(false);
    const [loading, setLoading] = useState(true); // Start with loading state true

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${authURL}/agent-authenticate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    toast.success(`Logged In Successfully!`);
                } else if (response.status === 403) {
                    toast.error(`Access Frbidden!`);
                    setRedirectToLogin(true);
                } else if (response.status === 401) {
                    console.log(`Token Invalid!`);
                    console.log(`Login First!`);
                    setRedirectToLogin(true);
                } else if (response.status === 404) {
                    console.log('No Token Found');
                    setRedirectToLogin(true);
                } else {
                    toast.error('Internal Server Error');
                    setRedirectToLogin(true);
                }
            } catch (error) {
                console.error('Error while verifying token:', error);
                setRedirectToLogin(true);
            } finally {
                setTimeout(() => setLoading(false), 2000); // Show loader for 5 seconds
            }
        };

        verifyToken();
    }, [redirectToLogin]);

    if (redirectToLogin) {
        return <Navigate to="/" />;
    }

    return (
        <>
            {loading && <Loader />} {/* Show loader if loading is true */}
            {!loading && <Component />} {/* Show component after loading is false */}
        </>
    );
}

export default ProtectedRoute;
