import React from "react";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-16 pb-8 mt-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

      
        <div>
          <h3 className="text-2xl font-bold mb-4">FoodLovers</h3>
          <p className="text-indigo-100">
            Delivering happiness in every bite. Connect with us and explore delicious meals, exclusive offers, and more.
          </p>
        </div>


        <div>
          <h4 className="text-xl font-semibold mb-4 border-b border-white/30 pb-2">Company</h4>
          <ul className="space-y-2">
            <li>
              <Link className="hover:text-green-400 transition-colors" to="/About">About Us</Link>
            </li>
            <li>
              <Link className="hover:text-green-400 transition-colors" to="/Contact">Contact</Link>
            </li>
            <li>
              <Link className="hover:text-green-400 transition-colors" to="/faq">FAQ</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-4 border-b border-white/30 pb-2">Follow Us</h4>
          <div className="flex gap-4 mt-2">
            <a href="https://www.linkedin.com/in/mohammadjashimuddinrubel/" target="_blank" rel="noopener noreferrer" className="p-3 bg-indigo-500 rounded-full hover:bg-green-400 transition-all duration-300 shadow-lg">
              <FaLinkedin className="w-5 h-5 text-white" />
            </a>
            <a href="https://github.com/MdJashim18" target="_blank" rel="noopener noreferrer" className="p-3 bg-indigo-500 rounded-full hover:bg-green-400 transition-all duration-300 shadow-lg">
              <FaGithub className="w-5 h-5 text-white" />
            </a>
            <a href="https://www.facebook.com/share/1BEhor8qZ6/" target="_blank" rel="noopener noreferrer" className="p-3 bg-indigo-500 rounded-full hover:bg-green-400 transition-all duration-300 shadow-lg">
              <FaFacebook className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>

      </div>

      <div className="mt-12 border-t border-white/20 pt-6 text-center text-indigo-100 text-sm">
        &copy; {new Date().getFullYear()} FoodLovers. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
