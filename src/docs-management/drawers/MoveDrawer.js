


// // // ============================
// // // 📁 Drawer: Move Folder / File (MUI Version) - Supports Single & Bulk
// // // ============================

// // import React, { useState, useEffect } from "react";
// // import {
// //   Drawer,
// //   Box,
// //   Typography,
// //   Button,
// //   Divider,
// //   List,
// //   ListItem,
// //   ListItemButton,
// //   ListItemText,
// //   Collapse,
// //   Alert,
// //   ListItemIcon,
// //   Chip,
// //   Stack,
// //   CircularProgress
// // } from "@mui/material";
// // import FolderIcon from "@mui/icons-material/Folder";
// // import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// // import axios from "axios";
// // import ExpandLess from "@mui/icons-material/ExpandLess";
// // import ExpandMore from "@mui/icons-material/ExpandMore";
// // import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
// // import { toast } from "material-react-toastify";
// // import { AiFillFileUnknown } from "react-icons/ai";
// // import {
// //   FaFilePdf,
// //   FaFileWord,
// //   FaFileExcel,
// //   FaFileImage,
// //   FaFileAlt,
// // } from "react-icons/fa";
// // import { accountDocsAPI } from "../../services/api";
// // const MoveDrawer = ({
// //   isOpen,
// //   onClose,
// //   folderTree,
// //   fetchFolderTree,
// //   selectedFolderForMenu,
// //   // New props for bulk operations
// //   isBulkOperation = false,
// //   selectedPaths = [],
// //   onMoveComplete
// // }) => {
// //   const [destinationPath, setDestinationPath] = useState("");
// //   const [sourcePaths, setSourcePaths] = useState([]);
// //   const [message, setMessage] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   useEffect(() => {
// //     if (isOpen) {
// //       if (isBulkOperation && selectedPaths.length > 0) {
// //         // Bulk mode: use provided paths
// //         setSourcePaths(selectedPaths);
// //       } else if (selectedFolderForMenu) {
// //         // Single mode: use selected item
// //         setSourcePaths([selectedFolderForMenu.path]);
// //       }
// //     } else {
// //       // Reset on close
// //       // setSourcePaths([]);
// //       setDestinationPath("");
// //       setMessage("");
// //       setLoading(false);
// //     }
// //   }, [isOpen, selectedFolderForMenu, isBulkOperation, selectedPaths]);
// // const handleMove = async () => {
// //   try {
// //     setMessage("");
// //     setLoading(true);

// //     if (sourcePaths.length === 0) {
// //       setMessage("No source items selected.");
// //       toast.warning("No items selected");
// //       return;
// //     }

// //     if (!destinationPath) {
// //       setMessage("Please select a destination folder.");
// //       toast.warning("Select destination folder");
// //       return;
// //     }

// //     const isBulk = sourcePaths.length > 1 || isBulkOperation;

// //     let res;

// //     if (isBulk) {
// //       res = await accountDocsAPI.bulkMoveItems({
// //         paths: sourcePaths,
// //         targetPath: destinationPath,
// //       });
// //     } else {
// //       res = await accountDocsAPI.moveItem({
// //         sourcePath: sourcePaths[0],
// //         destinationPath,
// //       });
// //     }

// //     const data = res.data;

// //     setMessage(data.message);
// //     toast.success(data.message);

// //     if (onMoveComplete && typeof onMoveComplete === "function") {
// //       onMoveComplete(destinationPath);
// //     }

// //     onClose();
// //     await fetchFolderTree?.();
// //   } catch (err) {
// //     const errorMessage =
// //       err.response?.data?.error ||
// //       err.response?.data?.message ||
// //       "Move failed";

// //     setMessage(errorMessage);
// //     toast.error(errorMessage);
// //   } finally {
// //     setLoading(false);
// //   }
// // };
// //   // const handleMove = async () => {
// //   //   try {
// //   //     setMessage("");
// //   //     setLoading(true);

