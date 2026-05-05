// import React, { useState, useEffect, useContext } from "react";
// import {
//   Button,
//   Typography,
//   Box,
//   Paper,
//   IconButton,
//   Chip,
//   Tooltip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   DialogContentText,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Checkbox,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import DescriptionIcon from "@mui/icons-material/Description";
// import WarningAmberIcon from "@mui/icons-material/WarningAmber";
// import FileUploadDrawer from "./drawers/FileUploadDrawer";
// import CreteFolderDrawer from "./drawers/CreteFolderDrawer";
// import FolderUploadDrawer from "./drawers/FolderUploadDrawer";
// import RenameDrawer from "./drawers/RenameDrawer";
// import MoveDrawer from "./drawers/MoveDrawer";
// import {
//   Folder as FolderIcon,
//   InsertDriveFile as FileIcon,
//   Lock as LockIcon,
//   LockOpen as LockOpenIcon,
// } from "@mui/icons-material";

// import UploadFileIcon from "@mui/icons-material/UploadFile";
// import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
// import { Eye, PenTool, Stamp, Lock } from "lucide-react";
// import {
//   Folder as FolderClosedIcon,
//   FolderOpen as FolderOpenIcon,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// import ParentFolderMenu from "./ParentFolderMenu";
// import FolderMenu from "./FolderMenu";
// import FileMenu from "./FileMenu";
// import {
//   FaFilePdf,
//   FaFileWord,
//   FaFileExcel,
//   FaFileImage,
//   FaFileAlt,
// } from "react-icons/fa";
// import axios from "axios";
// import { AiFillFileUnknown } from "react-icons/ai";
// import { DocusealForm } from "@docuseal/react";
// import { toast } from "material-react-toastify";
// import CancelIcon from "@mui/icons-material/Cancel";
// import DownloadIcon from "@mui/icons-material/Download";
// import DeleteIcon from "@mui/icons-material/Delete";
// import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
// import {accountsAPI,accountDocsAPI, invoiceAPI} from "../services/api"
// const DocsFolderTree = () => {
//   const [accountId, setAccountId] = useState(
//     sessionStorage.getItem("accountId")
//   );
//   const SIGNATURE_API = process.env.REACT_APP_ESIGNATURE_API;
//   console.log("acount id for the documentation", accountId);
//   const [error, setError] = useState("");
//   const FolderTreeView = ({ accountId }) => {
  
//     console.log("folder structure of account is", accountId);
//     const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
//     const [selectedInvoiceFile, setSelectedInvoiceFile] = useState(null);

//     const [expandedFolders, setExpandedFolders] = useState({});
//     const [menuAnchorEl, setMenuAnchorEl] = useState(null);
//     const [selectedFolderForMenu, setSelectedFolderForMenu] = useState(null);
//     const [newFolderDrawerOpen, setNewFolderDrawerOpen] = useState(null);
//     const [folderUploaDrawerOpen, setFolderUploaDrawerOpen] = useState(null);
//     const [renameDrawer, SetRenameDrawer] = useState(null);
//     const [fileUploadDrawerOpen, setFileUploadDrawerOpen] = useState(null);
//     const [moveDrawerOpen, setMoveDrawerOpen] = useState(null);

//     const [folderTree, setFolderTree] = useState([]);
//     // State for document approval dialog
//     const [openViewer, setOpenViewer] = useState(false);
//     const [selectedDoc, setSelectedDoc] = useState(null);
//     const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
//     const [cancelReason, setCancelReason] = useState("");
//     const [adminUserId, setAdminUserId] = useState("");
//     const [accountName, setAccountName] = useState("");

//     // console.log("hgjhg",data)
//     const [selectedItems, setSelectedItems] = useState(new Set());
//     const [selectAll, setSelectAll] = useState(false);

//     // State for bulk operations
//     const [bulkMoveDrawerOpen, setBulkMoveDrawerOpen] = useState(false);

//     const [bulkOperationLoading, setBulkOperationLoading] = useState(false);

  

//   const handleTrashClick = () => {
//    navigate(`/trashDocs`);
//   };

//     const getAllChildrenPaths = (item) => {
//       const paths = [];

//       // ❌ Skip this item entirely if readOnly
//       if (item.meta?.readOnly) return paths;

//       paths.push(item.path);

//       if (item.children && item.children.length > 0) {
//         item.children.forEach((child) => {
//           paths.push(...getAllChildrenPaths(child));
//         });
//       }

//       return paths;
//     };

//     const handleSelectItem = (path) => {
//       setSelectedItems((prev) => {
//         const newSet = new Set(prev);
//         if (newSet.has(path)) {
//           newSet.delete(path);
//         } else {
//           newSet.add(path);
//         }
//         return newSet;
//       });
//     };
//     // Update handleFolderSelect
//     const handleFolderSelect = (item) => {
//       const allChildPaths = getAllChildrenPaths(item);

//       setSelectedItems((prev) => {
//         const newSet = new Set(prev);
//         const allSelected = allChildPaths.every((path) => newSet.has(path));

//         if (allSelected) {
//           allChildPaths.forEach((path) => newSet.delete(path));
//         } else {
//           allChildPaths.forEach((path) => newSet.add(path));
//         }
//         return newSet;
//       });
//     };

//     // Update isFolderPartiallySelected
//     const isFolderPartiallySelected = (item) => {
//       const allChildPaths = getAllChildrenPaths(item);
//       const selectedCount = allChildPaths.filter((path) =>
//         selectedItems.has(path)
//       ).length;
//       return selectedCount > 0 && selectedCount < allChildPaths.length;
//     };
//     // Update handleSelectAll
//     const handleSelectAll = () => {
//       if (selectAll) {
//         setSelectedItems(new Set());
//       } else {
//         const allPaths = new Set();
//         const collectPaths = (items) => {
//           items.forEach((item) => {
//             allPaths.add(item.path);
//             if (item.children && item.children.length > 0) {
//               collectPaths(item.children);
//             }
//           });
//         };
//         collectPaths(folderTree);
//         setSelectedItems(allPaths);
//       }
//       setSelectAll(!selectAll);
//     };

//     const fetchAccountDetails = async () => {
//       try {
//         const res = await accountsAPI.getAccountById(accountId);
//         setAccountName(res.data.accountName);
//         setAdminUserId(res.data.adminUserId.emailSyncEmail);
//       } catch (error) {
//         console.error("Error fetching account details:", error);
//       }
//     };

//     useEffect(() => {
     
//       fetchAccountDetails();
      
//     }, [accountId]);
//     // API call to fetch folder tree for a given template ID
//   const fetchFolderTree = async (accountId) => {
//   try {
//     const res = await accountDocsAPI.clientListFoldersAndFiles(accountId);
//     console.log("response", res);
    
//     // Axios response has data property directly
//     if (res.status === 200 || res.status === 200) {
//       // The actual data is in res.data
//       const responseData = res;
//       console.log("janavi patil", responseData.contents);
      
//       if (responseData.data?.contents) {
//         setFolderTree(responseData.data.contents);
//         // Check for pending approval documents
//         checkForPendingApprovals(responseData.data.contents);
//       } else {
//         setError("Failed to fetch folder tree: Invalid response structure");
//       }
//     } else {
//       setError("Failed to fetch folder tree");
//     }
//   } catch (err) {
//     console.error("Error fetching folder tree:", err);
//     setError("Error fetching folder tree: " + (err.message || "Unknown error"));
//   }
// };
//     // Function to check for pending approval documents in the folder tree
//     const checkForPendingApprovals = (treeItems) => {
//       const pendingApprovalFiles = [];

//       const traverseTree = (items) => {
//         items.forEach((item) => {
//           const meta = item.meta || {};

//           // Check if file has pendingApproval status and approvalId
//           if (
//             item.type === "file" &&
//             meta.authStatus === "pendingApproval" &&
//             meta.approvalId
//           ) {
//             // Construct file URL from the path
//             const fileUrl = `https://www.snptaxes.com/uploads/accounts/${accountId}/${item.path}`;

//             pendingApprovalFiles.push({
//               _id: meta.approvalId,
//               filename: item.name,
//               fileUrl: fileUrl,
//               description: meta.description || "",
//               path: item.path,
//             });
//           }

//           // Recursively check children
//           if (item.children && item.children.length > 0) {
//             traverseTree(item.children);
//           }
//         });
//       };

//       traverseTree(treeItems);

//       // If pending approval files found, open the first one
//       if (pendingApprovalFiles.length > 0) {
//         console.log("Found pending approval documents:", pendingApprovalFiles);
//         // You could show a notification or open the first document
//         // handleOpenViewer(pendingApprovalFiles[0]);
//       }

//       return pendingApprovalFiles;
//     };
//     useEffect(() => {
//       if (accountId) {
//         fetchFolderTree(accountId);
//       }
//     }, [accountId]);

//     const toggleFolder = (path, isReadOnly) => {
//       // if (isReadOnly) return;
//       setExpandedFolders((prev) => ({
//         ...prev,
//         [path]: !prev[path],
//       }));
//     };

//     const handleMenuOpen = (event, item) => {
//       event.stopPropagation();
//       setMenuAnchorEl(event.currentTarget);
//       // setSelectedFolderForMenu(folder);
//       // Check if it's the specific "Client Uploaded Documents" folder
//       const isClientUploadedDocs =
//         item.name?.toLowerCase() === "client uploaded documents";
//       // Set the item with proper type information
//       setSelectedFolderForMenu({
//         ...item,
//         isFile: item.type === "file",
//         isFolder: item.type === "folder",
//         // Check if it's a parent folder (root level)
//         // isParent: !item.path.includes('/') && item.type === 'folder'
//         isParent:
//           (!item.path.includes("/") && item.type === "folder") ||
//           isClientUploadedDocs,
//       });
//     };

//     const handleMenuClose = () => {
//       setMenuAnchorEl(null);
//     };
//     // Toggle read/unread
//     const toggleReadStatus = (item) => {
//       const newValue = !(item.meta?.readStatus || false);
//       updateStatus(item, "readStatus", newValue);
//       // console.log("kujaki janavi", item.path);
//     };
//     const SIGN_STATUSES = [
//       "sendForSignature",
//       "pendingSignature",
//       "signatureCompleted",
//     ];
//     const APPROVAL_STATUSES = [
//       "sendForApproval",
//       "pendingApproval",
//       "canceledApproval",
//       "approvalCompleted",
//     ];
//     // 🔹 Frontend: Update any status (read, sign, approval)
//     const updateStatus = async (
//       item,
//       statusType,
//       newValue,
//       action,
//       reason = ""
//     ) => {
//       try {
//         if (!item?.path) return alert("Invalid item selected");

//         const body = {
//           targetPath: item.path,
//           status: {
//             [statusType]: newValue, // dynamic key
//             ...(action === "cancel" && reason ? { cancelReason: reason } : {}),
//           },
//         };

//  const res = await accountDocsAPI.updateStatus(body);
//         const data = await res.json();

//         if (res.ok) {
//           alert(data.message || "Status updated successfully");
//            // refresh folder tree to reflect change
//         } else {
//           alert(data.error || "Failed to update status");
//         }
//       } catch (err) {
//         console.error("Error updating status:", err);
//         alert("Error updating status");
//       }
//     };

//    const toggleReadOnly = async (item) => {
//   try {
//     const newStatus = !item.meta.readOnly;

//     const body =
//       item.type === "folder"
//         ? { folderPath: item.path, readOnly: newStatus }
//         : { filePath: item.path, readOnly: newStatus };

//     // ✅ Use API service instead of fetch
//     const apiCall =
//       item.type === "folder"
//         ? accountDocsAPI.setFolderReadOnly
//         : accountDocsAPI.setFileReadOnly;

//     const res = await apiCall(body);

//     const data = res.data;

//     if (res.status === 200 || res.status === 201) {
//       fetchFolderTree(accountId);

//       // 🗂️ Collapse folder if it’s locked
//       if (item.type === "folder" && newStatus) {
//         setExpandedFolders((prev) => {
//           const updated = { ...prev };
//           delete updated[item.path];
//           return updated;
//         });
//       }

