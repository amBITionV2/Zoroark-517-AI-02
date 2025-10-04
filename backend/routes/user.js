import express from "express";
import { signup, login, applyForJob, getAllJobs, getAppliedJobs } from "../controllers/usercontroller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/:adminId/apply", protect, applyForJob);
router.get("/jobs", protect, getAllJobs);

// Get all applied jobs
router.get("/applied-jobs", protect, getAppliedJobs);

router.get("/profile", protect, (req, res) => {
  res.json({
    success: true,
    message: "Profile fetched successfully",
    user: req.user,
  });
});

export default router;
