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
// // import AppTheme from "../shared-theme/AppTheme";
// // import ColorModeSelect from "../shared-theme/ColorModeSelect";
// import { useContactAuth } from "../context/authContext";

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
// //   const { login, isAuthenticated, loading } = useContactAuth();
//     const { login, isAuthenticated, loading, setSelectedAccount } = useContactAuth(); // Add setSelectedAccount
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   // Dialog states
//   const [accountDialogOpen, setAccountDialogOpen] = useState(false);
//   const [availableAccounts, setAvailableAccounts] = useState([]);
//   const [selectedAccountId, setSelectedAccountId] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);

//   // Form validation states
//   const [emailError, setEmailError] = useState(false);
//   const [emailErrorMsg, setEmailErrorMsg] = useState("");
//   const [passwordError, setPasswordError] = useState(false);
//   const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

//   // Check if already authenticated

//   // Redirect if already logged in
//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/home");
//     }
//   }, [isAuthenticated, navigate]);
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

// const handleAccountSelect = async () => {
//   if (!selectedAccountId) {
//     toast.error("Please select an account");
//     return;
//   }

//   setIsProcessing(true);
  
//   try {
//     console.log("Selected account ID:", selectedAccountId);
    
//     // Use the context method to set account
//     await setSelectedAccount(selectedAccountId); // Make sure this is async if needed
    
//     // Small delay to ensure state is updated in sessionStorage
//     setTimeout(() => {
//       toast.success("Account selected successfully!");
//       setAccountDialogOpen(false);
//       navigate("/home", { replace: true });
//     }, 200); // Increased delay to 200ms
//   } catch (error) {
//     console.error("Error selecting account:", error);
//     toast.error("Failed to select account");
//     setIsProcessing(false);
//   }
// };

// //   const handleAccountSelect = async () => {
// //     if (!selectedAccountId) {
// //       toast.error("Please select an account");
// //       return;
// //     }

// //     setIsProcessing(true);
    
// //     try {
// //       console.log("Selected account ID:", selectedAccountId);
      
// //       // Use the context method to set account
// //       setSelectedAccount(selectedAccountId);
      
// //       toast.success("Account selected successfully!");
// //       setAccountDialogOpen(false);
      
// //       // Small delay to ensure state is updated
// //     //   setTimeout(() => {
// //         navigate("/home", { replace: true });
// //     //   }, 100);
// //     } catch (error) {
// //       console.error("Error selecting account:", error);
// //       toast.error("Failed to select account");
// //       setIsProcessing(false);
// //     }
// //   };

