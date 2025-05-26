import React, { useState } from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false); // Close mobile menu after clicking
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-400 to-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-top justify-between h-16">
          {/* Logo and site name */}
          <div className="flex items-center space-x-2">
            <a href="/">
              <img src={logo} alt="LogoCaption" className="h-20 w-auto" />
            </a>
            <a href="/">
              <span className="text-4xl text-gray-800 font-semibold">
                ACCISCRIBE
              </span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 p-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Navigation links */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("hero");
              }}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Home
            </a>
            <a
              href="/upload"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("upload");
              }}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Upload
            </a>
            <a
              href="/record"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("record");
              }}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Record
            </a>
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contact");
              }}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Contact
            </a>
            <a
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("about");
              }}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              About
            </a>
            <button className="block bg-indigo-600 text-white hover:bg-white hover:text-indigo-600 transition-colors py-2">
              Log In
            </button>
            <button className="block border-indigo-700 bg-white text-indigo-700 hover:bg-indigo-600 hover:text-white transition-colors py-2">
              Sign Up
            </button>
          
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:hidden py-2 space-y-2`}
        >
          <a
            href="/"
            className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
          >
            Home
          </a>
          <a
            href="/upload"
            className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
          >
            Upload
          </a>
          <a
            href="/record"
            className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
          >
            Record
          </a>
          <a
            href="/contact"
            className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
          >
            Contact
          </a>
          <a
            href="/about"
            className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
          >
            About
          </a>
          <button className="block bg-indigo-600 text-white hover:bg-white hover:text-indigo-600 transition-colors py-2">
            Log In
          </button>
          <button className="block bg-indigo-600 text-white hover:bg-white hover:text-indigo-600 transition-colors py-2">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}
