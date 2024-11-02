import React, { useEffect, useState } from "react";
import SendMoneyModal from "./SendMoneyModal";
import Logout from "./Logout";

const Dashboard = () => {
  const [userData, setUserData] = useState({ username: "", balance: "" });
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("User is not authenticated");
      }
      const response = await fetch(
        "http://localhost:3000/api/v1/user/profile",
        {
          method: "GET",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUserData(data);
      }
    };
    fetchUserData();
  }, []);
  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput(value);
  };
  const handleClick = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("User is not authenticated");
    }
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/user/bulk?filter=${input}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users);
        setInput("");
      }
    } catch (error) {
      setError(error);
    }
  };
  return (
    <div className="p-8 text-center sm:text-left">
      <div className="flex flex-col sm:flex-row justify-between items-center border-b pb-4">
        <p className="font-bold text-3xl sm:text-4xl">Payments App</p>
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          <span className="text-lg sm:text-xl font-semibold text-gray-700">
            Hello, {userData.username}
          </span>
          <span className="flex items-center justify-center border-2 border-gray-400 rounded-full w-10 h-10 bg-black text-white font-bold">
            {userData.username.charAt(0).toUpperCase()}
          </span>
          <Logout/>
        </div>
      </div>

      <div className="py-8">
        <p className="text-lg "><span className="font-semibold">Your balance</span> <span>{parseFloat(userData.balance).toFixed(3)}</span>
        </p>
      </div>
      <div className="flex pb-4">
        <input
          type="text"
          placeholder="Find Users to Send Money"
          name="filter"
          onChange={handleInput}
          className="border border-gray-300 py-2 px-4 rounded-l-lg w-full focus:outline-none"
        />
        <button
          onClick={handleClick}
          className="p-2 border-2 border-l-0 border-gray-300 rounded-r-lg bg-gray-100 hover:bg-gray-200"
        >
          Search
        </button>
      </div>
      <div>
        {users ? (
          users.map((user) => (
            <div key={user._id} className="flex items-center gap-4 p-4 border border-gray-300 rounded-lg ">
              <span className="flex items-center justify-center border-2 border-gray-300 rounded-full w-10 h-10 bg-black text-white font-bold">
                {user.firstname.charAt(0).toUpperCase()}
              </span>

              <span className="text-lg font-semibold text-gray-800">
                {user.firstname.charAt(0).toUpperCase() + user.firstname.slice(1).toLowerCase() + " " +
                  user.lastname.charAt(0).toUpperCase() + user.lastname.slice(1).toLowerCase()}
              </span>

              <button
                className="ml-auto px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2"
                onClick={() => {
                  openModal(user);
                }}
              >
                Send Money
              </button>
            </div>

          ))
        ) : (
          <p>No users found</p>
        )}

        {isModalOpen && (
          <SendMoneyModal
            user={selectedUser}
            closeModal={closeModal}
            setUserData={setUserData}
            userData={userData}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