// //   //     if (sourcePaths.length === 0) {
// //   //       setMessage("No source items selected.");
// //   //       toast.warning("No items selected");
// //   //       setLoading(false);
// //   //       return;
// //   //     }

// //   //     if (!destinationPath) {
// //   //       setMessage("Please select a destination folder.");
// //   //       toast.warning("Select destination folder");
// //   //       setLoading(false);
// //   //       return;
// //   //     }

// //   //     // Determine which API to use based on number of items
// //   //     const isBulk = sourcePaths.length > 1 || isBulkOperation;
// //   //     const endpoint = isBulk 
// //   //       ? "https://www.snptaxes.com/api/accountsdoc/bulk-move"
// //   //       : "https://www.snptaxes.com/api/accountsdoc/move";

// //   //     const requestData = isBulk
// //   //       ? { paths: sourcePaths, targetPath: destinationPath }
// //   //       : { sourcePath: sourcePaths[0], destinationPath };

// //   //     const res = await axios.post(endpoint, requestData);

// //   //     setMessage(res.data.message);
// //   //     toast.success(res.data.message);
      
// //   //     // Call onMoveComplete callback if provided (for bulk operations)
// //   //     if (onMoveComplete && typeof onMoveComplete === 'function') {
// //   //       onMoveComplete(destinationPath);
// //   //     }
      
// //   //     onClose();
// //   //     fetchFolderTree?.();
// //   //   } catch (err) {
// //   //     const errorMessage = err.response?.data?.error || 
// //   //                         err.response?.data?.message || 
// //   //                         "Move failed";
// //   //     setMessage(errorMessage);
// //   //     toast.error(errorMessage);
// //   //   } finally {
// //   //     setLoading(false);
// //   //   }
// //   // };

// //   // Function to get item name from path
// //   const getItemNameFromPath = (path) => {
// //     console.log("Getting item name from path:", path);
// //     return path.split('/').pop() || path;
// //   };

// //   // Check if destination is a subfolder of any source (to prevent circular moves)
// //   const isInvalidDestination = (destPath) => {
// //     // console.log("Checking invalid destination:", destPath, sourcePaths);
// //     return sourcePaths.some(sourcePath => {
// //       return destPath.startsWith(sourcePath + '/') || destPath === sourcePath;
// //     });
// //   };



// //   return (
// //     <Drawer anchor="right" open={isOpen} onClose={onClose}>
// //       <Box sx={{ width: 420, p: 3, height: "100%" }}>
// //         <Typography variant="h6" gutterBottom>
// //           {isBulkOperation ? "📦 Move Multiple Items" : "📁 Move Item"}
// //         </Typography>

// //         {/* Source Items Display */}
// //         <Box sx={{ mb: 3, p: 2, bgcolor: "#f0f8ff", borderRadius: 1 }}>
// //           <Typography variant="subtitle2" color="primary" gutterBottom>
// //             {isBulkOperation ? "Items to Move:" : "Item to Move:"}
// //           </Typography>
          
// //           {sourcePaths.length === 0 ? (
// //             <Typography variant="body2" color="text.secondary">
// //               No items selected
// //             </Typography>
// //           ) : (
// //             <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
// //               {sourcePaths.slice(0, 5).map((path, index) => (
// //                 <Chip
// //                   key={index}
// //                   label={getItemNameFromPath(path)}
// //                   size="small"
// //                   variant="outlined"
// //                   color="primary"
// //                 />
// //               ))}
// //               {sourcePaths.length > 5 && (
// //                 <Chip
// //                   label={`+${sourcePaths.length - 5} more`}
// //                   size="small"
// //                   variant="outlined"
// //                 />
// //               )}
// //             </Stack>
// //           )}
          
// //           <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
// //             Total: {sourcePaths.length} item(s)
// //           </Typography>
// //         </Box>

// //         {/* Move Button */}
// //         <Button
// //           variant="contained"
// //           fullWidth
// //           sx={{ mt: 2 }}
// //           onClick={handleMove}
// //           disabled={!destinationPath || sourcePaths.length === 0 || loading || isInvalidDestination(destinationPath)}
// //           startIcon={loading ? <CircularProgress size={20} /> : <MoveToInboxIcon />}
// //         >
// //           {loading ? "Moving..." : "Move Items"}
// //         </Button>

