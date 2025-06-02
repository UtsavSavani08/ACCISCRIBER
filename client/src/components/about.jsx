import React from 'react'
import about from '../assets/about.jpg'

export default function About() {
    return (
        <section className="py-24  to-indigo-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 -mt-20 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
                <div className="absolute bottom-0 left-0 -mb-20 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>

                <div className="text-center mb-20 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Deserta, cursive' }}>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">ACCISCRIBE</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        We're on a mission to make audio and video content more accessible through accurate,
                        fast, and affordable transcription services.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-16">
                    <div className="relative group transform hover:scale-105 transition-transform duration-500">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                        <div className="relative">
                            <img
                                src={about}
                                alt="Person using TranscribeAI"
                                className="rounded-lg shadow-2xl w-full object-cover"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-6 transform hover:scale-[1.02] transition-transform duration-300">
                        <h3 className="text-3xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                            Our Story
                        </h3>
                        <p className="text-lg text-gray-600 leading-relaxed mb-6">
                            Founded in 2024, TranscribeAI has been at the forefront of speech recognition technology. Our team of
                            experts has developed state-of-the-art AI models that provide highly accurate transcriptions in multiple
                            languages.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            We serve thousands of satisfied customers, from individual content creators to large enterprises, helping
                            them save time and improve accessibility.
                        </p>
                        
                        {/* Added features list */}
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="font-semibold text-indigo-600 mb-1">95%+</div>
                                <div className="text-sm text-gray-600">Accuracy Rate</div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
