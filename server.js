require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
console.log("Starting app...");
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://elms-tau.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  if (req.method === "OPTIONS") {
      return res.status(200).send();
  }
  
  next();
});
app.use(express.json());
app.use(cors({
  origin: ["https://elms-tau.vercel.app"],
  methods: ["GET", "POST", "PUT", "PATCH"],
  credentials: true,
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
 
console.log("Middleware set up");

a
app.get("/test", (req, res) => {
  console.log("Hit /test route");
  res.json({ message: "Server is running" });
});

console.log("Loading routes...");
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

console.log("Routes loaded");

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/elms";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(`MongoDB Connection Error: ${err}`));

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server on ${PORT}`));