"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentSessionMember, type StoredCredential } from "@/lib/credentials";

// Redirects to /login if no member is signed in. Returns the active session
// (undefined while checking, null briefly before the redirect completes).
export function useMemberGuard(): StoredCredential | null | undefined {
  const router = useRouter();
  const [session, setSession] = useState<StoredCredential | null | undefined>(undefined);

  useEffect(() => {
    const current = getCurrentSessionMember();
    if (!current) {
      router.replace("/login");
      setSession(null);
    } else {
      setSession(current);
    }
  }, [router]);

  return session;
}
