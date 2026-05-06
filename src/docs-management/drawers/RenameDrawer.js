

// // import React, { useState, useEffect } from "react";
// // import { Drawer, Box, Typography, TextField, Button } from "@mui/material";
// // import axios from "axios";
// // import { toast } from "material-react-toastify";
// // import { accountDocsAPI } from "../../services/api";

// // const RenameDrawer = ({
// //   isOpen,
// //   onClose,
// //   fetchFolderTree,
// //   selectedFolderForMenu, // the selected file/folder to rename
// // }) => {
// //   const [newName, setNewName] = useState("");
// //   const [currentPath, setCurrentPath] = useState("");
// //   const [message, setMessage] = useState("");

// //   // ✅ Pre-fill selected item info
// //   useEffect(() => {
// //     if (isOpen && selectedFolderForMenu) {
// //       setCurrentPath(selectedFolderForMenu.path);
// //       setNewName(selectedFolderForMenu.name);
// //       setMessage("");
// //     } else if (!isOpen) {
// //       setCurrentPath("");
// //       setNewName("");
// //       setMessage("");
// //     }
// //   }, [isOpen, selectedFolderForMenu]);

// //   // ✅ Rename function
// //   // const handleRename = async () => {
// //   //   if (!newName.trim()) {
// //   //     setMessage("⚠️ New name is required!");
// //   //     return;
// //   //   }

// //   //   try {
// //   //     const res = await axios.post(
// //   //       "https://www.snptaxes.com/api/accountsdoc/rename",
// //   //       {
// //   //         currentPath,
// //   //         newName,
// //   //       }
// //   //     );

// //   //     setMessage(`✅ ${res.data.message}`);
// //   //     toast.success(`${res.data.message}`)
// //   //        onClose();
// //   //     fetchFolderTree(); // refresh folder structure
     
// //   //   } catch (err) {
// //   //     console.error("Rename error:", err);
// //   //     setMessage(`❌ Error: ${err.response?.data?.error || "Server Error"}`);
// //   //   }
// //   // };
// // const handleRename = async () => {
// //   if (!newName.trim()) {
// //     setMessage("⚠️ New name is required!");
// //     return;
// //   }

// //   try {
// //     const res = await accountDocsAPI.renameItem({
// //       currentPath,
// //       newName,
// //     });

// //     const data = res.data;

// //     setMessage(`✅ ${data.message}`);
// //     toast.success(data.message);

// //     onClose();
// //     await fetchFolderTree();
// //   } catch (err) {
// //     console.error("Rename error:", err);

// //     setMessage(
// //       `❌ Error: ${err.response?.data?.error || "Server Error"}`
// //     );

// //     toast.error("Rename failed");
// //   }
// // };
// //   return (
// //     <Drawer anchor="right" open={isOpen} onClose={onClose}>
// //       <Box sx={{ width: 400, p: 3, height: "100%" }}>
// //         <Typography variant="h6" gutterBottom>
// //           ✏️ Rename Item
// //         </Typography>

       

// //         <TextField
// //           label="New Name"
// //           value={newName}
// //           onChange={(e) => setNewName(e.target.value)}
// //           placeholder="Enter new file or folder name"
// //           fullWidth
// //           margin="dense"
// //         />

// //         <Button
// //           // variant="contained"
// //           color="primary"
// //           fullWidth
// //           // sx={{ mt: 2 }}
// //           onClick={handleRename}
// //            sx={{
// //               backgroundColor: 'text.menu',
// //               mt:2,
// //               color: 'primary.contrastText',
// //               '&:hover': {
// //                 backgroundColor: 'menu.dark',
// //                 boxShadow: 1,
// //               },
// //               transition: 'background-color 0.2s ease'
// //             }}
// //         >
// //           Rename
// //         </Button>

// //         {message && (
// //           <Typography sx={{ mt: 2, fontWeight: "bold" }}>{message}</Typography>
// //         )}

// //         <Button
// //           variant="outlined"
// //           fullWidth
// //           sx={{ mt: 2 }}
// //           onClick={onClose}
// //         >
// //           Close
// //         </Button>
// //       </Box>
// //     </Drawer>
// //   );
// // };

// // export default RenameDrawer;


// import React, { useState, useEffect } from "react";
// // import { toast } from "material-react-toastify";
// import { accountDocsAPI } from "../../services/api";
// import { useToast } from "../../hooks/useToast";

// const RenameDrawer = ({
//   isOpen,
//   onClose,
//   fetchFolderTree,
//   selectedFolderForMenu, // the selected file/folder to rename
// }) => {
//   const [newName, setNewName] = useState("");
//   const [currentPath, setCurrentPath] = useState("");
//   const [message, setMessage] = useState("");
// const toast =useToast()
//   // ✅ Pre-fill selected item info
//   useEffect(() => {
//     if (isOpen && selectedFolderForMenu) {
//       setCurrentPath(selectedFolderForMenu.path);
//       setNewName(selectedFolderForMenu.name);
//       setMessage("");
//     } else if (!isOpen) {
//       setCurrentPath("");
//       setNewName("");
//       setMessage("");
//     }
//   }, [isOpen, selectedFolderForMenu]);

