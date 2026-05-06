// // // ============================
// // // 📁 Drawer: Create Folder (MUI version)
// // // ============================

// // import React, { useState, useEffect } from "react";
// // import {
// //   Drawer,
// //   Box,
// //   Typography,
// //   TextField,
// //   Button,
// //   List,
// //   ListItem,
// //   ListItemText,
// //   IconButton,
// //   Collapse,
// //   ListItemIcon,
// // } from "@mui/material";
// // import axios from "axios";
// // import FolderIcon from "@mui/icons-material/Folder";
// // import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// // import ExpandLess from "@mui/icons-material/ExpandLess";
// // import ExpandMore from "@mui/icons-material/ExpandMore";
// // import { toast } from "material-react-toastify";
// // import { accountDocsAPI } from "../../services/api";
// // const CreateFolderDrawer = ({
// //   isOpen,
// //   onClose,
// //   folderTree,
// //   fetchFolderTree,
// //   selectedFolderForMenu,
// //   accountId,
// // }) => {
// //   const [folderName, setFolderName] = useState("");
// //   const [selectedFolder, setSelectedFolder] = useState("");
// //   const [message, setMessage] = useState("");

// //   const handleFolderSelect = (path) => setSelectedFolder(path);

// //   useEffect(() => {
// //     if (isOpen && selectedFolderForMenu) {
// //       setSelectedFolder(selectedFolderForMenu.path);
// //     } else if (!isOpen) {
// //       setSelectedFolder(""); // reset selection when drawer closes
// //       setFolderName("");
// //       setMessage("");
// //     }
// //   }, [isOpen, selectedFolderForMenu]);

// //   const handleCreateFolder = async () => {
// //     if (!folderName) {
// //       setMessage("⚠️ Folder name is required!");
// //       return;
// //     }
// //     console.log("foldername", folderName);
// //     console.log("selected path", selectedFolder);
// //     try {
// //        const res = await accountDocsAPI.createFolder({
// //       name: folderName,
// //       parentPath: selectedFolder || "",
// //       accountId,
// //     });

// //     const data = res.data;
// //       console.log("res", res);
// //       setMessage(`✅ Folder created: ${res.data.metaData.name}`);
// //       toast.success(`Folder created: ${res.data.metaData.name}`);
// //       setFolderName("");

// //       // fetchFolderTree();
// //       // ✅ Wait for folder tree refresh
// //       await fetchFolderTree();
// //       onClose();
// //     } catch (err) {
// //       console.error(err);
// //       setMessage(
// //         `❌ Error creating folder: ${err.response?.data?.error || "Server Error"}`,
// //       );
// //     }
// //   };

// //   return (
// //     <Drawer anchor="right" open={isOpen} onClose={onClose}>
// //       <Box sx={{ width: 500, p: 3, height: "100%" }}>
// //         <Typography variant="h6" gutterBottom>
// //           📁 Create New Folder
// //         </Typography>

// //         <TextField
// //           placeholder="Enter new folder name"
// //           value={folderName}
// //           onChange={(e) => setFolderName(e.target.value)}
// //           fullWidth
// //           margin="dense"
// //         />

// //         <Button
// //           // variant="contained"
// //           color="primary"
// //           onClick={handleCreateFolder}
// //           fullWidth
// //           sx={{
// //             backgroundColor: "text.menu",
// //             mt: 2,
// //             color: "primary.contrastText",
// //             "&:hover": {
// //               backgroundColor: "menu.dark",
// //               boxShadow: 1,
// //             },
// //             transition: "background-color 0.2s ease",
// //           }}
// //         >
// //           Create Folder
// //         </Button>

// //         {message && (
// //           <Typography sx={{ mt: 2, fontWeight: "bold" }}>{message}</Typography>
// //         )}

// //         <Button onClick={onClose} variant="outlined" fullWidth sx={{ mt: 2 }}>
// //           Close
// //         </Button>

