

import { useState, useContext, useEffect } from "react";
import {
  Box,

  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Paper,
  TableContainer,
  Chip,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import ProposalPreviewDialog from "./ProposalPreviewDialog";

import { toast } from "material-react-toastify";
import { proposalAPI } from "../../services/api"; // adjust path
const Proposals = () => {
 
  const [proposalsList, setProposalsList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
const [accountId, setAccountId] = useState(sessionStorage.getItem("accountId"));
 useEffect(() => {
  if (accountId) {
    fetchPrprosalsAllData(accountId);
  }
}, [accountId]);

 const fetchPrprosalsAllData = async (accId) => {
  try {
    const res = await proposalAPI.getAccountProposalsByAccountIds([accId]);

    setProposalsList(res.data.proposallist || []);
  } catch (error) {
    console.error("Error fetching proposals:", error);
    toast.error("Failed to fetch proposals");
  }
};

  const handleOpenDialog = (proposal) => {
    setSelectedProposal(proposal);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProposal(null);
fetchPrprosalsAllData(accountId);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "1700px", p: 2 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Proposals & ELs
      </Typography>

     

<Box>
  <TableContainer component={Paper} sx={{ overflow: "visible" }}>
    <Table sx={{ minWidth: 800 }} aria-label="proposals table">
      <TableHead>
        <TableRow>
          {["Proposal Name", "Status", "Date", ].map((label, index) => (
            <TableCell
              key={index}
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                padding: "16px",
                minWidth: 120,
              }}
            >
              {label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        {proposalsList.map((row) => (
          <TableRow
            key={row._id}
            hover
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#f4f4f4",
              },
            }}
          >
            <TableCell>
              <Tooltip title="View Details">
                <Typography
                  component="h2"
                  variant="subtitle2"
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleOpenDialog(row)}
                >
                  {row.general.proposalName || "Untitled"}
                </Typography>
              </Tooltip>
            </TableCell>

<TableCell>
  <Chip
    label={row.status}
   
         color="#fff"
    sx={{ 
      border: "none",
      ...(row.status === "Pending" && {
        // backgroundColor: "#ffc107",
        backgroundColor:"#FFA726",
           color:"#fff"
       
      }),
       ...(row.status === "Signed" && {
        // backgroundColor: "#008000",
        backgroundColor:"#0288D1",
            color:"#fff"
        
      }),
       ...(row.status === "Partially Signed" && {
        // backgroundColor: "#FF0000",
        backgroundColor:'#FBC02D',
        color:"#fff"
       
      })
    }}
    size="small"
  />
</TableCell>
            <TableCell>
              {new Date(row.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </TableCell>

           
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</Box>

      
     <ProposalPreviewDialog
    open={openDialog}
    handleClose={handleCloseDialog}
    proposal={selectedProposal}
  />
    </Box>
  );
};

export default Proposals;