//   // ✅ Rename function
//   const handleRename = async () => {
//     if (!newName.trim()) {
//       setMessage("⚠️ New name is required!");
//       return;
//     }

//     try {
//       const res = await accountDocsAPI.renameItem({
//         currentPath,
//         newName,
//       });

//       const data = res.data;

//       setMessage(`✅ ${data.message}`);
//       toast.success(data.message);

//       onClose();
//       await fetchFolderTree();
//     } catch (err) {
//       console.error("Rename error:", err);

//       setMessage(
//         `❌ Error: ${err.response?.data?.error || "Server Error"}`
//       );

//       toast.error("Rename failed");
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
//               ✏️ Rename Item
//             </h2>
//             <p className="text-xs text-gray-500">
//               Change the name of your file or folder
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
//           {/* Current Item Info */}
//           {currentPath && (
//             <div className="space-y-1.5">
//               <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//                 Current Path
//               </label>
//               <div className="
//                 text-sm text-gray-600 p-2
//                 bg-gray-50 rounded-md
//                 border border-gray-200
//                 break-all
//               ">
//                 {currentPath}
//               </div>
//             </div>
//           )}

//           {/* New Name Input */}
//           <div className="space-y-1.5">
//             <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//               New Name
//             </label>
            
//             <input
//               type="text"
//               value={newName}
//               onChange={(e) => setNewName(e.target.value)}
//               placeholder="Enter new file or folder name"
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
//             onClick={handleRename}
//             disabled={!newName.trim()}
//             className="
//               inline-flex items-center justify-center
//               rounded-md px-4 py-1.5 text-sm font-medium
//               bg-blue-600 text-white
//               hover:bg-blue-700
//               transition
//               shadow-sm
//               disabled:opacity-50 disabled:cursor-not-allowed
//             "
//           >
//             Rename
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default RenameDrawer;

import React, { useState, useEffect } from "react";
// import { toast } from "material-react-toastify";
import { accountDocsAPI } from "../../services/api";
import { useToast } from "../../hooks/useToast";

const RenameDrawer = ({
  isOpen,
  onClose,
  fetchFolderTree,
  selectedFolderForMenu,
}) => {
  const [newName, setNewName] = useState("");
  const [currentPath, setCurrentPath] = useState("");
  const [message, setMessage] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setCurrentPath(selectedFolderForMenu.path);
      setNewName(selectedFolderForMenu.name);
      setMessage("");
    } else if (!isOpen) {
      setCurrentPath("");
      setNewName("");
      setMessage("");
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleRename = async () => {
    if (!newName.trim()) {
      setMessage("⚠️ New name is required!");
      return;
    }

    try {
      const res = await accountDocsAPI.renameItem({
        currentPath,
        newName,
      });

      const data = res.data;

      setMessage(`✅ ${data.message}`);
      toast.success(data.message);

      onClose();
      await fetchFolderTree();
    } catch (err) {
      console.error("Rename error:", err);

      setMessage(
        `❌ Error: ${err.response?.data?.error || "Server Error"}`
      );

      toast.error("Rename failed");
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
          shadow-lg flex flex-col
          transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold">
              ✏️ Rename Item
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Change the name of your file or folder
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Current Path */}
          {currentPath && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Current Path
              </label>
              <div className="text-sm text-gray-600 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md break-all">
                {currentPath}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              New Name
            </label>

            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new file or folder name"
              className="
                w-full rounded-md
                border border-gray-200 dark:border-gray-700
                bg-white dark:bg-gray-800
                px-3 py-2 text-sm
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400
                focus:outline-none
                focus:ring-2 focus:ring-blue-500/30
                focus:border-blue-500
                transition
              "
            />
          </div>

          {/* MESSAGE */}
          {message && (
            <div className={`
              text-sm p-3 rounded-md border
              ${message.includes("✅") 
                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800" 
                : ""}
              ${message.includes("❌") 
                ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800" 
                : ""}
              ${!message.includes("✅") && !message.includes("❌") 
                ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800" 
                : ""}
            `}>
              {message}
            </div>
          )}
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
            onClick={handleRename}
            disabled={!newName.trim()}
            className="
              inline-flex items-center justify-center
              rounded-md px-4 py-1.5 text-sm font-medium
              bg-blue-600 text-white
              hover:bg-blue-700
              transition shadow-sm
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Rename
          </button>
        </div>
      </div>
    </>
  );
};

export default RenameDrawer;