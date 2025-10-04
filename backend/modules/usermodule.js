import mongoose from "mongoose";

const appliedJobSchema = new mongoose.Schema({
  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: "Admin.jobsPosted" // reference for clarity
  },
  adminId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: "Admin" 
  },
  role: { type: String },
  companyName: { type: String },
  appliedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  dob: { type: Date },
  qualification: { type: String, required: true },
  experience: { type: String, required: true },
  skills: { type: [String], default: [], required: true },
  portfolio: { type: String },
  resume: {
    data: Buffer,
    contentType: String,
    fileName: String,
    size: Number,
  },
  resumeText: { type: String },
  about: { type: String },
  newPassword: { type: String },
  confirmPassword: { type: String },
  createdAt: { type: Date, default: Date.now },

  // 🧩 Track applied jobs
  appliedJobs: [appliedJobSchema],
});

// Ensure the resumeText field is included when converting to JSON
userSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    // Remove sensitive fields
    delete ret.newPassword;
    delete ret.confirmPassword;
    return ret;
  }
});

const User = mongoose.model("User", userSchema);
export default User;