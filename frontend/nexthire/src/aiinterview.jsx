import React, { useState, useEffect, useRef } from "react";

const BACKEND_URL = "http://127.0.0.1:8000";

const AIInterviewDashboard = () => {
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [aiStatus, setAiStatus] = useState("Waiting to start...");
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [lastAnswer, setLastAnswer] = useState("");
  const [interviewEnded, setInterviewEnded] = useState(false);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Timer effect
  useEffect(() => {
    if (!interviewStarted || interviewEnded) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleEndInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [interviewStarted, interviewEnded]);

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraActive(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraActive(false);
        alert("Please allow camera and microphone access to proceed with the interview.");
      }
    };
    initCamera();
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndInterview = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setInterviewEnded(true);
    setAiStatus("Interview completed");
    alert("Interview has ended. Thank you for your time!");
  };

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
        setMicActive(audioTracks[0].enabled);
      }
    }
  };

  // Start interview
  const startInterview = async () => {
    if (!cameraActive) {
      alert("Please enable camera access first!");
      return;
    }

    setInterviewStarted(true);
    setAiStatus("AI is thinking...");
    setCurrentQuestion("");

    try {
      const resumeText = `Experienced Frontend Developer with 3+ years working with React, JavaScript, and Node.js. 
      Built scalable web applications and worked on REST APIs integration. 
      Strong understanding of responsive design and modern web development practices.`;

      const res = await fetch(`${BACKEND_URL}/ai/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: resumeText }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setCurrentQuestion(data.question);
      setQuestionNumber(data.question_number);
      setAiStatus("AI is speaking...");
      
      // Simulate speaking delay (the backend handles actual TTS)
      setTimeout(() => {
        setAiStatus("Ready for your answer");
      }, 3000);
      
    } catch (err) {
      console.error("Error starting interview:", err);
      setAiStatus("Error connecting to AI. Please try again.");
      alert("Failed to start interview. Make sure the backend server is running at http://127.0.0.1:8000");
    }
  };

  // Capture answer and get AI response
  const speakAnswer = async () => {
    if (isListening) return;
    
    if (!micActive) {
      alert("Please unmute your microphone first!");
      return;
    }

    setIsListening(true);
    setAiStatus("Listening to your answer...");
    setLastAnswer("");

    try {
      const res = await fetch(`${BACKEND_URL}/ai/listen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      setLastAnswer(data.candidate_answer);
      setCurrentQuestion(data.ai_response);
      setQuestionNumber(data.question_number);
      setAiStatus("AI is speaking...");
      
      // Simulate speaking delay
      setTimeout(() => {
        if (data.interview_end) {
          handleEndInterview();
        } else {
          setAiStatus("Ready for your answer");
        }
      }, 3000);
      
    } catch (err) {
      console.error("Error capturing answer:", err);
      setAiStatus("Error processing answer. Please try again.");
    } finally {
      setIsListening(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Frontend Dev - Live Interview</h1>
          <p className="text-gray-400">AI Interview Session • Question {questionNumber}</p>
        </div>
        <div className={`${timeLeft < 300 ? 'bg-red-500' : 'bg-green-500'} text-white px-4 py-2 rounded-full text-lg font-bold`}>
          Time Left: {formatTime(timeLeft)}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Panel */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col h-[600px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">AI Interviewer</h2>
            <div className="bg-gray-700 px-3 py-1 rounded-full text-sm">
              {aiStatus}
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center flex-grow">
            <div className="relative mb-6">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-gray-900 flex items-center justify-center">
                  <div className="text-6xl md:text-7xl">🤖</div>
                </div>
              </div>
              {(aiStatus === "AI is speaking..." || aiStatus === "Listening to your answer...") && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="w-full bg-gray-700 rounded-xl p-6 min-h-[200px] max-h-[300px] overflow-y-auto">
              {!interviewStarted ? (
                <p className="text-center text-gray-300 text-lg">
                  Welcome! Click "Start Interview" when you're ready to begin.
                </p>
              ) : currentQuestion ? (
                <div>
                  <p className="text-gray-200 text-base leading-relaxed mb-4">
                    {currentQuestion}
                  </p>
                  {lastAnswer && (
                    <div className="mt-4 pt-4 border-t border-gray-600">
                      <p className="text-xs text-gray-400 mb-2">Your last answer:</p>
                      <p className="text-sm text-gray-300 italic">"{lastAnswer}"</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-gray-300 animate-pulse">
                  Loading question...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* User Panel */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col h-[600px]">
          <h2 className="text-xl font-bold mb-6">You</h2>
          
          <div className="flex-grow flex flex-col">
            {cameraActive ? (
              <div className="flex-grow bg-gray-900 rounded-xl overflow-hidden relative">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-black bg-opacity-60 px-3 py-1 rounded-full flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-red-400 text-sm font-semibold">RECORDING</span>
                </div>
                {micActive ? (
                  <div className="absolute top-4 right-4 bg-green-600 bg-opacity-80 p-2 rounded-full">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd"/>
                    </svg>
                  </div>
                ) : (
                  <div className="absolute top-4 right-4 bg-red-600 bg-opacity-80 p-2 rounded-full">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-grow bg-gray-900 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📹</div>
                  <p className="text-gray-400">Camera access required</p>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="mt-6 flex gap-3">
              {!interviewStarted ? (
                <button
                  onClick={startInterview}
                  disabled={!cameraActive}
                  className={`flex-1 ${cameraActive ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-600 cursor-not-allowed'} px-6 py-3 rounded-lg font-semibold transition`}
                >
                  Start Interview
                </button>
              ) : (
                <>
                  <button
                    onClick={speakAnswer}
                    disabled={isListening || interviewEnded || !micActive}
                    className={`flex-1 ${isListening || interviewEnded || !micActive ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500'} px-4 py-3 rounded-lg font-semibold transition`}
                  >
                    {isListening ? '🎤 Listening...' : '🎤 Speak Answer'}
                  </button>
                  <button
                    onClick={toggleMic}
                    disabled={interviewEnded}
                    className={`flex-1 ${interviewEnded ? 'bg-gray-600' : micActive ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-gray-600 hover:bg-gray-500'} px-4 py-3 rounded-lg font-semibold transition`}
                  >
                    {micActive ? '🔊 Mute' : '🔇 Unmute'}
                  </button>
                  <button
                    onClick={handleEndInterview}
                    disabled={interviewEnded}
                    className={`flex-1 ${interviewEnded ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500'} px-4 py-3 rounded-lg font-semibold transition`}
                  >
                    ⏹ End
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInterviewDashboard;