

// import React, {
//   createContext,
//   useState,
//   useEffect,
//   useContext,
//   useCallback,
// } from "react";
// import { useNavigate } from "react-router-dom";
// // import { toast } from "material-react-toastify";
// import { contactsAPI } from "../services/api";
// import { useToast } from "../hooks/useToast";

// const ContactAuthContext = createContext(null);

// export const useContactAuth = () => {
//   const context = useContext(ContactAuthContext);
//   if (!context) {
//     throw new Error("useContactAuth must be used within AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const navigate = useNavigate();
// const toast = useToast();
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [accounts, setAccounts] = useState([]);
//   const [accountId, setAccountId] = useState(null);
//   const [role, setRole] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const isAuthenticated = !!token && !!accountId;

//   // ================= INIT =================
//   useEffect(() => {
//     const storedToken = sessionStorage.getItem("token");
//     const storedUser = sessionStorage.getItem("user");
//     const storedAccounts = sessionStorage.getItem("accounts");
//     const storedAccountId = sessionStorage.getItem("accountId");
//     const storedRole = sessionStorage.getItem("role");

//     if (storedToken && storedUser) {
//       setToken(storedToken);
//       setUser(JSON.parse(storedUser));
//       setAccounts(storedAccounts ? JSON.parse(storedAccounts) : []);
//       setAccountId(storedAccountId || null);
//       setRole(storedRole || null);
//     }

//     setLoading(false);
//   }, []);

//   // ================= CLEAR =================
//   const clearAuth = useCallback(() => {
//     sessionStorage.clear();
//     setToken(null);
//     setUser(null);
//     setAccounts([]);
//     setAccountId(null);
//     setRole(null);
//   }, []);

//   // ================= ACCOUNT SELECT =================
//   const setSelectedAccount = useCallback((id) => {
//     sessionStorage.setItem("accountId", id);
//     setAccountId(id);
//   }, []);

//   // ================= LOGIN =================
//   const login = async (email, password) => {
//     try {
//       const res = await contactsAPI.ContCtLogin({
//         email,
//         password,
//       });

//       const { token, user, accounts } = res.data;

//       if (!token || !user) {
//         return {
//           success: false,
//           error: "Invalid response from server",
//         };
//       }

//       const decoded = JSON.parse(atob(token.split(".")[1]));
//       const userRole = decoded.role || "client";

//       const userData = {
//         id: user.id,
//         email: user.email,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         tenantId: user.tenantId,
//         role: userRole,
//       };

//       sessionStorage.setItem("token", token);
//       sessionStorage.setItem("user", JSON.stringify(userData));
//       sessionStorage.setItem("accounts", JSON.stringify(accounts));
//       sessionStorage.setItem("role", userRole);
//       sessionStorage.setItem("email",userData.email);

//       setToken(token);
//       setUser(userData);
//       setAccounts(accounts);
//       setRole(userRole);

//       toast.success("Login successful");

//       return { success: true, accounts, role: userRole };
//     } catch (error) {
//       console.error("Login error:", error);

//       return {
//         success: false,
//         error: error.response?.data?.message || "Login failed",
//       };
//     }
//   };

//   // ================= LOGOUT =================
//   const logout = useCallback(() => {
//     clearAuth();
//     navigate("/client/login", { replace: true });
//     toast.info("Logged out");
//   }, [clearAuth, navigate]);

//   if (loading) return null;

//   return (
//     <ContactAuthContext.Provider
//       value={{
//         user,
//         token,
//         accounts,
//         accountId,
//         role,
//         isAuthenticated,
//         login,
//         logout,
//         setSelectedAccount,
//       }}
//     >
//       {children}
//     </ContactAuthContext.Provider>
//   );
// };

// export default AuthProvider;

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { contactsAPI } from "../services/api";
import { useToast } from "../hooks/useToast";

const ContactAuthContext = createContext(null);

export const useContactAuth = () => {
  const context = useContext(ContactAuthContext);
  if (!context) {
    throw new Error("useContactAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const toast = useToast();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token && !!accountId;

  const AUTO_LOGOUT_TIME = 2 * 60 * 60 * 1000; // ✅ 2 hours
// const AUTO_LOGOUT_TIME = 1 * 60 * 1000; // ✅ 1 minute
  // ================= INIT =================
  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    const storedUser = sessionStorage.getItem("user");
    const storedAccounts = sessionStorage.getItem("accounts");
    const storedAccountId = sessionStorage.getItem("accountId");
    const storedRole = sessionStorage.getItem("role");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setAccounts(storedAccounts ? JSON.parse(storedAccounts) : []);
      setAccountId(storedAccountId || null);
      setRole(storedRole || null);
    }

    setLoading(false);
  }, []);

  // ================= CLEAR =================
  const clearAuth = useCallback(() => {
    sessionStorage.clear();
    setToken(null);
    setUser(null);
    setAccounts([]);
    setAccountId(null);
    setRole(null);
  }, []);

  // ================= LOGOUT =================
  const logout = useCallback(() => {
    clearAuth();
    navigate("/client/login", { replace: true });
    toast.info("Logged out");
  }, [clearAuth, navigate, toast]);

  // ================= ACCOUNT SELECT =================
  const setSelectedAccount = useCallback((id) => {
    sessionStorage.setItem("accountId", id);
    setAccountId(id);
  }, []);

  // ================= LOGIN =================
  const login = async (email, password) => {
    try {
      const res = await contactsAPI.ContCtLogin({ email, password });

      const { token, user, accounts } = res.data;

      if (!token || !user) {
        return {
          success: false,
          error: "Invalid response from server",
        };
      }

      const decoded = JSON.parse(atob(token.split(".")[1]));
      const userRole = decoded.role || "client";

      const userData = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        tenantId: user.tenantId,
        role: userRole,
      };

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.setItem("accounts", JSON.stringify(accounts));
      sessionStorage.setItem("role", userRole);
      sessionStorage.setItem("email", userData.email);

      setToken(token);
      setUser(userData);
      setAccounts(accounts);
      setRole(userRole);

      toast.success("Login successful");

      return { success: true, accounts, role: userRole };
    } catch (error) {
      console.error("Login error:", error);

      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  // ================= TOKEN EXPIRY AUTO LOGOUT =================
  useEffect(() => {
    if (!token) return;

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));

      if (!decoded.exp) return;

      const expiryTime = decoded.exp * 1000;
      const currentTime = Date.now();
      const timeout = expiryTime - currentTime;

      if (timeout <= 0) {
        logout();
      } else {
        const timer = setTimeout(() => {
          toast.warning("Session expired");
          logout();
        }, timeout);

        return () => clearTimeout(timer);
      }
    } catch (err) {
      console.error("Token decode failed", err);
      logout();
    }
  }, [token, logout, toast]);

  // ================= INACTIVITY AUTO LOGOUT (2 HOURS) =================
  useEffect(() => {
    if (!token) return;

    let timer;

    const resetTimer = () => {
      clearTimeout(timer);

      timer = setTimeout(() => {
        toast.warning("Session expired due to inactivity");
        logout();
      }, AUTO_LOGOUT_TIME);
    };

    const events = ["mousemove", "keydown", "click", "scroll"];

    events.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer(); // initialize

    return () => {
      clearTimeout(timer);
      events.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [token, logout, toast]);

  if (loading) return null;

  return (
    <ContactAuthContext.Provider
      value={{
        user,
        token,
        accounts,
        accountId,
        role,
        isAuthenticated,
        login,
        logout,
        setSelectedAccount,
      }}
    >
      {children}
    </ContactAuthContext.Provider>
  );
};

export default AuthProvider;