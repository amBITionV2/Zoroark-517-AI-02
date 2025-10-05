import InterviewTranscript from '../modules/InterviewTranscript.js';

// Save interview transcript to MongoDB
export const saveTranscript = async (req, res) => {
  try {
    const transcriptData = req.body;

    if (!transcriptData.interview_date || transcriptData.duration_seconds === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: interview_date and duration_seconds'
      });
    }

    const transcript = new InterviewTranscript({
      interview_date: new Date(transcriptData.interview_date),
      total_warnings: transcriptData.total_warnings || 0,
      duration_seconds: transcriptData.duration_seconds,
      conversation: transcriptData.conversation || [],
      warnings: transcriptData.warnings || [],
      summary: {
        total_questions: transcriptData.summary?.total_questions || 0,
        total_answers: transcriptData.summary?.total_answers || 0,
        cheating_flags: transcriptData.summary?.cheating_flags || 0
      }
    });

    const savedTranscript = await transcript.save();

    res.status(201).json({
      success: true,
      message: 'Transcript saved successfully',
      data: {
        id: savedTranscript._id,
        interview_date: savedTranscript.interview_date,
        total_warnings: savedTranscript.total_warnings
      }
    });

  } catch (error) {
    console.error('Error saving transcript:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save transcript',
      error: error.message
    });
  }
};

// Get all transcripts
export const getAllTranscripts = async (req, res) => {
  try {
    const transcripts = await InterviewTranscript.find()
      .sort({ createdAt: -1 })
      .select('-conversation -warnings');

    res.status(200).json({
      success: true,
      count: transcripts.length,
      data: transcripts
    });

  } catch (error) {
    console.error('Error fetching transcripts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transcripts',
      error: error.message
    });
  }
};

// Get single transcript by ID
export const getTranscriptById = async (req, res) => {
  try {
    const transcript = await InterviewTranscript.findById(req.params.id);

    if (!transcript) {
      return res.status(404).json({
        success: false,
        message: 'Transcript not found'
      });
    }

    res.status(200).json({
      success: true,
      data: transcript
    });

  } catch (error) {
    console.error('Error fetching transcript:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transcript',
      error: error.message
    });
  }
};

// Update existing transcript
export const updateTranscript = async (req, res) => {
  try {
    const transcriptData = req.body;

    const updatedTranscript = await InterviewTranscript.findByIdAndUpdate(
      req.params.id,
      {
        total_warnings: transcriptData.total_warnings,
        duration_seconds: transcriptData.duration_seconds,
        conversation: transcriptData.conversation,
        warnings: transcriptData.warnings,
        summary: transcriptData.summary
      },
      { new: true, runValidators: true }
    );

    if (!updatedTranscript) {
      return res.status(404).json({
        success: false,
        message: 'Transcript not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transcript updated successfully',
      data: {
        id: updatedTranscript._id,
        total_warnings: updatedTranscript.total_warnings
      }
    });

  } catch (error) {
    console.error('Error updating transcript:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update transcript',
      error: error.message
    });
  }
};

// Delete transcript by ID
export const deleteTranscript = async (req, res) => {
  try {
    const transcript = await InterviewTranscript.findByIdAndDelete(req.params.id);

    if (!transcript) {
      return res.status(404).json({
        success: false,
        message: 'Transcript not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transcript deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting transcript:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete transcript',
      error: error.message
    });
  }
};