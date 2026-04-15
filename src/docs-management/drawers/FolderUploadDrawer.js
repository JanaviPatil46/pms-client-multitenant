


import React, { useState, useEffect,useRef } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { toast } from "material-react-toastify";
import JSZip from "jszip";
import axios from "axios";
import { accountDocsAPI } from "../../services/api";
const FolderUploadDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
}) => {
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");
  const [folderName, setFolderName] = useState("my-uploaded-folder");
  const [files, setFiles] = useState([]);
 const hiddenFileInput = useRef(null);
  // open hidden input
  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
      setFolderName("");
    } else if (!isOpen) {
      setSelectedFolder("");
      setFolderName("");
      setFiles([]);
      setMessage("");
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleFolderSelect = (path) => setSelectedFolder(path);

  
 const handleUploadFolderSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    if (selectedFiles.length > 0) {
      const firstPath = selectedFiles[0].webkitRelativePath;
      const topLevelFolder = firstPath.split("/")[0];
      setFolderName(topLevelFolder);
    }
  };
  const handleUpload = async () => {
  if (!files.length) {
    alert("Please select a folder first!");
    return;
  }

  if (!selectedFolder || selectedFolder.trim() === "") {
    alert("Please select target path first!");
    return;
  }

  let targetFolderPath = selectedFolder
    ? `${selectedFolder}/${folderName}`
    : folderName;

  targetFolderPath = targetFolderPath.replace(/\/+/g, "/");

  console.log("Target Folder Path:", targetFolderPath);

  setMessage("Zipping folder...");

  const zip = new JSZip();

  files.forEach((file) => {
    zip.file(file.webkitRelativePath, file);
  });

  const zipBlob = await zip.generateAsync({ type: "blob" });

  const formData = new FormData();
  formData.append("folderZip", zipBlob, `${folderName}.zip`);
  formData.append("folderName", folderName);
  formData.append("folderPath", targetFolderPath);

  setMessage("Uploading...");

  try {
    const res = await accountDocsAPI.uploadFolderZip(formData);

    const data = res.data;

    setMessage(data.message || "Uploaded successfully!");

    console.log(data.message);

    toast.success("Folder uploaded successfully");

    await fetchFolderTree();
    onClose();
  } catch (err) {
    console.error(err);

    setMessage("Upload failed!");
    toast.error("Upload failed!");
  }
};
// const handleUpload = async () => {
//     if (!files.length) {
//       alert("Please select a folder first!");
//       return;
//     }
//     // ⭐ Check target folder not selected
//     if (!selectedFolder || selectedFolder.trim() === "") {
//       alert("Please select target path first!");
//       return;
//     }

//     // ------------------------------
//     // ⭐ Use targetFolderPath logic
//     // ------------------------------
//     let targetFolderPath = selectedFolder
//       ? `${selectedFolder}/${folderName}`
//       : folderName;

//     targetFolderPath = targetFolderPath.replace(/\/+/g, "/");
//     console.log("Target Folder Path:", targetFolderPath);
//     setMessage("Zipping folder...");

//     const zip = new JSZip();
//     files.forEach((file) => {
//       zip.file(file.webkitRelativePath, file);
//     });

//     const zipBlob = await zip.generateAsync({ type: "blob" });

//     const formData = new FormData();
//     formData.append("folderZip", zipBlob, `${folderName}.zip`);
//     formData.append("folderName", folderName);
//     formData.append("folderPath", targetFolderPath);

//     setMessage("Uploading...");

//     try {
//       const res = await axios.post(
//         "https://snptaxes.com/api/accountsdoc/upload-folder",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
//       setMessage(res.data.message || "Uploaded successfully!");
//       console.log(res.data.message);
//       toast.success(`Folder uploaded successfully`);
//       fetchFolderTree();
//       onClose();
//     } catch (err) {
//       console.error(err);
//       setMessage("Upload failed!");
//     }
//   };
  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{ width: 400, p: 3,  height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          📁 Upload Folder
        </Typography>

        <Button
          variant="outlined"
          color="primary"
          onClick={handleClick}
          sx={{ mb: 2 }}
        >
          Select Folder
        </Button>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={hiddenFileInput}
          onChange={handleUploadFolderSelect}
          style={{ display: "none" }}
          webkitdirectory="true"
          directory="true"
          multiple
        />
        <Button
          // variant="contained"
          color="primary"
          fullWidth
          onClick={handleUpload}
           sx={{
              backgroundColor: 'text.menu',
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'menu.dark',
                boxShadow: 1,
              },
              transition: 'background-color 0.2s ease'
            }}
        >
          🚀 Upload
        </Button>

        {message && (
          <Typography sx={{ mt: 2, fontWeight: "bold" }}>{message}</Typography>
        )}

        <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={onClose}>
          Close
        </Button>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Select Parent Folder from Tree
          </Typography>
          <FolderTreeSelector
            items={folderTree}
            onSelect={handleFolderSelect}
            selectedFolder={selectedFolder}
          />
        </Box>
      </Box>
    </Drawer>
  );
};


const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (path) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <List disablePadding>
      {items?.map((item) => {
        if (item.type !== "folder") return null;

        // ⛔ Skip displaying this folder completely
        if (item.name?.toLowerCase() === "firm documents shared with client") return null;

        const isSelected = selectedFolder === item.path;
        const isExpanded = expanded[item.path];

        return (
          <React.Fragment key={item.path}>
            
            <ListItem
  sx={{
    pl: 2 + level * 2,
    bgcolor: isSelected ? "#b2d8ff" : "transparent",
    borderRadius: 1,
    mb: 0.5,

    cursor: item.meta?.readOnly ? "not-allowed" : "pointer",
    opacity: item.meta?.readOnly ? 0.6 : 1,
    pointerEvents: item.meta?.readOnly ? "none" : "auto",

    "&:hover": {
      bgcolor: item.meta?.readOnly ? "transparent" : "#dbefff",
      color: "black",
    },
  }}
  onClick={() => {
    if (!item.meta?.readOnly) {
      onSelect(item.path);
    }
  }}
>

              <ListItemIcon
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(item.path);
                }}
              >
                {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
              </ListItemIcon>

              <ListItemText
                primary={item.name}
                sx={{
                  fontWeight: isSelected ? "bold" : "normal",
                  color: isSelected ? "#0056b3" : "inherit",
                }}
              />

              {item.children?.length > 0 &&
                (isExpanded ? (
                  <ExpandLess
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(item.path);
                    }}
                  />
                ) : (
                  <ExpandMore
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(item.path);
                    }}
                  />
                ))}
            </ListItem>

            {item.children?.length > 0 && (
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <FolderTreeSelector
                  items={item.children}
                  onSelect={onSelect}
                  selectedFolder={selectedFolder}
                  level={level + 1}
                />
              </Collapse>
            )}
          </React.Fragment>
        );
      })}
    </List>
  );
};


export default FolderUploadDrawer;

