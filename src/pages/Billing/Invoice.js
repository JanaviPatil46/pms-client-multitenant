// import {
//   Box,
//   Typography,
//   TableCell,
//   TableBody,
//   TableHead,
//   TableRow,
//   TableContainer,
//   Checkbox,
//   Paper,
//   Table,
//   Button,
//   IconButton
// } from "@mui/material";
// import axios from "axios";
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import { toast } from "material-react-toastify";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import "jspdf-autotable";

// // ✅ ONLY ADDED
// import { invoiceAPI } from "../../services/api";

// const Invoices = () => {
//   const navigate = useNavigate();

//   const [BillingInvoice, setBillingInvoice] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [accountName, setAccountName] = useState("");
//   const [accountId] = useState(sessionStorage.getItem("accountId"));

//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedInvoice, setSelectedInvoice] = useState(null);

//   const open = Boolean(anchorEl);

//   const handleMenuOpen = (event, invoice) => {
//     event.stopPropagation();
//     setAnchorEl(event.currentTarget);
//     setSelectedInvoice(invoice);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedInvoice(null);
//   };

//   // =========================================================
//   // ❌ OLD FETCH REMOVED
//   // =========================================================

//   const fetchidwiseData = async (accountId) => {
//     try {
//       const response = await invoiceAPI.getInvoiceListByAccountId(accountId);

//       const data = response.data;

//       console.log("invoices", data);
//       setBillingInvoice(data.invoice);
//     } catch (error) {
//       console.error("Error fetching task templates:", error);
//     }
//   };

//   useEffect(() => {
//     fetchidwiseData(accountId);
//   }, [accountId]);

//   // =========================================================
//   // ONLY INVOICE UPDATE PART FIXED (NO OTHER CHANGE)
//   // =========================================================

//   const handlePayInvoice = () => {
//     navigate("/payinvoice", {
//       state: {
//         selectedInvoices: BillingInvoice.filter(invoice =>
//           selected.includes(invoice._id)
//         ),
//         accountName: accountName,
//       },
//     });
//   };

//   const hasPaidInvoiceSelected = BillingInvoice
//     .filter(inv => selected.includes(inv._id))
//     .some(inv => inv.invoiceStatus?.toLowerCase() === "paid");

//   // =========================================================
//   // REST OF YOUR CODE UNCHANGED
//   // =========================================================

//   const handleSelect = (_id) => {
//     const currentIndex = selected.indexOf(_id);
//     const newSelected =
//       currentIndex === -1
//         ? [...selected, _id]
//         : selected.filter((item) => item !== _id);

//     setSelected(newSelected);
//   };

//   const handlePrint = async (_id) => {
//   try {
//     const response = await invoiceAPI.getInvoiceForPrint(_id);
//     const invoiceData = response.data;

//     console.log(invoiceData);

//     const accountName =
//       invoiceData.invoice.account.accountName || "Unknown Account";

//     const printContent = `
//       ...same as your code...
//     `;

//     const printWindow = window.open("", "_blank");
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Print Invoice</title>
//         </head>
//         <body onload="window.print(); window.close();">
//           ${printContent}
//         </body>
//       </html>
//     `);

//     printWindow.document.close();
//     handleMenuClose();
//   } catch (error) {
//     console.error("Error printing invoice:", error);
//     toast.error("Failed to print invoice");
//   }
// };

//  const handleDownload = async (_id) => {
//   try {
//     const response = await invoiceAPI.getInvoiceForPrint(_id);
//     const { invoice } = response.data;

//     const doc = new jsPDF("p", "mm", "a4");

//     const pageWidth = doc.internal.pageSize.getWidth();

//     /* (UNCHANGED PDF LOGIC BELOW) */

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(24);
//     doc.text("Invoice", 15, 28);

//     doc.save(`Invoice_${invoice.invoicenumber}.pdf`);
//   } catch (error) {
//     console.error("Error downloading invoice:", error);
//     toast.error("Failed to download invoice");
//   }
// };

//   return (
//     <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" }, p: 1 }}>

//       <Typography variant="h4" fontWeight={600}>
//         Billing
//       </Typography>

//       <TableContainer component={Paper}>
//         <Table>

