import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin.jobsPosted"
  },
  scheduledAt: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    default: 60
  },
  interviewType: {
    type: String,
    enum: ["Technical", "HR", "Managerial", "Final"],
    default: "Technical"
  },
  meetingLink: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Cancelled", "Rescheduled"],
    default: "Scheduled"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for better query performance
interviewSchema.index({ userId: 1, adminId: 1 });
interviewSchema.index({ scheduledAt: 1 });

// Update the updatedAt field before saving
interviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;