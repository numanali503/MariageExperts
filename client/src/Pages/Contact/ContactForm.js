import React from 'react'

function ContactForm() {
    return (
        <div className="max-w-[85rem] px-4 lg:px-0 py-12 mx-auto">
            <div className="max-w-xl mx-auto">
                <form>
                    <div className="grid gap-4 lg:gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                            <div>
                                <label
                                    htmlFor="hs-firstname-hire-us-2"
                                    className="block mb-2 text-sm text-gray-700 font-medium"
                                >
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="hs-firstname-hire-us-2"
                                    id="hs-firstname-hire-us-2"
                                    className="py-3 px-4 block w-full outline-none border-gray-200 rounded text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="hs-lastname-hire-us-2"
                                    className="block mb-2 text-sm text-gray-700 font-medium"
                                >
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="hs-lastname-hire-us-2"
                                    id="hs-lastname-hire-us-2"
                                    className="py-3 px-4 block w-full border-gray-200 rounded outline-none text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                />
                            </div>
                        </div>
                        {/* End Grid */}
                        <div>
                            <label
                                htmlFor="hs-work-email-hire-us-2"
                                className="block mb-2 text-sm text-gray-700 font-medium"
                            >
                                Email or Phone
                            </label>
                            <input
                                type="email"
                                name="hs-work-email-hire-us-2"
                                id="hs-work-email-hire-us-2"
                                autoComplete="email"
                                className="py-3 px-4 block w-full border-gray-200 rounded outline-none text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="hs-about-hire-us-2"
                                className="block mb-2 text-sm text-gray-700 font-medium"
                            >
                                Details
                            </label>
                            <textarea
                                id="hs-about-hire-us-2"
                                name="hs-about-hire-us-2"
                                rows={4}
                                className="py-3 px-4 block w-full border-gray-200 rounded outline-none text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                defaultValue={""}
                            />
                        </div>
                    </div>
                    <div className="mt-6 grid">
                        <button
                            type="submit"
                            className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-rose-950 text-white hover:bg-rose-700 focus:outline-none focus:bg-rose-700 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            Send inquiry
                        </button>
                    </div>
                    <div className="mt-3 text-center">
                        <p className="text-sm text-gray-500">
                            We'll get back to you in 1-2 business hours.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ContactForm