//       handleMenuClose();
//       alert(data.message || "Updated successfully");
//     } else {
//       alert("Error: " + (data.message || "Something went wrong"));
//     }
//   } catch (err) {
//     console.error(err);
//     alert("Failed to update read-only status");
//   }
// };

// const handleBulkTrash = async () => {
//   if (selectedItems.size === 0) {
//     toast.warning("Please select items to move to trash");
//     return;
//   }

//   const confirmTrash = window.confirm(
//     `Are you sure you want to move ${selectedItems.size} item(s) to trash?`
//   );
//   if (!confirmTrash) return;

//   setBulkOperationLoading(true);

//   try {
//     const paths = Array.from(selectedItems);

//     const res = await accountDocsAPI.bulkTrashItems({
//       targetPaths: paths,
//       trashedBy: "Client",
//     });

//     const data = res.data;

//     console.log("Bulk trash response:", data);

//     if (data.success) {
//       toast.success(
//         `${data.trashedItems.length} item(s) moved to trash successfully`
//       );

//       if (data.failedItems?.length > 0) {
//         toast.warning(`${data.failedItems.length} item(s) failed`);
//         console.log("Failed trash items:", data.failedItems);
//       }

//       setSelectedItems(new Set());
//       fetchFolderTree(accountId);
//     } else {
//       toast.error(data.message || "Failed to trash items");
//     }
//   } catch (err) {
//     console.error("Bulk trash error:", err);
//     toast.error("Error moving items to trash: " + err.message);
//   } finally {
//     setBulkOperationLoading(false);
//   }
// };
//    const handleBulkDownload = async () => {
//   if (selectedItems.size === 0) {
//     toast.warning("Please select items to download");
//     return;
//   }

//   setBulkOperationLoading(true);

//   try {
//     const paths = Array.from(selectedItems);

//     const res = await accountDocsAPI.downloadItems({
//       paths,
//     });

//     const blob = res.data;
//     const url = window.URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `selected_items_${Date.now()}.zip`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();

//     window.URL.revokeObjectURL(url);

//     toast.success("Download started");
//   } catch (err) {
//     console.error("Bulk download error:", err);
//     toast.error("Failed to download items");
//   } finally {
//     setBulkOperationLoading(false);
//   }
// };
   

// const trashItem = async (item) => {
//   if (!item?.path) return alert("Invalid path");

//   const confirmTrash = window.confirm(
//     `Are you sure you want to move "${item.name}" to Trash?`
//   );
//   if (!confirmTrash) return;

//   try {
//     const res = await accountDocsAPI.trashItem({
//       targetPath: item.path,
//       trashedBy: "Client",
//     });

//     const data = res.data;

//     if (data.success) {
//       toast.success(data.message || "Moved to trash");

//       setTimeout(() => {
//         fetchFolderTree(accountId);
//       }, 500);
//     } else {
//       toast.error(data.message || "Failed to move to trash");
//     }
//   } catch (err) {
//     console.error("Error trashing item:", err);
//     toast.error("Error moving item to trash");
//   }

//   handleMenuClose();
// };
//  const handleDownloadFile = async (item) => {
//   console.log("Downloading file:", item);

//   try {
//     const res = await accountDocsAPI.downloadItems({
//       paths: item.path,
//     });

//     const blob = res.data;
//     const url = window.URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = item.name || "download";
//     document.body.appendChild(a);
//     a.click();
//     a.remove();

//     window.URL.revokeObjectURL(url);
//   } catch (err) {
//     console.error("Download error:", err);
//   }
// };
   
//     const targetEmail = sessionStorage.getItem("email");
//     const [selectedSlug, setSelectedSlug] = useState(null);
//     const [dialogOpen, setDialogOpen] = useState(false);
//     // Function to open the signature dialog
//     const openSignatureDialog = (slug) => {
//       setSelectedSlug(slug);
//       setDialogOpen(true);
//     };

//     // Function to close the dialog
//     const handleCloseDialog = () => {
//       setDialogOpen(false);
//       setSelectedSlug(null);
//     };
    
//    const fetchInvoicesByIds = async (ids = []) => {
//   try {
//     if (!ids.length) return [];

//     const fetchPromises = ids.map((id) =>
//       invoiceAPI.getInvoiceListById(id)
//     );

//     const results = await Promise.all(fetchPromises);

//     const invoices = results
//       .map((res) => res.data)
//       .filter((result) => result?.invoice)
//       .map((result) => {
//         const inv = result.invoice;

//         const lineItems = (inv.lineItems || []).map((item) => ({
//           productName: item.productorService || "",
//           description: item.description || "",
//           rate: String(item.rate || "0.00"),
//           qty: String(item.quantity || "1"),
//           amount: String(item.amount || "0.00"),
//           tax: item.tax || false,
//           isDiscount: item.isDiscount || false,
//         }));

//         return {
//           _id: inv._id,
//           invoicenumber: inv.invoicenumber,
//           invoicedate: inv.invoicedate,
//           account: inv.account
//             ? { value: inv.account._id, label: inv.account.accountName }
//             : null,
//           invoicetemplate: inv.invoicetemplate
//             ? {
//                 value: inv.invoicetemplate._id,
//                 label: inv.invoicetemplate.templatename,
//               }
//             : null,
//           paymentMethod: {
//             value: inv.paymentMethod,
//             label: inv.paymentMethod,
//           },
//           teammember: inv.teammember
//             ? { value: inv.teammember._id, label: inv.teammember.username }
//             : null,
//           description: inv.description,
//           emailToClient: inv.emailinvoicetoclient,
//           scheduledInvoice: inv.scheduleinvoice,
//           payInvoiceWithCredits: inv.payInvoicewithcredits,
//           isEmailInvoice: inv.emailinvoicetoclient,
//           reminders: inv.reminders,
//           lineItems,
//           summary: inv.summary || {},
//         };
//       });

//     return invoices;
//   } catch (error) {
//     console.error("Error fetching invoices:", error);
//     return [];
//   }
// };
//     const navigate = useNavigate();

//     const handlePayInvoice = () => {
//       if (!selectedInvoiceFile?.meta?.invoices?.length) return;

//       navigate("/payinvoice", {
//         state: {
//           selectedInvoices: selectedInvoiceFile.meta.invoices,
//           accountName: accountName, // Replace with dynamic account name if available
//         },
//       });
//     };
//     const handleFileClick = async (fullPath, fileName, meta = {}) => {
//       console.log("file clicked", fullPath, fileName, meta);
//       try {
//         if (
//           meta.newTags?.some((tag) => tag.isSystemTag && tag.tagName === "New")
//         ) {
//            await accountDocsAPI.removeNewTag({
//     filePath: fullPath,
//   });

//           // 🔄 REFRESH folder tree so parent tags update
//           await fetchFolderTree(accountId);
//         }
//         // 🔒 Handle locked invoices
//         if (meta.invoiceLock?.length) {
//           // Fetch full invoices by IDs
//           const invoices = await fetchInvoicesByIds(meta.invoiceLock);

//           if (!invoices.length) {
//             alert("Failed to fetch invoice details.");
//             return;
//           }

//           // Save for dialog
//           setSelectedInvoiceFile({
//             path: fullPath,
//             name: fileName,
//             meta: {
//               ...meta,
//               invoices, // Attach the full invoice objects here
//             },
//           });

//           setInvoiceDialogOpen(true);
//           return;
//         }
//         // Check if this is a pending approval document
//         if (meta.authStatus === "pendingApproval" && meta.approvalId) {
//           fetApprovalDetails(meta.approvalId);
//           return;
//         }

//         // Check if this is a pending e-signature document
//         if (meta.esignRequestId && meta.signStatus === "pendingSignature") {
//           try {
//             const response = await fetch(
//               `https://www.snptaxes.com/signature/byid/${meta.esignRequestId}`,
//               {
//                 method: "GET",
//                 redirect: "follow",
//               }
//             );
//             const result = await response.json();
//             console.log("Signature details:", result);

//             // Assuming result is the full submission object
//             const submission = result;
//             console.log("Full Submission:", submission);

//             // Check if submission has submitters array
//             if (
//               !submission.submitters ||
//               !Array.isArray(submission.submitters)
//             ) {
//               console.error("No submitters array found in response");
//               alert("Error loading signature request: Invalid data structure");
//               return;
//             }

//             // Find matching submitters for the current user
//             const matchingSubmitters = submission.submitters
//               .map((s) => ({
//                 slug: s.slug,
//                 email: s.email,
//                 submissionId: s.submission_id,
//                 templateName: s.name,
//                 createdAt: submission.createdAt,
//                 fileUrl: submission.fileUrl,
//                 externalId: submission.externalId,
//                 submissionData: submission,
//                 status: s.status,
//                 completed_at: s.completed_at,
//                 role: s.role,
//                 allCompleted: submission.submitters.every(
//                   (submitter) =>
//                     submitter.status === "completed" ||
//                     submitter.completed_at !== null
//                 ),
//               }))
//               .filter((s) => s.email === targetEmail && !s.completed_at);

//             console.log("Matching Submitters:", matchingSubmitters);

//             // If we found matching submitters, open the dialog with the first one
//             if (matchingSubmitters.length > 0) {
//               // Get the first matching submitter's slug
//               const firstSlug = matchingSubmitters[0].slug;
//               console.log("Opening signature dialog with slug:", firstSlug);
//               openSignatureDialog(firstSlug);
//             } else {
//               // Check why no matches were found
//               const userSubmitters = submission.submitters.filter(
//                 (s) => s.email === targetEmail
//               );
//               if (userSubmitters.length > 0) {
//                 // User exists but has already completed
//                 const completedSubmitter = userSubmitters[0];
//                 if (completedSubmitter.completed_at) {
//                   alert("You have already signed this document.");
//                   // Open the document after alert
//                   setTimeout(() => {
//                     openDocument(fullPath, fileName);
//                   }, 500);
//                 } else {
//                   alert(
//                     "You are not authorized to sign this document at this time."
//                   );
//                 }
//               } else {
//                 alert("You are not listed as a signer for this document.");
//               }
//             }
//           } catch (error) {
//             console.error("Error fetching signature details:", error);
//             alert("Error loading signature request.");
//           }
//           return;
//         }

//         // 🔒 Prevent opening locked files
//         if (meta.readOnly) {
//           alert("This file is locked and cannot be opened.");
//           return;
//         }

//         // ✅ Open the document (for non-signature files or if user has already signed)
//         openDocument(fullPath, fileName);
//       } catch (error) {
//         console.error("Error opening/downloading file:", error);
//       }
//     };

//     // Helper function to open/download document
//     const openDocument = (fullPath, fileName) => {
//       try {
//         // ✅ Construct full file URL
//         const fileUrl = `${process.env.REACT_APP_FOLDER_MANAGEMENT}/uploads/accounts/${fullPath}`;
//         console.log("Opening document:", fileUrl);

//         // ✅ Detect file extension (case-insensitive)
//         const fileExt = fileName.split(".").pop().toLowerCase();

//         // ✅ Extensions that can open in browser
//         const viewableExtensions = ["pdf", "jpg", "jpeg", "png", "gif", "txt"];

//         if (viewableExtensions.includes(fileExt)) {
//           // Open supported file types in a new tab
//           window.open(fileUrl, "_blank", "noopener,noreferrer");
//         } else {
//           // Force download for unsupported types (e.g., docx, xlsx, zip, etc.)
//           const link = document.createElement("a");
//           link.href = fileUrl;
//           link.download = fileName;
//           document.body.appendChild(link);
//           link.click();
//           document.body.removeChild(link);
//         }
//       } catch (error) {
//         console.error("Error opening document:", error);
//         alert("Error opening document. Please try again.");
//       }
//     };

//     const fetApprovalDetails = async (id) => {
//   try {
//     const res = await accountDocsAPI.getApprovalById(id);

//     const data = res.data;

//     console.log("Approval Data:", data);

//     setSelectedDoc(data.approval);
//     setOpenViewer(true);

//     return data;
//   } catch (error) {
//     console.error("Error fetching approval:", error);
//     return null;
//   }
// };

//     // Function to handle approval actions
//     const handleApprovalAction = async (id, action, reason = "") => {
//       try {
//         console.log("Sending approval request:", {
//           id,
//           action,
//           description: reason,
//           accountId,
//           adminUserId,
//         });

