// // import React, { useState, useEffect } from "react";
// // import {
// //   Drawer,
// //   Box,
// //   Typography,
// //   TextField,
// //   Button,
// //   List,
// //   ListItem,
// //   ListItemIcon,
// //   ListItemText,
// //   Collapse,
// // } from "@mui/material";
// // import FolderIcon from "@mui/icons-material/Folder";
// // import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// // import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
// // import ExpandLess from "@mui/icons-material/ExpandLess";
// // import ExpandMore from "@mui/icons-material/ExpandMore";
// // import axios from "axios";
// // import { toast } from "material-react-toastify";
// // import {
// //   FaFilePdf,
// //   FaFileWord,
// //   FaFileExcel,
// //   FaFileImage,
// //   FaFileAlt,
// // } from "react-icons/fa";
// // import { AiFillFileUnknown } from "react-icons/ai";
// // import { accountDocsAPI } from "../../services/api";
// // const FileUploadDrawer = ({
// //   isOpen,
// //   onClose,
// //   folderTree,
// //   fetchFolderTree,
// //   selectedFolderForMenu,
// // }) => {
// //   const [file, setFile] = useState(null);
// //   const [selectedFolder, setSelectedFolder] = useState("");
// //   const [message, setMessage] = useState("");
// //   const [files, setFiles] = useState([]);
// //   useEffect(() => {
// //     if (isOpen && selectedFolderForMenu) {
// //       setSelectedFolder(selectedFolderForMenu.path);
// //     } else if (!isOpen) {
// //       setSelectedFolder("");
// //       setFile(null);
// //       setMessage("");
// //     }
// //   }, [isOpen, selectedFolderForMenu]);

// //   // const handleFileChange = (e) => setFile(e.target.files[0]);
// //   const handleFileChange = (e) => {
// //     const selectedFiles = Array.from(e.target.files);
// //     const maxSize = 50 * 1024 * 1024; // 50 MB
// //     const forbiddenTypes = ["video/", "audio/"];

// //     const validFiles = selectedFiles.filter((file) => {
// //       if (file.size > maxSize) {
// //         alert(`❌ ${file.name} exceeds 50 MB limit.`);
// //         return false;
// //       }
// //       if (forbiddenTypes.some((type) => file.type.startsWith(type))) {
// //         alert(`❌ ${file.name} is an audio or video file — not allowed.`);
// //         return false;
// //       }
// //       return true;
// //     });

// //     setFiles(validFiles);
// //   };
// //   const handleFolderSelect = (path) => setSelectedFolder(path);

// //   const handleUpload = async () => {
// //     if (files.length === 0 || !selectedFolder) {
// //       setMessage("Please select files and a folder.");
// //       return;
// //     }

// //     try {
// //       const accountId = sessionStorage.getItem("accountId");
// //       const formData = new FormData();
// //       files.forEach((file) => formData.append("files", file));
// //       formData.append("accountId", accountId);

// //      const res = await accountDocsAPI.uploadFile(
// //       formData,
// //       selectedFolder
// //     );

    
// //  console.log("Upload Response:", res.data); 
// //       setMessage(`✅ ${res.data.message || "Files uploaded successfully"}`);
// //       toast.success(`✅ ${res.data.message || "Files uploaded successfully"}`);
// //       setFiles([]);
// //       onClose();
// //       fetchFolderTree();
// //     } catch (err) {
// //       console.error(err);
// //       setMessage("❌ Error uploading files");
// //     }
// //   };
// //   return (
// //     <Drawer
// //       anchor="right"
// //       open={isOpen}
// //       onClose={onClose}
// //       ModalProps={{
// //         keepMounted: true, // Improves performance on mobile
// //       }}
// //       sx={{
// //         zIndex: (theme) => theme.zIndex.modal + 1, // ensure above dialog
// //         width: 600,
// //       }}
// //     >
// //       <Box sx={{ width: 400, p: 3, height: "100%" }}>
// //         <Typography variant="h6" gutterBottom>
// //           📄 Upload File
// //         </Typography>

