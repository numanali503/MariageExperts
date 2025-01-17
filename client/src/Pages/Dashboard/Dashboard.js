import React from 'react'
import { Link } from 'react-router-dom'

function Dashboard() {
    return (
        <div className='flex flex-col items-center justify-center space-y-8'>
            <h2 className="md:text-4xl text-3xl font-light text-rose-950 text-center md:text-start capitalize">
                Welcome to{" "}
                <span className="font-bold italicFont"> marriage experts </span>
                {" "}Dashboard
            </h2>

            <div className='flex space-x-4 items-center justify-center w-full px-4'>

                <Link to='register' className='h-32 w-full bg-rose-200 rounded-md px-4 py-3 flex flex-col mt-2'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h1 className='text-rose-900 font-semibold'>Register Yourself</h1>
                            <h1 className='text-xs text-rose-800'>for new proposal</h1>
                        </div>
                        <i className="fa-solid fa-arrow-up-right fa-lg text-rose-900"></i>
                    </div>
                    <div className='flex-1 flex items-end justify-start'>
                        <h1 className='mb-0 text-4xl font-bold text-rose-900'>Registration</h1>
                    </div>
                </Link>


                <Link to='track' className='h-32 w-full bg-rose-200 rounded-md px-4 py-3 flex flex-col mt-2'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h1 className='text-rose-900 font-semibold'>Track</h1>
                            <h1 className='text-xs text-rose-800'>of previous proposals</h1>
                        </div>
                        <i className="fa-solid fa-arrow-up-right fa-lg text-rose-900"></i>
                    </div>
                    <div className='flex-1 flex items-end justify-start'>
                        <h1 className='mb-0 text-4xl font-bold text-rose-900'>Tracking</h1>
                    </div>
                </Link>

                <Link to='history' className='h-32 w-full bg-rose-200 rounded-md px-4 py-3 flex flex-col mt-2'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h1 className='text-rose-900 font-semibold'>Get</h1>
                            <h1 className='text-xs text-rose-800'>data of previous proposals</h1>
                        </div>
                        <i className="fa-solid fa-arrow-up-right fa-lg text-rose-900"></i>
                    </div>
                    <div className='flex-1 flex items-end justify-start'>
                        <h1 className='mb-0 text-4xl font-bold text-rose-900'>History</h1>
                    </div>
                </Link>

            </div>

        </div>
    )
}

export default Dashboard