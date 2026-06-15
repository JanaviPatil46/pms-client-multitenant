import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import QuickLinks from "../components/QuickLinks";
import OrganizersList from "../components/Home Components/OrganizersList";
import BillingList from "../components/Home Components/BillingList";
import ChatsList from "../components/Home Components/ChatsList";
import ProposalsList from "../components/Home Components/ProposalsList";
import PendingApprovals from "../components/Home Components/PendingApprovals";
import { accountsAPI } from "../services/api";
import ClientFacingJobs from "../components/Home Components/ClientFacingJobs";
import {
  PageTransition,
  FadeIn,
  HomeItemSkeletonRows,
} from "../components/ui/motion";
// import useShortcuts from "../src/hooks/useShortcuts";
import DocuSealWrapper from "../components/Home Components/DocuSealWrapper";
import DocuSealMultiSigner from "../components/Home Components/DocuSealMultiSigner";
const ease = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease } },
};

const useSectionHighlight = (ref) => {
  const highlight = useCallback(() => {
    if (!ref.current) return;
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    ref.current.classList.add("ring-2", "ring-primary/40", "ring-offset-2");
    setTimeout(() => {
      ref.current?.classList.remove(
        "ring-2",
        "ring-primary/40",
        "ring-offset-2",
      );
    }, 1800);
  }, [ref]);
  return highlight;
};

const Home = () => {
  const [accountId] = useState(sessionStorage.getItem("accountId"));
  const [accountName, setAccountName] = useState("");
  const [adminUserId, setAdminUserId] = useState("");
  const [accountLoading, setAccountLoading] = useState(true);

  const pendingRef = useRef(null);
  const quickLinksRef = useRef(null);

  const focusPending = useSectionHighlight(pendingRef);
  const focusQuickLinks = useSectionHighlight(quickLinksRef);

  // ✅ Fetch account details (original functionality preserved)
  const fetchAccountDetails = useCallback(async () => {
    if (!accountId) {
      setAccountLoading(false);
      return;
    }
    try {
      setAccountLoading(true);
      const res = await accountsAPI.getAccountById(accountId);
      setAccountName(res.data.accountName);
      setAdminUserId(res.data.adminUserId.emailSyncEmail);
      console.log("result", res.data);
    } catch (error) {
      console.error("Error fetching account details:", error);
    } finally {
      setAccountLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    fetchAccountDetails();
  }, [fetchAccountDetails]);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <PageTransition className="w-full flex-1 min-h-screen bg-background">
      <div className="page-container py-6 flex flex-col gap-6">
        {/* Greeting */}
        <FadeIn>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {greeting}
              {accountName ? `, ${accountName}` : ""}
            </h1>

            <p className="text-sm text-muted-foreground">
              Here's what needs your attention today.
            </p>
          </div>
        </FadeIn>
      
        {/* MAIN GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start"
        >
          {/* LEFT COLUMN */}
          <motion.div
            variants={cardVariants}
            ref={pendingRef}
            className="
            rounded-xl border border-border
            bg-card shadow-sm
            overflow-hidden
            hover:shadow-md transition
          "
          >
            <ClientFacingJobs accountId={accountId} />
            {/* Header */}
            <div
              className="
            flex items-center gap-3 px-5 py-3.5
            border-b border-border
            bg-muted/30
          "
            >
              
              {/* Live indicator */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-70" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
  
              <p className="text-sm font-semibold text-foreground">
                Waiting for action
              </p>

              <span className="ml-auto text-xs text-muted-foreground">
                Priority items
              </span>
            </div>

            {/* Content */}
            <div className="divide-y divide-border/60">
              {accountLoading ? (
                <HomeItemSkeletonRows rows={4} />
              ) : (
                <>
                  <OrganizersList accountId={accountId} />
                  <BillingList accountId={accountId} />
                  <ChatsList accountId={accountId} />
                  <ProposalsList accountId={accountId} />
                  <DocuSealWrapper accountId={accountId} />
                  <DocuSealMultiSigner accountId={accountId} />
                  <PendingApprovals
                    accountId={accountId}
                    adminUserId={adminUserId}
                  />
                </>
              )}
            </div>
          </motion.div>

          {/* RIGHT COLUMN (Quick Links) */}
          <motion.div
            variants={cardVariants}
            ref={quickLinksRef}
            className="sticky top-20"
          >
            <div
              className="
            rounded-xl border border-border
            bg-card shadow-sm
            p-4
          "
            >
              <QuickLinks accountId={accountId} accountName={accountName} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Home;
