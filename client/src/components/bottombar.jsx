import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // <-- Add this import

export default function BottomBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    product: [
      { name: 'Pricing', to: '/pricing'},
      { name: 'Documentation', to: '/documents'  },
      { name: 'Languages Supported', to: '/languages-supported' },
    ],
    company: [
      { name: 'About', to: '/', onClick: () => scrollToSection('about') },
      { name: 'Blog', to: '/blog' },
      { name: 'Contact', to: '/', onClick: () => scrollToSection('contact') }
    ],
    legal: [
      { name: 'Privacy Policy', to: '/privacypolicy' },
      { name: 'Terms of Service', to: '/terms-of-service' },
      { name: 'Cookie Policy', to: '/cookie-policy' }
    ]
  };

  const FooterSection = ({ title, links }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold tracking-wide text-gray-800">{title}</h3>
      <ul className="space-y-3">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              to={link.to}
              onClick={() => setTimeout(scrollToTop, 0)}
              className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 text-sm flex items-center gap-1"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 
              className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent" 
              style={{ fontFamily: 'Deserta, cursive' }}
            >
              ACCISCRIBE
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
              Transforming audio and video content into accessible text with AI-powered transcription.
            </p>
          </motion.div>

          <FooterSection title="Product" links={footerLinks.product} />
          <FooterSection title="Company" links={footerLinks.company} />
          <FooterSection title="Legal" links={footerLinks.legal} />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="border-t border-gray-200 mt-12 pt-8 text-center"
        >
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} ACCISCRIBE. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
