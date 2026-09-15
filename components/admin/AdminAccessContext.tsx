"use client";

import { createContext, useContext } from "react";
import type { Member } from "@/types";

export interface AdminIdentity {
  isTrueAdmin: boolean;
  leader: Member | null;
  displayName: string;
}

const AdminAccessContext = createContext<AdminIdentity | null>(null);

export function AdminAccessProvider({
  value,
  children,
}: {
  value: AdminIdentity;
  children: React.ReactNode;
}) {
  return <AdminAccessContext.Provider value={value}>{children}</AdminAccessContext.Provider>;
}

export function useAdminIdentity(): AdminIdentity {
  const ctx = useContext(AdminAccessContext);
  if (!ctx) throw new Error("useAdminIdentity must be used within AdminAccessProvider");
  return ctx;
}
