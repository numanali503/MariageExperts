import React from 'react';
import coverBg from '../../assets/cover.jpg';

function WhyChooseUs() {
    return (
        <>
            {/* Desktop View - Completely Unchanged */}
            <div className="hidden md:flex bg-cover h-96 bg-no-repeat bg-center w-full items-center justify-start"
                style={{ backgroundImage: `url(${coverBg})`, }} >

                <div className='flex flex-col items-start justify-start px-24 text-white'>
                    <h1 className="text-4xl font-bold">We help at every stage...</h1>
                    <h2 className='text-sm max-w-2xl mt-2 font-light text-start capitalize'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet asperiores similique, voluptates debitis, id autem nostrum doloremque accusantium sed expedita</h2>

                    <div className='flex items-start justify-start space-x-8'>
                        <div className='flex items-start justify-start mt-8 text-white space-x-4'>
                            <i className="fa-duotone fa-thin fa-shield-halved text-2xl text-white"></i>
                            <div className='flex flex-col'>
                                <h1 className="text-lg">We help at every stage</h1>
                                <h1 className="text-xs">We help at every stage</h1>
                            </div>
                        </div>
                        <div className='flex items-start justify-start mt-8 text-white space-x-4'>
                            <i className="fa-duotone fa-thin fa-heart text-2xl text-white"></i>
                            <div className='flex flex-col'>
                                <h1 className="text-lg">We help at every stage</h1>
                                <h1 className="text-xs">We help at every stage</h1>
                            </div>
                        </div>
                    </div>

                    <div className='flex items-start justify-start space-x-8'>
                        <div className='flex items-start justify-start mt-8 text-white space-x-4'>
                            <i className="fa-duotone fa-thin fa-badge-check text-2xl text-white"></i>
                            <div className='flex flex-col'>
                                <h1 className="text-lg">We help at every stage</h1>
                                <h1 className="text-xs">We help at every stage</h1>
                            </div>
                        </div>
                        <div className='flex items-start justify-start mt-8 text-white space-x-4'>
                            <i className="fa-duotone fa-thin fa-calendar-days text-2xl text-white"></i>
                            <div className='flex flex-col'>
                                <h1 className="text-lg">We help at every stage</h1>
                                <h1 className="text-xs">We help at every stage</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile View */}
            <div className='md:hidden bg-cover h-screen bg-no-repeat bg-center w-full flex items-center justify-start'
                style={{ backgroundImage: `url(${coverBg})`, }} >
                <div className='flex flex-col items-start justify-start px-4 text-white'>
                    <h1 className="text-2xl font-bold">We help at every stage...</h1>
                    <h2 className='text-xs max-w-2xl mt-2 font-light text-start capitalize'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet asperiores similique, voluptates debitis, id autem nostrum doloremque accusantium sed expedita</h2>

                    <div className='grid grid-cols-2 gap-4 mt-6'>
                        <div className='flex items-start text-white space-x-2'>
                            <i className="fa-duotone fa-thin fa-shield-halved text-xl text-white"></i>
                            <div className='flex flex-col'>
                                <h1 className="text-sm">We help at every stage</h1>
                                <h1 className="text-xs">We help at every stage</h1>
                            </div>
                        </div>
                        <div className='flex items-start text-white space-x-2'>
                            <i className="fa-duotone fa-thin fa-heart text-xl text-white"></i>
                            <div className='flex flex-col'>
                                <h1 className="text-sm">We help at every stage</h1>
                                <h1 className="text-xs">We help at every stage</h1>
                            </div>
                        </div>
                        <div className='flex items-start text-white space-x-2'>
                            <i className="fa-duotone fa-thin fa-badge-check text-xl text-white"></i>
                            <div className='flex flex-col'>
                                <h1 className="text-sm">We help at every stage</h1>
                                <h1 className="text-xs">We help at every stage</h1>
                            </div>
                        </div>
                        <div className='flex items-start text-white space-x-2'>
                            <i className="fa-duotone fa-thin fa-calendar-days text-xl text-white"></i>
                            <div className='flex flex-col'>
                                <h1 className="text-sm">We help at every stage</h1>
                                <h1 className="text-xs">We help at every stage</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default WhyChooseUs;