import Admin from "../modules/adminmodule.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../modules/usermodule.js"; // ✅ THIS WAS MISSING
// ✅ Signup Controller
export const registerAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      companyName,
      companyWebsite,
      companyLocation,
      companyDescription,
      position,
      department,
      contactNumber,
      profileImage,
      linkedinProfile,
    } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      companyName,
      companyWebsite,
      companyLocation,
      companyDescription,
      position,
      department,
      contactNumber,
      profileImage,
      linkedinProfile,
    });

    await newAdmin.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newAdmin._id, role: newAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        companyName: newAdmin.companyName,
        position: newAdmin.position,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Login Controller
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    res.status(200).json({
      message: "Login successful",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        companyName: admin.companyName,
        position: admin.position,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const postJob = async (req, res) => {
  try {
    const adminId = req.admin._id; // use admin from token
    const {
      role,
      jobDescription,
      salary,
      location,
      experienceRequired,
      skillsRequired,
      jobType,
      applicationDeadline,
    } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const newJob = {
      role,
      jobDescription,
      salary,
      location,
      experienceRequired,
      skillsRequired,
      jobType,
      applicationDeadline,
    };

    admin.jobsPosted.push(newJob);
    await admin.save();

    res.status(201).json({ message: "Job posted successfully", job: newJob });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Admin gets all applicants for a specific job
export const getApplicantsForJob = async (req, res) => {
  try {
    const { adminId, jobId } = req.params; // Admin ID and Job ID
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Find the job in admin's jobsPosted
    const job = admin.jobsPosted.id(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Get all users who applied
    const applicants = await User.find({ _id: { $in: admin.appliedUsers } }).select(
      "fullName email mobile skills experience"
    );

    res.status(200).json({
      success: true,
      job: {
        _id: job._id,
        role: job.role,
        companyName: admin.companyName,
      },
      applicants,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


export const getApplicantDetails = async (req, res) => {
  try {
    const { adminId, jobId, userId } = req.params;

    // Check admin exists
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Check job exists
    const job = admin.jobsPosted.id(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Check user applied
    if (!admin.appliedUsers.includes(userId)) {
      return res.status(400).json({ message: "User did not apply for this job" });
    }

    // Fetch full user details
    const user = await User.findById(userId).select("-newPassword -confirmPassword");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get resume text for a user
export const getResumeText = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user with resume text
    const user = await User.findById(userId).select("resumeText");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has resume text
    if (!user.resumeText) {
      return res.status(404).json({ message: "User has not uploaded a resume" });
    }

    res.status(200).json({
      success: true,
      resumeText: user.resumeText
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};