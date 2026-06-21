import { Suspense } from "react";
import { Bell, DollarSign, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { KPICard } from "@/components/ui/KPICard";
import { UserMenu } from "@/components/layout/UserMenu";
import { StatusAlert } from "@/components/ui/status-alert";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { getDashboardData, lowStockProducts } from "@/lib/mock-data";

const CHART_TITLE: Record<string, string> = {
  today: "Hoy",
  yesterday: "Ayer",
  week: "Esta semana",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period = "today" } = await searchParams;
  const { kpis, chartData, transactions } = getDashboardData(period);

  const lowStockMsg = (
    <>
      <strong>{lowStockProducts.length} productos</strong> con stock bajo —{" "}
      {lowStockProducts.join(", ")}
    </>
  );

  return (
    <div className="flex min-h-screen flex-col">
      {/* Topbar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 lg:h-16 lg:px-8">
        <h1 className="text-base font-semibold lg:text-lg">Dashboard</h1>
        <div className="flex items-center gap-3 lg:gap-4">
          <button className="relative text-muted-foreground transition-colors hover:text-foreground">
            <Bell size={19} />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-danger" />
          </button>
          <UserMenu />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 space-y-4 p-4 md:p-6 lg:space-y-6 lg:p-8">
        {/* Date + filter */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Viernes, 20 de junio 2024
            </p>
            <h2 className="mt-0.5 text-xl font-semibold">Resumen del día</h2>
          </div>
          <Suspense>
            <DashboardFilters />
          </Suspense>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <KPICard
            label="Recaudado hoy"
            value={kpis.revenue}
            sub={kpis.revenueTrend}
            icon={DollarSign}
            iconClass="bg-primary/10 text-primary"
          />
          <KPICard
            label="N° de ventas"
            value={kpis.salesCount}
            sub={kpis.salesSince}
            icon={ShoppingBag}
            iconClass="bg-primary/10 text-primary"
          />
          <KPICard
            label="Ticket promedio"
            value={kpis.avgTicket}
            sub="por transacción"
            icon={TrendingUp}
            iconClass="bg-primary/10 text-primary"
          />
          <KPICard
            label="Producto estrella"
            value={kpis.topProduct}
            sub={kpis.topProductSales}
            icon={Users}
            iconClass="bg-brand/10 text-brand"
          />
        </div>

        {/* Low stock alert */}
        <StatusAlert variant="warning" message={lowStockMsg} />

        {/* Chart + Transactions */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_360px] lg:gap-4">
          <SalesChart data={chartData} title={CHART_TITLE[period] ?? "Hoy"} />
          <RecentTransactions transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
