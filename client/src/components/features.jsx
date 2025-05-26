import React from "react";
import { FaCloudUploadAlt, FaMicrophone, FaFileAlt, FaLanguage, FaClock, FaCheckCircle } from 'react-icons/fa';

export default function Features() {
  const features = [
    {
      icon: <FaCloudUploadAlt className="w-12 h-12 text-indigo-700" />,
      title: "Easy Upload",
      description: "Simple drag and drop interface for file uploads",
    },
    {
      icon: <FaMicrophone className="w-12 h-12 text-indigo-700" />,
      title: "Live Recording",
      description: "Real-time transcription for meetings and interviews",
    },
    {
      icon: <FaFileAlt className="w-12 h-12 text-indigo-700" />,
      title: "SRT Export",
      description: "Export your transcripts in industry-standard format",
    },
    {
      icon: <FaLanguage className="w-12 h-12 text-indigo-700" />,
      title: "Multiple Languages",
      description: "Support for 20+ languages",
    },
    {
      icon: <FaClock className="w-12 h-12 text-indigo-700" />,
      title: "Fast Processing",
      description: "Quick turnaround for your transcriptions",
    },
    {
      icon: <FaCheckCircle className="w-12 h-12 text-indigo-700" />,
      title: "High Accuracy",
      description: "Advanced AI for precise transcription",
    },
  ];
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Our Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 hover:bg-blue-50 transition-all duration-300 ease-in-out cursor-pointer"
            >
              <div className="flex flex-col justify-around items-center text-center">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-500 transition-colors duration-300 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
