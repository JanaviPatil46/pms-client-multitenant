// // import React,{useState} from 'react'
// import React, { useState, useEffect } from "react";
// import {
//   Typography,
//   Box,
//   Paper,
//   IconButton,
//   Menu,
//   MenuItem,
//   TableCell,
//   TableHead,
//   TableRow,
//   TableBody,
//   Table,
//   TableContainer,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
// } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import DeleteIcon from "@mui/icons-material/Delete";
// import RestoreIcon from "@mui/icons-material/Restore";
// import { useParams } from "react-router-dom";
// import {
//   Folder as FolderClosedIcon,
//   FolderOpen as FolderOpenIcon,
// } from "lucide-react";

// import DownloadIcon from "@mui/icons-material/Download";
// import { toast } from "material-react-toastify";
// import {
//   FaFilePdf,
//   FaFileWord,
//   FaFileExcel,
//   FaFileImage,
//   FaFileAlt,
// } from "react-icons/fa";
// import { AiFillFileUnknown } from "react-icons/ai";
// import { accountDocsAPI } from "../services/api";
// const TrashedDocs = () => {
//    const [accountId, setAccountId] = useState(
//       sessionStorage.getItem("accountId")
//     );
//     console.log("accountId in trashed docs",accountId);
//    const FolderTreeView = ({ accountId }) => {
//     const [expandedFolders, setExpandedFolders] = useState({});
//     const [menuAnchorEl, setMenuAnchorEl] = useState(null);
//     const [selectedFolderForMenu, setSelectedFolderForMenu] = useState(null);
//     const [error, setError] = useState(null);
//     const [folderTree, setFolderTree] = useState([]);
//     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//     const [deleteConfirmText, setDeleteConfirmText] = useState("");
//     const [itemToDelete, setItemToDelete] = useState(null);

//     useEffect(() => {
//       fetchFolderTree(accountId);
//     }, [accountId]);

//    const fetchFolderTree = async (accountId) => {
//   try {
//     const res = await accountDocsAPI.listTrashedItems(accountId);

//     console.log("janavi patil", res.data);

//     const data = res.data;

//     if (res.status === 200) {
//       setFolderTree(data.contents?.Client || []);
//     } else {
//       setError("Failed to fetch folder tree");
//     }
//   } catch (err) {
//     console.error(err);
//     setError("Error fetching folder tree");
//   }
// };
//     const toggleFolder = (path, isReadOnly) => {
//       // if (isReadOnly) return;
//       setExpandedFolders((prev) => ({
//         ...prev,
//         [path]: !prev[path],
//       }));
//     };

//     const handleMenuOpen = (event, folder) => {
//       event.stopPropagation();
//       setMenuAnchorEl(event.currentTarget);
//       setSelectedFolderForMenu(folder);
//     };

//     const handleMenuClose = () => {
//       setMenuAnchorEl(null);
//     };

//     // Update getAllChildrenPaths to work with item.path
//     const getAllChildrenPaths = (item) => {
//       const paths = [item.path];
//       if (item.children && item.children.length > 0) {
//         item.children.forEach((child) => {
//           paths.push(...getAllChildrenPaths(child));
//         });
//       }
//       return paths;
//     };

//     const restoreItem = async (item) => {
//   try {
//     const res = await accountDocsAPI.restoreItem({
//       targetPath: item.path,
//     });

//     const data = res.data;

//     if (res.status === 200 && data.success) {
//       toast.success("Item restored successfully");
//       fetchFolderTree(accountId);
//     } else {
//       toast.error(data.message || "Restore failed");
//     }
//   } catch (err) {
//     console.error(err);
//     toast.error("Error restoring item");
//   }
// };
//     const handleDownload = async (item) => {
//       try {
//          const res = await accountDocsAPI.downloadItems({
//            paths: item.path,
//          });
     
//          const blob = res.data;
//          const url = window.URL.createObjectURL(blob);
     
//          const a = document.createElement("a");
//          a.href = url;
//          a.download = item.name || "download";
//          document.body.appendChild(a);
//          a.click();
//          a.remove();
     
//          window.URL.revokeObjectURL(url);
//        } catch (err) {
//          console.error("Download error:", err);
//        }
//     };
//     // 🗑️ Delete File or Folder (Universal)
//     const deleteItem = async (item) => {
//   console.log("Deleting item:", item);

//   if (!item?.path) {
//     toast.error("Invalid path");
//     return;
//   }

