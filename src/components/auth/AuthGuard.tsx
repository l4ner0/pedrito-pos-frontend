"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useBusinessStore } from "@/store/businessStore";
import { refreshApi } from "@/services/authService";
import { fetchBusiness, fetchBusinessSettings } from "@/services/businessService";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const { isAuthenticated, setAuth } = useAuthStore();
  const { setBusiness, setSettings } = useBusinessStore();
  const router = useRouter();

  useEffect(() => {
    async function init() {
      try {
        if (!isAuthenticated) {
          const data = await refreshApi();
          setAuth(data.accessToken, { fullName: data.fullName, role: data.role });
        }
        const [b, s] = await Promise.all([fetchBusiness(), fetchBusinessSettings()]);
        setBusiness(b);
        setSettings(s);
      } catch {
        router.replace("/login");
      } finally {
        setChecking(false);
      }
    }
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (checking || !isAuthenticated) return null;

  return <>{children}</>;
}
