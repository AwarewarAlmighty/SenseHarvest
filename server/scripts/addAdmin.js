import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

// Configure dotenv to load environment variables from the server directory
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const addAdmin = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Admin user details
    const adminData = {
      username: "admin",
      email: "admin@example.com",
      password: "$2b$10$en9s/KuqWfZucwumYGvXWOA4bLoPSnj/q0L8deCaV0P8HwA.UUQgi",
      role: "admin",
    };

    // Check if the admin user already exists
    const existingUser = await User.findOne({
      $or: [{ email: adminData.email }, { username: adminData.username }],
    });

    if (existingUser) {
      console.log("Admin user already exists.");
      return;
    }

    // Create and save the new admin user
    const newUser = new User(adminData);
    await newUser.save();
    console.log("Admin user created successfully!");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

addAdmin();