//           <TableHead>
//             <TableRow>
//               <TableCell padding="checkbox">
//                 <Checkbox
//                   checked={selected.length === BillingInvoice.length}
//                   onChange={() => {
//                     if (selected.length === BillingInvoice.length) {
//                       setSelected([]);
//                     } else {
//                       setSelected(BillingInvoice.map(i => i._id));
//                     }
//                   }}
//                 />
//               </TableCell>

//               {[
//                 "Invoice #",
//                 "Status",
//                 "Posted",
//                 "Total",
//                 "Amount Paid",
//                 "Balance due",
//                 "Last Paid",
//                 "Description",
//                 "Action"
//               ].map((label, i) => (
//                 <TableCell key={i} sx={{ fontWeight: "bold" }}>
//                   {label}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {BillingInvoice.map((invoice) => {
//               const isSelected = selected.includes(invoice._id);

//               return (
//                 <TableRow
//                   key={invoice._id}
//                   hover
//                   selected={isSelected}
//                   onClick={() => handleSelect(invoice._id)}
//                 >
//                   <TableCell padding="checkbox">
//                     <Checkbox checked={isSelected} />
//                   </TableCell>

//                   <TableCell>{invoice.invoicenumber}</TableCell>
//                   <TableCell>{invoice.invoiceStatus}</TableCell>
//                   <TableCell>
//                     {new Date(invoice.invoicedate).toLocaleDateString()}
//                   </TableCell>
//                   <TableCell>
//                     ${invoice.summary?.total?.toFixed(2)}
//                   </TableCell>
//                   <TableCell>
//                     {invoice.paidAmount
//                       ? `$${invoice.paidAmount.toFixed(2)}`
//                       : "—"}
//                   </TableCell>
//                   <TableCell>
//                     {invoice.balanceDueAmount
//                       ? `$${invoice.balanceDueAmount.toFixed(2)}`
//                       : `$${invoice.summary?.total?.toFixed(2)}`}
//                   </TableCell>
//                   <TableCell>{invoice.lastPaid}</TableCell>
//                   <TableCell>{invoice.description}</TableCell>

//                   <TableCell onClick={(e) => e.stopPropagation()}>
//                     <IconButton
//                       onClick={(e) => handleMenuOpen(e, invoice)}
//                     >
//                       <MoreVertIcon />
//                     </IconButton>
//                   </TableCell>

//                 </TableRow>
//               );
//             })}
//           </TableBody>

//         </Table>
//       </TableContainer>

//       <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
//         <MenuItem
//           disabled={selectedInvoice?.invoiceStatus?.toLowerCase() !== "paid"}
//           onClick={() => {
//             handleDownload(selectedInvoice._id);
//             handleMenuClose();
//           }}
//         >
//           Download
//         </MenuItem>

//         <MenuItem
//           disabled={selectedInvoice?.invoiceStatus?.toLowerCase() !== "paid"}
//           onClick={() => {
//             handlePrint(selectedInvoice._id);
//             handleMenuClose();
//           }}
//         >
//           Print
//         </MenuItem>
//       </Menu>

//       {selected.length > 0 && (
//         <Box mt={3}>
//           <Button
//             onClick={handlePayInvoice}
//             disabled={hasPaidInvoiceSelected}
//             sx={{
//               backgroundColor: "text.menu",
//               color: "primary.contrastText",
//             }}
//           >
//             Pay Invoice
//           </Button>
//         </Box>
//       )}

//     </Box>
//   );
// };

// export default Invoices;

import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Receipt, CreditCard } from "lucide-react";
// import { toast } from "material-react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";
import { invoiceAPI } from "../../services/api";
import { useToast } from "../../hooks/useToast";

