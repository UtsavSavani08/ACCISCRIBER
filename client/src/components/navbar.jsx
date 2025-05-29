import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false); // Close mobile menu after clicking
    }
  };
   const handleContactClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      scrollToSection('contact');
    } else {
      navigate('/', { state: { scrollTo: 'contact' } });
    }
  };

   const handleAboutClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      scrollToSection('about');
    } else {
      navigate('/', { state: { scrollTo: 'about' } });
    }
  };
  

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-400 to-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-top justify-between h-16">
          {/* Logo and site name */}
          <div className="flex items-center space-x-2">
            <Link to="/">
              <img src={logo} alt="LogoCaption" className="h-20 w-auto" />
            </Link>
            <Link to="/" className="mt-2">
              <span className="text-4xl text-gray-800 font-semibold" style={{ fontFamily: 'Deserta, cursive' }}>
                ACCISCRIBE
              </span>
            </Link>
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
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
            <Link
              to="/upload"
              
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Upload
            </Link>
            <Link
              to="/record"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Record
            </Link>
            <Link
              to="/contact"
               onClick={handleContactClick}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/about"
              onClick={handleAboutClick}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              About
            </Link>
            <Link to="/login" className='text-white '><button className="block bg-indigo-600 text-white hover:bg-white hover:text-indigo-600 transition-colors py-2">
              Log In
            </button></Link>
            <Link to="/signup" className='text-indigo-700 '><button className="block border-indigo-700 bg-white text-indigo-700 hover:bg-indigo-600 hover:text-white transition-colors py-2">
              Sign Up
            </button></Link>

          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:hidden py-2 space-y-2`}
        >
          <Link
            to="/"
            className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
          >
            Home
          </Link>
          <Link
            to="/upload"
            className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
          >
            Upload
          </Link>
          <Link
            to="/record"
            className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
          >
            Record
          </Link>
          <Link
            to="/contact"
            className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
            onClick={handleContactClick}
          >
            Contact
          </Link>
          <Link
            to="/about"
            className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
            onClick={handleAboutClick}
          >
            About
          </Link>
          <Link to="/login" className='text-white '><button className="block bg-indigo-600 text-white hover:bg-white hover:text-indigo-600 transition-colors py-2">
              Log In
            </button></Link>
            <Link to="/signup" className='text-indigo-700 '><button className="block border-indigo-700 bg-white text-indigo-700 hover:bg-indigo-600 hover:text-white transition-colors py-2">
              Sign Up
            </button></Link>
        </div>
      </div>
    </nav>
  );
}
