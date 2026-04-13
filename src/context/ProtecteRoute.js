import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useContactAuth } from "../context/Context";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  redirectTo = "/login",
}) => {
  const { isAuthenticated, loading, token, accountId, role } =
    useContactAuth();

  const location = useLocation();

  // ================= LOADING =================
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ================= AUTH CHECK =================
  if (!isAuthenticated || !token || !accountId) {
    return (
      <Navigate to={redirectTo} state={{ from: location }} replace />
    );
  }

  // ================= ROLE CHECK =================
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ================= RENDER =================
  return children || <Outlet />;
};

export default ProtectedRoute;