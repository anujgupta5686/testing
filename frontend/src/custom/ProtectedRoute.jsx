import React from "react";
import { useAuth } from "../utils/authContext";
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return children;
};

export default ProtectedRoute;
