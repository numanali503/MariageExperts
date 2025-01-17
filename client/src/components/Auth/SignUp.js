import React from 'react';
import { SignUp } from '@clerk/clerk-react';
function UserLogin() {
    return (
        <div className='flex items-center justify-center h-screen'>
            <SignUp signInUrl='/sign-in' forceRedirectUrl={"/register"}></SignUp>
        </div>
    )
}

export default UserLogin