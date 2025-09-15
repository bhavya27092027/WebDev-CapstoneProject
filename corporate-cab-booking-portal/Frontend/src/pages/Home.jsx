import React, { useEffect, useState } from 'react';
import BookingCard from '../components/BookingCard.jsx';
import BookingForm from '../components/BookingForm.jsx';
import { toast } from 'react-toastify';

const Home = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;
  const userRole = user?.role;

  // Fetch bookings from backend
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5173/api/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setBookings(data);
      } else {
        toast.error(data.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error while fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle new booking submission
  const handleBookingSubmit = async (bookingData) => {
    try {
      const res = await fetch('http://localhost:5173/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success('Booking created!');
        setBookings((prev) => [data, ...prev]);
      } else {
        toast.error(data.message || 'Failed to create booking');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error while creating booking');
    }
  };

  // Handle status change (for vendor)
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const res = await fetch(
        `http://localhost:5173/api/bookings/${bookingId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
        );
        toast.success('Booking status updated!');
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error while updating status');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Dashboard Section */}
      <section id="Dashboard">
        {/* Existing content can go here if needed */}
      </section>

      {/* Booking Form Section (only for company) */}
      {userRole === 'company' && (
        <section id="BookCab">
          <BookingForm onSubmit={handleBookingSubmit} isSubmitting={false} />
        </section>
      )}

      {/* My Bookings Section */}
      <section id="MyBookings">
        <h2 className="text-xl font-bold font-['Poppins']">
          {userRole === 'vendor' ? 'All Bookings Assigned to You' : 'Your Bookings'}
        </h2>

        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onStatusChange={handleStatusChange}
                userRole={userRole}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;




