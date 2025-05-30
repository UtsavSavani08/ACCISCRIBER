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

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/record"
          element={
            <ProtectedRoute>
              <Record />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/download" element={<Download />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
        <Route path="/history" element={<History />} />
      </Routes>
    </>
  );
}

export default App;
