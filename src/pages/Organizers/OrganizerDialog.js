import React, { useState, useEffect, useCallback } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { debounce } from "lodash";
import {
  organizerAPI,
  accountsAPI,
  docAPI,
  authAPI,
  accountDocsAPI,
} from "../../services/api";
import FileUploadDrawer from "./FileUploadDrawer";
import SelectableButton from "./SelectableButton";
import { useToast } from "../../hooks/useToast";

const OrganizerDialog = ({ open, handleClose, organizer }) => {
  const [accountName, setAccountName] = useState("");
  const [accId] = useState(sessionStorage.getItem("accountId"));
  const toast = useToast();
  const [organizerDetails, setOrganizerDetails] = useState(null);


console.log("orgnaizer details",organizer)
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
    sessionStorage.getItem("accountId"),
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

    setRadioValues((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        const [keySectionId] = key.split("_");
        if (Number(keySectionId) === numericSectionId) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setCheckboxValues((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        const [keySectionId] = key.split("_");
        if (Number(keySectionId) === numericSectionId) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setSelectedDropdownValues((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        const [keySectionId] = key.split("_");
        if (Number(keySectionId) === numericSectionId) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setSelectedYesNoValues((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        const [keySectionId] = key.split("_");
        if (Number(keySectionId) === numericSectionId) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setInputValues((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        const [keySectionId] = key.split("_");
        if (Number(keySectionId) === numericSectionId) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setDateValues((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        const [keySectionId] = key.split("_");
        if (Number(keySectionId) === numericSectionId) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setAnsweredElements((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        const [keySectionId] = key.split("_");
        if (Number(keySectionId) === numericSectionId) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setUploadedFiles((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        const [keySectionId] = key.split("_");
        if (Number(keySectionId) === numericSectionId) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setPendingFiles((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        const [keySectionId] = key.split("_");
        if (Number(keySectionId) === numericSectionId) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setSelectedFiles((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        const [keySectionId] = key.split("_");
        if (Number(keySectionId) === numericSectionId) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      if (newErrors[numericSectionId]) {
        delete newErrors[numericSectionId];
      }
      return newErrors;
    });
  }, []);

  const addRepeatedSection = (sectionId) => {
    const baseSection = sections?.find((s) => s.id === sectionId);
    if (!baseSection) return;

    setRepeatedSections((prev) => {
      const currentRepeats = prev[sectionId] || [];
      const baseId = Number(sectionId);
      const newRepeatId = baseId + (currentRepeats.length + 1) * 1000000;

      console.log(
        `Adding repeated section: Base=${sectionId}, New=${newRepeatId}`,
      );

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
          `Are you sure you want to delete "${fileInfo.fileName}"?`,
        );

        if (!confirmDelete) return;

        if (fileInfo.filePath) {
          const deleteResponse = await accountDocsAPI.deleteItem({
            targetPath: `${fileInfo.filePath}`,
          });

          if (!deleteResponse.data.success) {
            throw new Error(
              deleteResponse.data.message ||
                "Failed to delete file from storage",
            );
          }
        }

        setUploadedFiles((prev) => {
          const newState = { ...prev };
          if (newState[key]) {
            newState[key] = newState[key].filter(
              (f) => f.fileName !== fileName,
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
      console.log("fileInfos to delete", fileInfos);
      if (!fileInfos || fileInfos.length === 0) return;

      try {
        const confirmDelete = window.confirm(
          `Are you sure you want to delete all ${fileInfos.length} files?`,
        );

        if (!confirmDelete) return;

        for (const fileInfo of fileInfos) {
          if (fileInfo.filePath) {
            const deleteResponse = await accountDocsAPI.deleteItem({
              targetPath: `${fileInfo.filePath}`,
            });

            if (!deleteResponse.data.success) {
              throw new Error(
                deleteResponse.data.message ||
                  "Failed to delete file from storage",
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
        const response = await organizerAPI.updateOrganizerAccountWise(
          organizer._id,
          data,
        );
        console.log("Auto-save successful", response.data);
      } catch (error) {
        console.error("Error auto-saving organizer:", error);
      }
    }, 2000),
    [organizer?._id],
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
    const allVisibleSections = organizer?.sections || [] ;

    const sectionsData = allVisibleSections.map((section) => {
      let baseSection = section;

      if (section.isRepeated && section.originalSectionId) {
        const originalSection = sections?.find(
          (s) => s.id === section.originalSectionId,
        );
        if (originalSection) {
          baseSection = {
            ...originalSection,
            id: section.id,
            text: section.text || originalSection.text,
            sectionsettings: {
              ...originalSection.sectionsettings,
              isRepeated: true,
              originalSectionId: section.originalSectionId,
            },
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
                    Number(baseSection.id),
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
                  (file) => file.status === "completed",
                );
                if (completedFiles.length > 0) {
                  questionData.fileMetadata = completedFiles.map(
                    (fileInfo) => ({
                      fileName: fileInfo.fileName,
                      filePath: fileInfo.filePath || "",
                      uploadDate:
                        fileInfo.uploadDate || new Date().toISOString(),
                      uploadedBy: accountName,
                    }),
                  );
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
    console.log(
      "Status in prepareSubmitData:",
      data.status,
      "finalSubmit:",
      finalSubmit,
    );

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

  const shouldShowSection = useCallback(
    (section) => {
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
            const checkboxSectionAnswer =
              checkboxValues[key]?.[condition.answer];
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
    },
    [radioValues, checkboxValues, selectedDropdownValues, selectedYesNoValues],
  );

  useEffect(() => {
    if (!sections) return;

    const currentlyVisible = (sections || []).filter(shouldShowSection);

    const sectionsToClear = previousVisibleSections.filter(
      (prevSection) =>
        !currentlyVisible.some(
          (currSection) => currSection.id === prevSection.id,
        ),
    );

    // sectionsToClear.forEach((section) => {
    //   clearSectionValues(section.id);
    // });

    setPreviousVisibleSections(currentlyVisible);
  }, [
    sections,
    shouldShowSection,
    clearSectionValues,
    previousVisibleSections,
  ]);

  const visibleSections = getVisibleSections();
  const totalSteps = visibleSections.length;
useEffect(() => {
  if (activeStep >= visibleSections.length) {
    setActiveStep(Math.max(0, visibleSections.length - 1));
  }
}, [visibleSections.length, activeStep]);
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

      const currentSectionId =
        typeof sectionId === "string" ? Number(sectionId) : sectionId;

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

  // const handleDropdownChange = (event) => {
  //   const selectedIndex = event.target.value;
  //   setActiveStep(selectedIndex);
  // };
  const handleDropdownChange = (event) => {
  setActiveStep(Number(event.target.value));
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
              errors[section.id][element.text] =
                `Please upload the required file(s)`;
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
        (section) => section.id === firstErrorSectionId,
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
        completedby: accountName,
        completedDate: new Date().toISOString(),
      };

      console.log("Final submission data:", {
        status: data.status,
        issealed: data.issealed,
        completedby: data.completedby,
        totalSections: data.sections.length,
        repeatedSections: data.sections.filter(
          (s) => s.sectionsettings?.isRepeated,
        ).length,
      });

      const response = await organizerAPI.completeAndNotifyOrganizer(
        organizer._id,
        data,
      );
      console.log("Submission response:", response.data);

      organizer.status = "Completed";
      organizer.issealed = true;
      organizer.completedby = accountName;

      toast.success("Organizer completed and sealed successfully!");
      handleClose();
    } catch (error) {
      console.error("Error submitting organizer:", error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while updating organizer!",
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

        if (
          section.sectionsettings?.isRepeated &&
          section.sectionsettings?.originalSectionId
        ) {
          const originalSectionId = section.sectionsettings.originalSectionId;
          if (!newRepeatedSections[originalSectionId]) {
            newRepeatedSections[originalSectionId] = [];
          }
          if (
            !newRepeatedSections[originalSectionId].includes(Number(sectionId))
          ) {
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
                    }),
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
          (file) => file.status === "completed",
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
    originalSectionId = null,
  ) => {
    const sectionId = section.id;
    const canRepeat =
      section.sectionsettings?.sectionRepeatingMode &&
      !isRepeated &&
      !organizer?.issealed;

    return (
      <div key={sectionId} className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {section.text}
            {isRepeated && (
              <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                Repeated
              </span>
            )}
          </h2>
          {isRepeated && (
            <button
              onClick={() =>
                removeRepeatedSection(originalSectionId, Number(sectionId))
              }
              disabled={organizer?.issealed}
              className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove Section
            </button>
          )}
        </div>

        {section.formElements.map(
          (element) =>
            shouldShowElement(element, sectionId) && (
              <div key={`${sectionId}_${element.id}`}>
                {element.type === "Text Editor" && (
                  <div className="mt-2 mb-2">
                    <div
                      className="prose"
                      dangerouslySetInnerHTML={{ __html: element.text }}
                    />
                  </div>
                )}

                {(element.type === "Free Entry" ||
                  element.type === "Email") && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {element.text}
                      {element.questionsectionsettings?.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </p>
                    <input
                      disabled={isElementActive(element)}
                      type={element.type === "Free Entry" ? "text" : "email"}
                      placeholder={`${element.type} Answer`}
                      value={inputValues[`${sectionId}_${element.text}`] || ""}
                      onChange={(e) =>
                        handleInputChange(e, element.text, sectionId)
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        hasError(sectionId, element.text)
                          ? "border-red-500"
                          : "border-gray-300"
                      } ${isElementActive(element) ? "bg-gray-100" : "bg-white"}`}
                    />
                    {hasError(sectionId, element.text) && (
                      <p className="text-red-500 text-xs mt-1 ml-1">
                        {getErrorMessage(sectionId, element.text)}
                      </p>
                    )}
                  </div>
                )}

                {element.type === "Number" && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {element.text}
                      {element.questionsectionsettings?.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </p>
                    <input
                      disabled={isElementActive(element)}
                      type="text"
                      inputMode="numeric"
                      placeholder={`${element.type} Answer`}
                      value={inputValues[`${sectionId}_${element.text}`] || ""}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/\D/g, "");
                        handleInputChange(
                          { target: { value: numericValue } },
                          element.text,
                          sectionId,
                        );
                      }}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        hasError(sectionId, element.text)
                          ? "border-red-500"
                          : "border-gray-300"
                      } ${isElementActive(element) ? "bg-gray-100" : "bg-white"}`}
                    />
                    {hasError(sectionId, element.text) && (
                      <p className="text-red-500 text-xs mt-1 ml-1">
                        {getErrorMessage(sectionId, element.text)}
                      </p>
                    )}
                  </div>
                )}

                {element.type === "Radio Buttons" && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {element.text}
                      {element.questionsectionsettings?.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </p>
                    <div className="flex gap-2 flex-wrap">
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
                              sectionId,
                            )
                          }
                        >
                          {option.text}
                        </SelectableButton>
                      ))}
                    </div>
                    {hasError(sectionId, element.text) && (
                      <p className="text-red-500 text-xs mt-1 ml-1">
                        {getErrorMessage(sectionId, element.text)}
                      </p>
                    )}
                  </div>
                )}

                {element.type === "Checkboxes" && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {element.text}
                      {element.questionsectionsettings?.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </p>
                    <div className="flex gap-2 flex-wrap">
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
                              sectionId,
                            )
                          }
                        >
                          {option.text}
                        </SelectableButton>
                      ))}
                    </div>
                    {hasError(sectionId, element.text) && (
                      <p className="text-red-500 text-xs mt-1 ml-1">
                        {getErrorMessage(sectionId, element.text)}
                      </p>
                    )}
                  </div>
                )}

                {element.type === "Yes/No" && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {element.text}
                      {element.questionsectionsettings?.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </p>
                    <div className="flex gap-2">
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
                              sectionId,
                            )
                          }
                        >
                          {option.text}
                        </SelectableButton>
                      ))}
                    </div>
                    {hasError(sectionId, element.text) && (
                      <p className="text-red-500 text-xs mt-1 ml-1">
                        {getErrorMessage(sectionId, element.text)}
                      </p>
                    )}
                  </div>
                )}

                {element.type === "Dropdown" && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {element.text}
                      {element.questionsectionsettings?.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </p>
                    <select
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
                          sectionId,
                        )
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        hasError(sectionId, element.text)
                          ? "border-red-500"
                          : "border-gray-300"
                      } ${isElementActive(element) ? "bg-gray-100" : "bg-white"}`}
                    >
                      <option value="">Select an option</option>
                      {element.options.map((option) => (
                        <option key={option.text} value={option.text}>
                          {option.text}
                        </option>
                      ))}
                    </select>
                    {hasError(sectionId, element.text) && (
                      <p className="text-red-500 text-xs mt-1 ml-1">
                        {getErrorMessage(sectionId, element.text)}
                      </p>
                    )}
                  </div>
                )}

                {element.type === "Date" && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {element.text}
                      {element.questionsectionsettings?.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </p>
                    <input
                      type="date"
                      value={
                        dateValues[`${sectionId}_${element.text}`]
                          ? dayjs(
                              dateValues[`${sectionId}_${element.text}`],
                            ).format("YYYY-MM-DD")
                          : ""
                      }
                      disabled={isElementActive(element)}
                      onChange={(e) => {
                        if (!isElementActive(element) && e.target.value) {
                          handleDateChange(
                            dayjs(e.target.value),
                            element.text,
                            sectionId,
                          );
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        hasError(sectionId, element.text)
                          ? "border-red-500"
                          : "border-gray-300"
                      } ${isElementActive(element) ? "bg-gray-100" : "bg-white"}`}
                    />
                    {hasError(sectionId, element.text) && (
                      <p className="text-red-500 text-xs mt-1 ml-1">
                        {getErrorMessage(sectionId, element.text)}
                      </p>
                    )}
                  </div>
                )}
                {element.type === "File Upload" && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {element.text}
                      {element.questionsectionsettings?.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </p>

                    <div className="mb-3">
                      <label className="inline-block">
                        <input
                          type="file"
                          hidden
                          multiple
                          onChange={(e) =>
                            handleFileSelect(e, element.text, sectionId)
                          }
                          disabled={isElementActive(element)}
                          className="hidden"
                        />
                        <span
                          className={`px-4 py-2 border rounded cursor-pointer inline-block ${
                            isElementActive(element)
                              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                          }`}
                        >
                          Choose Files
                        </span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1 ml-1">
                        You can select multiple files
                      </p>
                    </div>

                    {pendingFiles[`${sectionId}_${element.text}`]?.length >
                      0 && (
                      <div className="mb-3">
                        <p className="text-sm font-bold mb-1">
                          Files ready to upload (
                          {pendingFiles[`${sectionId}_${element.text}`].length}
                          ):
                        </p>
                        {pendingFiles[`${sectionId}_${element.text}`].map(
                          (fileInfo, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 mb-1"
                            >
                              <p className="text-sm">
                                {fileInfo.fileName} (Ready to upload)
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    )}

                    {uploadedFiles[`${sectionId}_${element.text}`]?.length >
                      0 && (
                      <div className="mb-3">
                        <p className="text-sm font-bold mb-1">
                          Uploaded Files (
                          {uploadedFiles[`${sectionId}_${element.text}`].length}
                          ):
                        </p>
                        {uploadedFiles[`${sectionId}_${element.text}`].map(
                          (fileInfo, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 mb-1 p-2 bg-gray-50 rounded"
                            >
                              <p className="text-sm flex-1">
                                {fileInfo.fileName}
                                {fileInfo.status === "uploading" &&
                                  " (Uploading...)"}
                                {fileInfo.status === "completed" && " ✓"}
                              </p>

                              {!isElementActive(element) &&
                                fileInfo.status === "completed" && (
                                  <button
                                    onClick={() =>
                                      handleDeleteFile(
                                        sectionId,
                                        element.text,
                                        fileInfo.fileName,
                                      )
                                    }
                                    className="text-red-600 hover:text-red-800"
                                    title="Delete this file"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                )}
                            </div>
                          ),
                        )}

                        {!isElementActive(element) &&
                          uploadedFiles[`${sectionId}_${element.text}`].length >
                            1 && (
                            <button
                              onClick={() =>
                                handleDeleteFile(sectionId, element.text)
                              }
                              className="mt-2 px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                            >
                              Delete All Files
                            </button>
                          )}
                      </div>
                    )}

                    {hasError(sectionId, element.text) && (
                      <p className="text-red-500 text-xs mt-1 ml-1">
                        {getErrorMessage(sectionId, element.text)}
                      </p>
                    )}
                    {pendingFiles[`${sectionId}_${element.text}`]?.length >
                      0 && (
                      <p className="text-yellow-600 text-xs mt-1">
                        ⚠ {pendingFiles[`${sectionId}_${element.text}`].length}{" "}
                        file(s) selected but not uploaded yet
                      </p>
                    )}
                  </div>
                )}
              </div>
            ),
        )}

        {canRepeat && (
          <div className="mt-6 mb-4">
            <button
              onClick={() => addRepeatedSection(sectionId)}
              disabled={organizer?.issealed}
              className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Another {section.text}
            </button>
          </div>
        )}
      </div>
    );
  };

  if (!open) return null;

  return (
    <>
      {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
      {/* Backdrop with blur */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        {/* Dialog Container */}
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              {organizer?.organizerName || "Organizer"}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
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

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Section Selector */}
            <select
              value={activeStep}
              onChange={handleDropdownChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            >
              {visibleSections.map((section, index) => {
                const visibleElements = section.formElements.filter((el) =>
                  shouldShowElement(el, section.id),
                );

                const answeredCount = visibleElements.reduce(
                  (count, element) => {
                    const key = `${section.id}_${element.text}`;
                    return count + (answeredElements[key] ? 1 : 0);
                  },
                  0,
                );

                const totalVisibleElements = visibleElements.length;

                return (
                  <option key={section.id} value={index}>
                    {section.text} ({answeredCount}/{totalVisibleElements})
                  </option>
                );
              })}
            </select>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((activeStep + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Section Content */}
            <div className="px-4 md:px-20">
              {visibleSections.map(
                (section, sectionIndex) =>
                  sectionIndex === activeStep &&
                  renderSection(
                    section,
                    section.isRepeated,
                    section.originalSectionId,
                  ),
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  {activeStep > 0 && (
                    <button
                      onClick={handleBack}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Back
                    </button>
                  )}

                  {activeStep < totalSteps - 1 && (
                    <button
                      onClick={handleNext}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
                    >
                      Next
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={
                      organizer?.issealed || organizer?.status === "Completed"
                    }
                    className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1 ${
                      organizer?.issealed || organizer?.status === "Completed"
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {organizer?.issealed || organizer?.status === "Completed"
                      ? "Completed"
                      : "Submit"}
                  </button>
                </div>

                <div className="text-sm text-gray-600">
                  Step {activeStep + 1} of {totalSteps}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </LocalizationProvider> */}

      <FileUploadDrawer
        isOpen={isDocumentForm}
        organizer={organizer}
        onClose={() => {
          const key = Object.keys(pendingFiles).find(
            (k) => pendingFiles[k]?.length > 0,
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
            (k) => pendingFiles[k]?.length > 0,
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
                  uploadedBy: accountName,
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
              `${uploadedFileDataArray.length} file(s) uploaded successfully!`,
            );
          }

          setIsDocumentForm(false);
        }}
        onUploadError={(errorFiles) => {
          console.error("File uploads failed:", errorFiles);
          const key = Object.keys(pendingFiles).find(
            (k) => pendingFiles[k]?.length > 0,
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
