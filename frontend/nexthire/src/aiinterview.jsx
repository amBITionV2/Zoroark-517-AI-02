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
  const [recordingTime, setRecordingTime] = useState(0);
  const [peopleCount, setPeopleCount] = useState(0);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState("Initializing...");
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const audioRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const modelRef = useRef(null);
  const previousPersonCountRef = useRef(0);

  // Load TensorFlow.js and COCO-SSD - CLEAN VERSION
  useEffect(() => {
    let isMounted = true;

    const loadEverything = async () => {
      try {
        // Step 1: Load TensorFlow.js
        setLoadingStatus("Loading TensorFlow.js...");
        console.log("🔄 Step 1: Loading TensorFlow.js...");
        
        if (!window.tf) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.2.0/dist/tf.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }
        
        console.log("✅ TensorFlow.js loaded!");
        
        // Step 2: Load COCO-SSD
        setLoadingStatus("Loading COCO-SSD library...");
        console.log("🔄 Step 2: Loading COCO-SSD library...");
        
        if (!window.cocoSsd) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }
        
        console.log("✅ COCO-SSD library loaded!");
        
        // Step 3: Load the model
        setLoadingStatus("Loading detection model (10-20s)...");
        console.log("🔄 Step 3: Loading detection model...");
        
        const model = await window.cocoSsd.load();
        
        if (isMounted) {
          modelRef.current = model;
          setModelLoaded(true);
          setLoadingStatus("Detection ready!");
          console.log("✅ ALL LOADED! Detection is ready!");
        }
        
      } catch (error) {
        console.error("❌ Loading failed:", error);
        setLoadingStatus("Failed to load");
      }
    };

    loadEverything();

    return () => {
      isMounted = false;
    };
  }, []);

  // Monitor person count changes and trigger warnings
  useEffect(() => {
    if (!interviewStarted || interviewEnded) return;

    if (peopleCount > 1 && previousPersonCountRef.current <= 1) {
      setWarningCount(prev => prev + 1);
      setShowWarning(true);
      
      setTranscript(prev => [...prev, {
        type: "warning",
        timestamp: new Date().toISOString(),
        message: `Multiple people detected (${peopleCount} people)`,
        warningNumber: warningCount + 1
      }]);
      
      setTimeout(() => setShowWarning(false), 5000);
    }
    
    previousPersonCountRef.current = peopleCount;
  }, [peopleCount, interviewStarted, interviewEnded, warningCount]);

  // Person detection function
  const detectPersons = async () => {
    if (!modelRef.current || !videoRef.current || !canvasRef.current || !cameraActive) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    try {
      const predictions = await modelRef.current.detect(video);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const persons = predictions.filter(p => p.class === 'person' && p.score > 0.5);
      
      persons.forEach(person => {
        const [x, y, width, height] = person.bbox;
        
        ctx.strokeStyle = persons.length > 1 ? '#FF0000' : '#00FF00';
        ctx.lineWidth = 3;
        ctx.font = '16px Arial';
        ctx.fillStyle = persons.length > 1 ? '#FF0000' : '#00FF00';
        
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.stroke();
        
        const label = `Person ${(person.score * 100).toFixed(1)}%`;
        ctx.fillText(label, x, y > 20 ? y - 5 : y + 20);
      });
      
      setPeopleCount(persons.length);
    } catch (err) {
      console.error('Error during detection:', err);
    }
  };

  useEffect(() => {
    if (cameraActive && modelLoaded && videoRef.current) {
      detectionIntervalRef.current = setInterval(detectPersons, 100);
    }
    
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [cameraActive, modelLoaded]);

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
          video: { width: 640, height: 480 },
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
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
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const downloadTranscript = () => {
    const transcriptData = {
      interview_date: new Date().toISOString(),
      total_warnings: warningCount,
      duration_seconds: 30 * 60 - timeLeft,
      conversation: transcript.filter(t => t.type !== "warning"),
      warnings: transcript.filter(t => t.type === "warning"),
      summary: {
        total_questions: transcript.filter(t => t.type === "question").length,
        total_answers: transcript.filter(t => t.type === "answer").length,
        cheating_flags: warningCount
      }
    };
    
    const blob = new Blob([JSON.stringify(transcriptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview_transcript_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
    
    setTranscript(prev => [...prev, {
      type: "summary",
      timestamp: new Date().toISOString(),
      total_warnings: warningCount,
      duration: 30 * 60 - timeLeft
    }]);
    
    alert(`Interview has ended. Total warnings: ${warningCount}. Click 'Download Transcript' to save the conversation.`);
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

  const startInterview = async () => {
    if (!cameraActive) {
      alert("Please enable camera access first!");
      return;
    }

    setInterviewStarted(true);
    setAiStatus("AI is thinking...");
    setCurrentQuestion("");
    setTranscript([]);
    setWarningCount(0);
    previousPersonCountRef.current = 0;

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
      const question = data.question;
      
      setCurrentQuestion(question);
      setQuestionNumber(data.question_number);
      setAiStatus("AI is speaking...");
      
      setTranscript(prev => [...prev, {
        type: "question",
        question_number: data.question_number,
        timestamp: new Date().toISOString(),
        speaker: "AI",
        text: question
      }]);
      
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
    
    if (!micActive) {
      alert("Please unmute your microphone first!");
      return;
    }

    setIsListening(true);
    setAiStatus("Listening to your answer...");
    setLastAnswer("");
    setRecordingTime(0);

    recordingTimerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch(`${BACKEND_URL}/ai/listen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortControllerRef.current.signal
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        setRecordingTime(0);
      }
      
      const candidateAnswer = data.candidate_answer;
      const aiResponse = data.ai_response;
      
      setLastAnswer(candidateAnswer);
      setCurrentQuestion(aiResponse);
      setQuestionNumber(data.question_number);
      setAiStatus("AI is speaking...");
      
      setTranscript(prev => [...prev, {
        type: "answer",
        question_number: data.question_number - 1,
        timestamp: new Date().toISOString(),
        speaker: "Candidate",
        text: candidateAnswer
      }]);
      
      setTranscript(prev => [...prev, {
        type: "question",
        question_number: data.question_number,
        timestamp: new Date().toISOString(),
        speaker: "AI",
        text: aiResponse
      }]);
      
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
      if (err.name === 'AbortError') {
        console.log("Recording stopped by user");
      } else {
        console.error("Error capturing answer:", err);
        setAiStatus("Error processing answer. Please try again.");
      }
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        setRecordingTime(0);
      }
    } finally {
      setIsListening(false);
    }
  };

  const stopRecording = async () => {
    try {
      await fetch(`${BACKEND_URL}/ai/stop-recording`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      console.log("Stop recording signal sent to backend");
    } catch (err) {
      console.error("Error stopping recording:", err);
    }
    
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      setRecordingTime(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      {/* Warning Popup */}
      {showWarning && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-red-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            <div>
              <p className="font-bold text-lg">⚠️ Multiple People Detected!</p>
              <p className="text-sm">Warning #{warningCount} - {peopleCount} people in frame</p>
            </div>
          </div>
        </div>
      )}

      {/* Warning Banner */}
      {warningCount > 0 && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-yellow-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            <span className="font-semibold">Total Warnings: {warningCount}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Frontend Dev - Live Interview</h1>
          <p className="text-gray-400">AI Interview Session • Question {questionNumber}</p>
        </div>
        <div className="flex items-center gap-3">
          {interviewEnded && (
            <button
              onClick={downloadTranscript}
              className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-full font-semibold transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
              Download Transcript
            </button>
          )}
          <div className={`${timeLeft < 300 ? 'bg-red-500' : 'bg-green-500'} text-white px-4 py-2 rounded-full text-lg font-bold`}>
            Time Left: {formatTime(timeLeft)}
          </div>
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">You</h2>
            {modelLoaded && cameraActive && (
              <div className={`${peopleCount > 1 ? 'bg-red-600 animate-pulse' : 'bg-green-600'} px-3 py-1 rounded-full text-sm flex items-center gap-2`}>
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                People: {peopleCount}
              </div>
            )}
          </div>
          
          <div className="flex-grow flex flex-col">
            {cameraActive ? (
              <div className="flex-grow bg-gray-900 rounded-xl overflow-hidden relative">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover"
                />
                <canvas 
                  ref={canvasRef} 
                  className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
                />
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
                {!modelLoaded && cameraActive && (
                  <div className="absolute bottom-4 left-4 bg-yellow-600 bg-opacity-80 px-3 py-1 rounded-full text-xs">
                    {loadingStatus}
                  </div>
                )}
                {modelLoaded && cameraActive && (
                  <div className="absolute bottom-4 left-4 bg-green-600 bg-opacity-80 px-3 py-1 rounded-full text-xs">
                    ✓ Detection Active
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
                  {!isListening ? (
                    <>
                      <button
                        onClick={speakAnswer}
                        disabled={interviewEnded || !micActive}
                        className={`flex-1 ${interviewEnded || !micActive ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500'} px-4 py-3 rounded-lg font-semibold transition`}
                      >
                        🎤 Speak Answer
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
                  ) : (
                    <>
                      <button
                        disabled
                        className="flex-1 bg-gray-600 cursor-not-allowed px-4 py-3 rounded-lg font-semibold"
                      >
                        🎤 Recording... {recordingTime}s
                      </button>
                      <button
                        onClick={stopRecording}
                        className="flex-1 bg-orange-600 hover:bg-orange-500 px-4 py-3 rounded-lg font-semibold transition"
                      >
                        ⏹ Stop Recording
                      </button>
                    </>
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