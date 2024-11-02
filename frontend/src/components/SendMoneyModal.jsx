import React, { useState } from "react";

const SendMoneyModal = ({ user, closeModal, setUserData, userData }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const handleInput = (e) => {
    setInput(e.target.value);
    setError("")
  };
  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("User is not authenticated");
    }
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/account/balance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ amount: input, to: user._id }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setUserData({ ...userData, balance: userData.balance - input });
        setInput("")
        closeModal()
      } else {
        setError(data.message || "Failed to send money");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 ">
      <div className=" border-2 p-10 bg-white">
        <p className="text-center text-4xl p-6 pt-0 font-bold mb-4">Send Money</p>
        <div>
          <div className="flex items-center">
            <span className="flex items-center justify-center border-2 border-gray-300 rounded-full w-10 h-10 bg-black text-white font-bold">
              {user.firstname.charAt(0).toUpperCase()} 
            </span>
            <p className="ml-1">{user.firstname+" "+user.lastname}</p>
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="amount" className="font-medium mb-2">
            Amount (in Rs)
          </label>
          <input
            type="text"
            id="amount"
            placeholder="Enter Amount"
            name="amount"
            onChange={handleInput}
            className="border border-gray-400 p-2 rounded-md mb-3"
          />
           {error && <p className="text-red-600 mb-1">{error}</p>}
          <button onClick={handleSubmit} className="w-full p-2 border bg-black text-white rounded-lg">Initiate Transfer</button>
          <button onClick={closeModal}>Cancel</button>
        </div>
       
      </div>
    </div>
  );
};

export default SendMoneyModal;
