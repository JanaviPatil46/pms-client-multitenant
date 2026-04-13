

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