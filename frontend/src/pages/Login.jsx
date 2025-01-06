import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { emailSchema, passwordSchema } from "@/form-validate";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "@/form-validate";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiConnector } from "@/services/apiConnector";
import { authEndpoints } from "@/services/apis";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/authContext"; // Use auth context

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // React Hook Form for Signup
  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
    reset: resetSignup,
  } = useForm({
    resolver: zodResolver(userSchema),
  });

  // React Hook Form for Login
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm({
    resolver: zodResolver(
      z.object({
        email: emailSchema,
        password: passwordSchema,
      })
    ),
  });

  // Signup Handler
  const onSignupSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await apiConnector("POST", authEndpoints.SIGNUP, data);

      if (response.data.success) {
        toast.success(response.data.message);
        resetSignup();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred during signup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Login Handler
  const onLoginSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await apiConnector("POST", authEndpoints.LOGIN, data);
      console.log("Response::", response);

      if (response?.data?.success) {
        toast.success(response.data.message);
        login(response.data.token);
        navigate("/");
      } else {
        toast.error(
          response?.data?.message || "Login failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Login error:", error);

      // Handle API Error Response
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred during login. Please try again.");
      }
    } finally {
      setLoading(false);
      resetLogin();
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Tabs defaultValue="signup" className="w-[400px]">
        {/* Tabs Switch */}
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>

        {/* Signup Tab */}
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>
                Create your account by filling in the details below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <form onSubmit={handleSignupSubmit(onSignupSubmit)}>
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    {...registerSignup("name")}
                  />
                  {signupErrors.name && (
                    <p className="text-red-500">{signupErrors.name.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    {...registerSignup("email")}
                  />
                  {signupErrors.email && (
                    <p className="text-red-500">{signupErrors.email.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showSignupPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...registerSignup("password")}
                    />
                    <span
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                    >
                      {showSignupPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {signupErrors.password && (
                    <p className="text-red-500">
                      {signupErrors.password.message}
                    </p>
                  )}
                </div>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full my-5 flex justify-center items-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Please wait
                      </>
                    ) : (
                      "Signup"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Login Tab */}
        {/* Login Tab */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Log in to your account using your credentials.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <form onSubmit={handleLoginSubmit(onLoginSubmit)}>
                {/* Email Field */}
                <div className="space-y-1">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    placeholder="Enter your email"
                    {...registerLogin("email")}
                  />
                  {loginErrors.email && (
                    <p className="text-red-500">{loginErrors.email.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...registerLogin("password")}
                    />
                    <span
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                    >
                      {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {loginErrors.password && (
                    <p className="text-red-500">
                      {loginErrors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full my-5 flex justify-center items-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Please wait
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
