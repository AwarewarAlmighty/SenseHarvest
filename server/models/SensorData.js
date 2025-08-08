const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  sensorId: {
    type: String,
    required: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed, // Can be a number, string, etc.
    required: true,
  },
  status: {
    type: String,
    enum: ["normal", "warning", "critical"],
    required: true,
  },
  // Add other fields as needed, e.g., location, type, etc.
});

module.exports = mongoose.model("SensorData", sensorDataSchema);