// //         {/* {!selectedFolder && ( */}
// //         <Box sx={{ mt: 3 }}>
// //           <Typography variant="subtitle1" gutterBottom>
// //             Select Parent Folder from Tree
// //           </Typography>
// //           <FolderTreeSelector
// //             items={folderTree}
// //             onSelect={handleFolderSelect}
// //             selectedFolder={selectedFolder}
// //           />
// //         </Box>
// //         {/* )} */}
// //       </Box>
// //     </Drawer>
// //   );
// // };

// // const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
// //   const [expanded, setExpanded] = useState({});

// //   const toggleExpand = (path) => {
// //     setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
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
// //             <ListItem
// //               sx={{
// //                 pl: 2 + level * 2,
// //                 bgcolor: isSelected ? "#b2d8ff" : "transparent",
// //                 borderRadius: 1,
// //                 mb: 0.5,

// //                 cursor: item.meta?.readOnly ? "not-allowed" : "pointer",
// //                 opacity: item.meta?.readOnly ? 0.6 : 1,
// //                 pointerEvents: item.meta?.readOnly ? "none" : "auto",

// //                 "&:hover": {
// //                   bgcolor: item.meta?.readOnly ? "transparent" : "#dbefff",
// //                   color: "black",
// //                 },
// //               }}
// //               onClick={() => {
// //                 if (!item.meta?.readOnly) {
// //                   onSelect(item.path);
// //                 }
// //               }}
// //             >
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
// //               </Collapse>
// //             )}
// //           </React.Fragment>
// //         );
// //       })}
// //     </List>
// //   );
// // };

// // export default CreateFolderDrawer;


// // ============================
// // 📁 Drawer: Create Folder (Tailwind version with modern drawer)
// // ============================

// import React, { useState, useEffect } from "react";
// // import { toast } from "material-react-toastify";
// import { accountDocsAPI } from "../../services/api";
// import { useToast } from "../../hooks/useToast";

// const CreateFolderDrawer = ({
//   isOpen,
//   onClose,
//   folderTree,
//   fetchFolderTree,
//   selectedFolderForMenu,
//   accountId,
// }) => {
//   const [folderName, setFolderName] = useState("");
//   const [selectedFolder, setSelectedFolder] = useState("");
//   const [message, setMessage] = useState("");
// const toast= useToast()
//   const handleFolderSelect = (path) => setSelectedFolder(path);

//   useEffect(() => {
//     if (isOpen && selectedFolderForMenu) {
//       setSelectedFolder(selectedFolderForMenu.path);
//     } else if (!isOpen) {
//       setSelectedFolder("");
//       setFolderName("");
//       setMessage("");
//     }
//   }, [isOpen, selectedFolderForMenu]);

//   const handleCreateFolder = async () => {
//     if (!folderName) {
//       setMessage("⚠️ Folder name is required!");
//       return;
//     }
//     console.log("foldername", folderName);
//     console.log("selected path", selectedFolder);
//     try {
//       const res = await accountDocsAPI.createFolder({
//         name: folderName,
//         parentPath: selectedFolder || "",
//         accountId,
//       });

//       const data = res.data;
//       console.log("res", res);
//       setMessage(`✅ Folder created: ${res.data.metaData.name}`);
//       toast.success(`Folder created: ${res.data.metaData.name}`);
//       setFolderName("");

//       await fetchFolderTree();
//       onClose();
//     } catch (err) {
//       console.error(err);
//       setMessage(
//         `❌ Error creating folder: ${err.response?.data?.error || "Server Error"}`
//       );
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
//               Create New Folder
//             </h2>
//             <p className="text-xs text-gray-500">
//               Organize your documents by creating a new folder
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
//           {/* FOLDER NAME */}
//           <div className="space-y-1.5">
//             <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//               Folder Name
//             </label>

//             <input
//               type="text"
//               value={folderName}
//               onChange={(e) => setFolderName(e.target.value)}
//               placeholder="Enter new folder name..."
//               className="
//                 w-full rounded-md
//                 border border-gray-200
//                 bg-white
//                 px-3 py-2 text-sm
//                 text-gray-900
//                 placeholder:text-gray-400
//                 focus:outline-none
//                 focus:ring-2 focus:ring-blue-500/30
//                 focus:border-blue-500
//                 transition
//               "
//             />
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

