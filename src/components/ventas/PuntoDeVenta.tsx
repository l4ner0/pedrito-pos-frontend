import { OrderPanel } from "./OrderPanel";
import { ProductCatalog } from "./ProductCatalog";

export function PuntoDeVenta() {
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="w-[420px] shrink-0">
        <OrderPanel />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <ProductCatalog />
      </div>
    </div>
  );
}
