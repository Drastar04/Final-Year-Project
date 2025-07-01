import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem("email"));

  if (!userData || !userData.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
