import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("authToken"); // Check for an auth token

  return isAuthenticated ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;
