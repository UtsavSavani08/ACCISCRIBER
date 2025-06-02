import React from 'react'


export default function BottomBar() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false); // Close mobile menu after clicking
    }
  };
  return (
    <footer className="bg-gray-200 text-black py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Section */}
          <div>
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Deserta, cursive' }}>ACCISCRIBE</h2>
            <p className="text-gray-600 text-sm">
              Transforming audio and video content into accessible text with AI-powered transcription.
            </p>
          </div>

          {/* Product Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/features"onClick={(e) => {
                e.preventDefault();
                scrollToSection('features');
              }} className="hover:text-gray-600 text-indigo-600 transition-colors">Features</a></li>
              <li><a href="/pricing" className="hover:text-gray-600 text-indigo-600 transition-colors">Pricing</a></li>
              <li><a href="/documentation" className="hover:text-gray-600 text-indigo-600 transition-colors">Documentation</a></li>
            </ul>
          </div>

          {/* Company Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/"onClick={(e) => {
                e.preventDefault();
                scrollToSection('about');
              }} className="hover:text-gray-600 text-indigo-600 transition-colors">About</a></li>
              <li><a href="/blog" className="hover:text-gray-600 text-indigo-600 transition-colors">Blog</a></li>
              <li><a href="/" onClick={(e) => {
                e.preventDefault();
                scrollToSection('contact');
              }} className="hover:text-gray-600 text-indigo-600 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/privacy" className="hover:text-gray-600 text-indigo-600 transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-gray-600 text-indigo-600 transition-colors">Terms of Service</a></li>
              <li><a href="/cookie-policy" className="hover:text-gray-600 text-indigo-600 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-600 text-sm">
          <p>© 2025 ACCISCRIBE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
