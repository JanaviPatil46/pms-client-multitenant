// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { contactsAPI } from "../services/api"; // ✅ updated
// import {
//   Box,
//   Paper,
//   TextField,
//   Button,
//   Typography,
//   Alert,
//   CircularProgress,
//   Container,
// } from "@mui/material";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     setLoading(true);

//     if (!email) {
//       setError("Please enter your email address");
//       setLoading(false);
//       return;
//     }

//     try {
//       // ✅ UPDATED: using contactsAPI
//       await contactsAPI.ContCtForgotPassword({ email });

//       setSuccess(
//         "Password reset instructions have been sent to your email."
//       );
//       setEmail("");
//     } catch (err) {
//       setError(
//         err.response?.data?.error ||
//           err.response?.data?.message ||
//           "Failed to send reset instructions. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Box
//         sx={{
//           mt: 8,
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
//           <Typography variant="h4" align="center" gutterBottom>
//             Forgot Password
//           </Typography>

//           <Typography
//             variant="body1"
//             align="center"
//             sx={{ mb: 3, color: "text.secondary" }}
//           >
//             Enter your email address and we'll send you instructions to reset your password.
//           </Typography>

//           {error && (
//             <Alert severity="error" sx={{ mb: 2 }}>
//               {error}
//             </Alert>
//           )}

//           {success && (
//             <Alert severity="success" sx={{ mb: 2 }}>
//               {success}
//             </Alert>
//           )}

//           <form onSubmit={handleSubmit}>
//             <TextField
//               fullWidth
//               label="Email Address"
//               name="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               margin="normal"
//               required
//               disabled={loading}
//               autoComplete="email"
//             />

//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//               disabled={loading}
//             >
//               {loading ? (
//                 <CircularProgress size={24} />
//               ) : (
//                 "Send Reset Instructions"
//               )}
//             </Button>

//             <Box textAlign="center">
//               <Link to="/client/login" style={{ textDecoration: "none" }}>
//                 <Button>Back to Login</Button>
//               </Link>
//             </Box>
//           </form>
//         </Paper>
//       </Box>
//     </Container>
//   );
// };

// export default ForgotPassword;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { contactsAPI } from "../services/api";
import { 
  Mail, 
  ArrowLeft, 
  Send,
  AlertCircle,
  CheckCircle
} from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      await contactsAPI.ContCtForgotPassword({ email });

      setSuccess(
        "Password reset instructions have been sent to your email."
      );
      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to send reset instructions. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Forgot Password
          </h1>
          <p className="text-sm text-gray-500">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
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

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Send Reset Instructions</span>
              </>
            )}
          </button>

          {/* Back to Login Link */}
          <div className="text-center mt-6">
            <Link to="/login" className="inline-block">
              <button
                type="button"
                className="text-gray-600 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;