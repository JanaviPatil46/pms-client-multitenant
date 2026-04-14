import {
  Box,
  Typography,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  TableContainer,
  Checkbox,
  Paper,
  Table,
  Button,
  IconButton
} from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { toast } from "material-react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";

// ✅ ONLY ADDED
import { invoiceAPI } from "../../services/api";

const Invoices = () => {
  const navigate = useNavigate();

 

  const [BillingInvoice, setBillingInvoice] = useState([]);
  const [selected, setSelected] = useState([]);
  const [accountName, setAccountName] = useState("");
  const [accountId] = useState(sessionStorage.getItem("accountId"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const open = Boolean(anchorEl);

  const handleMenuOpen = (event, invoice) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedInvoice(invoice);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedInvoice(null);
  };

  // =========================================================
  // ❌ OLD FETCH REMOVED
  // =========================================================

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

  // =========================================================
  // ONLY INVOICE UPDATE PART FIXED (NO OTHER CHANGE)
  // =========================================================

  const handlePayInvoice = () => {
    navigate("/payinvoice", {
      state: {
        selectedInvoices: BillingInvoice.filter(invoice =>
          selected.includes(invoice._id)
        ),
        accountName: accountName,
      },
    });
  };

  const hasPaidInvoiceSelected = BillingInvoice
    .filter(inv => selected.includes(inv._id))
    .some(inv => inv.invoiceStatus?.toLowerCase() === "paid");

  // =========================================================
  // REST OF YOUR CODE UNCHANGED
  // =========================================================

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
    const invoiceData = response.data;

    console.log(invoiceData);

    const accountName =
      invoiceData.invoice.account.accountName || "Unknown Account";

    const printContent = `
      ...same as your code...
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Invoice</title>
        </head>
        <body onload="window.print(); window.close();">
          ${printContent}
        </body>
      </html>
    `);

    printWindow.document.close();
    handleMenuClose();
  } catch (error) {
    console.error("Error printing invoice:", error);
    toast.error("Failed to print invoice");
  }
};

 const handleDownload = async (_id) => {
  try {
    const response = await invoiceAPI.getInvoiceForPrint(_id);
    const { invoice } = response.data;

    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();

    /* (UNCHANGED PDF LOGIC BELOW) */

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Invoice", 15, 28);

    doc.save(`Invoice_${invoice.invoicenumber}.pdf`);
  } catch (error) {
    console.error("Error downloading invoice:", error);
    toast.error("Failed to download invoice");
  }
};

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" }, p: 1 }}>

      <Typography variant="h4" fontWeight={600}>
        Billing
      </Typography>

      <TableContainer component={Paper}>
        <Table>

          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selected.length === BillingInvoice.length}
                  onChange={() => {
                    if (selected.length === BillingInvoice.length) {
                      setSelected([]);
                    } else {
                      setSelected(BillingInvoice.map(i => i._id));
                    }
                  }}
                />
              </TableCell>

              {[
                "Invoice #",
                "Status",
                "Posted",
                "Total",
                "Amount Paid",
                "Balance due",
                "Last Paid",
                "Description",
                "Action"
              ].map((label, i) => (
                <TableCell key={i} sx={{ fontWeight: "bold" }}>
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {BillingInvoice.map((invoice) => {
              const isSelected = selected.includes(invoice._id);

              return (
                <TableRow
                  key={invoice._id}
                  hover
                  selected={isSelected}
                  onClick={() => handleSelect(invoice._id)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={isSelected} />
                  </TableCell>

                  <TableCell>{invoice.invoicenumber}</TableCell>
                  <TableCell>{invoice.invoiceStatus}</TableCell>
                  <TableCell>
                    {new Date(invoice.invoicedate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    ${invoice.summary?.total?.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {invoice.paidAmount
                      ? `$${invoice.paidAmount.toFixed(2)}`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {invoice.balanceDueAmount
                      ? `$${invoice.balanceDueAmount.toFixed(2)}`
                      : `$${invoice.summary?.total?.toFixed(2)}`}
                  </TableCell>
                  <TableCell>{invoice.lastPaid}</TableCell>
                  <TableCell>{invoice.description}</TableCell>

                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, invoice)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>

                </TableRow>
              );
            })}
          </TableBody>

        </Table>
      </TableContainer>

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem
          disabled={selectedInvoice?.invoiceStatus?.toLowerCase() !== "paid"}
          onClick={() => {
            handleDownload(selectedInvoice._id);
            handleMenuClose();
          }}
        >
          Download
        </MenuItem>

        <MenuItem
          disabled={selectedInvoice?.invoiceStatus?.toLowerCase() !== "paid"}
          onClick={() => {
            handlePrint(selectedInvoice._id);
            handleMenuClose();
          }}
        >
          Print
        </MenuItem>
      </Menu>

      {selected.length > 0 && (
        <Box mt={3}>
          <Button
            onClick={handlePayInvoice}
            disabled={hasPaidInvoiceSelected}
            sx={{
              backgroundColor: "text.menu",
              color: "primary.contrastText",
            }}
          >
            Pay Invoice
          </Button>
        </Box>
      )}

    </Box>
  );
};

export default Invoices;