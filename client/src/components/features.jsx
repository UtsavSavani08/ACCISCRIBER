import React from "react";
import { motion } from "framer-motion";
import { FaCloudUploadAlt, FaMicrophone, FaFileAlt, FaLanguage, FaClock, FaCheckCircle } from 'react-icons/fa';

const FeatureCard = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative group"
    >
      <div className="h-full bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
        <div className="flex flex-col items-center text-center space-y-6">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-indigo-200 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative inline-flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl group-hover:from-indigo-100 group-hover:to-indigo-200 transition-colors duration-200">
              {React.cloneElement(feature.icon, {
                className: "w-10 h-10 text-indigo-600 group-hover:text-indigo-700 transition-colors duration-200"
              })}
            </div>
          </motion.div>
          
          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
            {feature.title}
          </h3>
          
          <p className="text-gray-600 leading-relaxed text-lg group-hover:text-gray-700 transition-colors duration-200">
            {feature.description}
          </p>
        </div>

        <motion.div
          initial={false}
          className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-100 rounded-2xl transition-colors duration-300"
          whileHover={{ scale: 1.02 }}
        />
      </div>
    </motion.div>
  );
};

export default function Features() {
  const features = [
    {
      icon: <FaCloudUploadAlt className="w-12 h-12 text-indigo-600" />,
      title: "Easy Upload",
      description: "Effortlessly upload your files with our intuitive drag-and-drop interface",
    },
    {
      icon: <FaMicrophone className="w-12 h-12 text-indigo-600" />,
      title: "Live Recording",
      description: "Capture and transcribe meetings and interviews in real-time with high precision",
    },
    {
      icon: <FaFileAlt className="w-12 h-12 text-indigo-600" />,
      title: "SRT Export",
      description: "Generate industry-standard subtitle files ready for professional use",
    },
    {
      icon: <FaLanguage className="w-12 h-12 text-indigo-600" />,
      title: "Multiple Languages",
      description: "Transcribe content in over 20 languages with native-level accuracy",
    },
    {
      icon: <FaClock className="w-12 h-12 text-indigo-600" />,
      title: "Fast Processing",
      description: "Get your transcriptions quickly with our optimized processing engine",
    },
    {
      icon: <FaCheckCircle className="w-12 h-12 text-indigo-600" />,
      title: "High Accuracy",
      description: "Experience industry-leading precision with our advanced AI technology",
    },
  ];

  return (
    <section className="py-24 " id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent mb-6">
            Powerful Features
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform your audio and video content into accurate, professional transcriptions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