//   try {
//     const res = await accountDocsAPI.deleteItem({
//       targetPath: item.path,
//     });

//     const data = res.data;

//     if (res.status === 200 && data.success) {
//       toast.success(data.message || "Deleted successfully");

//       setTimeout(() => {
//         fetchFolderTree(accountId);
//       }, 500);
//     } else {
//       toast.error(data.message || "Failed to delete");
//     }
//   } catch (err) {
//     console.error("Error deleting item:", err);
//     toast.error("Error deleting file or folder");
//   }

//   handleMenuClose();
// };

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
  


// const TrashedInfo = ({ meta }) => {
//   if (!meta?.trash?.trashedAt) return null;

//   const trashedAt = new Date(meta.trash.trashedAt);
//   const now = new Date();

//   const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

//   // Remaining time
//   const diffTime = trashedAt.getTime() + TWO_HOURS_MS - now.getTime();

//   if (diffTime <= 0) {
//     return (
//       <Typography variant="caption" sx={{ fontWeight: "bold", color: "error.main" }}>
//         Deleting soon
//       </Typography>
//     );
//   }

//   const remainingMinutes = Math.ceil(diffTime / (1000 * 60));
//   const hours = Math.floor(remainingMinutes / 60);
//   const minutes = remainingMinutes % 60;

//   // Format trashed date
//   const formattedDate = trashedAt
//     .toLocaleDateString("en-US", {
//       month: "short",
//       day: "2-digit",
//       year: "numeric",
//     })
//     .toUpperCase()
//     .replace(",", "");

//   return (
//     <Typography variant="caption" sx={{ fontWeight: "bold" }}>
//       {formattedDate} (
//       {hours > 0 && `${hours} hr${hours > 1 ? "s" : ""} `}
//       {minutes > 0 && `${minutes} min${minutes > 1 ? "s" : ""}`} left)
//     </Typography>
//   );
// };

//     const findNewSystemTag = (item) => {
//       // console.log("Finding 'New' tag in item:", item);
//       // Check current item
//       const newTag = item.meta?.tags?.find(
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

//     const renderTrashedRows = (items, level = 0, parentPath = "") => {
//       return items.map((item) => {
//         const fullPath = item.path;
//         const meta = item.meta || {};
//         const isFolder = item.type === "folder";

//         const showMenu =
//           level === 0 && (item.type === "folder" || item.type === "file");

//         const getAllChildrenPaths = (item) => {
//           const paths = [item.path];
//           if (item.children && item.children.length > 0) {
//             item.children.forEach((child) => {
//               paths.push(...getAllChildrenPaths(child));
//             });
//           }
//           return paths;
//         };

//         return (
//           <React.Fragment key={fullPath}>
//             <TableRow
//               sx={{
//                 backgroundColor: level % 2 === 0 ? "#fafafa" : "white",
//                 "&:hover": { backgroundColor: "#f5f5f5" },
//               }}
//             >
//               <TableCell sx={{ paddingLeft: level * 4 + 2 }}>
//                 <Box sx={{ display: "flex", alignItems: "center" }}>
//                   {isFolder ? (
//                     <>
//                       <IconButton
//                         size="small"
//                         onClick={() => toggleFolder(fullPath)}
//                         sx={{ mr: 0.5 }}
//                       >
//                         {expandedFolders[fullPath] ? (
//                           <FolderOpenIcon />
//                         ) : (
//                           <FolderClosedIcon />
//                         )}
//                       </IconButton>
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           ml: 0.5,
//                           fontWeight: "medium",
//                           cursor: "pointer",
//                         }}
//                         onClick={() => toggleFolder(fullPath)}
//                       >
//                         {item.name} (Trashed)
//                       </Typography>
//                     </>
//                   ) : (
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                       <Box sx={{ mr: 1 }}>{getFileIcon(item.name)}</Box>
//                       <Typography
//                         variant="body2"
//                         sx={{ cursor: "not-allowed" }}
//                       >
//                         {item.name} (Trashed)
//                       </Typography>
//                     </Box>
//                   )}
//                 </Box>
//               </TableCell>

//               <TableCell>
//                 {level === 0 && <TrashedInfo meta={meta} />}
//               </TableCell>

//               <TableCell align="right">
//                 {showMenu && (
//                   <IconButton
//                     size="small"
//                     onClick={(e) => handleMenuOpen(e, { ...item, fullPath })}
//                   >
//                     <MoreVertIcon />
//                   </IconButton>
//                 )}
//               </TableCell>
//             </TableRow>

