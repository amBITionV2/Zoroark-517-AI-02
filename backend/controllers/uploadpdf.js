import User from "../modules/usermodule.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

// Upload resume
export const uploadResume = async (req, res) => {
  try {
    const userId = req.user._id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Extract text from PDF
    const dataBuffer = file.buffer;
    const pdfData = await pdfParse(dataBuffer);

    // Save file + extracted text in DB
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    user.resume = {
      data: dataBuffer,
      contentType: file.mimetype,
      fileName: file.originalname,
      size: file.size,
    };
    user.resumeText = pdfData.text;
    await user.save();

    res.status(200).json({ message: "Resume uploaded and text extracted", resumeText: pdfData.text });
  } catch (error) {
    console.error("Resume upload error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};