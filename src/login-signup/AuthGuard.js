// import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";

// export const AuthGuard = ({ children }) => {
//   const [loading, setLoading] = useState(true);
//   const [isAuth, setIsAuth] = useState(false);

//   useEffect(() => {
//     const token = sessionStorage.getItem("jwtToken");
//     const accountId = sessionStorage.getItem("accountId");

//     if (token && accountId) {
//       setIsAuth(true);
//     } else {
//       setIsAuth(false);
//     }

//     setLoading(false);
//   }, []);

//   if (loading) return null; // 👈 prevents flicker completely

//   if (!isAuth) return <Navigate to="/login" replace />;

//   return children;
// };

import { Navigate } from "react-router-dom";
import { useContactAuth } from "../context/Context";

export const AuthGuard = ({ children }) => {
  const { isAuthenticated, initialized } = useContactAuth();

  // 🔥 wait until auth system is ready
  if (!initialized) return null;

  // 🔥 redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};