const Invoices = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [BillingInvoice, setBillingInvoice] = useState([]);
  const [selected, setSelected] = useState([]);
  const [accountName, setAccountName] = useState("");
  const [accountId] = useState(sessionStorage.getItem("accountId"));
  const [menuPos, setMenuPos] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const menuRef = useRef(null);

  const open = Boolean(menuPos);

  const handleMenuOpen = (event, invoice) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + window.scrollY,
      left: rect.right + window.scrollX,
    });
    setSelectedInvoice(invoice);
  };

  const handleMenuClose = () => {
    setMenuPos(null);
    setSelectedInvoice(null);
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        handleMenuClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const fetchidwiseData = async (accountId) => {
    try {
      const response = await invoiceAPI.getInvoiceListByAccountId(accountId);
      const data = response.data;
      console.log("invoices", data);
      setBillingInvoice(data.invoice);
    } catch (error) {
      console.error("Error fetching task templates:", error);
    }
  };

  useEffect(() => {
    fetchidwiseData(accountId);
  }, [accountId]);

  const handlePayInvoice = () => {
    navigate("/payinvoice", {
      state: {
        selectedInvoices: BillingInvoice.filter((invoice) =>
          selected.includes(invoice._id),
        ),
        accountName: accountName,
      },
    });
  };

  const hasPaidInvoiceSelected = BillingInvoice.filter((inv) =>
    selected.includes(inv._id),
  ).some((inv) => inv.invoiceStatus?.toLowerCase() === "paid");

  const handleSelect = (_id) => {
    const currentIndex = selected.indexOf(_id);
    const newSelected =
      currentIndex === -1
        ? [...selected, _id]
        : selected.filter((item) => item !== _id);
    setSelected(newSelected);
  };
  const handlePrint = async (_id) => {
    try {
      const response = await invoiceAPI.getInvoiceForPrint(_id);
      const { invoice } = response.data;

      const accountName = invoice.account?.accountName || "Unknown Account";

      const printContent = `
<style>
  body {
    font-family: 'Segoe UI', sans-serif;
    background: #f3f4f6;
    padding: 40px;
  }

  .container {
    max-width: 900px;
    margin: auto;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    position: relative;
  }

  /* HEADER (gradient like PreviewDrawer) */
  .header {
    background: linear-gradient(to right, #f97316, #ea580c);
    padding: 30px;
    color: white;
    display: flex;
    justify-content: space-between;
  }

  .header h1 {
    font-size: 36px;
    margin: 0;
  }

  .badge {
    background: rgba(255,255,255,0.2);
    padding: 8px 14px;
    border-radius: 8px;
    text-align: right;
  }

  .section {
    padding: 24px 30px;
    border-bottom: 1px solid #eee;
  }

  .grid {
    display: flex;
    justify-content: space-between;
    gap: 40px;
  }

  .label {
    font-weight: 600;
    margin-bottom: 6px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    background: #f9fafb;
    padding: 12px;
    text-align: left;
    font-size: 13px;
  }

  td {
    padding: 12px;
    border-top: 1px solid #eee;
  }

  .summary {
    width: 320px;
    margin-left: auto;
    padding: 20px 30px;
  }

  .summary div {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .total {
    font-size: 20px;
    font-weight: bold;
    color: #f97316;
  }

  /* PAID STAMP */
  .paid {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-20deg);
    font-size: 80px;
    color: rgba(220,38,38,0.15);
    border: 6px solid rgba(220,38,38,0.2);
    padding: 20px 50px;
    font-weight: 800;
  }
</style>

<div class="container">

  ${invoice.invoiceStatus === "Paid" ? `<div class="paid">PAID</div>` : ""}

  <div class="header">
    <div>
      <h1>INVOICE</h1>
      <div>Payment Receipt</div>
    </div>
    <div class="badge">
      <div>#${invoice.invoicenumber}</div>
      <small>Invoice Number</small>
    </div>
  </div>

  <div class="section grid">
    <div>
      <div class="label">From</div>
      <div>SNP TAX & FINANCIALS</div>
      <div>silpa@snptaxandfinancials.com</div>
    </div>
    <div>
      <div class="label">To</div>
      <div>${accountName}</div>
    </div>
  </div>

  <div class="section">
    <div><b>Date:</b> ${new Date(invoice.invoicedate).toLocaleDateString()}</div>
    <div><b>Description:</b> ${invoice.description || "-"}</div>
  </div>

  <div class="section">
    <table>
      <thead>
        <tr>
          <th>Service</th>
          <th>Rate</th>
          <th>Qty</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        ${invoice.lineItems
          .map(
            (item) => `
          <tr>
            <td>${item.productorService}</td>
            <td>$${item.rate}</td>
            <td>${item.quantity}</td>
            <td>$${item.amount}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  </div>

  <div class="summary">
    <div><span>Subtotal</span><span>$${invoice.summary.subtotal.toFixed(2)}</span></div>
    <div><span>Tax</span><span>$${invoice.summary.taxTotal.toFixed(2)}</span></div>
    <div class="total"><span>Total</span><span>$${invoice.summary.total.toFixed(2)}</span></div>
  </div>

</div>
`;

      const win = window.open("", "_blank");
      win.document.write(
        `<body onload="window.print();window.close()">${printContent}</body>`,
      );
      win.document.close();
    } catch (err) {
      console.error(err);
    }
  };

  const accountEmail = sessionStorage.getItem("email") || "";

  const handleDownload = async (_id) => {
    try {
      const response = await invoiceAPI.getInvoiceForPrint(_id);
      const { invoice } = response.data;

      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();

      /* HEADER BACKGROUND */
      doc.setFillColor(249, 115, 22);
      doc.rect(0, 0, pageWidth, 35, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("INVOICE", 15, 20);

      doc.setFontSize(10);
      doc.text("Payment Receipt", 15, 27);

      doc.text(`#${invoice.invoicenumber}`, pageWidth - 15, 20, {
        align: "right",
      });

      doc.setTextColor(0, 0, 0);

      /* BILL SECTION */
      doc.setFontSize(11);
      doc.text("From:", 15, 50);
      doc.text("SNP TAX & FINANCIALS", 15, 56);

      doc.text("To:", 120, 50);
      doc.text(invoice.account?.accountName || "Unknown", 120, 56);

      /* DESCRIPTION */
      doc.text(
        `Date: ${new Date(invoice.invoicedate).toLocaleDateString()}`,
        15,
        70,
      );
      doc.text(`Description: ${invoice.description || "-"}`, 15, 78);

      /* TABLE */
      const tableData = invoice.lineItems.map((i) => [
        i.productorService,
        `$${i.rate}`,
        i.quantity,
        `$${i.amount}`,
      ]);

      autoTable(doc, {
        startY: 90,
        head: [["Service", "Rate", "Qty", "Amount"]],
        body: tableData,
      });

      const finalY = doc.lastAutoTable.finalY;

      /* TOTAL */
      doc.setFontSize(12);
      doc.text(
        `Total: $${invoice.summary.total.toFixed(2)}`,
        pageWidth - 15,
        finalY + 15,
        { align: "right" },
      );

      /* ✅ PERFECT PAID WATERMARK */
      if (invoice.invoiceStatus === "Paid") {
        doc.setTextColor(220, 38, 38);
        doc.setFontSize(70);
        doc.setFont("helvetica", "bold");

        doc.text("PAID", pageWidth / 2, 150, {
          align: "center",
          angle: -25,
        });

        doc.setTextColor(0, 0, 0);
      }

      doc.save(`Invoice_${invoice.invoicenumber}.pdf`);
    } catch (err) {
      console.error(err);
    }
  };
  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === "paid")
      return "bg-green-500/15 text-green-700 dark:text-green-400 border border-green-500/30";
    if (s === "unpaid" || s === "overdue")
      return "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30";
    if (s === "pending")
      return "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border border-yellow-500/30";
    return "bg-gray-100 text-gray-600 border border-gray-300";
  };
  return (
    <div className="w-full h-screen bg-background text-foreground flex flex-col">
      <div className="flex-1 overflow-auto p-4 flex flex-col gap-5">
        {/* Page header */}
        {/* <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Receipt size={16} className="text-primary" strokeWidth={1.8} />
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Billing
              </h1>

              {BillingInvoice.length > 0 && (
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground border border-border">
                  {BillingInvoice.length}
                </span>
              )}
            </div>

            <p className="text-[13px] text-muted-foreground pl-10">
              Manage and pay your outstanding invoices.
            </p>
          </div>

          {selected.length > 0 && (
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[12px] text-muted-foreground font-medium">
                {selected.length} selected
              </span>

              <button
                onClick={handlePayInvoice}
                disabled={hasPaidInvoiceSelected}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard size={14} />
                Pay Invoice
              </button>
            </div>
          )}
        </div> */}

        <div>
             {selected.length > 0 && (
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[12px] text-muted-foreground font-medium">
                {selected.length} selected
              </span>

              <button
                onClick={handlePayInvoice}
                disabled={hasPaidInvoiceSelected}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard size={14} />
                Pay Invoice
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="sticky left-0 z-10 bg-muted/40 px-3 py-3.5 text-center w-10">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded accent-primary cursor-pointer"
                      checked={
                        selected.length === BillingInvoice.length &&
                        BillingInvoice.length > 0
                      }
                      onChange={() => {
                        if (selected.length === BillingInvoice.length) {
                          setSelected([]);
                        } else {
                          setSelected(BillingInvoice.map((item) => item._id));
                        }
                      }}
                    />
                  </th>

                  {[
                    "Invoice #",
                    "Status",
                    "Posted",
                    "Total",
                    "Amount Paid",
                    "Balance due",
                    "Last Paid",
                    "Description",
                    "Action",
                  ].map((label, index) => (
                    <th
                      key={index}
                      className="px-4 py-3.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-widest min-w-[100px]"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60">
                {BillingInvoice.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                          <Receipt
                            size={22}
                            className="text-muted-foreground"
                            strokeWidth={1.5}
                          />
                        </div>

                        <p className="text-sm font-medium text-foreground">
                          No invoices found
                        </p>
                        <p className="text-[13px] text-muted-foreground">
                          Your invoices will appear here once created.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  BillingInvoice.map((invoice) => {
                    const isSelected = selected.includes(invoice._id);

                    return (
                      <tr
                        key={invoice._id}
                        onClick={() => handleSelect(invoice._id)}
                        className={`cursor-pointer transition-colors duration-150 hover:bg-muted/40 ${
                          isSelected ? "bg-primary/[0.06]" : ""
                        }`}
                      >
                        <td
                          className="px-3 py-3 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded accent-primary cursor-pointer"
                            checked={isSelected}
                            onChange={() => handleSelect(invoice._id)}
                          />
                        </td>

                        <td className="px-4 py-3 font-medium text-foreground">
                          {invoice.invoicenumber}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(
                              invoice.invoiceStatus,
                            )}`}
                          >
                            {invoice.invoiceStatus || "N/A"}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(invoice.invoicedate).toLocaleDateString()}
                        </td>

                        <td className="px-4 py-3 font-medium text-foreground">
                          ${invoice.summary?.total?.toFixed(2)}
                        </td>

                        <td className="px-4 py-3 text-muted-foreground">
                          {invoice.paidAmount
                            ? `$${invoice.paidAmount.toFixed(2)}`
                            : "—"}
                        </td>

                        <td className="px-4 py-3 text-muted-foreground">
                         ${invoice.summary.total - invoice.paidAmount}
                        </td>

                        <td className="px-4 py-3 text-muted-foreground">
                          {invoice.lastPaid}
                        </td>

                        <td
                          className="px-4 py-3 text-muted-foreground max-w-[180px] truncate"
                          title={invoice.description}
                        >
                          {invoice.description}
                        </td>

                        <td
                          className="px-4 py-3 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            onClick={(e) => handleMenuOpen(e, invoice)}
                          >
                            <MoreVertical size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {open && menuPos && selectedInvoice && (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: menuPos.top,
            left: menuPos.left - 144,
            zIndex: 9999,
          }}
          className="w-36 rounded-lg border border-border bg-card shadow-xl text-sm overflow-hidden"
        >
          <button
            className="w-full px-4 py-2.5 text-left text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={selectedInvoice?.invoiceStatus?.toLowerCase() !== "paid"}
            onClick={() => {
              handleDownload(selectedInvoice._id);
              handleMenuClose();
            }}
          >
            Download
          </button>

          <button
            className="w-full px-4 py-2.5 text-left text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={selectedInvoice?.invoiceStatus?.toLowerCase() !== "paid"}
            onClick={() => {
              handlePrint(selectedInvoice._id);
              handleMenuClose();
            }}
          >
            Print
          </button>
        </div>
      )}
    </div>
  );
};

export default Invoices;
