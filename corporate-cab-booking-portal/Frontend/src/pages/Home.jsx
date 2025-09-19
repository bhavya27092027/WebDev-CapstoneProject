import React, { useEffect, useState } from "react";
import BookingCard from "../components/BookingCard";
import BookingForm from "../components/BookingForm";
import { toast } from "react-toastify";

const Home = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]); // For company role

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
      if (res.ok) {
        const transformed = data.map((b) => ({
          ...b,
          guestName: b.passengerName,
          guestPhone: b.phone,
          dropoffLocation: b.dropLocation,
        }));
        setBookings(transformed);
      } else {
        toast.error(data.message || "Failed to fetch bookings");
      }
    } catch {
      toast.error("Server error while fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  // Fetch vendors (company only)
  const fetchVendors = async () => {
    if (userRole !== "company") return;
    try {
      const res = await fetch("http://localhost:5000/api/users/vendors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setVendors(data);
    } catch {
      toast.error("Failed to fetch vendors");
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchVendors();
  }, []);

  // Company: assign vendor
  const assignVendor = async (bookingId, vendorId) => {
    try {
      const res = await fetch(`${API_URL}/assign-vendor/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vendorId }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Vendor assigned!");
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, vendorId: data.vendorId } : b
          )
        );
      } else toast.error(data.message || "Failed to assign vendor");
    } catch {
      toast.error("Server error while assigning vendor");
    }
  };

  // Vendor: self-assign
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

  // Create booking
  const handleBookingSubmit = async (bookingData) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Booking created!");
        const transformed = {
          ...data,
          guestName: data.passengerName,
          guestPhone: data.phone,
          dropoffLocation: data.dropLocation,
        };
        setBookings((prev) => [transformed, ...prev]);
      } else toast.error(data.message || "Failed to create booking");
    } catch {
      toast.error("Server error while creating booking");
    }
  };

  // Update status
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
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, status: newStatus } : b
          )
        );
        toast.success("Booking status updated!");
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
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to delete booking");
      }
    } catch {
      toast.error("Server error while deleting booking");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {userRole === "company" && (
        <BookingForm onBookingCreated={handleBookingSubmit} />
      )}

      <section>
        <h2 className="text-xl font-bold font-['Poppins']">
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
                    <p className="mt-2 text-green-600 font-semibold">
                      Assigned to you
                    </p>
                  )}

                  {/* Company assign dropdown */}
                  {userRole === "company" && booking.status === "pending" && (
                    <div className="mt-2">
                      <select
                        onChange={(e) =>
                          assignVendor(booking._id, e.target.value)
                        }
                        defaultValue=""
                        className="p-2 border rounded"
                      >
                        <option value="" disabled>
                          Select vendor
                        </option>
                        {vendors.map((v) => (
                          <option key={v._id} value={v._id}>
                            {v.name} ({v.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Show assigned vendor */}
                  {booking.vendorId && (
                    <p className="mt-2 text-green-600">
                      Assigned to {booking.vendorId.name} (
                      {booking.vendorId.email})
                    </p>
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