// //         <Button
// //           variant="outlined"
// //           component="label"
// //           fullWidth
// //           sx={{ mt: 1, mb: 2 }}
// //         >
// //           {files.length > 0
// //             ? `${files.length} file(s) selected`
// //             : "Select Files"}
// //           <input type="file" hidden multiple onChange={handleFileChange} />
// //         </Button>
// //         <Button
// //           // variant="contained"
// //           color="primary"
// //           fullWidth
// //           onClick={handleUpload}
// //           sx={{
// //             backgroundColor: "text.menu",
// //             color: "primary.contrastText",
// //             "&:hover": {
// //               backgroundColor: "menu.dark",
// //               boxShadow: 1,
// //             },
// //             transition: "background-color 0.2s ease",
// //           }}
// //         >
// //           Upload
// //         </Button>

// //         {message && (
// //           <Typography sx={{ mt: 2, fontWeight: "bold" }}>{message}</Typography>
// //         )}

// //         <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={onClose}>
// //           Close
// //         </Button>

// //         <Box sx={{ mt: 3 }}>
// //           <Typography variant="subtitle1" gutterBottom>
// //             Select Folder from Tree
// //           </Typography>
// //           <FolderTreeSelector
// //             items={folderTree}
// //             onSelect={handleFolderSelect}
// //             selectedFolder={selectedFolder}
// //           />
// //         </Box>
// //       </Box>
// //     </Drawer>
// //   );
// // };

// // const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
// //   const [expanded, setExpanded] = useState({});

// //   const toggleExpand = (path) => {
// //     setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
// //   };
// //   const getFileIcon = (fileName) => {
// //     const ext = fileName.split(".").pop().toLowerCase();

// //     switch (ext) {
// //       case "pdf":
// //         return <FaFilePdf color="#d32f2f" size={18} />;
// //       case "jpg":
// //       case "jpeg":
// //       case "png":
// //       case "gif":
// //         return <FaFileImage color="#1976d2" size={18} />;
// //       case "doc":
// //       case "docx":
// //         return <FaFileWord color="#1565c0" size={18} />;
// //       case "xls":
// //       case "xlsx":
// //         return <FaFileExcel color="#2e7d32" size={18} />;
// //       case "txt":
// //       case "md":
// //         return <FaFileAlt color="#616161" size={18} />;
// //       default:
// //         return <AiFillFileUnknown color="#757575" size={18} />;
// //     }
// //   };
// //   return (
// //     <List disablePadding>
// //       {items?.map((item) => {
// //         if (item.type !== "folder") return null;

// //         // ⛔ Skip displaying this folder completely
// //         if (item.name?.toLowerCase() === "firm documents shared with client")
// //           return null;

// //         const isSelected = selectedFolder === item.path;
// //         const isExpanded = expanded[item.path];

// //         return (
// //           <React.Fragment key={item.path}>
// //             {/* <ListItem
// //               sx={{
// //                 pl: 2 + level * 2,
// //                 bgcolor: isSelected ? "#b2d8ff" : "transparent",
// //                 borderRadius: 1,
// //                 mb: 0.5,
// //                 "&:hover": { bgcolor: "#dbefff", color: "black" },
// //                 cursor: item.meta?.readOnly ? "not-allowed" : "pointer",
// //                 ":disabled": { cursor: "not-allowed" },
// //               }}
// //               onClick={() => {
// //                 if (!item.meta?.readOnly) onSelect(item.path);
// //               }}
// //             > */}
// //             <ListItem
// //   sx={{
// //     pl: 2 + level * 2,
// //     bgcolor: isSelected ? "#b2d8ff" : "transparent",
// //     borderRadius: 1,
// //     mb: 0.5,

// //     cursor: item.meta?.readOnly ? "not-allowed" : "pointer",
// //     opacity: item.meta?.readOnly ? 0.6 : 1,
// //     pointerEvents: item.meta?.readOnly ? "none" : "auto",

// //     "&:hover": {
// //       bgcolor: item.meta?.readOnly ? "transparent" : "#dbefff",
// //       color: "black",
// //     },
// //   }}
// //   onClick={() => {
// //     if (!item.meta?.readOnly) {
// //       onSelect(item.path);
// //     }
// //   }}
// // >

