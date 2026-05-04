

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Button,
//   CssBaseline,
//   Divider,
//   FormLabel,
//   FormControl,
//   Link,
//   TextField,
//   Typography,
//   Stack,
//   Card,
//   InputAdornment,
//   IconButton,
//   Fade,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   CircularProgress,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { toast } from "material-react-toastify";
// import { useContactAuth } from "../context/Context";

// const StyledCard = styled(Card)(({ theme }) => ({
//   display: "flex",
//   flexDirection: "column",
//   alignSelf: "center",
//   width: "100%",
//   padding: theme.spacing(4),
//   gap: theme.spacing(2),
//   margin: "auto",
//   boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
//   [theme.breakpoints.up("sm")]: {
//     maxWidth: "450px",
//   },
// }));

// const SignInContainer = styled(Stack)(({ theme }) => ({
//   height: "100dvh",
//   justifyContent: "center",
//   alignItems: "center",
//   padding: theme.spacing(2),
//   background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
// }));

// const LoginPage = () => {
//   const navigate = useNavigate();

//   const {
//     login,
//     isAuthenticated,
//     loading,
//     setSelectedAccount,
//     accountId,
//     role,
//   } = useContactAuth();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const [error, setError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Dialog
//   const [accountDialogOpen, setAccountDialogOpen] = useState(false);
//   const [availableAccounts, setAvailableAccounts] = useState([]);
//   const [selectedAccountId, setSelectedAccountId] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);

//   const [emailError, setEmailError] = useState(false);
//   const [emailErrorMsg, setEmailErrorMsg] = useState("");
//   const [passwordError, setPasswordError] = useState(false);
//   const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

//   // ✅ FIX: prevent redirect before account selection
//   useEffect(() => {
//     if (isAuthenticated && accountId) {
//       navigate("/home", { replace: true });
//     }
//   }, [isAuthenticated, accountId, navigate]);

//   const validateInputs = () => {
//     let isValid = true;

//     if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
//       setEmailError(true);
//       setEmailErrorMsg("Please enter a valid email address");
//       isValid = false;
//     } else {
//       setEmailError(false);
//       setEmailErrorMsg("");
//     }

//     if (!password || password.length < 6) {
//       setPasswordError(true);
//       setPasswordErrorMsg("Password must be at least 6 characters");
//       isValid = false;
//     } else {
//       setPasswordError(false);
//       setPasswordErrorMsg("");
//     }

//     return isValid;
//   };

//   // ================= ACCOUNT SELECT =================
//   const handleAccountSelect = () => {
//     if (!selectedAccountId) {
//       toast.error("Please select an account");
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       setSelectedAccount(selectedAccountId);

//       toast.success("Account selected successfully!");
//       setAccountDialogOpen(false);

//       navigate("/home", { replace: true });
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to select account");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // ================= LOGIN =================
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (isSubmitting || loading) return;

//     setError("");

//     if (!validateInputs()) return;

//     setIsSubmitting(true);

//     try {
//       const result = await login(email, password);

//       if (!result.success) {
//         setError(result.error);
//         toast.error(result.error);
//         setIsSubmitting(false);
//         return;
//       }

//       const accounts = result.accounts || [];

//       // if (accounts.length === 0) {
//       //   setError("No accounts available for this user");
//       //   toast.error("No accounts available");
//       //   setIsSubmitting(false);
//       //   return;
//       // }

//       // ================= SINGLE ACCOUNT =================
//       if (accounts.length === 1) {
//         setSelectedAccount(accounts[0]._id);

//         // toast.success("Login successful!");

//         setTimeout(() => {
//           navigate("/home", { replace: true });
//         }, 100);

//         return;
//       }

//       // ================= MULTIPLE ACCOUNTS =================
//       setAvailableAccounts(accounts);
//       setAccountDialogOpen(true);
//       setIsSubmitting(false);
//     } catch (error) {
//       console.error(error);
//       setError("Unexpected error occurred");
//       toast.error("Login failed");
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Box>
//       <CssBaseline />

//       <SignInContainer>
//         <StyledCard>
//           <Typography variant="h4" textAlign="center" fontWeight="bold">
//             Welcome Back
//           </Typography>

//           <Typography variant="body2" textAlign="center" color="text.secondary">
//             Sign in to continue
//           </Typography>

//           {error && (
//             <Alert severity="error" onClose={() => setError("")}>
//               {error}
//             </Alert>
//           )}

//           <Box component="form" onSubmit={handleSubmit}>
//             {/* EMAIL */}
//             <FormControl fullWidth>
//               <FormLabel>Email</FormLabel>
//               <TextField
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 error={emailError}
//                 helperText={emailErrorMsg}
//                 disabled={isSubmitting}
//               />
//             </FormControl>

//             {/* PASSWORD */}
//             <FormControl fullWidth sx={{ mt: 2 }}>
//               <FormLabel>Password</FormLabel>
//               <TextField
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 error={passwordError}
//                 helperText={passwordErrorMsg}
//                 disabled={isSubmitting}
//                 slotProps={{
//                   input: {
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton
//                           onClick={() => setShowPassword(!showPassword)}
//                         >
//                           {showPassword ? (
//                             <VisibilityOff />
//                           ) : (
//                             <Visibility />
//                           )}
//                         </IconButton>
//                       </InputAdornment>
//                     ),
//                   },
//                 }}
//               />
//             </FormControl>

//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               disabled={isSubmitting}
//               sx={{ mt: 3 }}
//             >
//               {isSubmitting ? "Signing in..." : "Sign In"}
//             </Button>
//           </Box>
//         </StyledCard>

//         {/* ================= ACCOUNT DIALOG ================= */}
//         <Dialog open={accountDialogOpen} fullWidth maxWidth="sm">
//           <DialogTitle>Select Account</DialogTitle>

//           <DialogContent>
//             <RadioGroup
//               value={selectedAccountId}
//               onChange={(e) => setSelectedAccountId(e.target.value)}
//             >
//               {availableAccounts.map((acc) => (
//                 <FormControlLabel
//                   key={acc._id}
//                   value={acc._id}
//                   control={<Radio />}
//                   label={
//                     <Box>
//                       <Typography fontWeight={500}>
//                         {acc.accountName}
//                       </Typography>
//                       <Typography variant="caption">
//                         {acc.clientType} {acc.companyName}
//                       </Typography>
//                     </Box>
//                   }
//                 />
//               ))}
//             </RadioGroup>
//           </DialogContent>

//           <DialogActions>
//             <Button onClick={() => setAccountDialogOpen(false)}>
//               Cancel
//             </Button>

//             <Button
//               variant="contained"
//               disabled={!selectedAccountId || isProcessing}
//               onClick={handleAccountSelect}
//             >
//               {isProcessing ? (
//                 <CircularProgress size={20} />
//               ) : (
//                 "Continue"
//               )}
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </SignInContainer>
//     </Box>
//   );
// };

// export default LoginPage;

import React, { useState, useEffect } from "react";
import { useNavigate ,Link} from "react-router-dom";
import { useContactAuth } from "../context/Context";
import { useToast } from "../hooks/useToast";
import { 
  Eye, 
  EyeOff, 
  X, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Building2,
  UserCircle,
  Mail,
  Lock,
  ArrowRight,KeyRound 
} from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const toast = useToast(); // Use the custom toast hook

  const {
    login,
    isAuthenticated,
    loading,
    setSelectedAccount,
    accountId,
  } = useContactAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dialog
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [availableAccounts, setAvailableAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [emailError, setEmailError] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

  // ✅ FIX: prevent redirect before account selection
  useEffect(() => {
    if (isAuthenticated && accountId) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, accountId, navigate]);

  const validateInputs = () => {
    let isValid = true;

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMsg("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMsg("");
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMsg("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMsg("");
    }

    return isValid;
  };

  // ================= ACCOUNT SELECT =================
  const handleAccountSelect = () => {
    if (!selectedAccountId) {
      toast.error("Please select an account");
      return;
    }

    setIsProcessing(true);

    try {
      setSelectedAccount(selectedAccountId);

      toast.success("Account selected successfully!");
      setAccountDialogOpen(false);

      navigate("/home", { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Failed to select account");
    } finally {
      setIsProcessing(false);
    }
  };

  // ================= LOGIN =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting || loading) return;

    setError("");

    if (!validateInputs()) return;

    setIsSubmitting(true);

    try {
      const result = await login(email, password);

      if (!result.success) {
        setError(result.error);
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }

      const accounts = result.accounts || [];

      // ================= SINGLE ACCOUNT =================
      if (accounts.length === 1) {
        setSelectedAccount(accounts[0]._id);
        
        toast.success("Login successful!");
        
        setTimeout(() => {
          navigate("/home", { replace: true });
        }, 100);

        return;
      }

      // ================= MULTIPLE ACCOUNTS =================
      setAvailableAccounts(accounts);
      setAccountDialogOpen(true);
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      setError("Unexpected error occurred");
      toast.error("Login failed");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
      {/* Main Login Card */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all duration-300">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm">
            Sign in to access your account
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
              <button
                onClick={() => setError("")}
                className="text-red-500 hover:text-red-700 transition-colors"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  emailError
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                placeholder="you@example.com"
              />
            </div>
            {emailError && (
              <p className="text-xs text-red-500 flex items-center space-x-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                <span>{emailErrorMsg}</span>
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  passwordError
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordError && (
              <p className="text-xs text-red-500 flex items-center space-x-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                <span>{passwordErrorMsg}</span>
              </p>
            )}
          </div>

          {/* Forgot Password Link */}
          {/* <div className="text-right">
            <a
              href="/client/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Forgot password?
            </a>
          </div> */}
          <div className="text-right mt-2">
  <Link to="/forgot-password" className="inline-block">
    <button
      type="button"
      className="text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-end space-x-2"
    >
      <KeyRound className="w-4 h-4" />
      <span>Forgot password?</span>
    </button>
  </Link>
</div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        {/* <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">New to our platform?</span>
          </div>
        </div> */}

        {/* Sign Up Link */}
        {/* <div className="text-center">
          <button
            type="button"
            className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            Create an Account
          </button>
        </div> */}

        {/* Footer Text */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Secure tax preparation platform
        </p>
      </div>

      {/* Account Selection Modal */}
      {accountDialogOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setAccountDialogOpen(false)}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto transform transition-all">
              {/* Header */}
              <div className="border-b border-gray-200 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Select Account
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      You have multiple accounts. Please select one to continue.
                    </p>
                  </div>
                  <button
                    onClick={() => setAccountDialogOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-5 max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  {availableAccounts.map((acc) => (
                    <label
                      key={acc._id}
                      className={`flex items-start space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedAccountId === acc._id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={selectedAccountId === acc._id}
                        onChange={() => setSelectedAccountId(acc._id)}
                        className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Building2 className="w-4 h-4 text-gray-500" />
                          <p className="font-semibold text-gray-900">
                            {acc.accountName}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <UserCircle className="w-3 h-3 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            {acc.clientType} {acc.companyName}
                          </p>
                        </div>
                      </div>
                      {selectedAccountId === acc._id && (
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
                <button
                  onClick={() => setAccountDialogOpen(false)}
                  className="px-5 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  disabled={!selectedAccountId || isProcessing}
                  onClick={handleAccountSelect}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md flex items-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;