import React from "react";

export default function Documents() {
  const handlecontact = () => {
    window.location.href = "mailto:hello@dobodo.com";
  };
  return (
    <section className="mt-10 min-h-screen w-screen bg-slate-50 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Documentation
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Welcome to the Acciscribe documentation. Learn how to transform your audio and video content into accurate, professional transcriptions.
          </p>
        </div>

        {/* Quick Start Section */}
        <div className="mb-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-xl">🚀</span> Quick Start
          </h2>
          <ol className="space-y-4 text-gray-700">
            <li className="flex gap-3">
              <span className="font-medium text-blue-600">1.</span>
              <span>Sign up or log in to your Acciscribe account</span>
            </li>
            <li className="flex gap-3">
              <span className="font-medium text-blue-600">2.</span>
              <span>Select your preferred transcription tool</span>
            </li>
            <li className="flex gap-3">
              <span className="font-medium text-blue-600">3.</span>
              <span>Upload your media or start recording</span>
            </li>
            <li className="flex gap-3">
              <span className="font-medium text-blue-600">4.</span>
              <span>Review and download your transcription</span>
            </li>
          </ol>
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Available Tools</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Audio to Text</h3>
              <p className="text-gray-600">Convert audio files (MP3, WAV, M4A) to accurate, timestamped transcripts. Perfect for podcasts, interviews, and lectures.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Video to Text</h3>
              <p className="text-gray-600">Generate captions and transcripts from video content (MP4, MOV, AVI). Ideal for content creators and educational material.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Live Recording</h3>
              <p className="text-gray-600">Real-time transcription for meetings and presentations. Capture and transcribe audio as it happens.</p>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="mb-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Technical Specifications</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Supported Formats</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Audio: MP3, WAV, M4A (max 200MB)</li>
                <li>• Video: MP4, MOV, AVI (max 200MB)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Language Support</h3>
              <p className="text-gray-600">20+ languages including English, Dutch, Portuguese, Korean, Italian, Swedish, Russian, Japanese, Spanish, French, German, Chinese, and more. 95%+ accuracy for clear audio.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Time</h3>
              <p className="text-gray-600">Most files are processed within appropriate time, depending on file length and server load.</p>
            </div>
          </div>
        </div>

        {/* Enterprise Features */}
        {/* <div className="mb-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Enterprise Solutions</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-medium text-gray-900">API Integration</h3>
                <p className="text-gray-600">Access our API for automated transcription workflows</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-medium text-gray-900">Custom Solutions</h3>
                <p className="text-gray-600">Tailored integration support for your specific needs</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-medium text-gray-900">Priority Support</h3>
                <p className="text-gray-600">Dedicated support team with SLA guarantees</p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Contact Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-6">Our support team is available to assist you with any questions.</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors" onClick={handlecontact}>
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}