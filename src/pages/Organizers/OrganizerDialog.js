
// import {
//   MenuItem,
//   Select,
//   FormControl,
//   Dialog,
//   DialogContent,
//   Typography,
//   DialogTitle,
//   IconButton,
//   Box,
//   TextField,
//   Button,
//   Chip,
// } from "@mui/material";
// import { LinearProgress } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { useState, useEffect, useCallback, useRef } from "react";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { toast } from "material-react-toastify";
// import dayjs from "dayjs";
// import { debounce } from "lodash";
// import AddIcon from "@mui/icons-material/Add";
// import SaveIcon from "@mui/icons-material/Save";

// import { useContactAuth } from "../../context/Context";
// import SelectableButton from "./SelectableButton";
// import FileUploadDrawer from "./FileUploadDrawer";
// import { accountsAPI, organizerAPI, accountDocsAPI } from "../../services/api";

// const OrganizerDialog = ({ open, handleClose, organizer }) => {
//   const { user, accountId: contextAccountId } = useContactAuth();
//   const [accountName, setAccountName] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [username, setUsername] = useState("");

//   // Get accountId from context or sessionStorage
//   const accountId = contextAccountId || sessionStorage.getItem("accountId");

//   // Set username from context user
//   useEffect(() => {
//     if (user) {
//       const userName = user.firstName && user.lastName 
//         ? `${user.firstName} ${user.lastName}` 
//         : user.email;
//       setUsername(userName);
//     }
//   }, [user]);

//   const fetchAccountDetails = async () => {
//     if (!accountId) return;
//     try {
//       const res = await accountsAPI.getAccountById(accountId);
//       setAccountName(res.data.accountName || "");
//     } catch (error) {
//       console.error("Error fetching account details:", error);
//     }
//   };

//   useEffect(() => {
//     fetchAccountDetails();
//   }, [accountId]);

//   const [folderTree, setFolderTree] = useState([]);
//   const [error, setError] = useState("");

//   const fetchFolderTree = async (accountId) => {
//     if (!accountId) return;
    
//     try {
//       const res = await accountDocsAPI.clientListFoldersAndFiles(accountId);
//       if (res.data && res.data.contents) {
//         setFolderTree(res.data.contents);
//       } else {
//         setFolderTree([]);
//       }
//     } catch (err) {
//       console.error("Error fetching folder tree:", err);
//       setError("Error fetching folder tree");
//       setFolderTree([]);
//     }
//   };

//   useEffect(() => {
//     if (accountId) {
//       fetchFolderTree(accountId);
//     }
//   }, [accountId]);

//   const sections = organizer?.sections;

//   const [selectedDropdownValues, setSelectedDropdownValues] = useState({});
//   const [inputValues, setInputValues] = useState({});
//   const [selectedYesNoValues, setSelectedYesNoValues] = useState({});
//   const [radioValues, setRadioValues] = useState({});
//   const [checkboxValues, setCheckboxValues] = useState({});
//   const [answeredElements, setAnsweredElements] = useState({});
//   const [activeStep, setActiveStep] = useState(0);
//   const [dateValues, setDateValues] = useState({});
//   const [uploadedFiles, setUploadedFiles] = useState({});
//   const [selectedFiles, setSelectedFiles] = useState({});
//   const [isDocumentForm, setIsDocumentForm] = useState(false);
//   const [repeatedSections, setRepeatedSections] = useState({});
//   const [validationErrors, setValidationErrors] = useState({});
//   const [pendingFiles, setPendingFiles] = useState({});
//   const [previousVisibleSections, setPreviousVisibleSections] = useState([]);
  
//   // Use ref to track if initial load is done
//   const isInitialLoadRef = useRef(true);
//   const isAutoSaveEnabledRef = useRef(false);

//   // Helper function to clear all values for a specific section
//   const clearSectionValues = useCallback((sectionId) => {
//     const numericSectionId = Number(sectionId);
    
//     setRadioValues(prev => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach(key => {
//         const [keySectionId] = key.split('_');
//         if (Number(keySectionId) === numericSectionId) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setCheckboxValues(prev => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach(key => {
//         const [keySectionId] = key.split('_');
//         if (Number(keySectionId) === numericSectionId) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setSelectedDropdownValues(prev => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach(key => {
//         const [keySectionId] = key.split('_');
//         if (Number(keySectionId) === numericSectionId) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setSelectedYesNoValues(prev => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach(key => {
//         const [keySectionId] = key.split('_');
//         if (Number(keySectionId) === numericSectionId) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setInputValues(prev => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach(key => {
//         const [keySectionId] = key.split('_');
//         if (Number(keySectionId) === numericSectionId) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setDateValues(prev => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach(key => {
//         const [keySectionId] = key.split('_');
//         if (Number(keySectionId) === numericSectionId) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setAnsweredElements(prev => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach(key => {
//         const [keySectionId] = key.split('_');
//         if (Number(keySectionId) === numericSectionId) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setUploadedFiles(prev => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach(key => {
//         const [keySectionId] = key.split('_');
//         if (Number(keySectionId) === numericSectionId) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setPendingFiles(prev => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach(key => {
//         const [keySectionId] = key.split('_');
//         if (Number(keySectionId) === numericSectionId) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setSelectedFiles(prev => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach(key => {
//         const [keySectionId] = key.split('_');
//         if (Number(keySectionId) === numericSectionId) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setValidationErrors(prev => {
//       const newErrors = { ...prev };
//       if (newErrors[numericSectionId]) {
//         delete newErrors[numericSectionId];
//       }
//       return newErrors;
//     });
//   }, []);

//   const addRepeatedSection = (sectionId) => {
//     const baseSection = sections?.find(s => s.id === sectionId);
//     if (!baseSection) return;

//     setRepeatedSections((prev) => {
//       const currentRepeats = prev[sectionId] || [];
//       const baseId = Number(sectionId);
//       const newRepeatId = baseId + (currentRepeats.length + 1) * 1000000;
      
//       return {
//         ...prev,
//         [sectionId]: [...currentRepeats, newRepeatId],
//       };
//     });
//   };

//   const removeRepeatedSection = (sectionId, repeatId) => {
//     setRepeatedSections((prev) => {
//       const currentRepeats = prev[sectionId] || [];
//       const updatedRepeats = currentRepeats.filter((id) => id !== repeatId);

//       cleanUpSectionData(repeatId);

//       return {
//         ...prev,
//         [sectionId]: updatedRepeats,
//       };
//     });
//   };

//   const cleanUpSectionData = (sectionId) => {
//     const numericSectionId = typeof sectionId === "string" ? Number(sectionId) : sectionId;

//     setInputValues((prev) => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach((key) => {
//         if (key.startsWith(`${numericSectionId}_`)) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setRadioValues((prev) => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach((key) => {
//         if (key.startsWith(`${numericSectionId}_`)) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setCheckboxValues((prev) => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach((key) => {
//         if (key.startsWith(`${numericSectionId}_`)) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setSelectedYesNoValues((prev) => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach((key) => {
//         if (key.startsWith(`${numericSectionId}_`)) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setSelectedDropdownValues((prev) => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach((key) => {
//         if (key.startsWith(`${numericSectionId}_`)) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setAnsweredElements((prev) => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach((key) => {
//         if (key.startsWith(`${numericSectionId}_`)) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setUploadedFiles((prev) => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach((key) => {
//         if (key.startsWith(`${numericSectionId}_`)) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setPendingFiles((prev) => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach((key) => {
//         if (key.startsWith(`${numericSectionId}_`)) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setSelectedFiles((prev) => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach((key) => {
//         if (key.startsWith(`${numericSectionId}_`)) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });
//   };

//   const handleDateChange = (newValue, elementText, sectionId) => {
//     const numericSectionId = typeof sectionId === "string" ? Number(sectionId) : sectionId;
//     const key = `${numericSectionId}_${elementText}`;

//     setDateValues((prev) => ({
//       ...prev,
//       [key]: newValue,
//     }));

//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));

//     if (validationErrors[numericSectionId]?.[elementText]) {
//       setValidationErrors((prev) => {
//         const newErrors = { ...prev };
//         if (newErrors[numericSectionId]) {
//           delete newErrors[numericSectionId][elementText];
//           if (Object.keys(newErrors[numericSectionId]).length === 0) {
//             delete newErrors[numericSectionId];
//           }
//         }
//         return newErrors;
//       });
//     }
//   };

//   const handleFileSelect = (event, elementText, sectionId) => {
//     const numericSectionId = typeof sectionId === "string" ? Number(sectionId) : sectionId;
//     const key = `${numericSectionId}_${elementText}`;
//     const files = event.target.files;

//     if (files && files.length > 0) {
//       const fileArray = Array.from(files);

//       setSelectedFiles((prev) => ({
//         ...prev,
//         [key]: fileArray,
//       }));

//       setPendingFiles((prev) => ({
//         ...prev,
//         [key]: fileArray.map((file) => ({
//           fileName: file.name,
//           file: file,
//         })),
//       }));

//       setIsDocumentForm(true);
//     }
//   };

//   const handleDeleteFile = async (sectionId, elementText, fileName = null) => {
//     const key = `${sectionId}_${elementText}`;

//     if (fileName) {
//       const fileInfo = uploadedFiles[key]?.find((f) => f.fileName === fileName);

//       if (!fileInfo) return;

//       try {
//         const confirmDelete = window.confirm(
//           `Are you sure you want to delete "${fileInfo.fileName}"?`
//         );

//         if (!confirmDelete) return;

//         if (fileInfo.filePath) {
//           const deleteResponse = await fetch(
//             "https://www.snptaxes.com/api/accountsdoc/delete",
//             {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({
//                 targetPath: `${fileInfo.filePath}`,
//               }),
//             }
//           );

//           const deleteData = await deleteResponse.json();

//           if (!deleteResponse.ok || !deleteData.success) {
//             throw new Error(
//               deleteData.message || "Failed to delete file from storage"
//             );
//           }
//         }

//         setUploadedFiles((prev) => {
//           const newState = { ...prev };
//           if (newState[key]) {
//             newState[key] = newState[key].filter(
//               (f) => f.fileName !== fileName
//             );
//             if (newState[key].length === 0) {
//               delete newState[key];
//             }
//           }
//           return newState;
//         });

//         setAnsweredElements((prev) => {
//           const newState = { ...prev };
//           if (!uploadedFiles[key] || uploadedFiles[key].length <= 1) {
//             delete newState[key];
//           }
//           return newState;
//         });

//         toast.success("File deleted successfully!");
//       } catch (error) {
//         console.error("Error deleting file:", error);
//         toast.error(error.message || "Failed to delete file");
//       }
//     } else {
//       const fileInfos = uploadedFiles[key];

//       if (!fileInfos || fileInfos.length === 0) return;

//       try {
//         const confirmDelete = window.confirm(
//           `Are you sure you want to delete all ${fileInfos.length} files?`
//         );

//         if (!confirmDelete) return;

//         for (const fileInfo of fileInfos) {
//           if (fileInfo.filePath) {
//             const deleteResponse = await fetch(
//               "https://www.snptaxes.com/api/accountsdoc/delete",
//               {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                   targetPath: `${fileInfo.filePath}/${fileInfo.fileName}`,
//                 }),
//               }
//             );

//             const deleteData = await deleteResponse.json();

//             if (!deleteResponse.ok || !deleteData.success) {
//               throw new Error(
//                 deleteData.message || "Failed to delete file from storage"
//               );
//             }
//           }
//         }

//         setUploadedFiles((prev) => {
//           const newState = { ...prev };
//           delete newState[key];
//           return newState;
//         });

//         setAnsweredElements((prev) => {
//           const newState = { ...prev };
//           delete newState[key];
//           return newState;
//         });

//         setPendingFiles((prev) => {
//           const newState = { ...prev };
//           delete newState[key];
//           return newState;
//         });

//         setSelectedFiles((prev) => {
//           const newState = { ...prev };
//           delete newState[key];
//           return newState;
//         });

//         toast.success("All files deleted successfully!");
//       } catch (error) {
//         console.error("Error deleting files:", error);
//         toast.error(error.message || "Failed to delete files");
//       }
//     }
//   };

//   // Auto-save function using axios
//   const autoSaveOrganizer = useCallback(async (data) => {
//     if (!organizer?._id || organizer?.status === "Completed") {
//       return;
//     }
    
//     if (!isAutoSaveEnabledRef.current) {
//       return;
//     }
    
//     try {
//       await organizerAPI.autoSaveOrganizer(organizer._id, data);
//       console.log("Auto-save successful");
//     } catch (error) {
//       console.error("Error auto-saving organizer:", error);
//     }
//   }, [organizer?._id, organizer?.status]);

//   // Manual save function
//   const manualSave = useCallback(async () => {
//     if (!organizer?._id || organizer?.status === "Completed") {
//       toast.warning("Cannot save completed organizer");
//       return;
//     }
    
//     setIsSaving(true);
//     const data = prepareSubmitData(false);
//     try {
//       await organizerAPI.autoSaveOrganizer(organizer._id, data);
//       toast.success("Progress saved successfully!");
//     } catch (error) {
//       console.error("Error saving organizer:", error);
//       toast.error("Failed to save progress");
//     } finally {
//       setIsSaving(false);
//     }
//   }, [organizer?._id, organizer?.status, prepareSubmitData]);

//   // Debounced auto-save
//   const debouncedAutoSave = useCallback(
//     debounce((data) => {
//       autoSaveOrganizer(data);
//     }, 3000),
//     [autoSaveOrganizer]
//   );

//   // Memoized shouldShowSection to prevent recreation
//   const shouldShowSection = useCallback((section) => {
//     if (!section.sectionsettings?.conditional) return true;

