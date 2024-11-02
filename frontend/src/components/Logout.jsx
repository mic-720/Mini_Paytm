import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/v1/user/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("authToken"), // include token if needed
                },
            });

            if (response.ok) {
                localStorage.removeItem("authToken");
                navigate("/signin");
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Error while logging out:", error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="ml-auto px-4 py-2 text-sm font-medium bg-white text-black rounded-lg shadow-md border-2 border-gray-300"
        >
            Logout
        </button>

    );
};

export default Logout;
