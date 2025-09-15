import React, { useState } from 'react';
import { Menu, X, Car, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ userRole, onLogout, currentUser }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = userRole === 'company'
    ? [
      { name: 'Dashboard', href: '#Dashboard' },
      { name: 'Book Cab', href: '#BookCab' },
      { name: 'My Bookings', href: '#MyBookings' }
    ]
    : [
      { name: 'Dashboard', href: '#dashboard' },
      { name: 'Live Requests', href: '#requests' },
      { name: 'All Bookings', href: '#bookings' },
      { name: 'Drivers', href: '#drivers' },
      { name: 'Vehicles', href: '#vehicles' }
    ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-indigo-700 p-2 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 font-['Poppins']">CabPortal</h1>
                <p className="text-xs text-gray-500 capitalize">{userRole} Dashboard</p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-indigo-700 px-3 py-2 text-sm font-medium transition-colors duration-200 font-['Lato']"
              >
                {item.name}
              </a>
            ))}
            <div className="flex items-center space-x-4 ml-8 pl-8 border-l border-gray-200">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 font-['Lato']">{currentUser}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors duration-200"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-['Lato']">Logout</span>
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-gray-50 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-indigo-700 block px-3 py-2 text-base font-medium font-['Lato']"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="border-t border-gray-200 pt-4 pb-3">
                  <div className="flex items-center px-3 mb-3">
                    <User className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700 font-['Lato']">{currentUser}</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="flex items-center space-x-2 text-gray-500 hover:text-red-600 px-3 py-2 text-base font-medium transition-colors duration-200 font-['Lato']"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;