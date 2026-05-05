import { useLocation, useNavigate } from "react-router-dom";

import axios from "axios";
import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { CreditCard, ChevronLeft } from "lucide-react";

// ✅ ONLY ADDED THIS
import { invoiceAPI } from "../../services/api";

const PayInvoice = () => {
  const toast =useToast()
  const accountHolderTypeOptions = [
    { label: "Individual", value: "individual" },
    { label: "Business", value: "business" },
  ];

  const accountTypeOptions = [
    { label: "Checking", value: "checking" },
    { label: "Savings", value: "savings" },
  ];

  const location = useLocation();
  const { selectedInvoices = [], accountName = "" } = location.state || {};

    const [routingNumber,setRoutingNumber]=useState("000000013")
  const [accountNumber,setAccountNumber]=useState("1100000005")
  const [selectedAccountHolderType, setSelectedAccountHolderType] =
    useState(accountHolderTypeOptions[0]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [selectedAccountType, setSelectedAccountType] = useState(
    accountTypeOptions[0]
  );

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleAccountHolderTypeChange = (_, value) => {
    setSelectedAccountHolderType(value);
  };

  const handleAccountTypeChange = (_, value) => {
    setSelectedAccountType(value);
  };

  const handleConfirmPayment = async () => {
    const newErrors = {};

    // ===== VALIDATION =====
    if (selectedAccountHolderType?.value === "individual") {
      if (!firstName.trim())
        newErrors.firstName = "First name is required";
      if (!lastName.trim())
        newErrors.lastName = "Last name is required";
    }

    if (selectedAccountHolderType?.value === "business") {
      if (!companyName.trim())
        newErrors.companyName = "Company name is required";
    }

    if (!routingNumber.trim()) {
      newErrors.routingNumber = "Routing number is required";
    } else if (!/^\d{9}$/.test(routingNumber.trim())) {
      newErrors.routingNumber = "Routing number must be 9 digits";
    }

    if (!accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required";
    } else if (accountNumber.trim().length < 6) {
      newErrors.accountNumber =
        "Account number must be at least 6 digits";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return toast.error("Please correct the highlighted errors");
    }

    setErrors({});

    const totalAmount = selectedInvoices.reduce(
      (sum, row) => sum + row.summary.total,
      0
    );

    let method;

    if (selectedAccountHolderType?.value === "business") {
      method = {
        type: "bank",
        routing_number: routingNumber,
        account_number: accountNumber,
        account_type:
          selectedAccountType?.value?.toUpperCase() || "CHECKING",
        name: companyName,
        account_holder_type: "business",
      };
    } else {
      method = {
        type: "bank",
        routing_number: routingNumber,
        account_number: accountNumber,
        account_type:
          selectedAccountType?.value?.toUpperCase() || "CHECKING",
        given_name: firstName,
        surname: lastName,
      };
    }

   const chargeData = {
    amount: totalAmount * 100,
    account_id: "3A7Sk7IGQ6eu3I5aVRh5hA", // TODO: Provide the actual ACH account ID
    method,
  };

  const secretKey = 'nKvexjXcQ2-xo3DmtPaSHgj2cG3zaej5jrsH16S01UfX1Gh75kx6q9D7GggOjATb'; // TODO: Insert your AffiniPay secret key
  const auth = btoa(`${secretKey}:`);

    try {
      const response = await axios.post(
        "https://api.affinipay.com/v1/charges",
        chargeData,
        {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Payment success:", response.data);

      // ================= ONLY CHANGED PART (INVOICE UPDATE) =================
      const updatePromises = selectedInvoices.map((invoice) => {
        const newPaidAmount =
          (invoice.paidAmount || 0) + invoice.summary.total;

        const date = new Date();
        const formattedDate = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        return invoiceAPI.updateInvoice(invoice._id, {
          paidAmount: newPaidAmount,
          invoiceStatus: "Paid",
          lastPaid: formattedDate,
          active: "true",
        });
      });

      const results = await Promise.all(updatePromises);

      const allSuccess = results.every(
        (res) =>
          res &&
          res.data?.message ===
            "Invoice Updated successfully"
      );

      if (allSuccess) {
        toast.success(
          "Payment successful and all invoices updated!"
        );

        navigate("/billing");
      } else {
        toast.error(
          "Payment succeeded but some invoices failed to update"
        );
      }
    } catch (error) {
      console.error(
        "Payment error:",
        error.response?.data || error.message
      );
      alert("Payment failed!");
    }
  };
const fieldClass = (err) =>
    `w-full rounded-lg border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 ${err ? "border-destructive" : "border-border"}`;

  const totalAmount = selectedInvoices.reduce((sum, row) => sum + row.summary.total, 0);
  return (
    // <Box
    //   sx={{
    //     width: "100%",
    //     maxWidth: { sm: "100%", md: "1700px" },
    //     flexGrow: 1,
    //     p: 1,
    //   }}
    // >
    //   <Typography variant="h4" gutterBottom>
    //     Paying Invoices
    //   </Typography>

    //   <Box sx={{ mb: 3 }}>
    //     <InputLabel sx={{ fontWeight: "bold", mb: 0.5 }}>
    //       Client
    //     </InputLabel>
    //     <Typography variant="subtitle1">
    //       {accountName}
    //     </Typography>
    //   </Box>

    //   <Table>
    //     <TableHead>
    //       <TableRow>
    //         <TableCell>Invoice #</TableCell>
    //         <TableCell>Status</TableCell>
    //         <TableCell>Amount</TableCell>
    //       </TableRow>
    //     </TableHead>

    //     <TableBody>
    //       {selectedInvoices.map((row) => (
    //         <TableRow key={row._id}>
    //           <TableCell>{row.invoicenumber}</TableCell>
    //           <TableCell>{row.invoiceStatus}</TableCell>
    //           <TableCell>
    //             ${row.summary.total.toFixed(2)}
    //           </TableCell>
    //         </TableRow>
    //       ))}
    //     </TableBody>
    //   </Table>

    //   <Box sx={{ mt: 3 }}>
    //     <strong>Total Amount:</strong>{" "}
    //     {selectedInvoices
    //       .reduce((sum, row) => sum + row.summary.total, 0)
    //       .toFixed(2)}
    //   </Box>

    //   <Divider sx={{ my: 3 }} />

    //   <Typography variant="h5" gutterBottom>
    //     Payment Details
    //   </Typography>

    //   <Box mt={2}>
    //     <InputLabel>Routing Number</InputLabel>
    //     <TextField
    //       fullWidth
    //       size="small"
    //       value={routingNumber}
    //       sx={{ mb: 2 }}
    //     />

    //     <InputLabel>Bank Account Number</InputLabel>
    //     <TextField
    //       fullWidth
    //       size="small"
    //       value={accountNumber}
    //       sx={{ mb: 2 }}
    //     />

    //     <InputLabel>Account Holder Type</InputLabel>
    //     <Autocomplete
    //       options={accountHolderTypeOptions}
    //       value={selectedAccountHolderType}
    //       onChange={handleAccountHolderTypeChange}
    //       getOptionLabel={(option) => option.label}
    //       renderInput={(params) => (
    //         <TextField
    //           {...params}
    //           placeholder="Account Holder Type"
    //         />
    //       )}
    //     />

    //     {selectedAccountHolderType?.value === "individual" && (
    //       <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
    //         <TextField
    //           fullWidth
    //           placeholder="First Name"
    //           size="small"
    //           value={firstName}
    //           error={!!errors.firstName}
    //           helperText={errors.firstName}
    //           onChange={(e) =>
    //             setFirstName(e.target.value)
    //           }
    //         />

    //         <TextField
    //           fullWidth
    //           placeholder="Last Name"
    //           size="small"
    //           value={lastName}
    //           error={!!errors.lastName}
    //           helperText={errors.lastName}
    //           onChange={(e) =>
    //             setLastName(e.target.value)
    //           }
    //         />
    //       </Box>
    //     )}

    //     {selectedAccountHolderType?.value === "business" && (
    //       <TextField
    //         fullWidth
    //         placeholder="Company Name"
    //         size="small"
    //         value={companyName}
    //         error={!!errors.companyName}
    //         helperText={errors.companyName}
    //         sx={{ mt: 2 }}
    //         onChange={(e) =>
    //           setCompanyName(e.target.value)
    //         }
    //       />
    //     )}

    //     <InputLabel sx={{ mt: 2 }}>
    //       Account Type
    //     </InputLabel>

    //     <Autocomplete
    //       options={accountTypeOptions}
    //       value={selectedAccountType}
    //       onChange={handleAccountTypeChange}
    //       getOptionLabel={(option) => option.label}
    //       renderInput={(params) => (
    //         <TextField {...params} placeholder="Account Type" />
    //       )}
    //     />
    //   </Box>

    //   <Box mt={4} display="flex" gap={2}>
    //     <Button
    //       variant="outlined"
    //       onClick={() => window.history.back()}
    //     >
    //       Cancel
    //     </Button>

    //     <Button
    //       size="small"
    //       sx={{
    //         backgroundColor: "text.menu",
    //         color: "primary.contrastText",
    //         "&:hover": {
    //           backgroundColor: "menu.dark",
    //           boxShadow: 1,
    //         },
    //       }}
    //       onClick={handleConfirmPayment}
    //     >
    //       Confirm Payment
    //     </Button>
    //   </Box>
    // </Box>
    //  <div className="w-full max-w-[1700px] flex-1 h-[90vh] overflow-auto">
    //   <div className="p-4 sm:p-6 flex flex-col gap-6">

    //   {/* Header */}
    //   <div className="flex flex-col gap-1">
    //     <div className="flex items-center gap-2.5">
    //       <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
    //         <CreditCard size={16} className="text-primary" strokeWidth={1.8} />
    //       </div>
    //       <h1 className="text-2xl font-semibold tracking-tight text-foreground">Pay Invoices</h1>
    //     </div>
    //     {accountName && (
    //       <p className="text-[13px] text-muted-foreground pl-10">
    //         Paying as <span className="font-semibold text-foreground">{accountName}</span>
    //       </p>
    //     )}
    //   </div>

    //   {/* Invoice table */}
    //   <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
    //     <div className="px-4 py-3 border-b border-border bg-muted/30">
    //       <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-widest">Selected Invoices</p>
    //     </div>
    //     <div className="overflow-x-auto">
    //       <table className="w-full text-sm">
    //         <thead>
    //           <tr className="border-b border-border bg-muted/20">
    //             {["Invoice #", "Status", "Amount"].map((h) => (
    //               <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">{h}</th>
    //             ))}
    //           </tr>
    //         </thead>
    //         <tbody className="divide-y divide-border">
    //           {selectedInvoices.map((row) => (
    //             <tr key={row._id} className="hover:bg-muted/30 transition-colors">
    //               <td className="px-4 py-3 font-medium text-foreground">{row.invoicenumber}</td>
    //               <td className="px-4 py-3 text-muted-foreground">{row.invoiceStatus}</td>
    //               <td className="px-4 py-3 font-medium text-foreground">${row.summary.total.toFixed(2)}</td>
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     </div>
    //     <div className="flex justify-end px-4 py-3 border-t border-border bg-muted/20 text-sm font-semibold text-foreground">
    //       Total: ${totalAmount.toFixed(2)}
    //     </div>
    //   </div>

    //   {/* Payment Details */}
    //   <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden max-w-lg">
    //     <div className="px-5 py-3.5 border-b border-border bg-muted/30">
    //       <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-widest">Payment Details</p>
    //     </div>
    //     <div className="p-5 space-y-4">

    //     {/* Routing Number */}
    //     <div>
    //       <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
    //         Routing Number
    //       </label>
    //       <input
    //         type="text"
    //         placeholder="Routing Number"
    //         value={routingNumber}
    //         className={fieldClass(errors.routingNumber)}
    //         readOnly
    //       />
    //       {errors.routingNumber && (
    //         <p className="mt-1 text-xs text-destructive">{errors.routingNumber}</p>
    //       )}
    //     </div>

    //     {/* Account Number */}
    //     <div>
    //       <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
    //         Bank Account Number
    //       </label>
    //       <input
    //         type="text"
    //         placeholder="Account Number"
    //         value={accountNumber}
    //         className={fieldClass(errors.accountNumber)}
    //         readOnly
    //       />
    //       {errors.accountNumber && (
    //         <p className="mt-1 text-xs text-destructive">{errors.accountNumber}</p>
    //       )}
    //     </div>

    //     {/* Account Holder Type */}
    //     <div>
    //       <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
    //         Account Holder Type
    //       </label>
    //       <select
    //         value={selectedAccountHolderType?.value}
    //         onChange={(e) => {
    //           const found = accountHolderTypeOptions.find((o) => o.value === e.target.value);
    //           setSelectedAccountHolderType(found);
    //         }}
    //         className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
    //       >
    //         {accountHolderTypeOptions.map((o) => (
    //           <option key={o.value} value={o.value}>{o.label}</option>
    //         ))}
    //       </select>
    //     </div>

    //     {/* Individual fields */}
    //     {selectedAccountHolderType?.value === "individual" && (
    //       <div className="flex flex-col sm:flex-row gap-3">
    //         <div className="flex-1">
    //           <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
    //             First Name
    //           </label>
    //           <input
    //             type="text"
    //             placeholder="First Name"
    //             value={firstName}
    //             onChange={(e) => setFirstName(e.target.value)}
    //             className={fieldClass(errors.firstName)}
    //           />
    //           {errors.firstName && (
    //             <p className="mt-1 text-xs text-destructive">{errors.firstName}</p>
    //           )}
    //         </div>
    //         <div className="flex-1">
    //           <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
    //             Last Name
    //           </label>
    //           <input
    //             type="text"
    //             placeholder="Last Name"
    //             value={lastName}
    //             onChange={(e) => setLastName(e.target.value)}
    //             className={fieldClass(errors.lastName)}
    //           />
    //           {errors.lastName && (
    //             <p className="mt-1 text-xs text-destructive">{errors.lastName}</p>
    //           )}
    //         </div>
    //       </div>
    //     )}

    //     {/* Business field */}
    //     {selectedAccountHolderType?.value === "business" && (
    //       <div>
    //         <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
    //           Company Name
    //         </label>
    //         <input
    //           type="text"
    //           placeholder="Company Name"
    //           value={companyName}
    //           onChange={(e) => setCompanyName(e.target.value)}
    //           className={fieldClass(errors.companyName)}
    //         />
    //         {errors.companyName && (
    //           <p className="mt-1 text-xs text-destructive">{errors.companyName}</p>
    //         )}
    //       </div>
    //     )}

    //     {/* Account Type */}
    //     <div>
    //       <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
    //         Account Type
    //       </label>
    //       <select
    //         value={selectedAccountType?.value}
    //         onChange={(e) => {
    //           const found = accountTypeOptions.find((o) => o.value === e.target.value);
    //           setSelectedAccountType(found);
    //         }}
    //         className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
    //       >
    //         {accountTypeOptions.map((o) => (
    //           <option key={o.value} value={o.value}>{o.label}</option>
    //         ))}
    //       </select>
    //     </div>
    //     </div>
    //   </div>

    //   {/* Actions */}
    //   <div className="flex items-center gap-3">
    //     <button
    //       type="button"
    //       onClick={() => window.history.back()}
    //       className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2.5 text-[13px] font-medium text-foreground hover:bg-muted active:scale-[0.98] transition-all duration-150"
    //     >
    //       <ChevronLeft size={14} />
    //       Cancel
    //     </button>
    //     <button
    //       type="button"
    //       onClick={handleConfirmPayment}
    //       className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all duration-150 shadow-sm"
    //     >
    //       <CreditCard size={14} />
    //       Confirm Payment
    //     </button>
    //   </div>
    //   </div>
    // </div>

    <div className="w-full max-w-[1700px] flex-1 h-[90vh] overflow-auto bg-background text-foreground">
  <div className="p-4 sm:p-6 flex flex-col gap-6">

    {/* Header */}
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shadow-sm">
          <CreditCard size={16} className="text-primary" strokeWidth={1.8} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Pay Invoices</h1>
      </div>
      {accountName && (
        <p className="text-[13px] text-muted-foreground pl-11">
          Paying as{" "}
          <span className="font-semibold text-foreground">{accountName}</span>
        </p>
      )}
    </div>

    {/* Invoice table */}
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/40">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
          Selected Invoices
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {["Invoice #", "Status", "Amount"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border/60">
            {selectedInvoices.map((row) => (
              <tr
                key={row._id}
                className="transition-colors hover:bg-muted/40"
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {row.invoicenumber}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {row.invoiceStatus}
                </td>
                <td className="px-4 py-3 font-semibold text-foreground">
                  ${row.summary.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end px-4 py-3 border-t border-border bg-muted/30 text-sm font-semibold">
        Total: ${totalAmount.toFixed(2)}
      </div>
    </div>

    {/* Payment Details */}
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden max-w-lg">
      <div className="px-5 py-3.5 border-b border-border bg-muted/40">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
          Payment Details
        </p>
      </div>

      <div className="p-5 space-y-4">

        {/* Routing Number */}
        <div>
          <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Routing Number
          </label>
          <input
            type="text"
            placeholder="Routing Number"
            value={routingNumber}
            className={fieldClass(errors.routingNumber)}
            readOnly
          />
          {errors.routingNumber && (
            <p className="mt-1 text-xs text-destructive">
              {errors.routingNumber}
            </p>
          )}
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Bank Account Number
          </label>
          <input
            type="text"
            placeholder="Account Number"
            value={accountNumber}
            className={fieldClass(errors.accountNumber)}
            readOnly
          />
          {errors.accountNumber && (
            <p className="mt-1 text-xs text-destructive">
              {errors.accountNumber}
            </p>
          )}
        </div>

        {/* Account Holder Type */}
        <div>
          <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Account Holder Type
          </label>
          <select
            value={selectedAccountHolderType?.value}
            onChange={(e) => {
              const found = accountHolderTypeOptions.find(
                (o) => o.value === e.target.value
              );
              setSelectedAccountHolderType(found);
            }}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          >
            {accountHolderTypeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Individual fields */}
        {selectedAccountHolderType?.value === "individual" && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                First Name
              </label>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={fieldClass(errors.firstName)}
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={fieldClass(errors.lastName)}
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Business field */}
        {selectedAccountHolderType?.value === "business" && (
          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Company Name
            </label>
            <input
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className={fieldClass(errors.companyName)}
            />
            {errors.companyName && (
              <p className="mt-1 text-xs text-destructive">
                {errors.companyName}
              </p>
            )}
          </div>
        )}

        {/* Account Type */}
        <div>
          <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Account Type
          </label>
          <select
            value={selectedAccountType?.value}
            onChange={(e) => {
              const found = accountTypeOptions.find(
                (o) => o.value === e.target.value
              );
              setSelectedAccountType(found);
            }}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          >
            {accountTypeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>

    {/* Actions */}
    <div className="flex items-center gap-3 pt-2">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-[13px] font-medium hover:bg-muted transition active:scale-[0.98]"
      >
        <ChevronLeft size={14} />
        Cancel
      </button>

      <button
        type="button"
        onClick={handleConfirmPayment}
        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-sm active:scale-[0.98]"
      >
        <CreditCard size={14} />
        Confirm Payment
      </button>
    </div>
  </div>
</div>
  );
};

export default PayInvoice;