import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
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
    <div className="space-y-4">
         
    <Card className="rounded-xl border shadow-sm overflow-hidden">
    
  
    
  

  <div className="overflow-x-auto">
    <Table>

      <TableHeader className="bg-gray-100">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>

            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}

          </TableRow>
        ))}
      </TableHeader>

      <TableBody>

        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="hover:bg-gray-50 transition-colors"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className="px-4 py-3 text-sm"
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-32 text-center text-gray-500"
            >
              No payments found.
            </TableCell>
          </TableRow>
        )}

      </TableBody>

    </Table>
  </div>

</Card>
  
    </div>
  );
};

export default Payment