//     const conditions = section.sectionsettings.conditions || [];
//     const mode = section.sectionsettings.mode || "All";

//     if (conditions.length === 0) return true;

//     let matchedConditions = 0;

//     conditions.forEach((condition) => {
//       if (!condition.question || !condition.answer) return;

//       let conditionMet = false;

//       // Check radio values
//       for (const key in radioValues) {
//         if (key.endsWith(`_${condition.question}`)) {
//           if (radioValues[key] === condition.answer) {
//             conditionMet = true;
//             break;
//           }
//         }
//       }
      
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") return;
//         return;
//       }

//       // Check checkbox values
//       for (const key in checkboxValues) {
//         if (key.endsWith(`_${condition.question}`)) {
//           const checkboxSectionAnswer = checkboxValues[key]?.[condition.answer];
//           if (checkboxSectionAnswer) {
//             conditionMet = true;
//             break;
//           }
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") return;
//         return;
//       }

//       // Check dropdown values
//       for (const key in selectedDropdownValues) {
//         if (key.endsWith(`_${condition.question}`)) {
//           if (selectedDropdownValues[key] === condition.answer) {
//             conditionMet = true;
//             break;
//           }
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") return;
//         return;
//       }

//       // Check yes/no values
//       for (const key in selectedYesNoValues) {
//         if (key.endsWith(`_${condition.question}`)) {
//           if (selectedYesNoValues[key] === condition.answer) {
//             conditionMet = true;
//             break;
//           }
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") return;
//       }
//     });

//     if (mode === "Any") {
//       return matchedConditions > 0;
//     } else {
//       return matchedConditions === conditions.length;
//     }
//   }, [radioValues, checkboxValues, selectedDropdownValues, selectedYesNoValues]);

//   // Function to get visible sections
//   const getVisibleSections = useCallback(() => {
//     const currentlyVisible = (sections || []).filter(shouldShowSection);
    
//     const allSections = [];

//     currentlyVisible.forEach((section) => {
//       allSections.push(section);

//       if (
//         section.sectionsettings?.sectionRepeatingMode &&
//         repeatedSections[section.id]
//       ) {
//         repeatedSections[section.id].forEach((repeatId, index) => {
//           allSections.push({
//             ...section,
//             id: repeatId.toString(),
//             text: `${section.text} (Repeated ${index + 1})`,
//             isRepeated: true,
//             originalSectionId: section.id,
//           });
//         });
//       }
//     });

//     return allSections;
//   }, [sections, shouldShowSection, repeatedSections]);

//   const prepareSubmitData = useCallback((finalSubmit = false) => {
//     const allVisibleSections = getVisibleSections();
    
//     const sectionsData = allVisibleSections.map((section) => {
//       let baseSection = section;
      
//       if (section.isRepeated && section.originalSectionId) {
//         const originalSection = sections?.find(s => s.id === section.originalSectionId);
//         if (originalSection) {
//           baseSection = {
//             ...originalSection,
//             id: section.id,
//             text: section.text || originalSection.text,
//             sectionsettings: {
//               ...originalSection.sectionsettings,
//               isRepeated: true,
//               originalSectionId: section.originalSectionId,
//             }
//           };
//         }
//       }
      
//       return {
//         name: baseSection?.text || "",
//         id: baseSection?.id?.toString() || "",
//         text: baseSection?.text || "",
//         sectionsettings: baseSection?.sectionsettings || {},
//         formElements:
//           baseSection?.formElements?.map((question) => {
//             const questionData = {
//               type: question?.type || "",
//               id: question?.id || "",
//               sectionid: Number(baseSection?.id) || 0,
//               options:
//                 question?.options?.map((option) => ({
//                   id: option?.id || "",
//                   text: option?.text || "",
//                   selected: getOptionSelectedState(
//                     question,
//                     option,
//                     Number(baseSection.id)
//                   ),
//                 })) || [],
//               text: question?.text || "",
//               textvalue: getQuestionTextValue(question, Number(baseSection.id)),
//               questionsectionsettings: question?.questionsectionsettings,
//             };

//             if (question.type === "File Upload") {
//               const fileKey = `${baseSection.id}_${question.text}`;
//               const fileInfos = uploadedFiles[fileKey];

//               if (fileInfos && fileInfos.length > 0) {
//                 const completedFiles = fileInfos.filter(
//                   (file) => file.status === "completed"
//                 );
//                 if (completedFiles.length > 0) {
//                   questionData.fileMetadata = completedFiles.map((fileInfo) => ({
//                     fileName: fileInfo.fileName,
//                     filePath: fileInfo.filePath || "",
//                     uploadDate: fileInfo.uploadDate || new Date().toISOString(),
//                     uploadedBy: accountName || username,
//                   }));
//                   questionData.textvalue = completedFiles
//                     .map((f) => f.fileName)
//                     .join(", ");
//                 } else {
//                   questionData.textvalue = "";
//                 }
//               } else {
//                 questionData.textvalue = "";
//               }
//             }

//             return questionData;
//           }) || [],
//       };
//     });

//     const data = {
//       sections: sectionsData,
//       status: finalSubmit ? "Completed" : "In Progress",
//       completedby: accountName || username,
//       active: true,
//       repeatedSections: repeatedSections,
//     };

//     return data;
//   }, [getVisibleSections, sections, uploadedFiles, accountName, username, repeatedSections]);

//   // Auto-save effect with proper dependencies
//   useEffect(() => {
//     if (open && organizer?._id && organizer?.status !== "Completed" && isAutoSaveEnabledRef.current) {
//       const data = prepareSubmitData(false);
//       debouncedAutoSave(data);
//     }
//   }, [
//     open,
//     organizer?._id,
//     organizer?.status,
//     inputValues,
//     radioValues,
//     checkboxValues,
//     selectedYesNoValues,
//     selectedDropdownValues,
//     dateValues,
//     uploadedFiles,
//     repeatedSections,
//     prepareSubmitData,
//     debouncedAutoSave,
//   ]);

//   // Enable auto-save after initial load
//   useEffect(() => {
//     if (open && organizer?._id && !isInitialLoadRef.current) {
//       // Small delay to ensure all states are stable
//       const timer = setTimeout(() => {
//         isAutoSaveEnabledRef.current = true;
//       }, 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [open, organizer?._id]);

//   useEffect(() => {
//     return () => {
//       debouncedAutoSave.cancel();
//     };
//   }, [debouncedAutoSave]);

//   const handleRadioChange = (value, elementText, sectionId) => {
//     const numericSectionId = typeof sectionId === "string" ? Number(sectionId) : sectionId;
//     const key = `${numericSectionId}_${elementText}`;
//     setRadioValues((prevValues) => ({
//       ...prevValues,
//       [key]: value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));

//     if (validationErrors[numericSectionId]?.[elementText]) {
//       setValidationErrors((prev) => {
//         const newErrors = { ...prev };
//         if (newErrors[numericSectionId]) {
//           delete newErrors[numericSectionId][elementText];
//           if (Object.keys(newErrors[numericSectionId]).length === 0) {
//             delete newErrors[numericSectionId];
//           }
//         }
//         return newErrors;
//       });
//     }
//   };

//   const handleCheckboxChange = (value, elementText, sectionId) => {
//     const numericSectionId = typeof sectionId === "string" ? Number(sectionId) : sectionId;
//     const key = `${numericSectionId}_${elementText}`;
//     setCheckboxValues((prevValues) => ({
//       ...prevValues,
//       [key]: {
//         ...prevValues[key],
//         [value]: !prevValues[key]?.[value],
//       },
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));

//     if (validationErrors[numericSectionId]?.[elementText]) {
//       setValidationErrors((prev) => {
//         const newErrors = { ...prev };
//         if (newErrors[numericSectionId]) {
//           delete newErrors[numericSectionId][elementText];
//           if (Object.keys(newErrors[numericSectionId]).length === 0) {
//             delete newErrors[numericSectionId];
//           }
//         }
//         return newErrors;
//       });
//     }
//   };

//   const handleYesNoChange = (value, elementText, sectionId) => {
//     const numericSectionId = typeof sectionId === "string" ? Number(sectionId) : sectionId;
//     const key = `${numericSectionId}_${elementText}`;
//     setSelectedYesNoValues((prevValues) => ({
//       ...prevValues,
//       [key]: value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));

//     if (validationErrors[numericSectionId]?.[elementText]) {
//       setValidationErrors((prev) => {
//         const newErrors = { ...prev };
//         if (newErrors[numericSectionId]) {
//           delete newErrors[numericSectionId][elementText];
//           if (Object.keys(newErrors[numericSectionId]).length === 0) {
//             delete newErrors[numericSectionId];
//           }
//         }
//         return newErrors;
//       });
//     }
//   };

//   const handleInputChange = (event, elementText, sectionId) => {
//     const numericSectionId = typeof sectionId === "string" ? Number(sectionId) : sectionId;
//     const key = `${numericSectionId}_${elementText}`;
//     const { value } = event.target;
//     setInputValues((prevValues) => ({
//       ...prevValues,
//       [key]: value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));

//     if (validationErrors[numericSectionId]?.[elementText]) {
//       setValidationErrors((prev) => {
//         const newErrors = { ...prev };
//         if (newErrors[numericSectionId]) {
//           delete newErrors[numericSectionId][elementText];
//           if (Object.keys(newErrors[numericSectionId]).length === 0) {
//             delete newErrors[numericSectionId];
//           }
//         }
//         return newErrors;
//       });
//     }
//   };

//   const handleDropdownValueChange = (event, elementText, sectionId) => {
//     const numericSectionId = typeof sectionId === "string" ? Number(sectionId) : sectionId;
//     const key = `${numericSectionId}_${elementText}`;
//     setSelectedDropdownValues((prevValues) => ({
//       ...prevValues,
//       [key]: event.target.value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));

//     if (validationErrors[numericSectionId]?.[elementText]) {
//       setValidationErrors((prev) => {
//         const newErrors = { ...prev };
//         if (newErrors[numericSectionId]) {
//           delete newErrors[numericSectionId][elementText];
//           if (Object.keys(newErrors[numericSectionId]).length === 0) {
//             delete newErrors[numericSectionId];
//           }
//         }
//         return newErrors;
//       });
//     }
//   };

//   // Separate effect to handle section clearing logic
//   useEffect(() => {
//     if (!sections) return;
    
//     const currentlyVisible = (sections || []).filter(shouldShowSection);
    
//     const sectionsToClear = previousVisibleSections.filter(
//       prevSection => !currentlyVisible.some(currSection => currSection.id === prevSection.id)
//     );
    
//     sectionsToClear.forEach(section => {
//       clearSectionValues(section.id);
//     });
    
//     setPreviousVisibleSections(currentlyVisible);
//   }, [
//     sections,
//     shouldShowSection,
//     clearSectionValues,
//     previousVisibleSections,
//   ]);

//   const visibleSections = getVisibleSections();
//   const totalSteps = visibleSections.length;

//   const shouldShowElement = useCallback((element, sectionId) => {
//     const settings = element.questionsectionsettings;
//     if (!settings?.conditional) return true;

//     const conditions = settings?.conditions || [];
//     const mode = settings?.mode || "All";

//     if (conditions.length === 0) return true;

//     let matchedConditions = 0;

//     for (const condition of conditions) {
//       const { question, answer } = condition;
//       if (!question || !answer) continue;

//       let conditionMet = false;
//       const currentSectionId = typeof sectionId === "string" ? Number(sectionId) : sectionId;

//       // Check radio values
//       for (const key in radioValues) {
//         const [keySectionId] = key.split("_");
//         const numericKeySectionId = Number(keySectionId);

//         if (
//           numericKeySectionId === currentSectionId &&
//           key.endsWith(`_${question}`) &&
//           radioValues[key] === answer
//         ) {
//           conditionMet = true;
//           break;
//         }
//       }
      
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") continue;
//         else continue;
//       }

//       // Check checkbox values
//       for (const key in checkboxValues) {
//         const [keySectionId] = key.split("_");
//         const numericKeySectionId = Number(keySectionId);

//         if (
//           numericKeySectionId === currentSectionId &&
//           key.endsWith(`_${question}`) &&
//           checkboxValues[key]?.[answer]
//         ) {
//           conditionMet = true;
//           break;
//         }
//       }
      
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") continue;
//         else continue;
//       }

//       // Check dropdown values
//       for (const key in selectedDropdownValues) {
//         const [keySectionId] = key.split("_");
//         const numericKeySectionId = Number(keySectionId);

//         if (
//           numericKeySectionId === currentSectionId &&
//           key.endsWith(`_${question}`) &&
//           selectedDropdownValues[key] === answer
//         ) {
//           conditionMet = true;
//           break;
//         }
//       }
      
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") continue;
//         else continue;
//       }

//       // Check yes/no values
//       for (const key in selectedYesNoValues) {
//         const [keySectionId] = key.split("_");
//         const numericKeySectionId = Number(keySectionId);

//         if (
//           numericKeySectionId === currentSectionId &&
//           key.endsWith(`_${question}`) &&
//           selectedYesNoValues[key] === answer
//         ) {
//           conditionMet = true;
//           break;
//         }
//       }
      
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") continue;
//         else continue;
//       }

//       if (mode === "All" && !conditionMet) {
//         return false;
//       }
//     }

//     if (mode === "Any") {
//       return matchedConditions > 0;
//     } else {
//       return matchedConditions === conditions.length;
//     }
//   }, [radioValues, checkboxValues, selectedDropdownValues, selectedYesNoValues]);

//   const handleNext = () => {
//     if (activeStep < totalSteps - 1) {
//       setActiveStep((prevActiveStep) => prevActiveStep + 1);
//     }
//   };

//   const handleBack = () => {
//     if (activeStep > 0) {
//       setActiveStep((prevActiveStep) => prevActiveStep - 1);
//     }
//   };

