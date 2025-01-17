import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import logo from '../assets/footLogo.png';

function AdminLayout() {
    document.title = "Admin - Dashboard";

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
                                    to="/dashboard/agents"
                                >
                                    <span className="inline-block mr-3">
                                        <i class="fa-duotone fa-thin fa-user"></i>
                                    </span>
                                    <span>Agents</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="flex items-center pl-3 py-3 pr-4 text-gray-50 rounded hover:bg-rose-900"
                                    to="/dashboard/proposals"
                                >
                                    <span className="inline-block mr-3">
                                        <i className="fa-duotone fa-thin fa-rings-wedding"></i>
                                    </span>
                                    <span>Propposals</span>
                                </Link>
                            </li>

                            {/* Directory */}
                            <li>
                                <a
                                    className="flex items-center pl-3 py-3 pr-4 text-gray-50 hover:bg-rose-900 rounded"
                                    href="#"
                                    onClick={() => toggleMenu('directorysOpen')}
                                >
                                    <span className="inline-block mr-3">
                                        <i class="fa-duotone fa-thin fa-coins"></i>
                                    </span>
                                    <span>Payments</span>
                                    <span className="inline-block ml-auto">
                                        <i className={`fa-duotone fa-thin fa-caret-${menuState.directorysOpen ? 'up' : 'down'}`}></i>
                                    </span>
                                </a>
                                {menuState.directorysOpen && (
                                    <ul className="pl-6 mt-2">
                                        <li>
                                            <Link className="text-gray-50 hover:bg-gray-900 rounded block px-3 py-2" to="agents-payments">
                                                Agents Payments
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to='clients-payments' className="text-gray-50 hover:bg-gray-900 rounded block px-3 py-2" href="#">
                                                Clients Payments
                                            </Link>
                                        </li>

                                    </ul>
                                )}
                            </li>

                            {/* Videos */}
                            <li>
                                <Link
                                    className="flex items-center pl-3 py-3 pr-4 text-gray-50 hover:bg-rose-900 rounded"
                                    to="track-proposal"
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

                            <li>
                                <Link
                                    className="flex items-center pl-3 py-3 pr-4 text-gray-50 hover:bg-rose-900 rounded"
                                    to="extra-proposal"
                                >
                                    <span className="inline-block mr-3">
                                        <i class="fa-sharp-duotone fa-regular fa-database"></i>
                                    </span>
                                    <span>Seperate Proposals</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </aside>

            <header className="fixed top-0 left-0 right-0 z-40 h-16 sm:ml-72 flex items-center px-8 bg-gray-900 shadow-sm border-b-1 border-slate-200">
                <div className="flex items-center justify-between w-full">
                    <h1 className="text-white font-bold tracking-wide">Administrator Dashboard Panel</h1>
                    <button
                        onClick={logout}
                        className="activeBtn px-4 py-1 rounded text-sm bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
                    >
                        Log Out
                    </button>
                </div>
            </header>

            <div className="sm:ml-72 p-8 mt-16 bg-rose-50">
                <Outlet />
            </div>
        </>
    );
}

export default AdminLayout;