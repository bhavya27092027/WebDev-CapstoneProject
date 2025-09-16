import React, { useEffect, useState } from 'react';
import BookingCard from '../components/BookingCard.jsx';
import BookingForm from '../components/BookingForm.jsx';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom'; // ✅ ADDED

const Home = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;
  const userRole = user?.role;

  const API_URL = "http://localhost:5000/api/bookings";

  // Fetch bookings on mount or user/token change
  const fetchBookings = async () => {
    if (!token) return;

    try {
      setLoading(true);

      let url = API_URL;
      // Adjust query parameters based on role for backend filtering
      if (userRole === 'vendor') {
        url += '?assignedToMe=true';
      } else if (userRole === 'company') {
        url += '?createdByMe=true';
      } // admin sees all

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
  }, [token, userRole]);

  // Handle booking submission (company only)
  const handleBookingSubmit = async (bookingData) => {
    try {
      const res = await fetch(API_URL, {
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
        // Update local state to include new booking at the top
        setBookings(prev => [data, ...prev]);
      } else {
        toast.error(data.message || 'Failed to create booking');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error while creating booking');
    }
  };

  // Handle booking status update (vendor only)
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        setBookings(prev =>
          prev.map(b => (b.id === bookingId ? { ...b, status: newStatus } : b))
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

  // ✅ Redirect to login if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Role-Based Dashboard Header */}
      {userRole === 'admin' && (
        <section className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
          {/* Add admin-specific widgets or summary here */}
        </section>
      )}

      {userRole === 'company' && (
        <section className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Company Dashboard</h1>
          {/* Add company-specific info here */}
        </section>
      )}

      {userRole === 'vendor' && (
        <section className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Vendor Dashboard</h1>
          {/* Add vendor-specific info here */}
        </section>
      )}

      {/* Booking Form visible only for company */}
      {userRole === 'company' && (
        <section id="booking-form" className="mb-8">
          <BookingForm onBookingCreated={handleBookingSubmit} />
        </section>
      )}

      {/* Bookings List */}
      <section id="bookings-list">
        <h2 className="text-2xl font-semibold mb-4">
          {userRole === 'vendor'
            ? 'Bookings Assigned to You'
            : userRole === 'company'
            ? 'Your Bookings'
            : 'All Bookings'}
        </h2>

        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                userRole={userRole}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
