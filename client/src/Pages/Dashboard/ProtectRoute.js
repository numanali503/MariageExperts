import React from 'react';
import { SignedIn, useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import Loader from '../../components/Loader'

function ProtectedRoutes(props) {
    const { Component } = props;
    const { isSignedIn, isLoaded } = useUser();

    if (!isLoaded) {
        return (
            <Loader />
        );
    }

    if (isSignedIn) {
        <Navigate to="/dashboard" />;
    } else {
        return <Navigate to="/sign-in" />;
    }

    return (
        <>
            <SignedIn>
                <Component />
            </SignedIn>
        </>
    );
}

export default ProtectedRoutes;