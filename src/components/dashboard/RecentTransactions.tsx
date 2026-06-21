import type { Transaction } from "@/lib/mock-data";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-6">
      <h3 className="mb-5 text-base font-semibold">Últimas transacciones</h3>
      <div className="divide-y divide-border">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
          >
            <div>
              <p className="text-sm font-medium">{tx.id}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {tx.time} · {tx.method}
              </p>
            </div>
            <span className="text-sm font-semibold text-primary">
              S/ {tx.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
