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
import { ClipboardList } from "lucide-react";
import { motion } from "framer-motion";
import { PageTransition, TableSkeletonRows } from "../../components/ui/motion";
const Organizers = () => {
  const [accountId] = useState(sessionStorage.getItem("accountId"));
  const [isActiveTrue, setIsActiveTrue] = useState(true);
  const [organizersList, setOrganizersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const fetchAccountOrganizer = async () => {
    try {
        setIsLoading(true);
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
    finally {
      setIsLoading(false);
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
    <PageTransition className="w-full max-w-[1700px] flex-1 h-[90vh] overflow-auto">
      <div className="p-4 sm:p-6 flex flex-col gap-5">

        {/* Page header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <ClipboardList size={16} className="text-primary" strokeWidth={1.8} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Organizers</h1>
            {organizersList.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground border border-border">
                {organizersList.length}
              </span>
            )}
          </div>
          <p className="text-[13px] text-muted-foreground pl-10">Review and complete your tax organizers.</p>
        </div>

        {/* Table card */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {["Organizer Name", "Seal", "Status", "Date"].map((label) => (
                    <th key={label} className="px-4 py-3.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-widest min-w-[120px]">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {isLoading ? (
                  <TableSkeletonRows rows={5} cols={4} />
                ) : organizersList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                          <ClipboardList size={22} className="text-muted-foreground" strokeWidth={1.5} />
                        </div>
                        <p className="text-sm font-medium text-foreground">No organizers found</p>
                        <p className="text-[13px] text-muted-foreground">Your organizers will appear here once assigned.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  organizersList.map((row, rowIndex) => (
                    <motion.tr
                      key={row._id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18, delay: rowIndex * 0.04, ease: [0.16, 1, 0.3, 1] }}
                      className="cursor-pointer transition-colors duration-150 hover:bg-muted/40 group"
                      onClick={() => handleOpenDialog(row)}
                    >
                      <td className="px-4 py-3.5">
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {row.organizerName || "Untitled"}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        {row.issealed === true && (
                          <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                            Sealed
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                            row.status === "Pending"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                              : row.status === "Completed"
                              ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30"
                              : row.status === "In Progress"
                              ? "bg-primary/10 text-primary border-primary/30"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-[13px] text-muted-foreground">
                        {new Date(row.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <OrganizerDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        organizer={selectedOrganizer}
      />
    </PageTransition>
  );
  // return (
  //   <>
  //   <TableContainer component={Paper} sx={{ overflow: "visible" }}>
  //     <Table>
  //       <TableHead>
  //         <TableRow>
  //           {["Organizer Name", "Seal", "Status", "Date"].map(
  //             (label, index) => (
  //               <TableCell
  //                 key={index}
  //                 sx={{
  //                   fontSize: "14px",
  //                   fontWeight: "bold",
  //                   padding: "16px",
  //                   minWidth: 120,
  //                 }}
  //               >
  //                 {label}
  //               </TableCell>
  //             )
  //           )}
  //         </TableRow>
  //       </TableHead>

  //       <TableBody>
  //         {organizersList.length > 0 ? (
  //           organizersList.map((row) => (
  //             <TableRow
  //               key={row._id}
  //               hover
  //               sx={{
  //                 cursor: "pointer",
  //                 "&:hover": { backgroundColor: "#f4f4f4" },
  //               }}
  //             >
  //               {/* Organizer Name */}
  //               <TableCell>
  //                 <Tooltip title="View Details">
  //                   <Typography
  //                     variant="subtitle2"
  //                     sx={{ cursor: "pointer" }}
  //                     onClick={() => handleOpenDialog(row)}
  //                   >
  //                     {row.organizerName || "Untitled"}
  //                   </Typography>
  //                 </Tooltip>
  //               </TableCell>

  //               {/* Seal */}
  //               <TableCell>
  //                 {row.issealed && (
  //                   <Chip
  //                     label="Sealed"
  //                     size="small"
  //                     sx={{
  //                       backgroundColor: "#5C6BC0",
  //                       color: "#fff",
  //                     }}
  //                   />
  //                 )}
  //               </TableCell>

  //               {/* Status */}
  //               <TableCell>
  //                 <Chip
  //                   label={row.status}
  //                   size="small"
  //                   sx={{
  //                     ...(row.status === "Pending" && {
  //                       backgroundColor: "#FFA726",
  //                       color: "#fff",
  //                     }),
  //                     ...(row.status === "Completed" && {
  //                       backgroundColor: "#2E7D32",
  //                       color: "#fff",
  //                     }),
  //                     ...(row.status === "In Progress" && {
  //                       backgroundColor: "#1976D2",
  //                       color: "#fff",
  //                     }),
  //                   }}
  //                 />
  //               </TableCell>

  //               {/* Date */}
  //               <TableCell>
  //                 {new Date(row.createdAt).toLocaleDateString("en-US", {
  //                   month: "short",
  //                   day: "numeric",
  //                   year: "numeric",
  //                 })}
  //               </TableCell>
  //             </TableRow>
  //           ))
  //         ) : (
  //           <TableRow>
  //             <TableCell colSpan={4} align="center">
  //               No organizers found
  //             </TableCell>
  //           </TableRow>
  //         )}
  //       </TableBody>
  //     </Table>
  //   </TableContainer>
  //    <OrganizerDialog
  //       open={openDialog}
  //       handleClose={handleCloseDialog}
  //       organizer={selectedOrganizer}
  //     />
  //   </>
  // );
};

export default Organizers;