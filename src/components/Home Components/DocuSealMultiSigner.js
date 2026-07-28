// import React, { useEffect, useState } from "react";
// import { DocusealForm } from "@docuseal/react";
// import { esignAPI, accountDocsAPI,accountsAPI } from "../../services/api";
// const DocuSealMultiSigner = ({ accountId }) => {
//   const [submissions, setSubmissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedSlug, setSelectedSlug] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);

//   const SIGNATURE_API = process.env.REACT_APP_ESIGNATURE_API;
//   const targetEmail = sessionStorage.getItem("email");

//   useEffect(() => {
//     const fetchSignatureList = async () => {
//       try {
//         const res = await esignAPI.getSignatureList(accountId);

//         setSubmissions(res.data || []);
//         console.log("Fetched submissions:", res.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching signatures:", error);
//         setLoading(false);
//       }
//     };

//     if (accountId) fetchSignatureList();
//   }, [accountId]);
//   const [accountName, setAccountName] = useState("");
//   const [account, setAccount] = useState(null);
//   const [accountLoading, setAccountLoading] = useState(false);
// const fetchAccount = async () => {
//   try {
//     setAccountLoading(true);

//     const res = await accountsAPI.getAccountById(accountId);
//     setAccount(res.data);
//     setAccountName(res.data?.accountName || "");
//   } catch (err) {
//     console.error("Failed to fetch account:", err);
//   } finally {
//     setAccountLoading(false);
//   }
// };

// useEffect(() => {
//   if (accountId) {
//     fetchAccount();
//   }
// }, [accountId]);
//   const handleOpenDialog = (slug) => {
//     setSelectedSlug(slug);
//     setDialogOpen(true);
//   };

//   const handleCloseDialog = () => {
//     setDialogOpen(false);
//     setSelectedSlug(null);
//   };

//   const updateStatus = async (
//     item,
//     statusType,
//     newValue,
//     action,
//     reason = "",
//     accountId,
//     accountName
//   ) => {
//     try {
//       if (!item?.path) return alert("Invalid item selected");
//       const body = {
//         targetPath: item.path,
//         status: {
//           [statusType]: newValue,
//           ...(action === "cancel" && reason ? { cancelReason: reason } : {}),
//         },
//         accountId,
//         accountName
//       };
//       const res = await accountDocsAPI.updateStatus(body);
//       // ✅ Axios response
//       const data = res.data;

//       alert(data?.message || "Status updated successfully");
//       // fetchFolderTree(accountId);
//     } catch (err) {
//       console.error("Error updating status:", err);
//       alert("Error updating status");
//     }
//   };
//   const matchingSubmitters = submissions
//     .flatMap((submission) =>
//       submission.submitters.map((s) => ({
//         ...s,
//         templateName: s.name,
//         submissionData: submission,
//       })),
//     )
//     .filter((s) => s.email === targetEmail && !s.completed_at);

//   const allUserSubmissions = submissions
//     .flatMap((submission) =>
//       submission.submitters.map((s) => ({
//         ...s,
//         templateName: s.name,
//         totalSubmitters: submission.submitters.length,
//         completedCount: submission.submitters.filter((sub) => sub.completed_at)
//           .length,
//         allCompleted: submission.submitters.every((sub) => sub.completed_at),
//       })),
//     )
//     .filter((s) => s.email === targetEmail);

//   if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

//   return (
//     <div>
//       {/* 🔹 Pending Signatures */}
//       {matchingSubmitters.length > 0 && (
//         <div className="px-5 py-3">
//           <div className="flex items-center gap-2 mb-2.5">
//             <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">
//               Documents
//             </span>

//             <span className="ml-auto text-[11px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
//               {matchingSubmitters.length}
//             </span>
//           </div>

//           <div className="flex flex-col gap-1.5">
//             {matchingSubmitters.map((s, index) => (
//               <div
//                 key={index}
//                 onClick={() => handleOpenDialog(s.slug)}
//                 className="group flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
//               >
//                 <div className="min-w-0">
//                   <p className="text-[12px] font-semibold text-gray-800">
//                     Review and Sign
//                   </p>

//                   <p className="text-[12px] text-gray-500 truncate mt-0.5">
//                     {s.templateName}
//                   </p>

