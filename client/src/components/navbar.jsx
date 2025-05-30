import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false); // Close mobile menu after clicking
    }
  };
  const handleContactClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      scrollToSection("contact");
    } else {
      navigate("/", { state: { scrollTo: "contact" } });
    }
  };

  const handleAboutClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      scrollToSection("about");
    } else {
      navigate("/", { state: { scrollTo: "about" } });
    }
  };
  // const handleProtectedRoute = async (path) => {
  //   const {
  //     data: { user },
  //   } = await supabase.auth.getUser();

  //   if (user) {
  //     navigate(path);
  //   } else {
  //     alert("Please log in to access this feature.");
  //     navigate("/login");
  //   }
  // };

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
              <span
                className="text-4xl text-gray-800 font-semibold"
                style={{ fontFamily: "Deserta, cursive" }}
              >
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
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/upload"
              className="text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => handleProtectedRoute("/upload")}
            >
              Upload
            </Link>
            <Link
              to="/record"
              className="text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => handleProtectedRoute("/record")}
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
            {!user ? (
              <>
                <Link to="/login">
                  <button className="bg-indigo-600 text-white hover:bg-white hover:text-indigo-600 transition-colors py-2 px-4 rounded-lg">
                    Log In
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="border-indigo-700 bg-white text-indigo-700 hover:bg-indigo-600 hover:text-white transition-colors py-2 px-4 rounded-lg">
                    Sign Up
                  </button>
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center"
                >
                  {user.email[0].toUpperCase()}
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                    <Link
                      to="/history"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      History
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
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
          {!user ? (
            <>
              <Link to="/login">
                <button className="bg-indigo-600 text-white hover:bg-white hover:text-indigo-600 transition-colors py-2 px-4 rounded">
                  Log In
                </button>
              </Link>
              <Link to="/signup">
                <button className="border-indigo-700 bg-white text-indigo-700 hover:bg-indigo-600 hover:text-white transition-colors py-2 px-4 rounded">
                  Sign Up
                </button>
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center"
              >
                {user.email[0].toUpperCase()}
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                  <Link
                    to="/history"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    History
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
