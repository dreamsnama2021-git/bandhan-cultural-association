"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ChevronDown, LayoutDashboard, Building2, HeartHandshake, Store, Ticket, LogOut } from "lucide-react";
import { clearAdminSession } from "@/lib/credentials";
import { signOutMember } from "@/lib/memberAuth";
import { AdminSidebarDrawer } from "@/components/admin/AdminSidebar";
import { useAdminIdentity } from "@/components/admin/AdminAccessContext";

export default function AdminHeader() {
  const router = useRouter();
  const identity = useAdminIdentity();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (identity.isTrueAdmin) {
      clearAdminSession();
    } else {
      await signOutMember();
    }
    setProfileOpen(false);
    router.push("/login");
  };

  return (
    <>
      <header className="shrink-0 bg-cream/95 backdrop-blur border-b border-maroon-500/10 sticky top-0 z-30">
        <div className="flex items-center gap-3 h-16 sm:h-20 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="md:hidden p-2 -ml-2 rounded-full text-maroon-500 hover:bg-maroon-50 focus-ring shrink-0"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-light" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full rounded-full border border-maroon-500/15 bg-white/70 pl-10 pr-4 py-2.5 text-sm focus-ring"
            />
          </div>

          <div className="flex-1 sm:hidden" />

          <div className="relative shrink-0 ml-auto" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full hover:bg-maroon-50 focus-ring"
              aria-expanded={profileOpen}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-maroon-500 text-cream font-display font-bold text-sm">
                {identity.displayName.charAt(0).toUpperCase()}
              </span>
              <span className="hidden sm:block text-sm font-semibold text-charcoal">{identity.displayName}</span>
              <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-charcoal-light" />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-cream border border-maroon-500/10 shadow-card-hover overflow-hidden py-1.5"
                  role="menu"
                >
                  {!identity.isTrueAdmin && (
                    <Link
                      href="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-charcoal hover:bg-maroon-50"
                      role="menuitem"
                    >
                      <LayoutDashboard className="h-4 w-4" /> My Dashboard
                    </Link>
                  )}
                  {identity.isTrueAdmin && (
                    <>
                      <p className="px-4 pt-1.5 pb-1 text-[10px] font-semibold uppercase tracking-wide text-charcoal-light">
                        Participate as Admin
                      </p>
                      <Link
                        href="/sponsorship/business"
                        onClick={() => setProfileOpen(false)}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-charcoal hover:bg-maroon-50"
                        role="menuitem"
                      >
                        <Building2 className="h-4 w-4" /> Business Sponsor
                      </Link>
                      <Link
                        href="/sponsorship/individual"
                        onClick={() => setProfileOpen(false)}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-charcoal hover:bg-maroon-50"
                        role="menuitem"
                      >
                        <HeartHandshake className="h-4 w-4" /> Individual Sponsor
                      </Link>
                      <Link
                        href="/stalls"
                        onClick={() => setProfileOpen(false)}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-charcoal hover:bg-maroon-50"
                        role="menuitem"
                      >
                        <Store className="h-4 w-4" /> Book a Stall
                      </Link>
                      <Link
                        href="/tickets"
                        onClick={() => setProfileOpen(false)}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-charcoal hover:bg-maroon-50"
                        role="menuitem"
                      >
                        <Ticket className="h-4 w-4" /> Buy Tickets
                      </Link>
                      <div className="my-1 border-t border-maroon-500/10" />
                    </>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-maroon-600 hover:bg-maroon-50"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <AdminSidebarDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
