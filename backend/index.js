import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from './routes/user.js'
import { databaseConnection } from "./database/db.js";
import adminRoutes from "./routes/admin.js";
import resumeRoutes from "./routes/resumeroute.js";

dotenv.config();

const app = express();

// Add CORS middleware
app.use(cors({
  origin: "http://localhost:5173", // Frontend origin
  credentials: true
}));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/resume", resumeRoutes);

app.get("/", (req, res) => {
  res.send("Hello World from Node.js with import!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await databaseConnection(); // connect DB before serving requests
  console.log(`🚀 Server running on port ${PORT}`);
});