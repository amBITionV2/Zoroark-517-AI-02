import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const JobApplicationRules = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { job } = location.state || {};
  const [agreed, setAgreed] = useState(false);

  const handleCancel = () => {
    navigate("/jobs");
  };

  const handleNext = () => {
    if (agreed) {
      navigate("/jobs/interview", { state: { job } });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary">Rules & Guidelines for the Recruitment Process</h2>
        
        <div className="space-y-6 mb-8">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="font-bold text-xl mb-2 text-primary">Position: {job?.role || "Frontend Developer"}</h3>
            <p className="text-secondary text-lg">Company: {job?.companyName || "TechCorp"}</p>
          </div>
          
          <div className="space-y-4">
            <p className="text-secondary text-lg">
              Welcome to the recruitment assessment. Please read the following instructions carefully before starting the test:
            </p>
            
            <div className="space-y-4 mt-6">
              <div className="bg-gray-700 p-5 rounded-xl border-l-4 border-purple-500">
                <h3 className="font-bold text-xl mb-3 text-primary">1. Assessment Overview</h3>
                <p className="text-secondary text-lg mb-3">
                  The recruitment process consists of three components:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-secondary text-lg">
                  <li><span className="font-semibold">Coding Test</span> – algorithmic and problem-solving challenges.</li>
                  <li><span className="font-semibold">MCQ Test</span> – multiple-choice questions on technical concepts and aptitude.</li>
                  <li><span className="font-semibold">Interview</span> – technical and behavioral evaluation.</li>
                </ul>
                <p className="text-secondary text-lg mt-3">
                  All candidates will attempt all three components. Your final result will be based on the cumulative score across all rounds.
                </p>
              </div>
              
              <div className="bg-gray-700 p-5 rounded-xl border-l-4 border-blue-500">
                <h3 className="font-bold text-xl mb-3 text-primary">2. General Instructions</h3>
                <ul className="list-disc pl-6 space-y-2 text-secondary text-lg">
                  <li>Attempt all questions honestly; any form of malpractice or violation of the code of conduct may lead to disqualification.</li>
                  <li>Strictly adhere to the time limits set for each component.</li>
                  <li>Do not switch tabs, open other applications, or use unauthorized resources during the assessment.</li>
                  <li>Clarifications or queries during the test should be directed only to the authorized proctor or support team.</li>
                </ul>
              </div>
              
              <div className="bg-gray-700 p-5 rounded-xl border-l-4 border-green-500">
                <h3 className="font-bold text-xl mb-3 text-primary">3. Scoring & Results</h3>
                <ul className="list-disc pl-6 space-y-2 text-secondary text-lg">
                  <li>Each component contributes to your overall score.</li>
                  <li>The final decision (accepted/rejected) will be communicated after evaluation of all rounds.</li>
                  <li>Meeting the minimum score in a single component does not guarantee selection; overall performance is considered.</li>
                </ul>
              </div>
              
              <div className="bg-gray-700 p-5 rounded-xl border-l-4 border-yellow-500">
                <h3 className="font-bold text-xl mb-3 text-primary">4. Conduct & Integrity</h3>
                <ul className="list-disc pl-6 space-y-2 text-secondary text-lg">
                  <li>Maintain professional behavior at all times.</li>
                  <li>Sharing questions, screenshots, or code is strictly prohibited.</li>
                  <li>Any misconduct observed will result in immediate disqualification.</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-5 rounded-xl mt-6">
              <p className="text-secondary text-lg font-semibold">
                By proceeding, you acknowledge that you have read and understood the above rules.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="agreement"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="agreement" className="ml-2 text-lg text-secondary">
            I agree to the terms and conditions
          </label>
        </div>
        
        <div className="flex justify-between mt-6">
          <button
            onClick={handleCancel}
            className="px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-500 transition text-white font-bold text-lg"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!agreed}
            className={`px-6 py-3 rounded-lg font-bold text-lg transition ${
              agreed 
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 text-white" 
                : "bg-gray-600 cursor-not-allowed text-gray-400"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationRules;