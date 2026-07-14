


import React, { useState, useCallback,useEffect } from "react";
import { motion } from "framer-motion";
import {
  UploadCloud,
  MessageCircle,
  Phone,
  MapPin,
  TrendingDown,
  CreditCard,
  Copy,
  Check,
  Link2,
} from "lucide-react";
import { accountsAPI,invoiceAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Editor from "../components/Texteditor";
import { chatAPI } from "../services/api";
import { useToast } from "../hooks/useToast";

const ease = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.26, ease } },
};

const CardShell = ({ children, className = "" }) => (
  <motion.div
    variants={cardVariants}
    whileHover={{ y: -2, boxShadow: "0 4px 24px 0 rgba(0,0,0,0.07)" }}
    transition={{ duration: 0.18 }}
    className={`rounded-xl border border-border bg-card shadow-sm overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

const CardHeader = ({ label, hint }) => (
  <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border bg-muted/40">
    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />

    <p className="text-[13px] font-semibold text-foreground tracking-tight flex-1">
      {label}
    </p>

    {hint && (
      <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
        {hint}
      </kbd>
    )}
  </div>
);

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }, [text]);

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      onClick={copy}
      title="Copy"
      className="ml-auto p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
    >
      {copied ? (
        <Check size={12} className="text-green-500" />
      ) : (
        <Copy size={12} />
      )}
    </motion.button>
  );
};

const QuickLinks = ({ accountId, accountName }) => {
  const navigate = useNavigate();
  const toast = useToast();

  const [open, setOpen] = useState(false);
const [creatingChat, setCreatingChat] = useState(false);
  const [inputText, setInputText] = useState("");
  const [editorContent, setEditorContent] = useState("");

  const handlechatsubject = (e) => {
    setInputText(e.target.value);
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };
const [account, setAccount] = useState(null);
const [accountLoading, setAccountLoading] = useState(false);

const fetchAccount = async () => {
  try {
    setAccountLoading(true);

    const res = await accountsAPI.getAccountById(accountId);
    setAccount(res.data);
  } catch (err) {
    console.error("Failed to fetch account:", err);
  } finally {
    setAccountLoading(false);
  }
};

useEffect(() => {
  if (accountId) {
    fetchAccount();
  }
}, [accountId]);
const [accountInvoicesData, setAccountInvoicesData] = useState([]);
const [invoiceLoading, setInvoiceLoading] = useState(false);

const fetchInvoices = async () => {
  try {
    setInvoiceLoading(true);

    const res = await invoiceAPI.getInvoiceListByAccountId(accountId);

    // const updatedInvoices = await Promise.all(
    //   (res.data?.invoice || []).map(async (invoice) => {
    //     const overdue = isInvoiceOverdue(invoice);

    //     if (overdue && invoice.invoiceStatus !== "Overdue") {
    //       try {
    //         await invoiceAPI.updateInvoiceStatus(invoice.invoicenumber, {
    //           invoiceStatus: "Overdue",
    //         });

    //         return {
    //           ...invoice,
    //           invoiceStatus: "Overdue",
    //         };
    //       } catch (err) {
    //         console.error("Failed to update invoice status:", err);
    //         return invoice;
    //       }
    //     }

    //     return invoice;
    //   })
    // );

    setAccountInvoicesData(res.data?.invoice);
  } catch (err) {
    console.error("Failed to fetch invoices:", err);
  } finally {
    setInvoiceLoading(false);
  }
};

useEffect(() => {
  if (accountId) {
    fetchInvoices();
  }
}, [accountId]);
  
const invoiceSummary = accountInvoicesData.reduce(
  (acc, invoice) => {
    const paid = Number(invoice.paidAmount || 0);
    const balance = Number(invoice.balanceDueAmount || 0);

    acc.totalInvoices += 1;
    acc.totalPaid += paid;
    acc.totalUnpaid += balance;
    acc.netDue += balance;

    return acc;
  },
  {
    totalInvoices: 0,
    totalPaid: 0,
    totalUnpaid: 0,
    netDue: 0,
  }
);
 const saveChat = async () => {
  try {
    setCreatingChat(true);

    const payload = {
      accountids: [accountId],
      chatsubject: inputText,
      description: [
        {
          message: editorContent,
          fromwhome: "Client",
          senderid: accountName,
          isRead: false,
        },
      ],
      active: true,
    };

    await chatAPI.createChatAdmin(payload);

    toast.success("New Chat created successfully");

    setInputText("");
    setEditorContent("");

    setOpen(false);
    navigate("/chatstasks")
  } catch (error) {
    console.error("Error creating chat:", error);

    toast.error("Failed to create new chat");
  } finally {
    setCreatingChat(false);
  }
};

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 font-sans"
    >
      {/* QUICK LINKS */}
      <CardShell>
        <CardHeader label="Quick Links" hint="⌘⇧Q" />

        <div className="grid grid-cols-2 gap-1 p-3">
          {/* DOCUMENTS */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/document")}
            className="group flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20 transition-colors">
              <UploadCloud size={15} strokeWidth={1.8} />
            </span>

            Documents
          </motion.button>

          {/* NEW CHAT */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setOpen(true)}
            className="group flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
              <MessageCircle size={15} strokeWidth={1.8} />
            </span>

            New Chat
          </motion.button>

          {/* BILLING */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/billing")}
            className="group flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-green-500/10 text-green-600 group-hover:bg-green-500/20 transition-colors">
              <CreditCard size={15} strokeWidth={1.8} />
            </span>

            Billing
          </motion.button>

          {/* TASKS */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/chatstasks")}
            className="group flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-violet-500/10 text-violet-500 group-hover:bg-violet-500/20 transition-colors">
              <Link2 size={15} strokeWidth={1.8} />
            </span>

            Tasks
          </motion.button>
        </div>
      </CardShell>

      {/* BALANCE */}
      <CardShell>
        <CardHeader label="Balance" />

        <div className="grid grid-cols-2 divide-x divide-border">
          <div className="flex flex-col items-center gap-2 px-4 py-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/10">
              <CreditCard
                size={16}
                className="text-green-600 dark:text-green-400"
                strokeWidth={1.8}
              />
            </div>

            <p className="text-[11px] font-medium text-muted-foreground text-center">
              Credits Available
            </p>

           <p className="text-lg font-bold text-green-600 dark:text-green-400">
           ${Number(account?.creaditAval || 0).toFixed(2)}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 px-4 py-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/10">
              <TrendingDown
                size={16}
                className="text-orange-500"
                strokeWidth={1.8}
              />
            </div>

            <p className="text-[11px] font-medium text-muted-foreground text-center">
              Outstanding
            </p>

            <p className="text-lg font-bold text-orange-500">
             ${invoiceSummary.netDue.toFixed(2)}
            </p>
          </div>
        </div>
      </CardShell>

      {/* CONTACT INFO */}
      <CardShell>
        <CardHeader label="Contact Info" />

        <div className="divide-y divide-border">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <Phone
                size={14}
                className="text-primary"
                strokeWidth={1.8}
              />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-muted-foreground">
                Phone
              </p>

              <p className="text-[13px] font-semibold text-foreground">
                (925) 800-3561
              </p>
            </div>

            <CopyButton text="(925) 800-3561" />
          </div>

          <div className="flex items-start gap-3 px-5 py-3.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-500/10 mt-0.5">
              <MapPin
                size={14}
                className="text-amber-500"
                strokeWidth={1.8}
              />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-muted-foreground">
                Address
              </p>

              <p className="text-[13px] font-semibold text-foreground leading-snug">
                3015 Hopyard Rd, Ste M,
                <br />
                Pleasanton, CA 94588
              </p>
            </div>

            <CopyButton text="3015 Hopyard Rd, Ste M, Pleasanton, CA 94588" />
          </div>
        </div>
      </CardShell>

      {/* NEW CHAT MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* BACKDROP */}
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* MODAL */}
          <div
            className="
              relative z-10
              w-[95%] sm:w-[700px]
              max-h-[90vh]
              overflow-hidden
              rounded-2xl
              border border-border
              bg-card text-card-foreground
              shadow-2xl
              flex flex-col
            "
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  New Chat
                </h2>

                <p className="text-sm text-muted-foreground">
                  Start a conversation with your client
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="
                  p-2 rounded-md
                  text-muted-foreground
                  hover:bg-muted
                  hover:text-foreground
                  transition
                "
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* SUBJECT */}
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Subject
                </label>

                <textarea
                  rows={3}
                  value={inputText}
                  onChange={handlechatsubject}
                  placeholder="Brief summary of the chat..."
                  className="
                    w-full rounded-lg
                    border border-border
                    bg-background
                    px-3 py-2 text-sm
                    text-foreground
                    placeholder:text-muted-foreground
                    focus:outline-none
                    focus:ring-2 focus:ring-primary/30
                    resize-none
                  "
                />
              </div>

              {/* MESSAGE */}
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Message
                </label>

                <div className="rounded-lg border border-border bg-background p-2">
                  <Editor
                    onChange={handleEditorChange}
                    value={editorContent}
                  />
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="border-t border-border px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="
                  text-sm font-medium
                  text-muted-foreground
                  hover:text-foreground
                "
              >
                Cancel
              </button>

             <button
  onClick={saveChat}
  disabled={creatingChat}
  className="
    rounded-lg
    bg-primary
    text-primary-foreground
    px-4 py-2
    text-sm font-medium
    transition
    disabled:opacity-50
    disabled:cursor-not-allowed
    hover:opacity-90
  "
>
  {creatingChat ? "Creating..." : "Create Chat"}
</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default QuickLinks;