//   // Update handleSubmit for single account case
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (isSubmitting || loading) {
//       console.log("Submission already in progress");
//       return;
//     }
    
//     setError("");
    
//     if (!validateInputs()) {
//       return;
//     }
    
//     setIsSubmitting(true);
    
//     try {
//       console.log("Form submitted for:", email);
//       const result = await login(email, password);
//       console.log("Login result:", result);
      
//       if (!result.success) {
//         setError(result.error);
//         toast.error(result.error);
//         setIsSubmitting(false);
//         return;
//       }
      
//       const accounts = result.accounts || [];
//       console.log("Accounts received:", accounts.length);
      
//       if (accounts.length === 0) {
//         setError("No accounts available for this user");
//         toast.error("No accounts available");
//         setIsSubmitting(false);
//         return;
//       }
      
//       if (accounts.length === 1) {
//         console.log("Single account, storing accountId:", accounts[0]._id);
        
//         // Use the context method to set account
//         setSelectedAccount(accounts[0]._id);
        
//         toast.success("Login successful! Redirecting...");
        
//         // Small delay to ensure state is updated
//         // setTimeout(() => {
//           navigate("/home", { replace: true });
//         // }, 100);
//       } else {
//         // Multiple accounts - show dialog
//         console.log("Multiple accounts, showing selection dialog");
//         setAvailableAccounts(accounts);
//         setAccountDialogOpen(true);
//         setIsSubmitting(false); // Don't set isSubmitting to false for multiple accounts yet
//       }
//     } catch (error) {
//       console.error("Submission error:", error);
//       setError("An unexpected error occurred");
//       toast.error("Login failed. Please try again.");
//       setIsSubmitting(false);
//     }
//   };
//   return (
//     <Box>
//       <CssBaseline enableColorScheme />
//       <SignInContainer>
//         {/* <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} /> */}
        
//         <StyledCard variant="outlined">
//           <Typography
//             component="h1"
//             variant="h4"
//             sx={{
//               fontSize: "clamp(2rem, 10vw, 2.15rem)",
//               textAlign: "center",
//               fontWeight: "bold",
//               // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//               backgroundClip: "text",
//               WebkitBackgroundClip: "text",
//               color: "transparent",
//               mb: 2,
//             }}
//           >
//             Welcome Back
//           </Typography>
          
//           <Typography variant="body2" sx={{ textAlign: "center", mb: 2, color: "text.secondary" }}>
//             Sign in to your account to continue
//           </Typography>
          
//           {error && (
//             <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
//               {error}
//             </Alert>
//           )}
          
//           <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//             <FormControl>
//               <FormLabel htmlFor="email" sx={{ fontWeight: 500 }}>
//                 Email Address
//               </FormLabel>
//               <TextField
//                 id="email"
//                 fullWidth
//                 required
//                 placeholder="your@email.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 error={emailError}
//                 helperText={emailErrorMsg}
//                 disabled={isSubmitting || loading}
//                 autoComplete="email"
//                 variant="outlined"
//                 sx={{ mt: 0.5 }}
//               />
//             </FormControl>
            
//             <FormControl>
//               <FormLabel htmlFor="password" sx={{ fontWeight: 500 }}>
//                 Password
//               </FormLabel>
//               <TextField
//                 id="password"
//                 fullWidth
//                 required
//                 type={showPassword ? "text" : "password"}
//                 placeholder="••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 error={passwordError}
//                 helperText={passwordErrorMsg}
//                 disabled={isSubmitting || loading}
//                 autoComplete="current-password"
//                 variant="outlined"
//                 sx={{ mt: 0.5 }}
//                 // InputProps={{
//                 //   endAdornment: (
//                 //     <InputAdornment position="end">
//                 //       <Fade in={password.length > 0}>
//                 //         <IconButton
//                 //           onClick={() => setShowPassword(!showPassword)}
//                 //           edge="end"
//                 //           disabled={isSubmitting || loading}
//                 //         >
//                 //           {showPassword ? <VisibilityOff /> : <Visibility />}
//                 //         </IconButton>
//                 //       </Fade>
//                 //     </InputAdornment>
//                 //   ),
//                 // }}
//                 slotProps={{
//   input: {
//     endAdornment: (
//       <InputAdornment position="end">
//         <Fade in={password.length > 0}>
//           <IconButton
//             onClick={() => setShowPassword(!showPassword)}
//             edge="end"
//             disabled={isSubmitting || loading}
//           >
//             {showPassword ? <VisibilityOff /> : <Visibility />}
//           </IconButton>
//         </Fade>
//       </InputAdornment>
//     ),
//   },
// }}
//               />
//             </FormControl>
            
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               disabled={isSubmitting || loading}
//               sx={{
//                 mt: 2,
//                 py: 1.2,
//                 background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                 "&:hover": {
//                   background: "linear-gradient(135deg, #5a67d8 0%, #6b46a0 100%)",
//                 },
//               }}
//             >
//               {isSubmitting || loading ? "Signing in..." : "Sign In"}
//             </Button>
            
//             <Box sx={{ textAlign: "center", mt: 1 }}>
//               <Link
//                 href="/client/forgot-password"
//                 variant="body2"
//                 sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
//               >
//                 Forgot your password?
//               </Link>
//             </Box>
//           </Box>
          
//           <Divider sx={{ my: 2 }}>
//             <Typography variant="body2" sx={{ color: "text.secondary", px: 1 }}>
//               or
//             </Typography>
//           </Divider>
          
//           <Box sx={{ textAlign: "center" }}>
//             <Typography variant="body2" sx={{ color: "text.secondary" }}>
//               Don't have an account?{" "}
//               <Link
//                 href="/signup"
//                 variant="body2"
//                 sx={{ textDecoration: "none", fontWeight: 500, "&:hover": { textDecoration: "underline" } }}
//               >
//                 Sign Up
//               </Link>
//             </Typography>
//           </Box>
//         </StyledCard>

//         {/* Account Selection Dialog */}
//         <Dialog 
//           open={accountDialogOpen} 
//           onClose={() => !isProcessing && setAccountDialogOpen(false)}
//           maxWidth="sm"
//           fullWidth
//           PaperProps={{
//             sx: {
//               borderRadius: 2,
//               p: 1,
//             },
//           }}
//         >
//           <DialogTitle sx={{ 
//             borderBottom: "1px solid",
//             borderColor: "divider",
//             pb: 2,
//             background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//             backgroundClip: "text",
//             WebkitBackgroundClip: "text",
//             color: "transparent",
//             fontWeight: "bold",
//           }}>
//             Select an Account
//           </DialogTitle>
          
//           <DialogContent sx={{ mt: 2 }}>
//             <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
//               You have access to multiple accounts. Please select one to continue.
//             </Typography>
            
//             <RadioGroup
//               value={selectedAccountId}
//               onChange={(e) => setSelectedAccountId(e.target.value)}
//             >
//               {availableAccounts.map((account) => (
//                 <FormControlLabel
//                   key={account._id}
//                   value={account._id}
//                   control={<Radio />}
//                   label={
//                     <Box>
//                       <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
//                         {account.accountName}
//                       </Typography>
//                       <Typography variant="caption" sx={{ color: "text.secondary" }}>
//                         {account.clientType}
//                         {account.companyName && ` • ${account.companyName}`}
//                       </Typography>
//                     </Box>
//                   }
//                   sx={{
//                     mb: 1,
//                     p: 1,
//                     borderRadius: 1,
//                     border: "1px solid",
//                     borderColor: selectedAccountId === account._id ? "primary.main" : "divider",
//                     bgcolor: selectedAccountId === account._id ? "action.hover" : "transparent",
//                     transition: "all 0.2s",
//                     "&:hover": {
//                       bgcolor: "action.hover",
//                     },
//                   }}
//                 />
//               ))}
//             </RadioGroup>
//           </DialogContent>
          
//           <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
//             <Button 
//               onClick={() => setAccountDialogOpen(false)} 
//               disabled={isProcessing}
//               variant="outlined"
//               fullWidth
//             >
//               Cancel
//             </Button>
//             <Button 
//               onClick={handleAccountSelect} 
//               variant="contained"
//               disabled={!selectedAccountId || isProcessing}
//               fullWidth
//               sx={{
//                 background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                 "&:hover": {
//                   background: "linear-gradient(135deg, #5a67d8 0%, #6b46a0 100%)",
//                 },
//               }}
//             >
//               {isProcessing ? <CircularProgress size={24} /> : "Continue"}
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </SignInContainer>
//     </Box>
//   );
// };

// export default LoginPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CssBaseline,
  Divider,
  FormLabel,
  FormControl,
  Link,
  TextField,
  Typography,
  Stack,
  Card,
  InputAdornment,
  IconButton,
  Fade,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "material-react-toastify";
import { useContactAuth } from "../context/Context";

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "100dvh",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
}));