//             {isFolder &&
//               expandedFolders[fullPath] &&
//               item.children &&
//               item.children.length > 0 &&
//               renderTrashedRows(item.children, level + 1, fullPath)}
//           </React.Fragment>
//         );
//       });
//     };

//     return (
//       <Box sx={{ margin: "auto", p: 3 }}>
//         <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
//           <Typography variant="h6" gutterBottom>
//             📜 Folder Explorer
//           </Typography>
// <Box
//   sx={{
//     mb: 2,
//     p: 1.5,
//     borderRadius: 1,
//     backgroundColor: "#fff8e1",
//     border: "1px solid #ffe082",
//   }}
// >
//   <Typography variant="body2" sx={{ fontWeight: 500 }}>
//     ⚠️ Items in Trash will be <strong>permanently deleted after 60 days</strong>.
//     <br />
//     Please restore important files or folders before this period.
//   </Typography>
// </Box>
//           {folderTree && folderTree.length > 0 ? (
//             <>
//               <TableContainer>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Name</TableCell>

//                       <TableCell>Trashed</TableCell>

//                       <TableCell align="right">Actions</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>{renderTrashedRows(folderTree)}</TableBody>
//                 </Table>
//               </TableContainer>
//             </>
//           ) : (
//             <Typography sx={{ p: 2, textAlign: "center" }}>
//               🗑️ Trash is empty.
//             </Typography>
//           )}
//         </Paper>
//         <Menu
//           anchorEl={menuAnchorEl}
//           open={Boolean(menuAnchorEl)}
//           onClose={handleMenuClose}
//         >
//           {selectedFolderForMenu && (
//             <>
//               <MenuItem
//                 onClick={() => {
//                   restoreItem(selectedFolderForMenu);
//                   handleMenuClose();
//                 }}
//               >
//                 <RestoreIcon sx={{ mr: 1 }} />
//                 Restore
//               </MenuItem>

//               {/* <MenuItem
//                 onClick={() => {
//                   deleteItem(selectedFolderForMenu);
//                   handleMenuClose();
//                 }}
//                 sx={{ color: "error.main" }}
//               > */}
//               <MenuItem
//                 onClick={() => {
//                   setItemToDelete(selectedFolderForMenu);
//                   setDeleteConfirmText("");
//                   setDeleteDialogOpen(true);
//                   handleMenuClose();
//                 }}
//                 sx={{ color: "error.main" }}
//               >
//                 <DeleteIcon sx={{ mr: 1 }} />
//                 Delete Permanently
//               </MenuItem>
//               <MenuItem
//                 onClick={() => {
//                   handleDownload(selectedFolderForMenu);
//                   handleMenuClose();
//                 }}
//               >
//                 <DownloadIcon sx={{ mr: 1 }} />
//                 Download
//               </MenuItem>
//             </>
//           )}
//         </Menu>

//         <Dialog
//           open={deleteDialogOpen}
//           onClose={() => setDeleteDialogOpen(false)}
//           maxWidth="xs"
//           fullWidth
//         >
//           <DialogTitle sx={{ color: "error.main" }}>
//             Delete Permanently
//           </DialogTitle>

//           <DialogContent>
//             <Typography variant="body2" sx={{ mb: 2 }}>
//               This action <strong>cannot be undone</strong>.
//               <br />
//               Type <strong>DELETE</strong> to confirm permanent deletion of:
//             </Typography>

//             <Typography variant="subtitle2" sx={{ mb: 1 }}>
//               {itemToDelete?.name}
//             </Typography>

//             <TextField
//               autoFocus
//               fullWidth
//               placeholder="Type DELETE"
//               value={deleteConfirmText}
//               onChange={(e) => setDeleteConfirmText(e.target.value)}
//               error={
//                 deleteConfirmText.length > 0 && deleteConfirmText !== "DELETE"
//               }
//               helperText={
//                 deleteConfirmText && deleteConfirmText !== "DELETE"
//                   ? "You must type DELETE exactly"
//                   : " "
//               }
//             />
//           </DialogContent>

//           <DialogActions>
//             <Button
//               onClick={() => setDeleteDialogOpen(false)}
//               variant="outlined"
//             >
//               Cancel
//             </Button>

