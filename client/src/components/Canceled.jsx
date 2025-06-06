import { Link } from "react-router-dom";
import { FiXCircle, FiRefreshCw } from "react-icons/fi";

export default function Canceled() {
  return (
    <div className="flex flex-col inset-0 fixed items-center justify-center min-h-screen bg-gradient-to-b from-red-50 to-white">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white shadow-lg border border-red-100">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute -inset-1 bg-red-100 rounded-full opacity-75"></div>
            <FiXCircle className="relative text-red-500 w-20 h-20" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mt-6 mb-3 text-red-700 text-center">Payment Canceled</h1>
        <p className="text-lg text-red-800 mb-8 text-center leading-relaxed">
          Your payment was not completed. Don't worry - you can try again whenever you're ready.
        </p>

        <div className="flex justify-center">
          <Link
            to="/pricing"
            className="group flex items-center px-6 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-white hover:text-red-600 transition-all duration-200 shadow-md hover:shadow-xl hover:scale-105 hover:border-red-600 border border-transparent"
          >
            <FiRefreshCw className="mr-2 group-hover:rotate-180 transition-transform duration-300" />
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
}