// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Button,
//   CssBaseline,
//   FormLabel,
//   FormControl,
//   Typography,
//   Stack,
//   Card,
//   Select,
//   MenuItem,
//   Alert,
//   Paper,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import { toast } from "material-react-toastify";
// import AppTheme from "../shared-theme/AppTheme";

// const StyledCard = styled(Card)(({ theme }) => ({
//   display: "flex",
//   flexDirection: "column",
//   alignSelf: "center",
//   width: "100%",
//   padding: theme.spacing(4),
//   gap: theme.spacing(2),
//   margin: "auto",
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

// const AccountSelectPage = () => {
//   const navigate = useNavigate();
//   const [accounts, setAccounts] = useState([]);
//   const [selectedAccount, setSelectedAccount] = useState("");
//   const [error, setError] = useState("");


//   const handleAccountSelect = () => {
//     if (!selectedAccount) {
//       setError("Please select an account");
//       toast.error("Please select an account");
//       return;
//     }
// console.log("selcted account",selectedAccount)
//     sessionStorage.setItem("accountId", selectedAccount);
//     // sessionStorage.removeItem("multipleAccounts");
//     toast.success("Account selected successfully!");
//     navigate("/home", { replace: true });
//   };

//   return (
//     <AppTheme>
//       <CssBaseline enableColorScheme />
//       <SignInContainer>
//         <StyledCard>
//           <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold", mb: 1 }}>
//             Select Account
//           </Typography>
          
//           <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary", mb: 2 }}>
//             You have multiple accounts. Please select one to continue.
//           </Typography>
          
//           {error && (
//             <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
//               {error}
//             </Alert>
//           )}
          
//           <FormControl fullWidth>
//             <FormLabel>Select Account</FormLabel>
//             <Select
//               value={selectedAccount}
//               onChange={(e) => setSelectedAccount(e.target.value)}
//               displayEmpty
//               sx={{ mt: 1 }}
//             >
//               <MenuItem value="" disabled>
//                 -- Select an account --
//               </MenuItem>
//               {accounts.map((acc) => (
//                 <MenuItem key={acc._id} value={acc._id}>
//                   {acc.accountName} - {acc.clientType}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
          
//           <Button
//             variant="contained"
//             onClick={handleAccountSelect}
//             fullWidth
//             sx={{
//               mt: 2,
//               py: 1.2,
//               background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//               "&:hover": {
//                 background: "linear-gradient(135deg, #5a67d8 0%, #6b46a0 100%)",
//               },
//             }}
//           >
//             Continue to Dashboard
//           </Button>
//         </StyledCard>
//       </SignInContainer>
//     </AppTheme>
//   );
// };

// export default AccountSelectPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "material-react-toastify";
import { 
  Building2, 
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Users
} from "lucide-react";

const AccountSelectPage = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [error, setError] = useState("");

  const handleAccountSelect = () => {
    if (!selectedAccount) {
      setError("Please select an account");
      toast.error("Please select an account");
      return;
    }
    
    console.log("selected account", selectedAccount);
    sessionStorage.setItem("accountId", selectedAccount);
    toast.success("Account selected successfully!");
    navigate("/home", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 transform transition-all duration-300">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Select Account
          </h1>
          <p className="text-sm text-gray-500">
            You have multiple accounts. Please select one to continue.
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Account Selection Form */}
        <div className="space-y-5">
          {/* Select Field Label */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Account
            </label>
            
            {/* Custom Select Dropdown */}
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
              >
                <option value="" disabled>
                  -- Select an account --
                </option>
                {accounts.map((acc) => (
                  <option key={acc._id} value={acc._id}>
                    {acc.accountName} - {acc.clientType}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleAccountSelect}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] shadow-md flex items-center justify-center space-x-2"
          >
            <span>Continue to Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-center text-xs text-gray-400">
            Secure account selection 
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountSelectPage;