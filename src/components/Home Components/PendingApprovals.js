// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   CircularProgress,
//   Grid,
//   Chip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   Tooltip,
//   DialogActions,
//   Button,
//   IconButton,
//   DialogContentText,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import DescriptionIcon from "@mui/icons-material/Description";
// import axios from "axios";
// import WarningAmberIcon from "@mui/icons-material/WarningAmber";
// import { toast } from "material-react-toastify";
// import { useNavigate } from "react-router-dom";
// import { accountDocsAPI, accountsAPI, invoiceAPI } from "../../services/api";
// const PendingApprovals = ({ accountId, adminUserId }) => {
 
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
//   const [cancelReason, setCancelReason] = useState("");
//   const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
//   const [selectedInvoiceFile, setSelectedInvoiceFile] = useState(null);
//   const [selectedDoc, setSelectedDoc] = useState(null);
//   const [openViewer, setOpenViewer] = useState(false);
//   const [accountName, setAccountName] = useState("");

// const fetchAccountDetails = async () => {
//   try {
//     const res = await accountsAPI.getAccountById(accountId);
// setAccountName(res.data.accountName)

//     console.log("result", res.data);
//   } catch (error) {
//     console.error("Error fetching account details:", error);
//   }
// };

//   useEffect(() => {
//     // if (loginUserId) {
//     fetchAccountDetails();
//     // }
//   }, [accountId]);
  
//   const fetchInvoicesByIds = async (ids = []) => {
//     try {
//       if (!ids.length) return [];
// console.log("invoices ids",ids)
//        // ✅ Use API layer instead of fetch
//     const fetchPromises = ids.map((id) =>
//       invoiceAPI.getInvoiceListById(id)
//     );
//    console.log("")
//       // Wait for all invoices to be fetched
//       const results = await Promise.all(fetchPromises);
// console.log("pending invoices",results)
//       // Filter only valid invoices and transform them
//       // const invoices = results
//       //   .filter((result) => result?.invoice)
//       //   .map((result) => {
//       //     const inv = result.invoice;

//       //     const lineItems = inv.lineItems.map((item) => ({
//       //       productName: item.productorService || "",
//       //       description: item.description || "",
//       //       rate: String(item.rate || "0.00"),
//       //       qty: String(item.quantity || "1"),
//       //       amount: String(item.amount || "0.00"),
//       //       tax: item.tax || false,
//       //       isDiscount: item.isDiscount || false,
//       //     }));

//       //     return {
//       //       _id: inv._id,
//       //       invoicenumber: inv.invoicenumber,
//       //       invoicedate: inv.invoicedate,
//       //       account: inv.account
//       //         ? { value: inv.account._id, label: inv.account.accountName }
//       //         : null,
//       //       invoicetemplate: inv.invoicetemplate
//       //         ? {
//       //             value: inv.invoicetemplate._id,
//       //             label: inv.invoicetemplate.templatename,
//       //           }
//       //         : null,
//       //       paymentMethod: {
//       //         value: inv.paymentMethod,
//       //         label: inv.paymentMethod,
//       //       },
//       //       teammember: inv.teammember
//       //         ? { value: inv.teammember._id, label: inv.teammember.username }
//       //         : null,
//       //       description: inv.description,
//       //       emailToClient: inv.emailinvoicetoclient,
//       //       scheduledInvoice: inv.scheduleinvoice,
//       //       payInvoiceWithCredits: inv.payInvoicewithcredits,
//       //       isEmailInvoice: inv.emailinvoicetoclient,
//       //       reminders: inv.reminders,
//       //       lineItems,
//       //       summary: inv.summary || {},
//       //     };
//       //   });

//       const invoices = results
//   .filter((result) => result?.data?.invoice) // ✅ FIX
//   .map((result) => {
//     const inv = result.data.invoice; // ✅ FIX

//     const lineItems = inv.lineItems.map((item) => ({
//       productName: item.productorService || "",
//       description: item.description || "",
//       rate: String(item.rate || "0.00"),
//       qty: String(item.quantity || "1"),
//       amount: String(item.amount || "0.00"),
//       tax: item.tax || false,
//       isDiscount: item.isDiscount || false,
//     }));

