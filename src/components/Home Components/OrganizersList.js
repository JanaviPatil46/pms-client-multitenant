import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Stack, Typography } from "@mui/material";
import OrganizerDialog from "../../pages/Organizers/OrganizerDialog";
import { ClipboardList, ArrowRight } from "lucide-react";

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
      {/* {organizers.length > 0 && (
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
      )} */}
 {organizers.length > 0 && (
        <div className="px-5 py-3">
          <div className="flex items-center gap-2 mb-2.5">
            <ClipboardList size={13} className="text-primary shrink-0" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Organizers
            </span>
            <span className="ml-auto text-[11px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
              {organizers.length}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {organizers.map((organizer, index) => (
              <div
                key={index}
                onClick={() => handleOpenDialog(organizer)}
                className="group flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background px-3.5 py-2.5 cursor-pointer hover:bg-muted/50 hover:border-border transition-all duration-200"
              >
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-foreground">Complete Organizer</p>
                  <p className="text-[12px] text-muted-foreground truncate mt-0.5">{organizer.organizerName}</p>
                </div>
                <ArrowRight size={13} className="shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
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
