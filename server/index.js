import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectDB, getConnection } from "./config/db.js";
import { initializePassport } from "./auth.js";
import sensorRoutes from "./routes/sensors.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

async function startServer() {
    await connectDB();
    initializePassport();

    app.use(cors());
    app.use(express.json());
    app.use(passport.initialize());

    // --- Authentication Routes ---

    // REGISTRATION ROUTE
    app.post("/api/auth/register", async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }
        try {
            const db = getConnection();
            const users = db.collection('users');
            const existingUser = await users.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists." });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await users.insertOne({ email, password: hashedPassword });
            res.status(201).json({ message: "User created successfully" });
        } catch (err) {
            res.status(500).json({ message: "Server error during registration." });
        }
    });

    // LOGIN ROUTE
    app.post("/api/auth/login", (req, res, next) => {
        passport.authenticate('local', { session: false }, (err, user, info) => {
            if (err || !user) {
                return res.status(400).json({
                    message: info ? info.message : 'Login failed'
                });
            }
            req.login(user, { session: false }, (err) => {
                if (err) {
                    res.send(err);
                }
                const payload = { id: user._id, email: user.email };
                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
                return res.json({ token });
            });
        })(req, res, next);
    });

    app.get("/api/auth/me", passport.authenticate('jwt', { session: false }), (req, res) => {
        const { password, ...userWithoutPassword } = req.user;
        res.json(userWithoutPassword);
    });

    app.use("/api/sensors", sensorRoutes);

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

startServer();