//     return {
//       _id: inv._id,
//       invoicenumber: inv.invoicenumber,
//       invoicedate: inv.invoicedate,
//       account: inv.account
//         ? { value: inv.account._id, label: inv.account.accountName }
//         : null,
//       invoicetemplate: inv.invoicetemplate
//         ? {
//             value: inv.invoicetemplate._id,
//             label: inv.invoicetemplate.templatename,
//           }
//         : null,
//       paymentMethod: {
//         value: inv.paymentMethod,
//         label: inv.paymentMethod,
//       },
//       teammember: inv.teammember
//         ? { value: inv.teammember._id, label: inv.teammember.username }
//         : null,
//       description: inv.description,
//       emailToClient: inv.emailinvoicetoclient,
//       scheduledInvoice: inv.scheduleinvoice,
//       payInvoiceWithCredits: inv.payInvoicewithcredits,
//       isEmailInvoice: inv.emailinvoicetoclient,
//       reminders: inv.reminders,
//       lineItems,
//       summary: inv.summary || {},
//     };
//   });

//       return invoices;
//     } catch (error) {
//       console.error("Error fetching invoices:", error);
//       return [];
//     }
//   };
//   const handleOpenViewer = async (doc) => {
//     console.log("selected document", doc);
//     const hasPendingInvoice =
//       doc?.meta?.lockInvoiceStatus === "pendingpayment" &&
//       Array.isArray(doc?.meta?.invoiceLock) &&
//       doc.meta.invoiceLock.length > 0;

//     if (hasPendingInvoice) {
//       // 🔒 Show invoice dialog FIRST
//       // setSelectedInvoiceFile(doc);
//       console.log("invoice lock id",doc.meta.invoiceLock)
//       const invoices = await fetchInvoicesByIds(doc.meta.invoiceLock);

//       console.log("fetched invoices for dialog", invoices);
//       // Save for dialog
      
//       setSelectedInvoiceFile({
//         _id: doc._id,
//         name: doc.name,
//         path: doc.path,
//         invoices, // <-- flat invoices array
//       });
//       setInvoiceDialogOpen(true);
//       return;
//     }
//     setSelectedDoc(doc);
//     setOpenViewer(true);
//   };

//   const navigate = useNavigate();

//   const handlePayInvoice = () => {
//     if (!selectedInvoiceFile?.invoices?.length) return;

//     navigate("/payinvoice", {
//       state: {
//         selectedInvoices: selectedInvoiceFile.invoices,
//         accountName: accountName, // Replace with dynamic account name if available
//       },
//     });
//   };
//   const handleAction = async (id, action, reason = "") => {
//   try {
//     console.log("Sending approval request:", {
//       id,
//       action,
//       description: reason,
//       accountId,
//       adminUserId,
//     });

//     // ✅ Use API service instead of axios
//     const res = await accountDocsAPI.updateApprovalStatus(id, {
//       action,
//       description: reason,
//       accountId,
//       adminUserId,
//     });

//     const data = res.data;

//     console.log("✅ Approval response:", data);

//     const fileUrl = data?.approval?.fileUrl;

//     if (!fileUrl) {
//       console.error("❌ fileUrl missing in approval response");
//       return;
//     }

//     const splitPath = fileUrl.split("/uploads/accounts/");
//     if (splitPath.length < 2) {
//       console.error("❌ Invalid fileUrl format:", fileUrl);
//       return;
//     }

//     const originalPath = splitPath[1];
//     console.log("📌 Original document path:", originalPath);

//     // status mapping
//     const newStatus =
//       action === "approve" ? "approvalCompleted" : "canceledApproval";

//     // ✅ FIXED: use proper API method
//     await updateStatus(
//         { path: originalPath },
//         "authStatus",
//         newStatus,
//         action,
//         cancelReason
//       );

//     // cleanup UI
//     setOpenViewer(false);
//     setCancelDialogOpen(false);
//     setCancelReason("");

//     fetchPendingApprovals();
//   } catch (error) {
//     console.error(`❌ Error performing ${action} approval:`, error);

//     if (error.response) {
//       console.error("Response data:", error.response.data);
//     }
//   }
// };
//   // 🔹 Frontend: Update any status (read, sign, approval)
  
//   const updateStatus = async (item, statusType, newValue, action, reason = "") => {
//   try {
//     if (!item?.path) return alert("Invalid item selected");

//     const body = {
//       targetPath: item.path,
//       status: {
//         [statusType]: newValue,
//         ...(action === "cancel" && reason ? { cancelReason: reason } : {}),
//       },
//     };

//     const res = await accountDocsAPI.updateStatus(body);

//     const data = res.data;

//     if (res.status === 200) {
//       toast.success(
//         action === "approve"
//           ? "Document approved successfully 🎉"
//           : "Document disapproved successfully ❌"
//       );
//     } else {
//       alert(data.error || "Failed to update status");
//     }
//   } catch (err) {
//     console.error("Error updating status:", err);
//   }
// };
//   const handleCancelClick = () => {
//     setCancelDialogOpen(true);
//   };

