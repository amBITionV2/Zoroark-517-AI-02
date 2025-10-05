import React, { useState, useEffect, useRef } from "react";

const BACKEND_URL = "http://127.0.0.1:8000";

const AIInterviewDashboard = () => {
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [aiStatus, setAiStatus] = useState("Waiting to start...");
  const [cameraActive, setCameraActive] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [lastAnswer, setLastAnswer] = useState("");
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const audioRef = useRef(null);
  const recordingTimerRef = useRef(null);

  const playAudio = (base64Audio) => {
    if (!base64Audio) return Promise.resolve();
    
    const audio = new Audio(`data:audio/mpeg;base64,${base64Audio}`);
    audioRef.current = audio;
    
    return new Promise((resolve, reject) => {
      audio.onended = resolve;
      audio.onerror = reject;
      audio.play().catch(err => {
        console.error("Error playing audio:", err);
        reject(err);
      });
    });
  };

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
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
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
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setInterviewEnded(true);
    setAiStatus("Interview completed");
    alert("Interview has ended. Thank you for your time!");
  };

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
      
      if (data.audio) {
        try {
          await playAudio(data.audio);
        } catch (audioErr) {
          console.error("Audio playback error:", audioErr);
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      setAiStatus("Ready for your answer");
      
    } catch (err) {
      console.error("Error starting interview:", err);
      setAiStatus("Error connecting to AI. Please try again.");
      setInterviewStarted(false);
      alert("Failed to start interview. Make sure the backend server is running at http://127.0.0.1:8000");
    }
  };

  const speakAnswer = async () => {
    if (isListening) return;

    setIsListening(true);
    setAiStatus("Listening to your answer...");
    setLastAnswer("");
    setRecordingTime(0);

    recordingTimerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    try {
      const res = await fetch(`${BACKEND_URL}/ai/listen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        setRecordingTime(0);
      }
      
      setLastAnswer(data.candidate_answer);
      setCurrentQuestion(data.ai_response);
      setQuestionNumber(data.question_number);
      setAiStatus("AI is speaking...");
      
      if (data.audio) {
        try {
          await playAudio(data.audio);
        } catch (audioErr) {
          console.error("Audio playback error:", audioErr);
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      if (data.interview_end) {
        handleEndInterview();
      } else {
        setAiStatus("Ready for your answer");
      }
      
    } catch (err) {
      console.error("Error capturing answer:", err);
      setAiStatus("Error processing answer. Please try again.");
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        setRecordingTime(0);
      }
    } finally {
      setIsListening(false);
    }
  };

  const stopRecording = async () => {
    setAiStatus("Stopping recording...");
    
    try {
      await fetch(`${BACKEND_URL}/ai/stop-recording`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      console.log("Stop signal sent");
    } catch (err) {
      console.error("Error stopping recording:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Frontend Dev - Live Interview</h1>
          <p className="text-gray-400">AI Interview Session • Question {questionNumber}</p>
        </div>
        <div className={`${timeLeft < 300 ? 'bg-red-500' : 'bg-green-500'} text-white px-4 py-2 rounded-full text-lg font-bold`}>
          Time Left: {formatTime(timeLeft)}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              </div>
            ) : (
              <div className="flex-grow bg-gray-900 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📹</div>
                  <p className="text-gray-400">Camera access required</p>
                </div>
              </div>
            )}

            <div className="mt-6">
              {!interviewStarted ? (
                <button
                  onClick={startInterview}
                  disabled={!cameraActive}
                  className={`w-full ${cameraActive ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-600 cursor-not-allowed'} px-6 py-4 rounded-lg font-semibold text-lg transition`}
                >
                  Start Interview
                </button>
              ) : (
                <>
                  {!isListening ? (
                    <button
                      onClick={speakAnswer}
                      disabled={interviewEnded}
                      className={`w-full ${interviewEnded ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500'} px-6 py-4 rounded-lg font-semibold text-lg transition`}
                    >
                      🎤 Speak Answer
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        disabled
                        className="flex-1 bg-gray-700 cursor-not-allowed px-6 py-4 rounded-lg font-semibold text-lg"
                      >
                        🎤 Recording... {recordingTime}s
                      </button>
                      <button
                        onClick={stopRecording}
                        className="flex-1 bg-orange-600 hover:bg-orange-500 px-6 py-4 rounded-lg font-semibold text-lg transition"
                      >
                        ⏹ Stop
                      </button>
                    </div>
                  )}
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