//   const handleDropdownChange = (event) => {
//     const selectedIndex = event.target.value;
//     setActiveStep(selectedIndex);
//   };

//   // Submit function using axios
//   const handleSubmit = async () => {
//     const errors = {};

//     visibleSections.forEach((section) => {
//       section.formElements.forEach((element) => {
//         if (
//           shouldShowElement(element, section.id) &&
//           element.questionsectionsettings?.required
//         ) {
//           const key = `${section.id}_${element.text}`;

//           if (element.type === "File Upload") {
//             const fileInfos = uploadedFiles[key];
//             if (
//               !fileInfos ||
//               fileInfos.length === 0 ||
//               !fileInfos.some((f) => f.status === "completed")
//             ) {
//               if (!errors[section.id]) {
//                 errors[section.id] = {};
//               }
//               errors[section.id][
//                 element.text
//               ] = `Please upload the required file(s)`;
//             }
//           } else {
//             const hasAnswer = answeredElements[key];
//             if (!hasAnswer) {
//               if (!errors[section.id]) {
//                 errors[section.id] = {};
//               }
//               errors[section.id][element.text] = `This question is required`;
//             }
//           }
//         }
//       });
//     });

//     setValidationErrors(errors);

//     if (Object.keys(errors).length > 0) {
//       const firstErrorSectionId = Object.keys(errors)[0];
//       const sectionIndex = visibleSections.findIndex(
//         (section) => section.id === firstErrorSectionId
//       );
//       if (sectionIndex !== -1) {
//         setActiveStep(sectionIndex);
//       }

//       toast.error("Please complete all required questions before submitting");
//       return;
//     }

//     setIsLoading(true);
    
//     try {
//       const data = {
//         ...prepareSubmitData(true),
//         status: "Completed",
//         issealed: true,
//         completedby: accountName || username,
//         completedDate: new Date().toISOString(),
//       };

//       await organizerAPI.completeAndNotifyOrganizer(organizer._id, data);

//       organizer.status = "Completed";
//       organizer.issealed = true;
//       organizer.completedby = accountName || username;

//       toast.success("Organizer completed and sealed successfully!");
//       handleClose();
      
//     } catch (error) {
//       console.error("Error submitting organizer:", error);
//       toast.error(
//         error.response?.data?.message || error.message || "Something went wrong while updating organizer!"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getQuestionTextValue = (question, sectionId) => {
//     const numericSectionId = typeof sectionId === "string" ? Number(sectionId) : sectionId;
//     const key = `${numericSectionId}_${question.text}`;

//     switch (question.type) {
//       case "Free Entry":
//       case "Email":
//       case "Number":
//         return inputValues[key] || "";
//       case "Radio Buttons":
//         return radioValues[key] || "";
//       case "Checkboxes":
//         return checkboxValues[key]
//           ? Object.keys(checkboxValues[key])
//               .filter((k) => checkboxValues[key][k])
//               .join(", ")
//           : "";
//       case "Yes/No":
//         return selectedYesNoValues[key] || "";
//       case "Dropdown":
//         return selectedDropdownValues[key] || "";
//       case "Date":
//         return dateValues[key]?.toISOString() || "";
//       case "Text Editor":
//         return question.text || "";
//       case "File Upload":
//         const fileInfos = uploadedFiles[key];
//         return fileInfos && fileInfos.length > 0
//           ? fileInfos
//               .filter((f) => f.status === "completed")
//               .map((f) => f.fileName)
//               .join(", ")
//           : "";
//       default:
//         return "";
//     }
//   };

//   const getOptionSelectedState = (question, option, sectionId) => {
//     const numericSectionId = typeof sectionId === "string" ? Number(sectionId) : sectionId;
//     const key = `${numericSectionId}_${question.text}`;
//     switch (question.type) {
//       case "Radio Buttons":
//         return radioValues[key] === option.text;
//       case "Checkboxes":
//         return checkboxValues[key]?.[option.text] || false;
//       case "Yes/No":
//         return selectedYesNoValues[key] === option.text;
//       case "Dropdown":
//         return selectedDropdownValues[key] === option.text;
//       default:
//         return false;
//     }
//   };

//   // Load organizer data effect with proper dependencies
//   useEffect(() => {
//     if (organizer?.sections && open) {
//       // Disable auto-save while loading
//       isAutoSaveEnabledRef.current = false;
//       isInitialLoadRef.current = true;
      
//       const newInputValues = {};
//       const newRadioValues = {};
//       const newCheckboxValues = {};
//       const newSelectedYesNoValues = {};
//       const newSelectedDropdownValues = {};
//       const newAnsweredElements = {};
//       const newUploadedFiles = {};
//       const newRepeatedSections = {};
//       const newDateValues = {};

//       organizer.sections.forEach((section) => {
//         const sectionId = section.id;

//         if (section.sectionsettings?.isRepeated && section.sectionsettings?.originalSectionId) {
//           const originalSectionId = section.sectionsettings.originalSectionId;
//           if (!newRepeatedSections[originalSectionId]) {
//             newRepeatedSections[originalSectionId] = [];
//           }
//           if (!newRepeatedSections[originalSectionId].includes(Number(sectionId))) {
//             newRepeatedSections[originalSectionId].push(Number(sectionId));
//           }
//         }

//         section.formElements.forEach((element) => {
//           const numericSectionId = Number(sectionId);
//           const key = `${numericSectionId}_${element.text}`;

//           if (element.textvalue) {
//             newAnsweredElements[key] = true;

//             switch (element.type) {
//               case "Free Entry":
//               case "Email":
//               case "Number":
//                 newInputValues[key] = element.textvalue;
//                 break;
//               case "Radio Buttons":
//                 newRadioValues[key] = element.textvalue;
//                 break;
//               case "Checkboxes":
//                 const selectedOptions = element.textvalue
//                   .split(",")
//                   .map((s) => s.trim());
//                 newCheckboxValues[key] = {};
//                 element.options.forEach((option) => {
//                   newCheckboxValues[key][option.text] =
//                     selectedOptions.includes(option.text);
//                 });
//                 break;
//               case "Yes/No":
//                 newSelectedYesNoValues[key] = element.textvalue;
//                 break;
//               case "Dropdown":
//                 newSelectedDropdownValues[key] = element.textvalue;
//                 break;
//               case "Date":
//                 newDateValues[key] = element.textvalue
//                   ? dayjs(element.textvalue)
//                   : dayjs();
//                 break;
//               case "File Upload":
//                 if (
//                   element.fileMetadata &&
//                   Array.isArray(element.fileMetadata)
//                 ) {
//                   newUploadedFiles[key] = element.fileMetadata.map(
//                     (fileMeta) => ({
//                       fileName: fileMeta.fileName,
//                       filePath: fileMeta.filePath,
//                       uploadDate: fileMeta.uploadDate,
//                       uploadedBy: fileMeta.uploadedBy,
//                       status: "completed",
//                     })
//                   );
//                 } else if (
//                   element.fileMetadata &&
//                   element.fileMetadata.fileName
//                 ) {
//                   newUploadedFiles[key] = [
//                     {
//                       fileName: element.fileMetadata.fileName,
//                       filePath: element.fileMetadata.filePath,
//                       uploadDate: element.fileMetadata.uploadDate,
//                       uploadedBy: element.fileMetadata.uploadedBy,
//                       status: "completed",
//                     },
//                   ];
//                 } else if (element.textvalue) {
//                   const fileNames = element.textvalue
//                     .split(",")
//                     .map((name) => name.trim());
//                   newUploadedFiles[key] = fileNames.map((fileName) => ({
//                     fileName: fileName,
//                     status: "completed",
//                   }));
//                 }
//                 break;
//             }
//           }
//         });
//       });

//       if (organizer.repeatedSections) {
//         Object.keys(organizer.repeatedSections).forEach((originalSectionId) => {
//           if (!newRepeatedSections[originalSectionId]) {
//             newRepeatedSections[originalSectionId] = [];
//           }
//           organizer.repeatedSections[originalSectionId].forEach((repeatId) => {
//             if (!newRepeatedSections[originalSectionId].includes(repeatId)) {
//               newRepeatedSections[originalSectionId].push(repeatId);
//             }
//           });
//         });
//       }

//       Object.keys(newUploadedFiles).forEach((key) => {
//         newUploadedFiles[key] = newUploadedFiles[key].filter(
//           (file) => file.status === "completed"
//         );
//         if (newUploadedFiles[key].length === 0) {
//           delete newUploadedFiles[key];
//         }
//       });

//       setInputValues(newInputValues);
//       setRadioValues(newRadioValues);
//       setCheckboxValues(newCheckboxValues);
//       setSelectedYesNoValues(newSelectedYesNoValues);
//       setSelectedDropdownValues(newSelectedDropdownValues);
//       setAnsweredElements(newAnsweredElements);
//       setDateValues(newDateValues);
//       setUploadedFiles(newUploadedFiles);
//       setRepeatedSections(newRepeatedSections);
      
//       // Enable auto-save after data is loaded
//       setTimeout(() => {
//         isInitialLoadRef.current = false;
//         isAutoSaveEnabledRef.current = true;
//       }, 500);
//     }
//   }, [organizer, open]);

//   const isElementActive = (element) => {
//     if (organizer?.issealed) return true;
//     return element.active === true;
//   };

//   const hasError = (sectionId, elementText) => {
//     return !!validationErrors[sectionId]?.[elementText];
//   };

//   const getErrorMessage = (sectionId, elementText) => {
//     return validationErrors[sectionId]?.[elementText] || "";
//   };

//   const handleUploadSuccess = useCallback((uploadedFileDataArray) => {
//     console.log("Files uploaded successfully:", uploadedFileDataArray);

//     const key = Object.keys(pendingFiles).find(
//       (k) => pendingFiles[k]?.length > 0
//     );

//     if (key && uploadedFileDataArray.length > 0) {
//       setUploadedFiles((prev) => ({
//         ...prev,
//         [key]: [
//           ...(prev[key] || []),
//           ...uploadedFileDataArray.map((fileData) => ({
//             fileName: fileData.fileName,
//             filePath: fileData.filePath,
//             uploadDate: new Date().toISOString(),
//             uploadedBy: accountName || username,
//             status: "completed",
//           })),
//         ],
//       }));

//       setPendingFiles((prev) => {
//         const newState = { ...prev };
//         delete newState[key];
//         return newState;
//       });

//       setSelectedFiles((prev) => {
//         const newState = { ...prev };
//         delete newState[key];
//         return newState;
//       });

//       setAnsweredElements((prev) => ({
//         ...prev,
//         [key]: true,
//       }));

//       const [sectionId, elementText] = key.split("_");
//       const numericSectionId = Number(sectionId);
//       if (validationErrors[numericSectionId]?.[elementText]) {
//         setValidationErrors((prev) => {
//           const newErrors = { ...prev };
//           if (newErrors[numericSectionId]) {
//             delete newErrors[numericSectionId][elementText];
//             if (Object.keys(newErrors[numericSectionId]).length === 0) {
//               delete newErrors[numericSectionId];
//             }
//           }
//           return newErrors;
//         });
//       }

//       // Trigger auto-save after file upload
//       if (isAutoSaveEnabledRef.current) {
//         const data = prepareSubmitData(false);
//         autoSaveOrganizer(data);
//       }

//       toast.success(
//         `${uploadedFileDataArray.length} file(s) uploaded successfully!`
//       );
//     }

//     setIsDocumentForm(false);
//   }, [pendingFiles, uploadedFiles, accountName, username, validationErrors, prepareSubmitData, autoSaveOrganizer]);

//   const renderSection = useCallback((
//     section,
//     isRepeated = false,
//     originalSectionId = null
//   ) => {
//     const sectionId = section.id;
//     const canRepeat =
//       section.sectionsettings?.sectionRepeatingMode && !isRepeated && !organizer?.issealed;

//     return (
//       <Box key={sectionId}>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             mb: 2,
//           }}
//         >
//           <Typography variant="h6" component="h2">
//             {section.text}
//             {isRepeated && (
//               <Chip 
//                 label="Repeated" 
//                 size="small" 
//                 color="secondary" 
//                 sx={{ ml: 1, fontSize: '0.7rem' }}
//               />
//             )}
//           </Typography>
//           {isRepeated && (
//             <Button
//               variant="outlined"
//               color="error"
//               size="small"
//               onClick={() =>
//                 removeRepeatedSection(originalSectionId, Number(sectionId))
//               }
//               disabled={organizer?.issealed}
//             >
//               Remove Section
//             </Button>
//           )}
//         </Box>

//         {section.formElements.map(
//           (element) =>
//             shouldShowElement(element, sectionId) && (
//               <Box key={`${sectionId}_${element.id}`}>
//                 {element.type === "Text Editor" && (
//                   <Box mt={2} mb={2}>
//                     <Typography>
//                       <span
//                         dangerouslySetInnerHTML={{
//                           __html: element.text,
//                         }}
//                       />
//                     </Typography>
//                   </Box>
//                 )}

//                 {(element.type === "Free Entry" ||
//                   element.type === "Email") && (
//                   <Box mt={2}>
//                     <Typography
//                       variant="subtitle2"
//                       component="p"
//                       gutterBottom
//                       sx={{ fontWeight: "550" }}
//                     >
//                       {element.text}
//                       {element.questionsectionsettings?.required && (
//                         <span style={{ color: "red", marginLeft: "4px" }}>
//                           *
//                         </span>
//                       )}
//                     </Typography>
//                     <TextField
//                       disabled={isElementActive(element)}
//                       variant="filled"
//                       size="small"
//                       multiline
//                       fullWidth
//                       placeholder={`${element.type} Answer`}
//                       inputProps={{
//                         type:
//                           element.type === "Free Entry"
//                             ? "text"
//                             : element.type.toLowerCase(),
//                       }}
//                       style={{ display: "block" }}
//                       value={inputValues[`${sectionId}_${element.text}`] || ""}
//                       onChange={(e) =>
//                         handleInputChange(e, element.text, sectionId)
//                       }
//                       error={hasError(sectionId, element.text)}
//                     />
//                     {hasError(sectionId, element.text) && (
//                       <Typography
//                         variant="caption"
//                         color="error"
//                         sx={{ display: "block", mt: 0.5, ml: 1 }}
//                       >
//                         {getErrorMessage(sectionId, element.text)}
//                       </Typography>
//                     )}
//                   </Box>
//                 )}