// //         {isInvalidDestination(destinationPath) && (
// //           <Alert severity="warning" sx={{ mt: 2 }}>
// //             Cannot move a folder into itself or its subfolder
// //           </Alert>
// //         )}

// //         {message && (
// //           <Alert
// //             severity={message.includes("failed") || message.includes("error") ? "error" : "info"}
// //             sx={{ mt: 2 }}
// //           >
// //             {message}
// //           </Alert>
// //         )}

// //         <Divider sx={{ my: 2 }} />

// //         <Typography variant="subtitle1" gutterBottom>
// //           Select Destination Folder
// //         </Typography>

// //         <Box sx={{ maxHeight: "50vh", overflowY: "auto" }}>
// //           <FolderTreeSelector
// //             items={folderTree}
// //             onSelect={(path) => setDestinationPath(path)}
// //             selectedFolder={destinationPath}
// //             disabledPaths={sourcePaths} // Disable source folders from being selected
// //           />
// //         </Box>

// //         <Typography variant="body2" color="text.secondary" sx={{ mt: 2, p: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}>
// //           Selected destination: {destinationPath || "None"}
// //         </Typography>

// //         <Button
// //           onClick={onClose}
// //           variant="outlined"
// //           fullWidth
// //           sx={{ mt: 2, color: "#555" }}
// //         >
// //           Cancel
// //         </Button>
// //       </Box>
// //     </Drawer>
// //   );
// // };

// // // ============================
// // // 🔹 Recursive Folder Tree Selector (MUI) - Enhanced
// // // ============================

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

// // export default MoveDrawer;

// // ============================
// // 📁 Drawer: Move Folder / File (Tailwind Version) - Supports Single & Bulk
// // ============================

// import React, { useState, useEffect } from "react";
// import { toast } from "material-react-toastify";
// import {
//   FaFilePdf,
//   FaFileWord,
//   FaFileExcel,
//   FaFileImage,
//   FaFileAlt,
// } from "react-icons/fa";
// import { AiFillFileUnknown } from "react-icons/ai";
// import { accountDocsAPI } from "../../services/api";

// const MoveDrawer = ({
//   isOpen,
//   onClose,
//   folderTree,
//   fetchFolderTree,
//   selectedFolderForMenu,
//   // New props for bulk operations
//   isBulkOperation = false,
//   selectedPaths = [],
//   onMoveComplete
// }) => {
//   const [destinationPath, setDestinationPath] = useState("");
//   const [sourcePaths, setSourcePaths] = useState([]);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       if (isBulkOperation && selectedPaths.length > 0) {
//         // Bulk mode: use provided paths
//         setSourcePaths(selectedPaths);
//       } else if (selectedFolderForMenu) {
//         // Single mode: use selected item
//         setSourcePaths([selectedFolderForMenu.path]);
//       }
//     } else {
//       // Reset on close
//       // setSourcePaths([]);
//       setDestinationPath("");
//       setMessage("");
//       setLoading(false);
//     }
//   }, [isOpen, selectedFolderForMenu, isBulkOperation, selectedPaths]);

//   const handleMove = async () => {
//     try {
//       setMessage("");
//       setLoading(true);

//       if (sourcePaths.length === 0) {
//         setMessage("No source items selected.");
//         toast.warning("No items selected");
//         return;
//       }

//       if (!destinationPath) {
//         setMessage("Please select a destination folder.");
//         toast.warning("Select destination folder");
//         return;
//       }

//       const isBulk = sourcePaths.length > 1 || isBulkOperation;

//       let res;

//       if (isBulk) {
//         res = await accountDocsAPI.bulkMoveItems({
//           paths: sourcePaths,
//           targetPath: destinationPath,
//         });
//       } else {
//         res = await accountDocsAPI.moveItem({
//           sourcePath: sourcePaths[0],
//           destinationPath,
//         });
//       }

