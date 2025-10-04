import User from "../modules/usermodule.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../modules/adminmodule.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

// SIGNUP
export const signup = async (req, res) => {
  try {
    // Handle both JSON and multipart/form-data requests
    let userData;
    let resumeFile = null;
    
    if (req.file) {
      // Multipart/form-data request (with file)
      userData = req.body;
      resumeFile = req.file;
      
      // Parse skills if it's a string
      if (typeof userData.skills === 'string') {
        userData.skills = JSON.parse(userData.skills);
      }
    } else {
      // JSON request (without file)
      userData = req.body;
    }

    const {
      fullName,
      email,
      mobile,
      gender,
      dob,
      qualification,
      experience,
      skills,
      portfolio,
      about,
      newPassword,
      confirmPassword
    } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if passwords match
    if (newPassword === confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Create new user
    const user = new User({
      fullName,
      email,
      mobile,
      gender,
      dob,
      qualification,
      experience,
      skills,
      portfolio,
      about,
      newPassword: hashedPassword,
      confirmPassword: hashedPassword,
    });

    // Handle resume upload if provided
    if (resumeFile) {
      try {
        // Extract text from PDF
        const dataBuffer = resumeFile.buffer;
        const pdfData = await pdfParse(dataBuffer);
        
        // Save file + extracted text in DB
        user.resume = {
          data: dataBuffer,
          contentType: resumeFile.mimetype,
          fileName: resumeFile.originalname,
          size: resumeFile.size,
        };
        user.resumeText = pdfData.text;
      } catch (parseError) {
        console.error("Error parsing PDF:", parseError);
        // Continue with registration even if PDF parsing fails
      }
    }

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.newPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// User applies for a job
export const applyForJob = async (req, res) => {
  try {
    const { adminId } = req.params;          // Admin ID from URL
    const userId = req.user._id;             // User ID from token

    // Find admin
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Check if user already applied
    if (admin.appliedUsers.includes(userId)) {
      return res.status(400).json({ message: "User already applied" });
    }

    // Add user to admin's appliedUsers
    admin.appliedUsers.push(userId);
    await admin.save();

    // Optional: Add job info to user's appliedJobs
    const job = admin.jobsPosted[0]; // replace with logic to get specific job if needed
    const user = await User.findById(userId);
    user.appliedJobs.push({
      jobId: job._id,
      adminId: admin._id,
      role: job.role,
      companyName: admin.companyName,
    });
    await user.save();

    res.status(200).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all jobs posted by all admins
export const getAllJobs = async (req, res) => {
  try {
    // Fetch all admins and their jobs
    const admins = await Admin.find({}, "companyName jobsPosted");

    // Combine all jobs with company info
    let jobs = [];
    admins.forEach((admin) => {
      admin.jobsPosted.forEach((job) => {
        jobs.push({
          adminId: admin._id,
          companyName: admin.companyName,
          jobId: job._id,
          role: job.role,
          jobDescription: job.jobDescription,
          salary: job.salary,
          location: job.location,
          experienceRequired: job.experienceRequired,
          skillsRequired: job.skillsRequired,
          jobType: job.jobType,
          applicationDeadline: job.applicationDeadline,
        });
      });
    });

    res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
// Get all jobs applied by the user
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("appliedJobs.adminId", "companyName");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, appliedJobs: user.appliedJobs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};