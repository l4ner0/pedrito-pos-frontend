import { create } from "zustand";

export type UserRole = "ADMIN" | "CASHIER";

export interface AuthUser {
  fullName: string;
  role: UserRole;
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (accessToken: string, user: AuthUser) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,

  setAuth: (accessToken, user) =>
    set({ accessToken, user, isAuthenticated: true }),

  clearAuth: () =>
    set({ accessToken: null, user: null, isAuthenticated: false }),
}));
