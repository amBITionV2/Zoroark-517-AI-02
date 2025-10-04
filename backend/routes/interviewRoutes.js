import express from "express";
import { 
  scheduleInterview,
  getAdminInterviews,
  getInterviewById,
  updateInterview,
  cancelInterview,
  getUserInterviews,
  getUpcomingInterviews
} from "../controllers/interviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminProtect } from "../middleware/adminProtect.js";

const router = express.Router();

// Admin routes for managing interviews
router.post("/admin/schedule", adminProtect, scheduleInterview);
router.get("/admin/interviews", adminProtect, getAdminInterviews);
router.get("/admin/interviews/:interviewId", adminProtect, getInterviewById);
router.put("/admin/interviews/:interviewId", adminProtect, updateInterview);
router.delete("/admin/interviews/:interviewId/cancel", adminProtect, cancelInterview);

// User routes for viewing interviews
router.get("/user/interviews", protect, getUserInterviews);
router.get("/user/upcoming", protect, getUpcomingInterviews);

// Admin can also get upcoming interviews
router.get("/admin/upcoming", adminProtect, getUpcomingInterviews);

export default router;