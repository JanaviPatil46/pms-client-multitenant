// import {
//   Button,
//   Typography,
//   Divider,
//   Paper,
// } from "@mui/material";
// import Box from "@mui/material/Box";
// import TelegramIcon from "@mui/icons-material/Telegram";
// import Grid from "@mui/material/Grid";
// import { useState, useEffect, useCallback } from "react";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import { useTheme } from "@mui/material/styles";
// import { useNavigate } from "react-router-dom";
// import NewChat from "./NewChat";

// // ✅ API imports
// import { chatAPI, accountsAPI } from "../../services/api";

// const ChatsTasks = () => {
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
//   const navigate = useNavigate();

//   const [accountId] = useState(sessionStorage.getItem("accountId"));
//   const [chatList, setChatList] = useState([]);
//   const [accountName, setAccountName] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [open, setOpen] = useState(false);

//   // ================= ACCOUNT DETAILS =================
//   const fetchAccountDetails = useCallback(async () => {
//     try {
//       const res = await accountsAPI.getAccountById(accountId);
//       setAccountName(res.data.accountName);
//     } catch (error) {
//       console.error("Error fetching account details:", error);
//     }
//   }, [accountId]);

//   // ================= CHAT LIST =================
//   const fetchChats = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await chatAPI.getChatsByAccountAndStatus(accountId, true);
//       setChatList(res.data.chataccountwise || []);
//     } catch (error) {
//       console.error("Error fetching chats:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [accountId]);

//   useEffect(() => {
//     if (accountId) {
//       fetchAccountDetails();
//       fetchChats();
//     }
//   }, [accountId, fetchAccountDetails, fetchChats]);

//   // ================= UNREAD COUNT =================
//   const countUnreadAdminMessages = (chat) =>
//     (chat.description || []).filter(
//       (msg) => !msg.isRead && msg.fromwhome === "Admin"
//     ).length;

//   // ================= OPEN CHAT =================
//   const handleShowChat = async (chatId) => {
//     try {
//       await chatAPI.markAllAsRead(chatId, accountId, "Admin");
//       navigate(`/updatechat/${chatId}`);
//     } catch (error) {
//       console.error("Error marking message as read:", error);
//     }
//   };

//   // ================= MODAL =================
//   const handleOpen = () => setOpen(true);

//   const handleClose = () => {
//     setOpen(false);
//     fetchChats();
//   };

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         maxWidth: { sm: "100%", md: "1700px" },
//         flexGrow: 1,
//         height: "90vh",
//         p: 1,
//       }}
//     >
//       {/* HEADER */}
//       <Grid
//         container
//         alignItems="center"
//         justifyContent="space-between"
//         spacing={2}
//       >
//         <Grid item>
//           <Typography variant="h4" sx={{ fontWeight: 600 }}>
//             Chats & Tasks
//           </Typography>
//         </Grid>

//         <Grid item>
//           <Button
//             size="small"
//             color="primary"
//             fullWidth={isSmallScreen}
//             onClick={handleOpen}
//             sx={{
//               backgroundColor: "text.menu",
//               color: "primary.contrastText",
//               "&:hover": {
//                 backgroundColor: "menu.dark",
//                 boxShadow: 1,
//               },
//             }}
//           >
//             New Chat
//           </Button>
//         </Grid>
//       </Grid>

//       {/* CONTENT */}
//       <Box mt={2}>
//         {loading && (
//           <Typography variant="body2">Loading chats...</Typography>
//         )}

//         {!loading && chatList.length === 0 && (
//           <Typography variant="body2">No chats found</Typography>
//         )}

//         {!loading &&
//           chatList.map((chat) => {
//             const unreadCount = countUnreadAdminMessages(chat);

//             const formattedTime = new Date(chat.updatedAt)
//               .toLocaleDateString("en-US", {
//                 month: "short",
//                 day: "2-digit",
//               })
//               .replace(",", "");

//             const messages = chat.description || [];
//             const latest = messages[messages.length - 1];

//             const cleanMessage =
//               latest?.message?.replace(/<[^>]+>/g, "") || "";

//             const sender =
//               latest?.fromwhome === "Client"
//                 ? "You"
//                 : latest?.senderid || "";

//             return (
//               <Box key={chat._id}>
//                 <Paper
//                   sx={{ p: 1, cursor: "pointer" }}
//                   onClick={() => handleShowChat(chat._id)}
//                 >
//                   {/* HEADER */}
//                   <Box
//                     display="flex"
//                     justifyContent="space-between"
//                     alignItems="center"
//                     mb={1}
//                   >
//                     <Box display="flex" alignItems="center" gap={1.5}>
//                       <TelegramIcon
//                         sx={{ color: theme.palette.text.menu }}
//                         fontSize="small"
//                       />
//                       <Typography variant="caption" color="text.secondary">
//                         Chat with {chat.accountid?.accountName}
//                       </Typography>
//                     </Box>

//                     {unreadCount > 0 && (
//                       <Box
//                         sx={{
//                           backgroundColor: theme.palette.success.main,
//                           color: "white",
//                           borderRadius: "50%",
//                           width: 20,
//                           height: 20,
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           fontSize: "0.75rem",
//                         }}
//                       >
//                         {unreadCount}
//                       </Box>
//                     )}
//                   </Box>

//                   {/* SUBJECT */}
//                   <Typography variant="subtitle2" fontWeight="600">
//                     {chat.chatsubject}
//                   </Typography>

