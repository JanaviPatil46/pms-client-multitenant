

// import { useState, useContext, useEffect } from "react";
// import {
//   Box,

//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Typography,
//   Paper,
//   TableContainer,
//   Chip,
//   Tooltip,
// } from "@mui/material";
// import axios from "axios";
// import ProposalPreviewDialog from "./ProposalPreviewDialog";

// import { toast } from "material-react-toastify";
// import { proposalAPI } from "../../services/api"; // adjust path
// const Proposals = () => {
 
//   const [proposalsList, setProposalsList] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedProposal, setSelectedProposal] = useState(null);
// const [accountId, setAccountId] = useState(sessionStorage.getItem("accountId"));
//  useEffect(() => {
//   if (accountId) {
//     fetchPrprosalsAllData(accountId);
//   }
// }, [accountId]);

//  const fetchPrprosalsAllData = async (accId) => {
//   try {
//     const res = await proposalAPI.getAccountProposalsByAccountIds([accId]);

//     setProposalsList(res.data.proposallist || []);
//   } catch (error) {
//     console.error("Error fetching proposals:", error);
//     toast.error("Failed to fetch proposals");
//   }
// };

//   const handleOpenDialog = (proposal) => {
//     setSelectedProposal(proposal);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSelectedProposal(null);
// fetchPrprosalsAllData(accountId);
//   };

//   return (
//     <Box sx={{ width: "100%", maxWidth: "1700px", p: 2 }}>
//       <Typography variant="h4" fontWeight={600} gutterBottom>
//         Proposals & ELs
//       </Typography>

     

// <Box>
//   <TableContainer component={Paper} sx={{ overflow: "visible" }}>
//     <Table sx={{ minWidth: 800 }} aria-label="proposals table">
//       <TableHead>
//         <TableRow>
//           {["Proposal Name", "Status", "Date", ].map((label, index) => (
//             <TableCell
//               key={index}
//               sx={{
//                 fontSize: "14px",
//                 fontWeight: "bold",
//                 padding: "16px",
//                 minWidth: 120,
//               }}
//             >
//               {label}
//             </TableCell>
//           ))}
//         </TableRow>
//       </TableHead>

//       <TableBody>
//         {proposalsList.map((row) => (
//           <TableRow
//             key={row._id}
//             hover
//             sx={{
//               cursor: "pointer",
//               "&:hover": {
//                 backgroundColor: "#f4f4f4",
//               },
//             }}
//           >
//             <TableCell>
//               <Tooltip title="View Details">
//                 <Typography
//                   component="h2"
//                   variant="subtitle2"
//                   sx={{ cursor: "pointer" }}
//                   onClick={() => handleOpenDialog(row)}
//                 >
//                   {row.general.proposalName || "Untitled"}
//                 </Typography>
//               </Tooltip>
//             </TableCell>

// <TableCell>
//   <Chip
//     label={row.status}
   
//          color="#fff"
//     sx={{ 
//       border: "none",
//       ...(row.status === "Pending" && {
//         // backgroundColor: "#ffc107",
//         backgroundColor:"#FFA726",
//            color:"#fff"
       
//       }),
//        ...(row.status === "Signed" && {
//         // backgroundColor: "#008000",
//         backgroundColor:"#0288D1",
//             color:"#fff"
        
//       }),
//        ...(row.status === "Partially Signed" && {
//         // backgroundColor: "#FF0000",
//         backgroundColor:'#FBC02D',
//         color:"#fff"
       
//       })
//     }}
//     size="small"
//   />
// </TableCell>
//             <TableCell>
//               {new Date(row.createdAt).toLocaleDateString("en-US", {
//                 month: "short",
//                 day: "numeric",
//                 year: "numeric",
//               })}
//             </TableCell>

           
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   </TableContainer>
// </Box>

      
//      <ProposalPreviewDialog
//     open={openDialog}
//     handleClose={handleCloseDialog}
//     proposal={selectedProposal}
//   />
//     </Box>
//   );
// };

// export default Proposals;


