
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./Dashboard";
import LoginPage from "./login-signup/Signin";

import ForgotPassword from "./login-signup/ForgotPassword";
import ResetPassword from "./login-signup/ResetPassword";
import UpdatePassword from "./login-signup/ActivateAccount";

// pages
import Home from "./pages/Home";
import ProtectedRoute from "./context/ProtecteRoute";


const App = () => {
  return (
    <Routes>
      {/* AUTH */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/updatepassword/:token" element={<UpdatePassword />} />

      {/* DASHBOARD LAYOUT */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
           </ProtectedRoute>
        }
      >
        <Route path="home" element={ <ProtectedRoute>
              <Home />
             </ProtectedRoute>} />

      </Route>

      {/* default */}
      <Route path="/" element={<Navigate to="/home" />} />
    </Routes>
  );
};

export default App;