//             <Button
//               variant="contained"
//               color="error"
//               disabled={deleteConfirmText !== "DELETE"}
//               onClick={async () => {
//                 await deleteItem(itemToDelete);
//                 setDeleteDialogOpen(false);
//                 setItemToDelete(null);
//               }}
//             >
//               Delete Permanently
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     );
//   };
//   return (
//     <Box>
//       <FolderTreeView accountId={accountId} />
//     </Box>
//   );
// }

// export default TrashedDocs

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Folder as FolderClosedIcon,
  FolderOpen as FolderOpenIcon,
} from "lucide-react";
// import { toast } from "material-react-toastify";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
} from "react-icons/fa";
import { AiFillFileUnknown } from "react-icons/ai";
import { accountDocsAPI } from "../services/api";
import { useToast } from "../hooks/useToast";

const TrashedDocs = () => {
  const [accountId, setAccountId] = useState(
    sessionStorage.getItem("accountId")
  );
  const toast =useToast();
  console.log("accountId in trashed docs", accountId);

  const FolderTreeView = ({ accountId }) => {
    const [expandedFolders, setExpandedFolders] = useState({});
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [selectedFolderForMenu, setSelectedFolderForMenu] = useState(null);
    const [error, setError] = useState(null);
    const [folderTree, setFolderTree] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
      fetchFolderTree(accountId);
    }, [accountId]);

    const fetchFolderTree = async (accountId) => {
      try {
        const res = await accountDocsAPI.listTrashedItems(accountId);
        console.log("janavi patil", res.data);
        const data = res.data;
        if (res.status === 200) {
          setFolderTree(data.contents?.Client || []);
        } else {
          setError("Failed to fetch folder tree");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching folder tree");
      }
    };

    const toggleFolder = (path) => {
      setExpandedFolders((prev) => ({
        ...prev,
        [path]: !prev[path],
      }));
    };

    const handleMenuOpen = (event, folder) => {
      event.stopPropagation();
      const rect = event.currentTarget.getBoundingClientRect();
      setMenuAnchorEl({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
      setSelectedFolderForMenu(folder);
    };

    const handleMenuClose = () => {
      setMenuAnchorEl(null);
      setSelectedFolderForMenu(null);
    };

    const restoreItem = async (item) => {
      try {
        const res = await accountDocsAPI.restoreItem({
          targetPath: item.path,
        });
        const data = res.data;
        if (res.status === 200 && data.success) {
          toast.success("Item restored successfully");
          fetchFolderTree(accountId);
        } else {
          toast.error(data.message || "Restore failed");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error restoring item");
      }
      handleMenuClose();
    };

    const handleDownload = async (item) => {
      try {
        const res = await accountDocsAPI.downloadItems({
          paths: item.path,
        });
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
      handleMenuClose();
    };

    const deleteItem = async (item) => {
      console.log("Deleting item:", item);
      if (!item?.path) {
        toast.error("Invalid path");
        return;
      }
      try {
        const res = await accountDocsAPI.deleteItem({
          targetPath: item.path,
        });
        const data = res.data;
        if (res.status === 200 && data.success) {
          toast.success(data.message || "Deleted successfully");
          setTimeout(() => {
            fetchFolderTree(accountId);
          }, 500);
        } else {
          toast.error(data.message || "Failed to delete");
        }
      } catch (err) {
        console.error("Error deleting item:", err);
        toast.error("Error deleting file or folder");
      }
      handleMenuClose();
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

    const TrashedInfo = ({ meta }) => {
      if (!meta?.trash?.trashedAt) return null;

      const trashedAt = new Date(meta.trash.trashedAt);
      const now = new Date();
      const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
      const diffTime = trashedAt.getTime() + TWO_HOURS_MS - now.getTime();

      if (diffTime <= 0) {
        return (
          <span className="font-bold text-red-600 text-xs">
            Deleting soon
          </span>
        );
      }

      const remainingMinutes = Math.ceil(diffTime / (1000 * 60));
      const hours = Math.floor(remainingMinutes / 60);
      const minutes = remainingMinutes % 60;

      const formattedDate = trashedAt
        .toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
        .toUpperCase()
        .replace(",", "")
        .replace(" ", "-");

      return (
        <span className="font-bold text-xs">
          {formattedDate} (
          {hours > 0 && `${hours} hr${hours > 1 ? "s" : ""} `}
          {minutes > 0 && `${minutes} min${minutes > 1 ? "s" : ""}`} left)
        </span>
      );
    };

    const renderTrashedRows = (items, level = 0) => {
      return items.map((item) => {
        const fullPath = item.path;
        const meta = item.meta || {};
        const isFolder = item.type === "folder";
        const showMenu = level === 0 && (item.type === "folder" || item.type === "file");

        return (
          <React.Fragment key={fullPath}>
            <tr className={`${level % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}>
              <td className={`py-3 px-4 border-b border-gray-200`}>
                <div className="flex items-center" style={{ paddingLeft: `${level * 24}px` }}>
                  {isFolder ? (
                    <>
                      <button
                        onClick={() => toggleFolder(fullPath)}
                        className="p-1 mr-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        {expandedFolders[fullPath] ? (
                          <FolderOpenIcon size={20} />
                        ) : (
                          <FolderClosedIcon size={20} />
                        )}
                      </button>
                      <span
                        className="ml-1 font-medium cursor-pointer hover:text-blue-600"
                        onClick={() => toggleFolder(fullPath)}
                      >
                        {item.name} (Trashed)
                      </span>
                    </>
                  ) : (
                    <div className="flex items-center">
                      <div className="mr-2">{getFileIcon(item.name)}</div>
                      <span className="cursor-not-allowed text-gray-700">
                        {item.name} (Trashed)
                      </span>
                    </div>
                  )}
                </div>
              </td>
              <td className="py-3 px-4 border-b border-gray-200">
                {level === 0 && <TrashedInfo meta={meta} />}
              </td>
              <td className="py-3 px-4 border-b border-gray-200 text-right">
                {showMenu && (
                  <button
                    onClick={(e) => handleMenuOpen(e, { ...item, fullPath })}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                )}
              </td>
            </tr>
            {isFolder &&
              expandedFolders[fullPath] &&
              item.children &&
              item.children.length > 0 &&
              renderTrashedRows(item.children, level + 1)}
          </React.Fragment>
        );
      });
    };

    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mt-3">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            📜 Folder Explorer
          </h2>

          <div className="mb-4 p-4 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-sm font-medium text-amber-800">
              ⚠️ Items in Trash will be <strong>permanently deleted after 60 days</strong>.
              <br />
              Please restore important files or folders before this period.
            </p>
          </div>

          {folderTree && folderTree.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                      Name
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                      Trashed
                    </th>
                    <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700 border-b border-gray-200">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {renderTrashedRows(folderTree)}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="p-8 text-center text-gray-500">
              🗑️ Trash is empty.
            </p>
          )}
        </div>

        {/* Custom Tailwind Popover Menu */}
        {menuAnchorEl && (
          <div
            className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[180px] animate-in fade-in zoom-in duration-200"
            style={{
              top: menuAnchorEl.top,
              left: menuAnchorEl.left,
            }}
          >
            <button
              onClick={() => restoreItem(selectedFolderForMenu)}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Restore
            </button>
            <button
              onClick={() => {
                setItemToDelete(selectedFolderForMenu);
                setDeleteConfirmText("");
                setDeleteDialogOpen(true);
                handleMenuClose();
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Permanently
            </button>
            <button
              onClick={() => handleDownload(selectedFolderForMenu)}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
          </div>
        )}

        {/* Custom Delete Confirmation Dialog */}
        {deleteDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-red-600 mb-4">
                  Delete Permanently
                </h3>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-2">
                    This action <strong>cannot be undone</strong>.
                    <br />
                    Type <strong>DELETE</strong> to confirm permanent deletion of:
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mb-4">
                    {itemToDelete?.name}
                  </p>
                  
                  <input
                    type="text"
                    autoFocus
                    placeholder="Type DELETE"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {deleteConfirmText && deleteConfirmText !== "DELETE" && (
                    <p className="text-xs text-red-500 mt-1">
                      You must type DELETE exactly
                    </p>
                  )}
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setDeleteDialogOpen(false);
                      setItemToDelete(null);
                      setDeleteConfirmText("");
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={deleteConfirmText !== "DELETE"}
                    onClick={async () => {
                      await deleteItem(itemToDelete);
                      setDeleteDialogOpen(false);
                      setItemToDelete(null);
                      setDeleteConfirmText("");
                    }}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                      deleteConfirmText === "DELETE"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-red-300 cursor-not-allowed"
                    }`}
                  >
                    Delete Permanently
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <FolderTreeView accountId={accountId} />
    </div>
  );
};

export default TrashedDocs;