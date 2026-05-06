


// import React, { useState, useRef } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   Box,
//   List,
//   ListItemButton,
//   Typography,
//   Divider,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   TextField,
//   Button,
//   ButtonGroup,
//   FormControlLabel,
//   Checkbox,
//   ListItemText,
//   ListItemIcon
// } from "@mui/material";
// import SignatureCanvas from "react-signature-canvas";
// import axios from "axios";
// import CloseIcon from "@mui/icons-material/Close";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import HTMLReactParser from "html-react-parser";
// import { toast } from "material-react-toastify";
// import { proposalAPI } from "../../services/api"; // adjust path
// const ProposalPreviewDialog = ({ open, handleClose, proposal }) => {
//   const [activeStep, setActiveStep] = useState("general");
//   // Signature States
//   const [signatureType, setSignatureType] = useState("draw");
//   const [signatureData, setSignatureData] = useState(null);
//   const [typedSignature, setTypedSignature] = useState("");
//   const [termsAccepted, setTermsAccepted] = useState(false);
//   const [isSigning, setIsSigning] = useState(false);

//   const sigCanvas = useRef(null);
  
//   // Check if proposal is signed
//   const isSigned = proposal?.status === "Signed";
  
//   // Determine enabled sections
//   const steps = [
//     { id: "introduction", label: "Introduction", enabled: proposal?.general?.introductionEnabled },
//     { id: "terms", label: "Terms & Conditions", enabled: proposal?.general?.termsEnabled },
//     { id: "services", label: "Services", enabled: proposal?.general?.servicesEnabled },
//     { id: "payments", label: "Payments", enabled: proposal?.general?.paymentsEnabled },
//     { id: "signature", label: "Sign & Accept", enabled: true },
//   ].filter(s => s.enabled);

//   const introRef = useRef(null);
//   const termsRef = useRef(null);
//   const servicesRef = useRef(null);
//   const paymentsRef = useRef(null);
//   const signatureRef = useRef(null);
//   const refMap = {
//     introduction: introRef,
//     terms: termsRef,
//     services: servicesRef,
//     payments: paymentsRef,
//     signature: signatureRef,
//   };

//   const handleStepClick = (id) => {
//     const sectionRef = refMap[id];
//     if (sectionRef?.current) {
//       sectionRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//     setActiveStep(id);
//   };

//   const handleScroll = (e) => {
//     const scrollTop = e.target.scrollTop;

//     for (let step of steps) {
//       const stepRef = refMap[step.id];
//       if (stepRef?.current) {
//         const offsetTop = stepRef.current.offsetTop;
//         if (scrollTop + 50 >= offsetTop) {
//           setActiveStep(step.id);
//         }
//       }
//     }
//   };

//   /** ✅ Complete button action */
//   const handleCompleteProposal = async () => {
//     try {
//       setIsSigning(true);

//       const payload = {
//         status: "Signed",
//         signedAt: new Date(),
//         signature: signatureType === "draw" ? signatureData : typedSignature,
//       };

//       // await axios.post(`https://www.snptaxes.com/account/proposals/sign/${proposal._id}`, payload);
//        // ✅ USE API INSTEAD OF AXIOS
//     await proposalAPI.signAccountProposal(proposal._id, payload);
//       toast.success("Proposal signed successfully");
//       handleClose();
//     } catch (err) {
//       console.error("Signature save error:", err);
//     } finally {
//       setIsSigning(false);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={handleClose} fullScreen>
//       <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
//         {proposal?.general?.proposalName || "Proposal"}
//         <CloseIcon sx={{ cursor: "pointer",color:'red' }} onClick={handleClose} />
//       </DialogTitle>

//       <DialogContent sx={{ display: "flex", height: "75vh", p: 0 }}>
        
//         {/* LEFT SIDE MENU */}
//         <Box sx={{ width: "28%", borderRight: "1px solid #ddd" }}>
//           <List>
//             {steps.map((step) => (
//               <ListItemButton
//                 key={step.id}
//                 selected={activeStep === step.id}
//                 onClick={() => handleStepClick(step.id)}
//                 sx={{
//                   // Apply green color when signed
//                   ...(isSigned && {
//                     color: "success.main",
//                     "& .MuiListItemText-primary": {
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 1,
//                     },
//                   }),
//                 }}
//               >
//                 {/* Show checkmark icon when signed */}
//                 {isSigned && (
//                   <ListItemIcon sx={{ minWidth: "auto", mr: 1 }}>
//                     <CheckCircleOutlineIcon 
//                       fontSize="small" 
//                       sx={{ color: "success.main" }} 
//                     />
//                   </ListItemIcon>
//                 )}
//                 <ListItemText 
//                   primary={step.label}
//                   sx={{
//                     // Ensure text color changes when signed
//                     color: isSigned ? "success.main" : "inherit",
//                   }}
//                 />
//               </ListItemButton>
//             ))}
//           </List>
//         </Box>

//         {/* RIGHT CONTENT */}
//         <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }} onScroll={handleScroll}>

//           {/* ✅ INTRODUCTION */}
//           {proposal?.general?.introductionEnabled && (
//             <Box ref={introRef} sx={{ mb: 3 }}>
//               <Typography variant="h6">{proposal?.introduction?.title || "Introduction"}</Typography>
//               {HTMLReactParser(proposal?.introduction?.description || "")}
//               <Divider sx={{ my: 2 }} />
//             </Box>
//           )}

//           {/* ✅ TERMS */}
//           {proposal?.general?.termsEnabled && (
//             <Box ref={termsRef} sx={{ mb: 3 }}>
//               <Typography variant="h6">Terms & Conditions</Typography>
//               {HTMLReactParser(proposal?.terms?.description || "")}
//               <Divider sx={{ my: 2 }} />
//             </Box>
//           )}

