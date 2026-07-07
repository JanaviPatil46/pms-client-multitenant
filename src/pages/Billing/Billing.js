import { NavLink, Outlet } from "react-router-dom";
import { Receipt, CreditCard } from "lucide-react";

export default function BillingLayout() {
  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="border-b bg-background">
        <div className="px-6 pt-5">
          <h1 className="text-2xl font-semibold">Billing</h1>
          <p className="text-sm text-muted-foreground">
            Manage invoices and payment history.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-2 px-6">
          <NavLink
            to="/billing/invoices"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition
              ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <Receipt size={16} />
            Invoices
          </NavLink>

          <NavLink
            to="/billing/payments"
            className={({ isActive }) =>
              `flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition
              ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <CreditCard size={16} />
            Payments
          </NavLink>
        </div>
      </div>

      {/* Child Pages */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>

    </div>
  );
}