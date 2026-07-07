import React from 'react'
import { useState } from 'react'
import { useEffect ,useMemo} from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {Card} from "../../components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import dayjs from "dayjs";
import { MoreVertical, Receipt, CreditCard } from "lucide-react";

import { invoiceAPI, accountsAPI } from '../../services/api'
const Payment = () => {
      const [accountId] = useState(sessionStorage.getItem("accountId"));
    const [account, setAccount] = useState(null);
const [accountInvoicesData, setAccountInvoicesData] = useState([]);
const [invoiceLoading, setInvoiceLoading] = useState(false);
const [accountLoading, setAccountLoading] = useState(false);
 const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    if (!accountId) return;

    try {
      setLoading(true);

      const res =
        await invoiceAPI.getOfflinePaymentsByAccountId(accountId);

      setPayments(res.data.payments || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [accountId]);

 const fetchInvoices = async () => {
  if (!accountId) return;

  try {
    setInvoiceLoading(true);

    const res = await invoiceAPI.getInvoiceListByAccountId(accountId);

    const updatedInvoices = await Promise.all(
      (res.data?.invoice || []).map(async (invoice) => {
        const overdue = isInvoiceOverdue(invoice);

        if (overdue && invoice.invoiceStatus !== "Overdue") {
          try {
            await invoiceAPI.updateInvoiceStatus(invoice.invoicenumber, {
              invoiceStatus: "Overdue",
            });

            return {
              ...invoice,
              invoiceStatus: "Overdue",
            };
          } catch (err) {
            console.error(err);
          }
        }

        return invoice;
      })
    );

    setAccountInvoicesData(updatedInvoices);
  } catch (err) {
    console.log(err);
  } finally {
    setInvoiceLoading(false);
  }
};

const fetchAccount = async () => {
  if (!accountId) return;

  try {
    setAccountLoading(true);

    const res = await accountsAPI.getAccountById(accountId);

    setAccount(res.data);
  } catch (err) {
    console.log(err);
  } finally {
    setAccountLoading(false);
  }
};
useEffect(() => {
  if (!accountId) return;

  fetchPayments();
  fetchInvoices();
  fetchAccount();
}, [accountId]);
    const invoiceSummary = accountInvoicesData.reduce(
    (acc, invoice) => {
      const total = Number(invoice.summary?.total || 0);
      const paid = Number(invoice.paidAmount || 0);
      const balance = total - paid;

      acc.totalInvoices += 1;
      acc.totalPaid += paid;
      acc.totalUnpaid += balance > 0 ? balance : 0;
      acc.netDue += balance;

      return acc;
    },
    {
      totalInvoices: 0,
      totalPaid: 0,
      totalUnpaid: 0,
      netDue: 0,
    },
  );
  const availableCredit = account?.creaditAval || 0;
  const columns = useMemo(
    () => [
      {
        accessorKey: "paymentNumber",
        header: "Payment #",
      },
      {
        accessorKey: "paymentDate",
        header: "Date",
        cell: ({ row }) =>
          dayjs(row.original.paymentDate).format("MMM-DD-YYYY"),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;

          return (
            <Badge
              className={
                status === "Successful"
                  ? "bg-green-500 hover:bg-green-500"
                  : status === "Pending"
                  ? "bg-yellow-500 hover:bg-yellow-500"
                  : status === "Refunded"
                  ? "bg-blue-500 hover:bg-blue-500"
                  : "bg-red-500 hover:bg-red-500"
              }
            >
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) =>
          `$${Number(row.original.amount || 0).toFixed(2)}`,
      },
      {
        accessorKey: "paymentMode",
        header: "Payment Method",
      },
      {
        accessorKey: "invoices",
        header: "Invoices Paid",
        cell: ({ row }) =>
          row.original.invoices?.length
            ? row.original.invoices
                .map((item) => item.invoicenumber)
                .join(", ")
            : "-",
      },
      {
        accessorKey: "refundAmt",
        header: "Refund",
        cell: ({ row }) =>
          row.original.refundAmt > 0 ? (
            <span className="text-red-500 font-medium">
              ${Number(row.original.refundAmt).toFixed(2)}
            </span>
          ) : (
            "-"
          ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <div className="max-w-[250px] truncate">
            {row.original.description || "-"}
          </div>
        ),
      },
      {
        accessorKey: "paymentProvider",
        header: "Payment Provider",
        cell: ({ row }) =>
          row.original.paymentProvider || "Offline",
      },
    ],
    []
  );

  const table = useReactTable({
    data: payments,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        Loading...
      </div>
    );
  }

 return (
  <div className="w-full h-screen bg-background text-foreground flex flex-col">
    <div className="flex-1 overflow-auto p-4 flex flex-col gap-5">

      {/* Summary Cards */}
     
      {/* Payment Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">

        <div className="overflow-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="border-b border-border bg-muted/40">

                {table.getHeaderGroups()[0].headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}

              </tr>
            </thead>

            <tbody className="divide-y divide-border/60">

              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3 text-muted-foreground"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-16 text-center"
                  >
                    <div className="flex flex-col items-center gap-3">

                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <CreditCard
                          size={22}
                          className="text-muted-foreground"
                          strokeWidth={1.5}
                        />
                      </div>

                      <p className="text-sm font-medium text-foreground">
                        No payments found
                      </p>

                      <p className="text-[13px] text-muted-foreground">
                        Payment history will appear here once a payment is
                        received.
                      </p>

                    </div>
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  </div>
);
};

export default Payment
