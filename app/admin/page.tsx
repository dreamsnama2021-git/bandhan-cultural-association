"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Users,
  UsersRound,
  Building2,
  Store,
  HeartHandshake,
  Ticket,
  CalendarDays,
  Images,
  Tag,
  Soup,
  Crown,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";
import Modal from "@/components/Modal";
import AdminGuestPreview from "@/components/AdminGuestPreview";
import { pujaCategories } from "@/data/pujaCategories";
import { useAdminMembers } from "@/components/AdminMembersContext";
import { useAdminIdentity } from "@/components/admin/AdminAccessContext";
import type { PujaCategoryInfo } from "@/types";

const sections = [
  { href: "/admin/members", label: "Members", description: "Browse the full member directory.", icon: Users },
  { href: "/admin/sponsors", label: "Business Sponsors", description: "Business sponsorship packages & transactions.", icon: Building2 },
  { href: "/admin/stalls", label: "Stalls", description: "Festival stall inventory & booking status.", icon: Store },
  { href: "/admin/sponsors/individual", label: "Individual Sponsors", description: "Individual contributions received.", icon: HeartHandshake },
  { href: "/admin/tickets", label: "Tickets", description: "Ticket pricing and seat availability.", icon: Ticket },
  { href: "/admin/calendar", label: "Pooja Calendar", description: "Event schedule across all Pujas.", icon: CalendarDays },
  { href: "/admin/images", label: "View Images", description: "Google Drive link for the festival photo gallery.", icon: Images },
  { href: "/admin/coupons", label: "Coupons", description: "Business promo codes & redemptions.", icon: Tag },
  { href: "/admin/bhog", label: "Bhog Coupons", description: "Navratri-day Bhog coupons for members.", icon: Soup },
];

export default function AdminHomePage() {
  const router = useRouter();
  const identity = useAdminIdentity();
  const { members } = useAdminMembers();
  const [selectedPuja, setSelectedPuja] = useState<PujaCategoryInfo | null>(null);

  const goToType = (type: "core" | "general") => {
    if (!selectedPuja) return;
    router.push(`/admin/members/${type}?puja=${selectedPuja.id}`);
    setSelectedPuja(null);
  };

  const leaderCount = members.filter((m) => m.role === "leader").length;
  const coreCount = members.filter((m) => m.membershipType === "core" && m.role !== "leader").length;
  const generalCount = members.filter((m) => m.membershipType === "general").length;
  const adminCount = 1;

  const stats = [
    {
      label: "Managing Community",
      value: leaderCount,
      icon: Users,
      href: "/admin/members/leaders",
      iconBg: "bg-maroon-500/10 text-maroon-600",
    },
    {
      label: "Total Core Members",
      value: coreCount,
      icon: Crown,
      href: "/admin/members/core",
      iconBg: "bg-saffron-100 text-saffron-700",
    },
    {
      label: "Total General Members",
      value: generalCount,
      icon: UserCheck,
      href: "/admin/members/general",
      iconBg: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Total Members",
      value: adminCount + leaderCount + coreCount + generalCount,
      icon: UsersRound,
      href: "/admin/members",
      iconBg: "bg-gold/10 text-gold-dark",
    },
  ];

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <div className="motif-dots bg-gradient-to-br from-saffron-50 via-cream to-beige-light border-b border-maroon-500/10">
        <Container className="py-8 sm:py-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-maroon-500">
                Welcome, {identity.displayName} 🙏
              </h1>
              <p className="mt-1.5 text-sm text-charcoal-light max-w-xl">
                A high-level view of members, sponsors, bookings, tickets and coupons across the association.
              </p>
            </div>
            <span className="text-xs font-semibold text-charcoal-light bg-white/70 px-3.5 py-2 rounded-full border border-maroon-500/10 shrink-0">
              {today}
            </span>
          </div>
        </Container>
      </div>
      <section className="section-py">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {stats.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="text-left rounded-2xl bg-white/70 border border-maroon-500/10 p-5 hover:border-saffron-500/50 hover:shadow-card-hover transition-all focus-ring block"
              >
                <span className={cn("inline-flex h-10 w-10 items-center justify-center rounded-xl", s.iconBg)}>
                  <s.icon className="h-5 w-5" />
                </span>
                <p className="mt-3 font-display text-3xl font-bold text-maroon-500">{s.value}</p>
                <p className="text-xs text-charcoal-light mt-1">{s.label}</p>
              </Link>
            ))}
          </div>

          <h2 className="font-display text-xl font-semibold text-maroon-500 mb-4">Browse by Puja</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {pujaCategories.map((cat) => {
              const Icon = (Icons[cat.icon as keyof typeof Icons] as LucideIcon) || Icons.Sparkles;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedPuja(cat)}
                  className="flex flex-col items-center text-center gap-2 rounded-2xl bg-white/70 border border-maroon-500/10 p-5 hover:border-saffron-500/50 hover:shadow-card-hover transition-all focus-ring"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-maroon-500 text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-lg font-semibold text-maroon-500">{cat.name}</span>
                </button>
              );
            })}
          </div>

          <div className="mb-10">
            <AdminGuestPreview />
          </div>

          <h2 className="font-display text-xl font-semibold text-maroon-500 mb-4">Browse by section</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="flex items-start gap-3 rounded-2xl bg-white/70 border border-maroon-500/10 p-5 hover:border-saffron-500/50 hover:shadow-card-hover transition-all focus-ring"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-maroon-500/10 text-maroon-500">
                  <s.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-display text-lg font-semibold text-maroon-500">{s.label}</span>
                  <span className="block text-sm text-charcoal-light mt-0.5">{s.description}</span>
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-beige-light border border-beige-dark p-6 text-sm text-charcoal-light">
            All pricing shown across the admin console is sourced from{" "}
            <code className="font-mono text-maroon-600">lib/config.ts</code> and{" "}
            <code className="font-mono text-maroon-600">data/sponsorshipPackages.ts</code> — update those files to
            change prices across the entire application.
          </div>
        </Container>
      </section>

      <Modal
        open={!!selectedPuja}
        onClose={() => setSelectedPuja(null)}
        title={selectedPuja ? `${selectedPuja.name} — Membership Type` : undefined}
      >
        <p className="text-sm text-charcoal-light mb-5">
          Choose a membership type to view {selectedPuja?.name} members filtered by that plan.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => goToType("core")}
            className="rounded-2xl border-2 border-maroon-500/10 bg-white/60 p-6 text-center hover:border-saffron-500/50 hover:shadow-card-hover transition-all focus-ring"
          >
            <Crown className="h-6 w-6 text-saffron-600 mx-auto" />
            <span className="block mt-2 font-display text-lg font-semibold text-maroon-500">Core</span>
          </button>
          <button
            type="button"
            onClick={() => goToType("general")}
            className="rounded-2xl border-2 border-maroon-500/10 bg-white/60 p-6 text-center hover:border-saffron-500/50 hover:shadow-card-hover transition-all focus-ring"
          >
            <UserCheck className="h-6 w-6 text-saffron-600 mx-auto" />
            <span className="block mt-2 font-display text-lg font-semibold text-maroon-500">General</span>
          </button>
        </div>
      </Modal>
    </>
  );
}