//         // This is your existing approval endpoint
//         // const res = await axios.patch(
//         //   `${DOCS_MANAGMENTS}/approvals/client-approvals/${id}`,
//         //   {
//         //     action,
//         //     description: reason,
//         //     accountId,
//         //     adminUserId,
//         //   }
//         // );

//          // ✅ Use API service instead of axios.patch
//     const res = await accountDocsAPI.handleClientApproval(id, {
//       action,
//       description: reason,
//       accountId,
//       adminUserId,
//     });
//         console.log("✅ Approval response:", res.data);

//         let originalPath = "";
//         if (selectedDoc?.fileUrl) {
//           const splitPath = selectedDoc.fileUrl.split("/uploads/accounts/");
//           if (splitPath.length > 1) {
//             originalPath = splitPath[1]; // FULL path including file name
//           }
//           console.log("📌 Original document path:", originalPath);
//         }

//         // Status change
//         const newStatus =
//           action === "approve" ? "approvalCompleted" : "canceledApproval";

//         // Update status directly using original file path
//         await updateStatus(
//           { path: originalPath },
//           "authStatus",
//           newStatus,
//           action,
//           cancelReason
//         );
//         // Cleanup UI
//         setOpenViewer(false);
//         setCancelDialogOpen(false);
//         setCancelReason("");

//         // Refresh the folder tree to update status
//         fetchFolderTree(accountId);
//       } catch (error) {
//         console.error(`❌ Error performing ${action} approval:`, error);
//         if (error.response)
//           console.error("Response data:", error.response.data);
//       }
//     };

//     const handleCloseViewer = () => {
//       setOpenViewer(false);
//       setSelectedDoc(null);
//     };

//     const handleCancelClick = () => {
//       setCancelDialogOpen(true);
//     };

//     const confirmCancel = () => {
//       if (selectedDoc) {
//         handleApprovalAction(selectedDoc._id, "cancel", cancelReason);
//       }
//     };
//     const getFileIcon = (fileName) => {
//       const ext = fileName.split(".").pop().toLowerCase();

//       switch (ext) {
//         case "pdf":
//           return <FaFilePdf color="#d32f2f" size={18} />;
//         case "jpg":
//         case "jpeg":
//         case "png":
//         case "gif":
//           return <FaFileImage color="#1976d2" size={18} />;
//         case "doc":
//         case "docx":
//           return <FaFileWord color="#1565c0" size={18} />;
//         case "xls":
//         case "xlsx":
//           return <FaFileExcel color="#2e7d32" size={18} />;
//         case "txt":
//         case "md":
//           return <FaFileAlt color="#616161" size={18} />;
//         default:
//           return <AiFillFileUnknown color="#757575" size={18} />;
//       }
//     };
//     const INVOICE_LOCK_STATUSES = ["pendingpayment", "paymentcompleted"];

//     const invoiceStatusTextMap = {
//       pendingpayment: "Pending Payment",
//       paymentcompleted: "Payment Completed",
//     };
//     const approvalStatusTextMap = {
//       sendForApproval: "Send for Approval",
//       pendingApproval: "Waiting for Approval",
//       canceledApproval: "canceledApproval",
//       approvalCompleted: "Approval Completed",
//     };
//     const statusTextMap = {
//       sendForSignature: "Send for Sign",
//       pendingSignature: "Waiting for Signature",
//       signatureCompleted: "Signature Received",
//     };

//     const formatUploadedAt = (dateValue) => {
//       if (!dateValue) return "";

//       // If already in "DEC-19 2025" format
//       if (
//         typeof dateValue === "string" &&
//         /^[A-Z]{3}-\d{2} \d{4}$/.test(dateValue)
//       ) {
//         return dateValue;
//       }

//       const date = new Date(dateValue);
//       if (isNaN(date)) return dateValue;

//       return date
//         .toLocaleDateString("en-US", {
//           month: "short",
//           day: "2-digit",
//           year: "numeric",
//         })
//         .toUpperCase()
//         .replace(",", "") // remove comma
//         .replace(" ", "-"); // replace first space with dash
//     };

//     const UploadedInfo = ({ meta }) => {
//       if (!meta?.uploadedAt) return null;

//       return (
//         <Typography variant="caption" sx={{ fontWeight: "bold" }}>
//           {formatUploadedAt(meta.uploadedAt)}
//         </Typography>
//       );
//     };
  
//     const getStatusChip = (meta, isFolder) => {
//       // Return null for folders - don't show status chips for folders
//       if (isFolder) return null;

//       const chips = [];

//       // ======= SIGNATURE STATUS =======
//       if (SIGN_STATUSES.includes(meta.signStatus)) {
//         let color = "default";

//         if (meta.signStatus === "pendingSignature") color = "warning";
//         if (meta.signStatus === "signatureCompleted") color = "success";

//         chips.push(
//           <Chip
//             key="signChip"
//             label={statusTextMap[meta.signStatus]}
//             size="small"
//             variant="outlined"
//             color={color}
//           />
//         );
//       }

//       // ======= APPROVAL STATUS =======
//       if (APPROVAL_STATUSES.includes(meta.authStatus)) {
//         let color = "default";
//         let chip;

//         if (meta.authStatus === "pendingApproval") color = "warning";
//         if (meta.authStatus === "approvalCompleted") color = "success";
//         if (meta.authStatus === "canceledApproval") color = "error";

//         if (meta.authStatus === "canceledApproval" && meta.cancelReason) {
//           chip = (
//             <Tooltip title={meta.cancelReason} placement="top-end">
//               <Chip
//                 key="approvalCanceledChip"
//                 label="Approval Canceled"
//                 size="small"
//                 variant="outlined"
//                 color="error"
//                 sx={{ cursor: "pointer" }}
//               />
//             </Tooltip>
//           );
//         } else {
//           chip = (
//             <Chip
//               key="approvalChip"
//               label={approvalStatusTextMap[meta.authStatus]}
//               size="small"
//               variant="outlined"
//               color={color}
//             />
//           );
//         }

//         chips.push(chip);
//       }

//       // ======= INVOICE LOCK STATUS =======
//       if (INVOICE_LOCK_STATUSES.includes(meta.lockInvoiceStatus)) {
//         let color = "default";
//         if (meta.lockInvoiceStatus === "pendingpayment") color = "warning";
//         if (meta.lockInvoiceStatus === "paymentcompleted") color = "success";

//         chips.push(
//           <Chip
//             key="invoiceLockChip"
//             label={invoiceStatusTextMap[meta.lockInvoiceStatus]}
//             size="small"
//             variant="outlined"
//             color={color}
//           />
//         );
//       }

//       // ======= SHOW NOTHING IF NO STATUS =======
//       if (chips.length === 0) return null;

//       return <Box sx={{ display: "flex", gap: 1 }}>{chips}</Box>;
//     };
//     const findNewSystemTag = (item) => {
//       console.log("Finding 'New' tag in item:", item);
//       // Check current item
//       const newTag = item.meta?.newTags?.find(
//         (tag) => tag.isSystemTag && tag.tagName === "New"
//       );

//       if (newTag) return newTag;

//       // Check children recursively
//       if (item.children && item.children.length > 0) {
//         for (const child of item.children) {
//           const childTag = findNewSystemTag(child);
//           if (childTag) return childTag;
//         }
//       }

//       return null;
//     };
//     const renderTableRows = (
//       items,
//       level = 0,
//       parentPath = "",
//       isInsideRestricted = false
//     ) => {
//         // 🔥 Sort: folders first, then files
//   const sortedItems = [...items].sort((a, b) => {
//     if (a.type === "folder" && b.type !== "folder") return -1;
//     if (a.type !== "folder" && b.type === "folder") return 1;

//     // Optional: sort alphabetically inside same type
//     return a.name.localeCompare(b.name);
//   });

//   return sortedItems.map((item) => {
//       // return items.map((item) => {
//         console.log("itemlist", item);
//         // const fullPath = parentPath ? `${parentPath}/${item.name}` : item.name;
//         const fullPath = item.path;
//         const meta = item.meta || {};
//         const isFolder = item.type === "folder";
//         const isSelected = selectedItems.has(fullPath);

//         const restrictedFolderName = "firm documents shared with client";

//         const isRootFolder = level === 0 && isFolder;

//         const isFirmDocsRoot =
//           isRootFolder &&
//           item.name?.toLowerCase() === restrictedFolderName.toLowerCase();

//         const insideRestricted = isInsideRestricted || isFirmDocsRoot;

//         // same meaning as renderTree
//         const hideMenu = insideRestricted;
//         // Update the helper function to use item.path for children
//         const getAllChildrenPaths = (item) => {
//           const paths = [item.path];
//           if (item.children && item.children.length > 0) {
//             item.children.forEach((child) => {
//               paths.push(...getAllChildrenPaths(child));
//             });
//           }
//           return paths;
//         };

//         // Update isFolderPartiallySelected to use item.path
//         const isPartiallySelected = isFolder
//           ? isFolderPartiallySelected(item)
//           : false;
//         const handleSafeFileClick = () => {
//           if (meta.readOnly) {
//             alert("This file is locked and cannot be opened.");
//             return;
//           }
//           if (!isFolder) {
//             handleFileClick(fullPath, item.name, meta);
//           }
//         };
//         const inheritedNewTag = isFolder ? findNewSystemTag(item) : null;
//         return (
//           <React.Fragment key={fullPath}>
//             <TableRow
//               className={isFolder ? "folder-row" : ""}
//               sx={{
//                 bgcolor: isSelected ? "#b2d8ff" : "transparent",
//                 borderRadius: 1,
//                 mb: 0.5,
//                 cursor: item.meta?.readOnly ? "not-allowed" : "pointer",

//                 "&:hover": {
//                   bgcolor: "#b2d8ff",
//                 },
//               }}
//             >
//               {/* Checkbox Column - Only checkboxes here */}
//               <TableCell sx={{ width: "50px", paddingLeft: 2 }}>
//                 {isFolder ? (
//                   <Checkbox
//                     size="small"
//                     checked={isSelected}
//                     indeterminate={isPartiallySelected}
//                     // onChange={() => handleFolderSelect(item)}
//                     // disabled={insideRestricted} // ✅ disable
//                     disabled={insideRestricted || meta.readOnly}
//                     onChange={() => {
//                       if (insideRestricted || meta.readOnly) return; // ✅ block selection
//                       handleFolderSelect(item);
//                     }}
//                   />
//                 ) : (
//                   <Checkbox
//                     size="small"
//                     checked={isSelected}
//                     // onChange={() => handleSelectItem(fullPath)}
//                     disabled={insideRestricted || meta.readOnly} // ✅ disable
//                     onChange={() => {
//                       if (insideRestricted || meta.readOnly) return; // ✅ block selection
//                       handleSelectItem(fullPath);
//                     }}
//                   />
//                 )}
//               </TableCell>

//               {/* Name Column with indentation */}
//               <TableCell sx={{ paddingLeft: level * 4 + 2 }}>
//                 <Box sx={{ display: "flex", alignItems: "center" }}>
//                   {isFolder ? (
//                     <>
//                       <IconButton
//                         size="small"
//                         onClick={() => toggleFolder(fullPath, meta.readOnly)}
//                         disabled={meta.readOnly}
//                         sx={{ mr: 0.5 }}
//                       >
//                         {expandedFolders[fullPath] ? (
//                           <FolderOpenIcon color="#1976d2" />
//                         ) : (
//                           <FolderClosedIcon color="#757575" />
//                         )}
//                       </IconButton>
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           ml: 0.5,
//                           fontWeight: "medium",
//                           color: meta.readOnly ? "#999" : "inherit",
//                           cursor: "pointer",
//                         }}
//                         onClick={() => toggleFolder(fullPath, meta.readOnly)}
//                       >
//                         {item.name}
//                         {inheritedNewTag && (
//                           <Chip
//                             label={inheritedNewTag.tagName}
//                             size="small"
//                             color="success"
//                             sx={{
//                               backgroundColor: inheritedNewTag.tagColour,
//                               // color: "#fff",
//                               height: 18,
//                               fontSize: "0.7rem",
//                               ml: 0.8,
//                             }}
//                           />
//                         )}
//                         {meta.readOnly && (
//                           <Typography
//                             component="span"
//                             variant="caption"
//                             sx={{ color: "error.main", ml: 1 }}
//                           >
//                             (Locked)
//                           </Typography>
//                         )}
//                       </Typography>
//                     </>
//                   ) : (
//                     <>
//                       <Box sx={{ mr: 1 }}>{getFileIcon(item.name)}</Box>
//                       <Box sx={{ display: "flex", flexDirection: "column" }}>
//                         <Typography
//                           variant="body2"
//                           sx={{
//                             color: meta.readOnly ? "#999" : "#1976d2",
//                             textDecoration: meta.readOnly
//                               ? "none"
//                               : "underline",
//                             cursor: meta.readOnly ? "not-allowed" : "pointer",
//                           }}
//                           onClick={handleSafeFileClick}
//                         >
//                           {item.name}
//                           {meta.newTags?.map((tag, index) => (
//                             <Chip
//                               key={index}
//                               label={tag.tagName}
//                               size="small"
//                               color="success"
//                               sx={{
//                                 backgroundColor: tag.tagColour,
//                                 // color: "#fff",
//                                 height: 18,
//                                 fontSize: "0.7rem",
//                                 ml: 2,
//                               }}
//                             />
//                           ))}
//                         </Typography>

