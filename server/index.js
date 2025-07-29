import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { initializeAuth } from "./betterAuth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

async function startServer() {
    await connectDB();

    const { auth, toNodeHandler } = initializeAuth();

    app.use(express.json());
    app.use(cors());

    app.use("/api/auth", toNodeHandler(auth));

    app.get("/", (req, res) => {
        res.send("Hello Express! This is the backend of Harvest Moon.");
    });

    // Error handling middleware (optional, but good practice)
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send("Something broke!");
    });

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`JWT Secret Loaded: ${!!process.env.JWT_SECRET}`);
    });
}

startServer();