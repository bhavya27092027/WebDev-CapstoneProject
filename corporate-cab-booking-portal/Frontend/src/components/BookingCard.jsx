import React from "react";

const BookingCard = ({ booking, onStatusChange, onDelete, userRole }) => {
  const {
    _id,
    passengerName,
    phone,
    pickupLocation,
    dropLocation,
    date,
    time,
    carCategory,
    status,
    vendorId, // should be populated { _id, name, email }
  } = booking;

  const handleStatus = (e) => {
    onStatusChange(_id, e.target.value);
  };

  return (
    <div className="border rounded p-4 shadow hover:shadow-md transition">
      <h3 className="font-bold text-lg">{passengerName}</h3>
      <p>Phone: {phone}</p>
      <p>Pickup: {pickupLocation}</p>
      <p>Dropoff: {dropLocation}</p>
      <p>
        Date: {date} | Time: {time}
      </p>
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

      {/* Status dropdown for vendor */}
      {userRole === "vendor" && vendorId?._id && (
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
      {vendorId && (
        <p className="mt-2 text-green-600">
          Assigned to {vendorId.name} ({vendorId.email})
        </p>
      )}
    </div>
  );
};

export default BookingCard;
