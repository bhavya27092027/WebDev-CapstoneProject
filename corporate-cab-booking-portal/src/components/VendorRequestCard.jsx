import React, { useState, useEffect } from 'react';
import { Clock, MapPin, User, Car, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const VendorRequestCard = ({ request, onAccept, onReject, onOpenMarket }) => {
  const [timeLeft, setTimeLeft] = useState(request.slaMinutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryLabel = (category) => {
    const categories = {
      sedan: 'Sedan (4 seats)',
      suv: 'SUV (6-7 seats)',
      luxury: 'Luxury (Premium)',
      mini: 'Mini (Compact)'
    };
    return categories[category] || category;
  };

  const isUrgent = timeLeft < 300; 

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg shadow-sm border-2 p-6 ${isUrgent ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
        }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 font-['Poppins']">
            New Booking Request
          </h3>
          <p className="text-sm text-gray-600 font-['Lato']">
            From: {request.companyName}
          </p>
        </div>
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${isUrgent ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
          <Clock className="h-4 w-4" />
          <span className="font-['Lato']">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {isUrgent && (
        <div className="flex items-center space-x-2 mb-4 p-3 bg-red-100 rounded-md">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-800 font-['Lato']">
            Urgent: SLA expires soon!
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span className="font-['Lato']">{request.guestName}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Car className="h-4 w-4" />
            <span className="font-['Lato']">{getCategoryLabel(request.carCategory)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-gray-600 font-['Lato']">
            <strong>Date:</strong> {request.date}
          </div>
          <div className="text-sm text-gray-600 font-['Lato']">
            <strong>Time:</strong> {request.time}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-start space-x-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div className="font-['Lato']">
            <div><strong>From:</strong> {request.pickupLocation}</div>
            <div><strong>To:</strong> {request.dropoffLocation}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <button
          onClick={() => onAccept(request.id)}
          className="flex-1 bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200 font-['Lato']"
        >
          Accept Request
        </button>
        <button
          onClick={() => onReject(request.id)}
          className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 font-['Lato']"
        >
          Reject
        </button>
        <button
          onClick={() => onOpenMarket(request.id)}
          className="flex-1 bg-slate-400 text-white px-4 py-2 rounded-md hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-colors duration-200 font-['Lato']"
        >
          Open Market
        </button>
      </div>
    </motion.div>
  );
};

export default VendorRequestCard;