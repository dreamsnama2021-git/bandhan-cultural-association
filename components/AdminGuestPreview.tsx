"use client";

import { useState } from "react";
import {
  Building2,
  Store,
  HeartHandshake,
  Ticket,
  CalendarDays,
} from "lucide-react";
import SponsorCard from "@/components/SponsorCard";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { useAdminData } from "@/components/AdminDataContext";
import { effectiveStallStatus } from "@/lib/stallBookings";
import type { Stall } from "@/types";

function priceSummary(stall: Stall): string {
  if (stall.sizeType === "half") return formatCurrency(stall.pricing.full10);
  return `${formatCurrency(stall.pricing.first5 ?? 0)} – ${formatCurrency(stall.pricing.full10)}`;
}

type TabId = "business" | "stall" | "individual" | "tickets" | "calendar";

const tabs: { id: TabId; label: string; icon: typeof Building2 }[] = [
  { id: "business", label: "Business", icon: Building2 },
  { id: "stall", label: "Stall", icon: Store },
  { id: "individual", label: "Individual", icon: HeartHandshake },
  { id: "tickets", label: "Tickets", icon: Ticket },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
];

export default function AdminGuestPreview() {
  const [tab, setTab] = useState<TabId>("business");
  const { sponsors, stalls, stallBookings, events } = useAdminData();

  const businessSponsors = sponsors.filter((s) => s.type === "business");
  const individualSponsors = sponsors.filter((s) => s.type === "individual");

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-maroon-500 mb-4">Browse as Guest</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors focus-ring",
              tab === t.id ? "bg-maroon-500 text-cream" : "bg-white/70 text-charcoal hover:bg-maroon-50"
            )}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "business" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {businessSponsors.length === 0 ? (
            <p className="text-charcoal-light">No business sponsors yet.</p>
          ) : (
            businessSponsors.map((s) => <SponsorCard key={s.id} sponsor={s} />)
          )}
        </div>
      )}

      {tab === "individual" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {individualSponsors.length === 0 ? (
            <p className="text-charcoal-light">No individual sponsors yet.</p>
          ) : (
            individualSponsors.map((s) => <SponsorCard key={s.id} sponsor={s} />)
          )}
        </div>
      )}

      {tab === "stall" && (
        <div className="rounded-2xl bg-white/70 border border-maroon-500/10 overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-charcoal-light border-b border-maroon-500/10">
                <th className="p-4">Stall</th>
                <th className="p-4">Location</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-maroon-500/10">
              {stalls.map((s) => (
                <tr key={s.id}>
                  <td className="p-4 font-semibold text-charcoal">{s.code}</td>
                  <td className="p-4">{s.location}</td>
                  <td className="p-4">{s.category}</td>
                  <td className="p-4">{priceSummary(s)}</td>
                  <td className="p-4 capitalize">{effectiveStallStatus(s, stallBookings).replace("-", " ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(tab === "tickets" || tab === "calendar") && (
        <div className="rounded-2xl bg-white/70 border border-maroon-500/10 overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-charcoal-light border-b border-maroon-500/10">
                <th className="p-4">Event</th>
                <th className="p-4">Date</th>
                <th className="p-4">Venue</th>
                <th className="p-4">Ticket From</th>
                <th className="p-4">Seats Available</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-maroon-500/10">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-charcoal-light">
                    No events scheduled yet.
                  </td>
                </tr>
              ) : (
                events.map((e) => (
                  <tr key={e.id}>
                    <td className="p-4 font-semibold text-charcoal">{e.name}</td>
                    <td className="p-4">{formatDate(e.date)}</td>
                    <td className="p-4">{e.venue}</td>
                    <td className="p-4">{e.ticketPriceFrom > 0 ? formatCurrency(e.ticketPriceFrom) : "Free"}</td>
                    <td className="p-4">{e.seatsAvailable}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
