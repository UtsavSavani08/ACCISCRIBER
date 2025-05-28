import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Login() {
  return (
    <>

        <div className='fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50'>
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <img src={logo} alt="Asscribe" srcset="" className="w-32 h-auto mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-6 text-center">Log-in</h2>
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Don't have an account? <Link to="/signup" className='text-blue-600 hover:underline'>Sign Up</Link>
                </p>
            </div>
            
        </div>
    </>
  )
}
