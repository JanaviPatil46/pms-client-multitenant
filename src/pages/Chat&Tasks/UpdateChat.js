import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
// import { toast } from "material-react-toastify";
import Editor from "../../components/Texteditor";
import { accountsAPI, chatAPI } from "../../services/api";
import { Send, MoreVertical, X, Square, CheckSquare, Loader2 } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { Check, CheckCheck } from "lucide-react";
const UpdateChat = () => {
  const [accId] = useState(sessionStorage.getItem("accountId"));
  const toast = useToast()
  // Edit state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState("");

  // ✅ ACCOUNT API
  const fetchAccountDetails = async () => {
    try {
      const res = await accountsAPI.getAccountById(accId);
      setAccountName(res.data.accountName);
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };

  useEffect(() => {
    if (accId) {
      fetchAccountDetails();
    }
  }, [accId]);

  const messageRefs = useRef({});
  const [highlightedId, setHighlightedId] = useState(null);
  const { _id } = useParams();

  const [time, setTime] = useState();
  const [chatsubject, setChatSubject] = useState("");
  const [accountName, setAccountName] = useState("");
  const [chatDescriptions, setChatDescriptions] = useState([]);
  const [editorContent, setEditorContent] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const messagesEndRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const menuRef = useRef(null);

  // ✅ CHAT API
  const getsChatDetails = async () => {
    try {
      const res = await chatAPI.getChatById(_id);
      const data = res.data;
      console.log("Chat details:", data);
      setChatSubject(data.chat.chatsubject);
      setTime(data.chat.updatedAt);
      setAccountName(data.chat.accountid.accountName);
      setChatDescriptions(data.chat.description || []);
      setTasks(data.chat.clienttasks.flat());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getsChatDetails();
  }, []);

  // Check if message is within 10 minutes
  const canEditMessage = (messageTime) => {
    if (!messageTime) return false;
    
    const messageTimestamp = new Date(messageTime).getTime();
    const currentTime = new Date().getTime();
    const tenMinutes = 10 * 60 * 1000;
    
    return (currentTime - messageTimestamp) <= tenMinutes;
  };

  // Edit message function for client
  const handleEditMessage = (message) => {
    if (!canEditMessage(message.time)) {
      toast.error("Cannot edit message after 10 minutes");
      return;
    }
    
    setEditingMessage(message);
    setEditContent(message.message);
    setEditDialogOpen(true);
    setAnchorEl(null);
  };

  // ✅ EDIT MESSAGE
  const handleSaveEdit = async () => {
    if (!editContent.trim() || !editingMessage) return;

    try {
      await chatAPI.updateMessage({
        chatId: _id,
        messageId: editingMessage._id,
        newMessage: editContent,
      });

      toast.success("Message updated successfully");

      setEditDialogOpen(false);
      setEditingMessage(null);
      setEditContent("");

      getsChatDetails();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update message");
    }
  };

  const handleCancelEdit = () => {
    setEditDialogOpen(false);
    setEditingMessage(null);
    setEditContent("");
  };

  // ✅ DELETE MESSAGE
  const handleDeleteMessage = async (messageToDelete) => {
    try {
      await chatAPI.deleteMessage({
        chatId: _id,
        messageId: messageToDelete._id,
      });

      toast.success("Message deleted successfully");
      getsChatDetails();
      setAnchorEl(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete message");
    }
  };

  const handleTaskToggle = (id) => {
    setTasks((prevTasks) => {
      const updated = prevTasks.map((task) =>
        task.id === id ? { ...task, checked: !task.checked } : task
      );
      updateClientTask(updated);
      return updated;
    });
  };

  // ✅ UPDATE TASK
  const updateClientTask = async (updatedTasks) => {
    try {
      await chatAPI.updateTaskCheckedStatus({
        chatId: _id,
        taskUpdates: updatedTasks.map((task) => ({
          id: task.id,
          text: task.text,
          checked: task.checked,
        })),
      });

      toast.success("Task updated");

      const allChecked = updatedTasks.every((t) => t.checked);

      if (allChecked) {
        const taskMessages =
          `completed client tasks <br>` +
          updatedTasks.map((t) => `• <s>${t.text}</s>`).join("<br>");
        updateChatDescription(taskMessages);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${day} ${month} ${formattedHours}:${formattedMinutes} ${period}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatDescriptions]);

  const handleMenuClick = (event, message) => {
    setAnchorEl(event.currentTarget);
    setSelectedMessage(message);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMessage(null);
  };

  // ✅ SEND MESSAGE
  const updateChatDescription = async (message = "") => {
    const contentToSend = message.trim() || editorContent.trim();
    if (!contentToSend) return;

    setIsSending(true);

    const newDescription = {
      message: contentToSend,
      fromwhome: "client",
      senderid: accountName,
    };

    if (replyTo) {
      newDescription.replyTo = replyTo._id;
    }

    try {
      await chatAPI.sendMessageFromClient(_id, {
        newDescriptions: [newDescription],
      });

      setChatDescriptions((prev) => [
        ...prev,
        { ...newDescription, time: new Date().toISOString() },
      ]);

      setEditorContent("");
      setReplyTo(null);

      toast.success("Message sent");

      getsChatDetails();
    } catch (error) {
      toast.error("Send failed");
    } finally {
      setIsSending(false);
    }
  };

  // Handle click outside menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && anchorEl) {
        handleMenuClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [anchorEl]);

 const MessageStatus = ({ isRead }) => {
  return isRead ? (
    <CheckCheck size={13} className="text-blue-500" />
  ) : (
    <Check size={13} className="text-muted-foreground" />
  );
};
const getDateLabel = (date) => {
  const msgDate = new Date(date);

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (msgDate.toDateString() === today.toDateString()) {
    return "Today";
  }

  if (msgDate.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return msgDate.toLocaleDateString();
};

const groupedMessages = [];
let lastDate = "";

chatDescriptions.forEach((msg) => {
  const currentDate = getDateLabel(msg.time);

  if (currentDate !== lastDate) {
    groupedMessages.push({
      type: "date",
      label: currentDate,
    });

    lastDate = currentDate;
  }

  groupedMessages.push({
    type: "message",
    data: msg,
  });
});
return (
  <div className="w-full max-w-[1700px] flex-1 h-[90vh] p-2 flex flex-col md:flex-row gap-4 overflow-hidden bg-background">

    {/* Edit message modal */}
    {editDialogOpen && (
      <>
        <div
          className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm"
          onClick={handleCancelEdit}
        />

        <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-card text-card-foreground rounded-xl border border-border shadow-lg flex flex-col">
          
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Edit Message</h3>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted transition"
            >
              <X size={15} />
            </button>
          </div>

          <div className="p-5 min-h-[200px]">
            <Editor onChange={setEditContent} value={editContent} />
          </div>

          <div className="flex gap-2 justify-end px-5 py-3.5 border-t border-border bg-muted/20">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveEdit}
              disabled={!editContent.trim()}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </div>
      </>
    )}

    {/* Message context menu */}
    {anchorEl && (
      <div
        ref={menuRef}
        style={{
          position: "fixed",
          top: anchorEl.getBoundingClientRect().bottom + 4,
          right: window.innerWidth - anchorEl.getBoundingClientRect().right,
          zIndex: 1300,
          minWidth: "140px",
        }}
        className="rounded-lg border border-border bg-popover shadow-md p-1"
      >
        {[
          { label: "Reply", action: () => { setReplyTo(selectedMessage); handleMenuClose(); } },
          ...(selectedMessage?.fromwhome?.toLowerCase() === "client" && canEditMessage(selectedMessage.time)
            ? [
                { label: "Edit", action: () => handleEditMessage(selectedMessage) },
                { label: "Delete", action: () => { handleDeleteMessage(selectedMessage); }, danger: true },
              ]
            : []),
        ].map(({ label, action, danger }) => (
          <button
            key={label}
            type="button"
            onClick={action}
            className={`w-full flex items-center px-3 py-2 text-sm text-left rounded-md transition
              ${danger
                ? "text-destructive hover:bg-destructive/10"
                : "text-foreground hover:bg-muted"}
            `}
          >
            {label}
          </button>
        ))}
      </div>
    )}

    {/* Left panel — Chat */}
    <div className="flex flex-col flex-1 min-h-0 rounded-xl border border-border bg-card shadow-sm overflow-hidden">

      {/* Chat header */}
      <div className="shrink-0 px-4 py-3 border-b border-border bg-muted/30">
        <h2 className="text-base font-semibold text-foreground truncate">
          {chatsubject || "Chat"}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">

        {/* {Array.isArray(chatDescriptions) && chatDescriptions.length > 0 ? (
          chatDescriptions.map((desc, index) => {
            const isClient = desc.fromwhome?.toLowerCase() === "client";
            const isAdmin = desc.fromwhome?.toLowerCase() === "admin";
            const messageTime = desc.time ? formatDate(desc.time) : "Just now";
            const isEditable = isClient && canEditMessage(desc.time);
            const isHighlighted = desc._id === highlightedId;

            let senderDisplayName = "";
            if (isClient) senderDisplayName = "You";
            else if (isAdmin && desc.senderid) senderDisplayName = desc.senderid;

            return (
              <div
                key={desc._id || index}
                ref={(el) => { if (desc._id) messageRefs.current[desc._id] = el; }}
                className={`flex ${isClient ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`relative max-w-[75%] rounded-xl px-4 py-3 shadow-sm border transition
                    ${isHighlighted
                      ? "bg-accent/20 border-accent/40"
                      : isClient
                        ? "bg-primary/10 border-primary/20"
                        : "bg-muted border-border"}
                  `}
                >

                 
                  {desc.replyTo && (() => {
                    const repliedMsg = chatDescriptions.find((msg) => msg._id === desc.replyTo);
                    if (!repliedMsg) return null;
                    return (
                      <div
                        className="mb-2 border-l-2 border-accent pl-2 bg-muted/40 rounded cursor-pointer"
                        onClick={() => {
                          const el = messageRefs.current[desc.replyTo];
                          if (el) {
                            el.scrollIntoView({ behavior: "smooth", block: "center" });
                            setHighlightedId(desc.replyTo);
                            setTimeout(() => setHighlightedId(null), 2000);
                          }
                        }}
                      >
                        <p className="text-[11px] font-bold text-accent">
                          {repliedMsg.fromwhome === "client" ? "You" : repliedMsg.senderid || "Admin"}
                        </p>
                        <p
                          className="text-xs text-muted-foreground italic line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: repliedMsg.message?.length > 100
                              ? repliedMsg.message.slice(0, 100) + "..."
                              : repliedMsg.message,
                          }}
                        />
                      </div>
                    );
                  })()}

                 
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-foreground">{senderDisplayName}</span>
                    <button
                      type="button"
                      onClick={(e) => handleMenuClick(e, desc)}
                      className="text-muted-foreground hover:text-foreground transition"
                    >
                      <MoreVertical size={13} />
                    </button>
                  </div>

              
                  <div
                    className="text-sm text-foreground prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: typeof desc.message === "string" ? desc.message : "No message available",
                    }}
                  />

                
                  <div className="flex items-center justify-end gap-1 mt-1.5">
  <span className="text-[10px] text-muted-foreground">
    {messageTime}
  </span>

  {isClient && (
    <MessageStatus isRead={desc.isRead} />
  )}
</div>

{isClient && !isEditable && desc.time && (
  <p className="text-[10px] italic opacity-60 text-right">
    Edit expired
  </p>
)}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Send size={28} className="mb-2 opacity-20" />
            <p className="text-sm">No messages yet</p>
          </div>
        )} */}
{Array.isArray(groupedMessages) && groupedMessages.length > 0 ? (
  groupedMessages.map((item, index) => {
    if (item.type === "date") {
      return (
        <div
          key={`date-${index}`}
          className="flex justify-center my-4"
        >
          <div className="bg-muted px-3 py-1 rounded-full text-xs font-medium shadow-sm">
            {item.label}
          </div>
        </div>
      );
    }

    const desc = item.data;

    const isClient =
      desc.fromwhome?.toLowerCase() === "client";

    const isAdmin =
      desc.fromwhome?.toLowerCase() === "admin";

    const messageTime = desc.time
      ? formatDate(desc.time)
      : "Just now";

    const isEditable =
      isClient && canEditMessage(desc.time);

    const isHighlighted =
      desc._id === highlightedId;

    let senderDisplayName = "";

    if (isClient) {
      senderDisplayName = "You";
    } else if (isAdmin && desc.senderid) {
      senderDisplayName = desc.senderid;
    }

    return (
      <div
        key={desc._id || index}
        ref={(el) => {
          if (desc._id) {
            messageRefs.current[desc._id] = el;
          }
        }}
        className={`flex ${
          isClient
            ? "justify-end"
            : "justify-start"
        }`}
      >
        <div
          className={`relative max-w-[75%] rounded-2xl px-4 py-3 shadow-sm border transition-all

          ${
            isHighlighted
              ? "ring-2 ring-yellow-400"
              : isClient
              ? "bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-700"
              : "bg-card border-border"
          }
        `}
        >
          {/* Reply Preview */}
          {desc.replyTo &&
            (() => {
              const repliedMsg =
                chatDescriptions.find(
                  (msg) =>
                    msg._id === desc.replyTo
                );

              if (!repliedMsg) return null;

              return (
                <div
                  className="mb-2 border-l-2 border-accent pl-2 bg-muted/40 rounded cursor-pointer"
                  onClick={() => {
                    const el =
                      messageRefs.current[
                        desc.replyTo
                      ];

                    if (el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });

                      setHighlightedId(
                        desc.replyTo
                      );

                      setTimeout(
                        () =>
                          setHighlightedId(
                            null
                          ),
                        2000
                      );
                    }
                  }}
                >
                  <p className="text-[11px] font-bold text-accent">
                    {repliedMsg.fromwhome ===
                    "client"
                      ? "You"
                      : repliedMsg.senderid ||
                        "Admin"}
                  </p>

                  <p
                    className="text-xs text-muted-foreground italic line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html:
                        repliedMsg.message
                          ?.length > 100
                          ? repliedMsg.message.slice(
                              0,
                              100
                            ) + "..."
                          : repliedMsg.message,
                    }}
                  />
                </div>
              );
            })()}

          {/* Sender */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-semibold">
              {senderDisplayName}
            </span>

            <button
              type="button"
              onClick={(e) =>
                handleMenuClick(e, desc)
              }
              className="text-muted-foreground hover:text-foreground"
            >
              <MoreVertical size={13} />
            </button>
          </div>

          {/* Message */}
          <div
            // className="text-sm prose prose-sm max-w-none"
             className="text-sm leading-relaxed break-words whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html:
                typeof desc.message ===
                "string"
                  ? desc.message
                  : "No message available",
            }}
          />

          {/* Footer */}
          <div className="flex items-center justify-end gap-1 mt-2">
            <span className="text-[10px] text-muted-foreground">
              {messageTime}
            </span>

            {isClient && (
              <MessageStatus
                isRead={desc.isRead}
              />
            )}
          </div>

          {isClient &&
            !isEditable &&
            desc.time && (
              <p className="text-[10px] italic opacity-60 text-right">
                Edit expired
              </p>
            )}
        </div>
      </div>
    );
  })
) : (
  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
    <Send
      size={28}
      className="mb-2 opacity-20"
    />
    <p className="text-sm">
      No messages yet
    </p>
  </div>
)}
        <div ref={messagesEndRef} />
      </div>

     
      {replyTo && (
        <div className="shrink-0 mx-4 mb-2 flex items-start gap-2 rounded-lg border-l-4 border-accent bg-muted/40 px-3 py-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground mb-0.5">
              Replying to {replyTo.fromwhome === "client" ? "You" : replyTo.senderid || "Admin"}
            </p>
            <p
              className="text-xs text-muted-foreground italic truncate"
              dangerouslySetInnerHTML={{
                __html: replyTo.message?.length > 100
                  ? `${replyTo.message.slice(0, 100)}...`
                  : replyTo.message,
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => setReplyTo(null)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        </div>
      )}

      
      <div className="shrink-0 border-t border-border bg-card p-3 flex gap-2 items-end">
        <div className="flex-1">
          <Editor onChange={handleEditorChange} value={editorContent} />
        </div>

        <button
          type="button"
          onClick={() => updateChatDescription()}
          disabled={isSending || !editorContent.trim()}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          {!isSending && <span>Send</span>}
        </button>
      </div>
    </div>

    {/* Tasks */}
    <div className="flex flex-col md:w-[360px] shrink-0 rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      
      <div className="shrink-0 px-4 py-3 border-b border-border bg-muted/30">
        <h2 className="text-base font-semibold text-foreground">Client Tasks</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleTaskToggle(task.id)}
              className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5 hover:bg-muted/40 transition cursor-pointer"
            >
              <button type="button" className="text-accent">
                {task.checked
                  ? <CheckSquare size={18} />
                  : <Square size={18} className="text-muted-foreground" />
                }
              </button>

              <span className={`text-sm flex-1 ${task.checked ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {task.text}
              </span>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <CheckSquare size={28} className="mb-2 opacity-20" />
            <p className="text-sm">No tasks assigned</p>
          </div>
        )}
      </div>
    </div>
  </div>
);
 
};

export default UpdateChat;