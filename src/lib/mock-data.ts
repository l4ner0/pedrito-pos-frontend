export interface ChartPoint {
  day: string;
  value: number;
}

export interface Transaction {
  id: string;
  time: string;
  method: string;
  amount: number;
}

export interface KpiData {
  revenue: string;
  revenueTrend: string;
  salesCount: string;
  salesSince: string;
  avgTicket: string;
  topProduct: string;
  topProductSales: string;
}

export interface DashboardData {
  kpis: KpiData;
  chartData: ChartPoint[];
  transactions: Transaction[];
}

export const lowStockProducts = [
  "Agua San Luis",
  "Leche Gloria",
  "Manzana Roja",
  "Croissant",
];

const dataByPeriod: Record<string, DashboardData> = {
  today: {
    kpis: {
      revenue: "S/ 547.20",
      revenueTrend: "+12% vs ayer",
      salesCount: "48",
      salesSince: "desde las 8:00 AM",
      avgTicket: "S/ 11.40",
      topProduct: "Coca-Cola",
      topProductSales: "34 unidades vendidas",
    },
    chartData: [
      { day: "Lun", value: 300 },
      { day: "Mar", value: 490 },
      { day: "Mié", value: 440 },
      { day: "Jue", value: 560 },
      { day: "Vie", value: 660 },
      { day: "Sáb", value: 870 },
      { day: "Hoy", value: 780 },
    ],
    transactions: [
      { id: "#0047", time: "10:32", method: "Efectivo", amount: 9.5 },
      { id: "#0046", time: "10:18", method: "Tarjeta", amount: 9.6 },
      { id: "#0045", time: "09:55", method: "Efectivo", amount: 19.1 },
      { id: "#0044", time: "09:41", method: "Yape", amount: 9.5 },
      { id: "#0043", time: "09:22", method: "Efectivo", amount: 3.8 },
      { id: "#0042", time: "09:05", method: "Tarjeta", amount: 16.65 },
    ],
  },
  yesterday: {
    kpis: {
      revenue: "S/ 489.50",
      revenueTrend: "-5% vs anteayer",
      salesCount: "41",
      salesSince: "día completo",
      avgTicket: "S/ 11.94",
      topProduct: "Inca Kola",
      topProductSales: "28 unidades vendidas",
    },
    chartData: [
      { day: "Lun", value: 280 },
      { day: "Mar", value: 450 },
      { day: "Mié", value: 390 },
      { day: "Jue", value: 510 },
      { day: "Vie", value: 600 },
      { day: "Sáb", value: 820 },
      { day: "Ayer", value: 490 },
    ],
    transactions: [
      { id: "#0041", time: "18:47", method: "Tarjeta", amount: 22.3 },
      { id: "#0040", time: "17:30", method: "Efectivo", amount: 7.5 },
      { id: "#0039", time: "16:12", method: "Yape", amount: 14.9 },
      { id: "#0038", time: "15:05", method: "Efectivo", amount: 5.2 },
      { id: "#0037", time: "13:48", method: "Tarjeta", amount: 31.0 },
      { id: "#0036", time: "12:20", method: "Efectivo", amount: 8.75 },
    ],
  },
  week: {
    kpis: {
      revenue: "S/ 3,842.10",
      revenueTrend: "+8% vs semana anterior",
      salesCount: "312",
      salesSince: "últimos 7 días",
      avgTicket: "S/ 12.31",
      topProduct: "Coca-Cola",
      topProductSales: "198 unidades vendidas",
    },
    chartData: [
      { day: "Lun", value: 420 },
      { day: "Mar", value: 580 },
      { day: "Mié", value: 510 },
      { day: "Jue", value: 670 },
      { day: "Vie", value: 740 },
      { day: "Sáb", value: 920 },
      { day: "Hoy", value: 780 },
    ],
    transactions: [
      { id: "#0047", time: "Hoy 10:32", method: "Efectivo", amount: 9.5 },
      { id: "#0041", time: "Ayer 18:47", method: "Tarjeta", amount: 22.3 },
      { id: "#0035", time: "Sáb 14:10", method: "Yape", amount: 17.8 },
      { id: "#0029", time: "Vie 11:05", method: "Efectivo", amount: 6.4 },
      { id: "#0021", time: "Jue 09:33", method: "Tarjeta", amount: 45.0 },
      { id: "#0014", time: "Mié 16:22", method: "Efectivo", amount: 12.5 },
    ],
  },
};

export function getDashboardData(period: string): DashboardData {
  return dataByPeriod[period] ?? dataByPeriod.today;
}
