import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const InterviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { job } = location.state || {};
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!isTimerActive) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Interview finished logic would go here
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive]);

  const handleBack = () => {
    navigate("/jobs");
  };

  const handleStartCoding = () => {
    alert("Starting Coding Round...");
    // In a real implementation, this would navigate to the coding test page
  };

  const handleStartMCQ = () => {
    navigate("/jobs/mcq");
  };

  const handleStartInterview = () => {
    // Navigate to the AI interview dashboard
    navigate("/jobs/ai-interview");
  };

  const handleEndInterview = () => {
    // In a real implementation, you would submit the interview data
    navigate("/jobs");
  };

  const toggleTimer = () => {
    setIsTimerActive(!isTimerActive);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen job-listing-bg p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-2 text-primary">Interview Preparation</h1>
          <p className="text-lg text-secondary mb-8">Get ready for your interview process</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Job Details */}
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-primary border-b border-gray-600 pb-2">Position Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-primary">Role</h3>
                  <p className="text-secondary text-lg">{job?.role || "Frontend Developer"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-primary">Company</h3>
                  <p className="text-secondary text-lg">{job?.companyName || "TechCorp"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-primary">Location</h3>
                  <p className="text-secondary text-lg">{job?.location || "San Francisco, CA"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-primary">Salary</h3>
                  <p className="text-secondary text-lg">{job?.salary || "$120k - $160k"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-primary">Experience Required</h3>
                  <p className="text-secondary text-lg">{job?.experienceRequired || "3+ years"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-primary">Job Type</h3>
                  <p className="text-secondary text-lg">{job?.jobType || "Full-time"}</p>
                </div>
              </div>
            </div>
            
            {/* Interview Process Information */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-primary border-b border-gray-600 pb-2">Interview Process</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-purple-500 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">Coding Round</h3>
                      <p className="text-secondary text-sm">Algorithmic and problem-solving challenges</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">MCQ Round</h3>
                      <p className="text-secondary text-sm">Technical concepts and aptitude questions</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">Interview Round</h3>
                      <p className="text-secondary text-sm">Technical and behavioral evaluation</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-primary border-b border-gray-600 pb-2">Preparation Tips</h2>
                <ul className="list-disc pl-5 space-y-2 text-secondary">
                  <li>Review fundamental concepts related to the role</li>
                  <li>Practice coding problems if it's a technical role</li>
                  <li>Prepare questions to ask the interviewer</li>
                  <li>Test your camera and microphone beforehand</li>
                  <li>Choose a quiet, well-lit environment</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Assessment Components */}
          <div className="mt-8 bg-gradient-to-r from-gray-700 to-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-primary text-center">Start Your Assessment</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handleStartCoding}
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold py-4 px-6 rounded-xl transition transform hover:scale-105 shadow-lg"
              >
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-2">💻</span>
                  <span className="text-lg">Start Coding Round</span>
                </div>
              </button>
              <button
                onClick={handleStartMCQ}
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-4 px-6 rounded-xl transition transform hover:scale-105 shadow-lg"
              >
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-2">📝</span>
                  <span className="text-lg">Start MCQ Round</span>
                </div>
              </button>
              <button
                onClick={handleStartInterview}
                className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-bold py-4 px-6 rounded-xl transition transform hover:scale-105 shadow-lg"
              >
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-2">🎤</span>
                  <span className="text-lg">Start Interview</span>
                </div>
              </button>
            </div>
          </div>
          
      
          
          {/* Action Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              className="px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-500 transition text-white font-semibold text-lg"
            >
              Back to Jobs
            </button>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;