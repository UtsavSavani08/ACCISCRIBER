import React from "react";
import { useLocation } from 'react-router-dom';
import {
  FiDownload,
  FiFile,
  FiClock,
  FiGlobe,
  FiFileText,
} from "react-icons/fi";
import { motion } from "framer-motion";

export default function Download() {
    const location = useLocation();
    const { transcriptionData } = location.state || {};
    
    const downloadSRT = () => {
         if (!transcriptionData?.srt_url) return;

 if (!transcriptionData?.srt_url) return;

    const encodedUrl = encodeURIComponent(transcriptionData.srt_url);
    const downloadUrl = `http://localhost:8000/download/srt?srt_url=${encodedUrl}`;

    // Open download in a new tab (works better for streaming responses)
    window.open(downloadUrl, '_blank');
    link.click();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
            <div className="w-full max-w-2xl p-6 space-y-8">
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-block p-4 bg-green-100 rounded-full"
                    >
                        <svg
                            className="w-12 h-12 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-bold text-gray-800"
                    >
                        Transcription Complete
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gray-600"
                    >
                        Your file has been processed successfully
                    </motion.p>
                </div>

                {/* Transcription Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-xl p-6"
                >
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Transcription Details
                    </h2>
                    <h4 className="font-semibold truncate mb-4">Name : {transcriptionData.originalFileName}</h4>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="flex items-center space-x-3">
                            <FiClock className="text-blue-500 w-5 h-5" />
                            <div>
                                <p className="text-sm text-gray-500">Duration</p>
                                <p className="font-medium text-gray-800">
                                    {transcriptionData?.duration || 'N/A'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <FiFileText className="text-green-500 w-5 h-5" />
                            <div>
                                <p className="text-sm text-gray-500">Word Count</p>
                                <p className="font-medium text-gray-800">
                                    {transcriptionData?.wordCount || 0}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <FiGlobe className="text-purple-500 w-5 h-5" />
                            <div>
                                <p className="text-sm text-gray-500">Detected Language</p>
                                <p className="font-medium text-gray-800">
                                    {transcriptionData?.detectedLanguage || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="space-y-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-blue-500 text-white px-6 py-4 rounded-xl
                            hover:bg-blue-600 transition-all duration-300 ease-in-out
                            shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                        onClick={downloadSRT}
                    >
                        <FiDownload className="w-5 h-5" />
                        <span>Download SRT File</span>
                    </motion.button>

                    {transcriptionData?.fileType === "video" && (
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full border-2 border-blue-500 text-blue-500 px-6 py-4 rounded-xl
                                hover:bg-blue-50 transition-all duration-300 ease-in-out
                                flex items-center justify-center space-x-2"
                            onClick={() => window.location.href = "/view/transcription"}
                        >
                            <FiFile className="w-5 h-5" />
                            <span>View Transcription</span>
                        </motion.button>
                    )}
                </div>
            </div>
        </div>
    );
}