//   const confirmCancel = () => {
//     handleAction(selectedDoc.meta.approvalId, "cancel", cancelReason);
//   };
//   const handleCloseViewer = () => {
//     setOpenViewer(false);
//     setSelectedDoc(null);
//   };
//   const fetchPendingApprovals = async () => {
//   try {
//     setLoading(true);

//     const res = await accountDocsAPI.getPendingApprovals(accountId);

//     setDocuments(res.data.documents || []);
//     console.log("pending account docs",res.data)
//   } catch (err) {
//     console.error("Failed to load pending approvals", err);
//   } finally {
//     setLoading(false);
//   }
// };

//   useEffect(() => {
//     fetchPendingApprovals();
//   }, []);
//   const FILE_BASE_URL = `${process.env.REACT_APP_FOLDER_MANAGEMENT}/uploads/accounts`;
  

// return (
//   <Box>
//     {documents.length > 0 && (
//       <Box p={3}>
//         {/* Header */}
//         <Box mb={3} display="flex" alignItems="center" gap={1}>
//           <Typography variant="h6" fontWeight={600}>
//             Pending Approvals ({documents.length})
//           </Typography>
//         </Box>

//         {/* Loading */}
//         {loading && (
//           <Box display="flex" justifyContent="center" mt={4}>
//             <CircularProgress />
//           </Box>
//         )}

//         {/* Cards */}
//         <Grid container spacing={2}>
//           {documents.map((doc, index) => (
//             <Grid item xs={12} sm={6} md={4} key={index}>
//               <Card
//                 elevation={2}
//                 sx={{
//                   height: "100%",
//                   borderRadius: 2,
//                   transition: "0.2s",
//                   "&:hover": { boxShadow: 6 },
//                 }}
//                 onClick={() => handleOpenViewer(doc)}
//               >
//                 <CardContent>
//                   <Box display="flex" alignItems="center" gap={1} mb={1}>
//                     <DescriptionIcon color="warning" />
//                     <Typography variant="subtitle1" fontWeight={600} noWrap>
//                       {doc.name}
//                     </Typography>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>

//         {/* All Dialogs */}
//         <Box>
//           {/* Viewer Dialog */}
//           <Dialog
//             open={openViewer}
//             onClose={handleCloseViewer}
//             fullWidth
//             maxWidth="md"
//           >
//             <DialogTitle
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <Box display="flex" alignItems="center" gap={2}>
//                 <DescriptionIcon fontSize="small" sx={{ color: "#f0c000" }} />
//                 <Typography variant="subtitle1" fontWeight={600} noWrap>
//                   {selectedDoc?.meta?.name || "Document"}
//                 </Typography>

//                 {selectedDoc?.description && (
//                   <Tooltip title={selectedDoc.description} arrow>
//                     <IconButton size="small">
//                       <WarningAmberIcon />
//                     </IconButton>
//                   </Tooltip>
//                 )}
//               </Box>

//               <IconButton onClick={handleCloseViewer}>
//                 <CloseIcon />
//               </IconButton>
//             </DialogTitle>

//             <DialogContent dividers sx={{ height: "80vh" }}>
//               {selectedDoc ? (
//                 <iframe
//                   src={`${FILE_BASE_URL}/${selectedDoc.path}`}
//                   title={selectedDoc.name}
//                   width="100%"
//                   height="100%"
//                   style={{ border: "none" }}
//                 />
//               ) : (
//                 <Typography>No document selected</Typography>
//               )}
//             </DialogContent>

//             {selectedDoc && (
//               <DialogActions sx={{ justifyContent: "center" }}>
//                 <Button
//                   variant="contained"
//                   color="success"
//                   onClick={() =>
//                     handleAction(selectedDoc.meta.approvalId, "approve")
//                   }
//                 >
//                   Approve
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="error"
//                   onClick={handleCancelClick}
//                 >
//                   Disapprove
//                 </Button>
//               </DialogActions>
//             )}
//           </Dialog>

//           {/* Cancel Dialog */}
//           <Dialog
//             open={cancelDialogOpen}
//             onClose={() => setCancelDialogOpen(false)}
//             fullWidth
//             maxWidth="sm"
//           >
//             <DialogTitle>Cancel Document Approval</DialogTitle>
//             <DialogContent>
//               <DialogContentText sx={{ mb: 2 }}>
//                 Please provide a reason:
//               </DialogContentText>
//               <TextField
//                 fullWidth
//                 multiline
//                 value={cancelReason}
//                 onChange={(e) => setCancelReason(e.target.value)}
//               />
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setCancelDialogOpen(false)}>Close</Button>
//               <Button
//                 variant="contained"
//                 color="error"
//                 disabled={!cancelReason.trim()}
//                 onClick={confirmCancel}
//               >
//                 Submit
//               </Button>
//             </DialogActions>
//           </Dialog>

