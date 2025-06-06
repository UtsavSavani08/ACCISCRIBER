import { Link } from "react-router-dom";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";

export default function Success() {
  return (
    <div className="flex inset-0 fixed  items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white shadow-lg border border-green-100">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute -inset-1 bg-green-100 rounded-full animate-pulse"></div>
            <FiCheckCircle className="relative text-green-500 w-20 h-20" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mt-6 mb-3 text-green-700 text-center">Payment Successful!</h1>
        <p className="text-lg text-green-800 mb-8 text-center leading-relaxed">
          Thank you for your purchase. Your credits will be added to your account shortly.
        </p>
        
        <div className="flex justify-center">
          <Link
            to="/"
            className="group flex items-center px-6 py-3 rounded-lg bg-green-600 hover:text-white text-white font-semibold hover:bg-white hover:text-green-600 hover:border-green-600 border border-transparent transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Go to Dashboard
            <FiArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </div>
  );
}