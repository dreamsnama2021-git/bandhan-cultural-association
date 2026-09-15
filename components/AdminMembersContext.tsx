"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { members as initialMembers } from "@/data/members";
import { readAllCredentials, deleteCredential } from "@/lib/credentials";
import type { Member } from "@/types";

interface AdminMembersContextValue {
  members: Member[];
  addMember: (member: Member) => void;
  updateMember: (id: string, patch: Partial<Member>) => void;
  deleteMember: (id: string) => void;
}

const AdminMembersContext = createContext<AdminMembersContextValue | null>(null);

export function AdminMembersProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<Member[]>(initialMembers);

  // Self-registered members (via /register) and any admin/leader-added members
  // from a previous session only live in the credential store (localStorage) —
  // merge them in here so they show up alongside the seed members.
  useEffect(() => {
    const seedEmails = new Set(initialMembers.map((m) => m.email.toLowerCase()));
    const credentialMembers = readAllCredentials()
      .map((c) => c.member)
      .filter((m) => !seedEmails.has(m.email.toLowerCase()));

    if (credentialMembers.length === 0) return;
    setMembers((prev) => {
      const existingEmails = new Set(prev.map((m) => m.email.toLowerCase()));
      const toAdd = credentialMembers.filter((m) => !existingEmails.has(m.email.toLowerCase()));
      return toAdd.length > 0 ? [...prev, ...toAdd] : prev;
    });
  }, []);

  const addMember = (member: Member) => {
    setMembers((prev) => [...prev, member]);
  };

  const updateMember = (id: string, patch: Partial<Member>) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  };

  const deleteMember = (id: string) => {
    setMembers((prev) => {
      const target = prev.find((m) => m.id === id);
      if (target) deleteCredential(target.email);
      return prev.filter((m) => m.id !== id);
    });
  };

  return (
    <AdminMembersContext.Provider value={{ members, addMember, updateMember, deleteMember }}>
      {children}
    </AdminMembersContext.Provider>
  );
}

export function useAdminMembers() {
  const ctx = useContext(AdminMembersContext);
  if (!ctx) throw new Error("useAdminMembers must be used within AdminMembersProvider");
  return ctx;
}
