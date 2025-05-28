import React from 'react'
import { FileText, Mic, Globe,UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <>
        <div className=" bg-gradient-to-b from-indigo-100 to-white ">
        {/* Main Hero Section */}
            <div className=" mx-auto px-4 pt-24 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-20 mb-10">
                Transform Your Audio & Video to Text
                </h1>
                <p className="text-lg text-gray-600 mt-4 mb-12 max-w-2xl mx-auto">
                Professional transcription with AI-powered accuracy. Get precise SRT files in minutes.
                </p>
                <div className="flex justify-center gap-4 mb-16">
                <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700  transition-colors"><Link to="/upload " className='text-white hover:text-white'>
                    Upload File
                </Link></button>
                <Link to="/record" className='text-indigo-700 hover:text-white'><button className="bg-white text-indigo-700 hover:text-white border border-blue-600 px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                    Try Live Recording
                </button></Link>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-around mb-20 ">
                    {/* File Transcription */}
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl hover:scale-105">
                        <div className="flex text-blue-600 text-4xl mb-4 justify-center  items-center">
                        <UploadCloud className="w-20 h-20 text-indigo-700 " />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Upload</h3>
                        <p className="text-gray-600">
                        Upload audio or video files and get accurate transcriptions in multiple formats
                        </p>
                    </div>

                    {/* Live Recording */}
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl hover:scale-105 ">
                        <div className="flex text-blue-600 text-4xl mb-4 justify-center items-center">
                            <Mic className="w-20 h-20 text-indigo-700 " />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Live Recording</h3>
                        <p className="text-gray-600">
                    Upload your audio or video files with just a few clicks
                        </p>
                    </div>

                    {/* Multiple Languages */}
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl hover:scale-105 ">
                        <div className="flex text-blue-600 text-4xl mb-4 justify-center items-center">
                            <FileText className="w-20 h-20 text-indigo-700 " />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">.Srt + Video Export</h3>
                        <p className="text-gray-600">
                        Get your transcripts in industry-standard SRT format
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-indigo-700 text-white py-12 px-4 rounded-xl shadow-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                    <div className="text-4xl font-bold mb-2">1M+</div>
                    <div className="text-base">Files Transcribed</div>
                    </div>
                    <div>
                    <div className="text-4xl font-bold mb-2">50K+</div>
                    <div className="text-base">Active Users</div>
                    </div>
                    <div>
                    <div className="text-4xl font-bold mb-2">50+</div>
                    <div className="text-base">Languages</div>
                    </div>
                    <div>
                    <div className="text-4xl font-bold mb-2">1M+</div>
                    <div className="text-base">Hours Saved</div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </>
  )
}
