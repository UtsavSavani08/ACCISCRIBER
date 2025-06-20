import React, { useState, useRef } from 'react';
import { FiMic, FiStopCircle, FiUploadCloud, FiFile, FiHardDrive, FiClock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createClient } from "@supabase/supabase-js";
import Navbar from './navbar.jsx';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Record() {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [recordedMinutes, setRecordedMinutes] = useState(0); // <-- Store minutes
    const mediaRecorderRef = useRef(null);
    const timerRef = useRef(null);
    const navigate = useNavigate();

    const startRecording = async () => {
        // Check if user is logged in
        const { data } = await supabase.auth.getSession();
        const session = data?.session;
        if (!session) {
            navigate("/login", { state: { from: "/record" } });
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            const chunks = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/wav' });
                setRecordedBlob(blob);
                stream.getTracks().forEach(track => track.stop());

                // Calculate minutes and increment if seconds > 40
                let minutes = Math.floor(recordingTime / 60);
                let seconds = recordingTime % 60;
                if (seconds > 40) {
                  minutes += 1;
                }
                setRecordedMinutes(minutes);
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();
            setIsRecording(true);

            // Start timer
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('Unable to access microphone. Please check permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(timerRef.current);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
    };
    const handleStartTranscription = async (blob) => {
        // Add your transcription logic here
        if (!blob) return;

    setIsProcessing(true);

    try {
      // ✅ Fetch session inside the async function
      const { data, error } = await supabase.auth.getSession();
      const session = data?.session;

      if (!session) {
        alert("You need to be logged in to transcribe.");
        setIsProcessing(false);
        return;
      }

      const token = session.access_token;
      const userId = session.user.id;

      const formData = new FormData();
        formData.append("file", blob, "recording.wav");
        formData.append("user_id", userId);
        formData.append("duration", recordedMinutes); // <-- Send minutes to backend

      // const fileType = file.type.startsWith("video/") ? "video" : "audio";

      const response = await fetch(
        `http://localhost:8000/analyze/audio/transcribe`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
            body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      const durationInSeconds = result.data.duration || 0;
      const minutes = Math.floor(durationInSeconds / 60);
      const seconds = Math.floor(durationInSeconds % 60);
      const formattedDuration = `${minutes}:${seconds.toString().padStart(2, "0")}`;

      navigate("/download", {
        state: {
          transcriptionData: {
            duration: formattedDuration,
            wordCount: result.data.word_count,
            detectedLanguage: result.data.language,
            srtFile: result.data.srt_url,
            srt_url: result.data.srt_url,
            originalFileName: "recording.wav",
          },
        },
      });
    } catch (err) {
      console.error("Transcription error:", err);
      alert("Error during transcription. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  if (isProcessing) {
      return (
        <>
          <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <Navbar />
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mx-auto mb-6" />
              <p className="text-xl font-semibold text-gray-700">
                Processing your file...
              </p>
            </div>
          </div>
        </>
      );
    }

    return (
        <div className="flex items-center justify-center bg-white w-screen h-screen">
            <div className="w-full max-w-2xl p-6 space-y-8">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-indigo-700 text-center"
                >
                    Live Recording
                </motion.h1>

                {/* Recording Interface */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full flex flex-col items-center justify-center space-y-6 p-10"
                >
                    <motion.div
                        animate={{
                            scale: isRecording ? [1, 1.1, 1] : 1,
                            transition: {
                                repeat: isRecording ? Infinity : 0,
                                duration: 1.5
                            }
                        }}
                        className={`w-32 h-32 rounded-full flex items-center justify-center
                            ${isRecording ? 'bg-red-100' : 'bg-indigo-100'}`}
                    >
                        {isRecording ? (
                            <FiStopCircle 
                                className="w-16 h-16 text-red-500 cursor-pointer" 
                                onClick={stopRecording}
                            />
                        ) : (
                            <FiMic
                                className="w-16 h-16 text-indigo-500 cursor-pointer"
                                onClick={startRecording}
                            />
                        )}
                    </motion.div>

                    <div className="text-4xl font-bold text-gray-800">
                        {formatTime(recordingTime)}
                    </div>

                    <p className="text-gray-500 text-center">
                        {isRecording ? 'Recording in progress...' : 'Click microphone to start recording'}
                    </p>
                </motion.div>

                {/* Recorded Audio Details */}
                <AnimatePresence>
                    {recordedBlob && !isRecording && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="w-full bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                        >
                            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                <FiFile className="mr-2" /> Recording Details
                            </h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex items-center space-x-3">
                                    <FiFile className="text-blue-500 w-5 h-5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-500">Format</p>
                                        <p className="font-medium text-gray-800">WAV Audio</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FiHardDrive className="text-purple-500 w-5 h-5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Size</p>
                                        <p className="font-medium text-gray-800">
                                            {formatFileSize(recordedBlob.size)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FiClock className="text-green-500 w-5 h-5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Minutes (rounded)</p>
                                        <p className="font-medium text-gray-800">
                                            {recordedMinutes}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <audio className="w-full" controls src={URL.createObjectURL(recordedBlob)} />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="mt-6 w-full bg-indigo-500 text-white px-6 py-3 rounded-lg
                                         hover:bg-indigo-600 transition-all duration-300 ease-in-out
                                         shadow-md hover:shadow-lg flex items-center justify-center"
                                onClick={() => {
                                    // Add your transcription logic here
                                    handleStartTranscription(recordedBlob);
                                    setRecordedBlob(null);

                                }}
                            >
                                <FiUploadCloud className="mr-2" />
                                Start Transcription
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
