"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, UserCircle2, LogOut, User, Bell } from "lucide-react";
import Container from "@/components/Container";
import MobileMenu from "@/components/MobileMenu";
import { cn, formatDate } from "@/lib/utils";
import { isAdminSession, clearAdminSession, getCurrentSessionMember } from "@/lib/credentials";
import { getNotifications, markAllRead, type MemberNotification } from "@/lib/notifications";
import { signOutMember } from "@/lib/memberAuth";

const navLinks = [
  { href: "/membership", label: "Membership" },
  { href: "/sponsorship", label: "Sponsorship" },
  { href: "/events", label: "Events" },
  { href: "/tickets", label: "Tickets" },
];

const noMenuRoutes = ["/", "/login", "/register"];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sessionMemberId, setSessionMemberId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<MemberNotification[]>([]);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const showMenu = !noMenuRoutes.includes(pathname ?? "") && !sessionMemberId;
  const isAdminRoute = pathname?.startsWith("/admin");
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const admin = isAdminSession();
    setIsAdmin(admin);
    const cred = !admin ? getCurrentSessionMember() : null;
    const memberId = cred?.member.id ?? null;
    setSessionMemberId(memberId);
    setNotifications(memberId ? getNotifications(memberId) : []);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = () => {
    const opening = !notifOpen;
    setNotifOpen(opening);
    if (opening && sessionMemberId) {
      markAllRead(sessionMemberId);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  const handleLogout = async () => {
    clearAdminSession();
    if (sessionMemberId) await signOutMember();
    setProfileMenuOpen(false);
    router.push("/login");
  };

  if (isAdminRoute) return null;

  return (
    <header className="shrink-0 z-50 bg-cream/95 backdrop-blur border-b border-maroon-500/10">
      <Container className="flex items-center justify-between h-16 sm:h-20">
        {showMenu && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="md:hidden p-2 -ml-2 rounded-full text-maroon-500 hover:bg-maroon-50 focus-ring"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        )}

        <Link href={sessionMemberId ? "/membership" : "/"} className="flex items-center gap-2.5 focus-ring rounded-full">
          <img
            src="/logo.webp"
            alt="Bandhan Cultural Association"
            className="h-11 w-11 sm:h-14 sm:w-14 rounded-full object-cover shrink-0"
          />
          <span className="hidden sm:flex items-baseline gap-2.5 leading-none whitespace-nowrap">
            <span className="font-display font-semibold text-xl text-maroon-500 tracking-wide">
              Bandhan
            </span>
            <span className="text-[11px] uppercase tracking-[0.25em] text-saffron-700 font-semibold">
              Cultural Association
            </span>
          </span>
          <span className="sm:hidden font-display font-semibold text-lg text-maroon-500">
            BCA
          </span>
        </Link>

        {!sessionMemberId && (
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            {navLinks.map((link) => {
              const active = pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-semibold transition-colors focus-ring",
                    active
                      ? "bg-maroon-500 text-cream"
                      : "text-charcoal hover:bg-maroon-50 hover:text-maroon-600"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-1">
          {sessionMemberId && (
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={handleBellClick}
                className="relative p-2 rounded-full text-maroon-500 hover:bg-maroon-50 focus-ring"
                aria-label="Notifications"
                aria-expanded={notifOpen}
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-saffron-600 px-1 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-72 rounded-xl bg-cream border border-maroon-500/10 shadow-card-hover overflow-hidden"
                  >
                    <p className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-charcoal-light border-b border-maroon-500/10">
                      Notifications
                    </p>
                    {notifications.length === 0 ? (
                      <p className="px-4 py-6 text-sm text-charcoal-light text-center">No notifications yet.</p>
                    ) : (
                      <div className="max-h-80 overflow-y-auto divide-y divide-maroon-500/10">
                        {notifications.map((n) => (
                          <div key={n.id} className="px-4 py-3">
                            <p className="text-sm text-charcoal">{n.message}</p>
                            <p className="mt-1 text-xs text-charcoal-light">{formatDate(n.createdAt)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => setProfileMenuOpen((v) => !v)}
            className="p-2 rounded-full text-maroon-500 hover:bg-maroon-50 focus-ring"
            aria-label="Account menu"
            aria-expanded={profileMenuOpen}
          >
            <UserCircle2 className="h-7 w-7" />
          </button>

          <AnimatePresence>
            {profileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 rounded-xl bg-cream border border-maroon-500/10 shadow-card-hover overflow-hidden py-1.5"
                role="menu"
              >
                {!isAdmin && (
                  <Link
                    href="/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-charcoal hover:bg-maroon-50"
                    role="menuitem"
                  >
                    <User className="h-4 w-4 text-saffron-600" /> My Profile
                  </Link>
                )}
                {(isAdmin || sessionMemberId) && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-maroon-600 hover:bg-maroon-50"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </div>
      </Container>

      <MobileMenu open={open} onClose={() => setOpen(false)} links={navLinks} />
    </header>
  );
}
