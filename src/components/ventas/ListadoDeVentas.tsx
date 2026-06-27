"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, DollarSign, ClipboardList, Info } from "lucide-react";
import { fetchSales, type SaleResponse, type SalePaymentMethod, type SaleStatus } from "@/services/saleService";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { SaleDetailModal } from "./SaleDetailModal";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";

type Period = "today" | "week" | "month";

const PERIODS: { id: Period; label: string }[] = [
  { id: "today", label: "Hoy" },
  { id: "week",  label: "Esta semana" },
  { id: "month", label: "Este mes" },
];

function toDateString(d: Date): string {
  return d.toISOString().split("T")[0];
}

function getPeriodRange(period: Period): { from: string; to: string } {
  const now = new Date();
  const to = toDateString(now);
  if (period === "today") return { from: to, to };
  if (period === "week") {
    const from = new Date(now);
    from.setDate(now.getDate() - 6);
    return { from: toDateString(from), to };
  }
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  return { from: toDateString(from), to };
}

const METHOD_VARIANT: Record<SalePaymentMethod, BadgeVariant> = {
  EFECTIVO: "default",
  YAPE:     "purple",
};

const METHOD_LABEL: Record<SalePaymentMethod, string> = {
  EFECTIVO: "Efectivo",
  YAPE:     "Yape",
};

const STATUS_VARIANT: Record<SaleStatus, BadgeVariant> = {
  ACTIVE:    "success",
  CANCELLED: "danger",
};

const STATUS_LABEL: Record<SaleStatus, string> = {
  ACTIVE:    "Activa",
  CANCELLED: "Cancelada",
};

const METHOD_OPTIONS: { value: SalePaymentMethod | ""; label: string }[] = [
  { value: "",         label: "Todos" },
  { value: "EFECTIVO", label: "Efectivo" },
  { value: "YAPE",     label: "Yape" },
];

const STATUS_OPTIONS: { value: SaleStatus | ""; label: string }[] = [
  { value: "",          label: "Todos" },
  { value: "ACTIVE",    label: "Activa" },
  { value: "CANCELLED", label: "Cancelada" },
];

type MethodOption = SalePaymentMethod | "";
type StatusOption = SaleStatus | "";

