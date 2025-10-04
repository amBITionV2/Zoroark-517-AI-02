import express from "express";
import { registerAdmin, loginAdmin, postJob, getApplicantsForJob, getApplicantDetails, getResumeText } from "../controllers/admincontroller.js";
import { adminProtect } from "../middleware/adminProtect.js";


const router = express.Router();

router.post("/signup", registerAdmin);
router.post("/login", loginAdmin);
router.post("/post-job", adminProtect, postJob);
router.get("/:adminId/job/:jobId/applicants", adminProtect, getApplicantsForJob);
router.get("/:adminId/job/:jobId/applicant/:userId", adminProtect, getApplicantDetails);
router.get("/user/:userId/resume-text", adminProtect, getResumeText); // New route

export default router;