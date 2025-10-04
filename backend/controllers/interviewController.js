import Interview from "../modules/interviewModel.js";
import User from "../modules/usermodule.js";
import Admin from "../modules/adminmodule.js";

// Admin schedules an interview
export const scheduleInterview = async (req, res) => {
  try {
    const adminId = req.admin._id;
    const {
      userId,
      jobId,
      scheduledAt,
      duration,
      interviewType,
      meetingLink,
      notes
    } = req.body;

    // Validate required fields
    if (!userId || !scheduledAt) {
      return res.status(400).json({ 
        message: "User ID and scheduled time are required" 
      });
    }

    // Validate date format
    const interviewDate = new Date(scheduledAt);
    if (isNaN(interviewDate.getTime())) {
      return res.status(400).json({ 
        message: "Invalid date format for scheduledAt" 
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        message: "User not found" 
      });
    }

    // Create interview
    const interview = new Interview({
      userId,
      adminId,
      jobId: jobId || null,
      scheduledAt: interviewDate,
      duration: duration || 60,
      interviewType: interviewType || "Technical",
      meetingLink: meetingLink || "",
      notes: notes || ""
    });

    await interview.save();

    // Populate user and admin details
    await interview.populate([
      { path: 'userId', select: 'fullName email' },
      { path: 'adminId', select: 'name companyName' }
    ]);

    res.status(201).json({
      message: "Interview scheduled successfully",
      interview
    });
  } catch (error) {
    console.error("Error scheduling interview:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Admin gets all interviews they scheduled
export const getAdminInterviews = async (req, res) => {
  try {
    const adminId = req.admin._id;
    const { status, userId } = req.query;

    // Build query
    const query = { adminId };
    if (status) query.status = status;
    if (userId) query.userId = userId;

    const interviews = await Interview.find(query)
      .populate('userId', 'fullName email')
      .populate('adminId', 'name companyName')
      .sort({ scheduledAt: 1 });

    res.status(200).json({
      success: true,
      interviews
    });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Admin gets a specific interview by ID
export const getInterviewById = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const adminId = req.admin._id;

    const interview = await Interview.findOne({ 
      _id: interviewId, 
      adminId 
    }).populate([
      { path: 'userId', select: 'fullName email' },
      { path: 'adminId', select: 'name companyName' }
    ]);

    if (!interview) {
      return res.status(404).json({ 
        message: "Interview not found or you don't have permission to access it" 
      });
    }

    res.status(200).json({
      success: true,
      interview
    });
  } catch (error) {
    console.error("Error fetching interview:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Admin updates an interview
export const updateInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const adminId = req.admin._id;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.userId;
    delete updateData.adminId;
    delete updateData.__v;

    // Validate date if provided
    if (updateData.scheduledAt) {
      const interviewDate = new Date(updateData.scheduledAt);
      if (isNaN(interviewDate.getTime())) {
        return res.status(400).json({ 
          message: "Invalid date format for scheduledAt" 
        });
      }
      updateData.scheduledAt = interviewDate;
    }

    const interview = await Interview.findOneAndUpdate(
      { _id: interviewId, adminId },
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'userId', select: 'fullName email' },
      { path: 'adminId', select: 'name companyName' }
    ]);

    if (!interview) {
      return res.status(404).json({ 
        message: "Interview not found or you don't have permission to update it" 
      });
    }

    res.status(200).json({
      message: "Interview updated successfully",
      interview
    });
  } catch (error) {
    console.error("Error updating interview:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Admin cancels an interview
export const cancelInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const adminId = req.admin._id;

    const interview = await Interview.findOneAndUpdate(
      { _id: interviewId, adminId },
      { status: "Cancelled" },
      { new: true }
    ).populate([
      { path: 'userId', select: 'fullName email' },
      { path: 'adminId', select: 'name companyName' }
    ]);

    if (!interview) {
      return res.status(404).json({ 
        message: "Interview not found or you don't have permission to cancel it" 
      });
    }

    res.status(200).json({
      message: "Interview cancelled successfully",
      interview
    });
  } catch (error) {
    console.error("Error cancelling interview:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// User gets their interviews
export const getUserInterviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    // Build query
    const query = { userId };
    if (status) query.status = status;

    const interviews = await Interview.find(query)
      .populate('adminId', 'name companyName')
      .sort({ scheduledAt: 1 });

    res.status(200).json({
      success: true,
      interviews
    });
  } catch (error) {
    console.error("Error fetching user interviews:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get upcoming interviews (for both admin and user)
export const getUpcomingInterviews = async (req, res) => {
  try {
    const now = new Date();
    let query = { scheduledAt: { $gte: now }, status: "Scheduled" };

    // If admin, filter by adminId, otherwise filter by userId
    if (req.admin) {
      query.adminId = req.admin._id;
    } else if (req.user) {
      query.userId = req.user._id;
    } else {
      return res.status(401).json({ 
        message: "Unauthorized" 
      });
    }

    const interviews = await Interview.find(query)
      .populate('userId', 'fullName email')
      .populate('adminId', 'name companyName')
      .sort({ scheduledAt: 1 })
      .limit(10);

    res.status(200).json({
      success: true,
      interviews
    });
  } catch (error) {
    console.error("Error fetching upcoming interviews:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};