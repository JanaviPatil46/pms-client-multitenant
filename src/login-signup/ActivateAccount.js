
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
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
// } from "@mui/material";
// import {
//   Visibility,
//   VisibilityOff,
//   CheckCircle,
//   Cancel,
// } from "@mui/icons-material";
// import { toast } from "material-react-toastify";

// // ✅ USE YOUR API
// import { contactsAPI } from "../services/api";

// const UpdatePassword = () => {
//   const { token } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [verifying, setVerifying] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [contactInfo, setContactInfo] = useState(null);

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

//   // ================= VERIFY TOKEN =================
//   useEffect(() => {
//     verifyToken();
//   }, [token]);

//   const verifyToken = async () => {
//     try {
//       const { data } = await contactsAPI.verifyActivationToken(token);
//       setContactInfo(data.contact);
//       setError("");
//     } catch (err) {
//       console.error(err);
//       setError("Invalid or expired activation link. Please request a new one.");
//     } finally {
//       setVerifying(false);
//       setLoading(false);
//     }
//   };

//   // ================= PASSWORD VALIDATION =================
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

//   // ================= INPUT HANDLER =================
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleTogglePasswordVisibility = () =>
//     setShowPassword((prev) => !prev);

//   const handleToggleConfirmPasswordVisibility = () =>
//     setShowConfirmPassword((prev) => !prev);

//   // ================= SUBMIT =================
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { password, confirmPassword } = formData;

//     if (!password || password.length < 6) {
//       return setError("Password must be at least 6 characters");
//     }

//     if (!isPasswordValid()) {
//       return setError("Password does not meet requirements");
//     }

//     if (password !== confirmPassword) {
//       return setError("Passwords do not match");
//     }

//     try {
//       setSubmitting(true);
//       setError("");

//       await contactsAPI.activateAndSetPassword(token, { password });

//       toast.success("Account activated successfully 🎉");
//       setSuccess("Password set successfully. Redirecting...");

//       setTimeout(() => {
//         navigate("/login");
//       }, 2000);
//     } catch (err) {
//       console.error(err);
//       setError(
//         err.response?.data?.error ||
//           "Failed to activate account. Try again."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ================= UI STATES =================
//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" minHeight="100vh" alignItems="center">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (verifying) {
//     return (
//       <Box display="flex" justifyContent="center" minHeight="100vh" alignItems="center">
//         <Typography>Verifying activation link...</Typography>
//       </Box>
//     );
//   }

//   if (error && !contactInfo) {
//     return (
//       <Box display="flex" justifyContent="center" minHeight="100vh" alignItems="center">
//         <Alert severity="error">{error}</Alert>
//       </Box>
//     );
//   }

//   return (
//     <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5" p={2}>
//       <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: "100%" }}>
//         <Typography variant="h4" align="center" gutterBottom>
//           Set Your Password
//         </Typography>

//         {contactInfo && (
//           <Typography align="center" color="text.secondary">
//             Hello <strong>{contactInfo.name}</strong>
//           </Typography>
//         )}

//         {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
//         {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

//         <form onSubmit={handleSubmit}>
//           {/* PASSWORD */}
//           <TextField
//             fullWidth
//             margin="normal"
//             label="New Password"
//             name="password"
//             type={showPassword ? "text" : "password"}
//             value={formData.password}
//             onChange={handleChange}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton onClick={handleTogglePasswordVisibility}>
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />

//           {/* REQUIREMENTS */}
//           {formData.password && (
//             <List dense>
//               <ValidationItem valid={passwordValidation.hasMinLength} text="8+ characters" />
//               <ValidationItem valid={passwordValidation.hasUpperCase} text="Uppercase letter" />
//               <ValidationItem valid={passwordValidation.hasLowerCase} text="Lowercase letter" />
//               <ValidationItem valid={passwordValidation.hasNumber} text="Number" />
//               <ValidationItem valid={passwordValidation.hasSpecialChar} text="Special character" />
//             </List>
//           )}

//           {/* CONFIRM PASSWORD */}
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Confirm Password"
//             name="confirmPassword"
//             type={showConfirmPassword ? "text" : "password"}
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton onClick={handleToggleConfirmPasswordVisibility}>
//                     {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />

//           <Button
//             fullWidth
//             variant="contained"
//             sx={{ mt: 3 }}
//             type="submit"
//             disabled={
//               submitting ||
//               !isPasswordValid() ||
//               formData.password !== formData.confirmPassword
//             }
//           >
//             {submitting ? <CircularProgress size={24} /> : "Set Password"}
//           </Button>
//         </form>
//       </Paper>
//     </Box>
//   );
// };

// // Validation Component
// const ValidationItem = ({ valid, text }) => (
//   <ListItem>
//     <ListItemIcon>
//       {valid ? <CheckCircle color="success" /> : <Cancel color="error" />}
//     </ListItemIcon>
//     <ListItemText primary={text} />
//   </ListItem>
// );

// export default UpdatePassword;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle,
  Shield,
  Key,
  User,
  AlertCircle
} from "lucide-react";

import { contactsAPI } from "../services/api";
import { useToast } from "../hooks/useToast";

const UpdatePassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
const toast=useToast();
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [contactInfo, setContactInfo] = useState(null);

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

  // ================= VERIFY TOKEN =================
  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const { data } = await contactsAPI.verifyActivationToken(token);
      setContactInfo(data.contact);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Invalid or expired activation link. Please request a new one.");
    } finally {
      setVerifying(false);
      setLoading(false);
    }
  };

  // ================= PASSWORD VALIDATION =================
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

  // ================= INPUT HANDLER =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTogglePasswordVisibility = () =>
    setShowPassword((prev) => !prev);

  const handleToggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { password, confirmPassword } = formData;

    if (!password || password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (!isPasswordValid()) {
      return setError("Password does not meet requirements");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setSubmitting(true);
      setError("");

      await contactsAPI.activateAndSetPassword(token, { password });

      toast.success("Account activated successfully 🎉");
      setSuccess("Password set successfully. Redirecting...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "Failed to activate account. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Validation Item Component
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

  // ================= UI STATES =================
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
          <p className="text-gray-600">Verifying activation link...</p>
        </div>
      </div>
    );
  }

  if (error && !contactInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
          <div className="flex items-center space-x-2 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
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
            Set Your Password
          </h1>
          {contactInfo && (
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <User className="w-4 h-4" />
              <p className="text-sm">
                Hello <strong className="text-blue-600">{contactInfo.name}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-fade-in">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg animate-fade-in">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          </div>
        )}

        {/* Update Password Form */}
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
                onClick={handleTogglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          {formData.password && (
            <div className="bg-gray-50 rounded-lg p-3 space-y-1">
              <ValidationItem valid={passwordValidation.hasMinLength} text="8+ characters" />
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
                onClick={handleToggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              submitting ||
              !isPasswordValid() ||
              formData.password !== formData.confirmPassword
            }
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Setting Password...</span>
              </>
            ) : (
              <>
                <Key className="w-5 h-5" />
                <span>Set Password</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;