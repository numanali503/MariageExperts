import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuth } from '../../context/data';

const Register = () => {
    const { authURL } = useAuth();
    const [formData, setFormData] = useState({
        fullName: "",
        agentCode: "",  // Changed from username to agentCode
        password: "",
        phone: "",
        gender: "",
        image: "",
        country: "",
        city: "",
        area: "",
        experience: "",
        references: "",
    });

    const generateAgentCode = (fullName) => {  // Renamed function to generateAgentCode
        if (!fullName) return "";
        const initials = fullName
            .split(" ")
            .map((word) => word[0])
            .join(""); // Get initials
        const randomDigits = Math.floor(100 + Math.random() * 900); // Generate 2 random digits
        return `${initials}${randomDigits}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            const updatedFormData = { ...prev, [name]: value };

            if (name === "fullName") {
                updatedFormData.agentCode = generateAgentCode(value); // Updated to agentCode
            }

            return updatedFormData;
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const loadingToastId = toast.loading("Registering...");

        try {
            const response = await fetch(`${authURL}/agents-registration`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Registration successful!", {
                    id: loadingToastId,
                });
                window.location.href = "/"; // Redirect to login page
            } else {
                toast.error(data.message || "Registration failed. Please try again.", {
                    id: loadingToastId,
                });
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.", {
                id: loadingToastId,
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat">
            <div className="w-full max-w-[85rem] mx-auto p-8">
                <div className="flex items-center justify-center mb-6">
                    <svg id="logo-81" width="72" height="40" viewBox="0 0 72 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* SVG Logo */}
                    </svg>
                </div>
                <h2 className="text-sm font-semibold text-center text-gray-700 mb-6">
                    A trusted network of marriage consultants.
                    Search Engine & Follow-up system for proposals.
                </h2>
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
                    Agents Panel Registration👋
                </h2>
                <form onSubmit={handleRegister}>
                    <div className="flex items-center justify-center space-x-4 w-full">
                        <div className="mb-4 w-full">
                            <label
                                htmlFor="fullName"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full mt-1 bg-gray-200 rounded border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-800 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                required
                            />
                        </div>

                        <div className="mb-4 w-full">
                            <label
                                htmlFor="agentCode"  // Changed to agentCode
                                className="block text-sm font-medium text-gray-700"
                            >
                                Agent Code
                            </label>
                            <input
                                type="text"
                                name="agentCode"  // Changed to agentCode
                                value={formData.agentCode}  // Changed to agentCode
                                onChange={handleChange}
                                className="w-full mt-1 bg-gray-200 rounded border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-400 font-bold py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                required
                                readOnly
                                disabled
                            />
                        </div>

                        <div className="mb-4 w-full">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <input
                                type="text"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full mt-1 bg-gray-200 rounded border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-800 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                required
                            />
                        </div>

                        <div className="mb-4 w-full">
                            <label
                                htmlFor="gender"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Gender
                            </label>
                            <input
                                type="text"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full mt-1 bg-gray-200 rounded border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-800 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-center space-x-4 w-full">
                        <div className="mb-4 w-full">
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Phone / WhatsApp
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full mt-1 bg-gray-200 rounded border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-800 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                required
                            />
                        </div>

                        <div className="mb-4 w-full">
                            <label
                                htmlFor="image"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Image
                            </label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full mt-1 bg-gray-200 rounded border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                required
                            />
                        </div>

                        <div className="mb-4 w-full">
                            <label
                                htmlFor="country"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Country
                            </label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full mt-1 bg-gray-200 rounded border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-800 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                required
                            />
                        </div>

                        <div className="mb-4 w-full">
                            <label
                                htmlFor="city"
                                className="block text-sm font-medium text-gray-700"
                            >
                                City
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full mt-1 bg-gray-200 rounded border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-800 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                required
                            />
                        </div>

                        <div className="mb-4 w-full">
                            <label
                                htmlFor="area"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Area
                            </label>
                            <input
                                type="text"
                                name="area"
                                value={formData.area}
                                onChange={handleChange}
                                className="w-full mt-1 bg-gray-200 rounded border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-800 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-center space-x-4 w-full">
                        <div className="mb-4 w-full">
                            <label
                                htmlFor="experience"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Experience
                            </label>
                            <input
                                type="text"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                className="w-full mt-1 bg-gray-200 rounded border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-800 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                required
                            />
                        </div>

                        <div className="mb-4 w-full">
                            <label
                                htmlFor="references"
                                className="block text-sm font-medium text-gray-700"
                            >
                                References
                            </label>
                            <input
                                type="text"
                                name="references"
                                value={formData.references}
                                onChange={handleChange}
                                className="w-full mt-1 bg-gray-200 rounded border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-800 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-end justify-between">
                        <button
                            type="submit"
                            className="px-8 py-2 rounded bg-gradient-to-b from-pink-500 to-rose-600 text-white text-sm focus:ring-2 focus:ring-rose-400"
                        >
                            Sign Up
                        </button>
                        <p className="mt-3 text-xs text-end text-gray-800 flex-col flex">
                            Already have an account?{" "}
                            <Link
                                to="/"
                                className="text-gray-800 font-semibold text-xs hover:underline"
                            >
                                <i className="fa-duotone fa-light fa-arrow-up-right-from-square text-[9px]"></i> Sign In Here
                            </Link>
                        </p>
                    </div>
                </form>

                <p className="mt-8 text-xs text-center font-semibold text-gray-600">
                    © 2025 Marriage Experts. All Rights Reserved
                </p>
            </div>
        </div>
    );
};

export default Register;
