import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectDB, getConnection } from "./config/db.js";
import { initializePassport } from "./auth.js";
import sensorRoutes from "./routes/sensors.js";
import inventory from "./routes/inventory.js";
import employees from "./routes/employees.js";
import events from "./routes/events.js";
import employeeLogRoutes from "./routes/employeeLog.js";
import adminRoutes from "./routes/admin.js";
import User from "./models/User.js";

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
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required." });
    }
    try {
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Username or email already exists." });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        username,
        email,
        password: hashedPassword,
        role: role || "employee",
      };
      await User.create(newUser);
      res.status(201).json({
        message:
          "User registered successfully. Your account is pending approval.",
      });
    } catch (err) {
      res.status(500).json({ message: "Server error during registration." });
    }
  });

  // LOGIN ROUTE
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: info ? info.message : "Login failed",
        });
      }

      // Check user status
      if (user.status === "pending") {
        return res
          .status(401)
          .json({ message: "Your account is pending approval." });
      }
      if (user.status === "rejected") {
        return res
          .status(401)
          .json({ message: "Your account has been rejected." });
      }

      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }
        const payload = { id: user._id, email: user.email, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        return res.json({ token });
      });
    })(req, res, next);
  });

  app.post("/api/employees", async (req, res) => {
        const { uid, name, department = "Default" } = req.body;

        if (!uid || !name) {
            return res.status(400).json({ message: "UID and name are required." });
        }

        try {
            const db = getConnection();
            const employees = db.collection("employees");

            const normalizeUID = (uid) => uid.trim().toUpperCase().replace(/\s+/g, " ");
            const normalizedUID = normalizeUID(uid);

            const exists = await employees.findOne({ uid: normalizedUID });
            if (exists) {
            return res.status(400).json({ message: "UID already registered" });
            }

            await employees.insertOne({ uid: normalizedUID, cardId: normalizedUID, name, department });
            res.status(201).json({ message: "Employee registered" });
        } catch (error) {
            console.error("Registration error:", error);
            res.status(500).json({ message: "Failed to register employee" });
        }
    });

  app.get(
    "/api/auth/me",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { password, ...userWithoutPassword } = req.user;
      res.json(userWithoutPassword);
    }
  );

  app.use("/api/sensors", sensorRoutes);
  app.use("/api/inventory", inventory);
  app.use("/api/employees", employees);
  app.use("/api/events", events);
  app.use("/api/employees/logs", employeeLogRoutes);
  app.use("/api/admin", adminRoutes);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer();