//           {/* Invoice Dialog */}
//           <Dialog
//             open={invoiceDialogOpen}
//             onClose={() => setInvoiceDialogOpen(false)}
//             fullWidth
//             maxWidth="sm"
//           >
//             <DialogTitle>Invoice Details</DialogTitle>

//             <DialogContent>
//               {selectedInvoiceFile?.invoices?.length ? (
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Invoice Number</TableCell>
//                       <TableCell>Description</TableCell>
//                       <TableCell align="right">Amount</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {selectedInvoiceFile.invoices.map((invoice) => (
//                       <TableRow key={invoice._id}>
//                         <TableCell>{invoice.invoicenumber}</TableCell>
//                         <TableCell>
//                           {invoice.description || "No description"}
//                         </TableCell>
//                         <TableCell align="right">
//                           ${invoice.summary?.total?.toFixed(2) || "0.00"}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               ) : (
//                 <Typography>No invoices available.</Typography>
//               )}
//             </DialogContent>

//             <DialogActions>
//               <Button onClick={() => setInvoiceDialogOpen(false)}>Close</Button>
//               {selectedInvoiceFile?.invoices?.length > 0 && (
//                 <Button variant="contained" onClick={handlePayInvoice}>
//                   Pay
//                 </Button>
//               )}
//             </DialogActions>
//           </Dialog>
//         </Box>
//       </Box>
//     )}
//   </Box>
// );


// };

// export default PendingApprovals;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileText, ArrowRight } from "lucide-react";

// import { toast } from "material-react-toastify";
import { useNavigate } from "react-router-dom";
import {
  accountDocsAPI,
  accountsAPI,
  invoiceAPI,
} from "../../services/api";
import { useToast } from "../../hooks/useToast";

