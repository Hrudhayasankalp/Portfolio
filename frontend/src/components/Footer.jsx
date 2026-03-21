import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-gray-800 bg-gray-900/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 text-center md:text-left">
        <div className="space-y-2">
          <p className="text-white font-bold text-lg mb-1">Portfolio<span className="text-blue-500">.</span></p>
          <p className="text-gray-400 text-sm max-w-xs">
            © {new Date().getFullYear()} All rights reserved. Built with passion and code.
          </p>
        </div>
        <div className="flex gap-8 text-gray-400">
          <a href="https://www.linkedin.com/in/hrudhaya-sankalp-bb77b12bb/" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors text-2xl" aria-label="LinkedIn"><FaLinkedin /></a>
          <a href="https://github.com/Hrudhayasankalp" target="_blank" rel="noreferrer" className="hover:text-white transition-colors text-2xl" aria-label="GitHub"><FaGithub /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
