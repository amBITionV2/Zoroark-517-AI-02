import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    trim: true,
  },
  jobDescription: {
    type: String,
    required: true,
    trim: true,
  },
  salary: {
    type: String, 
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  experienceRequired: {
    type: String, 
    required: true,
  },
  skillsRequired: {
    type: [String],
    default: [],
  },
  jobType: {
    type: String,
    enum: ["Full-time", "Part-time", "Internship", "Contract", "Remote"],
    default: "Full-time",
  },
  applicationDeadline: {
    type: Date,
  },
  hackerRankLink: {
    type: String,
    default: "",
  },
  mcqDifficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Medium",
  },
  mcqQuestions: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },

    companyName: { type: String, required: true, trim: true },
    companyWebsite: { type: String, trim: true },
    companyLocation: { type: String, trim: true },
    companyDescription: { type: String, trim: true },

    position: {
      type: String,
      required: true,
      enum: ["HR Manager", "Recruiter", "Admin", "Talent Acquisition", "Other"],
      default: "HR Manager",
    },
    department: { type: String, trim: true },
    contactNumber: { type: String, trim: true },

    profileImage: { type: String, default: "" },
    linkedinProfile: { type: String, trim: true },
    role: { type: String, enum: ["admin", "hr", "recruiter"], default: "hr" },

    appliedUsers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" } // users who applied
    ],

    // 🧩 Jobs posted by this admin
    jobsPosted: [jobSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);