//           {/* ✅ SERVICES - ITEMIZED */}
//           {proposal?.general?.servicesEnabled && proposal?.services?.option === "services" && (
//             <Box ref={servicesRef} sx={{ mb: 3 }}>
//               <Typography variant="h6" sx={{ mb: 2 }}>Services</Typography>

//               <Box sx={{ border: "1px solid #e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
//                 <Box sx={{
//                   p: 1, fontWeight: "bold",
//                   display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr"
//                 }}>
//                   <Typography>Service</Typography>
//                   <Typography textAlign="right">Rate</Typography>
//                   <Typography textAlign="right">Qty</Typography>
//                   <Typography textAlign="right">Tax</Typography>
//                   <Typography textAlign="right">Amount</Typography>
//                 </Box>

//                 {proposal?.services?.itemizedData?.lineItems?.map((item, i) => {
//                   const rate = Number(item.rate || 0);
//                   const qty = Number(item.quantity || 1);
//                   const taxRate = proposal?.services?.itemizedData?.taxRate || 0;

//                   const base = rate * qty;
//                   const tax = item.tax ? (base * taxRate) / 100 : 0;
//                   const total = base + tax;

//                   return (
//                     <Box key={i} sx={{
//                       p: 1,
//                       borderTop: "1px solid #e5e7eb",
//                       display: "grid",
//                       gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr"
//                     }}>
//                       <Box>
//                         <Typography fontWeight="bold">{item.productorService}</Typography>
//                         <Typography fontSize={12} color="text.secondary">{item.description}</Typography>
//                       </Box>

//                       <Typography textAlign="right">${rate.toFixed(2)}</Typography>
//                       <Typography textAlign="right">{qty}</Typography>
//                       <Typography textAlign="right">${tax.toFixed(2)}</Typography>
//                       <Typography textAlign="right">${total.toFixed(2)}</Typography>
//                     </Box>
//                   );
//                 })}

//                 <Box sx={{
//                   borderTop: "1px solid #e5e7eb",
//                   p: 1,
//                   display: "flex",
//                   justifyContent: "flex-end",
//                   fontWeight: "bold"
//                 }}>
//                   Total: ${proposal?.services?.itemizedData?.totalAmount?.toFixed(2)}
//                 </Box>
//               </Box>

//               <Divider sx={{ my: 2 }} />
//             </Box>
//           )}

//           {/* ✅ SERVICES - INVOICE MODE */}
//           {proposal?.general?.servicesEnabled && proposal?.services?.option === "invoice" && (
//             <Box ref={servicesRef} sx={{ mb: 3 }}>
//               <Typography variant="h6" sx={{ mb: 2 }}>Invoice</Typography>

//               <Box sx={{ mb: 2 }}>
//                 <Typography fontWeight="bold">Amount</Typography>
//                 <Box sx={{ bgcolor: "#f9fafb", p: 1, borderRadius: "8px" }}>
//                   ${proposal?.services?.invoices?.[0]?.totalAmount?.toFixed(2)}
//                 </Box>

//                 <Typography fontWeight="bold" sx={{ mt: 2 }}>Invoice will be issued</Typography>
//                 <Box sx={{ bgcolor: "#f9fafb", p: 1, borderRadius: "8px" }}>
//                   {proposal?.services?.invoices?.[0]?.issueinvoice || "N/A"}
//                 </Box>

//                 <Typography fontWeight="bold" sx={{ mt: 2 }}>Description</Typography>
//                 <Box sx={{ bgcolor: "#f9fafb", p: 1, borderRadius: "8px" }}>
//                   {proposal?.services?.invoices?.[0]?.description || "N/A"}
//                 </Box>
//               </Box>

//               <Accordion>
//                 <AccordionSummary expandIcon={<span>▼</span>}>
//                   <Typography fontWeight="bold">Invoice details</Typography>
//                 </AccordionSummary>

//                 <AccordionDetails>
//                   <Box sx={{ border: "1px solid #e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
//                     <Box sx={{
//                       bgcolor: "#f9fafb", p: 1, fontWeight: "bold",
//                       display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr"
//                     }}>
//                       <Typography>Service</Typography>
//                       <Typography textAlign="right">Rate</Typography>
//                       <Typography textAlign="right">Qty</Typography>
//                       <Typography textAlign="right">Tax</Typography>
//                       <Typography textAlign="right">Amount</Typography>
//                     </Box>

//                     {proposal?.services?.invoices?.[0]?.lineItems?.map((item, i) => {
//                       const rate = Number(item.rate || 0);
//                       const qty = Number(item.quantity || 1);
//                       const taxRate = proposal?.services?.invoices?.[0]?.taxRate || 0;

//                       const base = rate * qty;
//                       const tax = item.tax ? (base * taxRate) / 100 : 0;
//                       const total = base + tax;

//                       return (
//                         <Box key={i} sx={{
//                           p: 1,
//                           borderTop: "1px solid #e5e7eb",
//                           display: "grid",
//                           gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr"
//                         }}>
//                           <Box>
//                             <Typography fontWeight="bold">{item.productorService}</Typography>
//                             <Typography fontSize={12} color="text.secondary">{item.description}</Typography>
//                           </Box>

//                           <Typography textAlign="right">${rate.toFixed(2)}</Typography>
//                           <Typography textAlign="right">{qty}</Typography>
//                           <Typography textAlign="right">${tax.toFixed(2)}</Typography>
//                           <Typography textAlign="right">${total.toFixed(2)}</Typography>
//                         </Box>
//                       );
//                     })}

