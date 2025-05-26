import React from 'react'

export default function Record() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
            <div className="w-full max-w-2xl p-6 space-y-8">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-gray-800 text-center"
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
                            ${isRecording ? 'bg-red-100' : 'bg-blue-100'}`}
                    >
                        {isRecording ? (
                            <FiStopCircle 
                                className="w-16 h-16 text-red-500 cursor-pointer" 
                                onClick={stopRecording}
                            />
                        ) : (
                            <FiMic 
                                className="w-16 h-16 text-blue-500 cursor-pointer" 
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
                            </div>

                            <div className="mt-6">
                                <audio className="w-full" controls src={URL.createObjectURL(recordedBlob)} />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="mt-6 w-full bg-blue-500 text-white px-6 py-3 rounded-lg
                                         hover:bg-blue-600 transition-all duration-300 ease-in-out
                                         shadow-md hover:shadow-lg flex items-center justify-center"
                                onClick={() => {
                                    // Add your transcription logic here
                                    console.log('Starting transcription for recorded audio');
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
  )
}
