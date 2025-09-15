import React from 'react';
import { Calendar, Clock, MapPin, User, Car, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const BookingCard = ({ booking, onStatusChange, userRole }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-emerald-100 text-emerald-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 font-['Poppins']">
            Booking #{booking.id}
          </h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>
        {userRole === 'company' && (
          <div className="text-sm text-gray-500 font-['Lato']">
            {booking.companyName}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span className="font-['Lato']">{booking.guestName}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span className="font-['Lato']">{booking.guestPhone}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Car className="h-4 w-4" />
            <span className="font-['Lato']">{getCategoryLabel(booking.carCategory)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span className="font-['Lato']">{booking.date}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="font-['Lato']">{booking.time}</span>
          </div>
          {booking.driverName && (
            <div className="text-sm text-gray-600 font-['Lato']">
              Driver: {booking.driverName}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-start space-x-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div className="font-['Lato']">
            <div><strong>From:</strong> {booking.pickupLocation}</div>
            <div><strong>To:</strong> {booking.dropoffLocation}</div>
          </div>
        </div>
      </div>

      {userRole === 'vendor' && booking.status === 'confirmed' && (
        <div className="flex space-x-2">
          <button
            onClick={() => onStatusChange(booking.id, 'ongoing')}
            className="flex-1 bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200 text-sm font-['Lato']"
          >
            Start Trip
          </button>
        </div>
      )}

      {userRole === 'vendor' && booking.status === 'ongoing' && (
        <div className="flex space-x-2">
          <button
            onClick={() => onStatusChange(booking.id, 'completed')}
            className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 text-sm font-['Lato']"
          >
            End Trip
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default BookingCard;