// //               <ListItemIcon
// //                 onClick={(e) => {
// //                   e.stopPropagation();
// //                   toggleExpand(item.path);
// //                 }}
// //               >
// //                 {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
// //               </ListItemIcon>

// //               <ListItemText
// //                 primary={item.name}
// //                 sx={{
// //                   fontWeight: isSelected ? "bold" : "normal",
// //                   color: isSelected ? "#0056b3" : "inherit",
// //                 }}
// //               />

// //               {item.children?.length > 0 &&
// //                 (isExpanded ? (
// //                   <ExpandLess
// //                     onClick={(e) => {
// //                       e.stopPropagation();
// //                       toggleExpand(item.path);
// //                     }}
// //                   />
// //                 ) : (
// //                   <ExpandMore
// //                     onClick={(e) => {
// //                       e.stopPropagation();
// //                       toggleExpand(item.path);
// //                     }}
// //                   />
// //                 ))}
// //             </ListItem>

// //             {item.children?.length > 0 && (
// //               <Collapse in={isExpanded} timeout="auto" unmountOnExit>
// //                 <FolderTreeSelector
// //                   items={item.children}
// //                   onSelect={onSelect}
// //                   selectedFolder={selectedFolder}
// //                   level={level + 1}
// //                 />
// //                 {/* {item.meta?.files?.length > 0 && (
// //                   <List sx={{ pl: 4 }}>
// //                     {item.meta.files.map((file) => (
// //                       <ListItem key={file.name} sx={{ pl: 2 }}>
// //                         <ListItemIcon>
// //                           <Box sx={{ mr: 1 }}>{getFileIcon(file.name)}</Box>
// //                         </ListItemIcon>
// //                         <ListItemText
// //                           primary={`${file.name}${
// //                             file.readOnly ? " (Read Only)" : ""
// //                           }`}
// //                         />
// //                       </ListItem>
// //                     ))}
// //                   </List>
// //                 )} */}
// //               </Collapse>
// //             )}
// //           </React.Fragment>
// //         );
// //       })}
// //     </List>
// //   );
// // };

// // export default FileUploadDrawer;

// import React, { useState, useEffect } from "react";
// import { useToast } from "../../hooks/useToast";
// import {
//   FaFilePdf,
//   FaFileWord,
//   FaFileExcel,
//   FaFileImage,
//   FaFileAlt,
// } from "react-icons/fa";
// import { AiFillFileUnknown } from "react-icons/ai";
// import { accountDocsAPI } from "../../services/api";

