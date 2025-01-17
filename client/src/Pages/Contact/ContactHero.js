import React from 'react'

function ContactHero() {
    return (
        <div className='bg-rose-50'>
            <div className='max-w-[85rem] mx-auto pt-32'>
                <div className=" flex flex-col md:flex-row items-center justify-center w-fulll px-4 lg:px-0 md:space-y-0">
                    <h2 className='text-4xl font-light text-rose-950 text-start w-full'>Need any <span className='font-bold italicFont'> assistance or help</span>?</h2>
                    <div className="bg-rose-950 h-0.5 md:w-full"></div>
                </div>
                <h2 className='text-md mt-3 font-light text-rose-950 text-center lg:text-start px-4 lg:px-0 capitalize'>Have a question or need help? Drop us a line, and we'll get back to you faster than a cat on a laser pointer!</h2>
            </div>
        </div>
    )
}

export default ContactHero