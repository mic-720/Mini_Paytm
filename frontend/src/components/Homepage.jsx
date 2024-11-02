import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-zinc-800 to-zinc-900 text-white text-center">
            <h1 className="text-5xl font-bold mb-4">Welcome to the Payments App</h1>
            <p className="text-lg mb-8">
                Manage your transactions easily and securely.
            </p>
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => navigate("/signin")}
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                >
                    Sign In
                </button>
                <button
                    onClick={() => navigate("/signup")}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition"
                >
                    Sign Up
                </button>
            </div>

            <footer className="absolute bottom-4 text-gray-400 text-sm">
                © 2024 Payments App. All rights reserved.
            </footer>
        </div>
    );
};

export default HomePage;