// const FileUploadDrawer = ({
//   isOpen,
//   onClose,
//   folderTree,
//   fetchFolderTree,
//   selectedFolderForMenu,
// }) => {
//   const toast=useToast()
//   const [file, setFile] = useState(null);
//   const [selectedFolder, setSelectedFolder] = useState("");
//   const [message, setMessage] = useState("");
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     if (isOpen && selectedFolderForMenu) {
//       setSelectedFolder(selectedFolderForMenu.path);
//     } else if (!isOpen) {
//       setSelectedFolder("");
//       setFile(null);
//       setMessage("");
//       setFiles([]);
//     }
//   }, [isOpen, selectedFolderForMenu]);

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     const maxSize = 50 * 1024 * 1024; // 50 MB
//     const forbiddenTypes = ["video/", "audio/"];

//     const validFiles = selectedFiles.filter((file) => {
//       if (file.size > maxSize) {
//         alert(`❌ ${file.name} exceeds 50 MB limit.`);
//         return false;
//       }
//       if (forbiddenTypes.some((type) => file.type.startsWith(type))) {
//         alert(`❌ ${file.name} is an audio or video file — not allowed.`);
//         return false;
//       }
//       return true;
//     });

//     setFiles(validFiles);
//   };

//   const handleFolderSelect = (path) => setSelectedFolder(path);

//   const handleUpload = async () => {
//     if (files.length === 0 || !selectedFolder) {
//       setMessage("Please select files and a folder.");
//       return;
//     }

//     try {
//       const accountId = sessionStorage.getItem("accountId");
//       const formData = new FormData();
//       files.forEach((file) => formData.append("files", file));
//       formData.append("accountId", accountId);

//       const res = await accountDocsAPI.uploadFile(
//         formData,
//         selectedFolder
//       );

//       console.log("Upload Response:", res.data);
//       setMessage(`✅ ${res.data.message || "Files uploaded successfully"}`);
//       toast.success(`✅ ${res.data.message || "Files uploaded successfully"}`);
//       setFiles([]);
//       onClose();
//       fetchFolderTree();
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Error uploading files");
//     }
//   };

//   return (
//     <>
//       {/* BACKDROP */}
//       {isOpen && (
//         <div
//           onClick={onClose}
//           className="
//             fixed inset-0 z-40
//             bg-black/50 backdrop-blur-sm
//             transition-opacity duration-200
//           "
//         />
//       )}

//       {/* DRAWER */}
//       <div
//         className={`
//           fixed top-0 right-0 z-50 h-full
//           w-full sm:w-[640px] md:w-[520px]
//           bg-white text-gray-900
//           border-l border-gray-200
//           shadow-lg
//           flex flex-col
//           transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
//           ${isOpen ? "translate-x-0" : "translate-x-full"}
//         `}
//       >
//         {/* HEADER */}
//         <div className="
//           flex items-center justify-between
//           px-6 py-4
//           border-b border-gray-200
//         ">
//           <div className="flex flex-col">
//             <h2 className="text-sm font-semibold text-gray-900">
//               📄 Upload File
//             </h2>
//             <p className="text-xs text-gray-500">
//               Upload documents to your selected folder
//             </p>
//           </div>

//           <button
//             onClick={onClose}
//             className="
//               p-1.5 rounded-md
//               text-gray-500
//               hover:bg-gray-100 hover:text-gray-900
//               transition
//             "
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         {/* BODY */}
//         <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
//           {/* FILE SELECTION */}
//           <div className="space-y-1.5">
//             <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//               Select Files
//             </label>

//             <div className="flex items-center gap-3">
//               <label
//                 className="
//                   flex-1 inline-flex items-center justify-center
//                   rounded-md px-4 py-2 text-sm font-medium
//                   border border-gray-300 bg-white text-gray-700
//                   hover:bg-gray-50 hover:border-gray-400
//                   transition cursor-pointer
//                 "
//               >
//                 {files.length > 0
//                   ? `${files.length} file(s) selected`
//                   : "Choose Files"}
//                 <input
//                   type="file"
//                   hidden
//                   multiple
//                   onChange={handleFileChange}
//                 />
//               </label>
//             </div>

//             {/* Selected files list */}
//             {files.length > 0 && (
//               <div className="mt-2 space-y-1">
//                 {files.map((file, index) => (
//                   <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
//                     <span className="text-blue-600">📎</span>
//                     {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* MESSAGE DISPLAY */}
//           {message && (
//             <div className={`
//               text-sm p-3 rounded-md
//               ${message.includes("✅") ? "bg-green-50 text-green-700 border border-green-200" : ""}
//               ${message.includes("❌") ? "bg-red-50 text-red-700 border border-red-200" : ""}
//               ${!message.includes("✅") && !message.includes("❌") ? "bg-yellow-50 text-yellow-700 border border-yellow-200" : ""}
//             `}>
//               {message}
//             </div>
//           )}

//           {/* FOLDER SELECTION */}
//           <div className="space-y-1.5">
//             <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//               Select Folder from Tree
//             </label>
            
//             <div className="
//               rounded-md border border-gray-200
//               bg-gray-50
//               max-h-96 overflow-y-auto
//               p-2
//             ">
//               <FolderTreeSelector
//                 items={folderTree}
//                 onSelect={handleFolderSelect}
//                 selectedFolder={selectedFolder}
//               />
//             </div>
            
//             {selectedFolder && (
//               <p className="text-xs text-blue-600 mt-1">
//                 Selected: {selectedFolder}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* FOOTER */}
//         <div className="
//           border-t border-gray-200
//           px-6 py-4
//           flex items-center justify-end gap-3
//           bg-white
//         ">
//           <button
//             onClick={onClose}
//             className="
//               text-sm font-medium
//               text-gray-600
//               hover:text-gray-900
//               transition
//               px-3 py-1.5 rounded-md
//               hover:bg-gray-100
//             "
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleUpload}
//             className="
//               inline-flex items-center justify-center
//               rounded-md px-4 py-1.5 text-sm font-medium
//               bg-blue-600 text-white
//               hover:bg-blue-700
//               transition
//               shadow-sm
//             "
//           >
//             Upload Files
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
//   const [expanded, setExpanded] = useState({});