//                         {/* Status chips for files only */}
//                       </Box>
//                     </>
//                   )}
//                 </Box>
//               </TableCell>
//               <TableCell>
//                 <Box sx={{ mt: 0.5 }}>{getStatusChip(meta, isFolder)}</Box>
//               </TableCell>

//               {/* Last Modified Column */}
//               <TableCell>
//                 <UploadedInfo meta={meta} />
//               </TableCell>
//               <TableCell>
//                 <Typography variant="caption" sx={{ fontWeight: "bold" }}>
//                   {meta.uploadedBy}
//                 </Typography>
//               </TableCell>

//               <TableCell align="right">
//                 {!hideMenu && (
//                   <IconButton
//                     size="small"
//                     onClick={(e) => handleMenuOpen(e, { ...item, fullPath })}
//                   >
//                     <MoreVertIcon />
//                   </IconButton>
//                 )}
//               </TableCell>
//             </TableRow>

//             {/* Render children if folder is expanded */}
//             {isFolder &&
//               expandedFolders[fullPath] &&
//               item.children &&
//               item.children.length > 0 &&
//               renderTableRows(
//                 item.children,
//                 level + 1,
//                 fullPath,
//                 insideRestricted
//               )}
//           </React.Fragment>
//         );
//       });
//     };

//     return (
//       <Box sx={{ margin: "auto", p: 3 }}>
//         {/* Action Buttons */}
//         <Box sx={{ p: 3, maxWidth: "1000px", mx: "auto" }}>
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: { xs: "column", sm: "row" },
//               gap: 1,
//               maxWidth: "600px",
//               width: "100%",
//               mx: "auto",
//               my: 3,
//             }}
//           >
//             <Button
//               // variant="contained"
//               fullWidth
//               startIcon={<FolderIcon />}
//               onClick={() => {
//                 setNewFolderDrawerOpen(true);
//                 handleMenuClose();
//               }}
//               color="primary"
//               sx={{
//                 backgroundColor: "text.menu",
//                 color: "primary.contrastText",
//                 "&:hover": {
//                   backgroundColor: "menu.dark",
//                   boxShadow: 1,
//                 },
//                 transition: "background-color 0.2s ease",
//               }}
//             >
//               Create Folder
//             </Button>

//             <Button
//               // variant="contained"
//               fullWidth
//               startIcon={<UploadFileIcon />}
//               onClick={() => setFileUploadDrawerOpen(true)}
//               color="primary"
//               sx={{
//                 backgroundColor: "text.menu",
//                 color: "primary.contrastText",
//                 "&:hover": {
//                   backgroundColor: "menu.dark",
//                   boxShadow: 1,
//                 },
//                 transition: "background-color 0.2s ease",
//               }}
//             >
//               Upload File
//             </Button>

//             <Button
//               // variant="contained"
//               fullWidth
//               startIcon={<DriveFolderUploadIcon />}
//               onClick={() => setFolderUploaDrawerOpen(true)}
//               color="primary"
//               sx={{
//                 backgroundColor: "text.menu",
//                 color: "primary.contrastText",
//                 "&:hover": {
//                   backgroundColor: "menu.dark",
//                   boxShadow: 1,
//                 },
//                 transition: "background-color 0.2s ease",
//               }}
//             >
//               Upload Folder
//             </Button>

//               <Button
//             fullWidth
//             startIcon={<DeleteIcon />}
//             onClick={handleTrashClick}
//             color="error"
//             sx={{
//               backgroundColor: "error.main",
//               color: "white",
//               "&:hover": {
//                 backgroundColor: "error.dark",
//                 boxShadow: 1,
//               },
//               transition: "background-color 0.2s ease",
//             }}
//           >
//             View Trash
//           </Button>
//           </Box>

//           {selectedItems.size > 0 && (
//             <Paper
//               elevation={2}
//               sx={{
//                 p: 2,
//                 mb: 3,
//                 // bgcolor: "#e3f2fd",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 flexWrap: "wrap",
//                 gap: 1,
//               }}
//             >
//               <Typography variant="subtitle1" fontWeight="bold">
//                 {selectedItems.size} item(s) selected
//               </Typography>

//               <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
//                 {/* <Button
//                   variant="contained"
//                   size="small"
//                   startIcon={<DriveFileMoveIcon />}
//                   onClick={() => setBulkMoveDrawerOpen(true)}
//                   disabled={bulkOperationLoading}
//                 >
//                   Move
//                 </Button>
                
//                 <Button
//                   variant="contained"
//                   size="small"
//                   startIcon={<LockIcon />}
//                   onClick={() => setBulkLockDialogOpen(true)}
//                   disabled={bulkOperationLoading}
//                 >
//                   Lock/Unlock
//                 </Button> */}
//                 <Button
//                   variant="contained"
//                   size="small"
//                   startIcon={<DriveFileMoveIcon />}
//                   onClick={() => setBulkMoveDrawerOpen(true)}
//                   disabled={bulkOperationLoading}
//                 >
//                   Move
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="secondary"
//                   size="small"
//                   startIcon={<DeleteIcon />}
//                   onClick={handleBulkTrash}
//                   disabled={bulkOperationLoading}
//                 >
//                   Delete
//                 </Button>

//                 <Button
//                   variant="contained"
//                   color="primary"
//                   size="small"
//                   startIcon={<DownloadIcon />}
//                   onClick={handleBulkDownload}
//                   disabled={bulkOperationLoading}
//                 >
//                   Download
//                 </Button>

//                 <Button
//                   variant="outlined"
//                   size="small"
//                   onClick={() => setSelectedItems(new Set())}
//                   disabled={bulkOperationLoading}
//                 >
//                   Clear Selection
//                 </Button>
//               </Box>
//             </Paper>
//           )}

//           {/* Drawers */}
//           <FileUploadDrawer
//             isOpen={fileUploadDrawerOpen}
//             onClose={() => setFileUploadDrawerOpen(false)}
//             folderTree={folderTree}
//             fetchFolderTree={() => fetchFolderTree(accountId)}
//             selectedFolderForMenu={selectedFolderForMenu}
//           />

//           <CreteFolderDrawer
//             isOpen={newFolderDrawerOpen}
//             onClose={() => {
//               setNewFolderDrawerOpen(false);
//             }}
//             accountId={accountId}
//             folderTree={folderTree}
//             fetchFolderTree={() => fetchFolderTree(accountId)}
//             selectedFolderForMenu={selectedFolderForMenu}
//           />

//           <FolderUploadDrawer
//             isOpen={folderUploaDrawerOpen}
//             onClose={() => setFolderUploaDrawerOpen(false)}
//             folderTree={folderTree}
//             fetchFolderTree={() => fetchFolderTree(accountId)}
//             selectedFolderForMenu={selectedFolderForMenu}
//           />

//           <MoveDrawer
//             isOpen={moveDrawerOpen}
//             onClose={() => {
//               setMoveDrawerOpen(false);
//             }}
//             folderTree={folderTree}
//             fetchFolderTree={() => fetchFolderTree(accountId)}
//             selectedFolderForMenu={selectedFolderForMenu}
//           />

//           <RenameDrawer
//             isOpen={renameDrawer}
//             onClose={() => {
//               SetRenameDrawer(false);
//             }}
//             folderTree={folderTree}
//             fetchFolderTree={() => fetchFolderTree(accountId)}
//             selectedFolderForMenu={selectedFolderForMenu}
//           />

//           <MoveDrawer
//             isOpen={bulkMoveDrawerOpen}
//             onClose={() => setBulkMoveDrawerOpen(false)}
//             folderTree={folderTree}
//             fetchFolderTree={fetchFolderTree}
//             // Bulk mode props
//             isBulkOperation={true}
//             selectedPaths={Array.from(selectedItems)} // Array of selected paths
//             onMoveComplete={(targetPath) => {
//               // Optional callback after successful move
//               console.log("Bulk move completed to:", targetPath);
//               setSelectedItems(new Set()); // Clear selection
//             }}
//           />
//         </Box>
//         {openViewer && (
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
//                 gap: 1,
//                 justifyContent: "space-between",
//               }}
//             >
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   gap: 2,
//                 }}
//               >
//                 <DescriptionIcon fontSize="small" sx={{ color: "#f0c000" }} />
//                 <Typography
//                   variant="subtitle1"
//                   sx={{ fontWeight: 600, flexGrow: 1 }}
//                   noWrap
//                 >
//                   {selectedDoc?.filename || "Document"}
//                 </Typography>

//                 {selectedDoc?.description && (
//                   <Tooltip
//                     title={selectedDoc.description}
//                     arrow
//                     placement="right"
//                   >
//                     <IconButton
//                       size="small"
//                       sx={{ color: "text.secondary" }}
//                       style={{ cursor: "pointer" }}
//                     >
//                       <WarningAmberIcon />
//                     </IconButton>
//                   </Tooltip>
//                 )}
//               </Box>
//               <Box>
//                 <IconButton onClick={handleCloseViewer}>
//                   <CloseIcon />
//                 </IconButton>
//               </Box>
//             </DialogTitle>

//             <DialogContent dividers sx={{ height: "80vh" }}>
//               {selectedDoc ? (
//                 <iframe
//                   src={selectedDoc.fileUrl}
//                   title={selectedDoc.filename}
//                   width="100%"
//                   height="100%"
//                   style={{ border: "none" }}
//                 />
//               ) : (
//                 <Typography variant="body2" color="text.secondary">
//                   No document selected
//                 </Typography>
//               )}
//             </DialogContent>

//             {selectedDoc && (
//               <DialogActions sx={{ justifyContent: "center", p: 2 }}>
//                 <Button
//                   variant="contained"
//                   color="success"
//                   onClick={() =>
//                     handleApprovalAction(selectedDoc._id, "approve")
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
//         )}

//         {/* Cancel Reason Dialog */}
//         <Dialog
//           open={cancelDialogOpen}
//           onClose={() => setCancelDialogOpen(false)}
//           fullWidth
//           maxWidth="sm"
//         >
//           <DialogTitle>Cancel Document Approval</DialogTitle>
//           <DialogContent>
//             <DialogContentText sx={{ mb: 2 }}>
//               Please provide a reason for cancelling this document approval:
//             </DialogContentText>
//             <Typography gutterBottom>Description</Typography>
//             <TextField
//               autoFocus
//               fullWidth
//               multiline
//               value={cancelReason}
//               onChange={(e) => setCancelReason(e.target.value)}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setCancelDialogOpen(false)}>Close</Button>
//             <Button
//               variant="contained"
//               color="error"
//               disabled={!cancelReason.trim()}
//               onClick={confirmCancel}
//             >
//               Submit
//             </Button>
//           </DialogActions>
//         </Dialog>

//         <Dialog
//           open={dialogOpen}
//           onClose={handleCloseDialog}
//           fullWidth
//           maxWidth="lg"
//         >
//           <DialogTitle>
//             Signing Form
//             <IconButton
//               aria-label="close"
//               onClick={handleCloseDialog}
//               sx={{
//                 position: "absolute",
//                 right: 8,
//                 top: 8,
//                 color: (theme) => theme.palette.grey[500],
//               }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>