//                   {/* LAST MESSAGE */}
//                   <Typography variant="caption">
//                     {latest
//                       ? `${sender}: ${
//                           cleanMessage.length > 35
//                             ? cleanMessage.slice(0, 35) + "..."
//                             : cleanMessage
//                         }`
//                       : "No messages yet"}
//                   </Typography>

//                   {/* TIME */}
//                   <Box textAlign="right">
//                     <Typography variant="caption" color="text.secondary">
//                       {formattedTime}
//                     </Typography>
//                   </Box>
//                 </Paper>

//                 <Divider sx={{ my: 1 }} />
//               </Box>
//             );
//           })}
//       </Box>

//       {/* NEW CHAT MODAL */}
//       <NewChat
//         open={open}
//         close={handleClose}
//         accId={accountId}
//         accountName={accountName}
//       />
//     </Box>
//   );
// };

// export default ChatsTasks;


import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import NewChat from "./NewChat";

// ✅ API imports
import { chatAPI, accountsAPI } from "../../services/api";

const ChatsTasks = () => {
  const navigate = useNavigate();
  const [accountId] = useState(sessionStorage.getItem("accountId"));
  const [chatList, setChatList] = useState([]);
  const [accountName, setAccountName] = useState("");
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  // ================= ACCOUNT DETAILS =================
  const fetchAccountDetails = useCallback(async () => {
    try {
      const res = await accountsAPI.getAccountById(accountId);
      setAccountName(res.data.accountName);
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  }, [accountId]);

  // ================= CHAT LIST =================
  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      // const res = await chatAPI.getChatsByAccountAndStatus(accountId, true);
       const res = await chatAPI.getChatsByAccountAndStatus(
        accountId,
        true,"client"
      );
      setChatList(res.data.chataccountwise || []);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    if (accountId) {
      fetchAccountDetails();
      fetchChats();
    }
  }, [accountId, fetchAccountDetails, fetchChats]);

  // ================= UNREAD COUNT =================
  const countUnreadAdminMessages = (chat) =>
    (chat.description || []).filter(
      (msg) => !msg.isRead && msg.fromwhome === "Admin"
    ).length;

  // ================= OPEN CHAT =================
  const handleShowChat = async (chatId) => {
    try {
      await chatAPI.markAllAsRead(chatId, accountId, "Admin");
      navigate(`/updatechat/${chatId}`);
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  // ================= MODAL =================
  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    fetchChats();
  };
return (
  <div className="w-full max-w-[1700px] flex-1 min-h-screen bg-background p-4 sm:p-6">

    {/* HEADER */}
    <div className="flex items-center justify-between gap-4 mb-4">

      <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
        Chats & Tasks
      </h1>

      <button
        onClick={handleOpen}
        className="
          inline-flex items-center justify-center
          rounded-lg px-4 py-2 text-sm font-medium
          bg-accent text-accent-foreground
          hover:opacity-90 transition
          shadow-sm
        "
      >
        New Chat
      </button>
    </div>

    {/* CARD WRAPPER */}
    <div className="
      rounded-xl border border-border
      bg-card shadow-sm overflow-hidden
    ">

      {/* LOADING */}
      {loading && (
        <p className="p-4 text-sm text-muted-foreground">
          Loading chats...
        </p>
      )}

      {/* EMPTY */}
      {!loading && chatList.length === 0 && (
        <p className="p-4 text-sm text-muted-foreground">
          No chats found
        </p>
      )}

      {/* LIST */}
      {!loading &&
        chatList.map((chat) => {
          const unreadCount = countUnreadAdminMessages(chat);

          const formattedTime = new Date(chat.updatedAt)
            .toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
            })
            .replace(",", "");

          const messages = chat.description || [];
          const latest = messages[messages.length - 1];

          const cleanMessage =
            latest?.message?.replace(/<[^>]+>/g, "") || "";

          const sender =
            latest?.fromwhome === "client"
              ? "You"
              : latest?.senderid || "";

          return (
            <div
              key={chat._id}
              onClick={() => handleShowChat(chat._id)}
              className="
                px-5 py-4 cursor-pointer
                hover:bg-muted/50
                transition
                border-b border-border last:border-none
              "
            >

              {/* TOP ROW */}
              <div className="flex justify-between items-start mb-1">

                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>

                  <span className="text-xs text-muted-foreground">
                    Chat with {chat.accountid?.accountName}
                  </span>
                </div>

                {/* TIME */}
                <span className="text-xs text-muted-foreground">
                  {formattedTime}
                </span>
              </div>

              {/* SUBJECT + UNREAD */}
              <div className="flex items-center justify-between gap-2">

                <p className="text-sm font-semibold text-foreground">
                  {chat.chatsubject}
                </p>

                {unreadCount > 0 && (
                  <div className="
                    bg-accent text-accent-foreground
                    rounded-full min-w-[20px] h-5 px-1.5
                    flex items-center justify-center text-xs font-medium
                  ">
                    {unreadCount}
                  </div>
                )}
              </div>

              {/* LAST MESSAGE */}
              <p className="text-xs text-muted-foreground mt-1">
                {latest
                  ? `${sender}: ${
                      cleanMessage.length > 40
                        ? cleanMessage.slice(0, 40) + "..."
                        : cleanMessage
                    }`
                  : "No messages yet"}
              </p>

            </div>
          );
        })}
    </div>

    {/* MODAL */}
    <NewChat
      open={open}
      close={handleClose}
      accId={accountId}
      accountName={accountName}
    />
  </div>
);
  
};

export default ChatsTasks;