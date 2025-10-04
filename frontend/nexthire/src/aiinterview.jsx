import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AIInterviewDashboard = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [aiStatus, setAiStatus] = useState("Thinking...");
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Timer effect
  useEffect(() => {
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
  }, []);

  // Simulate AI status changes
  useEffect(() => {
    const statuses = ["Thinking...", "Analyzing...", "Processing...", "Listening..."];
    let index = 0;
    
    const statusInterval = setInterval(() => {
      index = (index + 1) % statuses.length;
      setAiStatus(statuses[index]);
    }, 3000);

    return () => clearInterval(statusInterval);
  }, []);

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
        // Fallback to placeholder if camera access is denied
        setCameraActive(false);
      }
    };

    initCamera();

    // Cleanup function to stop camera when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndInterview = () => {
    // Stop all media tracks before navigating
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    // In a real implementation, you would submit the interview data
    navigate("/jobs");
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      {/* Header with Timer */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Frontend Dev - Live Interview</h1>
            <p className="text-gray-400">AI Interview session</p>
          </div>
          <div className="bg-green-500 text-white px-4 py-2 rounded-full text-lg font-bold">
            Interview Timer: {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Main Content - Split Screen Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
        {/* Left Side - AI Interviewer Panel */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">AI Interviewer</h2>
            <div className="bg-gray-700 px-3 py-1 rounded-full text-sm">
              {aiStatus}
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center flex-grow">
            {/* AI Avatar - Made Larger */}
            <div className="relative mb-8">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                <div className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-gray-900 flex items-center justify-center">
                  <div className="text-7xl md:text-8xl">🤖</div>
                </div>
              </div>
            </div>
            
            {/* AI Interaction Area - Removed the placeholder text */}
            <div className="w-full bg-gray-700 rounded-xl p-6 min-h-[150px]">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="inline-block bg-gray-600 px-4 py-2 rounded-full">
                    <span className="animate-pulse">●</span> Listening...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - User Video Feed - Made Larger */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col">
          <h2 className="text-xl font-bold mb-6">You</h2>
          
          <div className="flex-grow flex flex-col">
            {/* Video Feed - Made Larger */}
            {cameraActive ? (
              <div className="flex-grow bg-gray-900 rounded-xl overflow-hidden relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Recording indicator */}
                <div className="absolute top-4 right-4 flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-red-400 text-sm font-semibold">REC</span>
                </div>
                {/* Camera status indicator */}
                <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-70 px-2 py-1 rounded text-xs">
                  Camera Active
                </div>
              </div>
            ) : (
              // Fallback placeholder if camera is not accessible
              <div className="flex-grow bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
                      <div className="text-4xl">👤</div>
                    </div>
                    <p className="text-gray-400">Camera access required</p>
                    <p className="text-gray-500 text-sm mt-2">Please allow camera access to continue</p>
                  </div>
                </div>
                {/* Recording indicator */}
                <div className="absolute top-4 right-4 flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-red-400 text-sm font-semibold">REC</span>
                </div>
              </div>
            )}
            
            {/* Interview Controls */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <button 
                onClick={toggleMic}
                className={`py-3 rounded-lg transition flex items-center justify-center ${
                  micActive 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-red-600 hover:bg-red-500'
                }`}
              >
                <span className="text-lg">{micActive ? '🔊' : '🔇'}</span>
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 py-3 rounded-lg transition flex items-center justify-center">
                <span className="text-lg">📷</span>
              </button>
              <button
          onClick={handleEndInterview}
          className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-lg font-semibold transition"
        >
          End Interview
        </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
    
    </div>
  );
};

export default AIInterviewDashboard;