//       const data = res.data;

//       setMessage(data.message);
//       toast.success(data.message);

//       if (onMoveComplete && typeof onMoveComplete === "function") {
//         onMoveComplete(destinationPath);
//       }

//       onClose();
//       await fetchFolderTree?.();
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.error ||
//         err.response?.data?.message ||
//         "Move failed";

//       setMessage(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to get item name from path
//   const getItemNameFromPath = (path) => {
//     console.log("Getting item name from path:", path);
//     return path.split('/').pop() || path;
//   };

//   // Check if destination is a subfolder of any source (to prevent circular moves)
//   const isInvalidDestination = (destPath) => {
//     return sourcePaths.some(sourcePath => {
//       return destPath.startsWith(sourcePath + '/') || destPath === sourcePath;
//     });
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
//               {isBulkOperation ? "📦 Move Multiple Items" : "📁 Move Item"}
//             </h2>
//             <p className="text-xs text-gray-500">
//               {isBulkOperation 
//                 ? "Move multiple items to a new location" 
//                 : "Move this item to a different folder"}
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
//           {/* Source Items Display */}
//           <div className="space-y-2 p-3 bg-blue-50 rounded-md border border-blue-100">
//             <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
//               {isBulkOperation ? "Items to Move:" : "Item to Move:"}
//             </div>
            
//             {sourcePaths.length === 0 ? (
//               <div className="text-sm text-gray-500">
//                 No items selected
//               </div>
//             ) : (
//               <div className="flex flex-wrap gap-2">
//                 {sourcePaths.slice(0, 5).map((path, index) => (
//                   <span
//                     key={index}
//                     className="
//                       inline-flex items-center px-2 py-1
//                       text-xs font-medium rounded-md
//                       border border-blue-300 bg-white text-blue-700
//                     "
//                   >
//                     {getItemNameFromPath(path)}
//                   </span>
//                 ))}
//                 {sourcePaths.length > 5 && (
//                   <span className="
//                     inline-flex items-center px-2 py-1
//                     text-xs font-medium rounded-md
//                     border border-gray-300 bg-gray-50 text-gray-600
//                   ">
//                     +{sourcePaths.length - 5} more
//                   </span>
//                 )}
//               </div>
//             )}
            
//             <div className="text-xs text-gray-500 mt-1">
//               Total: {sourcePaths.length} item(s)
//             </div>
//           </div>

//           {/* MESSAGE DISPLAY */}
//           {message && (
//             <div className={`
//               text-sm p-3 rounded-md
//               ${message.includes("failed") || message.includes("error") 
//                 ? "bg-red-50 text-red-700 border border-red-200" 
//                 : "bg-blue-50 text-blue-700 border border-blue-200"}
//             `}>
//               {message}
//             </div>
//           )}

//           {/* Invalid Destination Warning */}
//           {isInvalidDestination(destinationPath) && (
//             <div className="
//               text-sm p-3 rounded-md
//               bg-yellow-50 text-yellow-700 border border-yellow-200
//             ">
//               ⚠️ Cannot move a folder into itself or its subfolder
//             </div>
//           )}

//           {/* FOLDER TREE SELECTION */}
//           <div className="space-y-1.5">
//             <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//               Select Destination Folder
//             </label>
            
//             <div className="
//               rounded-md border border-gray-200
//               bg-gray-50
//               max-h-96 overflow-y-auto
//               p-2
//             ">
//               <FolderTreeSelector
//                 items={folderTree}
//                 onSelect={(path) => setDestinationPath(path)}
//                 selectedFolder={destinationPath}
//                 disabledPaths={sourcePaths}
//               />
//             </div>
            
