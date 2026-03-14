import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle smooth scroll for hash links when the location changes
  useEffect(() => {
    if (location.hash) {
      // Small delay to allow page rendering to finish before scrolling
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300); // Increased timeout significantly for cross-page navigation
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [location, location.key]); // Added location.key to trigger even on same hash clicks

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Skills", path: "/#skills" },
    { name: "Experience", path: "/#experience" },
    { name: "Education", path: "/#education" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "glass py-4 shadow-lg" : "bg-transparent py-4 md:py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tighter">
          <span className="text-white">Port</span>
          <span className="text-blue-500">folio</span>
          <span className="text-purple-500">.</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="relative text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              {(location.pathname === link.path || (location.pathname === '/' && location.hash === link.path.substring(1))) && (
                <motion.span
                  layoutId="underline"
                  className="absolute left-0 top-full block h-[2px] w-full bg-blue-500 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              {link.name}
            </Link>
          ))}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full border border-gray-700 bg-gray-800/50 hover:bg-gray-700 hover:border-gray-500 text-sm font-medium transition-all"
          >
            Resume
          </a>
        </nav>

        {/* Mobile Nav Toggle */}
        <div className="md:hidden flex items-center">
          <button className="text-gray-300 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
