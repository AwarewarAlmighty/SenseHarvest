import mongoose from "mongoose";

const SensorDataSchema = new mongoose.Schema({
  topic: String,
  payload: {
    value: Number,
  },
}, { timestamps: true });

export const SensorData = mongoose.model("SensorData", SensorDataSchema);
