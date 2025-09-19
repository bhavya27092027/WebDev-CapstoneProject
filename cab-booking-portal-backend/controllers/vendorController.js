import Vendor from "../models/Vendor.js";

// GET all vendors
export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({ companyId: req.user._id }); 
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch vendors" });
  }
};

// CREATE vendor
export const createVendor = async (req, res) => {
  try {
    const vendor = new Vendor({
      ...req.body,
      companyId: req.user._id, // attach company
    });
    const saved = await vendor.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE vendor (edit or toggle availability)
export const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json(vendor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE vendor
export const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json({ message: "Vendor deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
