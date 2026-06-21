"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PeriodFilter } from "@/components/ui/PeriodFilter";

const PERIOD_OPTIONS = [
  { value: "today", label: "Hoy" },
  { value: "yesterday", label: "Ayer" },
  { value: "week", label: "Hace una semana" },
];

export function DashboardFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const period = searchParams.get("period") ?? "today";

  return (
    <PeriodFilter
      options={PERIOD_OPTIONS}
      value={period}
      onChange={(value) => router.push(`?period=${value}`)}
    />
  );
}