//                 {element.type === "Number" && (
//                   <Box mt={2}>
//                     <Typography
//                       variant="subtitle2"
//                       component="p"
//                       gutterBottom
//                       sx={{ fontWeight: "550" }}
//                     >
//                       {element.text}
//                       {element.questionsectionsettings?.required && (
//                         <span style={{ color: "red", marginLeft: "4px" }}>
//                           *
//                         </span>
//                       )}
//                     </Typography>
//                     <TextField
//                       disabled={isElementActive(element)}
//                       variant="outlined"
//                       size="small"
//                       multiline
//                       fullWidth
//                       placeholder={`${element.type} Answer`}
//                       inputProps={{
//                         type: "text",
//                         inputMode: "numeric",
//                         pattern: "[0-9]*",
//                       }}
//                       maxRows={8}
//                       style={{
//                         display: "block",
//                         marginTop: "15px",
//                       }}
//                       value={inputValues[`${sectionId}_${element.text}`] || ""}
//                       onChange={(e) => {
//                         const numericValue = e.target.value.replace(/\D/g, "");
//                         handleInputChange(
//                           { target: { value: numericValue } },
//                           element.text,
//                           sectionId
//                         );
//                       }}
//                       error={hasError(sectionId, element.text)}
//                     />
//                     {hasError(sectionId, element.text) && (
//                       <Typography
//                         variant="caption"
//                         color="error"
//                         sx={{ display: "block", mt: 0.5, ml: 1 }}
//                       >
//                         {getErrorMessage(sectionId, element.text)}
//                       </Typography>
//                     )}
//                   </Box>
//                 )}

//                 {element.type === "Radio Buttons" && (
//                   <Box mt={2}>
//                     <Typography
//                       variant="subtitle2"
//                       component="p"
//                       gutterBottom
//                       sx={{ fontWeight: "550" }}
//                     >
//                       {element.text}
//                       {element.questionsectionsettings?.required && (
//                         <span style={{ color: "red", marginLeft: "4px" }}>
//                           *
//                         </span>
//                       )}
//                     </Typography>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         gap: 1,
//                         flexWrap: "wrap",
//                       }}
//                     >
//                       {element.options.map((option) => (
//                         <SelectableButton
//                           key={option.text}
//                           selected={
//                             radioValues[`${sectionId}_${element.text}`] ===
//                             option.text
//                           }
//                           disabled={isElementActive(element)}
//                           onClick={() =>
//                             handleRadioChange(
//                               option.text,
//                               element.text,
//                               sectionId
//                             )
//                           }
//                         >
//                           {option.text}
//                         </SelectableButton>
//                       ))}
//                     </Box>
//                     {hasError(sectionId, element.text) && (
//                       <Typography
//                         variant="caption"
//                         color="error"
//                         sx={{ display: "block", mt: 0.5, ml: 1 }}
//                       >
//                         {getErrorMessage(sectionId, element.text)}
//                       </Typography>
//                     )}
//                   </Box>
//                 )}

//                 {element.type === "Checkboxes" && (
//                   <Box mt={2}>
//                     <Typography
//                       variant="subtitle2"
//                       component="p"
//                       gutterBottom
//                       sx={{ fontWeight: "550" }}
//                     >
//                       {element.text}
//                       {element.questionsectionsettings?.required && (
//                         <span style={{ color: "red", marginLeft: "4px" }}>
//                           *
//                         </span>
//                       )}
//                     </Typography>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         gap: 1,
//                         flexWrap: "wrap",
//                       }}
//                     >
//                       {element.options.map((option) => (
//                         <SelectableButton
//                           key={option.text}
//                           selected={
//                             checkboxValues[`${sectionId}_${element.text}`]?.[
//                               option.text
//                             ]
//                           }
//                           disabled={isElementActive(element)}
//                           onClick={() =>
//                             handleCheckboxChange(
//                               option.text,
//                               element.text,
//                               sectionId
//                             )
//                           }
//                         >
//                           {option.text}
//                         </SelectableButton>
//                       ))}
//                     </Box>
//                     {hasError(sectionId, element.text) && (
//                       <Typography
//                         variant="caption"
//                         color="error"
//                         sx={{ display: "block", mt: 0.5, ml: 1 }}
//                       >
//                         {getErrorMessage(sectionId, element.text)}
//                       </Typography>
//                     )}
//                   </Box>
//                 )}

//                 {element.type === "Yes/No" && (
//                   <Box mt={2}>
//                     <Typography
//                       variant="subtitle2"
//                       component="p"
//                       gutterBottom
//                       sx={{ fontWeight: "550" }}
//                     >
//                       {element.text}
//                       {element.questionsectionsettings?.required && (
//                         <span style={{ color: "red", marginLeft: "4px" }}>
//                           *
//                         </span>
//                       )}
//                     </Typography>
//                     <Box sx={{ display: "flex", gap: 1 }}>
//                       {element.options.map((option) => (
//                         <SelectableButton
//                           key={option.text}
//                           selected={
//                             selectedYesNoValues[
//                               `${sectionId}_${element.text}`
//                             ] === option.text
//                           }
//                           disabled={isElementActive(element)}
//                           onClick={() =>
//                             handleYesNoChange(
//                               option.text,
//                               element.text,
//                               sectionId
//                             )
//                           }
//                         >
//                           {option.text}
//                         </SelectableButton>
//                       ))}
//                     </Box>
//                     {hasError(sectionId, element.text) && (
//                       <Typography
//                         variant="caption"
//                         color="error"
//                         sx={{ display: "block", mt: 0.5, ml: 1 }}
//                       >
//                         {getErrorMessage(sectionId, element.text)}
//                       </Typography>
//                     )}
//                   </Box>
//                 )}

//                 {element.type === "Dropdown" && (
//                   <Box mt={2}>
//                     <Typography
//                       variant="subtitle2"
//                       component="p"
//                       gutterBottom
//                       sx={{ fontWeight: "550" }}
//                     >
//                       {element.text}
//                       {element.questionsectionsettings?.required && (
//                         <span style={{ color: "red", marginLeft: "4px" }}>
//                           *
//                         </span>
//                       )}
//                     </Typography>
//                     <FormControl fullWidth>
//                       <Select
//                         value={
//                           selectedDropdownValues[
//                             `${sectionId}_${element.text}`
//                           ] || ""
//                         }
//                         disabled={isElementActive(element)}
//                         onChange={(event) =>
//                           handleDropdownValueChange(
//                             event,
//                             element.text,
//                             sectionId
//                           )
//                         }
//                         size="small"
//                       >
//                         {element.options.map((option) => (
//                           <MenuItem key={option.text} value={option.text}>
//                             {option.text}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                     {hasError(sectionId, element.text) && (
//                       <Typography
//                         variant="caption"
//                         color="error"
//                         sx={{ display: "block", mt: 0.5, ml: 1 }}
//                       >
//                         {getErrorMessage(sectionId, element.text)}
//                       </Typography>
//                     )}
//                   </Box>
//                 )}

//                 {element.type === "Date" && (
//                   <Box mt={2}>
//                     <Typography
//                       variant="subtitle2"
//                       component="p"
//                       gutterBottom
//                       sx={{ fontWeight: "550" }}
//                     >
//                       {element.text}
//                       {element.questionsectionsettings?.required && (
//                         <span style={{ color: "red", marginLeft: "4px" }}>
//                           *
//                         </span>
//                       )}
//                     </Typography>

//                     <DatePicker
//                       format="MM/DD/YYYY"
//                       sx={{
//                         width: "100%",
//                         backgroundColor: "#fff",
//                       }}
//                       value={
//                         dateValues[`${sectionId}_${element.text}`] ||
//                         dayjs()
//                       }
//                       disabled={isElementActive(element)}
//                       onChange={(newValue) => {
//                         if (!isElementActive(element)) {
//                           handleDateChange(
//                             newValue,
//                             element.text,
//                             sectionId
//                           );
//                         }
//                       }}
//                       renderInput={(params) => (
//                         <TextField {...params} size="small" />
//                       )}
//                     />
//                     {hasError(sectionId, element.text) && (
//                       <Typography
//                         variant="caption"
//                         color="error"
//                         sx={{ display: "block", mt: 0.5, ml: 1 }}
//                       >
//                         {getErrorMessage(sectionId, element.text)}
//                       </Typography>
//                     )}
//                   </Box>
//                 )}

//                 {element.type === "File Upload" && (
//                   <Box mt={2}>
//                     <Typography
//                       variant="subtitle2"
//                       component="p"
//                       gutterBottom
//                       sx={{ fontWeight: "550" }}
//                     >
//                       {element.text}
//                       {element.questionsectionsettings?.required && (
//                         <span style={{ color: "red", marginLeft: "4px" }}>
//                           *
//                         </span>
//                       )}
//                     </Typography>

//                     <Box sx={{ mb: 2 }}>
//                       <Button
//                         variant="outlined"
//                         component="label"
//                         disabled={isElementActive(element)}
//                       >
//                         Choose Files
//                         <input 
//                           type="file" 
//                           hidden 
//                           multiple   
//                           onChange={(e) =>
//                             handleFileSelect(e, element.text, sectionId)
//                           }
//                           disabled={isElementActive(element)} 
//                         />
//                       </Button>
//                       <Typography
//                         variant="caption"
//                         sx={{ display: "block", mt: 0.5, ml: 1 }}
//                       >
//                         You can select multiple files
//                       </Typography>
//                     </Box>

//                     {pendingFiles[`${sectionId}_${element.text}`]?.length >
//                       0 && (
//                       <Box sx={{ mb: 2 }}>
//                         <Typography
//                           variant="body2"
//                           fontWeight="bold"
//                           gutterBottom
//                         >
//                           Files ready to upload (
//                           {pendingFiles[`${sectionId}_${element.text}`].length}
//                           ):
//                         </Typography>
//                         {pendingFiles[`${sectionId}_${element.text}`].map(
//                           (fileInfo, index) => (
//                             <Box
//                               key={index}
//                               sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: 1,
//                                 mb: 0.5,
//                               }}
//                             >
//                               <Typography variant="body2">
//                                 {fileInfo.fileName} (Ready to upload)
//                               </Typography>
//                             </Box>
//                           )
//                         )}
//                       </Box>
//                     )}

//                     {uploadedFiles[`${sectionId}_${element.text}`]?.length >
//                       0 && (
//                       <Box sx={{ mb: 2 }}>
//                         <Typography
//                           variant="body2"
//                           fontWeight="bold"
//                           gutterBottom
//                         >
//                           Uploaded Files (
//                           {uploadedFiles[`${sectionId}_${element.text}`].length}
//                           ):
//                         </Typography>
//                         {uploadedFiles[`${sectionId}_${element.text}`].map(
//                           (fileInfo, index) => (
//                             <Box
//                               key={index}
//                               sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: 1,
//                                 mb: 0.5,
//                                 p: 1,
//                                 bgcolor: "grey.50",
//                                 borderRadius: 1,
//                               }}
//                             >
//                               <Typography variant="body2" sx={{ flex: 1 }}>
//                                 {fileInfo.fileName}
//                                 {fileInfo.status === "uploading" &&
//                                   " (Uploading...)"}
//                                 {fileInfo.status === "completed" && " ✓"}
//                               </Typography>

//                               {!isElementActive(element) &&
//                                 fileInfo.status === "completed" && (
//                                   <IconButton
//                                     size="small"
//                                     color="error"
//                                     onClick={() =>
//                                       handleDeleteFile(
//                                         sectionId,
//                                         element.text,
//                                         fileInfo.fileName
//                                       )
//                                     }
//                                     title="Delete this file"
//                                   >
//                                     <DeleteIcon fontSize="small" />
//                                   </IconButton>
//                                 )}
//                             </Box>
//                           )
//                         )}

//                         {!isElementActive(element) &&
//                           uploadedFiles[`${sectionId}_${element.text}`].length >
//                             1 && (
//                             <Button
//                               variant="outlined"
//                               color="error"
//                               size="small"
//                               onClick={() =>
//                                 handleDeleteFile(sectionId, element.text)
//                               }
//                               sx={{ mt: 1 }}
//                             >
//                               Delete All Files
//                             </Button>
//                           )}
//                       </Box>
//                     )}

//                     {hasError(sectionId, element.text) && (
//                       <Typography
//                         variant="caption"
//                         color="error"
//                         sx={{ display: "block", mt: 0.5, ml: 1 }}
//                       >
//                         {getErrorMessage(sectionId, element.text)}
//                       </Typography>
//                     )}
//                     {pendingFiles[`${sectionId}_${element.text}`]?.length >
//                       0 && (
//                       <Typography variant="caption" color="warning.main">
//                         ⚠ {pendingFiles[`${sectionId}_${element.text}`].length}{" "}
//                         file(s) selected but not uploaded yet
//                       </Typography>
//                     )}
//                   </Box>
//                 )}
//               </Box>
//             )
//         )}

//         {canRepeat && (
//           <Box mt={3} mb={2}>
//             <Button
//               variant="outlined"
//               onClick={() => addRepeatedSection(sectionId)}
//               disabled={organizer?.issealed}
//               startIcon={<AddIcon />}
//             >
//               Add Another {section.text}
//             </Button>
//           </Box>
//         )}
//       </Box>
//     );
//   }, [organizer?.issealed, inputValues, radioValues, checkboxValues, selectedYesNoValues, selectedDropdownValues, dateValues, uploadedFiles, pendingFiles, validationErrors, shouldShowElement]);

