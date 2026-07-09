import { useLocation, useNavigate } from "react-router-dom";

import axios from "axios";
import { useState,useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { CreditCard, ChevronLeft } from "lucide-react";

// ✅ ONLY ADDED THIS
import { invoiceAPI,accountsAPI } from "../../services/api";

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
console.log("Selected Invoices:", selectedInvoices);
const [account, setAccount] = useState(null);
const [accountLoading, setAccountLoading] = useState(false);
  const [accountId] = useState(sessionStorage.getItem("accountId"));
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
  console.log("Selected Invoices:", selectedInvoices);
const accountCredit = account?.creaditAval || 0;

const [applyCredit, setApplyCredit] = useState(true);

const invoiceTotal = selectedInvoices.reduce(
  (sum, invoice) => sum + invoice.balanceDueAmount,
  0
);

const creditApplied = applyCredit
  ? Math.min(accountCredit, invoiceTotal)
  : 0;

const amountToPay = invoiceTotal - creditApplied;
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
      (sum, row) => sum + row.balanceDueAmount,
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
          (invoice.paidAmount || 0) + invoice.balanceDueAmount;

        const date = new Date();
        const formattedDate = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        return invoiceAPI.updateInvoice(invoice._id, {
          // paidAmount: newPaidAmount,
          // invoiceStatus: "Paid",
          // lastPaid: formattedDate,
          // active: "true",
            paidAmount: newPaidAmount,
  balanceDueAmount: 0,
  invoiceStatus: "Paid",
  lastPaid: formattedDate,
  //paymentMethod: selectedInvoices || "",
paymentMethod: invoice.paymentMethod || "",
  creditApplied, // <-- important
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

        navigate("/billing/invoices");
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

  const totalAmount = selectedInvoices.reduce((sum, row) => sum + row.balanceDueAmount, 0);
  return (
    

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
                  ${row.balanceDueAmount.toFixed(2)}
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

    <div className="rounded-2xl border bg-card p-5 max-w-lg space-y-4">

    <div className="flex justify-between">
        <span>Invoice Total</span>
        <span className="font-semibold">
            ${invoiceTotal.toFixed(2)}
        </span>
    </div>

    <div className="flex items-center justify-between">

        <div>
            <label className="font-medium">
                Apply Credit
            </label>

            <p className="text-xs text-muted-foreground">
                Available ${accountCredit.toFixed(2)}
            </p>
        </div>

        <input
            type="checkbox"
            checked={applyCredit}
            onChange={(e)=>setApplyCredit(e.target.checked)}
        />

    </div>

    <div className="flex justify-between text-green-600">
        <span>Credit Applied</span>
        <span>
            -${creditApplied.toFixed(2)}
        </span>
    </div>

    <hr />

    <div className="flex justify-between text-lg font-bold">
        <span>Total To Pay</span>
        <span>
            ${amountToPay.toFixed(2)}
        </span>
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