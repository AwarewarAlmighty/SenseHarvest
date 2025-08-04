import express from "express";
import { getConnection } from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const db = getConnection();
        const logs = await db.collection("employeesLog")
            .find()
            .sort({ "payload.timestamp": -1 })  
            .toArray();
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch logs" });
    }
});

router.post("/", async (req, res) => {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ message: "UID required" });

    try {
        const db = getConnection();
        const logs = db.collection("employeesLog");

        const lastEntry = await logs.find({ uid }).sort({ timestamp: -1 }).limit(1).toArray();
        const lastStatus = lastEntry.length > 0 ? lastEntry[0].status : "out";
        const newStatus = lastStatus === "in" ? "out" : "in";

        const newLog = {
            uid,
            status: newStatus,
            timestamp: new Date()
        };

        await logs.insertOne(newLog);
        res.status(201).json({ message: `Logged ${newStatus} for UID`, log: newLog });

    } catch (err) {
        res.status(500).json({ message: "Error logging event" });
    }
});

export default router;
