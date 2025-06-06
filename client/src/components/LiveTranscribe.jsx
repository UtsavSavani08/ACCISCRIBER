import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMic, FiStopCircle, FiTrash2, FiDownload, FiGlobe, FiPause, FiPlay } from "react-icons/fi";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

const FORMATS = [
  { mime: "audio/webm", label: "WebM" },
  { mime: "audio/wav", label: "WAV" },
];

const LANGUAGES = [
  { code: "nl", label: "Dutch" },
  { code: "es", label: "Spanish" },
  { code: "ko", label: "Korean" },
  { code: "it", label: "Italian" },
  { code: "de", label: "German" },
  { code: "th", label: "Thai" },
  { code: "ru", label: "Russian" },
  { code: "pt", label: "Portuguese" },
  { code: "pl", label: "Polish" },
  { code: "id", label: "Indonesian" },
  { code: "zh-TW", label: "Mandarin (TW)" },
  { code: "sv", label: "Swedish" },
  { code: "cs", label: "Czech" },
  { code: "en", label: "English" },
  { code: "ja", label: "Japanese" },
  { code: "fr", label: "French" },
  { code: "ro", label: "Romanian" },
  { code: "yue", label: "Cantonese (CN)" },
  { code: "hi", label: "Hindi" },
];

function formatSRT(transcripts) {
  return transcripts
    .map((line, idx) => {
      const match = line.match(/^\[(\d+\.\d+)s -> (\d+\.\d+)s\] (.*)$/);
      if (!match) return null;
      const [_, start, end, text] = match;
      const sec = Number(start);
      const toSRTTime = (s) => {
        const sec = Number(s);
        const h = String(Math.floor(sec / 3600)).padStart(2, "0");
        const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
        const s2 = String((sec % 60).toFixed(3)).padStart(6, "0").replace(".", ",");
        return `${h}:${m}:${s2}`;
      };
      return `${idx + 1}
${toSRTTime(start)} --> ${toSRTTime(end)}
${text}
`;
    })
    .filter(Boolean)
    .join("\n");
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function LiveTranscribe() {
  const [transcripts, setTranscripts] = useState([]);
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [chunkMs, setChunkMs] = useState(5000);
  const [format, setFormat] = useState(FORMATS[0].mime);
  const [error, setError] = useState("");
  const [mediaStream, setMediaStream] = useState(null);
  const [language, setLanguage] = useState("en");
  const wsRef = useRef(null);
  const recordingRef = useRef(recording);
  const pausedRef = useRef(paused);
  const navigate = useNavigate();

  useEffect(() => {
    recordingRef.current = recording;
    pausedRef.current = paused;
  }, [recording, paused]);

  const handleWSMessage = (event) => {
    console.log("Frontend: Received response from server:", event.data);
    const data = JSON.parse(event.data);
    if (data.segments) {
      const newLines = data.segments.map(seg =>
        `[${seg.start.toFixed(2)}s -> ${seg.end.toFixed(2)}s] ${seg.text}`
      );
      setTranscripts(prev => [...prev, ...newLines]);
    }
    if (data.error) setError(data.error);
  };

  const recordChunkWS = (stream) => {
    if (!recordingRef.current || pausedRef.current) return;
    const mediaRecorder = new window.MediaRecorder(stream, { mimeType: format });
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0 && wsRef.current && wsRef.current.readyState === 1) {
        event.data.arrayBuffer().then(buffer => {
          wsRef.current.send(buffer);
        });
      }
    };
    mediaRecorder.start();

    setTimeout(() => {
      if (mediaRecorder.state !== "inactive") mediaRecorder.stop();
    }, chunkMs);

    mediaRecorder.onstop = () => {
      if (recordingRef.current && !pausedRef.current) {
        recordChunkWS(stream);
      }
    };
  };

  const startRecording = async () => {
    setTranscripts([]);
    setError("");
    setRecording(true);
    setPaused(false);

    wsRef.current = new window.WebSocket("ws://localhost:8000/analyze/ws/transcribe");
    wsRef.current.onmessage = handleWSMessage;
    wsRef.current.onerror = () => setError("WebSocket error");
    wsRef.current.onclose = () => setRecording(false);

    wsRef.current.onopen = async () => {
      wsRef.current.send(language); // 1. Send language code as first message!

      // 2. Fetch user ID from Supabase and send as second message
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      if (!session) {
        setError("You must be logged in to use live transcription.");
        wsRef.current.close();
        setRecording(false);
        return;
      }
      wsRef.current.send(session.user.id); // 2. Send user ID

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMediaStream(stream);
        recordChunkWS(stream);
      } catch (err) {
        setError("Could not access microphone or start recording.");
        setRecording(false);
      }
    };
  };

  const pauseRecording = () => setPaused(true);

  const resumeRecording = () => {
    setPaused(false);
    if (mediaStream) recordChunkWS(mediaStream);
  };

  const stopRecording = () => {
    setRecording(false);
    setPaused(false);
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const clearTranscription = () => {
    setTranscripts([]);
    setError("");
  };

  const downloadSRT = () => {
    const srt = formatSRT(transcripts);
    const blob = new Blob([srt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcription.srt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex mt-20 inset-0 fixed justify-center items-start min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Transcription</h1>
            <p className="text-gray-600">Convert speech to text in real-time with high accuracy</p>
          </motion.div>

          <div className="space-y-6">
            {/* Controls Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex flex-wrap items-center gap-4 justify-center">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                  <FiGlobe className="text-gray-500" />
                  <select
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                    disabled={recording}
                    className="bg-transparent outline-none text-gray-700 font-medium w-32"
                    style={{
                      maxHeight: 120,
                      overflowY: 'auto',
                      minWidth: 100,
                      width: 128,
                      display: 'block'
                    }}
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.label}</option>
                    ))}
                  </select>
                </div>
                {/* <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                  <select
                    value={format}
                    onChange={e => setFormat(e.target.value)}
                    disabled={recording}
                    className="bg-transparent outline-none text-gray-700 font-medium w-24"
                  >
                    {FORMATS.map(f => (
                      <option key={f.mime} value={f.mime} disabled={!MediaRecorder.isTypeSupported(f.mime)}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                  <span className="text-gray-500 text-xs">Format</span>
                </div> */}
                {/* <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                  <input
                    type="number"
                    min={1000}
                    step={500}
                    value={chunkMs}
                    onChange={e => setChunkMs(Number(e.target.value))}
                    disabled={recording}
                    className="w-20 px-2 py-1 border rounded text-gray-700"
                  />
                  <span className="text-gray-500 text-xs">ms/chunk</span>
                </div> */}
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startRecording}
                    disabled={recording}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium shadow-sm transition-all duration-200
                      ${recording ? "bg-gray-100 text-gray-400" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
                  >
                    <FiMic className="text-lg" /> Start
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={pauseRecording}
                    disabled={!recording || paused}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium shadow-sm transition-all duration-200
                    ${!recording || paused ? "bg-gray-100 text-gray-400" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"}`}
                  >
                    <FiPause className="text-lg" /> Pause
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resumeRecording}
                    disabled={!recording || !paused}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium shadow-sm transition-all duration-200
                    ${!pauseRecording || !paused ? "bg-gray-100 text-gray-400" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                  >
                    <FiPlay className="text-lg" /> Resume
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={stopRecording}
                    disabled={!recording}
                   className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium shadow-sm transition-all duration-200
                    ${!recording ? "bg-gray-100 text-gray-400" : "bg-red-500 text-white hover:bg-red-600"}`}
                  >
                    <FiStopCircle className="text-lg" /> Stop
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearTranscription}
                    className="flex items-center gap-2 px-6 py-2 rounded-lg font-medium shadow-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200"
                  >
                    <FiTrash2 className="text-lg" /> Clear
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={downloadSRT}
                    disabled={transcripts.length === 0}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium shadow-sm transition-all duration-200
                      ${transcripts.length === 0 ? "bg-gray-100 text-gray-400" : "bg-green-600 text-white hover:bg-green-700"}`}
                  >
                    <FiDownload className="text-lg" /> Download SRT
                  </motion.button>
                </div>
              </div>
              {error && <div className="text-red-500 text-center mt-2">{error}</div>}
            </div>

            {/* Transcription Output */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-sm font-medium text-gray-700">Transcription Output</h2>
              </div>
              <div
                className="p-6"
                style={{
                  minHeight: 300,
                  maxHeight: 400,
                  overflowY: "auto",
                  fontFamily: "monospace",
                  fontSize: "0.95rem",
                  whiteSpace: "pre-line",
                }}
              >
                {transcripts.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <p>Start recording to see transcription...</p>
                  </div>
                ) : (
                  transcripts.map((line, idx) => (
                    <div key={idx} className="mb-2 p-2 rounded bg-gray-50">{line}</div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}