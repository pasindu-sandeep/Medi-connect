import { useState, useEffect } from "react";

const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div>
            <h3 className="text-xl font-bold text-yellow-400 mb-2">
              MediConnect
            </h3>
            <p className="text-sm text-gray-300">
              Book appointments with trusted doctors, access lab tests and
              packages, and manage your health seamlessly from one platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="hover:text-yellow-400 cursor-pointer">
                Book Appointment
              </li>
              <li className="hover:text-yellow-400 cursor-pointer">Doctors</li>
              <li className="hover:text-yellow-400 cursor-pointer">
                Health Packages
              </li>
              <li className="hover:text-yellow-400 cursor-pointer">Pharmacy</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="hover:text-yellow-400 cursor-pointer">FAQ</li>
              <li className="hover:text-yellow-400 cursor-pointer">
                Privacy Policy
              </li>
              <li className="hover:text-yellow-400 cursor-pointer">
                Terms & Conditions
              </li>
              <li className="hover:text-yellow-400 cursor-pointer">Support</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Contact Us</h4>
            <p className="text-sm text-gray-300">No. 123 Health Road</p>
            <p className="text-sm text-gray-300">Colombo, Sri Lanka</p>
            <p className="text-sm text-gray-300 mt-2">Phone: +94 77 123 4567</p>
            <p className="text-sm text-gray-300">
              Email: support@mediconnect.lk
            </p>
          </div>
        </div>

        <div className="text-center py-4 border-t border-gray-700 text-sm text-gray-400">
          © {new Date().getFullYear()} MediConnect. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Footer;
