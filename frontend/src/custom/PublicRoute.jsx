import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/authContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return !isAuthenticated ? children : <Navigate to="/" />;
};

export default PublicRoute;
