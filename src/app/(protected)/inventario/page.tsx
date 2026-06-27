import { Suspense } from "react";
import { InventoryContent } from "@/components/inventory/InventoryContent";

export default function InventarioPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 lg:space-y-6 lg:p-8">
      <Suspense>
        <InventoryContent />
      </Suspense>
    </div>
  );
}
