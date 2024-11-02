import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Signin from "./Signin";
import Signup from "./Signup";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "./HomePage"; 

const Home = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Home;
