// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { contactsAPI } from "../services/api"; // ✅ updated
// import {
//   Box,
//   Paper,
//   TextField,
//   Button,
//   Typography,
//   Alert,
//   CircularProgress,
//   InputAdornment,
//   IconButton,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Container,
// } from "@mui/material";
// import {
//   Visibility,
//   VisibilityOff,
//   CheckCircle,
//   Cancel,
// } from "@mui/icons-material";

// const ResetPassword = () => {
//   const { token } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [verifying, setVerifying] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [userInfo, setUserInfo] = useState(null);

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const [formData, setFormData] = useState({
//     password: "",
//     confirmPassword: "",
//   });

//   const [passwordValidation, setPasswordValidation] = useState({
//     hasMinLength: false,
//     hasUpperCase: false,
//     hasLowerCase: false,
//     hasNumber: false,
//     hasSpecialChar: false,
//   });

//   useEffect(() => {
//     verifyToken();
//   }, [token]);

//   useEffect(() => {
//     validatePassword(formData.password);
//   }, [formData.password]);

//   const validatePassword = (password) => {
//     setPasswordValidation({
//       hasMinLength: password.length >= 8,
//       hasUpperCase: /[A-Z]/.test(password),
//       hasLowerCase: /[a-z]/.test(password),
//       hasNumber: /[0-9]/.test(password),
//       hasSpecialChar:
//         /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
//     });
//   };

//   const isPasswordValid = () => {
//     return Object.values(passwordValidation).every(Boolean);
//   };

//   // ✅ UPDATED: verify token using contactsAPI
//   const verifyToken = async () => {
//     try {
//       const response = await contactsAPI.ContCtVerifyResetToken(token);
//       setUserInfo(response.data.user);
//       setVerifying(false);
//     } catch (err) {
//       setError(
//         "Invalid or expired reset link. Please request a new password reset."
//       );
//       setVerifying(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     if (!isPasswordValid()) {
//       setError("Please ensure your password meets all the requirements below");
//       return;
//     }

//     setSubmitting(true);

//     try {
//       // ✅ UPDATED: use contactsAPI
//       await contactsAPI.ContCtResetPassword(token, {
//         password: formData.password,
//         confirmPassword: formData.confirmPassword,
//       });

//       setSuccess(
//         "Password reset successfully! You can now login with your new password."
//       );

//       setTimeout(() => {
//         navigate("/login");
//       }, 3000);
//     } catch (err) {
//       setError(
//         err.response?.data?.error ||
//           err.response?.data?.message ||
//           "Failed to reset password. Please try again."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const ValidationItem = ({ valid, text }) => (
//     <ListItem sx={{ py: 0.5 }}>
//       <ListItemIcon sx={{ minWidth: 32 }}>
//         {valid ? (
//           <CheckCircle color="success" fontSize="small" />
//         ) : (
//           <Cancel color="error" fontSize="small" />
//         )}
//       </ListItemIcon>
//       <ListItemText
//         primary={text}
//         sx={{
//           color: valid ? "success.main" : "error.main",
//           textDecoration: valid ? "none" : "line-through",
//           opacity: valid ? 1 : 0.7,
//         }}
//       />
//     </ListItem>
//   );

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (verifying) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
//         <Typography>Verifying reset link...</Typography>
//       </Box>
//     );
//   }

//   if (error && !userInfo) {
//     return (
//       <Container maxWidth="sm">
//         <Box mt={8}>
//           <Paper sx={{ p: 4 }}>
//             <Alert severity="error" sx={{ mb: 2 }}>
//               {error}
//             </Alert>
//             <Box textAlign="center">
//               <Link to="/client/forgot-password">
//                 <Button variant="contained">Request New Reset Link</Button>
//               </Link>
//             </Box>
//           </Paper>
//         </Box>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="sm">
//       <Box mt={8}>
//         <Paper sx={{ p: 4 }}>
//           <Typography variant="h4" align="center" gutterBottom>
//             Reset Your Password
//           </Typography>

//           {userInfo && (
//             <Typography align="center" sx={{ mb: 2 }}>
//               Hello <strong>{userInfo.name}</strong>
//             </Typography>
//           )}

//           {error && <Alert severity="error">{error}</Alert>}
//           {success && <Alert severity="success">{success}</Alert>}

//           <form onSubmit={handleSubmit}>
//             <TextField
//               fullWidth
//               label="New Password"
//               name="password"
//               type={showPassword ? "text" : "password"}
//               value={formData.password}
//               onChange={handleChange}
//               margin="normal"
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton onClick={() => setShowPassword(!showPassword)}>
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             {/* Validation */}
//             {formData.password && (
//               <List dense>
//                 <ValidationItem valid={passwordValidation.hasMinLength} text="Min 8 characters" />
//                 <ValidationItem valid={passwordValidation.hasUpperCase} text="Uppercase" />
//                 <ValidationItem valid={passwordValidation.hasLowerCase} text="Lowercase" />
//                 <ValidationItem valid={passwordValidation.hasNumber} text="Number" />
//                 <ValidationItem valid={passwordValidation.hasSpecialChar} text="Special character" />
//               </List>
//             )}

//             <TextField
//               fullWidth
//               label="Confirm Password"
//               name="confirmPassword"
//               type={showConfirmPassword ? "text" : "password"}
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               margin="normal"
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       onClick={() =>
//                         setShowConfirmPassword(!showConfirmPassword)
//                       }
//                     >
//                       {showConfirmPassword ? (
//                         <VisibilityOff />
//                       ) : (
//                         <Visibility />
//                       )}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             <Button
//               fullWidth
//               type="submit"
//               variant="contained"
//               sx={{ mt: 2 }}
//               disabled={submitting}
//             >
//               {submitting ? <CircularProgress size={20} /> : "Reset Password"}
//             </Button>
//           </form>

//           <Box textAlign="center" mt={2}>
//             <Link to="/client/login">
//               <Button>Back to Login</Button>
//             </Link>
//           </Box>
//         </Paper>
//       </Box>
//     </Container>
//   );
// };

// export default ResetPassword;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { contactsAPI } from "../services/api";
import { 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  Shield,
  Key,
  User
} from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [passwordValidation, setPasswordValidation] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  useEffect(() => {
    verifyToken();
  }, [token]);

  useEffect(() => {
    validatePassword(formData.password);
  }, [formData.password]);

  const validatePassword = (password) => {
    setPasswordValidation({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    });
  };

  const isPasswordValid = () => {
    return Object.values(passwordValidation).every(Boolean);
  };

  const verifyToken = async () => {
    try {
      const response = await contactsAPI.ContCtVerifyResetToken(token);
      setUserInfo(response.data.user);
      setVerifying(false);
    } catch (err) {
      setError(
        "Invalid or expired reset link. Please request a new password reset."
      );
      setVerifying(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!isPasswordValid()) {
      setError("Please ensure your password meets all the requirements below");
      return;
    }

    setSubmitting(true);

    try {
      await contactsAPI.ContCtResetPassword(token, {
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      setSuccess(
        "Password reset successfully! You can now login with your new password."
      );

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const ValidationItem = ({ valid, text }) => (
    <div className="flex items-center py-1.5">
      <div className="min-w-[32px]">
        {valid ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <XCircle className="w-4 h-4 text-red-400" />
        )}
      </div>
      <span
        className={`text-sm ${
          valid
            ? "text-green-600"
            : "text-red-500 line-through opacity-70"
        }`}
      >
        {text}
      </span>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <p className="text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (error && !userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
          <div className="text-center">
            <Link to="/client/forgot-password">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md">
                Request New Reset Link
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Reset Your Password
          </h1>
          {userInfo && (
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <User className="w-4 h-4" />
              <p className="text-sm">
                Hello <strong className="text-blue-600">{userInfo.name}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-fade-in">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg animate-fade-in">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          </div>
        )}

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Password Validation List */}
          {formData.password && (
            <div className="bg-gray-50 rounded-lg p-3 space-y-1">
              <ValidationItem valid={passwordValidation.hasMinLength} text="Minimum 8 characters" />
              <ValidationItem valid={passwordValidation.hasUpperCase} text="Uppercase letter" />
              <ValidationItem valid={passwordValidation.hasLowerCase} text="Lowercase letter" />
              <ValidationItem valid={passwordValidation.hasNumber} text="Number" />
              <ValidationItem valid={passwordValidation.hasSpecialChar} text="Special character" />
            </div>
          )}

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Resetting...</span>
              </>
            ) : (
              <>
                <Key className="w-5 h-5" />
                <span>Reset Password</span>
              </>
            )}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="text-center mt-6">
          <Link to="/login">
            <button className="text-gray-600 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;