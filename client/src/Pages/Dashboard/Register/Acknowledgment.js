import React from 'react';

const TermsAndConditions = () => {
    return (
        <div className="min-h-screen bg-rose-50 py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[85rem] mx-auto">
                <div className="px-6 py-8">
                    <h2 className="md:text-4xl text-3xl font-light text-rose-950 text-center md:text-start">
                        <span className="font-bold italicFont"> Terms and Conditions</span>
                    </h2>
                    <h2 className="text-md max-w-2xl mt-2 font-light text-rose-950 text-justify md:text-start capitalize">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet
                        asperiores similique, voluptates debitis, id autem nostrum doloremque
                        accusantium sed expedita
                    </h2>

                    <div className="space-y-6 text-rose-900 mt-12">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                            <p className="mb-4">
                                Welcome to our platform. These terms and conditions outline the rules and regulations
                                for the use of our Website/Application.
                            </p>
                            <p>
                                By accessing this website, we assume you accept these terms and conditions in full.
                                Do not continue to use our website if you do not accept all of the terms and conditions
                                stated on this page.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. License to Use</h2>
                            <p className="mb-4">
                                Unless otherwise stated, we own the intellectual property rights for all material on
                                our platform. All intellectual property rights are reserved.
                            </p>
                            <p>
                                You may view and/or print pages from the website for your own personal use subject
                                to restrictions set in these terms and conditions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Restrictions</h2>
                            <p className="mb-4">You are specifically restricted from all of the following:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Publishing any website material in any other media</li>
                                <li>Selling, sublicensing, and/or otherwise commercializing any website material</li>
                                <li>Publicly performing and/or showing any website material</li>
                                <li>Using this website in any way that is or may be damaging to this website</li>
                                <li>Using this website contrary to applicable laws and regulations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Privacy Policy</h2>
                            <p>
                                Our privacy policy explains how we collect, use, protect, and when necessary, disclose
                                your personal information. You can find our privacy policy on our website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Limitation of Liability</h2>
                            <p>
                                In no event shall we be liable for any loss or damage including without limitation,
                                indirect or consequential loss or damage, arising out of or in connection with the
                                use of our website/application.
                            </p>
                        </section>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <p className="text-sm text-gray-900">
                            Last updated: December 26, 2024
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;