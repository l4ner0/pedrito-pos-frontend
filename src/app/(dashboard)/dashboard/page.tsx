import {
  Bell,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  BarChart2,
  ChevronDown,
} from "lucide-react";
import { StatusAlert } from "@/components/ui/status-alert";
import { weeklyData, recentTransactions, lowStockProducts } from "@/lib/mock-data";

// ── Chart ──────────────────────────────────────────────────────

const CHART = {
  maxVal: 1000,
  yTicks: [1000, 750, 500, 250, 0],
  vbW: 600,
  vbH: 178,
  left: 44,
  right: 580,
  top: 10,
  bottom: 148,
};

type Pt = [number, number];

function toSvgPts(data: typeof weeklyData): Pt[] {
  const { left, right, top, bottom, maxVal } = CHART;
  return data.map((d, i) => [
    left + ((right - left) / (data.length - 1)) * i,
    top + (bottom - top) * (1 - d.value / maxVal),
  ]);
}

function smoothLinePath(pts: Pt[]): string {
  const d: string[] = [`M ${pts[0][0]},${pts[0][1]}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d.push(`C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`);
  }
  return d.join(" ");
}

function SalesChart() {
  const pts = toSvgPts(weeklyData);
  const { left, right, top, bottom, vbW, vbH, maxVal, yTicks } = CHART;
  const linePath = smoothLinePath(pts);
  const areaPath = `${linePath} L ${right},${bottom} L ${left},${bottom} Z`;

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-semibold">Ventas por día</h3>
        <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
          Esta semana
        </span>
      </div>

      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        width="100%"
        aria-hidden="true"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A9CA6" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#4A9CA6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines + Y labels */}
        {yTicks.map((tick) => {
          const y = top + (bottom - top) * (1 - tick / maxVal);
          return (
            <g key={tick}>
              <line
                x1={left}
                y1={y}
                x2={right}
                y2={y}
                stroke="#E2E5EA"
                strokeWidth="1"
              />
              <text
                x={left - 6}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="8"
                fill="#7A7F8A"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#salesGrad)" />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#4A9CA6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* X-axis labels */}
        {weeklyData.map((d, i) => (
          <text
            key={d.day}
            x={pts[i][0]}
            y={vbH - 2}
            textAnchor="middle"
            fontSize="8"
            fill="#7A7F8A"
          >
            {d.day}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ── KPI Card ───────────────────────────────────────────────────

interface KPICardProps {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  iconClass: string;
}

function KPICard({ label, value, sub, icon: Icon, iconClass }: KPICardProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full ${iconClass}`}
        >
          <Icon size={17} />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────

export default function DashboardPage() {
  const lowStockMsg = (
    <>
      <strong>{lowStockProducts.length} productos</strong> con stock bajo —{" "}
      {lowStockProducts.join(", ")}
    </>
  );

  return (
    <div className="flex min-h-screen flex-col">
      {/* Topbar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-8">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <button className="relative text-muted-foreground transition-colors hover:text-foreground">
            <Bell size={20} />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-danger" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
              AT
            </div>
            <div className="leading-tight">
              <p className="text-sm font-medium">Amelia Torres</p>
              <p className="text-xs text-muted-foreground">Administrador</p>
            </div>
            <ChevronDown size={14} className="text-muted-foreground" />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 space-y-6 p-8">
        {/* Date + filter */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Viernes, 20 de junio 2024
            </p>
            <h2 className="mt-0.5 text-xl font-semibold">Resumen del día</h2>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
            <BarChart2 size={14} className="text-muted-foreground" />
            Hoy
            <ChevronDown size={13} className="text-muted-foreground" />
          </button>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-4 gap-4">
          <KPICard
            label="Recaudado hoy"
            value="S/ 547.20"
            sub="+12% vs ayer"
            icon={DollarSign}
            iconClass="bg-primary/10 text-primary"
          />
          <KPICard
            label="N° de ventas"
            value="48"
            sub="desde las 8:00 AM"
            icon={ShoppingBag}
            iconClass="bg-primary/10 text-primary"
          />
          <KPICard
            label="Ticket promedio"
            value="S/ 11.40"
            sub="por transacción"
            icon={TrendingUp}
            iconClass="bg-primary/10 text-primary"
          />
          <KPICard
            label="Producto estrella"
            value="Coca-Cola"
            sub="34 unidades vendidas"
            icon={Users}
            iconClass="bg-brand/10 text-brand"
          />
        </div>

        {/* Low stock alert */}
        <StatusAlert variant="warning" message={lowStockMsg} />

        {/* Chart + Transactions */}
        <div className="grid grid-cols-[1fr_360px] gap-4">
          <SalesChart />

          {/* Transactions */}
          <div className="rounded-xl border border-border bg-card shadow-sm p-6">
            <h3 className="mb-5 text-base font-semibold">
              Últimas transacciones
            </h3>
            <div className="divide-y divide-border">
              {recentTransactions.map((tx) => (
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
        </div>
      </div>
    </div>
  );
}
