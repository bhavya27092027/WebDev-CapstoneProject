import React, { useEffect, useState } from "react";
import BookingCard from "../components/BookingCard";
import BookingForm from "../components/BookingForm";
import { toast } from "react-toastify";

const Home = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  const userRole = user?.role;

  const API_URL = "http://localhost:5000/api/bookings";

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok || res.status === 200) setBookings(data);
      else toast.error(data.message || "Failed to fetch bookings");
    } catch {
      toast.error("Server error while fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  // Vendor assign booking
  const handleAssignBooking = async (bookingId) => {
    try {
      const res = await fetch(`${API_URL}/${bookingId}/assign`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok || res.status === 200) {
        toast.success("Booking assigned to you!");
        fetchBookings();
      } else toast.error(data.message || "Failed to assign booking");
    } catch {
      toast.error("Server error while assigning booking");
    }
  };

  // Vendor update status
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok || res.status === 200) {
        toast.success("Status updated!");
        fetchBookings();
      } else toast.error(data.message || "Failed to update status");
    } catch {
      toast.error("Server error while updating status");
    }
  };

  // Delete booking
  const handleDeleteBooking = async (bookingId) => {
    try {
      const res = await fetch(`${API_URL}/${bookingId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Booking deleted!");
        fetchBookings();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to delete booking");
      }
    } catch {
      toast.error("Server error while deleting booking");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {userRole === "company" && <BookingForm onBookingCreated={fetchBookings} />}

      <section>
        <h2 className="text-xl font-bold">
          {userRole === "vendor" ? "Available Bookings" : "Your Bookings"}
        </h2>

        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((booking) => {
              const isAssignedToVendor =
                userRole === "vendor" && booking.vendorId?._id === user._id;

              return (
                <div key={booking._id} className="border p-3 rounded-lg">
                  <BookingCard
                    booking={booking}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteBooking}
                    userRole={userRole}
                  />

                  {/* Vendor self-assign */}
                  {userRole === "vendor" &&
                    booking.status === "pending" &&
                    !isAssignedToVendor && (
                      <button
                        onClick={() => handleAssignBooking(booking._id)}
                        className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Assign to Me
                      </button>
                    )}

                  {/* Vendor assigned badge */}
                  {userRole === "vendor" && isAssignedToVendor && (
                    <p className="mt-2 text-green-600 font-semibold">Assigned to you</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
