import React from 'react'
import bgVideo from '../../assets/bgVideo.mp4'

function AboutUs() {
    return (
        <>
            {/* Features */}
            <div className="max-w-[85rem] py-10 lg:py-14 mx-auto">
                <div className="min-h-[35vh] md:min-h-[75vh] relative rounded-xl overflow-hidden">
                    {/* Video Background */}
                    <video
                        className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
                        src={bgVideo}// Replace this with the correct path to your video file
                        autoPlay
                        loop
                        muted
                    ></video>
                    <div className="absolute bottom-0 start-0 end-0 max-w-xs text-center mx-auto p-6 md:start-auto md:text-start md:mx-0 z-10">
                        {/* Card */}
                        <div className="px-5 py-4 inline-block bg-red-200 rounded-lg md:p-7">
                            <div className="hidden md:block">
                                <h2 className='text-4xl font-light text-rose-950 text-start capitalize'>About<span className='font-bold'> marriage experts</span></h2>
                                <p className="mt-2 text-gray-800">Watch our CEO Message.</p>
                            </div>
                            <div className="md:mt-16">
                                <div
                                    className="flex items-center gap-2 text-sm font-medium text-rose-950 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                                >
                                    <svg
                                        className="shrink-0 size-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polygon points="5 3 19 12 5 21 5 3" />
                                    </svg>
                                    Watch our story
                                </div>
                            </div>
                        </div>
                        {/* End Card */}
                    </div>
                </div>
            </div>
            {/* End Features */}
        </>
    )
}

export default AboutUs
