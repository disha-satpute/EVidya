import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/signin"); // redirect to SignIn page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to CampusVerse 🚀</h1>
      <p className="text-lg text-gray-600 mb-6">
        Your all-in-one platform for students and campus life.
      </p>
      <button
        onClick={handleSignIn}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Sign In
      </button>
    </div>
  );
};

export default Landing;