//   const toggleExpand = (path) => {
//     setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
//   };

//   const getFileIcon = (fileName) => {
//     const ext = fileName.split(".").pop().toLowerCase();

//     switch (ext) {
//       case "pdf":
//         return <FaFilePdf color="#d32f2f" size={18} />;
//       case "jpg":
//       case "jpeg":
//       case "png":
//       case "gif":
//         return <FaFileImage color="#1976d2" size={18} />;
//       case "doc":
//       case "docx":
//         return <FaFileWord color="#1565c0" size={18} />;
//       case "xls":
//       case "xlsx":
//         return <FaFileExcel color="#2e7d32" size={18} />;
//       case "txt":
//       case "md":
//         return <FaFileAlt color="#616161" size={18} />;
//       default:
//         return <AiFillFileUnknown color="#757575" size={18} />;
//     }
//   };

//   return (
//     <ul className="list-none m-0 p-0 space-y-0.5">
//       {items?.map((item) => {
//         if (item.type !== "folder") return null;

//         // ⛔ Skip displaying this folder completely
//         if (item.name?.toLowerCase() === "firm documents shared with client")
//           return null;

//         const isSelected = selectedFolder === item.path;
//         const isExpanded = expanded[item.path];
//         const hasChildren = item.children?.length > 0;
//         const isReadOnly = item.meta?.readOnly;

//         return (
//           <React.Fragment key={item.path}>
//             <li>
//               <div
//                 className={`
//                   rounded-md transition-all duration-200
//                   ${isReadOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
//                   ${isSelected && !isReadOnly ? 'bg-blue-100' : !isReadOnly ? 'hover:bg-gray-100' : ''}
//                 `}
//                 style={{ paddingLeft: `${level * 12}px` }}
//                 onClick={() => {
//                   if (!isReadOnly) {
//                     onSelect(item.path);
//                   }
//                 }}
//               >
//                 <div className="flex items-center py-1.5 px-2 gap-1">
//                   {/* Expand/Collapse Button */}
//                   {hasChildren && (
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         toggleExpand(item.path);
//                       }}
//                       className="p-0.5 rounded hover:bg-gray-200 transition"
//                       disabled={isReadOnly}
//                     >
//                       {isExpanded ? (
//                         <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                         </svg>
//                       ) : (
//                         <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                         </svg>
//                       )}
//                     </button>
//                   )}

//                   {/* Spacer if no children */}
//                   {!hasChildren && <div className="w-5" />}

//                   {/* Folder Icon */}
//                   <svg className={`w-4 h-4 flex-shrink-0 ${isReadOnly ? 'text-gray-400' : 'text-yellow-600'}`} fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
//                   </svg>

//                   {/* Folder Name */}
//                   <span className={`
//                     text-sm flex-1
//                     ${isSelected && !isReadOnly ? 'font-semibold text-blue-700' : isReadOnly ? 'text-gray-400' : 'text-gray-700'}
//                   `}>
//                     {item.name}
//                   </span>

//                   {/* Read-only badge */}
//                   {isReadOnly && (
//                     <span className="text-xs text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">
//                       Read Only
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* Children */}
//               {hasChildren && isExpanded && (
//                 <div className="mt-0.5">
//                   <FolderTreeSelector
//                     items={item.children}
//                     onSelect={onSelect}
//                     selectedFolder={selectedFolder}
//                     level={level + 1}
//                   />
//                 </div>
//               )}
//             </li>
//           </React.Fragment>
//         );
//       })}
//     </ul>
//   );
// };

// export default FileUploadDrawer;

import React, { useState, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
} from "react-icons/fa";
import { AiFillFileUnknown } from "react-icons/ai";
import { accountDocsAPI } from "../../services/api";

const FileUploadDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
}) => {
  const toast = useToast();
  const [file, setFile] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
    } else if (!isOpen) {
      setSelectedFolder("");
      setFile(null);
      setMessage("");
      setFiles([]);
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxSize = 50 * 1024 * 1024;
    const forbiddenTypes = ["video/", "audio/"];

    const validFiles = selectedFiles.filter((file) => {
      if (file.size > maxSize) {
        alert(`❌ ${file.name} exceeds 50 MB limit.`);
        return false;
      }
      if (forbiddenTypes.some((type) => file.type.startsWith(type))) {
        alert(`❌ ${file.name} is an audio or video file — not allowed.`);
        return false;
      }
      return true;
    });

    setFiles(validFiles);
  };

  const handleFolderSelect = (path) => setSelectedFolder(path);

  const handleUpload = async () => {
    if (files.length === 0 || !selectedFolder) {
      setMessage("Please select files and a folder.");
      return;
    }

    try {
      const accountId = sessionStorage.getItem("accountId");
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("accountId", accountId);

      const res = await accountDocsAPI.uploadFile(formData, selectedFolder);

      setMessage(`✅ ${res.data.message || "Files uploaded successfully"}`);
      toast.success(`✅ ${res.data.message || "Files uploaded successfully"}`);
      setFiles([]);
      onClose();
      fetchFolderTree();
    } catch (err) {
      setMessage("❌ Error uploading files");
    }
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
        />
      )}

      <div
        className={`
          fixed top-0 right-0 z-50 h-full
          w-full sm:w-[640px] md:w-[520px]
          bg-white dark:bg-gray-900
          text-gray-900 dark:text-gray-100
          border-l border-gray-200 dark:border-gray-700
          shadow-lg flex flex-col
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              📄 Upload File
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Upload documents to your selected folder
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* FILE SELECT */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              Select Files
            </label>

            <label className="mt-2 flex justify-center border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md px-4 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              {files.length > 0
                ? `${files.length} file(s) selected`
                : "Choose Files"}
              <input type="file" hidden multiple onChange={handleFileChange} />
            </label>

            {files.length > 0 && (
              <div className="mt-2 space-y-1">
                {files.map((file, i) => (
                  <div
                    key={i}
                    className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2"
                  >
                    <span className="text-blue-600 dark:text-blue-400">📎</span>
                    {file.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MESSAGE */}
          {message && (
            <div
              className={`
                text-sm p-3 rounded-md
                ${
                  message.includes("✅")
                    ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                    : ""
                }
                ${
                  message.includes("❌")
                    ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                    : ""
                }
              `}
            >
              {message}
            </div>
          )}

          {/* FOLDER TREE */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              Select Folder
            </label>

            <div className="mt-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 max-h-96 overflow-y-auto">
              <FolderTreeSelector
                items={folderTree}
                onSelect={handleFolderSelect}
                selectedFolder={selectedFolder}
              />
            </div>

            {selectedFolder && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Selected: {selectedFolder}
              </p>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3 bg-white dark:bg-gray-900">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700"
          >
            Upload Files
          </button>
        </div>
      </div>
    </>
  );
};

const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (path) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <ul className="space-y-1">
      {items?.map((item) => {
        if (item.type !== "folder") return null;
        if (item.name?.toLowerCase() === "firm documents shared with client")
          return null;

        const isSelected = selectedFolder === item.path;
        const isExpanded = expanded[item.path];
        const hasChildren = item.children?.length > 0;

        return (
          <li key={item.path}>
            <div
              onClick={() => onSelect(item.path)}
              style={{ paddingLeft: level * 12 }}
              className={`
                flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer
                ${
                  isSelected
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                }
              `}
            >
              {hasChildren && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(item.path);
                  }}
                  className="text-xs"
                >
                  {isExpanded ? "▼" : "▶"}
                </button>
              )}
              📁 {item.name}
            </div>

            {hasChildren && isExpanded && (
              <FolderTreeSelector
                items={item.children}
                onSelect={onSelect}
                selectedFolder={selectedFolder}
                level={level + 1}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default FileUploadDrawer;