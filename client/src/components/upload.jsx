import React, { useState, useRef } from 'react';
import { FiUploadCloud, FiFile, FiClock, FiHardDrive, FiVideo } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from "./navbar.jsx";

export default function Upload() {
    const [file, setFile] = useState(null);
    const [duration, setDuration] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef(null);
    const mediaRef = useRef(null);
    const navigate = useNavigate();

    const supportedFormats = ['MP3', 'WAV', 'MP4', 'MOV', 'AVI','M4A'];

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (validateFile(selectedFile)) {
            setFile(selectedFile);
            setDuration(null); // Reset duration when new file is selected
            const url = URL.createObjectURL(selectedFile);
            if (mediaRef.current) {
                mediaRef.current.src = url;
            }
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (validateFile(droppedFile)) {
            setFile(droppedFile);
            setDuration(null); // Reset duration when new file is dropped
            const url = URL.createObjectURL(droppedFile);
            if (mediaRef.current) {
                mediaRef.current.src = url;
            }
        }
    };

    const handleLoadedMetadata = () => {
        if (mediaRef.current) {
            setDuration(mediaRef.current.duration);
            URL.revokeObjectURL(mediaRef.current.src); // Clean up the URL
        }
    };

    const validateFile = (file) => {
        if (!file) return false;
        const extension = file.name.split('.').pop().toUpperCase();
        if (!supportedFormats.includes(extension)) {
            alert('Unsupported file format. Please upload MP3, WAV, MP4, MOV, M4A, or AVI files.');
            return false;
        }
        return true;
    };

    // const formatDuration = (seconds) => {
    //     const minutes = Math.floor(seconds / 60);
    //     const remainingSeconds = Math.floor(seconds % 60);
    //     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    // };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
    };

    const handleStartTranscription = async () => {
        if (!file) return;
    
        setIsProcessing(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            // Determine endpoint based on file type
            const fileType = file.type.startsWith('video/') ? 'video' : 'audio';
            const response = await fetch(`http://localhost:8000/analyze/${fileType}/transcribe`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Transcription response:', result); // Add logging

            // Format duration as MM:SS
            const durationInSeconds = duration || 0;
            const minutes = Math.floor(durationInSeconds / 60);
            const seconds = Math.floor(durationInSeconds % 60);
            const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

            // Navigate to download page with all required data
            navigate('/download', {
                state: {
                    transcriptionData: {
                        duration: formattedDuration,
                        wordCount: result.data.word_count,
                        detectedLanguage: result.data.detected_language,
                        srtFile: result.data.srt_filename,
                        originalFileName: file.name
                    }
                }
            });
        } catch (error) {
            console.error('Transcription error:', error);
            alert('Error during transcription. Please try again.');
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
                    <p className="text-xl font-semibold text-gray-700">Processing your file...</p>
                </div>
            </div>
        </>
        );
    }
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
            <div className="w-full max-w-2xl p-6 space-y-8">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-gray-800 text-center"
                >
                    Upload File
                </motion.h1>
  
                {/* Upload Area */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`
                        w-full border-2 border-dashed rounded-xl p-10 text-center
                        transition-all duration-300 ease-in-out
                        ${isDragging ? 'border-blue-500 bg-blue-50 scale-102' : 'border-gray-300 hover:border-blue-400'}
                        cursor-pointer relative overflow-hidden
                    `}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <motion.div
                        animate={{ scale: isDragging ? 1.1 : 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <FiUploadCloud className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                        <p className="text-xl font-medium text-gray-700 mb-2">Drag and drop your file here</p>
                        <p className="text-sm text-gray-500 mb-6">or click to browse from your computer</p>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 
                                                 transition-all duration-300 ease-in-out transform hover:scale-105
                                                 shadow-md hover:shadow-lg"
                        >
                            Select File
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileSelect}
                            accept=".mp3,.wav,.mp4,.mov,.avi,.m4a"
                        />
                        <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
                            <span>Supported formats:</span>
                            {supportedFormats.map((format, index) => (
                                <span key={format} className="px-2 py-1 bg-gray-100 rounded-md">{format}</span>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
        
                {/* File Details */}
                <AnimatePresence>
                    {file && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="w-full bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                        >
                            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                <FiFile className="mr-2" /> File Details
                            </h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex items-center space-x-3">
                                    <FiFile className="text-blue-500 w-5 h-5 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-gray-500">File Name</p>
                                        <p className="font-medium text-gray-800 truncate">{file.name}</p>
                                    </div>
                                </div>
                                {/* Hidden media element for duration detection */}
                                {file && file.type.startsWith('video/') ? (
                                    <video
                                        ref={mediaRef}
                                        className="hidden"
                                        onLoadedMetadata={handleLoadedMetadata}
                                    />
                                ) : (
                                    <audio
                                        ref={mediaRef}
                                        className="hidden"
                                        onLoadedMetadata={handleLoadedMetadata}
                                    />
                                )}
                                {/* <div className="flex items-center space-x-3">
                                    <FiClock className="text-green-500 w-5 h-5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Duration</p>
                                        <p className="font-medium text-gray-800">
                                            {duration ? formatDuration(duration) : 'Processing...'}
                                        </p>
                                    </div>
                                </div> */}
                                <div className="flex items-center space-x-3">
                                    <FiHardDrive className="text-purple-500 w-5 h-5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Size</p>
                                        <p className="font-medium text-gray-800">{formatFileSize(file.size)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FiVideo className="text-orange-500 w-5 h-5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Format</p>
                                        <p className="font-medium text-gray-800">{file.name.split('.').pop().toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>
  
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleStartTranscription}
                                className="w-full mt-6 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 
                                                 transition-all duration-300 flex items-center justify-center space-x-2
                                                 shadow-md hover:shadow-lg"
                            >
                                <span>Start Transcription</span>
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            </div>
        )
}
