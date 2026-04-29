import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import channelRoutes from "./routes/channels.js";
import webhookRoutes from "./routes/webhooks.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Raw body parser — needed to capture exact webhook payloads
app.use((req, res, next) => {
  let data = "";
  req.setEncoding("utf8");
  req.on("data", (chunk) => (data += chunk));
  req.on("end", () => {
    req.rawBody = data;
    try {
      req.body = JSON.parse(data);
    } catch {
      req.body = data;
    }
    next();
  });
});

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "DELETE"],
  })
);

// Routes
app.use("/api/channels", channelRoutes);
app.use("/h", webhookRoutes); // webhook capture endpoint

// Health check
app.get("/", (req, res) => res.json({ ok: true }));

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/webhookx")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
