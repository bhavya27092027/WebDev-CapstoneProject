import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BookingCard from "../components/BookingCard";

const API_URL = "http://localhost:5000/api/bookings";

const Vendors = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  console.log("Current user:", user);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setBookings(data);
      else toast.error(data.message || "Failed to fetch bookings");
    } catch {
      toast.error("Server error while fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAssignBooking = async (bookingId) => {
    try {
      const res = await fetch(`${API_URL}/${bookingId}/assign`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Booking assigned to you!");
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, status: "assigned", vendorId: user } : b
          )
        );
      } else toast.error(data.message || "Failed to assign booking");
    } catch {
      toast.error("Server error while assigning booking");
    }
  };

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
      if (res.ok) {
        toast.success("Booking status updated!");
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
        );
      } else toast.error(data.message || "Failed to update status");
    } catch {
      toast.error("Server error while updating status");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h2 className="text-xl font-bold font-['Poppins']">Available Bookings</h2>

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map((booking) => {
            const isAssignedToVendor = booking.vendorId?._id === user._id;

            return (
              <div key={booking._id} className="border p-3 rounded-lg">
                <BookingCard booking={booking} onStatusChange={handleStatusChange} userRole="vendor" />

                {/* Assign button */}
                {booking.status === "pending" && !isAssignedToVendor && user.role === "vendor" && (
                  <button
                    onClick={() => handleAssignBooking(booking._id)}
                    className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Assign to Me
                  </button>
                )}

                {/* Update status buttons */}
                {isAssignedToVendor && (
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => handleStatusChange(booking._id, "completed")}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handleStatusChange(booking._id, "rejected")}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {/* Assigned badge */}
                {isAssignedToVendor && <p className="mt-2 text-green-600 font-semibold">Assigned to you</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Vendors;

