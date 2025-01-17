import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div
        className={`z-50 fixed top-0 left-0 right-0 px-4 lg:px-24 py-8 bg-opacity-70 backdrop-blur-md`}
      >
        <div className="flex items-center justify-center relative">
          {/* Hamburger Menu for Mobile */}
          <button
            className="lg:hidden absolute left-0 z-50"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            <div className="space-y-2">
              <span
                className={`block w-8 h-0.5 bg-[#602A49] transform transition duration-300 ease-in-out ${
                  isMenuOpen ? "rotate-45 translate-y-2.5" : ""
                }`}
              ></span>
              <span
                className={`block w-8 h-0.5 bg-[#602A49] transition duration-300 ease-in-out ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block w-8 h-0.5 bg-[#602A49] transform transition duration-300 ease-in-out ${
                  isMenuOpen ? "-rotate-45 -translate-y-2.5" : ""
                }`}
              ></span>
            </div>
          </button>

          {/* Logo Centered */}
          <Link
            to="/"
            className="inline-block text-lg font-bold absolute left-1/2 transform -translate-x-1/2"
          >
            <img src={logo} alt="Logo" className="w-[16rem]" />
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex space-x-8 absolute left-0">
            <SignedIn>
              <Link
                to="/proposals"
                className="text-sm font-semibold text-[#602A49] hover:text-red-900"
              >
                Proposals
              </Link>
            </SignedIn>
            <Link
              to="/pricing"
              className="text-sm font-semibold text-[#602A49] hover:text-red-900"
            >
              Price & Plans
            </Link>
            <Link
              to="/contact"
              className="text-sm font-semibold text-[#602A49] hover:text-red-900"
            >
              Contact
            </Link>
          </div>

          {/* Request Demo Button - Desktop */}
          <div className="hidden lg:block absolute right-0">
            <SignedIn>
              <div className="flex items-center gap-x-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-x-2 mr-4 text-sm font-semibold text-[#602A49] hover:text-red-900"
                >
                  <i className="fa-duotone fa-house"></i>
                  Dashboard
                </Link>
                <div className="flex items-center gap-x-2 font-medium text-gray-500 hover:text-blue-600 md:border-s md:border-gray-400 py-2 md:py-0 md:my-6 md:ps-4 ">
                  <UserButton></UserButton>
                </div>
              </div>
            </SignedIn>

            <SignedOut>
              <button className="bg-red-950 text-white py-2 px-6 rounded-full">
                <SignInButton mode="modal"></SignInButton>
              </button>
            </SignedOut>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ease-in-out 
          ${isMenuOpen ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        {/* Translucent Overlay */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-500 ease-in-out 
            ${isMenuOpen ? "opacity-50" : "opacity-0"}`}
          onClick={toggleMenu}
        ></div>

        {/* Mobile Menu */}
        <div
          className={`absolute top-0 left-0 w-3/4 h-full bg-white shadow-lg 
            transform transition-transform duration-500 ease-in-out 
            ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex flex-col p-8 space-y-6 mt-20">
            <Link
              to="/about"
              className="text-lg font-semibold text-[#602A49] hover:text-red-900 opacity-0 transform translate-x-[-20px] transition-all duration-500 ease-out"
              style={{
                transitionDelay: isMenuOpen ? "300ms" : "0ms",
                opacity: isMenuOpen ? 1 : 0,
                transform: isMenuOpen ? "translateX(0)" : "translateX(-20px)",
              }}
              onClick={toggleMenu}
            >
              Find A Match
            </Link>
            <Link
              to="/products"
              className="text-lg font-semibold text-[#602A49] hover:text-red-900 opacity-0 transform translate-x-[-20px] transition-all duration-500 ease-out"
              style={{
                transitionDelay: isMenuOpen ? "400ms" : "0ms",
                opacity: isMenuOpen ? 1 : 0,
                transform: isMenuOpen ? "translateX(0)" : "translateX(-20px)",
              }}
              onClick={toggleMenu}
            >
              Proposals
            </Link>
            <Link
              to="/contact"
              className="text-lg font-semibold text-[#602A49] hover:text-red-900 opacity-0 transform translate-x-[-20px] transition-all duration-500 ease-out"
              style={{
                transitionDelay: isMenuOpen ? "500ms" : "0ms",
                opacity: isMenuOpen ? 1 : 0,
                transform: isMenuOpen ? "translateX(0)" : "translateX(-20px)",
              }}
              onClick={toggleMenu}
            >
              Contact
            </Link>
            <Link
              className="inline-block py-3 px-8 text-sm text-white bg-[#602A49] rounded-full text-center opacity-0 transform translate-x-[-20px] transition-all duration-500 ease-out"
              to="/"
              style={{
                transitionDelay: isMenuOpen ? "600ms" : "0ms",
                opacity: isMenuOpen ? 1 : 0,
                transform: isMenuOpen ? "translateX(0)" : "translateX(-20px)",
              }}
              onClick={toggleMenu}
            >
              Register Yourself
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
