import React from "react";

const BookingCard = ({ booking, onStatusChange, onDelete, userRole }) => {
  const {
    _id,
    guestName,
    guestPhone,
    pickupLocation,
    dropoffLocation,
    date,
    time,
    carCategory,
    status,
    assignedVendor,
  } = booking;

  const handleStatus = (e) => {
    onStatusChange(_id, e.target.value);
  };

  return (
    <div className="border rounded p-4 shadow hover:shadow-md transition">
      <h3 className="font-bold text-lg">{guestName}</h3>
      <p>Phone: {guestPhone}</p>
      <p>Pickup: {pickupLocation}</p>
      <p>Dropoff: {dropoffLocation}</p>
      <p>Date: {date} | Time: {time}</p>
      <p>Car Category: {carCategory}</p>
      <p>
        Status:{" "}
        <span
          className={`font-semibold ${
            status === "pending"
              ? "text-yellow-500"
              : status === "completed"
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {status}
        </span>
      </p>

      {/* Status update only for vendor */}
      {userRole === "vendor" && (
        <select
          value={status}
          onChange={handleStatus}
          className="mt-2 p-1 border rounded w-full"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      )}

      {/* Delete button only for company */}
      {userRole === "company" && (
        <button
          onClick={() => onDelete(_id)}
          className="mt-2 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Delete Booking
        </button>
      )}

      {/* Show assigned vendor */}
      {assignedVendor && (
        <p className="mt-2 text-green-600">
          Assigned to {assignedVendor.name || assignedVendor.email}
        </p>
      )}
    </div>
  );
};

export default BookingCard;
