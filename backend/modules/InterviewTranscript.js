import mongoose from 'mongoose';

const transcriptEntrySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['question', 'answer', 'warning', 'summary'],
    required: true
  },
  question_number: Number,
  timestamp: {
    type: Date,
    required: true
  },
  speaker: String,
  text: String,
  message: String,
  warningNumber: Number,
  total_warnings: Number,
  duration: Number
});

const interviewTranscriptSchema = new mongoose.Schema({
  interview_date: {
    type: Date,
    required: true
  },
  total_warnings: {
    type: Number,
    default: 0
  },
  duration_seconds: {
    type: Number,
    required: true
  },
  conversation: [transcriptEntrySchema],
  warnings: [transcriptEntrySchema],
  summary: {
    total_questions: Number,
    total_answers: Number,
    cheating_flags: Number
  }
}, {
  timestamps: true
});

interviewTranscriptSchema.index({ createdAt: -1 });
interviewTranscriptSchema.index({ interview_date: -1 });

export default mongoose.model('InterviewTranscript', interviewTranscriptSchema);