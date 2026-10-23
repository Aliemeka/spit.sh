import { FC } from "react";
import { ReceiptIcon } from "@phosphor-icons/react/dist/ssr";
import { cn, formatUtcDate } from "@/lib/utils";
import { formatPrice } from "@/lib/constants/plans";
import { Invoice } from "@/lib/types/billingTypes";

const statusStyles: Record<Invoice["status"], string> = {
  paid: "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-400",
  open: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-400",
  void: "border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400",
};

const InvoicesTable: FC<{ invoices: Invoice[] }> = ({ invoices }) => {
  if (invoices.length === 0) {
    return (
      <div className='flex flex-col items-center gap-2 py-10 text-center'>
        <span className='inline-flex size-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400'>
          <ReceiptIcon size={20} />
        </span>
        <p className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>
          No invoices yet
        </p>
        <p className='max-w-sm text-sm text-zinc-500 dark:text-zinc-400'>
          You get an invoice when you subscribe and each time your billing
          cycle renews.
        </p>
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-left text-sm'>
        <thead className='border-b border-zinc-200 font-mono text-xs uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:text-zinc-400'>
          <tr className='[&>th]:px-3 [&>th:first-child]:pl-0 [&>th:last-child]:pr-0'>
            <th className='py-3 font-medium'>Date</th>
            <th className='py-3 font-medium'>Amount</th>
            <th className='py-3 font-medium'>Invoice number</th>
            <th className='py-3 font-medium'>Status</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-zinc-200 dark:divide-zinc-800'>
          {invoices.map((invoice) => (
            <tr
              key={invoice.id}
              className='text-zinc-800 dark:text-zinc-200 [&>td]:px-3 [&>td:first-child]:pl-0 [&>td:last-child]:pr-0'
            >
              <td className='py-4'>{formatUtcDate(invoice.created_at)}</td>
              <td className='py-4 tabular-nums'>
                {formatPrice(invoice.amount, invoice.currency)}
              </td>
              <td className='py-4 font-mono text-xs'>{invoice.number}</td>
              <td className='py-4'>
                <span
                  className={cn(
                    "rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase",
                    statusStyles[invoice.status],
                  )}
                >
                  {invoice.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoicesTable;