//                     <Box sx={{
//                       borderTop: "1px solid #e5e7eb",
//                       p: 1,
//                       display: "flex",
//                       justifyContent: "flex-end",
//                       fontWeight: "bold"
//                     }}>
//                       Total: ${proposal?.services?.invoices?.[0]?.totalAmount?.toFixed(2)}
//                     </Box>
//                   </Box>
//                 </AccordionDetails>
//               </Accordion>

//               <Divider sx={{ my: 2 }} />
//             </Box>
//           )}

//           {/* ✅ PAYMENTS */}
//           {proposal?.general?.paymentsEnabled && (
//             <Box ref={paymentsRef} sx={{ mb: 3 }}>
//               <Typography variant="h6">Payments</Typography>
//               <Typography><b>Method:</b> {proposal?.payments?.method}</Typography>
//               <Typography><b>Amount:</b> ${proposal?.payments?.amount}</Typography>
//               <Divider sx={{ my: 2 }} />
//             </Box>
//           )}

//           {/* ✅ SIGNATURE SECTION */}
//           <Box ref={signatureRef} sx={{ mb: 4 }}>
//             <Typography variant="h6" sx={{ mb: 2 }}>Sign & Accept</Typography>
//             <Divider sx={{ mb: 2 }} />

//             {/* Already signed */}
//             {proposal?.status === "Signed" ? (
//               <>
//                 <Typography sx={{ mb: 2 }} color="text.secondary">
//                   Signed on {new Date(proposal.signedAt).toLocaleString()}
//                 </Typography>

//                 <Typography fontWeight="bold">Signature:</Typography>

//                 {proposal?.signature?.startsWith("data:image") ? (
//                   <img
//                     src={proposal.signature}
//                     alt="signature"
//                     style={{
//                       maxWidth: 300,
//                       border: "1px solid #ddd",
//                       background: "white",
//                       padding: 10,
//                       marginTop: 10,
//                     }}
//                   />
//                 ) : (
//                   <div
//                     style={{
//                       fontSize: 24,
//                       fontFamily: "cursive",
//                       border: "1px solid #ccc",
//                       padding: 20,
//                       background: "#f7f7f7",
//                       marginTop: 10,
//                       borderRadius: 6,
//                     }}
//                   >
//                     {proposal.signature}
//                   </div>
//                 )}

//                 <Button color="primary"  sx={{
//               backgroundColor: 'text.menu',
//               mt: 2, opacity: 0.7,
//               color: 'primary.contrastText',
//               '&:hover': {
//                 backgroundColor: 'menu.dark',
//                 boxShadow: 1,
//               },
//               transition: 'background-color 0.2s ease'
//             }} disabled >
//                   Already Signed
//                 </Button>
//               </>
//             ) : (
//               <>
//                 {/* Signature type selector */}
//                 {/* <ButtonGroup sx={{ mb: 2 }}>
//                   <Button
//                     variant={signatureType === "draw" ? "contained" : "outlined"}
//                     onClick={() => setSignatureType("draw")}
//                   >
//                     Draw
//                   </Button>
//                   <Button
//                     variant={signatureType === "type" ? "contained" : "outlined"}
//                     onClick={() => setSignatureType("type")}
//                   >
//                     Type
//                   </Button>
//                 </ButtonGroup> */}
// <ButtonGroup sx={{ mb: 2 }}>
//   <Button
//     color="primary"
//     sx={{
//       backgroundColor:
//         signatureType === "draw" ? "primary.main" : "text.menu",
//       color:
//         signatureType === "draw"
//           ? "primary.contrastText"
//           : "primary.contrastText",
//       "&:hover": {
//         backgroundColor:
//           signatureType === "draw" ? "primary.dark" : "menu.dark",
//         boxShadow: 1,
//       },
//       transition: "background-color 0.2s ease"
//     }}
//     onClick={() => setSignatureType("draw")}
//   >
//     Draw
//   </Button>

//   <Button
//     color="primary"
//     sx={{
//       backgroundColor:
//         signatureType === "type" ? "primary.main" : "text.menu",
//       color:
//         signatureType === "type"
//           ? "primary.contrastText"
//           : "primary.contrastText",
//       "&:hover": {
//         backgroundColor:
//           signatureType === "type" ? "primary.dark" : "menu.dark",
//         boxShadow: 1,
//       },
//       transition: "background-color 0.2s ease"
//     }}
//     onClick={() => setSignatureType("type")}
//   >
//     Type
//   </Button>
// </ButtonGroup>



//                 {/* Draw Mode */}
//                 {signatureType === "draw" && (
//                   <>
//                     <SignatureCanvas
//                       ref={sigCanvas}
//                       penColor="black"
//                       canvasProps={{
//                         width: 500,
//                         height: 200,
//                         style: {
//                           border: "1px solid #ccc",
//                           background: "#fafafa",
//                           borderRadius: 6,
//                         },
//                       }}
//                     />

//                     <Box sx={{ display: "flex", gap: 1, my: 2 }}>
//                       <Button variant="outlined" onClick={() => sigCanvas.current.clear()}>
//                         Clear
//                       </Button>
//                       <Button
//                         // variant="contained"
//                         color="primary"  sx={{
//               backgroundColor: 'text.menu',
//               color: 'primary.contrastText',
//               '&:hover': {
//                 backgroundColor: 'menu.dark',
//                 boxShadow: 1,
//               },
//               transition: 'background-color 0.2s ease'
//             }}
//                         onClick={() => {
//                           if (sigCanvas.current.isEmpty()) {
//                             alert("Please draw your signature first");
//                             return;
//                           }
//                           const signature = sigCanvas.current.toDataURL("image/png");
//                           setSignatureData(signature);
//                         }}
//                       >
//                         Save Signature
//                       </Button>
//                     </Box>

