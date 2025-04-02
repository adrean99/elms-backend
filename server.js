require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://elms-tau.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  allowE103: true,
});

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

app.set("io", io);
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/elms";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(`MongoDB Connection Error: ${err}`));

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => console.log(`Server on ${PORT}`));