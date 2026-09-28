"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { syncSupabaseMember } from "@/lib/memberAuth";
import { clearSession } from "@/lib/credentials";

export default function SupabaseSessionSync() {
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        clearSession();
        return;
      }
      if (session?.user && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        // Deferred so we never call Supabase from inside the auth callback itself.
        setTimeout(() => {
          syncSupabaseMember(session.user.id);
        }, 0);
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return null;
}
