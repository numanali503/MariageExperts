import React from 'react'
import { Outlet } from 'react-router-dom'

function Layout() {
    return (
        <div className='py-32 max-w-[85rem] mx-auto'>
            <Outlet />
        </div>
    )
}

export default Layout