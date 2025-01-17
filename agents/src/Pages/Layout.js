import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import logo from '../assets/footLogo.png';

function AdminLayout() {
    document.title = "Agents - Dashboard";

    const [menuState, setMenuState] = useState({
        directoryOpen: false,
        directorysOpen: false,
    });

    // Function to toggle submenu visibility
    const toggleMenu = (menu) => {
        setMenuState((prevState) => ({
            ...prevState,
            [menu]: !prevState[menu],
        }));
    };
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };
    return (
        <>
            <aside class="fixed flex flex-col top-0 left-0 z-50 w-72 h-screen py-8 bg-gray-800 shadow-sm">
                <div className="mx-auto flex flex-col items-center justify-center">
                    <Link to="/">
                        <img src={logo} alt="logo" className="w-52" />
                    </Link>
                </div>

                <nav className="flex flex-col justify-between h-full mt-12">
                    <div className="px-4 pb-6">
                        <ul className="mb-8 text-sm font-medium flex-1 h-full">
                            {/* Dashboard */}
                            <li>
                                <Link
                                    className="flex items-center pl-3 py-3 pr-4 text-gray-50 rounded hover:bg-rose-900"
                                    to="/dashboard"
                                >
                                    <span className="inline-block mr-3">
                                        <i className="fa-duotone fa-light fa-house-blank"></i>
                                    </span>
                                    <span>Dashboard</span>
                                </Link>
                            </li>

                            {/* Directory */}
                            <li>
                                <Link
                                    className="flex items-center pl-3 py-3 pr-4 text-gray-50 rounded hover:bg-rose-900"
                                    to="/dashboard/proposals"
                                >
                                    <span className="inline-block mr-3">
                                        <i className="fa-duotone fa-thin fa-rings-wedding"></i>
                                    </span>
                                    <span>Assigned Proposals</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    className="flex items-center pl-3 py-3 pr-4 text-gray-50 rounded hover:bg-rose-900"
                                    to="/dashboard/all-proposals"
                                >
                                    <span className="inline-block mr-3">
                                        <i className="fa-duotone fa-thin fa-rings-wedding"></i>
                                    </span>
                                    <span>Proposals List</span>
                                </Link>
                            </li>

                            {/* Videos */}
                            <li>
                                <Link
                                    className="flex items-center pl-3 py-3 pr-4 text-gray-50 hover:bg-rose-900 rounded"
                                    to="track"
                                >
                                    <span className="inline-block mr-3">
                                        <i class="fa-duotone fa-light fa-rectangle-history-circle-user"></i>
                                    </span>
                                    <span>Track Proposal</span>
                                </Link>
                            </li>

                            {/* Notes */}
                            <li>
                                <Link
                                    className="flex items-center pl-3 py-3 pr-4 text-gray-50 hover:bg-rose-900 rounded"
                                    to="new-proposal"
                                >
                                    <span className="inline-block mr-3">
                                        <i class="fa-sharp-duotone fa-regular fa-ring-diamond"></i>
                                    </span>
                                    <span>Add New Proposal</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </aside>

            <header className="fixed top-0 left-0 right-0 z-40 h-16 sm:ml-72 flex items-center px-8 bg-gray-900 shadow-sm border-b-1 border-slate-200">
                <div className="flex items-center justify-between w-full">
                    <h1 className="text-white font-bold tracking-wide">Agents Dashboard Panel</h1>
                    <div className="flex space-x-4 justify-center items-center">
                        <Link
                            to="/dashboard/pricing"
                            className="inline-block text-rose-500"
                        >
                            <i class="fa-solid fa-thin fa-cart-shopping"></i>
                        </Link>
                        <button
                            onClick={logout}
                            className="activeBtn text-blue-500"
                        >
                            <i class="fa-solid fa-thin fa-right-from-bracket text-xl"></i>
                        </button>
                    </div>
                </div>
            </header>

            <div className="sm:ml-72 p-8 mt-16 bg-rose-50">
                <Outlet />
            </div>
        </>
    );
}

export default AdminLayout;