import React from 'react'

function ProposalsHero() {
    return (
        <div className='bg-rose-50'>
            <div className='max-w-[85rem] mx-auto pt-32'>
                <div className=" flex flex-col md:flex-row items-center justify-center w-fulll md:space-y-0">
                    <h2 className='text-4xl font-light text-rose-950 text-center lg:text-start w-full'>Explore tons of <span className='font-bold italicFont'> Proposals </span> from us</h2>
                    <div className="bg-rose-950 h-0.5 md:w-full"></div>
                </div>
                <h2 className='text-md mt-3 font-light text-rose-950 text-center lg:text-start capitalize'>Have a question or need help? Drop us a line, and we'll get back to you faster than a cat on a laser pointer!</h2>
            </div>
        </div>
    )
}

export default ProposalsHero