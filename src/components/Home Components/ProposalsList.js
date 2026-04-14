

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,

} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import axios from "axios";
import ProposalPreviewDialog from "../../pages/Proposals/ProposalPreviewDialog"; 
import { proposalAPI } from "../../services/api"; // adjust path
const ProposalsList = ({accountId}) => {
  const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_URL
  const [proposals, setProposals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
console.log("vhjs", accountId)
 const fetchProposalsAllData = async () => {
  try {
    const res = await proposalAPI.getPendingAccountProposalsByAccountId(accountId);

    setProposals(res.data.proposallist || []);
  } catch (error) {
    console.error("Error fetching proposals:", error);
  }
};
console.log("acc proposals", proposals)
  // useEffect(() => {
  //   fetchProposalsAllData();
  // }, []);
useEffect(() => {
  if (accountId) {
    fetchProposalsAllData();
  }
}, [accountId]);
  const handleOpenDialog = (proposal) => {
    setSelectedProposal(proposal);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProposal(null);
    fetchProposalsAllData();
  };

  return (
    <>
      {proposals.length > 0 && (
        <Box>
          <Stack
            sx={{
              p: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Typography
              component="h2"
              variant="subtitle2"
              gutterBottom
              sx={{ fontWeight: "600" }}
            >
              Proposals & ELs ({proposals.length})
            </Typography>
          </Stack>
          <Box mt={2}>
            {proposals.map((proposal, index) => (
              <Stack key={index} mb={1.5}>
                <Paper
                  onClick={() => handleOpenDialog(proposal)}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                    transition: "all 0.3s",
                    cursor: "pointer",
                    "&:hover .reviewsign-link": {
                      opacity: 1,
                      visibility: "visible",
                      textDecoration: "none",
                      cursor: "pointer",
                    },
                  }}
                >
                  <Typography component="h2" variant="subtitle2" gutterBottom>
                    Review and sign
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <DescriptionIcon
                        fontSize="small"
                        sx={{ color: "#f0c000" }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", cursor: "pointer" }}
                      >
                        {proposal.general.proposalName}
                      </Typography>
                    </Box>
                    <Typography
                      className="reviewsign-link"
                      color="primary"
                      variant="subtitle2"
                      component="p"
                      fontWeight="600"
                      sx={{
                        fontSize: 14,
                        opacity: 0,
                        visibility: "hidden",
                        transition: "all 0.3s",
                        textDecoration: "none",
                        cursor: "pointer",
                      }}
                    >
                      Sign
                    </Typography>
                  </Box>
                </Paper>
              </Stack>
            ))}
          </Box>
        </Box>
      )}

      {/* Fullscreen Dialog */}

      {/* <ProposalDialog
  open={openDialog}
  handleClose={handleCloseDialog}
  proposal={selectedProposal}
/> */}
 <ProposalPreviewDialog
    open={openDialog}
    handleClose={handleCloseDialog}
    proposal={selectedProposal}
  />
    </>
  );
};

export default ProposalsList;
