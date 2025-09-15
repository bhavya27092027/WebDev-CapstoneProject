import React from 'react';
import { Car, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-indigo-700 p-2 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white font-['Poppins']">CabPortal</h2>
            </div>
            <p className="text-gray-400 mb-4 max-w-md font-['Lato']">
              Streamlining corporate travel with reliable cab booking solutions.
              Connecting companies with trusted vendors for seamless transportation.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-['Poppins']">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors duration-200 font-['Lato']">About Us</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors duration-200 font-['Lato']">Services</a></li>
              <li><a href="#support" className="text-gray-400 hover:text-white transition-colors duration-200 font-['Lato']">Support</a></li>
              <li><a href="#privacy" className="text-gray-400 hover:text-white transition-colors duration-200 font-['Lato']">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-['Poppins']">
              Contact Info
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400 font-['Lato']">support@cabportal.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400 font-['Lato']">+91 9965476436</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400 font-['Lato']">India , IN</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm font-['Lato']">
            © 2025 CabPortal. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;