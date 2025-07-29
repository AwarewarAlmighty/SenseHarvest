import mongoose from "mongoose";

let connection;

const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI from environment variables
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options are recommended for new connections to avoid deprecation warnings
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully!"); // Log success message
    connection = conn.connection;
  } catch (err) {
    console.error("MongoDB connection error:", err.message); // Log error message
    // Exit process with failure
    process.exit(1); // Exits the Node.js process if connection fails
  }
};

const getConnection = () => connection;

export { connectDB, getConnection };