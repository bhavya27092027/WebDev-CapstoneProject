import React from "react";

const VendorCard = ({ vendor, onDelete, onToggle }) => {
  return (
    <div className="border p-4 rounded shadow bg-white flex justify-between items-center">
      <div>
        <h3 className="font-bold">{vendor.name} ({vendor.company || "No Company"})</h3>
        <p>Email: {vendor.email}</p>
        <p>Phone: {vendor.phone || "N/A"}</p>
        <p>Status: {vendor.available ? "✅ Available" : "❌ Unavailable"}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onToggle(vendor)} className="bg-yellow-500 text-white px-3 py-1 rounded">
          Toggle Availability
        </button>
        <button onClick={() => onDelete(vendor._id)} className="bg-red-600 text-white px-3 py-1 rounded">
          Delete
        </button>
      </div>
    </div>
  );
};

export default VendorCard;
