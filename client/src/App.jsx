import { useState } from "react";
import './assets/fonts/fonts.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Upload from "./components/upload.jsx";
import Landing from "./components/landing.jsx";
import Navbar from "./components/navbar.jsx";
import Record from "./components/record.jsx"; 
import Login from "./components/login.jsx";
import SignUp from "./components/signup.jsx";
import Download from "./components/download.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
      <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/record" element={<Record />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/download" element={<Download />} />
      </Routes>
    </>
  );
}

export default App;
