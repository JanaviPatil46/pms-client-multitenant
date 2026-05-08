

import { useState } from "react";
import PropTypes from "prop-types";
// import { toast } from "material-react-toastify";

import Editor from "../../components/Texteditor";

// ✅ API
import { chatAPI } from "../../services/api";
import { useToast } from "../../hooks/useToast";

function NewChat({ open, close, accId, accountName }) {
  const [inputText, setInputText] = useState("");
  const [editorContent, setEditorContent] = useState("");
const toast = useToast()
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

  // return (
  //   <>
  //     {/* Backdrop */}
  //     {open && (
  //       <div
  //         className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
  //         onClick={close}
  //       />
  //     )}
      
  //     {/* Drawer */}
  //     <div
  //       className={`fixed top-0 right-0 z-50 h-full bg-background shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
  //         open ? "translate-x-0" : "translate-x-full"
  //       } w-full sm:w-[70vw] md:w-[40vw]`}
  //     >
  //       {/* HEADER */}
  //       <div className="flex items-center justify-between px-4 pt-4 pb-2">
  //         <div className="flex items-center justify-between w-full p-3">
  //           <h2 className="text-lg font-semibold text-foreground">New Chat</h2>

  //           <button
  //             onClick={close}
  //             className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
  //           >
  //             <svg
  //               className="w-5 h-5"
  //               fill="none"
  //               stroke="currentColor"
  //               viewBox="0 0 24 24"
  //             >
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 strokeWidth={2}
  //                 d="M6 18L18 6M6 6l12 12"
  //               />
  //             </svg>
  //           </button>
  //         </div>
  //       </div>

  //       {/* BODY */}
  //       <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-2">
  //         {/* SUBJECT */}
  //         <div className="space-y-1">
  //           <label className="text-sm font-medium text-foreground">
  //             Subject
  //           </label>

  //           <textarea
  //             rows={3}
  //             placeholder="Subject"
  //             value={inputText}
  //             onChange={handlechatsubject}
  //             className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors resize-none"
  //           />
  //         </div>

  //         {/* EDITOR */}
  //         <div className="mt-4">
  //           <Editor onChange={handleEditorChange} value={editorContent} />
  //         </div>

  //         {/* ACTIONS */}
  //         <div className="flex gap-3 mt-4 flex-col sm:flex-row">
  //           <button
  //             onClick={saveChat}
  //              className="
  //         inline-flex items-center justify-center
  //         rounded-lg px-4 py-2 text-sm font-medium
  //         bg-accent text-accent-foreground
  //         hover:opacity-90 transition
  //         shadow-sm
  //       "
             
  //           >
  //             Create chat
  //           </button>

  //           <button
  //             onClick={close}
  //             className="w-full sm:flex-1 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
  //           >
  //             Cancel
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );
 return (
  <>
    {/* BACKDROP */}
    {open && (
      <div
        onClick={close}
        className="
          fixed inset-0 z-40
          bg-background/70 backdrop-blur-sm
          transition-opacity duration-200
        "
      />
    )}

    {/* DRAWER */}
    <div
      className={`
        fixed top-0 right-0 z-50 h-full
        w-full sm:w-[640px] md:w-[520px]
        bg-card text-card-foreground
        border-l border-border
        shadow-lg
        flex flex-col
        transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${open ? "translate-x-0" : "translate-x-full"}
      `}
    >

      {/* HEADER */}
      <div className="
        flex items-center justify-between
        px-6 py-4
        border-b border-border
      ">
        <div className="flex flex-col">
          <h2 className="text-sm font-semibold text-foreground">
            New Chat
          </h2>
          <p className="text-xs text-muted-foreground">
            Start a conversation with your client
          </p>
        </div>

        <button
          onClick={close}
          className="
            p-1.5 rounded-md
            text-muted-foreground
            hover:bg-muted hover:text-foreground
            transition
          "
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

        {/* SUBJECT */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Subject
          </label>

          <textarea
            rows={3}
            value={inputText}
            onChange={handlechatsubject}
            placeholder="Brief summary of the chat..."
            className="
              w-full rounded-md
              border border-border
              bg-background
              px-3 py-2 text-sm
              text-foreground
              placeholder:text-muted-foreground
              focus:outline-none
              focus:ring-2 focus:ring-primary/30
              focus:border-primary
              transition
              resize-none
            "
          />
        </div>

        {/* MESSAGE */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Message
          </label>

          <div className="
            rounded-md border border-border
            bg-background
            px-2 py-2
          ">
            <Editor
              onChange={handleEditorChange}
              value={editorContent}
            />
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="
        border-t border-border
        px-6 py-4
        flex items-center justify-end gap-3
        bg-card
      ">

        <button
          onClick={close}
          className="
            text-sm font-medium
            text-muted-foreground
            hover:text-foreground
            transition
          "
        >
          Cancel
        </button>

        <button
          onClick={saveChat}
          className="
            inline-flex items-center justify-center
            rounded-md px-4 py-2 text-sm font-medium
            bg-accent text-accent-foreground
            hover:opacity-90
            transition
            shadow-sm
          "
        >
          Create Chat
        </button>

      </div>
    </div>
  </>
);
}

// ✅ Updated PropTypes
NewChat.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func.isRequired,
  accId: PropTypes.string.isRequired,
  accountName: PropTypes.string,
};

export default NewChat;