//             {/* Selected destination display */}
//             <div className="
//               text-xs text-gray-600 mt-2 p-2
//               bg-gray-100 rounded-md
//             ">
//               <span className="font-medium">Selected destination:</span> {destinationPath || "None"}
//             </div>
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
//             onClick={handleMove}
//             disabled={!destinationPath || sourcePaths.length === 0 || loading || isInvalidDestination(destinationPath)}
//             className="
//               inline-flex items-center justify-center gap-2
//               rounded-md px-4 py-1.5 text-sm font-medium
//               bg-blue-600 text-white
//               hover:bg-blue-700
//               transition
//               shadow-sm
//               disabled:opacity-50 disabled:cursor-not-allowed
//             "
//           >
//             {loading ? (
//               <>
//                 <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Moving...
//               </>
//             ) : (
//               <>
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//                 Move Items
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// // ============================
// // 🔹 Recursive Folder Tree Selector (Tailwind) - Enhanced
// // ============================

// const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0, disabledPaths = [] }) => {
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

//   // Check if a folder should be disabled (can't select source folder or its subfolders)
//   const isDisabled = (itemPath) => {
//     return disabledPaths.some(disabledPath => 
//       itemPath === disabledPath || itemPath.startsWith(disabledPath + '/')
//     );
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
//         const disabled = isDisabled(item.path);

//         return (
//           <React.Fragment key={item.path}>
//             <li>
//               <div
//                 className={`
//                   rounded-md transition-all duration-200
//                   ${disabled || isReadOnly ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
//                   ${isSelected && !disabled && !isReadOnly ? 'bg-blue-100' : !disabled && !isReadOnly ? 'hover:bg-gray-100' : ''}
//                 `}
//                 style={{ paddingLeft: `${level * 12}px` }}
//                 onClick={() => {
//                   if (!disabled && !isReadOnly) {
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
//                       disabled={disabled || isReadOnly}
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
//                   <svg className={`w-4 h-4 flex-shrink-0 ${disabled || isReadOnly ? 'text-gray-400' : 'text-yellow-600'}`} fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
//                   </svg>

//                   {/* Folder Name */}
//                   <span className={`
//                     text-sm flex-1
//                     ${isSelected && !disabled && !isReadOnly ? 'font-semibold text-blue-700' : disabled || isReadOnly ? 'text-gray-400' : 'text-gray-700'}
//                   `}>
//                     {item.name}
//                   </span>

//                   {/* Badges */}
//                   {disabled && (
//                     <span className="text-xs text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">
//                       Source
//                     </span>
//                   )}
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
//                     disabledPaths={disabledPaths}
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

// export default MoveDrawer;
// ============================
// 📁 Drawer: Move Folder / File (Light/Dark Theme)
// ============================

import React, { useState, useEffect } from "react";
// import { toast } from "material-react-toastify";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
} from "react-icons/fa";
import { AiFillFileUnknown } from "react-icons/ai";
import { accountDocsAPI } from "../../services/api";
import { useToast } from "../../hooks/useToast";

const MoveDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
  isBulkOperation = false,
  selectedPaths = [],
  onMoveComplete
}) => {
  const [destinationPath, setDestinationPath] = useState("");
  const [sourcePaths, setSourcePaths] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
const toast =useToast()
  useEffect(() => {
    if (isOpen) {
      if (isBulkOperation && selectedPaths.length > 0) {
        setSourcePaths(selectedPaths);
      } else if (selectedFolderForMenu) {
        setSourcePaths([selectedFolderForMenu.path]);
      }
    } else {
      setDestinationPath("");
      setMessage("");
      setLoading(false);
    }
  }, [isOpen, selectedFolderForMenu, isBulkOperation, selectedPaths]);

  const handleMove = async () => {
    try {
      setMessage("");
      setLoading(true);

      if (sourcePaths.length === 0) {
        setMessage("No source items selected.");
        toast.warning("No items selected");
        return;
      }

      if (!destinationPath) {
        setMessage("Please select a destination folder.");
        toast.warning("Select destination folder");
        return;
      }

      const isBulk = sourcePaths.length > 1 || isBulkOperation;

      let res;

      if (isBulk) {
        res = await accountDocsAPI.bulkMoveItems({
          paths: sourcePaths,
          targetPath: destinationPath,
        });
      } else {
        res = await accountDocsAPI.moveItem({
          sourcePath: sourcePaths[0],
          destinationPath,
        });
      }

      const data = res.data;

      setMessage(data.message);
      toast.success("Moved Successfully");

      if (onMoveComplete) {
        onMoveComplete(destinationPath);
      }

      onClose();
      await fetchFolderTree?.();
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Move failed";

      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getItemNameFromPath = (path) => {
    return path.split('/').pop() || path;
  };

  const isInvalidDestination = (destPath) => {
    return sourcePaths.some(sourcePath => {
      return destPath.startsWith(sourcePath + '/') || destPath === sourcePath;
    });
  };

  return (
    <>
      {/* BACKDROP */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        />
      )}

      {/* DRAWER */}
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
            <h2 className="text-sm font-semibold">
              {isBulkOperation ? "📦 Move Multiple Items" : "📁 Move Item"}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isBulkOperation
                ? "Move multiple items to a new location"
                : "Move this item to a different folder"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Source */}
          <div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md">
            <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">
              {isBulkOperation ? "Items to Move:" : "Item to Move:"}
            </div>

            <div className="flex flex-wrap gap-2">
              {sourcePaths.slice(0, 5).map((path, i) => (
                <span key={i} className="px-2 py-1 text-xs rounded border bg-white dark:bg-gray-800 border-blue-300 text-blue-700 dark:text-blue-300">
                  {getItemNameFromPath(path)}
                </span>
              ))}
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              Total: {sourcePaths.length}
            </div>
          </div>

          {/* MESSAGE */}
          {message && (
            <div className={`text-sm p-3 rounded-md border ${
              message.includes("failed")
                ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
                : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
            }`}>
              {message}
            </div>
          )}

          {/* WARNING */}
          {isInvalidDestination(destinationPath) && (
            <div className="text-sm p-3 rounded-md bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">
              ⚠️ Cannot move into itself/subfolder
            </div>
          )}

          {/* TREE */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              Select Destination Folder
            </label>

            <div className="mt-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2 max-h-96 overflow-y-auto">
              <FolderTreeSelector
                items={folderTree}
                onSelect={setDestinationPath}
                selectedFolder={destinationPath}
                disabledPaths={sourcePaths}
              />
            </div>

            <div className="text-xs mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-300">
              Selected: {destinationPath || "None"}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-sm px-3 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            onClick={handleMove}
            disabled={!destinationPath || loading || isInvalidDestination(destinationPath)}
            className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Moving..." : "Move Items"}
          </button>
        </div>
      </div>
    </>
  );
};

// ============================
// 🔹 Folder Tree (Dark Theme)
// ============================

const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0, disabledPaths = [] }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (path) => {
    setExpanded(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const isDisabled = (path) => {
    return disabledPaths.some(p => path === p || path.startsWith(p + "/"));
  };

  return (
    <ul className="space-y-0.5">
      {items?.map((item) => {
        if (item.type !== "folder") return null;
        if (item.name?.toLowerCase() === "firm documents shared with client") return null;

        const selected = selectedFolder === item.path;
        const disabled = isDisabled(item.path) || item.meta?.readOnly;

        return (
          <li key={item.path}>
            <div
              onClick={() => !disabled && onSelect(item.path)}
              style={{ paddingLeft: `${level * 12}px` }}
              className={`
                flex items-center gap-2 py-1.5 px-2 rounded
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"}
                ${selected ? "bg-blue-100 dark:bg-blue-900/40" : ""}
              `}
            >
              <span className="text-yellow-600 dark:text-yellow-400">📁</span>

              <span className={`text-sm ${selected ? "font-semibold text-blue-700 dark:text-blue-300" : ""}`}>
                {item.name}
              </span>
            </div>

            {item.children?.length > 0 && (
              <FolderTreeSelector
                items={item.children}
                onSelect={onSelect}
                selectedFolder={selectedFolder}
                disabledPaths={disabledPaths}
                level={level + 1}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default MoveDrawer;