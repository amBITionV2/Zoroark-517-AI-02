import mongoose from "mongoose";

// Schema for individual MCQ questions
const mcqQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length >= 2;
      },
      message: props => `${props.value} must have at least 2 options!`
    }
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function(v) {
        return v < this.options.length;
      },
      message: props => `Correct answer index must be less than the number of options!`
    }
  },
  explanation: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true,
    default: "General"
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Medium"
  }
}, { timestamps: true });

// Schema for MCQ tests/exams
const mcqTestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  questions: [mcqQuestionSchema],
  duration: {
    type: Number, // in minutes
    default: 30
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Schema for user MCQ results
const userMCQResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MCQTest",
    required: true
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    selectedOption: {
      type: Number,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  }],
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number, // in seconds
    required: true
  },
  tabSwitches: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Main models
const MCQQuestion = mongoose.model("MCQQuestion", mcqQuestionSchema);
const MCQTest = mongoose.model("MCQTest", mcqTestSchema);
const UserMCQResult = mongoose.model("UserMCQResult", userMCQResultSchema);

export { MCQQuestion, MCQTest, UserMCQResult };