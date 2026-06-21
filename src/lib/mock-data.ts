export type ProductCategory =
  | "bebidas"
  | "snacks"
  | "lacteos"
  | "panaderia"
  | "limpieza"
  | "frutas";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  stock: number;
  cost: number;
  price: number;
  image?: string;
}

export const LOW_STOCK_THRESHOLD = 8;

export const products: Product[] = [
  { id: "1",  name: "Coca-Cola 500ml",       category: "bebidas",   stock: 48, cost: 0.90, price: 1.50 },
  { id: "2",  name: "Agua San Luis 625ml",    category: "bebidas",   stock: 6,  cost: 0.50, price: 1.00 },
  { id: "3",  name: "Doritos Nacho 40g",      category: "snacks",    stock: 30, cost: 1.20, price: 2.50 },
  { id: "4",  name: "Leche Gloria 1L",        category: "lacteos",   stock: 4,  cost: 3.20, price: 4.80 },
  { id: "5",  name: "Pan de Molde Bimbo",     category: "panaderia", stock: 12, cost: 3.50, price: 5.50 },
  { id: "6",  name: "Jabón Bolívar 200g",     category: "limpieza",  stock: 20, cost: 1.80, price: 3.00 },
  { id: "7",  name: "Manzana Roja kg",        category: "frutas",    stock: 3,  cost: 2.00, price: 3.50 },
  { id: "8",  name: "Inca Kola 1.5L",         category: "bebidas",   stock: 24, cost: 2.20, price: 3.80 },
  { id: "9",  name: "Pringles Original",      category: "snacks",    stock: 15, cost: 4.50, price: 7.50 },
  { id: "10", name: "Yogurt Toni 200g",       category: "lacteos",   stock: 8,  cost: 1.40, price: 2.20 },
  { id: "11", name: "Croissant Mantequilla",  category: "panaderia", stock: 5,  cost: 1.20, price: 2.00 },
  { id: "12", name: "Detergente Ariel 500g",  category: "limpieza",  stock: 18, cost: 5.00, price: 8.50 },
];

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
