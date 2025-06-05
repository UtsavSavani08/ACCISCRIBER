import { useState } from "react";
import "./assets/fonts/fonts.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Upload from "./components/upload.jsx";
import Landing from "./components/landing.jsx";
import Navbar from "./components/navbar.jsx";
import Record from "./components/record.jsx";
import Login from "./components/login.jsx";
import SignUp from "./components/signup.jsx";
import Download from "./components/download.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import History from "./components/history.jsx";
import Languages from "./components/languages.jsx";
import Pricing from "./components/Pricing.jsx";
import AudioToText from "./components/audiototext.jsx";
import Documents from "./components/Documents.jsx";
import LiveTranscribe from "./components/LiveTranscribe.jsx";


function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/video-to-text" element={<Upload />} />
        <Route path="/audio-to-text" element={<AudioToText />} />
        <Route path="/record" element={<Record />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/download" element={<Download />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
        <Route path="/history" element={<History />} />
        <Route path="/languages-supported" element={<Languages />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/live-transcribe" element={<LiveTranscribe />} />
      </Routes>
    </>
  );
}

export default App;
