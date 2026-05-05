
// import { Box ,Grid,Paper,Stack,Typography} from '@mui/material';
// import React from 'react'
// import { useState ,useEffect} from 'react';
// import { accountsAPI } from '../services/api';
// import QuickLinks from '../components/QuickLinks';
// import BillingList from '../components/Home Components/BillingList';
// import OrganizersList from '../components/Home Components/OrganizersList';
// import ProposalsList from '../components/Home Components/ProposalsList';
// import ChatsList from "../components/Home Components/ChatsList";
// import PendingApprovals from '../components/Home Components/PendingApprovals';
// const Home = () => {
//   const[accountId] = useState(sessionStorage.getItem("accountId"));
//  const [accountName,setAccountName]=useState("")
//    const [adminUserId,setAdminUserId]= useState("")
//   // ✅ Fetch account details
// const fetchAccountDetails = async () => {
//   try {
//     const res = await accountsAPI.getAccountById(accountId);
// setAccountName(res.data.accountName)
// setAdminUserId(res.data.adminUserId.emailSyncEmail)
//     console.log("result", res.data);
//   } catch (error) {
//     console.error("Error fetching account details:", error);
//   }
// };

//   useEffect(() => {
//     fetchAccountDetails();
//   }, [accountId]);
//   return (
//     <Box> 
// <Box
//       sx={{
//         width: "100%",
//         maxWidth: { sm: "100%", md: "1700px" },
//         flexGrow: 1,
       
//         height: "90vh",
//         p: 1,
//       }}
//     >
//       <Grid container spacing={2}>
//         <Grid
//           size={{ xs: 12, md: 8 }}
          
//         >
//           <Paper
//             sx={{
//               p: 2,
//               borderRadius: 2,
//               boxShadow: 1,
             
//               transition: "all 0.3s",
//               cursor: "pointer",
//               "&:hover .sign-link": {
//                 opacity: 1,
//                 visibility: "visible",
//                 textDecoration: "none",
//                 cursor: "pointer",
//               },
//             }}
//           >
//             <Stack sx={{ p: 0 }}>
//               <Typography
//                 variant="h6"
//                 component="p"
//                 gutterBottom
//                 sx={{ fontWeight: "600" }}
//               >
//                 Waiting for action
//               </Typography>
//             </Stack>
//             <OrganizersList accountId={accountId} />
//             <BillingList accountId={accountId} />
           
//             <ChatsList accountId={accountId} />
//             <ProposalsList accountId={accountId} />
//            {/* <DocuSealWrapper accountId={accountId} /> */}
//            {/* <DocuSealMultiSigner accountId={accountId} /> */}
//            {/* <DocumnetApprovals accountId={accountId} adminUserId={adminUserId}/> */}
//            <PendingApprovals accountId={accountId}  adminUserId={adminUserId}/>
//           </Paper>
//         </Grid>
//         <Grid size={{ xs: 12, md: 4 }}>
//           <QuickLinks accountId={accountId}  accountName={accountName}/>
//         </Grid>
//       </Grid>
//     </Box>

//     </Box>
   
//   )
// }

// export default Home

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import QuickLinks from "../components/QuickLinks";
import OrganizersList from "../components/Home Components/OrganizersList";
import BillingList from "../components/Home Components/BillingList";
import ChatsList from "../components/Home Components/ChatsList";
import ProposalsList from "../components/Home Components/ProposalsList";
import PendingApprovals from "../components/Home Components/PendingApprovals";
import { accountsAPI } from '../services/api';
import { PageTransition, FadeIn, HomeItemSkeletonRows } from "../components/ui/motion";
// import useShortcuts from "../src/hooks/useShortcuts";

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
      ref.current?.classList.remove("ring-2", "ring-primary/40", "ring-offset-2");
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

  // useShortcuts([
  //   {
  //     id: "home_focus_pending",
  //     keys: ["meta", "shift", "a"],
  //     action: focusPending,
  //     scope: "dashboard",
  //     description: "Focus Pending Actions",
  //     group: "Dashboard",
  //   },
  //   {
  //     id: "home_focus_quicklinks",
  //     keys: ["meta", "shift", "q"],
  //     action: focusQuickLinks,
  //     scope: "dashboard",
  //     description: "Focus Quick Links",
  //     group: "Dashboard",
  //   },
  // ]);

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

  // return (
  //   <PageTransition className="w-full max-w-[1700px] flex-1 h-[90vh] overflow-auto">
  //     <div className="p-4 sm:p-6 flex flex-col gap-6">

  //       {/* Greeting */}
  //       <FadeIn>
  //         <div className="flex flex-col gap-0.5">
  //           <h1 className="text-2xl font-semibold tracking-tight text-foreground">
  //             {greeting}{accountName ? `, ${accountName}` : ""}
  //           </h1>
  //           <p className="text-[13px] text-muted-foreground">
  //             Here's what needs your attention today.
  //           </p>
  //         </div>
  //       </FadeIn>

  //       <motion.div
  //         variants={containerVariants}
  //         initial="hidden"
  //         animate="show"
  //         className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start"
  //       >
  //         {/* Pending Actions card */}
  //         <motion.div
  //           variants={cardVariants}
  //           ref={pendingRef}
  //           className="rounded-xl border border-border bg-card shadow-sm overflow-hidden transition-shadow duration-200 hover:shadow-md"
  //         >
  //           <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border bg-muted/20">
  //             <span className="relative flex h-2 w-2 shrink-0">
  //               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
  //               <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
  //             </span>
  //             <p className="text-[13px] font-semibold text-foreground tracking-tight">
  //               Waiting for action
  //             </p>
  //             {/* <kbd className="ml-auto rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
  //               ⌘⇧A
  //             </kbd> */}
  //           </div>

  //           <div className="divide-y divide-border/50">
  //             {accountLoading ? (
  //               <HomeItemSkeletonRows rows={3} />
  //             ) : (
  //               <>
  //                 <OrganizersList accountId={accountId} />
  //                 <BillingList accountId={accountId} />
  //                 <ChatsList accountId={accountId} />
  //                 <ProposalsList accountId={accountId} />
  //                 <PendingApprovals accountId={accountId} adminUserId={adminUserId} />
  //               </>
  //             )}
  //           </div>
  //         </motion.div>

  //         {/* Quick Links sidebar */}
  //         <motion.div variants={cardVariants} ref={quickLinksRef} className="sticky top-0">
  //           <QuickLinks accountId={accountId} accountName={accountName} />
  //         </motion.div>
  //       </motion.div>
  //     </div>
  //   </PageTransition>
  // );
  return (
  <PageTransition className="w-full flex-1 min-h-screen bg-background">

    <div className="page-container py-6 flex flex-col gap-6">

      {/* Greeting */}
      <FadeIn>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {greeting}{accountName ? `, ${accountName}` : ""}
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

          {/* Header */}
          <div className="
            flex items-center gap-3 px-5 py-3.5
            border-b border-border
            bg-muted/30
          ">

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
                <PendingApprovals accountId={accountId} adminUserId={adminUserId} />
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
          <div className="
            rounded-xl border border-border
            bg-card shadow-sm
            p-4
          ">
            <QuickLinks accountId={accountId} accountName={accountName} />
          </div>
        </motion.div>

      </motion.div>
    </div>
  </PageTransition>
);
};

export default Home;