//   return (
//     <>
//       <LocalizationProvider dateAdapter={AdapterDayjs}>
//         <Dialog fullScreen open={open} onClose={handleClose}>
//           <DialogTitle
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               px: 3,
//               py: 2,
//               borderBottom: "1px solid #ddd",
//             }}
//           >
//             <Typography variant="h6" component="p">
//               {organizer?.organizerName || "Organizer"}
//             </Typography>
//             <IconButton edge="end" onClick={handleClose}>
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>
//           <DialogContent>
//             <FormControl
//               fullWidth
//               sx={{ marginBottom: "10px", marginTop: "10px" }}
//             >
//               <Select
//                 value={activeStep}
//                 onChange={handleDropdownChange}
//                 size="small"
//               >
//                 {visibleSections.map((section, index) => {
//                   const visibleElements = section.formElements.filter((el) =>
//                     shouldShowElement(el, section.id)
//                   );

//                   const answeredCount = visibleElements.reduce(
//                     (count, element) => {
//                       const key = `${section.id}_${element.text}`;
//                       return count + (answeredElements[key] ? 1 : 0);
//                     },
//                     0
//                   );

//                   const totalVisibleElements = visibleElements.length;

//                   return (
//                     <MenuItem key={section.id} value={index}>
//                       {section.text} ({answeredCount}/{totalVisibleElements})
//                     </MenuItem>
//                   );
//                 })}
//               </Select>
//             </FormControl>
//             <Box mt={2} mb={2}>
//               <LinearProgress
//                 variant="determinate"
//                 value={((activeStep + 1) / totalSteps) * 100}
//               />
//             </Box>

//             <Box sx={{ pl: 20, pr: 20 }}>
//               {visibleSections.map(
//                 (section, sectionIndex) =>
//                   sectionIndex === activeStep &&
//                   renderSection(
//                     section,
//                     section.isRepeated,
//                     section.originalSectionId
//                   )
//               )}

//               <Box
//                 mt={3}
//                 display="flex"
//                 alignItems="center"
//                 justifyContent={"space-between"}
//               >
//                 <Box display="flex" gap={3} alignItems="center">
//                   {activeStep > 0 && (
//                     <Button onClick={handleBack} variant="outlined">
//                       <ArrowBackIcon fontSize="small" />
//                     </Button>
//                   )}

//                   {activeStep < totalSteps - 1 && (
//                     <Button
//                       onClick={handleNext}
//                       color="primary"
//                       sx={{
//                         backgroundColor: "text.menu",
//                         color: "primary.contrastText",
//                         "&:hover": {
//                           backgroundColor: "menu.dark",
//                           boxShadow: 1,
//                         },
//                         transition: "background-color 0.2s ease",
//                       }}
//                     >
//                       Next{" "}
//                       <ArrowForwardIcon
//                         fontSize="small"
//                         sx={{ marginLeft: 2 }}
//                       />
//                     </Button>
//                   )}

//                   <Button
//                     onClick={manualSave}
//                     variant="outlined"
//                     size="small"
//                     disabled={isSaving || organizer?.status === "Completed"}
//                     startIcon={<SaveIcon />}
//                     sx={{ mr: 1 }}
//                   >
//                     {isSaving ? "Saving..." : "Save Progress"}
//                   </Button>

//                   <Button
//                     onClick={handleSubmit}
//                     color="primary"
//                     disabled={organizer?.issealed || organizer?.status === "Completed" || isLoading}
//                     sx={{
//                       backgroundColor: organizer?.issealed || organizer?.status === "Completed" 
//                         ? "grey.400" 
//                         : "text.menu",
//                       color: "primary.contrastText",
//                       "&:hover": { 
//                         backgroundColor: organizer?.issealed || organizer?.status === "Completed" 
//                           ? "grey.400" 
//                           : "menu.dark", 
//                         boxShadow: 1 
//                       },
//                       transition: "background-color 0.2s ease",
//                       "&.Mui-disabled": {
//                         color: "white",
//                         backgroundColor: "grey.400",
//                       }
//                     }}
//                   >
//                     {isLoading ? "Submitting..." : (organizer?.issealed || organizer?.status === "Completed" ? "Completed" : "Submit")}
//                   </Button>
//                 </Box>

//                 <Box sx={{ display: "flex", alignItems: "flex-end" }}>
//                   <Typography>
//                     Step {activeStep + 1} of {totalSteps}
//                   </Typography>
//                 </Box>
//               </Box>
//             </Box>
//           </DialogContent>
//         </Dialog>
//       </LocalizationProvider>

//       <FileUploadDrawer
//         isOpen={isDocumentForm}
//         organizer={organizer}
//         onClose={() => {
//           const key = Object.keys(pendingFiles).find(
//             (k) => pendingFiles[k]?.length > 0
//           );
//           if (key) {
//             setPendingFiles((prev) => {
//               const newState = { ...prev };
//               delete newState[key];
//               return newState;
//             });
//             setSelectedFiles((prev) => {
//               const newState = { ...prev };
//               delete newState[key];
//               return newState;
//             });
//           }
//           setIsDocumentForm(false);
//         }}
//         files={
//           selectedFiles[
//             Object.keys(selectedFiles).find((k) => pendingFiles[k]?.length > 0)
//           ] || []
//         }
//         accountId={accountId}
//         folderTree={folderTree}
//         onUploadSuccess={handleUploadSuccess}
//         onUploadError={(errorFiles) => {
//           console.error("File uploads failed:", errorFiles);
//           const key = Object.keys(pendingFiles).find(
//             (k) => pendingFiles[k]?.length > 0
//           );
//           if (key) {
//             setPendingFiles((prev) => {
//               const newState = { ...prev };
//               delete newState[key];
//               return newState;
//             });
//             setSelectedFiles((prev) => {
//               const newState = { ...prev };
//               delete newState[key];
//               return newState;
//             });
//           }
//           toast.error(`${errorFiles.length} file(s) failed to upload!`);
//         }}
//       />
//     </>
//   );
// };

// export default OrganizerDialog;
import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  LinearProgress,
  IconButton,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { toast } from "material-react-toastify";
import { organizerAPI, accountsAPI, docAPI, authAPI, accountDocsAPI } from "../../services/api"; // Adjust import path as needed
import FileUploadDrawer from "./FileUploadDrawer"; // Adjust import path as needed
import SelectableButton from "./SelectableButton"; // Adjust import path as needed

