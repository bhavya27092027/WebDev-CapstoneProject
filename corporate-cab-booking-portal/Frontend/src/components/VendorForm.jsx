import React, { useState } from "react";

const VendorForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    available: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ name: "", company: "", email: "", phone: "", available: true });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 p-4 border rounded bg-gray-50">
      <input className="border p-2" placeholder="Name" name="name" value={form.name} onChange={handleChange} required />
      <input className="border p-2" placeholder="Company" name="company" value={form.company} onChange={handleChange} />
      <input className="border p-2" type="email" placeholder="Email" name="email" value={form.email} onChange={handleChange} required />
      <input className="border p-2" placeholder="Phone" name="phone" value={form.phone} onChange={handleChange} />
      <label className="flex items-center space-x-2">
        <input type="checkbox" name="available" checked={form.available} onChange={handleChange} />
        <span>Available</span>
      </label>
      <button type="submit" className="bg-green-600 text-white p-2 rounded">Add Vendor</button>
    </form>
  );
};

export default VendorForm;
