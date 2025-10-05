import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from './routes/user.js'
import { databaseConnection } from "./database/db.js";
import adminRoutes from "./routes/admin.js";
import resumeRoutes from "./routes/resumeroute.js";
import mcqRoutes from "./routes/mcqRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import transcriptRoutes from "./routes/transcriptRoutes.js"; // ADD THIS LINE

dotenv.config();

const app = express();

// Add CORS middleware - allow all origins for development
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/mcq", mcqRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/transcript", transcriptRoutes); // ADD THIS LINE

app.get("/", (req, res) => {
  res.send("Hello World from Node.js with import!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await databaseConnection();
  console.log(`🚀 Server running on port ${PORT}`);
});