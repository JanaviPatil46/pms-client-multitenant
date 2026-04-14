import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Stack, Typography } from "@mui/material";
import OrganizerDialog from "../../pages/Organizers/OrganizerDialog";

import { organizerAPI } from "../../services/api"; // ✅ import API

const OrganizersList = ({ accountId }) => {
  const [organizers, setOrganizers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);

  // ✅ FETCH using api.js
  const fetchOrganizers = async () => {
    try {
      const res = await organizerAPI.getPendingOrganizersByAccountId(accountId);
      console.log("oragnizer pending list", res);
      setOrganizers(res.data?.pendingOrganizers || []);
    } catch (error) {
      console.error("Error fetching organizers:", error);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchOrganizers();
    }
  }, [accountId]);

  const handleOpenDialog = (organizer) => {
    setSelectedOrganizer(organizer);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrganizer(null);
    fetchOrganizers(); // refresh after update
  };

  return (
    <>
      {organizers.length > 0 && (
        <Box>
          <Stack
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Organizers ({organizers.length})
            </Typography>
          </Stack>

          <Box mt={2}>
            {organizers.map((organizer, index) => (
              <Stack key={index} mb={1.5}>
                <Paper
                  onClick={() => handleOpenDialog(organizer)}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover .completesign-link": {
                      opacity: 1,
                      visibility: "visible",
                    },
                  }}
                >
                  <Typography variant="subtitle2">
                    Complete Organizer
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {organizer.organizerName}
                    </Typography>

                    <Typography
                      className="completesign-link"
                      color="primary"
                      variant="subtitle2"
                      sx={{
                        opacity: 0,
                        visibility: "hidden",
                        transition: "0.3s",
                      }}
                    >
                      Complete
                    </Typography>
                  </Box>
                </Paper>
              </Stack>
            ))}
          </Box>
        </Box>
      )}

      <OrganizerDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        organizer={selectedOrganizer}
      />
    </>
  );
};

export default OrganizersList;