function formatDatetime(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
  const time = d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${date} · ${time}`;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export function ListadoDeVentas() {
  const [sales, setSales] = useState<SaleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedSale, setSelectedSale] = useState<SaleResponse | null>(null);

  const [ticketInput, setTicketInput] = useState("");
  const [debouncedTicket, setDebouncedTicket] = useState("");
  const [activeMethod, setActiveMethod] = useState<MethodOption>("");
  const [activeStatus, setActiveStatus] = useState<StatusOption>("");
  const [period, setPeriod] = useState<Period>("today");

  const periodRange = getPeriodRange(period);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTicket(ticketInput), 400);
    return () => clearTimeout(timer);
  }, [ticketInput]);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    fetchSales(page, pageSize, controller.signal, {
      ticketCode: debouncedTicket || undefined,
      paymentMethod: activeMethod || undefined,
      status: activeStatus || undefined,
      ...periodRange,
    })
      .then((data) => {
        setSales(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if ((err as Error).name !== "AbortError") setIsLoading(false);
      });
    return () => controller.abort();
  }, [page, pageSize, debouncedTicket, activeMethod, activeStatus, period]);

  function handleTicketChange(val: string) {
    setTicketInput(val);
    setPage(1);
  }

  function handleMethodChange(val: MethodOption) {
    setActiveMethod(val);
    setPage(1);
  }

  function handleStatusChange(val: StatusOption) {
    setActiveStatus(val);
    setPage(1);
  }

  function handlePeriodChange(p: Period) {
    setPeriod(p);
    setPage(1);
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
  }

  function handlePageSizeChange(newSize: number) {
    setPageSize(newSize);
    setPage(1);
  }

  const activeSales = useMemo(() => sales.filter((s) => s.status === "ACTIVE"), [sales]);
  const totalRevenue = useMemo(() => activeSales.reduce((sum, s) => sum + s.total, 0), [activeSales]);

  const columns: Column<SaleResponse>[] = [
    {
      header: "Ticket",
      skeleton: <div className="h-3 w-16 animate-pulse rounded bg-secondary" />,
      cell: (s) => <span className="font-medium text-foreground">{s.ticketCode}</span>,
    },
    {
      header: "Fecha / Hora",
      skeleton: <div className="h-3 w-32 animate-pulse rounded bg-secondary" />,
      cell: (s) => <span className="text-muted-foreground">{formatDatetime(s.createdAt)}</span>,
    },
    {
      header: "Productos",
      cellClassName: "px-3 py-2.5 max-w-[240px] truncate lg:px-4 lg:py-3",
      skeleton: <div className="h-3 w-40 animate-pulse rounded bg-secondary" />,
      cell: (s) => s.items.map((i) => i.productName).join(", "),
    },
    {
      header: "Método",
      skeleton: <div className="h-5 w-16 animate-pulse rounded-full bg-secondary" />,
      cell: (s) => (
        <Badge label={METHOD_LABEL[s.paymentMethod]} variant={METHOD_VARIANT[s.paymentMethod]} />
      ),
    },
    {
      header: "Estado",
      skeleton: <div className="h-5 w-20 animate-pulse rounded-full bg-secondary" />,
      cell: (s) => (
        <Badge label={STATUS_LABEL[s.status]} variant={STATUS_VARIANT[s.status]} />
      ),
    },
    {
      header: "Total",
      skeleton: <div className="h-3 w-16 animate-pulse rounded bg-secondary" />,
      cellClassName: "px-3 py-2.5 font-semibold text-primary lg:px-4 lg:py-3",
      cell: (s) => `S/ ${s.total.toFixed(2)}`,
    },
    {
      header: "",
      headerClassName: "py-3 pl-3 pr-4 lg:pl-4 lg:pr-6",
      cellClassName: "py-2.5 pl-3 pr-4 lg:py-3 lg:pl-4 lg:pr-6",
      skeleton: <div className="ml-auto h-5 w-5 animate-pulse rounded bg-secondary" />,
      cell: (s) => (
        <button
          onClick={(e) => { e.stopPropagation(); setSelectedSale(s); }}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <Info size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col gap-5 p-6">
        {/* Filters */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col gap-4">
            {/* Period */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Período
              </p>
              <div className="flex gap-2">
                {PERIODS.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => handlePeriodChange(id)}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                      period === id
                        ? "bg-brand text-white"
                        : "bg-secondary text-muted-foreground hover:bg-border",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ticket search */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Buscar ticket
              </p>
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={ticketInput}
                  onChange={(e) => handleTicketChange(e.target.value)}
                  placeholder="Ej. #0001"
                  className="w-full rounded-xl border border-border bg-secondary py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-6">
              {/* Method filter */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Método de pago
                </p>
                <Select<MethodOption>
                  value={activeMethod}
                  options={METHOD_OPTIONS}
                  onChange={handleMethodChange}
                />
              </div>

              {/* Status filter */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Estado
                </p>
                <Select<StatusOption>
                  value={activeStatus}
                  options={STATUS_OPTIONS}
                  onChange={handleStatusChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
              <DollarSign size={18} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total recaudado</p>
              <p className="text-xl font-bold text-primary">S/ {totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
              <ClipboardList size={18} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ventas activas</p>
              <p className="text-xl font-bold text-foreground">{isLoading ? "—" : activeSales.length}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={sales}
          keyExtractor={(s) => s.id}
          isLoading={isLoading}
          emptyMessage="No se encontraron ventas"
          page={page}
          pageSize={pageSize}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          totalPages={totalPages}
          totalElements={totalElements}
          itemLabel={{ singular: "venta", plural: "ventas" }}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      <SaleDetailModal sale={selectedSale} onClose={() => setSelectedSale(null)} />
    </div>
  );
}
