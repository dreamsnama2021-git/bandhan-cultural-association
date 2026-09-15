"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminSession, getCurrentSessionMember } from "@/lib/credentials";
import { getAdminProfile } from "@/lib/adminProfile";
import type { AdminIdentity } from "@/components/admin/AdminAccessContext";

// Grants admin-panel access to the real Admin login AND to any member whose
// role is "leader" ("Managing Community" — they act as a sub-admin with the
// same permissions, but there is no Admin member record for them to touch).
export function useAdminAccess(): AdminIdentity | null | undefined {
  const router = useRouter();
  const [access, setAccess] = useState<AdminIdentity | null | undefined>(undefined);

  useEffect(() => {
    if (isAdminSession()) {
      setAccess({ isTrueAdmin: true, leader: null, displayName: getAdminProfile().name });
      return;
    }
    const session = getCurrentSessionMember();
    if (session && session.member.role === "leader") {
      const name = session.member.fullName.split(" ")[0] || session.member.fullName;
      setAccess({ isTrueAdmin: false, leader: session.member, displayName: name });
      return;
    }
    setAccess(null);
    router.replace("/login");
  }, [router]);

  return access;
}