//                     {signatureData && (
//                       <>
//                         <Typography variant="body2" color="success.main" sx={{ mb: 1 }}>
//                           ✓ Signature saved successfully
//                         </Typography>
//                         <img
//                           src={signatureData}
//                           alt="preview"
//                           style={{
//                             maxWidth: 300,
//                             border: "1px solid #ddd",
//                             padding: 10,
//                             background: "white",
//                           }}
//                         />
//                       </>
//                     )}
//                   </>
//                 )}

//                 {/* Type Mode */}
//                 {signatureType === "type" && (
//                   <>
//                     <TextField
//                       fullWidth
//                       placeholder="Type your full name"
//                       value={typedSignature}
//                       onChange={(e) => setTypedSignature(e.target.value)}
//                       sx={{ mb: 2 }}
//                       InputProps={{
//                         style: { fontFamily: "cursive", fontSize: 22 },
//                       }}
//                     />

//                     {typedSignature && (
//                       <div
//                         style={{
//                           fontSize: 24,
//                           fontFamily: "cursive",
//                           border: "1px solid #ccc",
//                           padding: 20,
//                           background: "#fafafa",
//                           borderRadius: 6,
//                           marginBottom: 20,
//                         }}
//                       >
//                         {typedSignature}
//                       </div>
//                     )}
//                   </>
//                 )}

//                 {/* Accept terms checkbox */}
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={termsAccepted}
//                       onChange={(e) => setTermsAccepted(e.target.checked)}
//                       disabled={proposal?.status === "Signed"}
//                     />
//                   }
//                   label="I accept the Terms & Conditions"
//                   sx={{ mt: 2 }}
//                 />

//                 {/* Complete button */}
//                 <Button
//                   // variant="contained"
//                   color="primary"  sx={{
//               backgroundColor: 'text.menu',
//               color: 'primary.contrastText',
//               '&:hover': {
//                 backgroundColor: 'menu.dark',
//                 boxShadow: 1,
//               },
//               transition: 'background-color 0.2s ease'
//             }}
//                   // sx={{ mt: 2 }}
//                   disabled={
//                     isSigning ||
//                     !termsAccepted ||
//                     (signatureType === "draw" ? !signatureData : !typedSignature) ||
//                     proposal?.status === "Signed"
//                   }
//                   onClick={handleCompleteProposal}
//                 >
//                   {isSigning ? "Saving..." : "Complete Proposal"}
//                 </Button>
//               </>
//             )}
//           </Box>
//         </Box>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ProposalPreviewDialog;

