import { Button } from "@/components/ui/button";
import React from "react";
import logo from "../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../utils/authContext";
import { apiConnector } from "@/services/apiConnector";
import { authEndpoints } from "@/services/apis";
import Cookies from "js-cookie";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = async () => {
    try {
      // const token = localStorage.getItem("token");
      const token = Cookies.get("token");
      if (!token) {
        toast.error("No token found. Please log in again.");
        return;
      }

      const response = await apiConnector("POST", authEndpoints.LOGOUT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Logout response:", response);

      if (response.data.success) {
        Cookies.remove("token");
        logout(); // Update the global state
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout. Please try again.");
    }
  };

  return (
    <div className="flex justify-between px-16 items-center py-2 bg-slate-300">
      <Link to={"/"}>
        <img src={logo} alt="Logo" loading="lazy" width={150} />
      </Link>
      <div className="flex gap-2 items-center">
        {isAuthenticated ? (
          <Button size="sm" onClick={handleLogout}>
            Log Out
          </Button>
        ) : (
          <Link to={"/login"}>
            <Button size="sm">Sign In</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
