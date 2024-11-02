import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    firstname: "",
    lastname: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
    if (error) setError("");
  };
  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Signup Successful", data);
        setInput({ username: "", firstname: "", lastname: "", password: "" });
        const token = `Bearer ${data.token}`;
        localStorage.setItem("authToken", token);
        navigate("/dashboard");
      } else {
        console.log("Signup failed", data);
        setError(data.message || "Signup failed");
      }
    } catch (error) {
      console.log("Error while signup:", error);
      setError("An error occurred while signing up. Please try again.");
    }
  };
  return (
    <div className=" h-screen flex justify-center items-center bg-zinc-800	">
      <div className="px-8 py-6 bg-white rounded-md">
        <div className="text-center m-3">
          <p className="text-4xl font-bold mb-2">Sign Up</p>
          <p className="text-gray-500">
            Enter Your information to create a account
          </p>
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
          <label htmlFor="firstname" className="font-medium mb-2  ">
            Firstname
          </label>
          <input
            type="text"
            id="firstname"
            placeholder="Enter Firstname"
            name="firstname"
            onChange={handleInput}
            className="border border-black p-2 rounded-md"
          />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="lastname" className="font-medium mb-2">
            Lastname
          </label>
          <input
            type="text"
            id="lastname"
            placeholder="Enter Lastname"
            name="lastname"
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
          Signup
        </button>
        
        <p className="text-center">
          Already have an account?{" "}
          <span
            onClick={() => {
              navigate("/signin");
            }}
            className="cursor-pointer underline decoration-solid"
          >
            Signin
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
