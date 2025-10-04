import express from "express";
import { 
  createMCQTest,
  getAdminMCQTests,
  getMCQTestById,
  updateMCQTest,
  deleteMCQTest,
  getMCQTestForUser,
  submitMCQTestResult,
  getUserMCQResults,
  getMCQTestResults
} from "../controllers/mcqController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminProtect } from "../middleware/adminProtect.js";

const router = express.Router();

// Admin routes for managing MCQ tests
router.route("/admin/tests")
  .post(adminProtect, createMCQTest)
  .get(adminProtect, getAdminMCQTests);

router.route("/admin/tests/:testId")
  .get(adminProtect, getMCQTestById)
  .put(adminProtect, updateMCQTest)
  .delete(adminProtect, deleteMCQTest);

// Admin route to get results for a specific test
router.get("/admin/tests/:testId/results", adminProtect, getMCQTestResults);

// User routes for taking MCQ tests
router.get("/tests/:testId", protect, getMCQTestForUser);
router.post("/tests/:testId/results", protect, submitMCQTestResult);
router.get("/user/results", protect, getUserMCQResults);

export default router;