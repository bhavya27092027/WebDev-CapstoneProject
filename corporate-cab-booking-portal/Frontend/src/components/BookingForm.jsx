import React, { useState } from "react";

const BookingForm = ({ onBookingCreated }) => {
  const [formData, setFormData] = useState({
    passengerName: "",
    phone: "",
    pickupLocation: "",
    dropLocation: "",
    date: "",
    time: "",
    carCategory: "",
    referenceName: "",
    specialInstructions: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Booking failed");
        return;
      }

      alert("Booking created successfully!");
      if (onBookingCreated) onBookingCreated(result);

      // Reset form
      setFormData({
        passengerName: "",
        phone: "",
        pickupLocation: "",
        dropLocation: "",
        date: "",
        time: "",
        carCategory: "",
        referenceName: "",
        specialInstructions: "",
      });
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg">
      <input
        type="text"
        name="passengerName"
        placeholder="Guest Name"
        value={formData.passengerName}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded-lg"
      />
      <input
        type="text"
        name="phone"
        placeholder="Guest Phone"
        value={formData.phone}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded-lg"
      />
      <input
        type="text"
        name="pickupLocation"
        placeholder="Pickup Location"
        value={formData.pickupLocation}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded-lg"
      />
      <input
        type="text"
        name="dropLocation"
        placeholder="Dropoff Location"
        value={formData.dropLocation}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded-lg"
      />
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded-lg"
      />
      <input
        type="time"
        name="time"
        value={formData.time}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded-lg"
      />

      {/* Car Category Dropdown */}
      <select
        name="carCategory"
        value={formData.carCategory}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded-lg"
      >
        <option value="">Select Car Category</option>
        <option value="Sedan">Sedan</option>
        <option value="SUV">SUV</option>
        <option value="Hatchback">Hatchback</option>
        <option value="Luxury">Luxury</option>
      </select>

      <input
        type="text"
        name="referenceName"
        placeholder="Reference Name"
        value={formData.referenceName}
        onChange={handleChange}
        className="w-full border p-2 rounded-lg"
      />
      <textarea
        name="specialInstructions"
        placeholder="Special Instructions"
        value={formData.specialInstructions}
        onChange={handleChange}
        className="w-full border p-2 rounded-lg"
      />

      <button
        type="submit"
        className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
      >
        Create Booking
      </button>
    </form>
  );
};

export default BookingForm;
