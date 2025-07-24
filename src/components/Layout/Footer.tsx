import React from "react";
import { Link } from "react-router-dom";

export const Footer = (): JSX.Element => {
  return (
    <footer className="bg-gray-900 text-white py-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Project Info */}
          <div className="space-y-4">
              <h3 className="text-2xl font-bold text-[#4A90E2]">Rentiva</h3>
            <p className="text-gray-300 leading-relaxed">
              This website is a school project built to demonstrate web development skills. All content and data are for educational purposes only.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/vehicles" className="text-gray-300 hover:text-white transition-colors">
                  Vehicles
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Project Note */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">About This Project</h4>
            <p className="text-gray-300">
              Created by students for a web development course. Not a real business.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Rentiva. School project. No rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};