const PendingApprovals = ({ accountId, adminUserId }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [selectedInvoiceFile, setSelectedInvoiceFile] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [openViewer, setOpenViewer] = useState(false);
  const [accountName, setAccountName] = useState("");
const toast =useToast()
  const navigate = useNavigate();

  const fetchAccountDetails = async () => {
    try {
      const res = await accountsAPI.getAccountById(accountId);
      setAccountName(res.data.accountName);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAccountDetails();
  }, [accountId]);

  const fetchInvoicesByIds = async (ids = []) => {
    try {
      if (!ids.length) return [];

      const results = await Promise.all(
        ids.map((id) => invoiceAPI.getInvoiceListById(id))
      );

      return results
        .filter((r) => r?.data?.invoice)
        .map((r) => {
          const inv = r.data.invoice;

          return {
            _id: inv._id,
            invoicenumber: inv.invoicenumber,
            description: inv.description,
            summary: inv.summary || {},
          };
        });
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const handleOpenViewer = async (doc) => {
    const hasPendingInvoice =
      doc?.meta?.lockInvoiceStatus === "pendingpayment" &&
      Array.isArray(doc?.meta?.invoiceLock) &&
      doc.meta.invoiceLock.length > 0;

    if (hasPendingInvoice) {
      const invoices = await fetchInvoicesByIds(doc.meta.invoiceLock);

      setSelectedInvoiceFile({
        _id: doc._id,
        name: doc.name,
        path: doc.path,
        invoices,
      });

      setInvoiceDialogOpen(true);
      return;
    }

    setSelectedDoc(doc);
    setOpenViewer(true);
  };

  const handlePayInvoice = () => {
    navigate("/payinvoice", {
      state: {
        selectedInvoices: selectedInvoiceFile.invoices,
        accountName,
      },
    });
  };

  const updateStatus = async (item, statusType, newValue, action, reason = "") => {
    try {
      const res = await accountDocsAPI.updateStatus({
        targetPath: item.path,
        status: {
          [statusType]: newValue,
          ...(action === "cancel" && reason ? { cancelReason: reason } : {}),
        },
        accountId,
        accountName
      });

      if (res.status === 200) {
        toast.success(
          action === "approve"
            ? "Document approved 🎉"
            : "Document disapproved ❌"
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAction = async (id, action, reason = "") => {
    try {
      const res = await accountDocsAPI.updateApprovalStatus(id, {
        action,
        description: reason,
        accountId,
        adminUserId,
      });

      const fileUrl = res.data?.approval?.fileUrl;
      const originalPath = fileUrl.split("/uploads/accounts/")[1];

      const newStatus =
        action === "approve" ? "approvalCompleted" : "canceledApproval";

      await updateStatus(
        { path: originalPath,accountId,accountName },
        "authStatus",
        newStatus,
        action,
        cancelReason
      );

      setOpenViewer(false);
      setCancelDialogOpen(false);
      setCancelReason("");

      fetchPendingApprovals();
    } catch (e) {
      console.error(e);
    }
  };

  const confirmCancel = () => {
    handleAction(selectedDoc.meta.approvalId, "cancel", cancelReason);
  };

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      const res = await accountDocsAPI.getPendingApprovals(accountId);
      setDocuments(res.data.documents || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const FILE_BASE_URL = `${process.env.REACT_APP_FOLDER_MANAGEMENT}/uploads/accounts`;

  return (
    <div>
      {documents.length > 0 && (
        <div className="p-6">
          {/* <h2 className="text-lg font-semibold mb-4">
            Pending Approvals ({documents.length})
          </h2> */}

          {/* {loading && (
            <div className="flex justify-center mt-6">
              <div className="animate-spin h-8 w-8 border-2 border-gray-400 border-t-transparent rounded-full"></div>
            </div>
          )} */}

          {/* Cards */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {documents.map((doc, i) => (
              <div
                key={i}
                onClick={() => handleOpenViewer(doc)}
                className="bg-white rounded-xl shadow hover:shadow-lg cursor-pointer transition p-4"
              >
                <p className="font-semibold truncate">{doc.name}</p>
              </div>
            ))}
          </div> */}
 <div >
    {/* Header */}
    <div className="flex items-center gap-2 mb-2.5">
     <FileText size={13} className="text-amber-400 shrink-0" />
     <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">
        Pending Approvals
      </span>

      <span className="ml-auto text-[11px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
        {documents.length}
      </span>
    </div>

    {/* List */}
    <div className="flex flex-col gap-1.5">
      {documents.map((doc, index) => (
        <div
          key={index}
          onClick={() => handleOpenViewer(doc)}
          className="group flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
        >
          {/* Left */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <FileText size={13} className="text-amber-400 shrink-0" />
              <p className="text-[12px] font-semibold text-gray-800">
                Review Document
              </p>
            </div>

            <p className="text-[12px] text-gray-500 truncate mt-0.5">
              {doc.name}
            </p>
          </div>

          {/* Right arrow */}
          <span className="shrink-0 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
            →
          </span>
        </div>
      ))}
    </div>
  </div>
          {/* 🔹 Viewer Modal */}
          {openViewer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
              <div className="bg-white w-[90%] max-w-4xl rounded-xl shadow-lg">
                <div className="flex justify-between p-4 border-b">
                  <h3 className="font-semibold">
                    {selectedDoc?.meta?.name}
                  </h3>
                  <button onClick={() => setOpenViewer(false)}>✕</button>
                </div>

                <div className="h-[70vh]">
                  <iframe
                    src={`${FILE_BASE_URL}/${selectedDoc.path}`}
                    className="w-full h-full"
                  />
                </div>

                <div className="flex justify-center gap-3 p-4 border-t">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded"
                    onClick={() =>
                      handleAction(selectedDoc.meta.approvalId, "approve")
                    }
                  >
                    Approve
                  </button>

                  <button
                    className="border border-red-500 text-red-500 px-4 py-2 rounded"
                    onClick={() => setCancelDialogOpen(true)}
                  >
                    Disapprove
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 🔹 Cancel Modal */}
          {cancelDialogOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
              <div className="bg-white p-6 rounded-xl w-[400px]">
                <h3 className="font-semibold mb-3">Cancel Approval</h3>

                <textarea
                  className="w-full border p-2 rounded"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />

                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={() => setCancelDialogOpen(false)}>
                    Close
                  </button>
                  <button
                    disabled={!cancelReason.trim()}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                    onClick={confirmCancel}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 🔹 Invoice Modal */}
          {invoiceDialogOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
              <div className="bg-white p-6 rounded-xl w-[500px]">
                <h3 className="font-semibold mb-4">Invoice Details</h3>

                {selectedInvoiceFile?.invoices?.length ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left">Invoice</th>
                        <th>Description</th>
                        <th className="text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoiceFile.invoices.map((inv) => (
                        <tr key={inv._id} className="border-b">
                          <td>{inv.invoicenumber}</td>
                          <td>{inv.description}</td>
                          <td className="text-right">
                            ${inv.summary?.total?.toFixed(2) || "0.00"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No invoices</p>
                )}

                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={() => setInvoiceDialogOpen(false)}>
                    Close
                  </button>

                  {selectedInvoiceFile?.invoices?.length > 0 && (
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                      onClick={handlePayInvoice}
                    >
                      Pay
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;