import { useState, useContext, useEffect } from "react";

import axios from "axios";
import ProposalPreviewDialog from "./ProposalPreviewDialog";
// import { toast } from "material-react-toastify";
import { proposalAPI } from "../../services/api";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";
import { PageTransition, TableSkeletonRows } from "../../components/ui/motion";
import { useToast } from "../../hooks/useToast";

const Proposals = () => {
const toast=useToast()
  const [loginuserid, setLoginUserId] = useState("");
  const [proposalsList, setProposalsList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [accountId, setAccountId] = useState(sessionStorage.getItem("accountId"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (accountId) {
      fetchPrprosalsAllData(accountId);
    }
  }, [accountId]);

  const fetchPrprosalsAllData = async (accId) => {
    try {
      setIsLoading(true);
      const res = await proposalAPI.getAccountProposalsByAccountIds([accId]);
      setProposalsList(res.data.proposallist || []);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      toast.error("Failed to fetch proposals");
    } finally {
      setIsLoading(false);
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

  const statusConfig = {
    Pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    Signed: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400",
    "Partially Signed": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  };

  // return (
  //   <PageTransition className="w-full max-w-[1700px] flex-1 h-[90vh] overflow-auto">
  //     <div className="p-4 sm:p-6 flex flex-col gap-5">
  //       {/* Page heading */}
  //       <div className="flex flex-col gap-1">
  //         <div className="flex items-center gap-2.5">
  //           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
  //             <FileText size={16} className="text-primary" strokeWidth={1.8} />
  //           </div>
  //           <h1 className="text-2xl font-semibold tracking-tight text-foreground">Proposals & ELs</h1>
  //           {proposalsList.length > 0 && (
  //             <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground border border-border">
  //               {proposalsList.length}
  //             </span>
  //           )}
  //         </div>
  //         <p className="text-[13px] text-muted-foreground pl-10">Review and sign your engagement letters and proposals.</p>
  //       </div>

  //       {/* Table card */}
  //       <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
  //         <div className="overflow-x-auto">
  //           <table className="w-full min-w-[640px] text-sm">
  //             <thead>
  //               <tr className="border-b border-border bg-muted/40">
  //                 {["Proposal Name", "Status", "Date"].map((label) => (
  //                   <th
  //                     key={label}
  //                     className="px-4 py-3.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-widest"
  //                   >
  //                     {label}
  //                   </th>
  //                 ))}
  //               </tr>
  //             </thead>
  //             <tbody className="divide-y divide-border/60">
  //               {isLoading ? (
  //                 <TableSkeletonRows rows={5} cols={3} />
  //               ) : proposalsList.length === 0 ? (
  //                 <tr>
  //                   <td colSpan={3} className="py-16 text-center">
  //                     <div className="flex flex-col items-center gap-3">
  //                       <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
  //                         <FileText size={22} className="text-muted-foreground" strokeWidth={1.5} />
  //                       </div>
  //                       <p className="text-sm font-medium text-foreground">No proposals found</p>
  //                       <p className="text-[13px] text-muted-foreground">Your proposals and engagement letters will appear here.</p>
  //                     </div>
  //                   </td>
  //                 </tr>
  //               ) : (
  //                 proposalsList.map((row, rowIndex) => (
  //                   <motion.tr
  //                     key={row._id}
  //                     initial={{ opacity: 0, y: 5 }}
  //                     animate={{ opacity: 1, y: 0 }}
  //                     transition={{ duration: 0.18, delay: rowIndex * 0.04, ease: [0.16, 1, 0.3, 1] }}
  //                     className="hover:bg-muted/40 transition-colors duration-150 cursor-pointer group"
  //                     onClick={() => handleOpenDialog(row)}
  //                   >
  //                     <td className="px-4 py-3.5">
  //                       <span
  //                         title="View Details"
  //                         className="font-medium text-foreground group-hover:text-primary transition-colors"
  //                       >
  //                         {row.general.proposalName || "Untitled"}
  //                       </span>
  //                     </td>

  //                     <td className="px-4 py-3.5">
  //                       <span
  //                         className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
  //                           statusConfig[row.status] ?? "bg-muted text-muted-foreground border-border"
  //                         }`}
  //                       >
  //                         {row.status}
  //                       </span>
  //                     </td>

  //                     <td className="px-4 py-3.5 text-[13px] text-muted-foreground">
  //                       {new Date(row.createdAt).toLocaleDateString("en-US", {
  //                         month: "short",
  //                         day: "numeric",
  //                         year: "numeric",
  //                       })}
  //                     </td>
  //                   </motion.tr>
  //                 ))
  //               )}
  //             </tbody>
  //           </table>
  //         </div>
  //       </div>
  //     </div>

  //     <ProposalPreviewDialog
  //       open={openDialog}
  //       handleClose={handleCloseDialog}
  //       proposal={selectedProposal}
  //     />
  //   </PageTransition>
  // );
  return (
  <PageTransition className="w-full max-w-[1700px] flex-1 h-[90vh] overflow-auto bg-background">
    
    <div className="p-4 sm:p-6 flex flex-col gap-6">

      {/* Page heading */}
      <div className="flex flex-col gap-1.5">
        
        <div className="flex items-center gap-2.5">
          
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
            <FileText size={16} className="text-primary" strokeWidth={1.8} />
          </div>

          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Proposals & ELs
          </h1>

          {proposalsList.length > 0 && (
            <span className="
              inline-flex items-center
              rounded-full
              bg-muted
              px-2 py-0.5
              text-[11px] font-semibold
              text-muted-foreground
              border border-border
            ">
              {proposalsList.length}
            </span>
          )}
        </div>

        <p className="text-[13px] text-muted-foreground pl-10">
          Review and sign your engagement letters and proposals.
        </p>
      </div>

      {/* Table card */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">

        <div className="overflow-x-auto">
          
          <table className="w-full min-w-[640px] text-sm">
            
            {/* HEADER */}
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Proposal Name", "Status", "Date"].map((label) => (
                  <th
                    key={label}
                    className="
                      px-4 py-3.5 text-left
                      text-[11px] font-semibold
                      text-muted-foreground
                      uppercase tracking-wider
                    "
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-border/60">

              {isLoading ? (
                <TableSkeletonRows rows={5} cols={3} />
              ) : proposalsList.length === 0 ? (

                <tr>
                  <td colSpan={3} className="py-16 text-center">
                    
                    <div className="flex flex-col items-center gap-3">

                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted border border-border">
                        <FileText size={22} className="text-muted-foreground" strokeWidth={1.5} />
                      </div>

                      <p className="text-sm font-medium text-foreground">
                        No proposals found
                      </p>

                      <p className="text-[13px] text-muted-foreground">
                        Your proposals and engagement letters will appear here.
                      </p>

                    </div>
                  </td>
                </tr>

              ) : (

                proposalsList.map((row, rowIndex) => (

                  <motion.tr
                    key={row._id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.18,
                      delay: rowIndex * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="
                      hover:bg-muted/30
                      transition-colors duration-150
                      cursor-pointer
                      group
                    "
                    onClick={() => handleOpenDialog(row)}
                  >

                    {/* NAME */}
                    <td className="px-4 py-3.5">
                      <span
                        title="View Details"
                        className="
                          font-medium text-foreground
                          group-hover:text-primary
                          transition-colors
                        "
                      >
                        {row.general.proposalName || "Untitled"}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`
                          inline-flex items-center
                          rounded-full
                          px-2.5 py-0.5
                          text-[11px] font-semibold
                          border
                          ${
                            statusConfig[row.status] ??
                            "bg-muted text-muted-foreground border-border"
                          }
                        `}
                      >
                        {row.status}
                      </span>
                    </td>

                    {/* DATE */}
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

    <ProposalPreviewDialog
      open={openDialog}
      handleClose={handleCloseDialog}
      proposal={selectedProposal}
    />
  </PageTransition>
);
};

export default Proposals;