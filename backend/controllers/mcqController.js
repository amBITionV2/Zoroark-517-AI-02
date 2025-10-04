import { MCQTest, UserMCQResult } from "../modules/mcqModel.js";
import Admin from "../modules/adminmodule.js";
import User from "../modules/usermodule.js";

// Admin creates a new MCQ test
export const createMCQTest = async (req, res) => {
  try {
    const adminId = req.admin._id;
    const {
      title,
      description,
      questions,
      duration,
      isActive
    } = req.body;

    // Validate that questions array is provided and not empty
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ 
        message: "Questions array is required and cannot be empty" 
      });
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.question || !question.options || !Array.isArray(question.options) || 
          question.options.length < 2 || question.correctAnswer === undefined) {
        return res.status(400).json({ 
          message: `Invalid question format at index ${i}` 
        });
      }
      
      // Validate correctAnswer index
      if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
        return res.status(400).json({ 
          message: `Invalid correct answer index for question at index ${i}` 
        });
      }
    }

    // Create new MCQ test
    const newTest = new MCQTest({
      title,
      description,
      questions,
      duration: duration || 30,
      createdBy: adminId,
      isActive: isActive !== undefined ? isActive : true
    });

    await newTest.save();

    // Populate the createdBy field with admin details
    await newTest.populate('createdBy', 'name companyName');

    res.status(201).json({
      message: "MCQ test created successfully",
      test: newTest
    });
  } catch (error) {
    console.error("Error creating MCQ test:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Admin gets all MCQ tests they created
export const getAdminMCQTests = async (req, res) => {
  try {
    const adminId = req.admin._id;
    
    const tests = await MCQTest.find({ createdBy: adminId })
      .populate('createdBy', 'name companyName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      tests
    });
  } catch (error) {
    console.error("Error fetching MCQ tests:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Admin gets a specific MCQ test by ID
export const getMCQTestById = async (req, res) => {
  try {
    const { testId } = req.params;
    const adminId = req.admin._id;

    const test = await MCQTest.findOne({ 
      _id: testId, 
      createdBy: adminId 
    }).populate('createdBy', 'name companyName');

    if (!test) {
      return res.status(404).json({ 
        message: "MCQ test not found or you don't have permission to access it" 
      });
    }

    res.status(200).json({
      success: true,
      test
    });
  } catch (error) {
    console.error("Error fetching MCQ test:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Admin updates a specific MCQ test
export const updateMCQTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const adminId = req.admin._id;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.createdBy;
    delete updateData.__v;

    const test = await MCQTest.findOneAndUpdate(
      { _id: testId, createdBy: adminId },
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name companyName');

    if (!test) {
      return res.status(404).json({ 
        message: "MCQ test not found or you don't have permission to update it" 
      });
    }

    res.status(200).json({
      message: "MCQ test updated successfully",
      test
    });
  } catch (error) {
    console.error("Error updating MCQ test:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Admin deletes a specific MCQ test
export const deleteMCQTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const adminId = req.admin._id;

    const test = await MCQTest.findOneAndDelete({ 
      _id: testId, 
      createdBy: adminId 
    });

    if (!test) {
      return res.status(404).json({ 
        message: "MCQ test not found or you don't have permission to delete it" 
      });
    }

    // Also delete any results associated with this test
    await UserMCQResult.deleteMany({ testId: test._id });

    res.status(200).json({
      message: "MCQ test deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting MCQ test:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// User takes an MCQ test (get test questions)
export const getMCQTestForUser = async (req, res) => {
  try {
    const { testId } = req.params;
    
    // Find active test
    const test = await MCQTest.findOne({ 
      _id: testId, 
      isActive: true 
    }).select('title description questions duration');

    if (!test) {
      return res.status(404).json({ 
        message: "MCQ test not found or is not active" 
      });
    }

    // Remove correct answers before sending to user
    const questionsForUser = test.questions.map(question => {
      return {
        _id: question._id,
        question: question.question,
        options: question.options,
        explanation: question.explanation,
        category: question.category,
        difficulty: question.difficulty
      };
    });

    res.status(200).json({
      success: true,
      test: {
        _id: test._id,
        title: test.title,
        description: test.description,
        questions: questionsForUser,
        duration: test.duration
      }
    });
  } catch (error) {
    console.error("Error fetching MCQ test for user:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// User submits MCQ test results
export const submitMCQTestResult = async (req, res) => {
  try {
    const { testId } = req.params;
    const { answers, timeTaken, tabSwitches } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ 
        message: "Answers array is required and cannot be empty" 
      });
    }

    // Find the test
    const test = await MCQTest.findById(testId);
    if (!test) {
      return res.status(404).json({ 
        message: "MCQ test not found" 
      });
    }

    // Calculate score
    let score = 0;
    const processedAnswers = [];

    for (let i = 0; i < answers.length; i++) {
      const userAnswer = answers[i];
      const question = test.questions.id(userAnswer.questionId);
      
      if (!question) {
        return res.status(400).json({ 
          message: `Question with ID ${userAnswer.questionId} not found in test` 
        });
      }

      const isCorrect = userAnswer.selectedOption === question.correctAnswer;
      if (isCorrect) {
        score++;
      }

      processedAnswers.push({
        questionId: userAnswer.questionId,
        selectedOption: userAnswer.selectedOption,
        isCorrect
      });
    }

    const totalQuestions = test.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    // Create result record
    const result = new UserMCQResult({
      userId,
      testId,
      answers: processedAnswers,
      score,
      totalQuestions,
      percentage,
      timeTaken: timeTaken || 0,
      tabSwitches: tabSwitches || 0
    });

    await result.save();

    // Populate user and test details
    await result.populate([
      { path: 'userId', select: 'fullName email' },
      { path: 'testId', select: 'title' }
    ]);

    res.status(201).json({
      message: "MCQ test result submitted successfully",
      result: {
        _id: result._id,
        score,
        totalQuestions,
        percentage,
        timeTaken,
        tabSwitches
      }
    });
  } catch (error) {
    console.error("Error submitting MCQ test result:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get user's MCQ test results
export const getUserMCQResults = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const results = await UserMCQResult.find({ userId })
      .populate('testId', 'title')
      .sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      results
    });
  } catch (error) {
    console.error("Error fetching user MCQ results:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Admin gets results for a specific MCQ test
export const getMCQTestResults = async (req, res) => {
  try {
    const { testId } = req.params;
    const adminId = req.admin._id;

    // Verify that the admin owns this test
    const test = await MCQTest.findOne({ 
      _id: testId, 
      createdBy: adminId 
    });

    if (!test) {
      return res.status(404).json({ 
        message: "MCQ test not found or you don't have permission to access it" 
      });
    }

    // Get all results for this test
    const results = await UserMCQResult.find({ testId })
      .populate('userId', 'fullName email')
      .sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      results
    });
  } catch (error) {
    console.error("Error fetching MCQ test results:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};