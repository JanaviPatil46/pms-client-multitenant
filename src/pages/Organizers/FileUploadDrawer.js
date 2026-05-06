// import React, { useState, useEffect } from "react";
// import {
//   Drawer,
//   Box,
//   Typography,
//   Button,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
// } from "@mui/material";
// import FolderIcon from "@mui/icons-material/Folder";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";
// import axios from "axios";
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

// const FileUploadDrawer = ({
//   isOpen,
//   onClose,
//   folderTree,
//   fetchFolderTree,
//   selectedFolderForMenu,
//   files, // Changed from file to files (array)
//   onUploadSuccess, // Callback when uploads are successful
//   onUploadError, // Callback when uploads fail
// }) => {
//   const [selectedFolder, setSelectedFolder] = useState("");
//   const [message, setMessage] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState({});

//   useEffect(() => {
//     if (isOpen && selectedFolderForMenu) {
//       setSelectedFolder(selectedFolderForMenu.path);
//     } else if (!isOpen) {
//       setSelectedFolder("");
//       setMessage("");
//       setIsUploading(false);
//       setUploadProgress({});
//     }
//   }, [isOpen, selectedFolderForMenu]);

//   const handleFolderSelect = (path) => setSelectedFolder(path);

//   const handleUpload = async () => {
//     if (!files || files.length === 0 || !selectedFolder) {
//       setMessage("Please select files and a folder.");
//       return;
//     }

//     setIsUploading(true);
//     setMessage(`Uploading ${files.length} file(s)...`);

//     const uploadResults = {
//       successful: [],
//       failed: [],
//     };

//     try {
//       const accountId = sessionStorage.getItem("accountId");

//       for (let i = 0; i < files.length; i++) {
//         const file = files[i];

//         try {
//           setMessage(`Uploading ${i + 1}/${files.length}: ${file.name}`);

//           const formData = new FormData();
//           formData.append("files", file);
//           formData.append("accountId", accountId);

//           const res = await accountDocsAPI.uploadFile(formData, selectedFolder);

//           uploadResults.successful.push({
//             fileName: file.name,
//             filePath: `${selectedFolder}/${file.name}`,
//             uploadDate: new Date().toISOString(),
//             serverResponse: res.data,
//           });
//         } catch (err) {
//           console.error(`Upload error for ${file.name}:`, err);

//           uploadResults.failed.push({
//             fileName: file.name,
//             error: err,
//           });
//         }
//       }

//       // FINAL RESULT HANDLING
//       if (uploadResults.failed.length === 0) {
//         setMessage(
//           `✅ All ${uploadResults.successful.length} files uploaded successfully!`,
//         );

//         if (onUploadSuccess) {
//           onUploadSuccess(uploadResults.successful);
//         }

//         // await fetchFolderTree(accountId);

//         setTimeout(() => {
//           onClose();
//         }, 1500);
//       } else if (uploadResults.successful.length === 0) {
//         setMessage("❌ All files failed to upload");

//         if (onUploadError) {
//           onUploadError(uploadResults.failed);
//         }
//       } else {
//         setMessage(
//           `⚠ ${uploadResults.successful.length} uploaded, ${uploadResults.failed.length} failed`,
//         );

//         if (onUploadSuccess) {
//           onUploadSuccess(uploadResults.successful);
//         }

//         await fetchFolderTree(accountId);

//         setTimeout(() => {
//           onClose();
//         }, 2500);
//       }
//     } catch (err) {
//       console.error("Upload process error:", err);

//       setMessage("❌ Error during upload process");

//       if (onUploadError) {
//         onUploadError([{ fileName: "Multiple files", error: err }]);
//       }
//     } finally {
//       setIsUploading(false);
//     }
//   };
//   return (
//     <Drawer
//       anchor="right"
//       open={isOpen}
//       onClose={onClose}
//       ModalProps={{
//         keepMounted: true,
//       }}
//       sx={{
//         zIndex: (theme) => theme.zIndex.modal + 1,
//         width: 500,
//       }}
//     >
//       <Box sx={{ width: 450, p: 3, height: "100%" }}>
//         <Typography variant="h6" gutterBottom>
//           📄 Upload Files ({files?.length || 0})
//         </Typography>

