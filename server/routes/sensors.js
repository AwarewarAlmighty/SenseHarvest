import express from "express";
import { getConnection } from "../config/db.js";
import { ObjectId } from "mongodb";

const router = express.Router();

const topicMap = {
  temp1: "Humidity/SenseHarvest",
  hum1: "Humidity/SenseHarvest",
  soil1: "Soil/SenseHarvest",
  gas1: "CO2/SenseHarvest",
};

const valueKeyMap = {
  temp1: "temperature",
  hum1: "humidity",
  soil1: "moisture",   
  gas1: "co2",         
};  

router.get("/", (req, res) => {
  res.send("Sensor API root endpoint");
});

router.get("/:sensorId", async (req, res) => {
  const { sensorId } = req.params;
  const { range = "realtime" } = req.query;

  const topic = topicMap[sensorId];
  const valueKey = valueKeyMap[sensorId];

  if (!topic || !valueKey) {
    return res.status(400).json({ error: "Invalid sensorId" });
  }

  try {
    const db = getConnection(); 
    const collection = db.collection("sensorData");

    const cursor = collection
      .find({ topic, [`payload.${valueKey}`]: { $exists: true } })
      .sort({ _id: -1 })
      .limit(50);

    const docs = await cursor.toArray();

    const data = docs.map(doc => ({
      timestamp: doc.payload?.timestamp ?? new ObjectId(doc._id).getTimestamp(),
      value: doc.payload?.[valueKey] ?? 0,
    })).reverse();

    return res.json(data);
  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
