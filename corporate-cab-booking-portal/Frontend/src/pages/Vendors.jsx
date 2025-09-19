import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import VendorForm from "../components/VendorForm";
import VendorCard from "../components/VendorCard";

const API_URL = "http://localhost:5000/api/vendors";

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setVendors(data);
    } catch (err) {
      toast.error("Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleAddVendor = async (formData) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Failed to add vendor");

      toast.success("Vendor added");
      fetchVendors();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return toast.error("Failed to delete vendor");

      toast.success("Vendor deleted");
      fetchVendors();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggleAvailability = async (vendor) => {
    try {
      const res = await fetch(`${API_URL}/${vendor._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...vendor, available: !vendor.available }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Failed to update");

      toast.success("Vendor status updated");
      fetchVendors();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Manage Vendors</h2>

      {/* VendorForm */}
      <VendorForm onSubmit={handleAddVendor} />

      {loading ? (
        <p>Loading vendors...</p>
      ) : (
        <div className="space-y-3">
          {vendors.map((vendor) => (
            <VendorCard
              key={vendor._id}
              vendor={vendor}
              onDelete={handleDelete}
              onToggle={handleToggleAvailability}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Vendors;