//         {/* Display selected files info */}
//         {files && files.length > 0 && (
//           <Box
//             sx={{
//               mb: 2,
//               p: 2,
//               bgcolor: "grey.100",
//               borderRadius: 1,
//               maxHeight: 200,
//               overflow: "auto",
//             }}
//           >
//             <Typography variant="subtitle2" gutterBottom>
//               Selected Files:
//             </Typography>
//             {files.map((file, index) => (
//               <Box
//                 key={index}
//                 sx={{
//                   mb: 1,
//                   pb: 1,
//                   borderBottom:
//                     index < files.length - 1 ? "1px solid #ddd" : "none",
//                 }}
//               >
//                 <Typography variant="body2">
//                   <strong>{index + 1}.</strong> {file.name}
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary">
//                   Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
//                   {uploadProgress[file.name] !== undefined && (
//                     <span> - Progress: {uploadProgress[file.name]}%</span>
//                   )}
//                 </Typography>
//               </Box>
//             ))}
//           </Box>
//         )}

//         <Button
//           variant="contained"
//           color="primary"
//           fullWidth
//           onClick={handleUpload}
//           disabled={
//             !files || files.length === 0 || !selectedFolder || isUploading
//           }
//           sx={{ mb: 2 }}
//         >
//           {isUploading
//             ? `Uploading...`
//             : `Upload ${files?.length || 0} File(s)`}
//         </Button>

//         {message && (
//           <Typography
//             sx={{
//               mt: 2,
//               mb: 2,
//               fontWeight: "bold",
//               color: message.includes("❌")
//                 ? "error.main"
//                 : message.includes("⚠")
//                   ? "warning.main"
//                   : "success.main",
//             }}
//           >
//             {message}
//           </Typography>
//         )}

//         <Box sx={{ mt: 3, mb: 3 }}>
//           <Typography variant="subtitle1" gutterBottom>
//             Select Upload Folder
//           </Typography>
//           <FolderTreeSelector
//             items={folderTree}
//             onSelect={handleFolderSelect}
//             selectedFolder={selectedFolder}
//           />
//         </Box>

//         <Button
//           variant="outlined"
//           fullWidth
//           onClick={onClose}
//           disabled={isUploading}
//         >
//           Cancel
//         </Button>
//       </Box>
//     </Drawer>
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
//     <List disablePadding>
//       {items?.map((item) => {
//         if (item.type !== "folder") return null;

//         // ⛔ Skip displaying this folder completely
//         if (item.name?.toLowerCase() === "firm documents shared with client")
//           return null;

//         const isSelected = selectedFolder === item.path;
//         const isExpanded = expanded[item.path];

//         return (
//           <React.Fragment key={item.path}>
//             <ListItem
//               sx={{
//                 pl: 2 + level * 2,
//                 bgcolor: isSelected ? "#b2d8ff" : "transparent",
//                 borderRadius: 1,
//                 mb: 0.5,
//                 "&:hover": { bgcolor: "#dbefff", color: "black" },
//                 cursor: item.meta?.readOnly ? "not-allowed" : "pointer",
//               }}
//               onClick={() => {
//                 if (!item.meta?.readOnly) onSelect(item.path);
//               }}
//             >
//               <ListItemIcon
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleExpand(item.path);
//                 }}
//                 sx={{ cursor: "pointer", minWidth: 40 }}
//               >
//                 {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
//               </ListItemIcon>

//               <ListItemText
//                 primary={item.name}
//                 sx={{
//                   fontWeight: isSelected ? "bold" : "normal",
//                   color: isSelected ? "#0056b3" : "inherit",
//                 }}
//               />

//               {item.children?.length > 0 &&
//                 (isExpanded ? (
//                   <ExpandLess
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleExpand(item.path);
//                     }}
//                     sx={{ cursor: "pointer" }}
//                   />
//                 ) : (
//                   <ExpandMore
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleExpand(item.path);
//                     }}
//                     sx={{ cursor: "pointer" }}
//                   />
//                 ))}
//             </ListItem>

//             {item.children?.length > 0 && (
//               <Collapse in={isExpanded} timeout="auto" unmountOnExit>
//                 <FolderTreeSelector
//                   items={item.children}
//                   onSelect={onSelect}
//                   selectedFolder={selectedFolder}
//                   level={level + 1}
//                 />
//                 {/* {item.meta?.files?.length > 0 && (
//                   <List sx={{ pl: 4 }}>
//                     {item.meta.files.map((file) => (
//                       <ListItem
//                         key={file.name}
//                         sx={{ pl: 2 }}
//                       >
//                         <ListItemIcon>
//                           <Box sx={{ mr: 1 }}>{getFileIcon(file.name)}</Box>
//                         </ListItemIcon>
//                         <ListItemText
//                           primary={`${file.name}${
//                             file.readOnly ? " (Read Only)" : ""
//                           }`}
//                         />
//                       </ListItem>
//                     ))}
//                   </List>
//                 )} */}
//               </Collapse>
//             )}
//           </React.Fragment>
//         );
//       })}
//     </List>
//   );
// };

