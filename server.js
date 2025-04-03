require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000", "https://elms-tau.vercel.app"],
  methods: ["GET", "POST", "PUT", "PATCH"],
  credentials: true,
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/test", (req, res) => res.json({ message: "Server is running" }));

const leaveRoutes = require("./routes/leaveRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const leaveBalanceRoutes = require("./routes/leaveBalanceRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/admin", adminRoutes);
app.use("/api/leaves/admin", adminRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/leave-balances", leaveBalanceRoutes);

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/elms";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(`MongoDB Connection Error: ${err}`));

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server on ${PORT}`));