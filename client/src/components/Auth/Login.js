import React from 'react';
import { SignIn } from '@clerk/clerk-react';

function UserLogin() {
    return (
        <div className='flex items-center justify-center h-screen'>
            <SignIn signUpUrl='/sign-up' forceRedirectUrl={"/dashboard"}></SignIn>
        </div>
    )
}

export default UserLogin