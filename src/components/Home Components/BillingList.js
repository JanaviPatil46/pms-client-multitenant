import React, { useState, useEffect } from "react";
// import Box from "@mui/material/Box";
// import Paper from "@mui/material/Paper";
// import { useTheme } from "@mui/material/styles";
// import { Stack, Typography } from "@mui/material";
// import PaymentIcon from "@mui/icons-material/Payment";
import { useNavigate } from "react-router-dom";
import { invoiceAPI } from "../../services/api"; // ✅ adjust path if needed
import { CreditCard, ArrowRight } from "lucide-react";
const BillingList = ({ accountId }) => {
  // const theme = useTheme();
  const navigate = useNavigate();

  const [billingInvoices, setBillingInvoices] = useState([]);

  const fetchInvoices = async () => {
    try {
      const response = await invoiceAPI.getPendingInvoicesByAccountId(accountId);
console.log("responce",response.data)
      // Axios response structure
      setBillingInvoices(response.data?.invoice || []);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchInvoices();
    }
  }, [accountId]);

  const handlePayInvoice = (invoice) => {
    navigate("/payinvoice", {
      state: {
        selectedInvoices: [invoice],
        accountName: invoice?.account?.accountName,
      },
    });
  };

  return (
    // <>
    //   {billingInvoices.length > 0 && (
    //     <Box>
    //       <Stack
    //         sx={{
    //           display: "flex",
    //           alignItems: "center",
    //           justifyContent: "space-between",
    //           flexDirection: "row",
    //         }}
    //       >
    //         <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
    //           Billing ({billingInvoices.length})
    //         </Typography>
    //       </Stack>

    //       <Box mt={2}>
    //         {billingInvoices.map((invoice) => (
    //           <Stack key={invoice._id} mb={1.5}>
    //             <Paper
    //               onClick={() => handlePayInvoice(invoice)}
    //               sx={{
    //                 p: 2,
    //                 borderRadius: 2,
    //                 boxShadow: 1,
    //                 cursor: "pointer",
    //                 transition: "all 0.3s",
    //                 "&:hover .paysign-link": {
    //                   opacity: 1,
    //                   visibility: "visible",
    //                 },
    //               }}
    //             >
    //               <Box display="flex" alignItems="center" gap={1}>
    //                 <PaymentIcon
    //                   fontSize="small"
    //                   sx={{ color: theme.palette.success.main }}
    //                 />
    //                 <Typography variant="subtitle2">
    //                   Pay Invoice ${invoice?.summary?.total}
    //                 </Typography>
    //               </Box>

    //               <Box
    //                 sx={{
    //                   display: "flex",
    //                   justifyContent: "space-between",
    //                   mt: 1,
    //                 }}
    //               >
    //                 <Typography variant="body2" color="text.secondary">
    //                   # {invoice.invoicenumber}
    //                 </Typography>

    //                 <Typography
    //                   className="paysign-link"
    //                   color="primary"
    //                   variant="subtitle2"
    //                   sx={{
    //                     fontSize: 14,
    //                     opacity: 0,
    //                     visibility: "hidden",
    //                     transition: "all 0.3s",
    //                     fontWeight: 600,
    //                   }}
    //                 >
    //                   Pay
    //                 </Typography>
    //               </Box>
    //             </Paper>
    //           </Stack>
    //         ))}
    //       </Box>
    //     </Box>
    //   )}
    // </>
     <>
      {billingInvoices.length > 0 && (
        <div className="px-5 py-3">
          <div className="flex items-center gap-2 mb-2.5">
            <CreditCard size={13} className="text-emerald-500 shrink-0" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Billing</span>
            <span className="ml-auto text-[11px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
              {billingInvoices.length}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {billingInvoices.map((invoice, index) => (
              <div
                key={index}
                onClick={() => handlePayInvoice(invoice)}
                className="group flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background px-3.5 py-2.5 cursor-pointer hover:bg-muted/50 hover:border-border transition-all duration-200"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <CreditCard size={11} className="text-emerald-500 shrink-0" />
                    <p className="text-[12px] font-semibold text-foreground">Pay Invoice ${invoice.summary.total}</p>
                  </div>
                  <p className="text-[12px] text-muted-foreground mt-0.5"># {invoice.invoicenumber}</p>
                </div>
                <ArrowRight size={13} className="shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default BillingList;