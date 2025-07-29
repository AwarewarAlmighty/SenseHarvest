const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(cors());

const authRoutes = require("./routes/auth");

app.use("/api/auth", authRoutes);

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