const OrganizerDialog = ({ open, handleClose, organizer }) => {
  const [accountName, setAccountName] = useState("");
  const [accId] = useState(sessionStorage.getItem("accountId"));

  const fetchAccountDetails = async () => {
    try {
      const res = await accountsAPI.getAccountById(accId);
      setAccountName(res.data.accountName);
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };

  useEffect(() => {
    fetchAccountDetails();
  }, [accId]);

  

  

  const [accountId, setAccountId] = useState(
    sessionStorage.getItem("accountId")
  );



  const [folderTree, setFolderTree] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFolderTree(accountId);
  }, [accountId]);

  const fetchFolderTree = async (accountId) => {
    try {
      const res = await accountDocsAPI.clientListFoldersAndFiles(accountId);
      console.log("janavi patil", res.data);
      setFolderTree(res.data.contents);
    } catch (err) {
      setError("Error fetching folder tree");
    }
  };

  const sections = organizer?.sections;

  const [selectedDropdownValues, setSelectedDropdownValues] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [selectedYesNoValues, setSelectedYesNoValues] = useState({});
  const [radioValues, setRadioValues] = useState({});
  const [checkboxValues, setCheckboxValues] = useState({});
  const [answeredElements, setAnsweredElements] = useState({});
  const [activeStep, setActiveStep] = useState(0);

  const [dateValues, setDateValues] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [isDocumentForm, setIsDocumentForm] = useState(false);
  const [repeatedSections, setRepeatedSections] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [pendingFiles, setPendingFiles] = useState({});
  const [previousVisibleSections, setPreviousVisibleSections] = useState([]);

  const clearSectionValues = useCallback((sectionId) => {
    const numericSectionId = Number(sectionId);
    
    setRadioValues(prev => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach(key => {
        const [keySectionId] = key.split('_');
        if (Number(keySectionId) === numericSectionId) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setCheckboxValues(prev => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach(key => {
        const [keySectionId] = key.split('_');
        if (Number(keySectionId) === numericSectionId) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setSelectedDropdownValues(prev => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach(key => {
        const [keySectionId] = key.split('_');
        if (Number(keySectionId) === numericSectionId) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setSelectedYesNoValues(prev => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach(key => {
        const [keySectionId] = key.split('_');
        if (Number(keySectionId) === numericSectionId) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setInputValues(prev => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach(key => {
        const [keySectionId] = key.split('_');
        if (Number(keySectionId) === numericSectionId) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setDateValues(prev => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach(key => {
        const [keySectionId] = key.split('_');
        if (Number(keySectionId) === numericSectionId) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setAnsweredElements(prev => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach(key => {
        const [keySectionId] = key.split('_');
        if (Number(keySectionId) === numericSectionId) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setUploadedFiles(prev => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach(key => {
        const [keySectionId] = key.split('_');
        if (Number(keySectionId) === numericSectionId) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setPendingFiles(prev => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach(key => {
        const [keySectionId] = key.split('_');
        if (Number(keySectionId) === numericSectionId) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setSelectedFiles(prev => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach(key => {
        const [keySectionId] = key.split('_');
        if (Number(keySectionId) === numericSectionId) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setValidationErrors(prev => {
      const newErrors = { ...prev };
      if (newErrors[numericSectionId]) {
        delete newErrors[numericSectionId];
      }
      return newErrors;
    });
  }, []);

  const addRepeatedSection = (sectionId) => {
    const baseSection = sections?.find(s => s.id === sectionId);
    if (!baseSection) return;

    setRepeatedSections((prev) => {
      const currentRepeats = prev[sectionId] || [];
      const baseId = Number(sectionId);
      const newRepeatId = baseId + (currentRepeats.length + 1) * 1000000;
      
      console.log(`Adding repeated section: Base=${sectionId}, New=${newRepeatId}`);
      
      return {
        ...prev,
        [sectionId]: [...currentRepeats, newRepeatId],
      };
    });
  };

  const removeRepeatedSection = (sectionId, repeatId) => {
    setRepeatedSections((prev) => {
      const currentRepeats = prev[sectionId] || [];
      const updatedRepeats = currentRepeats.filter((id) => id !== repeatId);

      cleanUpSectionData(repeatId);

      return {
        ...prev,
        [sectionId]: updatedRepeats,
      };
    });
  };

  const cleanUpSectionData = (sectionId) => {
    const numericSectionId =
      typeof sectionId === "string" ? Number(sectionId) : sectionId;

    setInputValues((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        if (key.startsWith(`${numericSectionId}_`)) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setRadioValues((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        if (key.startsWith(`${numericSectionId}_`)) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setCheckboxValues((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        if (key.startsWith(`${numericSectionId}_`)) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setSelectedYesNoValues((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        if (key.startsWith(`${numericSectionId}_`)) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setSelectedDropdownValues((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        if (key.startsWith(`${numericSectionId}_`)) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setAnsweredElements((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        if (key.startsWith(`${numericSectionId}_`)) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setUploadedFiles((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        if (key.startsWith(`${numericSectionId}_`)) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setPendingFiles((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        if (key.startsWith(`${numericSectionId}_`)) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setSelectedFiles((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        if (key.startsWith(`${numericSectionId}_`)) {
          delete newValues[key];
        }
      });
      return newValues;
    });
  };

  const handleDateChange = (newValue, elementText, sectionId) => {
    const numericSectionId =
      typeof sectionId === "string" ? Number(sectionId) : sectionId;
    const key = `${numericSectionId}_${elementText}`;

    setDateValues((prev) => ({
      ...prev,
      [key]: newValue,
    }));

    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));

    if (validationErrors[numericSectionId]?.[elementText]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        if (newErrors[numericSectionId]) {
          delete newErrors[numericSectionId][elementText];
          if (Object.keys(newErrors[numericSectionId]).length === 0) {
            delete newErrors[numericSectionId];
          }
        }
        return newErrors;
      });
    }
  };

  const handleFileSelect = (event, elementText, sectionId) => {
    const numericSectionId =
      typeof sectionId === "string" ? Number(sectionId) : sectionId;
    const key = `${numericSectionId}_${elementText}`;
    const files = event.target.files;

    if (files && files.length > 0) {
      const fileArray = Array.from(files);

      setSelectedFiles((prev) => ({
        ...prev,
        [key]: fileArray,
      }));

      setPendingFiles((prev) => ({
        ...prev,
        [key]: fileArray.map((file) => ({
          fileName: file.name,
          file: file,
        })),
      }));

      setIsDocumentForm(true);
    }
  };

  const handleDeleteFile = async (sectionId, elementText, fileName = null) => {
    const key = `${sectionId}_${elementText}`;

    if (fileName) {
      const fileInfo = uploadedFiles[key]?.find((f) => f.fileName === fileName);
      console.log("fileInfo", fileInfo);

      if (!fileInfo) return;

      try {
        const confirmDelete = window.confirm(
          `Are you sure you want to delete "${fileInfo.fileName}"?`
        );

        if (!confirmDelete) return;

        if (fileInfo.filePath) {
          const deleteResponse = await docAPI.deleteItem({
            targetPath: `${fileInfo.filePath}`,
          });

          if (!deleteResponse.data.success) {
            throw new Error(
              deleteResponse.data.message || "Failed to delete file from storage"
            );
          }
        }

        setUploadedFiles((prev) => {
          const newState = { ...prev };
          if (newState[key]) {
            newState[key] = newState[key].filter(
              (f) => f.fileName !== fileName
            );
            if (newState[key].length === 0) {
              delete newState[key];
            }
          }
          return newState;
        });

        setAnsweredElements((prev) => {
          const newState = { ...prev };
          if (!uploadedFiles[key] || uploadedFiles[key].length <= 1) {
            delete newState[key];
          }
          return newState;
        });

        toast.success("File deleted successfully!");
      } catch (error) {
        console.error("Error deleting file:", error);
        toast.error(error.message || "Failed to delete file");
      }
    } else {
      const fileInfos = uploadedFiles[key];

      if (!fileInfos || fileInfos.length === 0) return;

      try {
        const confirmDelete = window.confirm(
          `Are you sure you want to delete all ${fileInfos.length} files?`
        );

        if (!confirmDelete) return;

        for (const fileInfo of fileInfos) {
          if (fileInfo.filePath) {
            const deleteResponse = await docAPI.deleteItem({
              targetPath: `${fileInfo.filePath}/${fileInfo.fileName}`,
            });

            if (!deleteResponse.data.success) {
              throw new Error(
                deleteResponse.data.message || "Failed to delete file from storage"
              );
            }
          }
        }

        setUploadedFiles((prev) => {
          const newState = { ...prev };
          delete newState[key];
          return newState;
        });

        setAnsweredElements((prev) => {
          const newState = { ...prev };
          delete newState[key];
          return newState;
        });

        setPendingFiles((prev) => {
          const newState = { ...prev };
          delete newState[key];
          return newState;
        });

        setSelectedFiles((prev) => {
          const newState = { ...prev };
          delete newState[key];
          return newState;
        });

        toast.success("All files deleted successfully!");
      } catch (error) {
        console.error("Error deleting files:", error);
        toast.error(error.message || "Failed to delete files");
      }
    }
  };

  const debouncedAutoSave = useCallback(
    debounce(async (data) => {
      try {
        const response = await organizerAPI.updateOrganizerAccountWise(organizer._id, data);
        console.log("Auto-save successful", response.data);
      } catch (error) {
        console.error("Error auto-saving organizer:", error);
      }
    }, 2000),
    [organizer?._id]
  );

  const getVisibleSections = () => {
    const currentlyVisible = (sections || []).filter(shouldShowSection);
    const allSections = [];

    currentlyVisible.forEach((section) => {
      allSections.push(section);

      if (
        section.sectionsettings?.sectionRepeatingMode &&
        repeatedSections[section.id]
      ) {
        repeatedSections[section.id].forEach((repeatId, index) => {
          allSections.push({
            ...section,
            id: repeatId.toString(),
            text: `${section.text} (Repeated ${index + 1})`,
            isRepeated: true,
            originalSectionId: section.id,
          });
        });
      }
    });

    return allSections;
  };

  const prepareSubmitData = (finalSubmit = false) => {
    const allVisibleSections = getVisibleSections();
    
    const sectionsData = allVisibleSections.map((section) => {
      let baseSection = section;
      
      if (section.isRepeated && section.originalSectionId) {
        const originalSection = sections?.find(s => s.id === section.originalSectionId);
        if (originalSection) {
          baseSection = {
            ...originalSection,
            id: section.id,
            text: section.text || originalSection.text,
            sectionsettings: {
              ...originalSection.sectionsettings,
              isRepeated: true,
              originalSectionId: section.originalSectionId,
            }
          };
        }
      }
      
      return {
        name: baseSection?.text || "",
        id: baseSection?.id?.toString() || "",
        text: baseSection?.text || "",
        sectionsettings: baseSection?.sectionsettings || {},
        formElements:
          baseSection?.formElements?.map((question) => {
            const questionData = {
              type: question?.type || "",
              id: question?.id || "",
              sectionid: Number(baseSection?.id) || 0,
              options:
                question?.options?.map((option) => ({
                  id: option?.id || "",
                  text: option?.text || "",
                  selected: getOptionSelectedState(
                    question,
                    option,
                    Number(baseSection.id)
                  ),
                })) || [],
              text: question?.text || "",
              textvalue: getQuestionTextValue(question, Number(baseSection.id)),
              questionsectionsettings: question?.questionsectionsettings,
            };

            if (question.type === "File Upload") {
              const fileKey = `${baseSection.id}_${question.text}`;
              const fileInfos = uploadedFiles[fileKey];

              if (fileInfos && fileInfos.length > 0) {
                const completedFiles = fileInfos.filter(
                  (file) => file.status === "completed"
                );
                if (completedFiles.length > 0) {
                  questionData.fileMetadata = completedFiles.map((fileInfo) => ({
                    fileName: fileInfo.fileName,
                    filePath: fileInfo.filePath || "",
                    uploadDate: fileInfo.uploadDate || new Date().toISOString(),
                    uploadedBy: accountName ,
                  }));
                  questionData.textvalue = completedFiles
                    .map((f) => f.fileName)
                    .join(", ");
                } else {
                  questionData.textvalue = "";
                }
              } else {
                questionData.textvalue = "";
              }
            }

            return questionData;
          }) || [],
      };
    });

    const data = {
      sections: sectionsData,
      status: finalSubmit ? "Completed" : "In Progress",
      completedby: accountName,
      active: true,
      repeatedSections: repeatedSections,
    };

    console.log("Data being saved to backend:", JSON.stringify(data, null, 2));
    console.log("Total sections in data:", sectionsData.length);
    console.log("Total visible sections:", allVisibleSections.length);
    console.log("Status in prepareSubmitData:", data.status, "finalSubmit:", finalSubmit);

    return data;
  };

  useEffect(() => {
    if (open && organizer?._id && organizer?.status !== "Completed") {
      const data = prepareSubmitData(false);
      debouncedAutoSave(data);
    }
  }, [
    open,
    organizer?._id,
    organizer?.status,
    inputValues,
    radioValues,
    checkboxValues,
    selectedYesNoValues,
    selectedDropdownValues,
    dateValues,
    uploadedFiles,
    repeatedSections,
    debouncedAutoSave,
  ]);

  useEffect(() => {
    return () => {
      debouncedAutoSave.cancel();
    };
  }, [debouncedAutoSave]);

  const handleRadioChange = (value, elementText, sectionId) => {
    const numericSectionId =
      typeof sectionId === "string" ? Number(sectionId) : sectionId;
    const key = `${numericSectionId}_${elementText}`;
    setRadioValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));

    if (validationErrors[numericSectionId]?.[elementText]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        if (newErrors[numericSectionId]) {
          delete newErrors[numericSectionId][elementText];
          if (Object.keys(newErrors[numericSectionId]).length === 0) {
            delete newErrors[numericSectionId];
          }
        }
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (value, elementText, sectionId) => {
    const numericSectionId =
      typeof sectionId === "string" ? Number(sectionId) : sectionId;
    const key = `${numericSectionId}_${elementText}`;
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [key]: {
        ...prevValues[key],
        [value]: !prevValues[key]?.[value],
      },
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));

    if (validationErrors[numericSectionId]?.[elementText]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        if (newErrors[numericSectionId]) {
          delete newErrors[numericSectionId][elementText];
          if (Object.keys(newErrors[numericSectionId]).length === 0) {
            delete newErrors[numericSectionId];
          }
        }
        return newErrors;
      });
    }
  };

  const handleYesNoChange = (value, elementText, sectionId) => {
    const numericSectionId =
      typeof sectionId === "string" ? Number(sectionId) : sectionId;
    const key = `${numericSectionId}_${elementText}`;
    setSelectedYesNoValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));

    if (validationErrors[numericSectionId]?.[elementText]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        if (newErrors[numericSectionId]) {
          delete newErrors[numericSectionId][elementText];
          if (Object.keys(newErrors[numericSectionId]).length === 0) {
            delete newErrors[numericSectionId];
          }
        }
        return newErrors;
      });
    }
  };

  const handleInputChange = (event, elementText, sectionId) => {
    const numericSectionId =
      typeof sectionId === "string" ? Number(sectionId) : sectionId;
    const key = `${numericSectionId}_${elementText}`;
    const { value } = event.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));

    if (validationErrors[numericSectionId]?.[elementText]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        if (newErrors[numericSectionId]) {
          delete newErrors[numericSectionId][elementText];
          if (Object.keys(newErrors[numericSectionId]).length === 0) {
            delete newErrors[numericSectionId];
          }
        }
        return newErrors;
      });
    }
  };

  const handleDropdownValueChange = (event, elementText, sectionId) => {
    const numericSectionId =
      typeof sectionId === "string" ? Number(sectionId) : sectionId;
    const key = `${numericSectionId}_${elementText}`;
    setSelectedDropdownValues((prevValues) => ({
      ...prevValues,
      [key]: event.target.value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));

    if (validationErrors[numericSectionId]?.[elementText]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        if (newErrors[numericSectionId]) {
          delete newErrors[numericSectionId][elementText];
          if (Object.keys(newErrors[numericSectionId]).length === 0) {
            delete newErrors[numericSectionId];
          }
        }
        return newErrors;
      });
    }
  };

  const shouldShowSection = useCallback((section) => {
    if (!section.sectionsettings?.conditional) return true;

    const conditions = section.sectionsettings.conditions || [];
    const mode = section.sectionsettings.mode || "All";

    if (conditions.length === 0) return true;

    let matchedConditions = 0;

    conditions.forEach((condition) => {
      if (!condition.question || !condition.answer) return;

      let conditionMet = false;

      for (const key in radioValues) {
        if (key.endsWith(`_${condition.question}`)) {
          const answerInThisSection = radioValues[key];
          if (answerInThisSection === condition.answer) {
            conditionMet = true;
            break;
          }
        }
      }
      
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") return;
        return;
      }

      for (const key in checkboxValues) {
        if (key.endsWith(`_${condition.question}`)) {
          const checkboxSectionAnswer = checkboxValues[key]?.[condition.answer];
          if (checkboxSectionAnswer) {
            conditionMet = true;
            break;
          }
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") return;
        return;
      }

      for (const key in selectedDropdownValues) {
        if (key.endsWith(`_${condition.question}`)) {
          if (selectedDropdownValues[key] === condition.answer) {
            conditionMet = true;
            break;
          }
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") return;
        return;
      }

      for (const key in selectedYesNoValues) {
        if (key.endsWith(`_${condition.question}`)) {
          if (selectedYesNoValues[key] === condition.answer) {
            conditionMet = true;
            break;
          }
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") return;
      }
    });

    if (mode === "Any") {
      return matchedConditions > 0;
    } else {
      return matchedConditions === conditions.length;
    }
  }, [radioValues, checkboxValues, selectedDropdownValues, selectedYesNoValues]);

  useEffect(() => {
    if (!sections) return;
    
    const currentlyVisible = (sections || []).filter(shouldShowSection);
    
    const sectionsToClear = previousVisibleSections.filter(
      prevSection => !currentlyVisible.some(currSection => currSection.id === prevSection.id)
    );
    
    sectionsToClear.forEach(section => {
      clearSectionValues(section.id);
    });
    
    setPreviousVisibleSections(currentlyVisible);
  }, [
    sections,
    shouldShowSection,
    clearSectionValues,
    previousVisibleSections,
  ]);

  const visibleSections = getVisibleSections();
  const totalSteps = visibleSections.length;

  const shouldShowElement = (element, sectionId) => {
    const settings = element.questionsectionsettings;
    if (!settings?.conditional) return true;

    const conditions = settings?.conditions || [];
    const mode = settings?.mode || "All";

    if (conditions.length === 0) return true;

    let matchedConditions = 0;

    for (const condition of conditions) {
      const { question, answer } = condition;
      if (!question || !answer) continue;

      let conditionMet = false;

      const currentSectionId = typeof sectionId === "string" ? Number(sectionId) : sectionId;

      for (const key in radioValues) {
        const [keySectionId] = key.split("_");
        const numericKeySectionId = Number(keySectionId);

        if (
          numericKeySectionId === currentSectionId &&
          key.endsWith(`_${question}`) &&
          radioValues[key] === answer
        ) {
          conditionMet = true;
          break;
        }
      }
      
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") continue;
        else continue;
      }

      for (const key in checkboxValues) {
        const [keySectionId] = key.split("_");
        const numericKeySectionId = Number(keySectionId);

        if (
          numericKeySectionId === currentSectionId &&
          key.endsWith(`_${question}`) &&
          checkboxValues[key]?.[answer]
        ) {
          conditionMet = true;
          break;
        }
      }
      
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") continue;
        else continue;
      }

      for (const key in selectedDropdownValues) {
        const [keySectionId] = key.split("_");
        const numericKeySectionId = Number(keySectionId);

        if (
          numericKeySectionId === currentSectionId &&
          key.endsWith(`_${question}`) &&
          selectedDropdownValues[key] === answer
        ) {
          conditionMet = true;
          break;
        }
      }
      
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") continue;
        else continue;
      }

      for (const key in selectedYesNoValues) {
        const [keySectionId] = key.split("_");
        const numericKeySectionId = Number(keySectionId);

        if (
          numericKeySectionId === currentSectionId &&
          key.endsWith(`_${question}`) &&
          selectedYesNoValues[key] === answer
        ) {
          conditionMet = true;
          break;
        }
      }
      
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") continue;
        else continue;
      }

      if (mode === "All" && !conditionMet) {
        return false;
      }
    }

    if (mode === "Any") {
      return matchedConditions > 0;
    } else {
      return matchedConditions === conditions.length;
    }
  };

  const handleNext = () => {
    if (activeStep < totalSteps - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleDropdownChange = (event) => {
    const selectedIndex = event.target.value;
    setActiveStep(selectedIndex);
  };

  const handleSubmit = async () => {
    const errors = {};

    visibleSections.forEach((section) => {
      section.formElements.forEach((element) => {
        if (
          shouldShowElement(element, section.id) &&
          element.questionsectionsettings?.required
        ) {
          const key = `${section.id}_${element.text}`;

          if (element.type === "File Upload") {
            const fileInfos = uploadedFiles[key];
            if (
              !fileInfos ||
              fileInfos.length === 0 ||
              !fileInfos.some((f) => f.status === "completed")
            ) {
              if (!errors[section.id]) {
                errors[section.id] = {};
              }
              errors[section.id][
                element.text
              ] = `Please upload the required file(s)`;
            }
          } else {
            const hasAnswer = answeredElements[key];
            if (!hasAnswer) {
              if (!errors[section.id]) {
                errors[section.id] = {};
              }
              errors[section.id][element.text] = `This question is required`;
            }
          }
        }
      });
    });

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstErrorSectionId = Object.keys(errors)[0];
      const sectionIndex = visibleSections.findIndex(
        (section) => section.id === firstErrorSectionId
      );
      if (sectionIndex !== -1) {
        setActiveStep(sectionIndex);
      }

      toast.error("Please complete all required questions before submitting");
      return;
    }

    try {
      const data = {
        ...prepareSubmitData(true),
        status: "Completed",
        issealed: true,
        completedby: accountName ,
        completedDate: new Date().toISOString(),
      };

      console.log("Final submission data:", {
        status: data.status,
        issealed: data.issealed,
        completedby: data.completedby,
        totalSections: data.sections.length,
        repeatedSections: data.sections.filter(s => s.sectionsettings?.isRepeated).length
      });

      const response = await organizerAPI.completeAndNotifyOrganizer(organizer._id, data);
      console.log("Submission response:", response.data);

      organizer.status = "Completed";
      organizer.issealed = true;
      organizer.completedby = accountName ;

      toast.success("Organizer completed and sealed successfully!");
      handleClose();
      
    } catch (error) {
      console.error("Error submitting organizer:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong while updating organizer!"
      );
    }
  };

  const getQuestionTextValue = (question, sectionId) => {
    const numericSectionId =
      typeof sectionId === "string" ? Number(sectionId) : sectionId;
    const key = `${numericSectionId}_${question.text}`;

    switch (question.type) {
      case "Free Entry":
      case "Email":
      case "Number":
        return inputValues[key] || "";
      case "Radio Buttons":
        return radioValues[key] || "";
      case "Checkboxes":
        return checkboxValues[key]
          ? Object.keys(checkboxValues[key])
              .filter((k) => checkboxValues[key][k])
              .join(", ")
          : "";
      case "Yes/No":
        return selectedYesNoValues[key] || "";
      case "Dropdown":
        return selectedDropdownValues[key] || "";
      case "Date":
        return dateValues[key]?.toISOString() || "";
      case "Text Editor":
        return question.text || "";
      case "File Upload":
        const fileInfos = uploadedFiles[key];
        return fileInfos && fileInfos.length > 0
          ? fileInfos
              .filter((f) => f.status === "completed")
              .map((f) => f.fileName)
              .join(", ")
          : "";
      default:
        return "";
    }
  };

  const getOptionSelectedState = (question, option, sectionId) => {
    const numericSectionId =
      typeof sectionId === "string" ? Number(sectionId) : sectionId;
    const key = `${numericSectionId}_${question.text}`;
    switch (question.type) {
      case "Radio Buttons":
        return radioValues[key] === option.text;
      case "Checkboxes":
        return checkboxValues[key]?.[option.text] || false;
      case "Yes/No":
        return selectedYesNoValues[key] === option.text;
      case "Dropdown":
        return selectedDropdownValues[key] === option.text;
      default:
        return false;
    }
  };

  useEffect(() => {
    if (organizer?.sections) {
      const newInputValues = {};
      const newRadioValues = {};
      const newCheckboxValues = {};
      const newSelectedYesNoValues = {};
      const newSelectedDropdownValues = {};
      const newAnsweredElements = {};
      const newUploadedFiles = {};
      const newRepeatedSections = {};
      const newDateValues = {};

      organizer.sections.forEach((section) => {
        const sectionId = section.id;

        if (section.sectionsettings?.isRepeated && section.sectionsettings?.originalSectionId) {
          const originalSectionId = section.sectionsettings.originalSectionId;
          if (!newRepeatedSections[originalSectionId]) {
            newRepeatedSections[originalSectionId] = [];
          }
          if (!newRepeatedSections[originalSectionId].includes(Number(sectionId))) {
            newRepeatedSections[originalSectionId].push(Number(sectionId));
          }
        }

        section.formElements.forEach((element) => {
          const numericSectionId = Number(sectionId);
          const key = `${numericSectionId}_${element.text}`;

          if (element.textvalue) {
            newAnsweredElements[key] = true;

            switch (element.type) {
              case "Free Entry":
              case "Email":
              case "Number":
                newInputValues[key] = element.textvalue;
                break;
              case "Radio Buttons":
                newRadioValues[key] = element.textvalue;
                break;
              case "Checkboxes":
                const selectedOptions = element.textvalue
                  .split(",")
                  .map((s) => s.trim());
                newCheckboxValues[key] = {};
                element.options.forEach((option) => {
                  newCheckboxValues[key][option.text] =
                    selectedOptions.includes(option.text);
                });
                break;
              case "Yes/No":
                newSelectedYesNoValues[key] = element.textvalue;
                break;
              case "Dropdown":
                newSelectedDropdownValues[key] = element.textvalue;
                break;
              case "Date":
                newDateValues[key] = element.textvalue
                  ? dayjs(element.textvalue)
                  : dayjs();
                break;
              case "File Upload":
                if (
                  element.fileMetadata &&
                  Array.isArray(element.fileMetadata)
                ) {
                  newUploadedFiles[key] = element.fileMetadata.map(
                    (fileMeta) => ({
                      fileName: fileMeta.fileName,
                      filePath: fileMeta.filePath,
                      uploadDate: fileMeta.uploadDate,
                      uploadedBy: fileMeta.uploadedBy,
                      status: "completed",
                    })
                  );
                } else if (
                  element.fileMetadata &&
                  element.fileMetadata.fileName
                ) {
                  newUploadedFiles[key] = [
                    {
                      fileName: element.fileMetadata.fileName,
                      filePath: element.fileMetadata.filePath,
                      uploadDate: element.fileMetadata.uploadDate,
                      uploadedBy: element.fileMetadata.uploadedBy,
                      status: "completed",
                    },
                  ];
                } else if (element.textvalue) {
                  const fileNames = element.textvalue
                    .split(",")
                    .map((name) => name.trim());
                  newUploadedFiles[key] = fileNames.map((fileName) => ({
                    fileName: fileName,
                    status: "completed",
                  }));
                }
                break;
            }
          }
        });
      });

      if (organizer.repeatedSections) {
        Object.keys(organizer.repeatedSections).forEach((originalSectionId) => {
          if (!newRepeatedSections[originalSectionId]) {
            newRepeatedSections[originalSectionId] = [];
          }
          organizer.repeatedSections[originalSectionId].forEach((repeatId) => {
            if (!newRepeatedSections[originalSectionId].includes(repeatId)) {
              newRepeatedSections[originalSectionId].push(repeatId);
            }
          });
        });
      }

      Object.keys(newUploadedFiles).forEach((key) => {
        newUploadedFiles[key] = newUploadedFiles[key].filter(
          (file) => file.status === "completed"
        );
        if (newUploadedFiles[key].length === 0) {
          delete newUploadedFiles[key];
        }
      });

      setInputValues(newInputValues);
      setRadioValues(newRadioValues);
      setCheckboxValues(newCheckboxValues);
      setSelectedYesNoValues(newSelectedYesNoValues);
      setSelectedDropdownValues(newSelectedDropdownValues);
      setAnsweredElements(newAnsweredElements);
      setDateValues(newDateValues);
      setUploadedFiles(newUploadedFiles);
      setRepeatedSections(newRepeatedSections);
      
      console.log("Loaded repeated sections:", newRepeatedSections);
    }
  }, [organizer]);

  const isElementActive = (element) => {
    if (organizer?.issealed) return true;
    return element.active === true;
  };

  const hasError = (sectionId, elementText) => {
    return !!validationErrors[sectionId]?.[elementText];
  };

  const getErrorMessage = (sectionId, elementText) => {
    return validationErrors[sectionId]?.[elementText] || "";
  };

  const renderSection = (
    section,
    isRepeated = false,
    originalSectionId = null
  ) => {
    const sectionId = section.id;
    const canRepeat =
      section.sectionsettings?.sectionRepeatingMode && !isRepeated && !organizer?.issealed;

    return (
      <Box key={sectionId}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            {section.text}
            {isRepeated && (
              <Chip 
                label="Repeated" 
                size="small" 
                color="secondary" 
                sx={{ ml: 1, fontSize: '0.7rem' }}
              />
            )}
          </Typography>
          {isRepeated && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() =>
                removeRepeatedSection(originalSectionId, Number(sectionId))
              }
              disabled={organizer?.issealed}
            >
              Remove Section
            </Button>
          )}
        </Box>

        {section.formElements.map(
          (element) =>
            shouldShowElement(element, sectionId) && (
              <Box key={`${sectionId}_${element.id}`}>
                {element.type === "Text Editor" && (
                  <Box mt={2} mb={2}>
                    <Typography>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: element.text,
                        }}
                      />
                    </Typography>
                  </Box>
                )}

                {(element.type === "Free Entry" ||
                  element.type === "Email") && (
                  <Box mt={2}>
                    <Typography
                      variant="subtitle2"
                      component="p"
                      gutterBottom
                      sx={{ fontWeight: "550" }}
                    >
                      {element.text}
                      {element.questionsectionsettings?.required && (
                        <span style={{ color: "red", marginLeft: "4px" }}>
                          *
                        </span>
                      )}
                    </Typography>
                    <TextField
                      disabled={isElementActive(element)}
                      variant="filled"
                      size="small"
                      multiline
                      fullWidth
                      placeholder={`${element.type} Answer`}
                      inputProps={{
                        type:
                          element.type === "Free Entry"
                            ? "text"
                            : element.type.toLowerCase(),
                      }}
                      style={{ display: "block" }}
                      value={inputValues[`${sectionId}_${element.text}`] || ""}
                      onChange={(e) =>
                        handleInputChange(e, element.text, sectionId)
                      }
                      error={hasError(sectionId, element.text)}
                    />
                    {hasError(sectionId, element.text) && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ display: "block", mt: 0.5, ml: 1 }}
                      >
                        {getErrorMessage(sectionId, element.text)}
                      </Typography>
                    )}
                  </Box>
                )}

                {element.type === "Number" && (
                  <Box mt={2}>
                    <Typography
                      variant="subtitle2"
                      component="p"
                      gutterBottom
                      sx={{ fontWeight: "550" }}
                    >
                      {element.text}
                      {element.questionsectionsettings?.required && (
                        <span style={{ color: "red", marginLeft: "4px" }}>
                          *
                        </span>
                      )}
                    </Typography>
                    <TextField
                      disabled={isElementActive(element)}
                      variant="outlined"
                      size="small"
                      multiline
                      fullWidth
                      placeholder={`${element.type} Answer`}
                      inputProps={{
                        type: "text",
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                      }}
                      maxRows={8}
                      style={{
                        display: "block",
                        marginTop: "15px",
                      }}
                      value={inputValues[`${sectionId}_${element.text}`] || ""}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/\D/g, "");
                        handleInputChange(
                          { target: { value: numericValue } },
                          element.text,
                          sectionId
                        );
                      }}
                      error={hasError(sectionId, element.text)}
                    />
                    {hasError(sectionId, element.text) && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ display: "block", mt: 0.5, ml: 1 }}
                      >
                        {getErrorMessage(sectionId, element.text)}
                      </Typography>
                    )}
                  </Box>
                )}

                {element.type === "Radio Buttons" && (
                  <Box mt={2}>
                    <Typography
                      variant="subtitle2"
                      component="p"
                      gutterBottom
                      sx={{ fontWeight: "550" }}
                    >
                      {element.text}
                      {element.questionsectionsettings?.required && (
                        <span style={{ color: "red", marginLeft: "4px" }}>
                          *
                        </span>
                      )}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      {element.options.map((option) => (
                        <SelectableButton
                          key={option.text}
                          selected={
                            radioValues[`${sectionId}_${element.text}`] ===
                            option.text
                          }
                          disabled={isElementActive(element)}
                          onClick={() =>
                            handleRadioChange(
                              option.text,
                              element.text,
                              sectionId
                            )
                          }
                        >
                          {option.text}
                        </SelectableButton>
                      ))}
                    </Box>
                    {hasError(sectionId, element.text) && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ display: "block", mt: 0.5, ml: 1 }}
                      >
                        {getErrorMessage(sectionId, element.text)}
                      </Typography>
                    )}
                  </Box>
                )}

                {element.type === "Checkboxes" && (
                  <Box mt={2}>
                    <Typography
                      variant="subtitle2"
                      component="p"
                      gutterBottom
                      sx={{ fontWeight: "550" }}
                    >
                      {element.text}
                      {element.questionsectionsettings?.required && (
                        <span style={{ color: "red", marginLeft: "4px" }}>
                          *
                        </span>
                      )}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      {element.options.map((option) => (
                        <SelectableButton
                          key={option.text}
                          selected={
                            checkboxValues[`${sectionId}_${element.text}`]?.[
                              option.text
                            ]
                          }
                          disabled={isElementActive(element)}
                          onClick={() =>
                            handleCheckboxChange(
                              option.text,
                              element.text,
                              sectionId
                            )
                          }
                        >
                          {option.text}
                        </SelectableButton>
                      ))}
                    </Box>
                    {hasError(sectionId, element.text) && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ display: "block", mt: 0.5, ml: 1 }}
                      >
                        {getErrorMessage(sectionId, element.text)}
                      </Typography>
                    )}
                  </Box>
                )}

                {element.type === "Yes/No" && (
                  <Box mt={2}>
                    <Typography
                      variant="subtitle2"
                      component="p"
                      gutterBottom
                      sx={{ fontWeight: "550" }}
                    >
                      {element.text}
                      {element.questionsectionsettings?.required && (
                        <span style={{ color: "red", marginLeft: "4px" }}>
                          *
                        </span>
                      )}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {element.options.map((option) => (
                        <SelectableButton
                          key={option.text}
                          selected={
                            selectedYesNoValues[
                              `${sectionId}_${element.text}`
                            ] === option.text
                          }
                          disabled={isElementActive(element)}
                          onClick={() =>
                            handleYesNoChange(
                              option.text,
                              element.text,
                              sectionId
                            )
                          }
                        >
                          {option.text}
                        </SelectableButton>
                      ))}
                    </Box>
                    {hasError(sectionId, element.text) && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ display: "block", mt: 0.5, ml: 1 }}
                      >
                        {getErrorMessage(sectionId, element.text)}
                      </Typography>
                    )}
                  </Box>
                )}

                {element.type === "Dropdown" && (
                  <Box mt={2}>
                    <Typography
                      variant="subtitle2"
                      component="p"
                      gutterBottom
                      sx={{ fontWeight: "550" }}
                    >
                      {element.text}
                      {element.questionsectionsettings?.required && (
                        <span style={{ color: "red", marginLeft: "4px" }}>
                          *
                        </span>
                      )}
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={
                          selectedDropdownValues[
                            `${sectionId}_${element.text}`
                          ] || ""
                        }
                        disabled={isElementActive(element)}
                        onChange={(event) =>
                          handleDropdownValueChange(
                            event,
                            element.text,
                            sectionId
                          )
                        }
                        size="small"
                      >
                        {element.options.map((option) => (
                          <MenuItem key={option.text} value={option.text}>
                            {option.text}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {hasError(sectionId, element.text) && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ display: "block", mt: 0.5, ml: 1 }}
                      >
                        {getErrorMessage(sectionId, element.text)}
                      </Typography>
                    )}
                  </Box>
                )}

                {element.type === "Date" && (
                  <Box mt={2}>
                    <Typography
                      variant="subtitle2"
                      component="p"
                      gutterBottom
                      sx={{ fontWeight: "550" }}
                    >
                      {element.text}
                      {element.questionsectionsettings?.required && (
                        <span style={{ color: "red", marginLeft: "4px" }}>
                          *
                        </span>
                      )}
                    </Typography>

                    {element.type === "Date" && (
                      <Box mt={2}>
                        <Typography
                          variant="subtitle2"
                          component="p"
                          gutterBottom
                          sx={{ fontWeight: "550" }}
                        >
                          {element.text}
                          {element.questionsectionsettings?.required && (
                            <span style={{ color: "red", marginLeft: "4px" }}>
                              *
                            </span>
                          )}
                        </Typography>

                        <DatePicker
                          format="MM/DD/YYYY"
                          sx={{
                            width: "100%",
                            backgroundColor: "#fff",
                          }}
                          value={
                            dateValues[`${sectionId}_${element.text}`] ||
                            dayjs()
                          }
                          disabled={isElementActive(element)}
                          onChange={(newValue) => {
                            if (!isElementActive(element)) {
                              handleDateChange(
                                newValue,
                                element.text,
                                sectionId
                              );
                            }
                          }}
                          slotProps={{
                            textField: { size: "small" }
                          }}
                        />
                        {hasError(sectionId, element.text) && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ display: "block", mt: 0.5, ml: 1 }}
                          >
                            {getErrorMessage(sectionId, element.text)}
                          </Typography>
                        )}
                      </Box>
                    )}
                    {hasError(sectionId, element.text) && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ display: "block", mt: 0.5, ml: 1 }}
                      >
                        {getErrorMessage(sectionId, element.text)}
                      </Typography>
                    )}
                  </Box>
                )}

                {element.type === "File Upload" && (
                  <Box mt={2}>
                    <Typography
                      variant="subtitle2"
                      component="p"
                      gutterBottom
                      sx={{ fontWeight: "550" }}
                    >
                      {element.text}
                      {element.questionsectionsettings?.required && (
                        <span style={{ color: "red", marginLeft: "4px" }}>
                          *
                        </span>
                      )}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="outlined"
                        component="label"
                        disabled={
                          isElementActive(element)
                        }
                      >
                        Choose Files
                          <input type="file" hidden multiple   onChange={(e) =>
                            handleFileSelect(e, element.text, sectionId)
                          }
                          sx={{ display: "none" }}
                          disabled={
                            isElementActive(element)
                          } />
                      </Button>
                      <Typography
                        variant="caption"
                        sx={{ display: "block", mt: 0.5, ml: 1 }}
                      >
                        You can select multiple files
                      </Typography>
                    </Box>

                    {pendingFiles[`${sectionId}_${element.text}`]?.length >
                      0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          gutterBottom
                        >
                          Files ready to upload (
                          {pendingFiles[`${sectionId}_${element.text}`].length}
                          ):
                        </Typography>
                        {pendingFiles[`${sectionId}_${element.text}`].map(
                          (fileInfo, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 0.5,
                              }}
                            >
                              <Typography variant="body2">
                                {fileInfo.fileName} (Ready to upload)
                              </Typography>
                            </Box>
                          )
                        )}
                      </Box>
                    )}

                    {uploadedFiles[`${sectionId}_${element.text}`]?.length >
                      0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          gutterBottom
                        >
                          Uploaded Files (
                          {uploadedFiles[`${sectionId}_${element.text}`].length}
                          ):
                        </Typography>
                        {uploadedFiles[`${sectionId}_${element.text}`].map(
                          (fileInfo, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 0.5,
                                p: 1,
                                bgcolor: "grey.50",
                                borderRadius: 1,
                              }}
                            >
                              <Typography variant="body2" sx={{ flex: 1 }}>
                                {fileInfo.fileName}
                                {fileInfo.status === "uploading" &&
                                  " (Uploading...)"}
                                {fileInfo.status === "completed" && " ✓"}
                              </Typography>

                              {!isElementActive(element) &&
                                fileInfo.status === "completed" && (
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      handleDeleteFile(
                                        sectionId,
                                        element.text,
                                        fileInfo.fileName
                                      )
                                    }
                                    title="Delete this file"
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                )}
                            </Box>
                          )
                        )}

                        {!isElementActive(element) &&
                          uploadedFiles[`${sectionId}_${element.text}`].length >
                            1 && (
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() =>
                                handleDeleteFile(sectionId, element.text)
                              }
                              sx={{ mt: 1 }}
                            >
                              Delete All Files
                            </Button>
                          )}
                      </Box>
                    )}

                    {hasError(sectionId, element.text) && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ display: "block", mt: 0.5, ml: 1 }}
                      >
                        {getErrorMessage(sectionId, element.text)}
                      </Typography>
                    )}
                    {pendingFiles[`${sectionId}_${element.text}`]?.length >
                      0 && (
                      <Typography variant="caption" color="warning.main">
                        ⚠ {pendingFiles[`${sectionId}_${element.text}`].length}{" "}
                        file(s) selected but not uploaded yet
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            )
        )}

        {canRepeat && (
          <Box mt={3} mb={2}>
            <Button
              variant="outlined"
              onClick={() => addRepeatedSection(sectionId)}
              disabled={organizer?.issealed}
              startIcon={<AddIcon />}
            >
              Add Another {section.text}
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog fullScreen open={open} onClose={handleClose}>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 3,
              py: 2,
              borderBottom: "1px solid #ddd",
            }}
          >
            <Typography variant="h6" component="p">
              {organizer?.organizerName || "Organizer"}
            </Typography>
            <IconButton edge="end" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <FormControl
              fullWidth
              sx={{ marginBottom: "10px", marginTop: "10px" }}
            >
              <Select
                value={activeStep}
                onChange={handleDropdownChange}
                size="small"
              >
                {visibleSections.map((section, index) => {
                  const visibleElements = section.formElements.filter((el) =>
                    shouldShowElement(el, section.id)
                  );

                  const answeredCount = visibleElements.reduce(
                    (count, element) => {
                      const key = `${section.id}_${element.text}`;
                      return count + (answeredElements[key] ? 1 : 0);
                    },
                    0
                  );

                  const totalVisibleElements = visibleElements.length;

                  return (
                    <MenuItem key={section.id} value={index}>
                      {section.text} ({answeredCount}/{totalVisibleElements})
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <Box mt={2} mb={2}>
              <LinearProgress
                variant="determinate"
                value={((activeStep + 1) / totalSteps) * 100}
              />
            </Box>

            <Box sx={{ pl: 20, pr: 20 }}>
              {visibleSections.map(
                (section, sectionIndex) =>
                  sectionIndex === activeStep &&
                  renderSection(
                    section,
                    section.isRepeated,
                    section.originalSectionId
                  )
              )}

              <Box
                mt={3}
                display="flex"
                alignItems="center"
                justifyContent={"space-between"}
              >
                <Box display="flex" gap={3} alignItems="center">
                  {activeStep > 0 && (
                    <Button onClick={handleBack} variant="outlined">
                      <ArrowBackIcon fontSize="small" />
                    </Button>
                  )}

                  {activeStep < totalSteps - 1 && (
                    <Button
                      onClick={handleNext}
                      color="primary"
                      sx={{
                        backgroundColor: "text.menu",
                        color: "primary.contrastText",
                        "&:hover": {
                          backgroundColor: "menu.dark",
                          boxShadow: 1,
                        },
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      Next{" "}
                      <ArrowForwardIcon
                        fontSize="small"
                        sx={{ marginLeft: 2 }}
                      />
                    </Button>
                  )}

                  <Button
                    onClick={handleSubmit}
                    color="primary"
                    disabled={organizer?.issealed || organizer?.status === "Completed"}
                    sx={{
                      backgroundColor: organizer?.issealed || organizer?.status === "Completed" 
                        ? "grey.400" 
                        : "text.menu",
                      color: "primary.contrastText",
                      "&:hover": { 
                        backgroundColor: organizer?.issealed || organizer?.status === "Completed" 
                          ? "grey.400" 
                          : "menu.dark", 
                        boxShadow: 1 
                      },
                      transition: "background-color 0.2s ease",
                      "&.Mui-disabled": {
                        color: "white",
                        backgroundColor: "grey.400",
                      }
                    }}
                  >
                    {organizer?.issealed || organizer?.status === "Completed" ? "Completed" : "Submit"}
                  </Button>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <Typography>
                    Step {activeStep + 1} of {totalSteps}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </LocalizationProvider>

      <FileUploadDrawer
        isOpen={isDocumentForm}
        organizer={organizer}
        onClose={() => {
          const key = Object.keys(pendingFiles).find(
            (k) => pendingFiles[k]?.length > 0
          );
          if (key) {
            setPendingFiles((prev) => {
              const newState = { ...prev };
              delete newState[key];
              return newState;
            });
            setSelectedFiles((prev) => {
              const newState = { ...prev };
              delete newState[key];
              return newState;
            });
          }
          setIsDocumentForm(false);
        }}
        files={
          selectedFiles[
            Object.keys(selectedFiles).find((k) => pendingFiles[k]?.length > 0)
          ] || []
        }
        accountId={accountId}
        folderTree={folderTree}
        onUploadSuccess={(uploadedFileDataArray) => {
          console.log("Files uploaded successfully:", uploadedFileDataArray);

          const key = Object.keys(pendingFiles).find(
            (k) => pendingFiles[k]?.length > 0
          );

          if (key && uploadedFileDataArray.length > 0) {
            setUploadedFiles((prev) => ({
              ...prev,
              [key]: [
                ...(prev[key] || []),
                ...uploadedFileDataArray.map((fileData) => ({
                  fileName: fileData.fileName,
                  filePath: fileData.filePath,
                  uploadDate: new Date().toISOString(),
                  uploadedBy: accountName ,
                  status: "completed",
                })),
              ],
            }));

            setPendingFiles((prev) => {
              const newState = { ...prev };
              delete newState[key];
              return newState;
            });

            setSelectedFiles((prev) => {
              const newState = { ...prev };
              delete newState[key];
              return newState;
            });

            setAnsweredElements((prev) => ({
              ...prev,
              [key]: true,
            }));

            const [sectionId, elementText] = key.split("_");
            const numericSectionId = Number(sectionId);
            if (validationErrors[numericSectionId]?.[elementText]) {
              setValidationErrors((prev) => {
                const newErrors = { ...prev };
                if (newErrors[numericSectionId]) {
                  delete newErrors[numericSectionId][elementText];
                  if (Object.keys(newErrors[numericSectionId]).length === 0) {
                    delete newErrors[numericSectionId];
                  }
                }
                return newErrors;
              });
            }

            const data = prepareSubmitData(false);
            debouncedAutoSave(data);

            toast.success(
              `${uploadedFileDataArray.length} file(s) uploaded successfully!`
            );
          }

          setIsDocumentForm(false);
        }}
        onUploadError={(errorFiles) => {
          console.error("File uploads failed:", errorFiles);
          const key = Object.keys(pendingFiles).find(
            (k) => pendingFiles[k]?.length > 0
          );
          if (key) {
            setPendingFiles((prev) => {
              const newState = { ...prev };
              delete newState[key];
              return newState;
            });
            setSelectedFiles((prev) => {
              const newState = { ...prev };
              delete newState[key];
              return newState;
            });
          }
          toast.error(`${errorFiles.length} file(s) failed to upload!`);
        }}
      />
    </>
  );
};

export default OrganizerDialog;