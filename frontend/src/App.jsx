import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PublicRoute from "./custom/PublicRoute";
import PrivateRoute from "./custom/PrivateRoute";
import PageNotFound from "./pages/PageNotFound";
import BookDetailPage from "./pages/BookDetailPage";
import Footer from "./pages/Footer";

const App = () => {
  return (
    <div>
      <Navbar />

      <Routes>
        {/* Define your routes here */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
              <Footer />
            </PrivateRoute>
          }
        />
        <Route
          path="/book/:id"
          element={
            <PrivateRoute>
              <BookDetailPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};

export default App;