//                   <p className="text-[11px] text-gray-400 mt-0.5">
//                     {
//                       s.submissionData.submitters.filter(
//                         (sub) => sub.completed_at,
//                       ).length
//                     }{" "}
//                     of {s.submissionData.submitters.length} signed • {s.role}
//                   </p>
//                 </div>

//                 <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
//                   →
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

    

//       {/* 🔹 Modal */}
//       {dialogOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
//           <div className="bg-white w-[95%] max-w-5xl rounded-xl shadow-lg">
//             {/* Header */}
//             <div className="flex justify-between items-center p-4 border-b">
//               <h3 className="font-semibold text-sm">Signing Form</h3>
//               <button onClick={handleCloseDialog}>✕</button>
//             </div>

//             {/* Content */}
//             <div className="h-[80vh] overflow-auto">
//               {selectedSlug && (
//                 <DocusealForm
//                   src={`https://docuseal.com/s/${selectedSlug}`}
//                   email={targetEmail}
                
//               onComplete={async (data) => {
//   console.log("Post-sign data:", data);

//   try {
//     // ✅ 1. Update submitter status (API.js)
//     const updateSubmitterRes = await esignAPI.updateSubmitterStatus(
//       data.template.external_id,
//       {
//         submitterEmail: targetEmail,
//         submissionId: data.submission_id,
//       }
//     );

//     const updateData = updateSubmitterRes.data;

//     if (updateData.success) {
//       console.log("✅ Document replaced with latest signature");

//       if (updateData.allCompleted) {
//         console.log("🎉 All submitters have completed signing!");

//         const fullPath = decodeURIComponent(
//           updateData.esignRecord.fileUrl.split("/uploads/accounts/")[1]
//         );

//         console.log("Full file path:", fullPath);

//         // ✅ 2. Update status via API.js
//         await updateStatus(
//           { path: fullPath ,accountId: accountId, accountName: accountName},
//           "signStatus",
//           "signatureCompleted"
//         );

//         // ✅ 3. Notify admin via API.js
//         await esignAPI.notifyAdmin({
//           clientName: targetEmail,
//           documentName: selectedSlug,
//           message: "All parties have completed signing",
//           accountId: accountId,
//         });

//         alert("All signatures completed! Document has been fully executed.");
//       } else {
//         console.log(
//           `✅ You have signed. Waiting for ${updateData.pendingCount} more signer(s).`
//         );

//         alert(
//           `Thank you for signing! Waiting for ${updateData.pendingCount} more signer(s) to complete.`
//         );
//       }
//     } else {
//       alert("Error updating signature status.");
//     }
//   } catch (err) {
//     console.error("Error handling post-sign actions", err);
//     alert("Error while updating sign status.");
//   }

//   handleCloseDialog();
//   window.location.reload();
// }}
//                 />
                
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DocuSealMultiSigner;

import React, { useEffect, useState } from "react";
import { DocusealForm } from "@docuseal/react";
import { esignAPI, accountDocsAPI, accountsAPI, invoiceAPI } from "../../services/api";
import { X, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DocuSealMultiSigner = ({ accountId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [folderTree, setFolderTree] = useState([]);
  
  // State for invoice dialog
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [selectedInvoiceFile, setSelectedInvoiceFile] = useState(null);
  
  // State for approval viewer
  const [openViewer, setOpenViewer] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [adminUserId, setAdminUserId] = useState("");
  const [approvalLoading, setApprovalLoading] = useState(false);

  const targetEmail = sessionStorage.getItem("email");
  const navigate = useNavigate();

  // Account state
  const [accountName, setAccountName] = useState("");
  const [account, setAccount] = useState(null);
  const [accountLoading, setAccountLoading] = useState(false);

  // Fetch account details
  const fetchAccountDetails = async () => {
    try {
      const res = await accountsAPI.getAccountById(accountId);
      setAccountName(res.data.accountName);
      setAdminUserId(res.data.adminUserId?.emailSyncEmail || "");
      setAccount(res.data);
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };

  // Fetch invoices by IDs - EXACT same as FolderTreeView
  const fetchInvoicesByIds = async (ids = []) => {
    try {
      if (!ids.length) return [];
      const fetchPromises = ids.map((id) => invoiceAPI.getInvoiceListById(id));
      const results = await Promise.all(fetchPromises);
      console.log("Fetched invoice results:", results);
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
            paymentMethod: inv.paymentMethod,
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
            balanceDueAmount: inv.balanceDueAmount,
          };
        });
      return invoices;
    } catch (error) {
      console.error("Error fetching invoices:", error);
      return [];
    }
  };

  // Handle Pay Invoice - EXACT same as FolderTreeView
  const handlePayInvoice = () => {
    if (!selectedInvoiceFile?.meta?.invoices?.length) return;
    console.log("Invoices to pay:", selectedInvoiceFile?.meta?.invoices);
    navigate("/payinvoice", {
      state: {
        selectedInvoices: selectedInvoiceFile.meta.invoices,
        accountName: accountName,
      },
    });
  };

  // Fetch approval details - EXACT same as FolderTreeView
  const fetApprovalDetails = async (id) => {
    try {
      setApprovalLoading(true);
      const res = await accountDocsAPI.getApprovalById(id);
      const data = res.data;
      setSelectedDoc(data.approval);
      setOpenViewer(true);
      return data;
    } catch (error) {
      console.error("Error fetching approval:", error);
      alert("Error loading approval details. Please try again.");
      return null;
    } finally {
      setApprovalLoading(false);
    }
  };

  // Handle approval action - EXACT same as FolderTreeView
  const handleApprovalAction = async (id, action, reason = "") => {
    try {
      const res = await accountDocsAPI.updateApprovalStatus(id, {
        action,
        description: reason,
        accountId,
        adminUserId,
        accountName,
      });
      
      let originalPath = "";
      if (selectedDoc?.fileUrl) {
        const splitPath = selectedDoc.fileUrl.split("/uploads/accounts/");
        if (splitPath.length > 1) {
          originalPath = splitPath[1];
        }
      }
      
      const newStatus = action === "approve" ? "approvalCompleted" : "canceledApproval";
      await updateStatus(
        { path: originalPath },
        "authStatus",
        newStatus,
        action,
        cancelReason,
        accountName
      );
      
      setOpenViewer(false);
      setCancelDialogOpen(false);
      setCancelReason("");
      fetchFolderTree();
      
      alert(action === "approve" ? "Document approved successfully!" : "Document disapproved.");
    } catch (error) {
      console.error(`❌ Error performing ${action} approval:`, error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        alert(error.response.data?.message || `Error ${action}ing approval`);
      } else {
        alert(`Error ${action}ing approval. Please try again.`);
      }
    }
  };

  // Open document in new tab - EXACT same as FolderTreeView
  const openDocument = (fullPath, fileName) => {
    try {
      const fileUrl = `${process.env.REACT_APP_FOLDER_MANAGEMENT}/uploads/accounts/${fullPath}`;
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

  // Handle file click - EXACT same as FolderTreeView
  const handleFileClick = async (fullPath, fileName, meta = {}) => {
    try {
      // Remove "New" tag if present
      if (meta.newTags?.some((tag) => tag.isSystemTag && tag.tagName === "New")) {
        await accountDocsAPI.removeNewTag({ filePath: fullPath });
        await fetchFolderTree();
      }

      // Handle invoice lock - EXACT same as FolderTreeView
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

      // Handle pending approval - EXACT same as FolderTreeView
      if (meta.authStatus === "pendingApproval" && meta.approvalId) {
        fetApprovalDetails(meta.approvalId);
        return;
      }

      // Handle signature request - EXACT same as FolderTreeView
      if (meta.esignRequestId && meta.signStatus === "pendingSignature") {
        try {
          const response = await esignAPI.getSignatureById(meta.esignRequestId);
          const result = response.data;
          const submission = result;

          if (!submission.submitters || !Array.isArray(submission.submitters)) {
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
                  submitter.completed_at !== null,
              ),
            }))
            .filter((s) => s.email === targetEmail && !s.completed_at);

          console.log("Matching Submitters:", matchingSubmitters);

          if (matchingSubmitters.length > 0) {
            const firstSlug = matchingSubmitters[0].slug;
            openSignatureDialog(firstSlug);
          } else {
            const userSubmitters = submission.submitters.filter(
              (s) => s.email === targetEmail,
            );

            if (userSubmitters.length > 0) {
              const completedSubmitter = userSubmitters[0];

              if (completedSubmitter.completed_at) {
                alert("You have already signed this document.");
                setTimeout(() => {
                  openDocument(fullPath, fileName);
                }, 500);
              } else {
                alert("You are not authorized to sign this document at this time.");
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

      // Handle locked files - EXACT same as FolderTreeView
      if (meta.readOnly) {
        alert("This file is locked and cannot be opened.");
        return;
      }

      // Create VIEW audit - EXACT same as FolderTreeView
      await accountDocsAPI.viewDocument({
        filePath: fullPath,
        accountId: accountId,
        accountName: accountName,
      });

      // Open document - EXACT same as FolderTreeView
      openDocument(fullPath, fileName);
    } catch (error) {
      console.error("Error opening/downloading file:", error);
      alert("Error opening file. Please try again.");
    }
  };

  // Update status function - EXACT same as FolderTreeView
  const updateStatus = async (
    item,
    statusType,
    newValue,
    action,
    reason = "",
    accountName
  ) => {
    try {
      if (!item?.path) {
        console.warn("No path provided for status update");
        return;
      }
      
      const body = {
        targetPath: item.path,
        status: {
          [statusType]: newValue,
          ...(action === "cancel" && reason ? { cancelReason: reason } : {}),
        },
        accountId,
        accountName,
      };
      
      console.log("Updating status with body:", body);
      const res = await accountDocsAPI.updateStatus(body);
      const data = res.data;
      
      console.log("Status update response:", data);
      alert(data?.message || "Status updated successfully");
      fetchFolderTree();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Error updating status");
    }
  };

  // Extract pending documents from folder tree
  const extractPendingDocuments = (treeItems) => {
    const pendingSignatures = [];
    const pendingApprovals = [];
    
    const traverse = (items) => {
      if (!items || !Array.isArray(items)) return;
      
      for (const item of items) {
        const meta = item.meta || {};
        
        // Check for pending signature documents
        if (item.type === "file" && meta.signStatus === "pendingSignature" && meta.esignRequestId) {
          pendingSignatures.push({
            name: item.name,
            path: item.path,
            esignRequestId: meta.esignRequestId,
            signStatus: meta.signStatus,
            readStatus: meta.readStatus || false,
            readOnly: meta.readOnly || false,
            uploadedBy: meta.uploadedBy || "System",
            uploadedAt: meta.uploadedAt || "",
            meta: meta,
            slug: meta.esignRequestId,
            templateName: item.name,
            type: 'signature',
          });
        }
        
        // Check for pending approval documents - EXACT same as FolderTreeView
        if (item.type === "file" && meta.authStatus === "pendingApproval" && meta.approvalId) {
          pendingApprovals.push({
            name: item.name,
            path: item.path,
            approvalId: meta.approvalId,
            authStatus: meta.authStatus,
            readStatus: meta.readStatus || false,
            readOnly: meta.readOnly || false,
            uploadedBy: meta.uploadedBy || "System",
            uploadedAt: meta.uploadedAt || "",
            meta: meta,
            templateName: item.name,
            type: 'approval',
          });
        }
        
        // Recursively traverse children
        if (item.children && item.children.length > 0) {
          traverse(item.children);
        }
      }
    };
    
    traverse(treeItems);
    return { pendingSignatures, pendingApprovals };
  };

  // Fetch folder tree and extract pending documents
  const fetchFolderTree = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await accountDocsAPI.clientListFoldersAndFiles(accountId);
      
      if (res.status === 200 || res.status === 201) {
        const responseData = res;
        
        if (responseData.data?.contents) {
          setFolderTree(responseData.data.contents);
          
          // Extract pending documents
          const { pendingSignatures, pendingApprovals } = extractPendingDocuments(responseData.data.contents);
          console.log("Extracted pending signatures:", pendingSignatures);
          console.log("Extracted pending approvals:", pendingApprovals);
          
          setPendingApprovals(pendingApprovals);
          
          // Fetch detailed submission data for each signature document
          const submissionsWithDetails = await Promise.all(
            pendingSignatures.map(async (doc) => {
              try {
                const response = await esignAPI.getSignatureById(doc.esignRequestId);
                const submissionData = response.data;
                
                return {
                  ...doc,
                  ...submissionData,
                  submitters: submissionData.submitters || [],
                  allCompleted: submissionData.submitters?.every(
                    (s) => s.completed_at !== null
                  ) || false,
                };
              } catch (err) {
                console.error(`Error fetching signature details for ${doc.esignRequestId}:`, err);
                return doc;
              }
            })
          );
          
          setSubmissions(submissionsWithDetails);
        } else {
          setError("Invalid response structure");
          setSubmissions([]);
          setPendingApprovals([]);
        }
      } else {
        setError("Failed to fetch folder tree");
        setSubmissions([]);
        setPendingApprovals([]);
      }
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError("Error fetching documents: " + (err.message || "Unknown error"));
      setSubmissions([]);
      setPendingApprovals([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (accountId) {
      fetchFolderTree();
      fetchAccountDetails();
    }
  }, [accountId]);

  // Dialog handlers
  const openSignatureDialog = (slug) => {
    setSelectedSlug(slug);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSlug(null);
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

  // Get pending signatures for current user
  const getPendingSignatures = () => {
    const pending = [];
    
    for (const submission of submissions) {
      if (submission.submitters && Array.isArray(submission.submitters)) {
        const matchingSubmitter = submission.submitters.find(
          (s) => s.email === targetEmail && !s.completed_at
        );
        
        if (matchingSubmitter) {
          pending.push({
            ...matchingSubmitter,
            templateName: submission.templateName || submission.name,
            submissionData: submission,
            fileName: submission.name,
            path: submission.path,
            meta: submission.meta,
            type: 'signature',
          });
        }
      } else {
        pending.push({
          email: targetEmail,
          completed_at: null,
          name: submission.templateName || submission.name,
          role: "Signer",
          slug: submission.slug || submission.esignRequestId,
          templateName: submission.templateName || submission.name,
          submissionData: submission,
          fileName: submission.name,
          path: submission.path,
          meta: submission.meta,
          type: 'signature',
        });
      }
    }
    
    return pending;
  };

  // Get all pending approvals
  const getPendingApprovals = () => {
    return pendingApprovals.map(approval => ({
      ...approval,
      templateName: approval.templateName || approval.name,
      fileName: approval.name,
      path: approval.path,
      meta: approval.meta,
      type: 'approval',
      role: 'Approver',
    }));
  };

  const pendingSignatures = getPendingSignatures();
  const pendingApprovalsList = getPendingApprovals();
  
  // Combine all pending items
  const allPendingItems = [...pendingSignatures, ...pendingApprovalsList];

  // Get all user submissions (including completed)
  const getAllUserSubmissions = () => {
    const userSubmissions = [];
    
    for (const submission of submissions) {
      if (submission.submitters && Array.isArray(submission.submitters)) {
        const matchingSubmitters = submission.submitters.filter(
          (s) => s.email === targetEmail
        );
        
        for (const submitter of matchingSubmitters) {
          userSubmissions.push({
            ...submitter,
            templateName: submission.templateName || submission.name,
            totalSubmitters: submission.submitters.length,
            completedCount: submission.submitters.filter((s) => s.completed_at).length,
            allCompleted: submission.submitters.every((s) => s.completed_at),
            fileName: submission.name,
            path: submission.path,
            meta: submission.meta,
          });
        }
      }
    }
    
    return userSubmissions;
  };

  const userSubmissions = getAllUserSubmissions();

  // Loading states
  if (loading || accountLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm text-gray-500">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-red-700">
          <span className="text-sm font-medium">Error:</span>
          <span className="text-sm">{error}</span>
        </div>
        <button
          onClick={fetchFolderTree}
          className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Pending Documents Section */}
      {allPendingItems.length > 0 ? (
        <div className="px-5 py-3">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">
              Documents Awaiting Your Action
            </span>
            <span className="ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[11px] font-semibold text-blue-600">
              {allPendingItems.length}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {allPendingItems.map((s, index) => (
              <div
                key={index}
                onClick={() => handleFileClick(s.path, s.fileName, s.meta)}
                className="group flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {s.type === 'approval' ? (
                      <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></div>
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-orange-400 animate-pulse"></div>
                    )}
                    <p className="text-[13px] font-semibold text-gray-800 truncate">
                      {s.templateName || s.fileName || "Document"}
                    </p>
                    {s.type === 'approval' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-100 text-yellow-700">
                        Pending Approval
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-orange-100 text-orange-700">
                        Pending Signature
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-[11px] text-gray-500 truncate">
                      {s.fileName || s.name}
                    </p>
                    <span className="text-[10px] text-gray-400">•</span>
                    <p className="text-[11px] text-gray-500">
                      {s.role || (s.type === 'approval' ? 'Approver' : 'Signer')}
                    </p>
                    {s.type === 'signature' && s.submissionData?.submitters && (
                      <>
                        <span className="text-[10px] text-gray-400">•</span>
                        <p className="text-[11px] text-gray-400">
                          {s.submissionData.submitters.filter((sub) => sub.completed_at).length} of{" "}
                          {s.submissionData.submitters.length} signed
                        </p>
                      </>
                    )}
                    {s.type === 'approval' && s.meta?.uploadedBy && (
                      <>
                        <span className="text-[10px] text-gray-400">•</span>
                        <p className="text-[11px] text-gray-400">
                          Uploaded by: {s.meta.uploadedBy}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {s.type === 'approval' ? 'Review' : 'Sign Now'}
                  </span>
                  <span className="text-gray-400 group-hover:text-blue-600 transition-colors">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // <div className="px-5 py-8 text-center">
        //   <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-3">
        //     <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        //     </svg>
        //   </div>
        //   {/* <p className="text-sm text-gray-500">No pending actions</p> */}
        //   {/* <p className="text-xs text-gray-400 mt-1">You're all caught up!</p> */}
        // </div>
        <div></div>
      )}

      {/* Completed Signatures Section */}
      {/* {userSubmissions.filter(s => s.completed_at).length > 0 && (
        <div className="border-t border-gray-100 px-5 py-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Completed Signatures
            </span>
            <span className="ml-auto text-[10px] font-medium text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-full">
              {userSubmissions.filter(s => s.completed_at).length}
            </span>
          </div>
          
          <div className="flex flex-col gap-1.5">
            {userSubmissions
              .filter(s => s.completed_at)
              .slice(0, 3)
              .map((s, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg bg-gray-50 px-3.5 py-2"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
                  <p className="text-[11px] text-gray-500 truncate flex-1">
                    {s.templateName || s.fileName || "Document"}
                  </p>
                  <span className="text-[10px] text-gray-400">
                    {s.completed_at ? new Date(s.completed_at).toLocaleDateString() : "Completed"}
                  </span>
                </div>
              ))}
            {userSubmissions.filter(s => s.completed_at).length > 3 && (
              <p className="text-[10px] text-gray-400 text-center mt-1">
                +{userSubmissions.filter(s => s.completed_at).length - 3} more
              </p>
            )}
          </div>
        </div>
      )} */}

      {/* ================= SIGNATURE DIALOG ================= */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
          <div className="w-full max-w-6xl bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-white to-slate-50">
              <div>
                <h3 className="text-2xl font-bold text-slate-800">Digital Signature</h3>
                <p className="text-sm text-slate-500 mt-1">Complete your signature process securely</p>
              </div>
              <button
                onClick={handleCloseDialog}
                className="h-11 w-11 rounded-2xl hover:bg-slate-100 flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="h-[82vh] overflow-hidden bg-slate-100">
              {selectedSlug && (
                <div className="w-full h-full bg-white">
                  <DocusealForm
                    src={`https://docuseal.com/s/${selectedSlug}`}
                    email={targetEmail}
                    onComplete={async (data) => {
                      console.log("Post-sign data:", data);

                      try {
                        const updateSubmitterRes = await esignAPI.updateSubmitterStatus(
                          data.template.external_id,
                          {
                            submitterEmail: targetEmail,
                            submissionId: data.submission_id,
                          }
                        );

                        const updateData = updateSubmitterRes.data;

                        if (updateData.success) {
                          console.log("✅ Document replaced with latest signature");

                          const doc = submissions.find(
                            s => s.esignRequestId === data.template.external_id
                          );

                          if (updateData.allCompleted) {
                            console.log("🎉 All submitters have completed signing!");

                            const fullPath = decodeURIComponent(
                              updateData.esignRecord.fileUrl.split("/uploads/accounts/")[1]
                            );

                            console.log("Full file path:", fullPath);

                            await updateStatus(
                              { path: fullPath },
                              "signStatus",
                              "signatureCompleted",
                              null,
                              null,
                              accountName
                            );

                            await esignAPI.notifyAdmin({
                              clientName: targetEmail,
                              documentName: doc?.name || "Document",
                              message: "All parties have completed signing",
                              accountId: accountId,
                            });

                            alert("All signatures completed! Document has been fully executed.");
                          } else {
                            console.log(
                              `✅ You have signed. Waiting for ${updateData.pendingCount} more signer(s).`
                            );

                            alert(
                              `Thank you for signing! Waiting for ${updateData.pendingCount} more signer(s) to complete.`
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
                      fetchFolderTree();
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= DOCUMENT APPROVAL DIALOG ================= */}
      {openViewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
          <div className="w-full max-w-5xl bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-white to-slate-50">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-yellow-100 flex items-center justify-center">
                  <Info className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg truncate max-w-md">
                    {selectedDoc?.filename || "Document"}
                  </h3>
                  <p className="text-sm text-slate-500">Review and approve document</p>
                </div>
              </div>
              <button
                onClick={handleCloseViewer}
                className="h-11 w-11 rounded-2xl hover:bg-slate-100 flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="h-[75vh] bg-slate-100">
              {selectedDoc ? (
                <iframe
                  src={selectedDoc.fileUrl}
                  title={selectedDoc.filename}
                  className="w-full h-full"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500">
                  {approvalLoading ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                      <p>Loading document...</p>
                    </div>
                  ) : (
                    "No document selected"
                  )}
                </div>
              )}
            </div>

            {selectedDoc && (
              <div className="flex justify-end gap-3 p-5 border-t border-slate-200 bg-white">
                <button
                  className="h-12 px-6 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 font-medium transition-all disabled:opacity-50"
                  onClick={handleCancelClick}
                  disabled={approvalLoading}
                >
                  {approvalLoading ? "Processing..." : "Disapprove"}
                </button>
                <button
                  className="h-12 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg transition-all disabled:opacity-50"
                  onClick={() => handleApprovalAction(selectedDoc._id, "approve")}
                  disabled={approvalLoading}
                >
                  {approvalLoading ? "Processing..." : "Approve Document"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= CANCEL DIALOG ================= */}
      {cancelDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
          <div className="w-full max-w-lg bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">Cancel Approval</h3>
              <p className="text-sm text-slate-500 mt-1">Please provide a reason for rejection</p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                className="w-full min-h-[120px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter rejection reason..."
              />
            </div>
            <div className="flex justify-end gap-3 px-6 py-5 border-t border-slate-200 bg-slate-50">
              <button
                className="h-11 px-5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-medium transition-all"
                onClick={() => setCancelDialogOpen(false)}
              >
                Close
              </button>
              <button
                className="h-11 px-5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-medium transition-all disabled:opacity-50"
                disabled={!cancelReason.trim()}
                onClick={confirmCancel}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= INVOICE DIALOG ================= */}
      {invoiceDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-white to-slate-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Invoice Details</h3>
                  <p className="text-sm text-slate-500 mt-1">Review associated invoice information</p>
                </div>
                <button
                  onClick={() => setInvoiceDialogOpen(false)}
                  className="h-11 w-11 rounded-2xl hover:bg-slate-100 flex items-center justify-center transition-all"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {selectedInvoiceFile?.meta?.invoices?.length ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">Invoice #</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">Description</th>
                        <th className="px-4 py-3 text-right text-xs font-bold uppercase text-slate-500">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedInvoiceFile.meta.invoices.map((invoice) => (
                        <tr key={invoice._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-4 text-sm font-semibold text-slate-700">{invoice.invoicenumber}</td>
                          <td className="px-4 py-4 text-sm text-slate-600">{invoice.description || "No description"}</td>
                          <td className="px-4 py-4 text-sm font-bold text-right text-slate-800">
                            ${invoice.summary?.total?.toFixed(2) || "0.00"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-14 text-center">
                  <p className="text-slate-500">No invoices available for this file.</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 px-6 py-5 border-t border-slate-200 bg-slate-50">
              <button
                className="h-11 px-5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-medium transition-all"
                onClick={() => setInvoiceDialogOpen(false)}
              >
                Close
              </button>
              {selectedInvoiceFile?.meta?.invoices?.length > 0 && (
                <button
                  className="h-11 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-lg"
                  onClick={handlePayInvoice}
                >
                  Pay Invoice
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocuSealMultiSigner;