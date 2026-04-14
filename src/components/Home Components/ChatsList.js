import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Stack, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { chatAPI } from "../../services/api"; // ✅ use your API

const ChatsList = ({ accountId }) => {
  const [chats, setChats] = useState([]);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnreadChats = async () => {
      try {
        const response = await chatAPI.getUnreadMessages(accountId, "Admin");
        setChats(response.data.chats || []);
      } catch (error) {
        console.error("Error fetching unread chats:", error);
      }
    };

    if (accountId) {
      fetchUnreadChats();
    }
  }, [accountId]);

  const stripHtmlAndLimit = (html, wordLimit) => {
    if (!html) return "";
    const plainText = html.replace(/<[^>]+>/g, " ");
    const words = plainText.trim().split(/\s+/);
    if (words.length <= wordLimit) return plainText.trim();
    return words.slice(0, wordLimit).join(" ") + " ...";
  };

  const handleShowChat = async (chatId) => {
    try {
      // ✅ mark as read using API
      await chatAPI.markAllAsRead(chatId, accountId, "Admin");

      navigate(`/client/updatechat/${chatId}`);
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  return (
    <>
      {chats.length > 0 && (
        <Box>
          <Stack
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Chats & Tasks ({chats.length})
            </Typography>
          </Stack>

          <Box mt={2}>
            {chats.map((chat) => {
              const mostRecentMessage =
                chat.messages?.[chat.messages.length - 1] || {};

              const sender = mostRecentMessage.sender || "Unknown Sender";
              const message = mostRecentMessage.message || "";

              return (
                <Stack key={chat.chatId} mb={1.5}>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      boxShadow: 1,
                      cursor: "pointer",
                      position: "relative",
                    }}
                    onClick={() => handleShowChat(chat.chatId)}
                  >
                    {chat.unreadCount > 1 && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: theme.palette.success.main,
                          color: "white",
                          borderRadius: "50%",
                          width: 20,
                          height: 20,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.7rem",
                        }}
                      >
                        {chat.unreadCount}
                      </Box>
                    )}

                    <Typography variant="subtitle2" fontWeight="bold">
                      {chat.chatSubject}
                    </Typography>

                    <Stack direction="row" spacing={1}>
                      <SendIcon
                        fontSize="small"
                        sx={{ color: theme.palette.success.main }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {sender} : {stripHtmlAndLimit(message, 15)}
                      </Typography>
                    </Stack>
                  </Paper>
                </Stack>
              );
            })}
          </Box>
        </Box>
      )}
    </>
  );
};

export default ChatsList;