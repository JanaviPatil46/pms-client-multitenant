import React, { useState, useEffect } from "react";
import { organizerAPI } from "../../services/api";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Tooltip,
  Typography,
  Chip,
} from "@mui/material";
import OrganizerDialog from "./OrganizerDialog"

const Organizers = () => {
  const [accountId] = useState(sessionStorage.getItem("accountId"));
  const [isActiveTrue, setIsActiveTrue] = useState(true);
  const [organizersList, setOrganizersList] = useState([]);
 const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const fetchAccountOrganizer = async () => {
    try {
      const res = await organizerAPI.getActiveOrganizerByAccountId(
        accountId,
        true
      );

      setOrganizersList(res.data.organizerAccountWise || []);
      console.log("organizer list by accountid", res.data);
    } catch (error) {
      console.error(error);
      // toast.error("Failed to fetch organizers");
    }
  };

  useEffect(() => {
    fetchAccountOrganizer();
  }, [isActiveTrue]);


const handleOpenDialog = (organizer) => {
    setSelectedOrganizer(organizer);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrganizer(null);
    // fetchOrganizers(accountId);
     fetchAccountOrganizer();
    
  };
  return (
    <>
    <TableContainer component={Paper} sx={{ overflow: "visible" }}>
      <Table>
        <TableHead>
          <TableRow>
            {["Organizer Name", "Seal", "Status", "Date"].map(
              (label, index) => (
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
              )
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {organizersList.length > 0 ? (
            organizersList.map((row) => (
              <TableRow
                key={row._id}
                hover
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#f4f4f4" },
                }}
              >
                {/* Organizer Name */}
                <TableCell>
                  <Tooltip title="View Details">
                    <Typography
                      variant="subtitle2"
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleOpenDialog(row)}
                    >
                      {row.organizerName || "Untitled"}
                    </Typography>
                  </Tooltip>
                </TableCell>

                {/* Seal */}
                <TableCell>
                  {row.issealed && (
                    <Chip
                      label="Sealed"
                      size="small"
                      sx={{
                        backgroundColor: "#5C6BC0",
                        color: "#fff",
                      }}
                    />
                  )}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Chip
                    label={row.status}
                    size="small"
                    sx={{
                      ...(row.status === "Pending" && {
                        backgroundColor: "#FFA726",
                        color: "#fff",
                      }),
                      ...(row.status === "Completed" && {
                        backgroundColor: "#2E7D32",
                        color: "#fff",
                      }),
                      ...(row.status === "In Progress" && {
                        backgroundColor: "#1976D2",
                        color: "#fff",
                      }),
                    }}
                  />
                </TableCell>

                {/* Date */}
                <TableCell>
                  {new Date(row.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No organizers found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
     <OrganizerDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        organizer={selectedOrganizer}
      />
    </>
  );
};

export default Organizers;