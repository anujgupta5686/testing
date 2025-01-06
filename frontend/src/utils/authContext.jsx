import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

// Create AuthContext
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Custom Hook

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check token on initial load
  useEffect(() => {
    const token = Cookies.get("token");
    setIsAuthenticated(!!token);
  }, []);

  // Login function
  const login = (token) => {
    Cookies.set("token", token, { expires: 7 }); // Token expires in 1 day
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
