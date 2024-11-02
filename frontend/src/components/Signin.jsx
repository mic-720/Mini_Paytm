import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [input, setInput] = useState({
    username: "",
    password: "",
  });
  const apiUrl = import.meta.env.VITE_API_URL;
  const handleInput = (e) => {
    let { name, value } = e.target;
    setInput({ ...input, [name]: value });
    if (error) setError("");
  };
  const handleSubmit = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/user/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const data = await response.json();
      if (response.ok) {
        const token = `Bearer ${data.token}`;
        localStorage.setItem("authToken", token);
        setInput({
          username: "",
          password: "",
        });
        console.log(data.message);
        navigate("/dashboard");
      } else {
        setError(data.message);
        console.log(data.message || "Signin Failed");
      }
    } catch (error) {
      setError("An error occurred while signing up. Please try again.");
    }
  };
  return (

    <div className=" h-screen flex justify-center items-center bg-zinc-800	">
      <div className="px-8 py-6 bg-white rounded-md">
        <div className="text-center m-3">
          <p className="text-4xl font-bold mb-2">Sign In</p>
          <p className="text-gray-500">
            Enter your details to log in to your account          </p>
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="username" className="font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Enter Username"
            name="username"
            onChange={handleInput}
            className="border border-black p-2 rounded-md"
          />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="password" className="font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter Password"
            name="password"
            onChange={handleInput}
            className="border border-black p-2 rounded-md"
          />
        </div>
        {error && <p className="text-red-600 ">{error}</p>}
        <button
          onClick={handleSubmit}
          className="w-full p-3 bg-black text-white text-md rounded-md mt-2 mb-2"
        >
          Signin
        </button>

        <p className="text-center">
          Don't have an account?{" "}
          <span
            onClick={() => {
              navigate("/signup");
            }}
            className="cursor-pointer underline decoration-solid"
          >
            Signup
          </span>
        </p>
      </div>
    </div>



  );
};

export default Signin;
