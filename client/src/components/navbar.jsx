import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";
import { createClient } from "@supabase/supabase-js";
import { FiMusic, FiVideo, FiMic } from "react-icons/fi";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const NavLink = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
  >
    {children}
    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
  </Link>
);

const ProfileButton = ({ user, showMenu, onClick }) => (
  <button
    onClick={onClick}
    className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-semibold transform transition-all duration-200 hover:scale-105 hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
    aria-expanded={showMenu}
    aria-haspopup="true"
  >
    {user.email[0].toUpperCase()}
  </button>
);

const ProfileMenu = ({ user, onLogout }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
    className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-50"
  >
    <div className="p-3 border-b border-gray-100">
      <p className="text-sm font-medium text-gray-700">{user.email}</p>
      <p className="text-xs text-gray-500 mt-1">Logged in user</p>
    </div>
    <div className="py-1">
      <Link
        to="/history"
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors group"
      >
        <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        History
      </Link>
      <button
        onClick={onLogout}
        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors group"
      >
        <svg className="w-4 h-4 mr-3 text-red-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>
    </div>
  </motion.div>
);

const MobileNavLink = ({ to, onClick, children }) => (
  <motion.div
    whileHover={{ x: 10 }}
    whileTap={{ scale: 0.95 }}
  >
    <Link
      to={to}
      onClick={onClick}
      className="block text-gray-700 hover:text-blue-600 transition-colors duration-200 py-3 border-b border-gray-100 last:border-0"
    >
      {children}
    </Link>
  </motion.div>
);

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showMobileTools, setShowMobileTools] = useState(false);
  const menuTimeoutRef = useRef(null);
  const menuRef = useRef(null);
  const toolsMenuRef = useRef(null);

  // Profile menu outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target)) {
        setShowToolsMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Profile menu auto-hide
  useEffect(() => {
    const handleAutoHide = () => {
      if (showProfileMenu) {
        menuTimeoutRef.current = setTimeout(() => setShowProfileMenu(false), 3000);
      }
    };
    handleAutoHide();
    return () => clearTimeout(menuTimeoutRef.current);
  }, [showProfileMenu]);

  const handleMouseEnter = () => clearTimeout(menuTimeoutRef.current);
  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => setShowProfileMenu(false), 3000);
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Tools menu click handler (desktop)
  const handleToolsClick = () => {
    setShowToolsMenu((prev) => !prev);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => setUser(session?.user || null)
    );
    return () => authListener?.subscription.unsubscribe();
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
      setIsMenuOpen(false);
    }
  };

  const handleSectionNavigation = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname === "/") {
      scrollToSection(sectionId);
    } else {
      navigate("/", { state: { scrollTo: sectionId } });
    }
  };

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full bg-white bg-opacity-100 backdrop-blur-sm shadow-lg z-50"
    >
      <div className="max-w-full md:container mx-auto px-2 md:px-4" onClick={scrollToTop}>
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2 group py-2">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={logo} 
              alt="LogoCaption"
              className="h-16 w-auto"
            />
            <motion.span
              className="text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold"
              style={{ fontFamily: "Deserta, cursive" }}
              whileHover={{ scale: 1.05 }}
            >
              ACCISCRIBE
            </motion.span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <div
              className="relative"
              ref={toolsMenuRef}
              tabIndex={0}
            >
              <button
                className="flex items-center bg-white text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium focus:outline-none"
                tabIndex={-1}
                type="button"
                onClick={handleToolsClick}
              >
                Tools
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showToolsMenu && (
                <div className="absolute left-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                  <Link
                    to="/audio-to-text"
                    className="flex items-center gap-2 px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors rounded-t-lg"
                  >
                    <FiMusic className="text-blue-500" /> Audio to Text
                  </Link>
                  <Link
                    to="/video-to-text"
                    className="flex items-center gap-2 px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    <FiVideo className="text-indigo-500" /> Video to Text
                  </Link>
                  <Link
                    to="/record"
                    className="flex items-center gap-2 px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors rounded-b-lg"
                  >
                    <FiMic className="text-red-500" /> Recording to Text
                  </Link>
                  <Link
                    to="/live-transcribe"
                    className="flex items-center gap-2 px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors rounded-b-lg"
                  >
                    <FiMic className="text-red-500" /> Live transcribe
                  </Link>
                </div>
              )}
            </div>
            <NavLink to="/contact" onClick={(e) => handleSectionNavigation(e, "contact")}>Contact</NavLink>
            <NavLink to="/Documents" onClick={scrollToTop}>Docs</NavLink>
            {/* <NavLink to="/languages-supported">Languages</NavLink> */}
            <NavLink to="/pricing" onClick={scrollToTop}>Pricing</NavLink>

            {!user ? (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
                  >
                    Log In
                  </motion.button>
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-indigo-600 text-indigo-600 px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-indigo-50"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            ) : (
              <div className="relative" ref={menuRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <ProfileButton
                  user={user}
                  showMenu={showProfileMenu}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                />
                <AnimatePresence>
                  {showProfileMenu && <ProfileMenu user={user} onLogout={handleLogout} />}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Nav Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 top-20 bg-white z-40 md:hidden overflow-y-auto"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="px-4 py-6 space-y-1"
              >
                {/* Tools Dropdown for Mobile */}
                <div className="mb-2">
                  <button
                    className="flex items-center w-full text-gray-700 hover:text-blue-600 font-medium py-3 border-b border-gray-100"
                    onClick={() => setShowMobileTools((prev) => !prev)}
                  >
                    Tools
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {showMobileTools && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pl-4"
                      >
                        <MobileNavLink to="/audio-to-text">
                          <span className="flex items-center gap-2">
                            <FiMusic className="text-blue-500" /> Audio to Text
                          </span>
                        </MobileNavLink>
                        <MobileNavLink to="/video-to-text">
                          <span className="flex items-center gap-2">
                            <FiVideo className="text-indigo-500" /> Video to Text
                          </span>
                        </MobileNavLink>
                        <MobileNavLink to="/record">
                          <span className="flex items-center gap-2">
                            <FiMic className="text-red-500" /> Recording to Text
                          </span>
                        </MobileNavLink>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <MobileNavLink to="/documents" onClick={scrollToTop}>Docs</MobileNavLink>
                <MobileNavLink to="/pricing" onClick={scrollToTop}>Pricing</MobileNavLink>
                <MobileNavLink to="/contact" onClick={(e) => handleSectionNavigation(e, "contact")}>Contact</MobileNavLink>
                {/* <MobileNavLink to="/languages-supported">Languages</MobileNavLink> */}

                {!user ? (
                  <div className="flex flex-col space-y-3 pt-6">
                    <Link to="/login" className="w-full">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
                      >
                        Log In
                      </motion.button>
                    </Link>
                    <Link to="/signup" className="w-full">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="w-full border-2 border-indigo-600 text-indigo-600 py-3 rounded-xl font-medium transition-all duration-200 hover:bg-indigo-50"
                      >
                        Sign Up
                      </motion.button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4 pt-6 border-t border-gray-100 mt-6">
                    <Link
                      to="/history"
                      className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors py-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">History</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 text-red-600 hover:text-red-700 transition-colors w-full py-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
