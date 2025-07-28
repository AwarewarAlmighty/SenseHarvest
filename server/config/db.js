const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI from environment variables
    await mongoose.connect(process.env.MONGODB_URI, {
      // These options are recommended for new connections to avoid deprecation warnings
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully!"); // Log success message
  } catch (err) {
    console.error("MongoDB connection error:", err.message); // Log error message
    // Exit process with failure
    process.exit(1); // Exits the Node.js process if connection fails
  }
};

module.exports = connectDB; // Export the connection function
