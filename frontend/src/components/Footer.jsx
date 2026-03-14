import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-gray-800 bg-gray-900/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Portfolio. All rights reserved.
        </p>
        <div className="flex gap-6 text-gray-400">
          <a href="www.linkedin.com/in/hrudhaya-sankalp-bb77b12bb" className="hover:text-blue-400 transition-colors text-2xl" aria-label="LinkedIn"><FaLinkedin /></a>
          <a href="https://github.com/Hrudhayasankalp" className="hover:text-white transition-colors text-2xl" aria-label="GitHub"><FaGithub /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
