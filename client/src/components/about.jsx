import React from 'react'
import about from '../assets/about.jpg' // Adjust the path as necessary

export default function About() {
  return (
     <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About TranscribeAI</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We're on a mission to make audio and video content more accessible through accurate,
                fast, and affordable transcription services.
            </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div className="container mx-auto flex justify-center"> 
                <img
                src={about}                     
                alt="Person using TranscribeAI"
                className="rounded-lg shadow-xl w-full"
                />
            </div>
            <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h3>
                <p className="text-gray-600 mb-4">
                Founded in 2024, TranscribeAI has been at the forefront of speech recognition technology. Our team of
                experts has developed state-of-the-art AI models that provide highly accurate transcriptions in multiple
                languages.
                </p>
                <p className="text-gray-600">
                We serve thousands of satisfied customers, from individual content creators to large enterprises, helping
                them save time and improve accessibility.
                </p>
            </div>
            </div>
        </div>
    </section>
  )
}