// export default FileUploadDrawer;


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

const FileUploadDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
  files, // Changed from file to files (array)
  onUploadSuccess, // Callback when uploads are successful
  onUploadError, // Callback when uploads fail
}) => {
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
const toast = useToast()
  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
    } else if (!isOpen) {
      setSelectedFolder("");
      setMessage("");
      setIsUploading(false);
      setUploadProgress({});
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleFolderSelect = (path) => setSelectedFolder(path);

  const handleUpload = async () => {
    if (!files || files.length === 0 || !selectedFolder) {
      setMessage("Please select files and a folder.");
      return;
    }

    setIsUploading(true);
    setMessage(`Uploading ${files.length} file(s)...`);

    const uploadResults = {
      successful: [],
      failed: [],
    };

    try {
      const accountId = sessionStorage.getItem("accountId");

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
          setMessage(`Uploading ${i + 1}/${files.length}: ${file.name}`);

          const formData = new FormData();
          formData.append("files", file);
          formData.append("accountId", accountId);

          const res = await accountDocsAPI.uploadFile(formData, selectedFolder);

          uploadResults.successful.push({
            fileName: file.name,
            filePath: `${selectedFolder}/${file.name}`,
            uploadDate: new Date().toISOString(),
            serverResponse: res.data,
          });
        } catch (err) {
          console.error(`Upload error for ${file.name}:`, err);

          uploadResults.failed.push({
            fileName: file.name,
            error: err,
          });
        }
      }

      // FINAL RESULT HANDLING
      if (uploadResults.failed.length === 0) {
        setMessage(
          `✅ All ${uploadResults.successful.length} files uploaded successfully!`,
        );

        if (onUploadSuccess) {
          onUploadSuccess(uploadResults.successful);
        }

        // await fetchFolderTree(accountId);

        setTimeout(() => {
          onClose();
        }, 1500);
      } else if (uploadResults.successful.length === 0) {
        setMessage("❌ All files failed to upload");

        if (onUploadError) {
          onUploadError(uploadResults.failed);
        }
      } else {
        setMessage(
          `⚠ ${uploadResults.successful.length} uploaded, ${uploadResults.failed.length} failed`,
        );

        if (onUploadSuccess) {
          onUploadSuccess(uploadResults.successful);
        }

        await fetchFolderTree(accountId);

        setTimeout(() => {
          onClose();
        }, 2500);
      }
    } catch (err) {
      console.error("Upload process error:", err);

      setMessage("❌ Error during upload process");

      if (onUploadError) {
        onUploadError([{ fileName: "Multiple files", error: err }]);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* BACKDROP */}
      {isOpen && (
        <div
          onClick={onClose}
          className="
            fixed inset-0 z-40
            bg-black/50 backdrop-blur-sm
            transition-opacity duration-200
          "
        />
      )}

      {/* DRAWER */}
      <div
        className={`
          fixed top-0 right-0 z-50 h-full
          w-full sm:w-[640px] md:w-[520px]
          bg-white text-gray-900
          border-l border-gray-200
          shadow-lg
          flex flex-col
          transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div className="
          flex items-center justify-between
          px-6 py-4
          border-b border-gray-200
        ">
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold text-gray-900">
              📄 Upload Files ({files?.length || 0})
            </h2>
            <p className="text-xs text-gray-500">
              Upload multiple files to your selected folder
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isUploading}
            className="
              p-1.5 rounded-md
              text-gray-500
              hover:bg-gray-100 hover:text-gray-900
              transition
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Selected Files Display */}
          {files && files.length > 0 && (
            <div className="space-y-2 p-3 bg-gray-50 rounded-md border border-gray-200 max-h-64 overflow-y-auto">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Selected Files:
              </div>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="pb-2 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="text-sm font-medium text-gray-700">
                      <strong>{index + 1}.</strong> {file.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                      {uploadProgress[file.name] !== undefined && (
                        <span className="ml-2 text-blue-600">
                          - Progress: {uploadProgress[file.name]}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MESSAGE DISPLAY */}
          {message && (
            <div className={`
              text-sm p-3 rounded-md
              ${message.includes("✅") ? "bg-green-50 text-green-700 border border-green-200" : ""}
              ${message.includes("❌") ? "bg-red-50 text-red-700 border border-red-200" : ""}
              ${message.includes("⚠") ? "bg-yellow-50 text-yellow-700 border border-yellow-200" : ""}
              ${!message.includes("✅") && !message.includes("❌") && !message.includes("⚠") ? "bg-blue-50 text-blue-700 border border-blue-200" : ""}
            `}>
              {message}
            </div>
          )}

          {/* FOLDER SELECTION */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Select Upload Folder
            </label>
            
            <div className="
              rounded-md border border-gray-200
              bg-gray-50
              max-h-80 overflow-y-auto
              p-2
            ">
              <FolderTreeSelector
                items={folderTree}
                onSelect={handleFolderSelect}
                selectedFolder={selectedFolder}
              />
            </div>
            
            {selectedFolder && (
              <p className="text-xs text-blue-600 mt-1">
                Uploading to: {selectedFolder}
              </p>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="
          border-t border-gray-200
          px-6 py-4
          flex items-center justify-end gap-3
          bg-white
        ">
          <button
            onClick={onClose}
            disabled={isUploading}
            className="
              text-sm font-medium
              text-gray-600
              hover:text-gray-900
              transition
              px-3 py-1.5 rounded-md
              hover:bg-gray-100
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            disabled={!files || files.length === 0 || !selectedFolder || isUploading}
            className="
              inline-flex items-center justify-center
              rounded-md px-4 py-1.5 text-sm font-medium
              bg-blue-600 text-white
              hover:bg-blue-700
              transition
              shadow-sm
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isUploading ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              `Upload ${files?.length || 0} File(s)`
            )}
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

  return (
    <ul className="list-none m-0 p-0 space-y-0.5">
      {items?.map((item) => {
        if (item.type !== "folder") return null;

        // ⛔ Skip displaying this folder completely
        if (item.name?.toLowerCase() === "firm documents shared with client")
          return null;

        const isSelected = selectedFolder === item.path;
        const isExpanded = expanded[item.path];
        const hasChildren = item.children?.length > 0;
        const isReadOnly = item.meta?.readOnly;

        return (
          <React.Fragment key={item.path}>
            <li>
              <div
                className={`
                  rounded-md transition-all duration-200
                  ${isReadOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
                  ${isSelected && !isReadOnly ? 'bg-blue-100' : !isReadOnly ? 'hover:bg-gray-100' : ''}
                `}
                style={{ paddingLeft: `${level * 12}px` }}
                onClick={() => {
                  if (!isReadOnly) {
                    onSelect(item.path);
                  }
                }}
              >
                <div className="flex items-center py-1.5 px-2 gap-1">
                  {/* Expand/Collapse Button */}
                  {hasChildren && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(item.path);
                      }}
                      className="p-0.5 rounded hover:bg-gray-200 transition"
                      disabled={isReadOnly}
                    >
                      {isExpanded ? (
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                  )}

                  {/* Spacer if no children */}
                  {!hasChildren && <div className="w-5" />}

                  {/* Folder Icon */}
                  <svg className={`w-4 h-4 flex-shrink-0 ${isReadOnly ? 'text-gray-400' : 'text-yellow-600'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>

                  {/* Folder Name */}
                  <span className={`
                    text-sm flex-1
                    ${isSelected && !isReadOnly ? 'font-semibold text-blue-700' : isReadOnly ? 'text-gray-400' : 'text-gray-700'}
                  `}>
                    {item.name}
                  </span>

                  {/* Read-only badge */}
                  {isReadOnly && (
                    <span className="text-xs text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">
                      Read Only
                    </span>
                  )}
                </div>
              </div>

              {/* Children */}
              {hasChildren && isExpanded && (
                <div className="mt-0.5">
                  <FolderTreeSelector
                    items={item.children}
                    onSelect={onSelect}
                    selectedFolder={selectedFolder}
                    level={level + 1}
                  />
                </div>
              )}
            </li>
          </React.Fragment>
        );
      })}
    </ul>
  );
};

export default FileUploadDrawer;