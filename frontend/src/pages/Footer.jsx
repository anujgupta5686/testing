// Footer.js
import React from "react";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-wrap justify-between">
        <div className="w-full md:w-1/3 mb-6 md:mb-0">
          <Link to={"/"}>
            <img src={logo} alt="Logo" loading="lazy" width={170} />
          </Link>
          <p className="mt-3 text-gray-400 text-sm leading-relaxed">
            Your go-to platform for amazing experiences. Stay connected and
            explore our offerings.
          </p>
        </div>

        <div className="w-full md:w-1/3 mb-6 md:mb-0">
          <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link to="/" className="hover:text-gray-100 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-gray-100 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-gray-100 transition">
                Services
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-gray-100 transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="w-full md:w-1/3">
          <h3 className="text-lg font-semibold mb-4 text-white">
            Subscribe to Our Newsletter
          </h3>
          <form className="flex flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-l-md outline-none bg-gray-800 text-white placeholder-gray-400 w-full sm:w-auto"
            />
            <button className="bg-blue-600 text-white px-5 py-2 rounded-r-md hover:bg-blue-500 transition">
              Subscribe
            </button>
          </form>

          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-6 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Your Company. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
