import express from "express";
import { getConnection } from "../config/db.js";
import { ObjectId } from "mongodb";

const router = express.Router();

const topicMap = {
  temp1: "GasDigital/SenseHarvest",
  hum1: "Humidity/SenseHarvest",
  soil1: "SoilDigital/SenseHarvest",
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
  const sensorName = {
    temp1: "Temperature",
    hum1: "Humidity",
    soil1: "Soil Moisture",
    gas1: "Gas",
  }[sensorId];

  if (!topic || !sensorName) {
    return res.status(400).json({ error: "Invalid sensorId" });
  }

  try {
    const db = getConnection(); 
    const collection = db.collection("sensordata");

    const cursor = collection
      .find({ topic, "payload.name": sensorName })
      .sort({ _id: -1 })
      .limit(50);

    const docs = await cursor.toArray();

    const data = docs
      .map(doc => {
        const found = doc.payload.find(p => p.name === sensorName);
        return found
          ? {
              timestamp: found.lastUpdated ?? new ObjectId(doc._id).getTimestamp(),
              value: found.value,
            }
          : null;
      })
      .filter(Boolean)
      .reverse();

    return res.json(data);
  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
