import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import {  FiMusic, FiFileText, FiUser, FiMail, FiDownload } from 'react-icons/fi';
import { format } from 'date-fns';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);


export default function History() {
  const [user, setUser] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchUserAndUploads() {
      try {
        const response = await supabase.auth.getUser();
        const user = response?.data?.user ?? null;

        if (!user) {
          setLoading(false);
          return;
        }
        setUser(user);

        const { data, error } = await supabase
          .from('uploads')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching uploads:', error);
        } else {
          setUploads(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserAndUploads();
  }, []);

  const filteredUploads = uploads
    .filter(upload => {
      if (filter === 'all') return true;
      return upload.type === filter;
    })
    .filter(upload =>
      upload.filename?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  if (loading)
    return (
      <div className="flex fixed inset-0 items-center justify-center min-h-screen">
        <div className="inset-0 flex justify-center items-center animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        <p className="text-md font-semibold text-gray-700 ml-4">Loading...</p>

      </div>
    );

  if (!user)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen bg-gray-50"
      >
        <FiUser className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
        <p className="text-gray-600">Please login to view your transcription history.</p>
      </motion.div>
    );

  return (
    <div className="inset-0 mt-16 fixed flex justify-center min-h-screen w-full">
        <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className=" max-w-7xl mx-auto p-6 lg:p-8 font-sans"
        >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 mb-8 text-white ">
            <h1 className="text-4xl font-bold mb-6 w-min-screen">Transcription History</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
                <FiMail className="w-6 h-6" />
                <div>
                <p className="text-sm opacity-75">Email</p>
                <p className="font-medium">{user.email}</p>
                </div>
            </div>
            </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex space-x-4">
                {['all','audio','video' ].map(type => (
                <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-4 py-2 rounded-lg transition-all ${filter === type
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
                ))}
            </div>
            <input
                type="text"
                placeholder="Search by filename..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            </div>
        </div>

        {/* Uploads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUploads.length === 0 ? (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12 bg-white rounded-xl shadow-md"
            >
                <FiFileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No transcriptions found</p>
            </motion.div>
            ) : (
            filteredUploads.map((upload, idx) => (
                <motion.div
                key={upload.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        {upload.type === 'audio' ? (
                        <FiMusic className="w-5 h-5 text-indigo-600" />
                        ) : (
                        <FiFileText className="w-5 h-5 text-purple-600" />
                        )}
                        <span className="font-medium text-gray-900">
                        {upload.filename || `Upload ${upload.id}`}
                        </span>
                    </div>
                    <span className="text-sm text-gray-500">
                        {format(new Date(upload.created_at), 'MMM dd, yyyy')}
                    </span>
                    </div>

                    <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Duration</span>
                        <span className="font-medium text-gray-900">
                        {upload.duration || 'N/A'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Words</span>
                        <span className="font-medium text-gray-900">
                        {upload.word_count || 'N/A'}
                        </span>
                    </div>
                    </div>

                    <div className="mt-6 flex space-x-3">
                    <a
                        href={upload.audio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                    >
                        <FiMusic className="w-4 h-4 mr-2" />
                        Media
                    </a>
                    <a
                        href={upload.srt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                        <FiDownload className="w-4 h-4 mr-2" />
                        SRT
                    </a>
                    </div>
                </div>
                </motion.div>
            ))
            )}
        </div>
        </motion.div>
    </div>
  );
}