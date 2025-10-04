import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { uploadResume } from "../controllers/uploadpdf.js";
import multer from "multer";

const router = express.Router();
const upload = multer(); // store file in memory for pdf-parse

router.post("/uploadResume", protect, upload.single("resume"), uploadResume);

export default router;