//           <DialogContent dividers>
//             {selectedSlug && (
//               <DocusealForm
//                 src={`https://docuseal.com/s/${selectedSlug}`}
//                 email={targetEmail}
//                 onComplete={async (data) => {
//                   console.log("Post-sign data:", data);

//                   try {
//                     // 1️⃣ Update this specific submitter's status and replace document
//                     const updateSubmitterRes = await fetch(
//                       `${SIGNATURE_API}/signautrelist/update-submitter/${data.template.external_id}`,
//                       {
//                         method: "PATCH",
//                         headers: { "Content-Type": "application/json" },
//                         body: JSON.stringify({
//                           submitterEmail: targetEmail,
//                           submissionId: data.submission_id,
//                         }),
//                       }
//                     );

//                     const updateData = await updateSubmitterRes.json();

//                     if (updateData.success) {
//                       console.log("✅ Document replaced with latest signature");

//                       // 2️⃣ Check if ALL submitters have now completed
//                       if (updateData.allCompleted) {
//                         console.log(
//                           "🎉 All submitters have completed signing!"
//                         );

//                         // Extract parent folder path
//                         const fullPath = decodeURIComponent(
//                           updateData.esignRecord.fileUrl.split(
//                             "/uploads/accounts/"
//                           )[1]
//                         );
//                         console.log("Full file path:", fullPath);
//                         const parentFolderPath = fullPath
//                           .split("/")
//                           .slice(0, -1)
//                           .join("/");
//                         console.log("Parent folder path:", parentFolderPath);
//                         // 3️⃣ Update the final status only when ALL have signed
//                         await updateStatus(
//                           { path: fullPath },
//                           "signStatus",
//                           "signatureCompleted"
//                         );

//                         // 4️⃣ Notify admin
//                         await fetch(`${SIGNATURE_API}/notify-admin`, {
//                           method: "POST",
//                           headers: { "Content-Type": "application/json" },
//                           body: JSON.stringify({
//                             clientName: targetEmail,
//                             documentName: selectedSlug,
//                             message: "All parties have completed signing",
//                              accountId: accountId
//                           }),
//                         });

//                         alert(
//                           "All signatures completed! Document has been fully executed."
//                         );
//                       } else {
//                         console.log(
//                           `✅ You have signed. Document updated. Waiting for ${updateData.pendingCount} more signer(s).`
//                         );
//                         alert(
//                           `Thank you for signing! Document has been updated. Waiting for ${updateData.pendingCount} more signer(s) to complete.`
//                         );
//                       }
//                     } else {
//                       alert("Error updating signature status.");
//                     }
//                   } catch (err) {
//                     console.error("Error handling post-sign actions", err);
//                     alert("Error while updating sign status.");
//                   }

//                   handleCloseDialog();
//                   // Refresh the data
//                   // window.location.reload();
//                 }}
//               />
//             )}
//           </DialogContent>
//         </Dialog>

//         <Dialog
//           open={invoiceDialogOpen}
//           onClose={() => setInvoiceDialogOpen(false)}
//           fullWidth
//           maxWidth="sm"
//         >
//           <DialogTitle>Invoice Details</DialogTitle>
//           <DialogContent>
//             {selectedInvoiceFile?.meta?.invoices?.length ? (
//               <Table size="small">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Invoice Number</TableCell>
//                     <TableCell>Description</TableCell>
//                     <TableCell align="right">Amount</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {selectedInvoiceFile.meta.invoices.map((invoice) => (
//                     <TableRow key={invoice._id}>
//                       <TableCell>{invoice.invoicenumber}</TableCell>
//                       <TableCell>
//                         {invoice.description || "No description"}
//                       </TableCell>
//                       <TableCell align="right">
//                         ${invoice.summary?.total?.toFixed(2) || "0.00"}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             ) : (
//               <Typography>No invoices available for this file.</Typography>
//             )}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setInvoiceDialogOpen(false)}>Close</Button>
//             {selectedInvoiceFile?.meta?.invoices?.length > 0 && (
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handlePayInvoice}
//               >
//                 Pay
//               </Button>
//             )}
//           </DialogActions>
//         </Dialog>

//         {/* Folder Explorer */}
//         <Paper elevation={3} sx={{ p: 2 }}>
//           <Typography variant="h6" gutterBottom>
//             📜 Folder Explorer
//           </Typography>
         
//           {folderTree && folderTree.length > 0 ? (
//             <>
//               <TableContainer>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell sx={{ width: "50px" }}>
                        
//                       </TableCell>
//                       <TableCell>Name</TableCell>
//                       <TableCell>Status</TableCell>
//                       <TableCell>Uploaded</TableCell>
//                       <TableCell>User</TableCell>
//                       <TableCell align="right">Actions</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>{renderTableRows(folderTree)}</TableBody>
//                 </Table>
//               </TableContainer>

//               {/* Selected Items Summary */}
//               {selectedItems.size > 0 && (
//                 <Paper elevation={1} sx={{ p: 2, mt: 2 }}>
//                   <Typography variant="subtitle1">
//                     {selectedItems.size} item(s) selected
//                   </Typography>
//                 </Paper>
//               )}
//             </>
//           ) : (
//             <Typography sx={{ p: 2, textAlign: "center" }}>
//               Loading folder data...
//             </Typography>
//           )}
//         </Paper>

//         {selectedFolderForMenu ? (
//           selectedFolderForMenu.isParent ? (
//             // 📁 Parent Folder Menu
//             <ParentFolderMenu
//               anchorEl={menuAnchorEl}
//               open={Boolean(menuAnchorEl)}
//               onClose={handleMenuClose}
//               onCreateFolder={() => setNewFolderDrawerOpen(true)}
//             />
//           ) : selectedFolderForMenu.isFile ? (
//             // 📄 File Menu
//             <FileMenu
//               anchorEl={menuAnchorEl}
//               open={Boolean(menuAnchorEl)}
//               onClose={handleMenuClose}
//               selectedItem={selectedFolderForMenu}
//               onRename={() => SetRenameDrawer(true)}
//               onMove={() => setMoveDrawerOpen(true)}
//               accId={accountId}
//               onToggleReadStatus={toggleReadStatus}
//               onToggleReadOnly={toggleReadOnly}
//               onDelete={trashItem}
//               onDownload={handleDownloadFile}
//             />
//           ) : (
//             // 📂 Child Folder Menu
//             <FolderMenu
//               anchorEl={menuAnchorEl}
//               open={Boolean(menuAnchorEl)}
//               onClose={handleMenuClose}
//               selectedItem={selectedFolderForMenu}
//               onCreateFolder={() => setNewFolderDrawerOpen(true)}
//               onUploadFile={() => setFileUploadDrawerOpen(true)}
//               onUploadFolder={() => setFolderUploaDrawerOpen(true)}
//               onRename={() => SetRenameDrawer(true)}
//               onMove={() => setMoveDrawerOpen(true)}
//               onToggleReadStatus={toggleReadStatus}
//               onToggleReadOnly={toggleReadOnly}
//               onDelete={trashItem}
//             />
//           )
//         ) : null}
//       </Box>
//     );
//   };
//   return (
//     <Box sx={{ p: 3 }}>
//       <FolderTreeView accountId={accountId} />
//     </Box>
//   );
// };

// export default DocsFolderTree;


import React, { useState, useEffect, useContext } from "react";
import {
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
} from "@mui/icons-material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { Eye, PenTool, Stamp, Lock } from "lucide-react";
import {
  Folder as FolderClosedIcon,
  FolderOpen as FolderOpenIcon,
} from "lucide-react";
import { EllipsisVertical,Info,TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FileUploadDrawer from "./drawers/FileUploadDrawer";
import CreteFolderDrawer from "./drawers/CreteFolderDrawer";
import FolderUploadDrawer from "./drawers/FolderUploadDrawer";
import RenameDrawer from "./drawers/RenameDrawer";
import MoveDrawer from "./drawers/MoveDrawer";
import ParentFolderMenu from "./ParentFolderMenu";
import FolderMenu from "./FolderMenu";
import FileMenu from "./FileMenu";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
} from "react-icons/fa";
import axios from "axios";
import { AiFillFileUnknown } from "react-icons/ai";
import { DocusealForm } from "@docuseal/react";
import { toast } from "material-react-toastify";
import CancelIcon from "@mui/icons-material/Cancel";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import { accountsAPI, accountDocsAPI, invoiceAPI } from "../services/api";
import { X } from "lucide-react";

