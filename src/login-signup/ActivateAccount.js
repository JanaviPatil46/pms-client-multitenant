
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { toast } from "material-react-toastify";

// ✅ USE YOUR API
import { contactsAPI } from "../services/api";

const UpdatePassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

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
      hasSpecialChar:
        /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
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

  // ================= UI STATES =================
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" minHeight="100vh" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (verifying) {
    return (
      <Box display="flex" justifyContent="center" minHeight="100vh" alignItems="center">
        <Typography>Verifying activation link...</Typography>
      </Box>
    );
  }

  if (error && !contactInfo) {
    return (
      <Box display="flex" justifyContent="center" minHeight="100vh" alignItems="center">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5" p={2}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: "100%" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Set Your Password
        </Typography>

        {contactInfo && (
          <Typography align="center" color="text.secondary">
            Hello <strong>{contactInfo.name}</strong>
          </Typography>
        )}

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          {/* PASSWORD */}
          <TextField
            fullWidth
            margin="normal"
            label="New Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePasswordVisibility}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* REQUIREMENTS */}
          {formData.password && (
            <List dense>
              <ValidationItem valid={passwordValidation.hasMinLength} text="8+ characters" />
              <ValidationItem valid={passwordValidation.hasUpperCase} text="Uppercase letter" />
              <ValidationItem valid={passwordValidation.hasLowerCase} text="Lowercase letter" />
              <ValidationItem valid={passwordValidation.hasNumber} text="Number" />
              <ValidationItem valid={passwordValidation.hasSpecialChar} text="Special character" />
            </List>
          )}

          {/* CONFIRM PASSWORD */}
          <TextField
            fullWidth
            margin="normal"
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleToggleConfirmPasswordVisibility}>
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            type="submit"
            disabled={
              submitting ||
              !isPasswordValid() ||
              formData.password !== formData.confirmPassword
            }
          >
            {submitting ? <CircularProgress size={24} /> : "Set Password"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

// Validation Component
const ValidationItem = ({ valid, text }) => (
  <ListItem>
    <ListItemIcon>
      {valid ? <CheckCircle color="success" /> : <Cancel color="error" />}
    </ListItemIcon>
    <ListItemText primary={text} />
  </ListItem>
);

export default UpdatePassword;