const LoginPage = () => {
  const navigate = useNavigate();

  const {
    login,
    isAuthenticated,
    loading,
    setSelectedAccount,
    accountId,
    role,
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

      if (accounts.length === 0) {
        setError("No accounts available for this user");
        toast.error("No accounts available");
        setIsSubmitting(false);
        return;
      }

      // ================= SINGLE ACCOUNT =================
      if (accounts.length === 1) {
        setSelectedAccount(accounts[0]._id);

        // toast.success("Login successful!");

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
    <Box>
      <CssBaseline />

      <SignInContainer>
        <StyledCard>
          <Typography variant="h4" textAlign="center" fontWeight="bold">
            Welcome Back
          </Typography>

          <Typography variant="body2" textAlign="center" color="text.secondary">
            Sign in to continue
          </Typography>

          {error && (
            <Alert severity="error" onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {/* EMAIL */}
            <FormControl fullWidth>
              <FormLabel>Email</FormLabel>
              <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                helperText={emailErrorMsg}
                disabled={isSubmitting}
              />
            </FormControl>

            {/* PASSWORD */}
            <FormControl fullWidth sx={{ mt: 2 }}>
              <FormLabel>Password</FormLabel>
              <TextField
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                helperText={passwordErrorMsg}
                disabled={isSubmitting}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{ mt: 3 }}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </Box>
        </StyledCard>

        {/* ================= ACCOUNT DIALOG ================= */}
        <Dialog open={accountDialogOpen} fullWidth maxWidth="sm">
          <DialogTitle>Select Account</DialogTitle>

          <DialogContent>
            <RadioGroup
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
            >
              {availableAccounts.map((acc) => (
                <FormControlLabel
                  key={acc._id}
                  value={acc._id}
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography fontWeight={500}>
                        {acc.accountName}
                      </Typography>
                      <Typography variant="caption">
                        {acc.clientType} {acc.companyName}
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setAccountDialogOpen(false)}>
              Cancel
            </Button>

            <Button
              variant="contained"
              disabled={!selectedAccountId || isProcessing}
              onClick={handleAccountSelect}
            >
              {isProcessing ? (
                <CircularProgress size={20} />
              ) : (
                "Continue"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </SignInContainer>
    </Box>
  );
};

export default LoginPage;