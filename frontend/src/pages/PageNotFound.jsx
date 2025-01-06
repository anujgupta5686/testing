import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      <div className="text-center animate-fadeIn">
        <h1 className="text-9xl font-bold mb-4 animate-bounce">404</h1>
        <h2 className="text-3xl font-semibold mb-2">Oops! Page Not Found</h2>
        <p className="text-gray-400 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <span
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
        >
          Go Back Home
        </span>
      </div>
      <div className="absolute -top-10 left-1/4 w-72 h-72 bg-purple-600 rounded-full opacity-50 blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-10 right-1/4 w-72 h-72 bg-blue-500 rounded-full opacity-50 blur-3xl animate-pulse"></div>
    </div>
  );
};

export default PageNotFound;