import React, { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";
import HTMLReactParser from "html-react-parser";
// import { toast } from "material-react-toastify";
import { X, CheckCircle, ChevronDown } from "lucide-react";
import { proposalAPI } from "../../services/api"; // adjust path
import { useToast } from "../../hooks/useToast";

const ProposalPreviewDialog = ({ open, handleClose, proposal }) => {
  const [activeStep, setActiveStep] = useState("general");
  // Signature States
  const toast=useToast()

  const [signatureType, setSignatureType] = useState("draw");
  const [signatureData, setSignatureData] = useState(null);
  const [typedSignature, setTypedSignature] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [invoiceAccordionOpen, setInvoiceAccordionOpen] = useState(false);

  const sigCanvas = useRef(null);
  
  // Check if proposal is signed
  const isSigned = proposal?.status === "Signed";
  
  // Determine enabled sections
  const steps = [
    { id: "introduction", label: "Introduction", enabled: proposal?.general?.introductionEnabled },
    { id: "terms", label: "Terms & Conditions", enabled: proposal?.general?.termsEnabled },
    { id: "services", label: "Services", enabled: proposal?.general?.servicesEnabled },
    { id: "payments", label: "Payments", enabled: proposal?.general?.paymentsEnabled },
    { id: "signature", label: "Sign & Accept", enabled: true },
  ].filter(s => s.enabled);

  const introRef = useRef(null);
  const termsRef = useRef(null);
  const servicesRef = useRef(null);
  const paymentsRef = useRef(null);
  const signatureRef = useRef(null);
  const refMap = {
    introduction: introRef,
    terms: termsRef,
    services: servicesRef,
    payments: paymentsRef,
    signature: signatureRef,
  };

  const handleStepClick = (id) => {
    const sectionRef = refMap[id];
    if (sectionRef?.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setActiveStep(id);
  };

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;

    for (let step of steps) {
      const stepRef = refMap[step.id];
      if (stepRef?.current) {
        const offsetTop = stepRef.current.offsetTop;
        if (scrollTop + 50 >= offsetTop) {
          setActiveStep(step.id);
        }
      }
    }
  };

  /** ✅ Complete button action */
  const handleCompleteProposal = async () => {
    try {
      setIsSigning(true);

      const payload = {
        status: "Signed",
        signedAt: new Date(),
        signature: signatureType === "draw" ? signatureData : typedSignature,
      };

      // ✅ USE API INSTEAD OF AXIOS
      await proposalAPI.signAccountProposal(proposal._id, payload);
      toast.success("Proposal signed successfully");
      handleClose();
    } catch (err) {
      console.error("Signature save error:", err);
      toast.error("Failed to sign proposal");
    } finally {
      setIsSigning(false);
    }
  };
  return (
  <>
    {open && (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-[1200] bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="fixed inset-0 z-[1201] flex items-stretch justify-center pointer-events-none">
          <div
            className="pointer-events-auto flex flex-col bg-background shadow-xl w-full max-w-5xl h-full overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card shrink-0">
              <h1 className="text-lg font-semibold text-foreground truncate">
                {proposal?.general?.proposalName || "Proposal"}
              </h1>

              <button
                type="button"
                onClick={handleClose}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">

              {/* Sidebar */}
              <nav className="w-56 shrink-0 border-r border-border bg-card overflow-y-auto">
                <ul className="py-2">
                  {steps.map((step) => (
                    <li key={step.id}>
                      <button
                        type="button"
                        onClick={() => handleStepClick(step.id)}
                        className={`w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-l-2 ${
                          activeStep === step.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-transparent text-muted-foreground hover:bg-muted"
                        } ${isSigned ? "text-success" : ""}`}
                      >
                        {isSigned && (
                          <CheckCircle size={14} className="text-success shrink-0" />
                        )}
                        {step.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Content */}
              <div
                className="flex-1 overflow-y-auto px-6 md:px-10 py-6 bg-background"
                onScroll={handleScroll}
              >

                {/* INTRODUCTION */}
                {proposal?.general?.introductionEnabled && (
                  <div ref={introRef} className="mb-8">
                    <h2 className="text-base font-semibold text-foreground mb-2">
                      {proposal?.introduction?.title || "Introduction"}
                    </h2>
                    <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                      {HTMLReactParser(proposal?.introduction?.description || "")}
                    </div>
                    <hr className="border-border mt-4" />
                  </div>
                )}

                {/* TERMS */}
                {proposal?.general?.termsEnabled && (
                  <div ref={termsRef} className="mb-8">
                    <h2 className="text-base font-semibold text-foreground mb-2">
                      Terms & Conditions
                    </h2>
                    <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                      {HTMLReactParser(proposal?.terms?.description || "")}
                    </div>
                    <hr className="border-border mt-4" />
                  </div>
                )}

                {/* SERVICES TABLE */}
                {proposal?.general?.servicesEnabled &&
                  proposal?.services?.option === "services" && (
                    <div ref={servicesRef} className="mb-8">
                      <h2 className="text-base font-semibold text-foreground mb-3">
                        Services
                      </h2>

                      <div className="rounded-xl border border-border overflow-hidden bg-card">
                        <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] bg-muted px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                          <span>Service</span>
                          <span className="text-right">Rate</span>
                          <span className="text-right">Qty</span>
                          <span className="text-right">Tax</span>
                          <span className="text-right">Amount</span>
                        </div>

                        {proposal?.services?.itemizedData?.lineItems?.map((item, i) => {
                          const rate = Number(item.rate || 0);
                          const qty = Number(item.quantity || 1);
                          const taxRate = proposal?.services?.itemizedData?.taxRate || 0;
                          const base = rate * qty;
                          const tax = item.tax ? (base * taxRate) / 100 : 0;
                          const total = base + tax;

                          return (
                            <div key={i} className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] border-t border-border px-3 py-2 text-sm text-foreground">
                              <div>
                                <p className="font-semibold">{item.productorService}</p>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                              </div>
                              <span className="text-right">${rate.toFixed(2)}</span>
                              <span className="text-right">{qty}</span>
                              <span className="text-right">${tax.toFixed(2)}</span>
                              <span className="text-right">${total.toFixed(2)}</span>
                            </div>
                          );
                        })}

                        <div className="border-t border-border px-3 py-2 flex justify-end text-sm font-bold text-foreground">
                          Total: ${proposal?.services?.itemizedData?.totalAmount?.toFixed(2)}
                        </div>
                      </div>

                      <hr className="border-border mt-4" />
                    </div>
                  )}

                {/* PAYMENTS */}
                {proposal?.general?.paymentsEnabled && (
                  <div ref={paymentsRef} className="mb-8">
                    <h2 className="text-base font-semibold text-foreground mb-2">
                      Payments
                    </h2>
                    <div className="rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground">
                      <p><span className="font-semibold">Method:</span> {proposal?.payments?.method}</p>
                      <p><span className="font-semibold">Amount:</span> ${proposal?.payments?.amount}</p>
                    </div>
                    <hr className="border-border mt-4" />
                  </div>
                )}

                {/* SIGNATURE */}
             {/* SIGNATURE */}
<div ref={signatureRef} className="mb-8 max-w-lg">
  <h2 className="text-base font-semibold text-foreground mb-2">
    Sign & Accept
  </h2>

  <hr className="border-border mb-4" />

  {proposal?.status === "Signed" ? (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle size={15} className="text-success" />
        Signed on {new Date(proposal.signedAt).toLocaleString()}
      </div>

      <p className="text-sm font-semibold text-foreground">
        Signature:
      </p>

      {proposal?.signature?.startsWith("data:image") ? (
        <img
          src={proposal.signature}
          alt="signature"
          className="max-w-xs rounded-lg border border-border bg-card p-2"
        />
      ) : (
        <div className="rounded-lg border border-border bg-muted px-5 py-4 text-2xl font-[cursive] text-foreground">
          {proposal.signature}
        </div>
      )}

      <button
        disabled
        className="rounded-lg bg-primary/50 px-4 py-2 text-sm font-semibold text-primary-foreground opacity-60 cursor-not-allowed"
      >
        Already Signed
      </button>
    </div>
  ) : (
    <div className="space-y-5">

      {/* Toggle */}
      <div className="flex rounded-lg border border-border overflow-hidden w-fit">
        {["draw", "type"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setSignatureType(t)}
            className={`px-5 py-2 text-sm font-medium transition-colors ${
              signatureType === t
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            {t === "draw" ? "Draw" : "Type"}
          </button>
        ))}
      </div>

      {/* DRAW SIGNATURE */}
      {signatureType === "draw" && (
        <div className="space-y-3">
          <div className="rounded-lg border border-border bg-muted overflow-hidden">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="black"
              canvasProps={{
                width: 500,
                height: 200,
                className: "w-full",
                style: { background: "transparent" },
              }}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => sigCanvas.current.clear()}
              className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => {
                if (sigCanvas.current.isEmpty()) {
                  toast.warning("Please draw your signature first");
                  return;
                }
                setSignatureData(
                  sigCanvas.current.toDataURL("image/png")
                );
              }}
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-sm"
            >
              Save Signature
            </button>
          </div>

          {signatureData && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-sm text-success">
                <CheckCircle size={14} />
                Signature saved successfully
              </div>

              <img
                src={signatureData}
                alt="preview"
                className="max-w-xs rounded-lg border border-border bg-card p-2"
              />
            </div>
          )}
        </div>
      )}

      {/* TYPE SIGNATURE */}
      {signatureType === "type" && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Type your full name"
            value={typedSignature}
            onChange={(e) => setTypedSignature(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-3 text-2xl font-[cursive] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />

          {typedSignature && (
            <div className="rounded-lg border border-border bg-muted px-5 py-5 text-2xl font-[cursive] text-foreground">
              {typedSignature}
            </div>
          )}
        </div>
      )}

      {/* TERMS */}
      <label className="flex items-start gap-2.5 cursor-pointer select-none mt-2">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mt-1 accent-primary"
        />
        <span className="text-sm text-foreground">
          I accept the Terms & Conditions
        </span>
      </label>

      {/* COMPLETE BUTTON */}
      <button
        type="button"
        disabled={
          isSigning ||
          !termsAccepted ||
          (signatureType === "draw"
            ? !signatureData
            : !typedSignature)
        }
        onClick={handleCompleteProposal}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSigning ? "Saving..." : "Complete Proposal"}
      </button>
    </div>
  )}
</div>

              </div>
            </div>
          </div>
        </div>
      </>
    )}
  </>
);

  // return (
  //   <>
  //     {open && (
  //       <>
  //         <div className="fixed inset-0 z-[1200] bg-black/50" onClick={handleClose} />
  //         <div className="fixed inset-0 z-[1201] flex items-stretch justify-center pointer-events-none">
  //           <div
  //             className="pointer-events-auto flex flex-col bg-white shadow-2xl w-full max-w-5xl h-full overflow-hidden"
  //             onClick={(e) => e.stopPropagation()}
  //           >
  //             {/* Header */}
  //             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shrink-0">
  //               <h1 className="text-lg font-semibold text-gray-900 truncate">
  //                 {proposal?.general?.proposalName || "Proposal"}
  //               </h1>
  //               <button
  //                 type="button"
  //                 onClick={handleClose}
  //                 className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
  //               >
  //                 <X size={18} />
  //               </button>
  //             </div>

  //             {/* Body */}
  //             <div className="flex flex-1 overflow-hidden">
  //               {/* Left nav */}
  //               <nav className="w-56 shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
  //                 <ul className="py-2">
  //                   {steps.map((step) => (
  //                     <li key={step.id}>
  //                       <button
  //                         type="button"
  //                         onClick={() => handleStepClick(step.id)}
  //                         className={`w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors rounded-none border-l-2 ${
  //                           activeStep === step.id
  //                             ? "border-blue-600 bg-blue-50/50 text-blue-600"
  //                             : "border-transparent text-gray-700 hover:bg-gray-50"
  //                         } ${isSigned ? "text-green-600" : ""}`}
  //                       >
  //                         {isSigned && (
  //                           <CheckCircle size={14} className="text-green-500 shrink-0" />
  //                         )}
  //                         {step.label}
  //                       </button>
  //                     </li>
  //                   ))}
  //                 </ul>
  //               </nav>

  //               {/* Right scrollable content */}
  //               <div
  //                 className="flex-1 overflow-y-auto px-6 md:px-10 py-6"
  //                 onScroll={handleScroll}
  //               >
  //                 {/* INTRODUCTION */}
  //                 {proposal?.general?.introductionEnabled && (
  //                   <div ref={introRef} className="mb-8">
  //                     <h2 className="text-base font-semibold text-gray-900 mb-2">
  //                       {proposal?.introduction?.title || "Introduction"}
  //                     </h2>
  //                     <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
  //                       {HTMLReactParser(proposal?.introduction?.description || "")}
  //                     </div>
  //                     <hr className="border-gray-200 mt-4" />
  //                   </div>
  //                 )}

  //                 {/* TERMS */}
  //                 {proposal?.general?.termsEnabled && (
  //                   <div ref={termsRef} className="mb-8">
  //                     <h2 className="text-base font-semibold text-gray-900 mb-2">Terms & Conditions</h2>
  //                     <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
  //                       {HTMLReactParser(proposal?.terms?.description || "")}
  //                     </div>
  //                     <hr className="border-gray-200 mt-4" />
  //                   </div>
  //                 )}

  //                 {/* SERVICES — ITEMIZED */}
  //                 {proposal?.general?.servicesEnabled && proposal?.services?.option === "services" && (
  //                   <div ref={servicesRef} className="mb-8">
  //                     <h2 className="text-base font-semibold text-gray-900 mb-3">Services</h2>
  //                     <div className="rounded-xl border border-gray-200 overflow-hidden">
  //                       <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
  //                         <span>Service</span>
  //                         <span className="text-right">Rate</span>
  //                         <span className="text-right">Qty</span>
  //                         <span className="text-right">Tax</span>
  //                         <span className="text-right">Amount</span>
  //                       </div>
  //                       {proposal?.services?.itemizedData?.lineItems?.map((item, i) => {
  //                         const rate = Number(item.rate || 0);
  //                         const qty = Number(item.quantity || 1);
  //                         const taxRate = proposal?.services?.itemizedData?.taxRate || 0;
  //                         const base = rate * qty;
  //                         const tax = item.tax ? (base * taxRate) / 100 : 0;
  //                         const total = base + tax;
  //                         return (
  //                           <div key={i} className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] border-t border-gray-200 px-3 py-2 text-sm text-gray-900">
  //                             <div>
  //                               <p className="font-semibold">{item.productorService}</p>
  //                               <p className="text-xs text-gray-500">{item.description}</p>
  //                             </div>
  //                             <span className="text-right">${rate.toFixed(2)}</span>
  //                             <span className="text-right">{qty}</span>
  //                             <span className="text-right">${tax.toFixed(2)}</span>
  //                             <span className="text-right">${total.toFixed(2)}</span>
  //                           </div>
  //                         );
  //                       })}
  //                       <div className="border-t border-gray-200 px-3 py-2 flex justify-end text-sm font-bold text-gray-900">
  //                         Total: ${proposal?.services?.itemizedData?.totalAmount?.toFixed(2)}
  //                       </div>
  //                     </div>
  //                     <hr className="border-gray-200 mt-4" />
  //                   </div>
  //                 )}

  //                 {/* SERVICES — INVOICE */}
  //                 {proposal?.general?.servicesEnabled && proposal?.services?.option === "invoice" && (
  //                   <div ref={servicesRef} className="mb-8">
  //                     <h2 className="text-base font-semibold text-gray-900 mb-3">Invoice</h2>
  //                     <div className="space-y-3 mb-4">
  //                       <div>
  //                         <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Amount</p>
  //                         <div className="rounded-lg bg-gray-50/50 border border-gray-200 px-3 py-2 text-sm text-gray-900">
  //                           ${proposal?.services?.invoices?.[0]?.totalAmount?.toFixed(2)}
  //                         </div>
  //                       </div>
  //                       <div>
  //                         <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Invoice will be issued</p>
  //                         <div className="rounded-lg bg-gray-50/50 border border-gray-200 px-3 py-2 text-sm text-gray-900">
  //                           {proposal?.services?.invoices?.[0]?.issueinvoice || "N/A"}
  //                         </div>
  //                       </div>
  //                       <div>
  //                         <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</p>
  //                         <div className="rounded-lg bg-gray-50/50 border border-gray-200 px-3 py-2 text-sm text-gray-900">
  //                           {proposal?.services?.invoices?.[0]?.description || "N/A"}
  //                         </div>
  //                       </div>
  //                     </div>

  //                     {/* Accordion */}
  //                     <div className="rounded-xl border border-gray-200 overflow-hidden">
  //                       <button
  //                         type="button"
  //                         onClick={() => setInvoiceAccordionOpen((v) => !v)}
  //                         className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-900 bg-gray-50/30 hover:bg-gray-100/50 transition-colors"
  //                       >
  //                         Invoice details
  //                         <ChevronDown
  //                           size={16}
  //                           className={`transition-transform ${invoiceAccordionOpen ? "rotate-180" : ""}`}
  //                         />
  //                       </button>
  //                       {invoiceAccordionOpen && (
  //                         <div className="border-t border-gray-200">
  //                           <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
  //                             <span>Service</span>
  //                             <span className="text-right">Rate</span>
  //                             <span className="text-right">Qty</span>
  //                             <span className="text-right">Tax</span>
  //                             <span className="text-right">Amount</span>
  //                           </div>
  //                           {proposal?.services?.invoices?.[0]?.lineItems?.map((item, i) => {
  //                             const rate = Number(item.rate || 0);
  //                             const qty = Number(item.quantity || 1);
  //                             const taxRate = proposal?.services?.invoices?.[0]?.taxRate || 0;
  //                             const base = rate * qty;
  //                             const tax = item.tax ? (base * taxRate) / 100 : 0;
  //                             const total = base + tax;
  //                             return (
  //                               <div key={i} className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] border-t border-gray-200 px-3 py-2 text-sm text-gray-900">
  //                                 <div>
  //                                   <p className="font-semibold">{item.productorService}</p>
  //                                   <p className="text-xs text-gray-500">{item.description}</p>
  //                                 </div>
  //                                 <span className="text-right">${rate.toFixed(2)}</span>
  //                                 <span className="text-right">{qty}</span>
  //                                 <span className="text-right">${tax.toFixed(2)}</span>
  //                                 <span className="text-right">${total.toFixed(2)}</span>
  //                               </div>
  //                             );
  //                           })}
  //                           <div className="border-t border-gray-200 px-3 py-2 flex justify-end text-sm font-bold text-gray-900">
  //                             Total: ${proposal?.services?.invoices?.[0]?.totalAmount?.toFixed(2)}
  //                           </div>
  //                         </div>
  //                       )}
  //                     </div>
  //                     <hr className="border-gray-200 mt-4" />
  //                   </div>
  //                 )}

  //                 {/* PAYMENTS */}
  //                 {proposal?.general?.paymentsEnabled && (
  //                   <div ref={paymentsRef} className="mb-8">
  //                     <h2 className="text-base font-semibold text-gray-900 mb-2">Payments</h2>
  //                     <div className="rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 space-y-1 text-sm text-gray-900">
  //                       <p><span className="font-semibold">Method:</span> {proposal?.payments?.method}</p>
  //                       <p><span className="font-semibold">Amount:</span> ${proposal?.payments?.amount}</p>
  //                     </div>
  //                     <hr className="border-gray-200 mt-4" />
  //                   </div>
  //                 )}

  //                 {/* SIGNATURE SECTION */}
  //                 <div ref={signatureRef} className="mb-8 max-w-lg">
  //                   <h2 className="text-base font-semibold text-gray-900 mb-2">Sign & Accept</h2>
  //                   <hr className="border-gray-200 mb-4" />

  //                   {proposal?.status === "Signed" ? (
  //                     <div className="space-y-4">
  //                       <div className="flex items-center gap-2 text-sm text-gray-500">
  //                         <CheckCircle size={15} className="text-green-500" />
  //                         Signed on {new Date(proposal.signedAt).toLocaleString()}
  //                       </div>
  //                       <p className="text-sm font-semibold text-gray-900">Signature:</p>
  //                       {proposal?.signature?.startsWith("data:image") ? (
  //                         <img
  //                           src={proposal.signature}
  //                           alt="signature"
  //                           className="max-w-xs rounded-lg border border-gray-200 bg-white p-2 mt-1"
  //                         />
  //                       ) : (
  //                         <div className="rounded-lg border border-gray-200 bg-gray-50/30 px-5 py-4 text-2xl font-[cursive] text-gray-900 mt-1">
  //                           {proposal.signature}
  //                         </div>
  //                       )}
  //                       <button
  //                         disabled
  //                         className="rounded-lg bg-blue-600/50 px-4 py-2 text-sm font-semibold text-white cursor-not-allowed opacity-60 mt-2"
  //                       >
  //                         Already Signed
  //                       </button>
  //                     </div>
  //                   ) : (
  //                     <div className="space-y-5">
  //                       {/* Toggle */}
  //                       <div className="flex rounded-lg border border-gray-200 overflow-hidden w-fit">
  //                         {["draw", "type"].map((t) => (
  //                           <button
  //                             key={t}
  //                             type="button"
  //                             onClick={() => setSignatureType(t)}
  //                             className={`px-5 py-2 text-sm font-medium transition-colors ${
  //                               signatureType === t
  //                                 ? "bg-blue-600 text-white"
  //                                 : "bg-white text-gray-700 hover:bg-gray-50"
  //                             }`}
  //                           >
  //                             {t === "draw" ? "Draw" : "Type"}
  //                           </button>
  //                         ))}
  //                       </div>

  //                       {/* Draw */}
  //                       {signatureType === "draw" && (
  //                         <div className="space-y-3">
  //                           <div className="rounded-lg border border-gray-200 bg-gray-50/30 overflow-hidden">
  //                             <SignatureCanvas
  //                               ref={sigCanvas}
  //                               penColor="black"
  //                               canvasProps={{
  //                                 width: 500,
  //                                 height: 200,
  //                                 className: "w-full",
  //                                 style: { background: "transparent" },
  //                               }}
  //                             />
  //                           </div>
  //                           <div className="flex gap-2">
  //                             <button
  //                               type="button"
  //                               onClick={() => sigCanvas.current.clear()}
  //                               className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
  //                             >
  //                               Clear
  //                             </button>
  //                             <button
  //                               type="button"
  //                               onClick={() => {
  //                                 if (sigCanvas.current.isEmpty()) {
  //                                   toast.warning("Please draw your signature first");
  //                                   return;
  //                                 }
  //                                 setSignatureData(sigCanvas.current.toDataURL("image/png"));
  //                               }}
  //                               className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
  //                             >
  //                               Save Signature
  //                             </button>
  //                           </div>
  //                           {signatureData && (
  //                             <div className="space-y-1.5">
  //                               <div className="flex items-center gap-1.5 text-sm text-green-600">
  //                                 <CheckCircle size={14} />
  //                                 Signature saved successfully
  //                               </div>
  //                               <img
  //                                 src={signatureData}
  //                                 alt="preview"
  //                                 className="max-w-xs rounded-lg border border-gray-200 bg-white p-2"
  //                               />
  //                             </div>
  //                           )}
  //                         </div>
  //                       )}

  //                       {/* Type */}
  //                       {signatureType === "type" && (
  //                         <div className="space-y-3">
  //                           <input
  //                             type="text"
  //                             placeholder="Type your full name"
  //                             value={typedSignature}
  //                             onChange={(e) => setTypedSignature(e.target.value)}
  //                             className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-2xl font-[cursive] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
  //                           />
  //                           {typedSignature && (
  //                             <div className="rounded-lg border border-gray-200 bg-gray-50/30 px-5 py-5 text-2xl font-[cursive] text-gray-900">
  //                               {typedSignature}
  //                             </div>
  //                           )}
  //                         </div>
  //                       )}

  //                       {/* Terms checkbox */}
  //                       <label className="flex items-start gap-2.5 cursor-pointer select-none mt-2">
  //                         <input
  //                           type="checkbox"
  //                           checked={termsAccepted}
  //                           onChange={(e) => setTermsAccepted(e.target.checked)}
  //                           disabled={proposal?.status === "Signed"}
  //                           className="mt-1 accent-blue-600"
  //                         />
  //                         <span className="text-sm text-gray-900">I accept the Terms & Conditions</span>
  //                       </label>

  //                       {/* Complete */}
  //                       <button
  //                         type="button"
  //                         disabled={
  //                           isSigning ||
  //                           !termsAccepted ||
  //                           (signatureType === "draw" ? !signatureData : !typedSignature) ||
  //                           proposal?.status === "Signed"
  //                         }
  //                         onClick={handleCompleteProposal}
  //                         className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
  //                       >
  //                         {isSigning ? "Saving..." : "Complete Proposal"}
  //                       </button>
  //                     </div>
  //                   )}
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </>
  //     )}
  //   </>
  // );
};

export default ProposalPreviewDialog;