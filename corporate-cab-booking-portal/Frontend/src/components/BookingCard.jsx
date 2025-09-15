import React from 'react';
import { Calendar, Clock, MapPin, User, Car } from 'lucide-react';
import { motion } from 'framer-motion';

const BookingCard = ({ booking, onStatusChange, userRole }) => {
  const getStatusColor = status => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-emerald-100 text-emerald-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = category => ({
    sedan: 'Sedan (4 seats)',
    suv: 'SUV (6-7 seats)',
    luxury: 'Luxury (Premium)',
    mini: 'Mini (Compact)'
  }[category] || category);

  return (
    <motion.div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-bold">Booking #{booking.id}</h3>
      <span className={`inline px-2 py-0.5 rounded text-xs ${getStatusColor(booking.status)}`}>
        {booking.status}
      </span>
      <p><User className="inline" /> {booking.guestName}</p>
      <p><Car className="inline" /> {getCategoryLabel(booking.carCategory)}</p>
      <p><Calendar className="inline" /> {booking.date} <Clock className="inline" /> {booking.time}</p>
      <p><MapPin className="inline" /> From: {booking.pickupLocation} To: {booking.dropoffLocation}</p>

      {/* Vendor actions */}
      {userRole === 'vendor' && booking.status === 'confirmed' && (
        <button onClick={() => onStatusChange(booking.id, 'ongoing')} className="bg-green-500 text-white px-2 py-1 rounded mt-2">Start Trip</button>
      )}
      {userRole === 'vendor' && booking.status === 'ongoing' && (
        <button onClick={() => onStatusChange(booking.id, 'completed')} className="bg-gray-600 text-white px-2 py-1 rounded mt-2">End Trip</button>
      )}
    </motion.div>
  );
};

export default BookingCard;
