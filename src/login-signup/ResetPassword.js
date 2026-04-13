import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { contactsAPI } from "../services/api"; // ✅ updated
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";

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
      hasSpecialChar:
        /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    });
  };

  const isPasswordValid = () => {
    return Object.values(passwordValidation).every(Boolean);
  };

  // ✅ UPDATED: verify token using contactsAPI
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
      // ✅ UPDATED: use contactsAPI
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
    <ListItem sx={{ py: 0.5 }}>
      <ListItemIcon sx={{ minWidth: 32 }}>
        {valid ? (
          <CheckCircle color="success" fontSize="small" />
        ) : (
          <Cancel color="error" fontSize="small" />
        )}
      </ListItemIcon>
      <ListItemText
        primary={text}
        sx={{
          color: valid ? "success.main" : "error.main",
          textDecoration: valid ? "none" : "line-through",
          opacity: valid ? 1 : 0.7,
        }}
      />
    </ListItem>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (verifying) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Verifying reset link...</Typography>
      </Box>
    );
  }

  if (error && !userInfo) {
    return (
      <Container maxWidth="sm">
        <Box mt={8}>
          <Paper sx={{ p: 4 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Box textAlign="center">
              <Link to="/client/forgot-password">
                <Button variant="contained">Request New Reset Link</Button>
              </Link>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Reset Your Password
          </Typography>

          {userInfo && (
            <Typography align="center" sx={{ mb: 2 }}>
              Hello <strong>{userInfo.name}</strong>
            </Typography>
          )}

          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="New Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Validation */}
            {formData.password && (
              <List dense>
                <ValidationItem valid={passwordValidation.hasMinLength} text="Min 8 characters" />
                <ValidationItem valid={passwordValidation.hasUpperCase} text="Uppercase" />
                <ValidationItem valid={passwordValidation.hasLowerCase} text="Lowercase" />
                <ValidationItem valid={passwordValidation.hasNumber} text="Number" />
                <ValidationItem valid={passwordValidation.hasSpecialChar} text="Special character" />
              </List>
            )}

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 2 }}
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={20} /> : "Reset Password"}
            </Button>
          </form>

          <Box textAlign="center" mt={2}>
            <Link to="/client/login">
              <Button>Back to Login</Button>
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPassword;