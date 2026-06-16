import React, { useState, useEffect, useContext } from "react";
import {
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  Lock as LockIcon,
  // LockOpen as LockOpenIcon,
} from "@mui/icons-material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { Eye, PenTool, Stamp, Lock } from "lucide-react";
import {
  Folder as FolderClosedIcon,
  FolderOpen as FolderOpenIcon,
} from "lucide-react";
import { EllipsisVertical, Info, TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FileUploadDrawer from "./drawers/FileUploadDrawer";
import CreteFolderDrawer from "./drawers/CreteFolderDrawer";
import FolderUploadDrawer from "./drawers/FolderUploadDrawer";
import RenameDrawer from "./drawers/RenameDrawer";
import MoveDrawer from "./drawers/MoveDrawer";
import ParentFolderMenu from "./ParentFolderMenu";
//import FolderMenu from "./FolderMenu";
// import FileMenu from "./FileMenu";
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
// import { toast } from "material-react-toastify";
import CancelIcon from "@mui/icons-material/Cancel";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import { accountsAPI, accountDocsAPI, invoiceAPI ,esignAPI} from "../services/api";
import { X } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  ChevronDownIcon,
  FolderPlusIcon,
  ArrowUpTrayIcon, // For upload file
  // FolderIcon,       // For upload folder (alternative)
  PencilIcon,
  ArrowRightCircleIcon,
  LockClosedIcon,
  LockOpenIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  DocumentArrowUpIcon, // Alternative for file upload
  // FolderOpenIcon        // Alternative for folder upload
} from "@heroicons/react/24/outline";
import { useToast } from "../hooks/useToast";
const DocsFolderTree = () => {
  const [accountId, setAccountId] = useState(
    sessionStorage.getItem("accountId"),
  );
  const SIGNATURE_API = process.env.REACT_APP_ESIGNATURE_API;
  console.log("acount id for the documentation", accountId);
  const [error, setError] = useState("");
  const toast = useToast();
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
    const [selectedItemForPopover, setSelectedItemForPopover] = useState(null);
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
        selectedItems.has(path),
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
        setError(
          "Error fetching folder tree: " + (err.message || "Unknown error"),
        );
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
      const isClientUploadedDocs =
        item.name?.toLowerCase() === "client uploaded documents";
      setSelectedItemForPopover({
        ...item,
        isFile: item.type === "file",
        isFolder: item.type === "folder",
        isParent:
          (!item.path.includes("/") && item.type === "folder") ||
          isClientUploadedDocs,
      });
    };
    const handleMenuClose = () => {
      setSelectedItemForPopover(null);
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
      reason = "",
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
        `Are you sure you want to move ${selectedItems.size} item(s) to trash?`,
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
            `${data.trashedItems.length} item(s) moved to trash successfully`,
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
        `Are you sure you want to move "${item.name}" to Trash?`,
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
          invoiceAPI.getInvoiceListById(id),
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
    const response = await esignAPI.getSignatureById(meta.esignRequestId);

    const result = response.data;
    console.log("Signature details:", result);

    const submission = result;

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
        // if (meta.esignRequestId && meta.signStatus === "pendingSignature") {
        //   try {
        //     const response = await fetch(
        //       `https://www.snptaxes.com/signature/byid/${meta.esignRequestId}`,
        //       {
        //         method: "GET",
        //         redirect: "follow",
        //       },
        //     );
        //     const result = await response.json();
        //     console.log("Signature details:", result);
        //     const submission = result;
        //     console.log("Full Submission:", submission);
        //     if (
        //       !submission.submitters ||
        //       !Array.isArray(submission.submitters)
        //     ) {
        //       console.error("No submitters array found in response");
        //       alert("Error loading signature request: Invalid data structure");
        //       return;
        //     }
        //     const matchingSubmitters = submission.submitters
        //       .map((s) => ({
        //         slug: s.slug,
        //         email: s.email,
        //         submissionId: s.submission_id,
        //         templateName: s.name,
        //         createdAt: submission.createdAt,
        //         fileUrl: submission.fileUrl,
        //         externalId: submission.externalId,
        //         submissionData: submission,
        //         status: s.status,
        //         completed_at: s.completed_at,
        //         role: s.role,
        //         allCompleted: submission.submitters.every(
        //           (submitter) =>
        //             submitter.status === "completed" ||
        //             submitter.completed_at !== null,
        //         ),
        //       }))
        //       .filter((s) => s.email === targetEmail && !s.completed_at);
        //     console.log("Matching Submitters:", matchingSubmitters);
        //     if (matchingSubmitters.length > 0) {
        //       const firstSlug = matchingSubmitters[0].slug;
        //       console.log("Opening signature dialog with slug:", firstSlug);
        //       openSignatureDialog(firstSlug);
        //     } else {
        //       const userSubmitters = submission.submitters.filter(
        //         (s) => s.email === targetEmail,
        //       );
        //       if (userSubmitters.length > 0) {
        //         const completedSubmitter = userSubmitters[0];
        //         if (completedSubmitter.completed_at) {
        //           alert("You have already signed this document.");
        //           setTimeout(() => {
        //             openDocument(fullPath, fileName);
        //           }, 500);
        //         } else {
        //           alert(
        //             "You are not authorized to sign this document at this time.",
        //           );
        //         }
        //       } else {
        //         alert("You are not listed as a signer for this document.");
        //       }
        //     }
        //   } catch (error) {
        //     console.error("Error fetching signature details:", error);
        //     alert("Error loading signature request.");
        //   }
        //   return;
        // }
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
          cancelReason,
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
              color === "orange"
                ? "border-orange-500 text-orange-700 bg-orange-50"
                : color === "green"
                  ? "border-green-500 text-green-700 bg-green-50"
                  : "border-gray-500 text-gray-700 bg-gray-50"
            }`}
          >
            {statusTextMap[meta.signStatus]}
          </span>,
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
            <div
              className="relative inline-block group"
              key="approvalCanceledChip"
            >
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
                color === "orange"
                  ? "border-orange-500 text-orange-700 bg-orange-50"
                  : color === "green"
                    ? "border-green-500 text-green-700 bg-green-50"
                    : color === "red"
                      ? "border-red-500 text-red-700 bg-red-50"
                      : "border-gray-500 text-gray-700 bg-gray-50"
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
              color === "orange"
                ? "border-orange-500 text-orange-700 bg-orange-50"
                : color === "green"
                  ? "border-green-500 text-green-700 bg-green-50"
                  : "border-gray-500 text-gray-700 bg-gray-50"
            }`}
          >
            {invoiceStatusTextMap[meta.lockInvoiceStatus]}
          </span>,
        );
      }
      if (chips.length === 0) return null;
      return <div className="flex gap-1">{chips}</div>;
    };

    const findNewSystemTag = (item) => {
      console.log("Finding 'New' tag in item:", item);
      const newTag = item.meta?.newTags?.find(
        (tag) => tag.isSystemTag && tag.tagName === "New",
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

    // Helper function to get menu items based on item type
    const getMenuItems = (item) => {
      if (item.isParent) {
        return [
          {
            name: "Create New Folder",
            icon: FolderPlusIcon,
            action: "createFolder",
            color: "text-blue-600",
          },
        ];
      }

      if (item.isFile) {
        const isLocked = item.meta?.readOnly === true;
        return [
          {
            name: "Rename",
            icon: PencilIcon,
            action: "rename",
            disabled: isLocked,
            color: "text-gray-600",
          },
          {
            name: "Move",
            icon: ArrowRightCircleIcon,
            action: "move",
            disabled: isLocked,
            color: "text-gray-600",
          },
          {
            name: "Download",
            icon: ArrowDownTrayIcon,
            action: "download",
            disabled: isLocked,
            color: "text-gray-600",
          },
          { separator: true },
          {
            name: "Delete",
            icon: TrashIcon,
            action: "delete",
            disabled: isLocked,
            color: "text-red-600",
          },
        ];
      }

      if (item.isFolder) {
        const isLocked = item.meta?.readOnly === true;
        const isRead = item.meta?.readStatus === true;
        return [
          {
            name: "New Folder",
            icon: FolderPlusIcon,
            action: "createFolder",
            disabled: isLocked,
            color: "text-blue-600",
          },
          {
            name: "Upload File",
            icon: ArrowUpTrayIcon,
            action: "uploadFile",
            disabled: isLocked,
            color: "text-emerald-600",
          },
          {
            name: "Upload Folder",
            icon: FolderIcon,
            action: "uploadFolder",
            disabled: isLocked,
            color: "text-amber-600",
          },
          { separator: true },
          {
            name: "Rename",
            icon: PencilIcon,
            action: "rename",
            disabled: isLocked,
            color: "text-indigo-600",
          },
          {
            name: "Move",
            icon: ArrowRightCircleIcon,
            action: "move",
            disabled: isLocked,
            color: "text-purple-600",
          },
          { separator: true },
          {
            name: isRead ? "Mark as Unread" : "Mark as Read",
            icon: isRead ? LockOpenIcon : LockClosedIcon,
            action: "toggleReadStatus",
            disabled: isLocked,
            color: isRead ? "text-green-600" : "text-red-600",
          },
          {
            name: isLocked ? "Unlock" : "Lock",
            icon: LockClosedIcon,
            action: "toggleReadOnly",
            disabled: isLocked,
            color: "text-amber-600",
          },
          { separator: true },
          {
            name: "Delete",
            icon: TrashIcon,
            action: "delete",
            disabled: isLocked,
            color: "text-red-600",
          },
        ];
      }

      return [];
    };
    const [selectedItemForDrawer, setSelectedItemForDrawer] = useState(null);
    // Handle menu actions
    // Update handleMenuAction
    const handleMenuAction = (action) => {
      if (!selectedItemForPopover) return;

      // Store the selected item for the drawer
      setSelectedFolderForMenu(selectedItemForPopover);

      switch (action) {
        case "createFolder":
          setNewFolderDrawerOpen(true);
          break;
        case "rename":
          SetRenameDrawer(true);
          break;
        case "move":
          setMoveDrawerOpen(true);
          break;
        case "delete":
          trashItem(selectedItemForPopover);
          break;
        case "download":
          handleDownloadFile(selectedItemForPopover);
          break;
        case "uploadFile":
          setFileUploadDrawerOpen(true);
          break;
        case "uploadFolder":
          setFolderUploadDrawerOpen(true);
          break;
        case "toggleReadStatus":
          toggleReadStatus(selectedItemForPopover);
          break;
        case "toggleReadOnly":
          toggleReadOnly(selectedItemForPopover);
          break;
        default:
          break;
      }

      setSelectedItemForPopover(null);
    };
    const renderTableRows = (
      items,
      level = 0,
      parentPath = "",
      isInsideRestricted = false,
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

        // const restrictedFolderName = "firm documents shared with client";

        // const isRootFolder = level === 0 && isFolder;

        // const isFirmDocsRoot =
        //   isRootFolder &&
        //   item.name?.toLowerCase() === restrictedFolderName.toLowerCase();

        // const insideRestricted = isInsideRestricted || isFirmDocsRoot;

        const restrictedFolderName = "firm docs shared with client";

        // Check current item
        const isRestrictedFolder =
          isFolder &&
          item.name?.trim().toLowerCase() ===
            restrictedFolderName.trim().toLowerCase();

        // Propagate restriction to children
        const insideRestricted = isInsideRestricted || isRestrictedFolder;
        // NEW: Check if item is inside restricted folder (for download permission)
        const isInsideFirmDocs = isInsideRestricted;
        // Hide menu for restricted folder and everything inside it
        const hideMenu = insideRestricted;
        // const hideMenu = insideRestricted;
        // NEW: Allow download for files and folders inside restricted folder
        const allowDownload = isInsideFirmDocs && !isRestrictedFolder;

        // Add download handler for restricted folder children
        const handleRestrictedDownload = async (item) => {
          if (item.type === "file") {
            await handleDownloadFile(item);
          } else if (item.type === "folder") {
            // For folders, you might want to zip and download
            await handleDownloadFolder(item);
          }
        };

        // Add folder download handler
        const handleDownloadFolder = async (item) => {
          try {
            const res = await accountDocsAPI.downloadItems({
              paths: item.path,
            });
            const blob = res.data;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${item.name}_${Date.now()}.zip`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Folder download started");
          } catch (err) {
            console.error("Folder download error:", err);
            toast.error("Failed to download folder");
          }
        };

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
            {/* ROW */}
            <tr
              className={`
            group transition-all duration-200
            border-b border-slate-100
            hover:bg-gradient-to-r hover:from-blue-50 hover:to-slate-50
            ${
              isSelected
                ? "bg-blue-50 border-blue-100 shadow-inner"
                : "bg-white"
            }
          `}
              style={{
                cursor: meta.readOnly ? "not-allowed" : "pointer",
              }}
            >
              {/* CHECKBOX */}
              <td className="px-5 py-4 w-[60px] align-middle">
                <div className="flex items-center justify-center">
                  {isFolder ? (
                    <input
                      type="checkbox"
                      className="
                    w-4 h-4 rounded-md
                    border-slate-300
                    text-blue-600
                    focus:ring-2 focus:ring-blue-500
                    disabled:opacity-40
                    transition-all
                  "
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
                      className="
                    w-4 h-4 rounded-md
                    border-slate-300
                    text-blue-600
                    focus:ring-2 focus:ring-blue-500
                    disabled:opacity-40
                    transition-all
                  "
                      checked={isSelected}
                      disabled={insideRestricted || meta.readOnly}
                      onChange={() => {
                        if (insideRestricted || meta.readOnly) return;

                        handleSelectItem(fullPath);
                      }}
                    />
                  )}
                </div>
              </td>

              {/* NAME */}
              <td
                className="px-5 py-4"
                style={{
                  paddingLeft: `${level * 22 + 12}px`,
                }}
              >
                <div className="flex items-center gap-2">
                  {/* FOLDER */}
                  {isFolder ? (
                    <>
                      <button
                        className="
                      h-9 w-9 rounded-xl
                      flex items-center justify-center
                      hover:bg-white hover:shadow-sm
                      border border-transparent
                      hover:border-slate-200
                      transition-all duration-200
                      disabled:opacity-50
                    "
                        onClick={() => toggleFolder(fullPath, meta.readOnly)}
                        disabled={meta.readOnly}
                      >
                        {expandedFolders[fullPath] ? (
                          <FolderOpenIcon color="#2563eb" className="w-5 h-5" />
                        ) : (
                          <FolderClosedIcon
                            color="#64748b"
                            className="w-5 h-5"
                          />
                        )}
                      </button>

                      <div
                        className="flex items-center flex-wrap gap-2"
                        onClick={() => toggleFolder(fullPath, meta.readOnly)}
                      >
                        <span
                          className={`
                        text-sm font-semibold tracking-tight
                        ${meta.readOnly ? "text-slate-400" : "text-slate-700"}
                      `}
                        >
                          {item.name}
                        </span>

                        {/* TAG */}
                        {inheritedNewTag && (
                          <span
                            className="
                          inline-flex items-center
                          px-2 py-1 rounded-full
                          text-[10px] font-semibold
                          text-white shadow-sm
                        "
                            style={{
                              backgroundColor: inheritedNewTag.tagColour,
                            }}
                          >
                            {inheritedNewTag.tagName}
                          </span>
                        )}

                        {/* LOCK */}
                        {meta.readOnly && (
                          <span
                            className="
                          inline-flex items-center
                          px-2 py-0.5 rounded-full
                          bg-red-50 text-red-600
                          border border-red-200
                          text-[10px] font-semibold
                        "
                          >
                            Locked
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* FILE ICON */}
                      <div
                        className="
                      h-10 w-10 rounded-xl
                      bg-slate-50 border border-slate-200
                      flex items-center justify-center
                      shadow-sm
                      group-hover:bg-white
                    "
                      >
                        {getFileIcon(item.name)}
                      </div>

                      {/* FILE DETAILS */}
                      <div className="flex flex-col gap-1">
                        <span
                          className={`
                        text-sm font-medium transition-all
                        ${
                          meta.readOnly
                            ? "text-slate-400"
                            : "text-blue-700 hover:text-blue-800"
                        }
                      `}
                          onClick={handleSafeFileClick}
                          style={{
                            cursor: meta.readOnly ? "not-allowed" : "pointer",
                          }}
                        >
                          {item.name}
                        </span>

                        {/* TAGS */}
                        <div className="flex flex-wrap gap-1">
                          {meta.newTags?.map((tag, index) => (
                            <span
                              key={index}
                              className="
                              inline-flex items-center
                              px-2 py-0.5 rounded-full
                              text-[10px] font-semibold
                              text-white shadow-sm
                            "
                              style={{
                                backgroundColor: tag.tagColour,
                              }}
                            >
                              {tag.tagName}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </td>

              {/* STATUS */}
              <td className="px-5 py-4 align-middle">
                <div className="flex items-center">
                  {getStatusChip(meta, isFolder)}
                </div>
              </td>

              {/* UPLOADED DATE */}
              <td className="px-5 py-4 align-middle">
                <div
                  className="
                inline-flex items-center
                px-3 py-1 rounded-full
                bg-slate-100
                text-slate-600
                text-xs font-semibold
              "
                >
                  <UploadedInfo meta={meta} />
                </div>
              </td>

              {/* USER */}
              <td className="px-5 py-4 align-middle">
                <div className="flex items-center gap-2">
                  <div
                    className="
                  h-9 w-9 rounded-full
                  bg-gradient-to-br from-blue-500 to-indigo-600
                  text-white text-xs font-bold
                  flex items-center justify-center
                  shadow-md
                "
                  >
                    {meta.uploadedBy?.charAt(0)?.toUpperCase() || "S"}
                  </div>

                  <span className="text-sm font-medium text-slate-700">
                    {meta.uploadedBy || "System"}
                  </span>
                </div>
              </td>

              {/* ACTIONS */}

              <td className="px-5 py-4 text-right align-middle">
                {!hideMenu && (
                  <Popover className="relative">
                    {({ open, close }) => (
                      <>
                        <PopoverButton
                          as="button"
                          className="
              h-10 w-10 rounded-xl
              hover:bg-white hover:shadow-md
              border border-transparent
              hover:border-slate-200
              transition-all duration-200
              flex items-center justify-center
              opacity-70 group-hover:opacity-100
            "
                          onClick={(e) => {
                            e.stopPropagation();
                            // Set the selected item when button is clicked
                            const isClientUploadedDocs =
                              item.name?.toLowerCase() ===
                              "client uploaded documents";
                            setSelectedItemForPopover({
                              ...item,
                              fullPath: fullPath,
                              isFile: item.type === "file",
                              isFolder: item.type === "folder",
                              isParent:
                                (!item.path.includes("/") &&
                                  item.type === "folder") ||
                                isClientUploadedDocs,
                            });
                          }}
                        >
                          <EllipsisVertical className="w-5 h-5 text-slate-500" />
                        </PopoverButton>

                        {/* Only render PopoverPanel when we have a selected item */}
                        {selectedItemForPopover && (
                          <PopoverPanel
                            transition
                            anchor="bottom end"
                            className="
                z-20 mt-2 w-56 origin-top-right 
                rounded-2xl bg-white 
                shadow-xl ring-1 ring-slate-900/5
                transition duration-200 ease-out
                data-closed:scale-95 data-closed:opacity-0
                data-enter:scale-100 data-enter:opacity-100
              "
                          >
                            {({ close: closePanel }) => (
                              <div className="p-1.5">
                                {getMenuItems(selectedItemForPopover).map(
                                  (menuItem, idx) =>
                                    menuItem.separator ? (
                                      <div
                                        key={`separator-${idx}`}
                                        className="my-1 border-t border-slate-100"
                                      />
                                    ) : (
                                      <button
                                        key={menuItem.name}
                                        disabled={menuItem.disabled}
                                        onClick={() => {
                                          handleMenuAction(menuItem.action);
                                          closePanel();
                                          close();
                                        }}
                                        className={`
                          flex w-full items-center gap-3 
                          rounded-xl px-3 py-2.5 text-sm
                          transition-all duration-150
                          ${
                            menuItem.disabled
                              ? "opacity-50 cursor-not-allowed text-slate-400"
                              : "hover:bg-slate-50 text-slate-700"
                          }
                        `}
                                      >
                                        <menuItem.icon
                                          className={`h-5 w-5 ${menuItem.color || "text-slate-500"} ${menuItem.disabled ? "opacity-50" : ""}`}
                                        />
                                        <span
                                          className={`font-medium ${menuItem.disabled ? "" : ""}`}
                                        >
                                          {menuItem.name}
                                        </span>
                                      </button>
                                    ),
                                )}
                              </div>
                            )}
                          </PopoverPanel>
                        )}
                      </>
                    )}
                  </Popover>
                )}
 {/* NEW: Show download button for items inside Firm docs */}
            {allowDownload && (
              <button
                className="
                  h-10 w-10 rounded-xl
                  hover:bg-white hover:shadow-md
                  border border-transparent
                  hover:border-slate-200
                  transition-all duration-200
                  flex items-center justify-center
                  opacity-70 group-hover:opacity-100
                "
                onClick={(e) => {
                  e.stopPropagation();
                  handleRestrictedDownload(item);
                }}
                title={`Download ${item.type === 'folder' ? 'folder' : 'file'}`}
              >
                <DownloadIcon className="w-5 h-5 text-emerald-600" />
              </button>
            )}

              </td>
            </tr>

            {/* CHILDREN */}
            {isFolder &&
              expandedFolders[fullPath] &&
              item.children &&
              item.children.length > 0 &&
              renderTableRows(
                item.children,
                level + 1,
                fullPath,
                insideRestricted,
              )}
          </React.Fragment>
        );
      });
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                  Document Management
                </h1>
                <p className="text-slate-500 mt-1 text-sm">
                  Manage folders, files, approvals, signatures and invoices
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  className="group h-12 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={() => {
                    setNewFolderDrawerOpen(true);
                    handleMenuClose();
                  }}
                >
                  <FolderIcon className="w-5 h-5 group-hover:rotate-3 transition-transform" />
                  <span>Create Folder</span>
                </button>

                <button
                  className="group h-12 px-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={() => setFileUploadDrawerOpen(true)}
                >
                  <UploadFileIcon className="w-5 h-5 text-blue-600" />
                  <span>Upload File</span>
                </button>

                <button
                  className="group h-12 px-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={() => setFolderUploaDrawerOpen(true)}
                >
                  <DriveFolderUploadIcon className="w-5 h-5 text-blue-600" />
                  <span>Upload Folder</span>
                </button>

                <button
                  className="group h-12 px-4 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={handleTrashClick}
                >
                  <DeleteIcon className="w-5 h-5" />
                  <span>Trash</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Operations */}
          {selectedItems.size > 0 && (
            <div className="bg-white/80 backdrop-blur-xl border border-blue-100 rounded-3xl shadow-lg p-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-blue-100 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800">
                      {selectedItems.size} item(s) selected
                    </p>
                    <p className="text-sm text-slate-500">
                      Perform bulk actions on selected documents
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    className="h-11 px-5 rounded-2xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all flex items-center gap-2 shadow-md"
                    onClick={() => setBulkMoveDrawerOpen(true)}
                    disabled={bulkOperationLoading}
                  >
                    <DriveFileMoveIcon className="w-4 h-4" />
                    Move
                  </button>

                  <button
                    className="h-11 px-5 rounded-2xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all flex items-center gap-2 shadow-md"
                    onClick={handleBulkTrash}
                    disabled={bulkOperationLoading}
                  >
                    <DeleteIcon className="w-4 h-4" />
                    Delete
                  </button>

                  <button
                    className="h-11 px-5 rounded-2xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-md"
                    onClick={handleBulkDownload}
                    disabled={bulkOperationLoading}
                  >
                    <DownloadIcon className="w-4 h-4" />
                    Download
                  </button>

                  <button
                    className="h-11 px-5 rounded-2xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-all"
                    onClick={() => setSelectedItems(new Set())}
                    disabled={bulkOperationLoading}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Folder Explorer */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl overflow-hidden">
            {/* Explorer Header */}
            <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <FolderOpenIcon className="w-6 h-6 text-blue-600" />
                    Folder Explorer
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Browse and manage your documents
                  </p>
                </div>

                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-600">
                    Synced
                  </span>
                </div>
              </div>
            </div>

            {folderTree && folderTree.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                  {/* Table Head */}
                  <thead className="sticky top-0 z-10 bg-white/90 backdrop-blur-md">
                    <tr>
                      <th className="w-[60px] px-5 py-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        Name
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        Uploaded
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        Uploaded By
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="divide-y divide-slate-100">
                    {renderTableRows(folderTree)}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center mb-5">
                  <FolderOpenIcon className="w-12 h-12 text-slate-400" />
                </div>

                <h3 className="text-lg font-semibold text-slate-700">
                  Loading folder data...
                </h3>

                <p className="text-slate-500 mt-1">
                  Please wait while documents are being fetched
                </p>
              </div>
            )}
          </div>
        </div>

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

                    <p className="text-sm text-slate-500">
                      Review and approve document
                    </p>
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
                    No document selected
                  </div>
                )}
              </div>

              {selectedDoc && (
                <div className="flex justify-end gap-3 p-5 border-t border-slate-200 bg-white">
                  <button
                    className="h-12 px-6 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 font-medium transition-all"
                    onClick={handleCancelClick}
                  >
                    Disapprove
                  </button>

                  <button
                    className="h-12 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg transition-all"
                    onClick={() =>
                      handleApprovalAction(selectedDoc._id, "approve")
                    }
                  >
                    Approve Document
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= CANCEL DIALOG ================= */}
        <dialog
          open={cancelDialogOpen}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
          style={{ display: cancelDialogOpen ? "flex" : "none" }}
        >
          <div className="w-full max-w-lg bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">
                Cancel Approval
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Please provide a reason for rejection
              </p>
            </div>

            <div className="p-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description
              </label>

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
        </dialog>

        {/* ================= SIGNATURE DIALOG ================= */}
        {/* ================= SIGNATURE DIALOG ================= */}
        {dialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
            <div className="w-full max-w-6xl bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-white to-slate-50">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    Digital Signature
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Complete your signature process securely
                  </p>
                </div>

                <button
                  onClick={handleCloseDialog}
                  className="h-11 w-11 rounded-2xl hover:bg-slate-100 flex items-center justify-center transition-all"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Content */}
              <div className="h-[82vh] overflow-hidden bg-slate-100">
                {selectedSlug && (
                  <div className="w-full h-full bg-white">
                    <DocusealForm
                      src={`https://docuseal.com/s/${selectedSlug}`}
                      email={targetEmail}
                      // onComplete={async (data) => {
                      //   console.log("Post-sign data:", data);

                      //   try {
                      //     const updateSubmitterRes = await fetch(
                      //       `${SIGNATURE_API}/signautrelist/update-submitter/${data.template.external_id}`,
                      //       {
                      //         method: "PATCH",
                      //         headers: { "Content-Type": "application/json" },
                      //         body: JSON.stringify({
                      //           submitterEmail: targetEmail,
                      //           submissionId: data.submission_id,
                      //         }),
                      //       },
                      //     );

                      //     const updateData = await updateSubmitterRes.json();

                      //     if (updateData.success) {
                      //       console.log(
                      //         "✅ Document replaced with latest signature",
                      //       );

                      //       if (updateData.allCompleted) {
                      //         console.log(
                      //           "🎉 All submitters have completed signing!",
                      //         );

                      //         const fullPath = decodeURIComponent(
                      //           updateData.esignRecord.fileUrl.split(
                      //             "/uploads/accounts/",
                      //           )[1],
                      //         );

                      //         console.log("Full file path:", fullPath);

                      //         await updateStatus(
                      //           { path: fullPath },
                      //           "signStatus",
                      //           "signatureCompleted",
                      //         );

                      //         await fetch(`${SIGNATURE_API}/notify-admin`, {
                      //           method: "POST",
                      //           headers: { "Content-Type": "application/json" },
                      //           body: JSON.stringify({
                      //             clientName: targetEmail,
                      //             documentName: selectedSlug,
                      //             message: "All parties have completed signing",
                      //             accountId: accountId,
                      //           }),
                      //         });

                      //         alert(
                      //           "All signatures completed! Document has been fully executed.",
                      //         );
                      //       } else {
                      //         console.log(
                      //           `✅ You have signed. Waiting for ${updateData.pendingCount} more signer(s).`,
                      //         );

                      //         alert(
                      //           `Thank you for signing! Waiting for ${updateData.pendingCount} more signer(s) to complete.`,
                      //         );
                      //       }
                      //     } else {
                      //       alert("Error updating signature status.");
                      //     }
                      //   } catch (err) {
                      //     console.error(
                      //       "Error handling post-sign actions",
                      //       err,
                      //     );

                      //     alert("Error while updating sign status.");
                      //   }

                      //   handleCloseDialog();
                      // }}
                      onComplete={async (data) => {
  console.log("Post-sign data:", data);

  try {
    // ✅ 1. Update submitter status (API.js)
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

      if (updateData.allCompleted) {
        console.log("🎉 All submitters have completed signing!");

        const fullPath = decodeURIComponent(
          updateData.esignRecord.fileUrl.split("/uploads/accounts/")[1]
        );

        console.log("Full file path:", fullPath);

        // ✅ 2. Update status via API.js
        await updateStatus(
          { path: fullPath },
          "signStatus",
          "signatureCompleted"
        );

        // ✅ 3. Notify admin via API.js
        await esignAPI.notifyAdmin({
          clientName: targetEmail,
          documentName: selectedSlug,
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
}}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= INVOICE DIALOG ================= */}
        {invoiceDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
            <div className="w-full max-w-2xl bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-white to-slate-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      Invoice Details
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Review associated invoice information
                    </p>
                  </div>

                  <button
                    onClick={() => setInvoiceDialogOpen(false)}
                    className="h-11 w-11 rounded-2xl hover:bg-slate-100 flex items-center justify-center transition-all"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {selectedInvoiceFile?.meta?.invoices?.length ? (
                  <div className="overflow-hidden rounded-2xl border border-slate-200">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">
                            Invoice #
                          </th>

                          <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">
                            Description
                          </th>

                          <th className="px-4 py-3 text-right text-xs font-bold uppercase text-slate-500">
                            Amount
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {selectedInvoiceFile.meta.invoices.map((invoice) => (
                          <tr
                            key={invoice._id}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="px-4 py-4 text-sm font-semibold text-slate-700">
                              {invoice.invoicenumber}
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-600">
                              {invoice.description || "No description"}
                            </td>

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
                    <p className="text-slate-500">
                      No invoices available for this file.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
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
    );
  };

  return (
    <div className="p-6">
      <FolderTreeView accountId={accountId} />
    </div>
  );
};

export default DocsFolderTree;
