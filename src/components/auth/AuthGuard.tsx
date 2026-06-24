"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { refreshApi } from "@/services/authService";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const { isAuthenticated, setAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      setChecking(false);
      return;
    }

    refreshApi()
      .then((data) =>
        setAuth(data.accessToken, { fullName: data.fullName, role: data.role }),
      )
      .catch(() => router.replace("/login"))
      .finally(() => setChecking(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (checking || !isAuthenticated) return null;

  return <>{children}</>;
}
