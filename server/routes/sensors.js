import express from "express";
import passport from "passport";
import { getConnection } from "../config/db.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Middleware to check for admin role
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admins only' });
  }
};

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
  const { range = "realtime", from, to } = req.query;

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

    const query = { topic, "payload.name": sensorName };
    if (from && to) {
      query._id = {
        $gte: ObjectId.createFromTime(new Date(from).getTime() / 1000),
        $lte: ObjectId.createFromTime(new Date(to).getTime() / 1000),
      };
    }

    const cursor = collection
      .find(query)
      .sort({ _id: -1 })
      .limit(range === "realtime" ? 50 : 500); // Larger limit for historical data

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

// Get sensor settings
router.get(
  "/settings",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req, res) => {
    try {
      const db = getConnection();
      const settings = await db.collection("settings").findOne();
      res.json(settings?.thresholds || {});
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Update sensor settings
router.put(
  "/settings",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req, res) => {
    const { thresholds } = req.body;
    try {
      const db = getConnection();
      await db
        .collection("settings")
        .updateOne({}, { $set: { thresholds } }, { upsert: true });
      res.json({ message: "Settings updated successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;
