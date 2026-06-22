import { VentasContent } from "@/components/ventas/VentasContent";
import { products } from "@/lib/mock-data";

export default function VentasPage() {
  return <VentasContent products={products} />;
}