const DocsFolderTree = () => {
  const [accountId, setAccountId] = useState(
    sessionStorage.getItem("accountId")
  );
  const SIGNATURE_API = process.env.REACT_APP_ESIGNATURE_API;
  console.log("acount id for the documentation", accountId);
  const [error, setError] = useState("");
  
  const FolderTreeView = ({ accountId }) => {
    console.log("folder structure of account is", accountId);
    const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
    const [selectedInvoiceFile, setSelectedInvoiceFile] = useState(null);

    const [expandedFolders, setExpandedFolders] = useState({});
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [selectedFolderForMenu, setSelectedFolderForMenu] = useState(null);
    const [newFolderDrawerOpen, setNewFolderDrawerOpen] = useState(null);
    const [folderUploaDrawerOpen, setFolderUploaDrawerOpen] = useState(null);
    const [renameDrawer, SetRenameDrawer] = useState(null);
    const [fileUploadDrawerOpen, setFileUploadDrawerOpen] = useState(null);
    const [moveDrawerOpen, setMoveDrawerOpen] = useState(null);

    const [folderTree, setFolderTree] = useState([]);
    const [openViewer, setOpenViewer] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [adminUserId, setAdminUserId] = useState("");
    const [accountName, setAccountName] = useState("");

    const [selectedItems, setSelectedItems] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);
    const [bulkMoveDrawerOpen, setBulkMoveDrawerOpen] = useState(false);
    const [bulkOperationLoading, setBulkOperationLoading] = useState(false);

    const handleTrashClick = () => {
      navigate(`/trashDocs`);
    };

    const getAllChildrenPaths = (item) => {
      const paths = [];
      if (item.meta?.readOnly) return paths;
      paths.push(item.path);
      if (item.children && item.children.length > 0) {
        item.children.forEach((child) => {
          paths.push(...getAllChildrenPaths(child));
        });
      }
      return paths;
    };

    const handleSelectItem = (path) => {
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(path)) {
          newSet.delete(path);
        } else {
          newSet.add(path);
        }
        return newSet;
      });
    };

    const handleFolderSelect = (item) => {
      const allChildPaths = getAllChildrenPaths(item);
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        const allSelected = allChildPaths.every((path) => newSet.has(path));
        if (allSelected) {
          allChildPaths.forEach((path) => newSet.delete(path));
        } else {
          allChildPaths.forEach((path) => newSet.add(path));
        }
        return newSet;
      });
    };

    const isFolderPartiallySelected = (item) => {
      const allChildPaths = getAllChildrenPaths(item);
      const selectedCount = allChildPaths.filter((path) =>
        selectedItems.has(path)
      ).length;
      return selectedCount > 0 && selectedCount < allChildPaths.length;
    };

    const handleSelectAll = () => {
      if (selectAll) {
        setSelectedItems(new Set());
      } else {
        const allPaths = new Set();
        const collectPaths = (items) => {
          items.forEach((item) => {
            allPaths.add(item.path);
            if (item.children && item.children.length > 0) {
              collectPaths(item.children);
            }
          });
        };
        collectPaths(folderTree);
        setSelectedItems(allPaths);
      }
      setSelectAll(!selectAll);
    };

    const fetchAccountDetails = async () => {
      try {
        const res = await accountsAPI.getAccountById(accountId);
        setAccountName(res.data.accountName);
        setAdminUserId(res.data.adminUserId.emailSyncEmail);
      } catch (error) {
        console.error("Error fetching account details:", error);
      }
    };

    useEffect(() => {
      fetchAccountDetails();
    }, [accountId]);

    const fetchFolderTree = async (accountId) => {
      try {
        const res = await accountDocsAPI.clientListFoldersAndFiles(accountId);
        console.log("response", res);
        
        if (res.status === 200 || res.status === 200) {
          const responseData = res;
          console.log("janavi patil", responseData.contents);
          
          if (responseData.data?.contents) {
            setFolderTree(responseData.data.contents);
            checkForPendingApprovals(responseData.data.contents);
          } else {
            setError("Failed to fetch folder tree: Invalid response structure");
          }
        } else {
          setError("Failed to fetch folder tree");
        }
      } catch (err) {
        console.error("Error fetching folder tree:", err);
        setError("Error fetching folder tree: " + (err.message || "Unknown error"));
      }
    };

    const checkForPendingApprovals = (treeItems) => {
      const pendingApprovalFiles = [];
      const traverseTree = (items) => {
        items.forEach((item) => {
          const meta = item.meta || {};
          if (
            item.type === "file" &&
            meta.authStatus === "pendingApproval" &&
            meta.approvalId
          ) {
            const fileUrl = `https://www.snptaxes.com/uploads/accounts/${accountId}/${item.path}`;
            pendingApprovalFiles.push({
              _id: meta.approvalId,
              filename: item.name,
              fileUrl: fileUrl,
              description: meta.description || "",
              path: item.path,
            });
          }
          if (item.children && item.children.length > 0) {
            traverseTree(item.children);
          }
        });
      };
      traverseTree(treeItems);
      if (pendingApprovalFiles.length > 0) {
        console.log("Found pending approval documents:", pendingApprovalFiles);
      }
      return pendingApprovalFiles;
    };

    useEffect(() => {
      if (accountId) {
        fetchFolderTree(accountId);
      }
    }, [accountId]);

    const toggleFolder = (path, isReadOnly) => {
      setExpandedFolders((prev) => ({
        ...prev,
        [path]: !prev[path],
      }));
    };

    const handleMenuOpen = (event, item) => {
      event.stopPropagation();
      setMenuAnchorEl(event.currentTarget);
      const isClientUploadedDocs =
        item.name?.toLowerCase() === "client uploaded documents";
      setSelectedFolderForMenu({
        ...item,
        isFile: item.type === "file",
        isFolder: item.type === "folder",
        isParent:
          (!item.path.includes("/") && item.type === "folder") ||
          isClientUploadedDocs,
      });
    };

    const handleMenuClose = () => {
      setMenuAnchorEl(null);
    };

    const toggleReadStatus = (item) => {
      const newValue = !(item.meta?.readStatus || false);
      updateStatus(item, "readStatus", newValue);
    };

    const SIGN_STATUSES = [
      "sendForSignature",
      "pendingSignature",
      "signatureCompleted",
    ];
    const APPROVAL_STATUSES = [
      "sendForApproval",
      "pendingApproval",
      "canceledApproval",
      "approvalCompleted",
    ];

    const updateStatus = async (
      item,
      statusType,
      newValue,
      action,
      reason = ""
    ) => {
      try {
        if (!item?.path) return alert("Invalid item selected");
        const body = {
          targetPath: item.path,
          status: {
            [statusType]: newValue,
            ...(action === "cancel" && reason ? { cancelReason: reason } : {}),
          },
        };
        const res = await accountDocsAPI.updateStatus(body);
           // ✅ Axios response
    const data = res.data;

    alert(data?.message || "Status updated successfully");
    fetchFolderTree(accountId);
       
      } catch (err) {
        console.error("Error updating status:", err);
        alert("Error updating status");
      }
    };

    const toggleReadOnly = async (item) => {
      try {
        const newStatus = !item.meta.readOnly;
        const body =
          item.type === "folder"
            ? { folderPath: item.path, readOnly: newStatus }
            : { filePath: item.path, readOnly: newStatus };
        const apiCall =
          item.type === "folder"
            ? accountDocsAPI.setFolderReadOnly
            : accountDocsAPI.setFileReadOnly;
        const res = await apiCall(body);
        const data = res.data;
        if (res.status === 200 || res.status === 201) {
          fetchFolderTree(accountId);
          if (item.type === "folder" && newStatus) {
            setExpandedFolders((prev) => {
              const updated = { ...prev };
              delete updated[item.path];
              return updated;
            });
          }
          handleMenuClose();
          alert(data.message || "Updated successfully");
        } else {
          alert("Error: " + (data.message || "Something went wrong"));
        }
      } catch (err) {
        console.error(err);
        alert("Failed to update read-only status");
      }
    };

    const handleBulkTrash = async () => {
      if (selectedItems.size === 0) {
        toast.warning("Please select items to move to trash");
        return;
      }
      const confirmTrash = window.confirm(
        `Are you sure you want to move ${selectedItems.size} item(s) to trash?`
      );
      if (!confirmTrash) return;
      setBulkOperationLoading(true);
      try {
        const paths = Array.from(selectedItems);
        const res = await accountDocsAPI.bulkTrashItems({
          targetPaths: paths,
          trashedBy: "Client",
        });
        const data = res.data;
        console.log("Bulk trash response:", data);
        if (data.success) {
          toast.success(
            `${data.trashedItems.length} item(s) moved to trash successfully`
          );
          if (data.failedItems?.length > 0) {
            toast.warning(`${data.failedItems.length} item(s) failed`);
            console.log("Failed trash items:", data.failedItems);
          }
          setSelectedItems(new Set());
          fetchFolderTree(accountId);
        } else {
          toast.error(data.message || "Failed to trash items");
        }
      } catch (err) {
        console.error("Bulk trash error:", err);
        toast.error("Error moving items to trash: " + err.message);
      } finally {
        setBulkOperationLoading(false);
      }
    };

    const handleBulkDownload = async () => {
      if (selectedItems.size === 0) {
        toast.warning("Please select items to download");
        return;
      }
      setBulkOperationLoading(true);
      try {
        const paths = Array.from(selectedItems);
        const res = await accountDocsAPI.downloadItems({ paths });
        const blob = res.data;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `selected_items_${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        toast.success("Download started");
      } catch (err) {
        console.error("Bulk download error:", err);
        toast.error("Failed to download items");
      } finally {
        setBulkOperationLoading(false);
      }
    };

    const trashItem = async (item) => {
      if (!item?.path) return alert("Invalid path");
      const confirmTrash = window.confirm(
        `Are you sure you want to move "${item.name}" to Trash?`
      );
      if (!confirmTrash) return;
      try {
        const res = await accountDocsAPI.trashItem({
          targetPath: item.path,
          trashedBy: "Client",
        });
        const data = res.data;
        if (data.success) {
          toast.success(data.message || "Moved to trash");
          setTimeout(() => {
            fetchFolderTree(accountId);
          }, 500);
        } else {
          toast.error(data.message || "Failed to move to trash");
        }
      } catch (err) {
        console.error("Error trashing item:", err);
        toast.error("Error moving item to trash");
      }
      handleMenuClose();
    };

    const handleDownloadFile = async (item) => {
      console.log("Downloading file:", item);
      try {
        const res = await accountDocsAPI.downloadItems({ paths: item.path });
        const blob = res.data;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = item.name || "download";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Download error:", err);
      }
    };

    const targetEmail = sessionStorage.getItem("email");
    const [selectedSlug, setSelectedSlug] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const openSignatureDialog = (slug) => {
      setSelectedSlug(slug);
      setDialogOpen(true);
    };

    const handleCloseDialog = () => {
      setDialogOpen(false);
      setSelectedSlug(null);
    };

    const fetchInvoicesByIds = async (ids = []) => {
      try {
        if (!ids.length) return [];
        const fetchPromises = ids.map((id) =>
          invoiceAPI.getInvoiceListById(id)
        );
        const results = await Promise.all(fetchPromises);
        const invoices = results
          .map((res) => res.data)
          .filter((result) => result?.invoice)
          .map((result) => {
            const inv = result.invoice;
            const lineItems = (inv.lineItems || []).map((item) => ({
              productName: item.productorService || "",
              description: item.description || "",
              rate: String(item.rate || "0.00"),
              qty: String(item.quantity || "1"),
              amount: String(item.amount || "0.00"),
              tax: item.tax || false,
              isDiscount: item.isDiscount || false,
            }));
            return {
              _id: inv._id,
              invoicenumber: inv.invoicenumber,
              invoicedate: inv.invoicedate,
              account: inv.account
                ? { value: inv.account._id, label: inv.account.accountName }
                : null,
              invoicetemplate: inv.invoicetemplate
                ? {
                    value: inv.invoicetemplate._id,
                    label: inv.invoicetemplate.templatename,
                  }
                : null,
              paymentMethod: {
                value: inv.paymentMethod,
                label: inv.paymentMethod,
              },
              teammember: inv.teammember
                ? { value: inv.teammember._id, label: inv.teammember.username }
                : null,
              description: inv.description,
              emailToClient: inv.emailinvoicetoclient,
              scheduledInvoice: inv.scheduleinvoice,
              payInvoiceWithCredits: inv.payInvoicewithcredits,
              isEmailInvoice: inv.emailinvoicetoclient,
              reminders: inv.reminders,
              lineItems,
              summary: inv.summary || {},
            };
          });
        return invoices;
      } catch (error) {
        console.error("Error fetching invoices:", error);
        return [];
      }
    };

    const navigate = useNavigate();

    const handlePayInvoice = () => {
      if (!selectedInvoiceFile?.meta?.invoices?.length) return;
      navigate("/payinvoice", {
        state: {
          selectedInvoices: selectedInvoiceFile.meta.invoices,
          accountName: accountName,
        },
      });
    };

    const handleFileClick = async (fullPath, fileName, meta = {}) => {
      console.log("file clicked", fullPath, fileName, meta);
      try {
        if (
          meta.newTags?.some((tag) => tag.isSystemTag && tag.tagName === "New")
        ) {
          await accountDocsAPI.removeNewTag({ filePath: fullPath });
          await fetchFolderTree(accountId);
        }
        if (meta.invoiceLock?.length) {
          const invoices = await fetchInvoicesByIds(meta.invoiceLock);
          if (!invoices.length) {
            alert("Failed to fetch invoice details.");
            return;
          }
          setSelectedInvoiceFile({
            path: fullPath,
            name: fileName,
            meta: {
              ...meta,
              invoices,
            },
          });
          setInvoiceDialogOpen(true);
          return;
        }
        if (meta.authStatus === "pendingApproval" && meta.approvalId) {
          fetApprovalDetails(meta.approvalId);
          return;
        }
        if (meta.esignRequestId && meta.signStatus === "pendingSignature") {
          try {
            const response = await fetch(
              `https://www.snptaxes.com/signature/byid/${meta.esignRequestId}`,
              {
                method: "GET",
                redirect: "follow",
              }
            );
            const result = await response.json();
            console.log("Signature details:", result);
            const submission = result;
            console.log("Full Submission:", submission);
            if (
              !submission.submitters ||
              !Array.isArray(submission.submitters)
            ) {
              console.error("No submitters array found in response");
              alert("Error loading signature request: Invalid data structure");
              return;
            }
            const matchingSubmitters = submission.submitters
              .map((s) => ({
                slug: s.slug,
                email: s.email,
                submissionId: s.submission_id,
                templateName: s.name,
                createdAt: submission.createdAt,
                fileUrl: submission.fileUrl,
                externalId: submission.externalId,
                submissionData: submission,
                status: s.status,
                completed_at: s.completed_at,
                role: s.role,
                allCompleted: submission.submitters.every(
                  (submitter) =>
                    submitter.status === "completed" ||
                    submitter.completed_at !== null
                ),
              }))
              .filter((s) => s.email === targetEmail && !s.completed_at);
            console.log("Matching Submitters:", matchingSubmitters);
            if (matchingSubmitters.length > 0) {
              const firstSlug = matchingSubmitters[0].slug;
              console.log("Opening signature dialog with slug:", firstSlug);
              openSignatureDialog(firstSlug);
            } else {
              const userSubmitters = submission.submitters.filter(
                (s) => s.email === targetEmail
              );
              if (userSubmitters.length > 0) {
                const completedSubmitter = userSubmitters[0];
                if (completedSubmitter.completed_at) {
                  alert("You have already signed this document.");
                  setTimeout(() => {
                    openDocument(fullPath, fileName);
                  }, 500);
                } else {
                  alert(
                    "You are not authorized to sign this document at this time."
                  );
                }
              } else {
                alert("You are not listed as a signer for this document.");
              }
            }
          } catch (error) {
            console.error("Error fetching signature details:", error);
            alert("Error loading signature request.");
          }
          return;
        }
        if (meta.readOnly) {
          alert("This file is locked and cannot be opened.");
          return;
        }
        openDocument(fullPath, fileName);
      } catch (error) {
        console.error("Error opening/downloading file:", error);
      }
    };

    const openDocument = (fullPath, fileName) => {
      try {
        const fileUrl = `${process.env.REACT_APP_FOLDER_MANAGEMENT}/uploads/accounts/${fullPath}`;
        console.log("Opening document:", fileUrl);
        const fileExt = fileName.split(".").pop().toLowerCase();
        const viewableExtensions = ["pdf", "jpg", "jpeg", "png", "gif", "txt"];
        if (viewableExtensions.includes(fileExt)) {
          window.open(fileUrl, "_blank", "noopener,noreferrer");
        } else {
          const link = document.createElement("a");
          link.href = fileUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (error) {
        console.error("Error opening document:", error);
        alert("Error opening document. Please try again.");
      }
    };

    const fetApprovalDetails = async (id) => {
      try {
        const res = await accountDocsAPI.getApprovalById(id);
        const data = res.data;
        console.log("Approval Data:", data);
        setSelectedDoc(data.approval);
        setOpenViewer(true);
        return data;
      } catch (error) {
        console.error("Error fetching approval:", error);
        return null;
      }
    };

    const handleApprovalAction = async (id, action, reason = "") => {
      try {
        console.log("Sending approval request:", {
          id,
          action,
          description: reason,
          accountId,
          adminUserId,
        });
        const res = await accountDocsAPI.updateApprovalStatus(id, {
          action,
          description: reason,
          accountId,
          adminUserId,
        });
        console.log("✅ Approval response:", res.data);
        let originalPath = "";
        if (selectedDoc?.fileUrl) {
          const splitPath = selectedDoc.fileUrl.split("/uploads/accounts/");
          if (splitPath.length > 1) {
            originalPath = splitPath[1];
          }
          console.log("📌 Original document path:", originalPath);
        }
        const newStatus =
          action === "approve" ? "approvalCompleted" : "canceledApproval";
        await updateStatus(
          { path: originalPath },
          "authStatus",
          newStatus,
          action,
          cancelReason
        );
        setOpenViewer(false);
        setCancelDialogOpen(false);
        setCancelReason("");
        fetchFolderTree(accountId);
      } catch (error) {
        console.error(`❌ Error performing ${action} approval:`, error);
        if (error.response)
          console.error("Response data:", error.response.data);
      }
    };

    const handleCloseViewer = () => {
      setOpenViewer(false);
      setSelectedDoc(null);
    };

    const handleCancelClick = () => {
      setCancelDialogOpen(true);
    };

    const confirmCancel = () => {
      if (selectedDoc) {
        handleApprovalAction(selectedDoc._id, "cancel", cancelReason);
      }
    };

    const getFileIcon = (fileName) => {
      const ext = fileName.split(".").pop().toLowerCase();
      switch (ext) {
        case "pdf":
          return <FaFilePdf color="#d32f2f" size={18} />;
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
          return <FaFileImage color="#1976d2" size={18} />;
        case "doc":
        case "docx":
          return <FaFileWord color="#1565c0" size={18} />;
        case "xls":
        case "xlsx":
          return <FaFileExcel color="#2e7d32" size={18} />;
        case "txt":
        case "md":
          return <FaFileAlt color="#616161" size={18} />;
        default:
          return <AiFillFileUnknown color="#757575" size={18} />;
      }
    };

    const INVOICE_LOCK_STATUSES = ["pendingpayment", "paymentcompleted"];
    const invoiceStatusTextMap = {
      pendingpayment: "Pending Payment",
      paymentcompleted: "Payment Completed",
    };
    const approvalStatusTextMap = {
      sendForApproval: "Send for Approval",
      pendingApproval: "Waiting for Approval",
      canceledApproval: "canceledApproval",
      approvalCompleted: "Approval Completed",
    };
    const statusTextMap = {
      sendForSignature: "Send for Sign",
      pendingSignature: "Waiting for Signature",
      signatureCompleted: "Signature Received",
    };

    const formatUploadedAt = (dateValue) => {
      if (!dateValue) return "";
      if (
        typeof dateValue === "string" &&
        /^[A-Z]{3}-\d{2} \d{4}$/.test(dateValue)
      ) {
        return dateValue;
      }
      const date = new Date(dateValue);
      if (isNaN(date)) return dateValue;
      return date
        .toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
        .toUpperCase()
        .replace(",", "")
        .replace(" ", "-");
    };

    const UploadedInfo = ({ meta }) => {
      if (!meta?.uploadedAt) return null;
      return (
        <span className="text-xs font-bold">
          {formatUploadedAt(meta.uploadedAt)}
        </span>
      );
    };

    const getStatusChip = (meta, isFolder) => {
      if (isFolder) return null;
      const chips = [];
      if (SIGN_STATUSES.includes(meta.signStatus)) {
        let color = "gray";
        if (meta.signStatus === "pendingSignature") color = "orange";
        if (meta.signStatus === "signatureCompleted") color = "green";
        chips.push(
          <span
            key="signChip"
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
              color === "orange" ? "border-orange-500 text-orange-700 bg-orange-50" :
              color === "green" ? "border-green-500 text-green-700 bg-green-50" :
              "border-gray-500 text-gray-700 bg-gray-50"
            }`}
          >
            {statusTextMap[meta.signStatus]}
          </span>
        );
      }
      if (APPROVAL_STATUSES.includes(meta.authStatus)) {
        let color = "gray";
        let chip;
        if (meta.authStatus === "pendingApproval") color = "orange";
        if (meta.authStatus === "approvalCompleted") color = "green";
        if (meta.authStatus === "canceledApproval") color = "red";
        if (meta.authStatus === "canceledApproval" && meta.cancelReason) {
          chip = (
            <div className="relative inline-block group" key="approvalCanceledChip">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border border-red-500 text-red-700 bg-red-50 cursor-pointer">
                Approval Canceled
              </span>
              <div className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -mt-8 whitespace-nowrap">
                {meta.cancelReason}
              </div>
            </div>
          );
        } else {
          chip = (
            <span
              key="approvalChip"
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                color === "orange" ? "border-orange-500 text-orange-700 bg-orange-50" :
                color === "green" ? "border-green-500 text-green-700 bg-green-50" :
                color === "red" ? "border-red-500 text-red-700 bg-red-50" :
                "border-gray-500 text-gray-700 bg-gray-50"
              }`}
            >
              {approvalStatusTextMap[meta.authStatus]}
            </span>
          );
        }
        chips.push(chip);
      }
      if (INVOICE_LOCK_STATUSES.includes(meta.lockInvoiceStatus)) {
        let color = "gray";
        if (meta.lockInvoiceStatus === "pendingpayment") color = "orange";
        if (meta.lockInvoiceStatus === "paymentcompleted") color = "green";
        chips.push(
          <span
            key="invoiceLockChip"
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
              color === "orange" ? "border-orange-500 text-orange-700 bg-orange-50" :
              color === "green" ? "border-green-500 text-green-700 bg-green-50" :
              "border-gray-500 text-gray-700 bg-gray-50"
            }`}
          >
            {invoiceStatusTextMap[meta.lockInvoiceStatus]}
          </span>
        );
      }
      if (chips.length === 0) return null;
      return <div className="flex gap-1">{chips}</div>;
    };

    const findNewSystemTag = (item) => {
      console.log("Finding 'New' tag in item:", item);
      const newTag = item.meta?.newTags?.find(
        (tag) => tag.isSystemTag && tag.tagName === "New"
      );
      if (newTag) return newTag;
      if (item.children && item.children.length > 0) {
        for (const child of item.children) {
          const childTag = findNewSystemTag(child);
          if (childTag) return childTag;
        }
      }
      return null;
    };

    const renderTableRows = (
      items,
      level = 0,
      parentPath = "",
      isInsideRestricted = false
    ) => {
      const sortedItems = [...items].sort((a, b) => {
        if (a.type === "folder" && b.type !== "folder") return -1;
        if (a.type !== "folder" && b.type === "folder") return 1;
        return a.name.localeCompare(b.name);
      });
      return sortedItems.map((item) => {
        console.log("itemlist", item);
        const fullPath = item.path;
        const meta = item.meta || {};
        const isFolder = item.type === "folder";
        const isSelected = selectedItems.has(fullPath);
        const restrictedFolderName = "firm documents shared with client";
        const isRootFolder = level === 0 && isFolder;
        const isFirmDocsRoot =
          isRootFolder &&
          item.name?.toLowerCase() === restrictedFolderName.toLowerCase();
        const insideRestricted = isInsideRestricted || isFirmDocsRoot;
        const hideMenu = insideRestricted;
        const isPartiallySelected = isFolder
          ? isFolderPartiallySelected(item)
          : false;
        const handleSafeFileClick = () => {
          if (meta.readOnly) {
            alert("This file is locked and cannot be opened.");
            return;
          }
          if (!isFolder) {
            handleFileClick(fullPath, item.name, meta);
          }
        };
        const inheritedNewTag = isFolder ? findNewSystemTag(item) : null;
        return (
          <React.Fragment key={fullPath}>
            <tr
              className={`${isFolder ? "folder-row" : ""} ${
                isSelected ? "bg-blue-200" : "bg-transparent"
              } rounded-lg mb-1 cursor-pointer hover:bg-blue-200 transition-colors`}
              style={{ cursor: item.meta?.readOnly ? "not-allowed" : "pointer" }}
            >
              {/* Checkbox Column */}
              <td className="px-4 py-2 w-[50px] pl-8">
                {isFolder ? (
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    checked={isSelected}
                    ref={(el) => {
                      if (el) {
                        el.indeterminate = isPartiallySelected;
                      }
                    }}
                    disabled={insideRestricted || meta.readOnly}
                    onChange={() => {
                      if (insideRestricted || meta.readOnly) return;
                      handleFolderSelect(item);
                    }}
                  />
                ) : (
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    checked={isSelected}
                    disabled={insideRestricted || meta.readOnly}
                    onChange={() => {
                      if (insideRestricted || meta.readOnly) return;
                      handleSelectItem(fullPath);
                    }}
                  />
                )}
              </td>

              {/* Name Column */}
              <td className="px-4 py-2" style={{ paddingLeft: `${level * 16 + 8}px` }}>
                <div className="flex items-center">
                  {isFolder ? (
                    <>
                      <button
                        className="p-1 rounded hover:bg-gray-100 mr-1 transition-colors disabled:opacity-50"
                        onClick={() => toggleFolder(fullPath, meta.readOnly)}
                        disabled={meta.readOnly}
                      >
                        {expandedFolders[fullPath] ? (
                          <FolderOpenIcon color="#1976d2" className="w-5 h-5" />
                        ) : (
                          <FolderClosedIcon color="#757575" className="w-5 h-5" />
                        )}
                      </button>
                      <span
                        className={`ml-1 text-sm font-medium ${
                          meta.readOnly ? "text-gray-400" : "text-gray-700"
                        } cursor-pointer`}
                        onClick={() => toggleFolder(fullPath, meta.readOnly)}
                      >
                        {item.name}
                        {inheritedNewTag && (
                          <span
                            className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium text-white"
                            style={{ backgroundColor: inheritedNewTag.tagColour, height: 18, fontSize: "0.7rem" }}
                          >
                            {inheritedNewTag.tagName}
                          </span>
                        )}
                        {meta.readOnly && (
                          <span className="ml-1 text-xs text-red-600">
                            (Locked)
                          </span>
                        )}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="mr-1">{getFileIcon(item.name)}</div>
                      <div className="flex flex-col">
                        <span
                          className={`text-sm ${
                            meta.readOnly ? "text-gray-400" : "text-blue-600"
                          } ${meta.readOnly ? "" : "underline"} cursor-pointer`}
                          onClick={handleSafeFileClick}
                          style={{ cursor: meta.readOnly ? "not-allowed" : "pointer" }}
                        >
                          {item.name}
                          {meta.newTags?.map((tag, index) => (
                            <span
                              key={index}
                              className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium text-white"
                              style={{ backgroundColor: tag.tagColour, height: 18, fontSize: "0.7rem" }}
                            >
                              {tag.tagName}
                            </span>
                          ))}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </td>
              
              {/* Status Column */}
              <td className="px-4 py-2">
                <div className="mt-1">{getStatusChip(meta, isFolder)}</div>
              </td>

              {/* Uploaded Date Column */}
              <td className="px-4 py-2">
                <UploadedInfo meta={meta} />
              </td>

              {/* Uploaded By Column */}
              <td className="px-4 py-2">
                <span className="text-xs font-bold">{meta.uploadedBy}</span>
              </td>

              {/* Actions Column */}
              <td className="px-4 py-2 text-right">
                {!hideMenu && (
                  <button
                    className="p-1 rounded hover:bg-gray-100 transition-colors"
                    onClick={(e) => handleMenuOpen(e, { ...item, fullPath })}
                  >
                    <EllipsisVertical className="w-5 h-5 text-gray-500" />
                  </button>
                )}
              </td>
            </tr>

            {/* Render children if folder is expanded */}
            {isFolder &&
              expandedFolders[fullPath] &&
              item.children &&
              item.children.length > 0 &&
              renderTableRows(
                item.children,
                level + 1,
                fullPath,
                insideRestricted
              )}
          </React.Fragment>
        );
      });
    };

    return (
      <div className="p-6">
        <div className="p-6 max-w-[1000px] mx-auto">
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 max-w-[600px] w-full mx-auto my-6">
            <button
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
              onClick={() => {
                setNewFolderDrawerOpen(true);
                handleMenuClose();
              }}
            >
              <FolderIcon className="w-5 h-5" />
              Create Folder
            </button>

            <button
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
              onClick={() => setFileUploadDrawerOpen(true)}
            >
              <UploadFileIcon className="w-5 h-5" />
              Upload File
            </button>

            <button
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
              onClick={() => setFolderUploaDrawerOpen(true)}
            >
              <DriveFolderUploadIcon className="w-5 h-5" />
              Upload Folder
            </button>

            <button
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
              onClick={handleTrashClick}
            >
              <DeleteIcon className="w-5 h-5" />
              View Trash
            </button>
          </div>

          {/* Bulk Operations Panel */}
          {selectedItems.size > 0 && (
            <div className="p-4 mb-6 bg-blue-50 shadow-md rounded-lg flex items-center justify-between flex-wrap gap-2">
              <span className="font-semibold text-gray-700">
                {selectedItems.size} item(s) selected
              </span>
              <div className="flex gap-2 flex-wrap">
                <button
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                  onClick={() => setBulkMoveDrawerOpen(true)}
                  disabled={bulkOperationLoading}
                >
                  <DriveFileMoveIcon className="w-4 h-4" />
                  Move
                </button>
                <button
                  className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                  onClick={handleBulkTrash}
                  disabled={bulkOperationLoading}
                >
                  <DeleteIcon className="w-4 h-4" />
                  Delete
                </button>
                <button
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                  onClick={handleBulkDownload}
                  disabled={bulkOperationLoading}
                >
                  <DownloadIcon className="w-4 h-4" />
                  Download
                </button>
                <button
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                  onClick={() => setSelectedItems(new Set())}
                  disabled={bulkOperationLoading}
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          {/* Drawers - These remain the same */}
          <FileUploadDrawer
            isOpen={fileUploadDrawerOpen}
            onClose={() => setFileUploadDrawerOpen(false)}
            folderTree={folderTree}
            fetchFolderTree={() => fetchFolderTree(accountId)}
            selectedFolderForMenu={selectedFolderForMenu}
          />

          <CreteFolderDrawer
            isOpen={newFolderDrawerOpen}
            onClose={() => {
              setNewFolderDrawerOpen(false);
            }}
            accountId={accountId}
            folderTree={folderTree}
            fetchFolderTree={() => fetchFolderTree(accountId)}
            selectedFolderForMenu={selectedFolderForMenu}
          />

          <FolderUploadDrawer
            isOpen={folderUploaDrawerOpen}
            onClose={() => setFolderUploaDrawerOpen(false)}
            folderTree={folderTree}
            fetchFolderTree={() => fetchFolderTree(accountId)}
            selectedFolderForMenu={selectedFolderForMenu}
          />

          <MoveDrawer
            isOpen={moveDrawerOpen}
            onClose={() => {
              setMoveDrawerOpen(false);
            }}
            folderTree={folderTree}
            fetchFolderTree={() => fetchFolderTree(accountId)}
            selectedFolderForMenu={selectedFolderForMenu}
          />

          <RenameDrawer
            isOpen={renameDrawer}
            onClose={() => {
              SetRenameDrawer(false);
            }}
            folderTree={folderTree}
            fetchFolderTree={() => fetchFolderTree(accountId)}
            selectedFolderForMenu={selectedFolderForMenu}
          />

          <MoveDrawer
            isOpen={bulkMoveDrawerOpen}
            onClose={() => setBulkMoveDrawerOpen(false)}
            folderTree={folderTree}
            fetchFolderTree={fetchFolderTree}
            isBulkOperation={true}
            selectedPaths={Array.from(selectedItems)}
            onMoveComplete={(targetPath) => {
              console.log("Bulk move completed to:", targetPath);
              setSelectedItems(new Set());
            }}
          />
        </div>

        {/* Document Approval Dialog */}
        {openViewer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-semibold text-gray-900 truncate max-w-md">
                    {selectedDoc?.filename || "Document"}
                  </h3>
                  {selectedDoc?.description && (
                    <div className="relative inline-block group">
                      <button className="text-gray-400 hover:text-gray-600">
                        <TriangleAlert className="w-5 h-5" />
                      </button>
                      <div className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -mt-8 whitespace-nowrap">
                        {selectedDoc.description}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleCloseViewer}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="h-[80vh] p-0 overflow-hidden">
                {selectedDoc ? (
                  <iframe
                    src={selectedDoc.fileUrl}
                    title={selectedDoc.filename}
                    className="w-full h-full border-0"
                  />
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No document selected
                  </p>
                )}
              </div>
              {selectedDoc && (
                <div className="flex justify-center gap-4 p-4 border-t">
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    onClick={() =>
                      handleApprovalAction(selectedDoc._id, "approve")
                    }
                  >
                    Approve
                  </button>
                  <button
                    className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                    onClick={handleCancelClick}
                  >
                    Disapprove
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cancel Reason Dialog */}
        <dialog
          open={cancelDialogOpen}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          style={{ display: cancelDialogOpen ? "flex" : "none" }}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                Cancel Document Approval
              </h3>
              <p className="text-gray-600 mb-2">
                Please provide a reason for cancelling this document approval:
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => setCancelDialogOpen(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={!cancelReason.trim()}
                onClick={confirmCancel}
              >
                Submit
              </button>
            </div>
          </div>
        </dialog>

        {/* Signature Dialog */}
        <dialog
          open={dialogOpen}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          style={{ display: dialogOpen ? "flex" : "none" }}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-semibold">Signing Form</h3>
              <button
                onClick={handleCloseDialog}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 h-[80vh] overflow-auto">
              {selectedSlug && (
                <DocusealForm
                  src={`https://docuseal.com/s/${selectedSlug}`}
                  email={targetEmail}
                  onComplete={async (data) => {
                    console.log("Post-sign data:", data);
                    try {
                      const updateSubmitterRes = await fetch(
                        `${SIGNATURE_API}/signautrelist/update-submitter/${data.template.external_id}`,
                        {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            submitterEmail: targetEmail,
                            submissionId: data.submission_id,
                          }),
                        }
                      );
                      const updateData = await updateSubmitterRes.json();
                      if (updateData.success) {
                        console.log("✅ Document replaced with latest signature");
                        if (updateData.allCompleted) {
                          console.log("🎉 All submitters have completed signing!");
                          const fullPath = decodeURIComponent(
                            updateData.esignRecord.fileUrl.split(
                              "/uploads/accounts/"
                            )[1]
                          );
                          console.log("Full file path:", fullPath);
                          const parentFolderPath = fullPath
                            .split("/")
                            .slice(0, -1)
                            .join("/");
                          console.log("Parent folder path:", parentFolderPath);
                          await updateStatus(
                            { path: fullPath },
                            "signStatus",
                            "signatureCompleted"
                          );
                          await fetch(`${SIGNATURE_API}/notify-admin`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              clientName: targetEmail,
                              documentName: selectedSlug,
                              message: "All parties have completed signing",
                              accountId: accountId,
                            }),
                          });
                          alert(
                            "All signatures completed! Document has been fully executed."
                          );
                        } else {
                          console.log(
                            `✅ You have signed. Document updated. Waiting for ${updateData.pendingCount} more signer(s).`
                          );
                          alert(
                            `Thank you for signing! Document has been updated. Waiting for ${updateData.pendingCount} more signer(s) to complete.`
                          );
                        }
                      } else {
                        alert("Error updating signature status.");
                      }
                    } catch (err) {
                      console.error("Error handling post-sign actions", err);
                      alert("Error while updating sign status.");
                    }
                    handleCloseDialog();
                  }}
                />
              )}
            </div>
          </div>
        </dialog>

        {/* Invoice Details Dialog */}
        <dialog
          open={invoiceDialogOpen}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          style={{ display: invoiceDialogOpen ? "flex" : "none" }}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Invoice Details</h3>
              {selectedInvoiceFile?.meta?.invoices?.length ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Invoice Number
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Description
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedInvoiceFile.meta.invoices.map((invoice) => (
                      <tr key={invoice._id}>
                        <td className="px-4 py-2 text-sm">{invoice.invoicenumber}</td>
                        <td className="px-4 py-2 text-sm">
                          {invoice.description || "No description"}
                        </td>
                        <td className="px-4 py-2 text-sm text-right">
                          ${invoice.summary?.total?.toFixed(2) || "0.00"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No invoices available for this file.</p>
              )}
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => setInvoiceDialogOpen(false)}
              >
                Close
              </button>
              {selectedInvoiceFile?.meta?.invoices?.length > 0 && (
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  onClick={handlePayInvoice}
                >
                  Pay
                </button>
              )}
            </div>
          </div>
        </dialog>

        {/* Folder Explorer */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">📜 Folder Explorer</h2>
          {folderTree && folderTree.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-2 text-left w-[50px]"></th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Uploaded
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        User
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>{renderTableRows(folderTree)}</tbody>
                </table>
              </div>
              {selectedItems.size > 0 && (
                <div className="p-4 mt-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-700">
                    {selectedItems.size} item(s) selected
                  </p>
                </div>
              )}
            </>
          ) : (
            <p className="p-4 text-center text-gray-500">
              Loading folder data...
            </p>
          )}
        </div>

        {/* Context Menus */}
        {selectedFolderForMenu ? (
          selectedFolderForMenu.isParent ? (
            <ParentFolderMenu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
              onCreateFolder={() => setNewFolderDrawerOpen(true)}
            />
          ) : selectedFolderForMenu.isFile ? (
            <FileMenu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
              selectedItem={selectedFolderForMenu}
              onRename={() => SetRenameDrawer(true)}
              onMove={() => setMoveDrawerOpen(true)}
              accId={accountId}
              onToggleReadStatus={toggleReadStatus}
              onToggleReadOnly={toggleReadOnly}
              onDelete={trashItem}
              onDownload={handleDownloadFile}
            />
          ) : (
            <FolderMenu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
              selectedItem={selectedFolderForMenu}
              onCreateFolder={() => setNewFolderDrawerOpen(true)}
              onUploadFile={() => setFileUploadDrawerOpen(true)}
              onUploadFolder={() => folderUploaDrawerOpen(true)}
              onRename={() => SetRenameDrawer(true)}
              onMove={() => setMoveDrawerOpen(true)}
              onToggleReadStatus={toggleReadStatus}
              onToggleReadOnly={toggleReadOnly}
              onDelete={trashItem}
            />
          )
        ) : null}
      </div>
    );
  };

  return (
    <div className="p-6">
      <FolderTreeView accountId={accountId} />
    </div>
  );
};

export default DocsFolderTree;