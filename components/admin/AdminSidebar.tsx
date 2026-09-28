"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Store,
  HeartHandshake,
  Ticket,
  CalendarDays,
  Images,
  Tag,
  Soup,
  ArrowLeft,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/sponsors", label: "Business Sponsors", icon: Building2, exact: true },
  { href: "/admin/stalls", label: "Stalls", icon: Store },
  { href: "/admin/sponsors/individual", label: "Individual Sponsors", icon: HeartHandshake },
  { href: "/admin/tickets", label: "Tickets", icon: Ticket },
  { href: "/admin/calendar", label: "Pooja Calendar", icon: CalendarDays },
  { href: "/admin/images", label: "View Images", icon: Images },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/bhog", label: "Bhog Coupons", icon: Soup },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <Link href="/admin" onClick={onNavigate} className="flex items-center gap-2.5 px-6 py-6 focus-ring rounded-lg">
        <img
          src="/logo.webp"
          alt="Bandhan Cultural Association"
          className="h-12 w-12 rounded-full object-cover shrink-0"
        />
        <span className="flex flex-col leading-none">
          <span className="font-display font-semibold text-lg text-maroon-500 tracking-wide">Bandhan</span>
          <span className="text-[9px] uppercase tracking-[0.2em] text-saffron-700 font-semibold">
            Admin Console
          </span>
        </span>
      </Link>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto" aria-label="Admin">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-ring",
                active ? "bg-maroon-500 text-cream shadow-card" : "text-charcoal hover:bg-maroon-50"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-6 pt-2">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-charcoal-light hover:bg-maroon-50 hover:text-maroon-600 focus-ring"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Site
        </Link>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  return (
    <aside className="hidden md:flex md:w-64 md:shrink-0 md:sticky md:top-0 md:h-[100dvh] md:flex-col bg-cream border-r border-maroon-500/10">
      <SidebarContent />
    </aside>
  );
}

export function AdminSidebarDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[95] md:hidden">
      <div className="absolute inset-0 bg-charcoal/50" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 h-full w-72 max-w-[80vw] bg-cream shadow-card-hover">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="absolute right-3 top-3 p-1.5 rounded-full hover:bg-maroon-50 text-charcoal focus-ring"
        >
          <X className="h-5 w-5" />
        </button>
        <SidebarContent onNavigate={onClose} />
      </div>
    </div>
  );
}
