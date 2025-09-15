import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, MapPin, Car, User } from 'lucide-react';
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

const BookingForm = ({ onBookingCreated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(bookingSchema)
  });

  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return null; // Only logged-in users

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:5173/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (res.ok) {
        onBookingCreated(result.booking); // Add new booking to UI
        reset();
        alert('Booking created successfully!');
      } else {
        alert(result.message || 'Failed to create booking');
      }
    } catch (err) {
      console.error(err);
      alert('Server error while creating booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const carCategories = [
    { value: 'sedan', label: 'Sedan (4 seats)' },
    { value: 'suv', label: 'SUV (6-7 seats)' },
    { value: 'luxury', label: 'Luxury (Premium)' },
    { value: 'mini', label: 'Mini (Compact)' }
  ];

  return (
    <motion.div className="bg-white rounded-lg shadow-sm border p-6">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input {...register('guestName')} placeholder="Guest Name" className="border p-2 rounded" />
          <input {...register('guestPhone')} placeholder="Phone Number" className="border p-2 rounded" />
          <input {...register('pickupLocation')} placeholder="Pickup Location" className="border p-2 rounded" />
          <input {...register('dropoffLocation')} placeholder="Drop-off Location" className="border p-2 rounded" />
          <input {...register('date')} type="date" min={new Date().toISOString().split('T')[0]} className="border p-2 rounded" />
          <input {...register('time')} type="time" className="border p-2 rounded" />
          <select {...register('carCategory')} className="border p-2 rounded">
            <option value="">Select Car Category</option>
            {carCategories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <input {...register('referenceName')} placeholder="Reference Name (Optional)" className="border p-2 rounded" />
          <textarea {...register('specialInstructions')} placeholder="Special Instructions (Optional)" className="border p-2 rounded md:col-span-2" />
        </div>
        <button type="submit" disabled={isSubmitting} className="bg-indigo-700 text-white px-4 py-2 rounded">
          {isSubmitting ? 'Booking...' : 'Book Cab'}
        </button>
      </form>
    </motion.div>
  );
};

export default BookingForm;
