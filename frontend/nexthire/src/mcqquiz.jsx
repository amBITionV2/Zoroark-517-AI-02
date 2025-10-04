import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MCQQuiz = () => {
  // Sample MCQ questions
  const questions = [
    {
      id: 1,
      question: "Which of the following is not a JavaScript data type?",
      options: ["Number", "Boolean", "Float", "Undefined"],
      correct: 2
    },
    {
      id: 2,
      question: "What does CSS stand for?",
      options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
      correct: 1
    },
    {
      id: 3,
      question: "Which HTML tag is used to define an internal style sheet?",
      options: ["<script>", "<css>", "<style>", "<link>"],
      correct: 2
    },
    {
      id: 4,
      question: "In React, which hook is used to perform side effects?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      correct: 1
    },
    {
      id: 5,
      question: "Which company developed React?",
      options: ["Google", "Facebook", "Microsoft", "Amazon"],
      correct: 1
    },
    {
      id: 6,
      question: "What is the correct way to declare a JavaScript variable?",
      options: ["variable name = value;", "var name = value;", "v name = value;", "declare name = value;"],
      correct: 1
    },
    {
      id: 7,
      question: "Which CSS property is used to change the text color?",
      options: ["font-color", "text-color", "color", "foreground-color"],
      correct: 2
    },
    {
      id: 8,
      question: "What is the correct HTML element for the largest heading?",
      options: ["<h6>", "<heading>", "<h1>", "<head>"],
      correct: 2
    },
    {
      id: 9,
      question: "In JavaScript, which method is used to add an element to the end of an array?",
      options: ["append()", "push()", "addToEnd()", "insert()"],
      correct: 1
    },
    {
      id: 10,
      question: "Which HTML attribute specifies an alternate text for an image?",
      options: ["alt", "title", "src", "text"],
      correct: 0
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 30 minutes in seconds
  const [showResults, setShowResults] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const navigate = useNavigate();

  // Timer effect
  useEffect(() => {
    if (!quizStarted || showResults) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, showResults]);

  // Tab switch detection
  useEffect(() => {
    if (!quizStarted || showResults) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        const newCount = tabSwitchCount + 1;
        setTabSwitchCount(newCount);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [tabSwitchCount, quizStarted, showResults]);

  // Prevent leaving the page
  useEffect(() => {
    if (!quizStarted || showResults) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [quizStarted, showResults]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerSelect = (optionIndex) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
    // Log score and tab switch count to console
    const score = calculateScore();
    console.log(`Quiz Results - Score: ${score}/${questions.length}, Tab switches: ${tabSwitchCount}`);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(Array(questions.length).fill(null));
    setTimeLeft(30 * 60);
    setShowResults(false);
    setTabSwitchCount(0);
    setQuizStarted(false);
  };

  const handleGoHome = () => {
    navigate('/jobs');
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      if (answer === questions[index].correct) {
        return score + 1;
      }
      return score;
    }, 0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-center text-white mb-6">Technical MCQ Quiz</h1>
          <div className="text-gray-300 mb-8">
            <h2 className="text-xl font-semibold mb-4">Quiz Instructions:</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Duration: {Math.floor(timeLeft / 60)} minutes</li>
              <li>Total Questions: {questions.length}</li>
              <li>Each question has only one correct answer</li>
              <li>Please do not switch tabs during the quiz</li>
              <li>You can navigate between questions using the Previous/Next buttons</li>
              <li>Click "Submit Quiz" when you're finished</li>
            </ul>
          </div>
          <div className="text-center">
            <button
              onClick={handleStartQuiz}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 text-lg"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    
    // Only show score in console, not to user
    console.log(`Quiz completed with score: ${score}/${questions.length}`);
    
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-2xl w-full text-center">
          <h1 className="text-3xl font-bold text-white mb-6">Quiz Completed</h1>
          <p className="text-xl text-gray-300 mb-8">
            Thank you for completing the quiz. Your results have been recorded.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleRestart}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Restart Quiz
            </button>
            <button
              onClick={handleGoHome}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Timer */}
        <div className="bg-gray-800 rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
          <div className="text-lg font-semibold text-white">
            Question {currentQuestion + 1} of {questions.length}
          </div>
          <div className="text-lg font-bold text-red-500">
            Time Left: {formatTime(timeLeft)}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            {questions[currentQuestion].question}
          </h2>
          
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border transition duration-200 ${
                  selectedAnswers[currentQuestion] === index
                    ? 'bg-blue-900 border-blue-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
                }`}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`py-3 px-6 rounded-lg font-medium transition duration-300 ${
              currentQuestion === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            Previous
          </button>
          
          {currentQuestion < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MCQQuiz;