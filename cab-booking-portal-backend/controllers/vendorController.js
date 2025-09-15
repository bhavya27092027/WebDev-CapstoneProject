import Vendor from "../models/Vendor.js";

export const createVendor = async (req, res) => {
  try {
    const v = await Vendor.create(req.body);
    res.status(201).json(v);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(vendor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
