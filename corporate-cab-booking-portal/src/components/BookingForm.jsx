import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, MapPin, User, Car } from 'lucide-react';
import { motion } from 'framer-motion';

const bookingSchema = z.object({
  guestName: z.string().min(2, 'Guest name is required'),
  guestPhone: z.string().min(10, 'Valid phone number is required'),
  pickupLocation: z.string().min(5, 'Pickup location is required'),
  dropoffLocation: z.string().min(5, 'Drop-off location is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  carCategory: z.string().min(1, 'Car category is required'),
  referenceName: z.string().optional(),
  specialInstructions: z.string().optional()
});

const BookingForm = ({ onSubmit, isSubmitting }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(bookingSchema)
  });

  const carCategories = [
    { value: 'sedan', label: 'Sedan (4 seats)' },
    { value: 'suv', label: 'SUV (6-7 seats)' },
    { value: 'luxury', label: 'Luxury (Premium)' },
    { value: 'mini', label: 'Mini (Compact)' }
  ];

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Car className="h-5 w-5 text-indigo-700" />
        <h2 className="text-xl font-semibold text-gray-900 font-['Poppins']">Book a Cab</h2>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-['Lato']">
              <User className="inline h-4 w-4 mr-1" />
              Guest Name *
            </label>
            <input
              {...register('guestName')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-['Lato']"
              placeholder="Enter guest name"
            />
            {errors.guestName && (
              <p className="mt-1 text-sm text-red-600 font-['Lato']">{errors.guestName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-['Lato']">
              Guest Phone *
            </label>
            <input
              {...register('guestPhone')}
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-['Lato']"
              placeholder="Enter phone number"
            />
            {errors.guestPhone && (
              <p className="mt-1 text-sm text-red-600 font-['Lato']">{errors.guestPhone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-['Lato']">
              <MapPin className="inline h-4 w-4 mr-1" />
              Pickup Location *
            </label>
            <input
              {...register('pickupLocation')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-['Lato']"
              placeholder="Enter pickup address"
            />
            {errors.pickupLocation && (
              <p className="mt-1 text-sm text-red-600 font-['Lato']">{errors.pickupLocation.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-['Lato']">
              <MapPin className="inline h-4 w-4 mr-1" />
              Drop-off Location *
            </label>
            <input
              {...register('dropoffLocation')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-['Lato']"
              placeholder="Enter drop-off address"
            />
            {errors.dropoffLocation && (
              <p className="mt-1 text-sm text-red-600 font-['Lato']">{errors.dropoffLocation.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-['Lato']">
              <Calendar className="inline h-4 w-4 mr-1" />
              Date *
            </label>
            <input
              {...register('date')}
              type="date"
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-['Lato']"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600 font-['Lato']">{errors.date.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-['Lato']">
              <Clock className="inline h-4 w-4 mr-1" />
              Time *
            </label>
            <input
              {...register('time')}
              type="time"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-['Lato']"
            />
            {errors.time && (
              <p className="mt-1 text-sm text-red-600 font-['Lato']">{errors.time.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-['Lato']">
              Car Category *
            </label>
            <select
              {...register('carCategory')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-['Lato']"
            >
              <option value="">Select car category</option>
              {carCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.carCategory && (
              <p className="mt-1 text-sm text-red-600 font-['Lato']">{errors.carCategory.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-['Lato']">
              Reference Name
            </label>
            <input
              {...register('referenceName')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-['Lato']"
              placeholder="Optional reference"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-['Lato']">
              Special Instructions
            </label>
            <textarea
              {...register('specialInstructions')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-['Lato']"
              placeholder="Any special requirements..."
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-700 text-white px-6 py-2 rounded-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-['Lato']"
          >
            {isSubmitting ? 'Booking...' : 'Book Cab'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default BookingForm;