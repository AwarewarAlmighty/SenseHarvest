import express from "express";
import { getConnection } from "../config/db.js";
import { isAdmin } from "../auth.js";
import { ObjectId } from "mongodb";
import passport from "passport";

const router = express.Router();

// Middleware to protect all routes in this file
router.use(passport.authenticate("jwt", { session: false }), isAdmin);

// Get all users with pending status
router.get("/pending-users", async (req, res) => {
  try {
    const db = getConnection();
    const users = await db
      .collection("users")
      .find({ status: "pending" })
      .toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Approve a user
router.put("/users/:id/approve", async (req, res) => {
  try {
    const db = getConnection();
    const result = await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { status: "approved" } }
      );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User approved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Reject a user
router.put("/users/:id/reject", async (req, res) => {
  try {
    const db = getConnection();
    const result = await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { status: "rejected" } }
      );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User rejected successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