//           {/* PARENT FOLDER SELECTION */}
//           <div className="space-y-1.5">
//             <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//               Select Parent Folder (Optional)
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
//             onClick={handleCreateFolder}
//             className="
//               inline-flex items-center justify-center
//               rounded-md px-4 py-1.5 text-sm font-medium
//               bg-blue-600 text-white
//               hover:bg-blue-700
//               transition
//               shadow-sm
//             "
//           >
//             Create Folder
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

//   // Function to check if a folder or any of its children is the disabled folder
//   const isDisabledFolder = (item) => {
//     if (item.name?.toLowerCase() === "firm documents shared with client") {
//       return true;
//     }
//     return false;
//   };

//   const shouldDisableItem = (item) => {
//     return isDisabledFolder(item);
//   };

//   const renderFolderItem = (item, currentLevel) => {
//     const isDisabled = shouldDisableItem(item);
//     const isSelected = selectedFolder === item.path;
//     const isExpanded = expanded[item.path];
//     const hasChildren = item.children?.length > 0;
    
//     // Don't render if it's the disabled folder (hide it completely)
//     if (isDisabled) {
//       return null;
//     }

//     return (
//       <React.Fragment key={item.path}>
//         <li>
//           <div
//             className={`
//               rounded-md transition-all duration-200
//               ${isDisabled ? 'cursor-not-allowed opacity-40 bg-gray-100' : 'cursor-pointer'}
//               ${isSelected && !isDisabled ? 'bg-blue-100' : !isDisabled ? 'hover:bg-gray-100' : ''}
//             `}
//             style={{ paddingLeft: `${currentLevel * 12}px` }}
//             onClick={() => {
//               if (!isDisabled) {
//                 onSelect(item.path);
//               }
//             }}
//           >
//             <div className="flex items-center py-1.5 px-2 gap-1">
//               {/* Expand/Collapse Button */}
//               {hasChildren && !isDisabled && (
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleExpand(item.path);
//                   }}
//                   className="p-0.5 rounded hover:bg-gray-200 transition"
//                 >
//                   {isExpanded ? (
//                     <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   ) : (
//                     <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                     </svg>
//                   )}
//                 </button>
//               )}

//               {/* Spacer if no children or disabled */}
//               {(!hasChildren || isDisabled) && <div className="w-5" />}

//               {/* Folder Icon */}
//               <svg className={`w-4 h-4 flex-shrink-0 ${isDisabled ? 'text-gray-400' : 'text-yellow-600'}`} fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
//               </svg>

//               {/* Folder Name */}
//               <span className={`
//                 text-sm flex-1
//                 ${isSelected && !isDisabled ? 'font-semibold text-blue-700' : isDisabled ? 'text-gray-400' : 'text-gray-700'}
//               `}>
//                 {item.name}
//                 {isDisabled && " (Disabled)"}
//               </span>

//               {/* Disabled badge */}
//               {isDisabled && (
//                 <span className="text-xs text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">
//                   Locked
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Render children recursively - but skip if this is the disabled folder */}
//           {hasChildren && isExpanded && !isDisabled && (
//             <div className="mt-0.5">
//               <FolderTreeSelector
//                 items={item.children}
//                 onSelect={onSelect}
//                 selectedFolder={selectedFolder}
//                 level={currentLevel + 1}
//               />
//             </div>
//           )}
//         </li>
//       </React.Fragment>
//     );
//   };

//   return (
//     <ul className="list-none m-0 p-0 space-y-0.5">
//       {items?.map((item) => {
//         if (item.type !== "folder") return null;
        
//         // Check if this is the disabled folder
//         const isDisabledFolderItem = item.name?.toLowerCase() === "firm documents shared with client";
        
//         // If it's the disabled folder, don't render it or any of its children
//         if (isDisabledFolderItem) {
//           return null;
//         }
        
//         return renderFolderItem(item, level);
//       })}
//     </ul>
//   );
// };

// export default CreateFolderDrawer;

import React, { useState, useEffect } from "react";
// import { toast } from "material-react-toastify";
import { accountDocsAPI } from "../../services/api";
import { useToast } from "../../hooks/useToast";

const CreateFolderDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
  accountId,
}) => {
  const [folderName, setFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");
  const toast = useToast();

  const handleFolderSelect = (path) => setSelectedFolder(path);

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
    } else if (!isOpen) {
      setSelectedFolder("");
      setFolderName("");
      setMessage("");
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleCreateFolder = async () => {
    if (!folderName) {
      setMessage("⚠️ Folder name is required!");
      return;
    }

    try {
      const res = await accountDocsAPI.createFolder({
        name: folderName,
        parentPath: selectedFolder || "",
        accountId,
      });

      setMessage(`✅ Folder created: ${res.data.metaData.name}`);
      toast.success(`Folder created: ${res.data.metaData.name}`);
      setFolderName("");

      await fetchFolderTree();
      onClose();
    } catch (err) {
      setMessage(
        `❌ Error creating folder: ${err.response?.data?.error || "Server Error"}`
      );
    }
  };

  return (
    <>
      {/* BACKDROP */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
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
          shadow-lg
          flex flex-col
          transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              Create New Folder
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Organize your documents by creating a new folder
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* FOLDER NAME */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Folder Name
            </label>

            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter new folder name..."
              className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
            />
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
              ${
                !message.includes("✅") && !message.includes("❌")
                  ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800"
                  : ""
              }
            `}
            >
              {message}
            </div>
          )}

          {/* PARENT FOLDER */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Select Parent Folder (Optional)
            </label>

            <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 max-h-96 overflow-y-auto p-2">
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
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-end gap-3 bg-white dark:bg-gray-900">
          <button
            onClick={onClose}
            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            onClick={handleCreateFolder}
            className="inline-flex items-center justify-center rounded-md px-4 py-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
          >
            Create Folder
          </button>
        </div>
      </div>
    </>
  );
};

const FolderTreeSelector = ({
  items,
  onSelect,
  selectedFolder,
  level = 0,
}) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (path) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const isDisabledFolder = (item) => {
    return (
      item.name?.toLowerCase() === "firm documents shared with client"
    );
  };

  const renderFolderItem = (item, currentLevel) => {
    const isDisabled = isDisabledFolder(item);
    const isSelected = selectedFolder === item.path;
    const isExpanded = expanded[item.path];
    const hasChildren = item.children?.length > 0;

    if (isDisabled) return null;

    return (
      <React.Fragment key={item.path}>
        <li>
          <div
            className={`
              rounded-md transition-all duration-200
              ${
                isDisabled
                  ? "cursor-not-allowed opacity-40 bg-gray-100 dark:bg-gray-800"
                  : "cursor-pointer"
              }
              ${
                isSelected && !isDisabled
                  ? "bg-blue-100 dark:bg-blue-900/30"
                  : !isDisabled
                  ? "hover:bg-gray-100 dark:hover:bg-gray-800"
                  : ""
              }
            `}
            style={{ paddingLeft: `${currentLevel * 12}px` }}
            onClick={() => {
              if (!isDisabled) onSelect(item.path);
            }}
          >
            <div className="flex items-center py-1.5 px-2 gap-1">
              {hasChildren && !isDisabled ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(item.path);
                  }}
                  className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  {isExpanded ? "▼" : "▶"}
                </button>
              ) : (
                <div className="w-5" />
              )}

              <span className="text-yellow-600 dark:text-yellow-400">
                📁
              </span>

              <span
                className={`
                  text-sm flex-1
                  ${
                    isSelected
                      ? "font-semibold text-blue-700 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300"
                  }
                `}
              >
                {item.name}
              </span>
            </div>
          </div>

          {hasChildren && isExpanded && !isDisabled && (
            <FolderTreeSelector
              items={item.children}
              onSelect={onSelect}
              selectedFolder={selectedFolder}
              level={currentLevel + 1}
            />
          )}
        </li>
      </React.Fragment>
    );
  };

  return (
    <ul className="list-none m-0 p-0 space-y-0.5">
      {items?.map((item) =>
        item.type === "folder" ? renderFolderItem(item, level) : null
      )}
    </ul>
  );
};

export default CreateFolderDrawer;