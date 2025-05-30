import React from "react";
import logo from "../assets/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);



export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setError("Passwords don't match");

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return setError(error.message);

    alert("Signup successful. Please check your email to confirm.");
    navigate('/login');
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <img src={logo} alt="Asscribe" className="w-32 h-auto mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-6 text-center">Sign-Up</h2>
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                onChange={e => setEmail(e.target.value)}
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                onChange={e => setPassword(e.target.value)}
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 mb-2"
                htmlFor="confirm-password"
              >
                Confirm Password
              </label>
              <input
                onChange={e => setConfirm(e.target.value)}
                type="password"
                id="confirm-password"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
              />
              {error && <p className="text-red-600 mb-4">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
