import React, { useEffect, useState } from 'react'
import { FileText, Mic, UploadCloud, Globe2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from "axios";

export default function Hero() {
    const [stats, setStats] = useState({ files: 0, users: 0 });

    useEffect(() => {
        axios.get("http://localhost:8000/api/stats")
            .then(res => {
                setStats({
                    files: res.data.files_transcribed,
                    users: res.data.active_users
                });
            })
            .catch(err => {
                console.error("Failed to fetch stats", err);
                // Set fallback values on error
                setStats({ files: 0, users: 0 });
            });
    }, []);

    return (
        <section className="min-h-screen bg-gradient-to-b from-indigo-50 to-white overflow-hidden w-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-32">
                {/* Main content */}
                <div className="relative z-10 text-center lg:text-left">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
                        <span className="block">Professional Audio & Video</span>
                        <span className="block text-indigo-600 mt-2">Transcription Solution</span>
                    </h1>
                    
                    <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto lg:mx-0">
                        Transform your media into accurate, professional transcripts with our
                        advanced AI technology. Get precise SRT files and captions in minutes.
                    </p>
                    
                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Link to="/upload">
                            <button className="w-full sm:w-auto px-8 py-4 text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                Start Transcribing
                            </button>
                        </Link>
                        <Link to="/record">
                            <button className="w-full sm:w-auto px-8 py-4 text-base font-medium rounded-lg text-indigo-700 bg-white border-2 border-indigo-600 hover:bg-indigo-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                Live Recording
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-lg mb-6">
                            <UploadCloud className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Enterprise-Grade Upload</h3>
                        <p className="mt-4 text-gray-600 leading-relaxed">
                            Secure file handling with support for high-quality audio and video formats. Process files up to 2GB.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-lg mb-6">
                            <Globe2 className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Multi-Language Support</h3>
                        <p className="mt-4 text-gray-600 leading-relaxed">
                            Industry-leading accuracy across 20+ languages with automatic language detection.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-lg mb-6">
                            <FileText className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Professional Exports</h3>
                        <p className="mt-4 text-gray-600 leading-relaxed">
                            Export to industry-standard SRT format with frame-accurate timing and custom formatting options.
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="mt-24 mb-20 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-indigo-500/30">
                        <div className="px-8 py-12 text-center">
                            <div className="text-5xl font-bold text-white mb-3">
                                {stats.files.toLocaleString()}
                            </div>
                            <div className="text-indigo-200 font-medium">Files Processed</div>
                        </div>
                        <div className="px-8 py-12 text-center">
                            <div className="text-5xl font-bold text-white mb-3">
                                {stats.users.toLocaleString()}
                            </div>
                            <div className="text-indigo-200 font-medium">Enterprise Clients</div>
                        </div>
                        <div className="px-8 py-12 text-center">
                            <div className="text-5xl font-bold text-white mb-3">20+</div>
                            <div className="text-indigo-200 font-medium">Languages</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
