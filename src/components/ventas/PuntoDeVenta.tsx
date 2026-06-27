import { OrderPanel } from "./OrderPanel";
import { ProductCatalog } from "./ProductCatalog";

export function PuntoDeVenta() {
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="w-[300px] shrink-0 lg:w-[420px]">
        <OrderPanel />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <ProductCatalog />
      </div>
    </div>
  );
}
