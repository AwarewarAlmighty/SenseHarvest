// Type: ES Module
import express from "express";
const router = express.Router();

import Inventory from "../models/Inventory.js";

// Get all items
router.get("/", async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add an item
router.post("/", async (req, res) => {
  const newItem = new Inventory({
    item: req.body.item,
    place: req.body.place,
    amount: req.body.amount,
  });

  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an item's place and/or amount
router.put("/:id", async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Item's not found, bruh!" });
    }
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an item
router.delete("/:id", async (req, res) => {
  try {
    const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item's not found, yeah!" });
    }
    res.json({ message: "Item deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
