import {
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Drawer,
  Stack,
  Box,
  Button,
} from "@mui/material";
import { drawerClasses } from "@mui/material/Drawer";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "material-react-toastify";

import Editor from "../../components/Texteditor";
import MenuButton from "../../components/MenuButton";

// ✅ API
import { chatAPI } from "../../services/api";

function NewChat({ open, close, accId, accountName }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [inputText, setInputText] = useState("");
  const [editorContent, setEditorContent] = useState("");

  // ================= HANDLERS =================
  const handlechatsubject = (e) => {
    setInputText(e.target.value);
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  // ================= SAVE CHAT =================
  const saveChat = async () => {
    try {
      const payload = {
        accountids: [accId],
        chatsubject: inputText,
        description: [
          {
            message: editorContent,
            fromwhome: "Client", // ✅ consistent casing
            senderid: accountName,
            isRead: false,
          },
        ],
        active: true,
      };

      await chatAPI.createChatAdmin(payload);

      toast.success("New Chat created successfully");

      // Reset
      setInputText("");
      setEditorContent("");

      close();
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to create new chat. Please try again.");
    }
  };

  // ================= DRAWER WIDTH =================
  const getDrawerWidth = () => {
    if (isMobile) return "100vw";
    if (isTablet) return "70vw";
    return "40vw";
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={close}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          width: getDrawerWidth(),
          backgroundColor: "background.paper",
        },
      }}
    >
      <Stack sx={{ width: "100%", height: "100%", overflow: "auto" }}>
        {/* HEADER */}
        <Stack direction="row" sx={{ p: 2, pb: 0 }}>
          <Stack
            direction="row"
            sx={{
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1.5,
            }}
          >
            <Typography variant="h6">New Chat</Typography>

            <MenuButton onClick={close}>
              <CloseIcon />
            </MenuButton>
          </Stack>
        </Stack>

        {/* BODY */}
        <Box sx={{ p: isMobile ? 2 : 3, flex: 1 }}>
          {/* SUBJECT */}
          <Stack>
            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
              Subject
            </Typography>

            <TextField
              size="small"
              multiline
              fullWidth
              placeholder="Subject"
              value={inputText}
              onChange={handlechatsubject}
            />
          </Stack>

          {/* EDITOR */}
          <Stack sx={{ mt: 3 }}>
            <Editor onChange={handleEditorChange} value={editorContent} />
          </Stack>

          {/* ACTIONS */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 3,
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <Button
              onClick={saveChat}
              fullWidth={isMobile}
              sx={{
                backgroundColor: "text.menu",
                color: "primary.contrastText",
                "&:hover": {
                  backgroundColor: "menu.dark",
                },
              }}
            >
              Create chat
            </Button>

            <Button
              onClick={close}
              variant="outlined"
              fullWidth={isMobile}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Stack>
    </Drawer>
  );
}

// ✅ Updated PropTypes (removed loginuserid)
NewChat.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func.isRequired,
  accId: PropTypes.string.isRequired,
  accountName: PropTypes.string,
};

export default NewChat;