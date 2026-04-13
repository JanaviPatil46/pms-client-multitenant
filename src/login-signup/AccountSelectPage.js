import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CssBaseline,
  FormLabel,
  FormControl,
  Typography,
  Stack,
  Card,
  Select,
  MenuItem,
  Alert,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { toast } from "material-react-toastify";
import AppTheme from "../shared-theme/AppTheme";

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
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

const AccountSelectPage = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [error, setError] = useState("");

  // useEffect(() => {
  //   // Get accounts from sessionStorage
  //   const storedAccounts = sessionStorage.getItem("multipleAccounts");
  //   if (storedAccounts) {
  //     const parsedAccounts = JSON.parse(storedAccounts);
  //     setAccounts(parsedAccounts);
  //   } else {
  //     // If no accounts found, redirect to login
  //     toast.error("No accounts found. Please login again.");
  //     navigate("/login", { replace: true });
  //   }
  // }, [navigate]);

  const handleAccountSelect = () => {
    if (!selectedAccount) {
      setError("Please select an account");
      toast.error("Please select an account");
      return;
    }
console.log("selcted account",selectedAccount)
    sessionStorage.setItem("accountId", selectedAccount);
    // sessionStorage.removeItem("multipleAccounts");
    toast.success("Account selected successfully!");
    navigate("/home", { replace: true });
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <SignInContainer>
        <StyledCard>
          <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold", mb: 1 }}>
            Select Account
          </Typography>
          
          <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary", mb: 2 }}>
            You have multiple accounts. Please select one to continue.
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}
          
          <FormControl fullWidth>
            <FormLabel>Select Account</FormLabel>
            <Select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              displayEmpty
              sx={{ mt: 1 }}
            >
              <MenuItem value="" disabled>
                -- Select an account --
              </MenuItem>
              {accounts.map((acc) => (
                <MenuItem key={acc._id} value={acc._id}>
                  {acc.accountName} - {acc.clientType}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            variant="contained"
            onClick={handleAccountSelect}
            fullWidth
            sx={{
              mt: 2,
              py: 1.2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a67d8 0%, #6b46a0 100%)",
              },
            }}
          >
            Continue to Dashboard
          </Button>
        </StyledCard>
      </SignInContainer>
    </AppTheme>
  );
};

export default AccountSelectPage;