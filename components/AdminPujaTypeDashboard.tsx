"use client";

import { useState } from "react";
import { Building2, Store, HeartHandshake, Ticket, CalendarDays, Images, Camera, User, Mail, Phone } from "lucide-react";
import AdminTopBar from "@/components/AdminTopBar";
import Container from "@/components/Container";
import SponsorCard from "@/components/SponsorCard";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { membershipTypeLabels } from "@/data/membership";
import { useAdminData } from "@/components/AdminDataContext";
import { useAdminMembers } from "@/components/AdminMembersContext";
import { effectiveStallStatus } from "@/lib/stallBookings";
import type { MembershipType, PujaCategoryInfo, Stall } from "@/types";

function priceSummary(stall: Stall): string {
  if (stall.sizeType === "half") return formatCurrency(stall.pricing.full10);
  return `${formatCurrency(stall.pricing.first5 ?? 0)} – ${formatCurrency(stall.pricing.full10)}`;
}

export type TabId = "profile" | "business" | "stall" | "individual" | "tickets" | "calendar" | "images";

const tabs: { id: TabId; label: string; icon: typeof Building2 }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "business", label: "Business", icon: Building2 },
  { id: "stall", label: "Stall", icon: Store },
  { id: "individual", label: "Individual", icon: HeartHandshake },
  { id: "tickets", label: "Tickets", icon: Ticket },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "images", label: "Images", icon: Images },
];

export default function AdminPujaTypeDashboard({
  puja,
  type,
  initialTab = "business",
}: {
  puja: PujaCategoryInfo;
  type: MembershipType;
  initialTab?: TabId;
}) {
  const [tab, setTab] = useState<TabId>(initialTab);
  const { sponsors, stalls, stallBookings, events } = useAdminData();
  const { members } = useAdminMembers();

  const businessSponsors = sponsors.filter(
    (s) => s.type === "business" && s.membershipType === type && s.pujas?.includes(puja.id)
  );
  const individualSponsors = sponsors.filter(
    (s) => s.type === "individual" && s.membershipType === type && s.pujas?.includes(puja.id)
  );
  const pujaEvents = events.filter((e) => e.category === puja.id);
  const pujaMembers = members.filter((m) => m.membershipType === type && m.pujas?.includes(puja.id));

  return (
    <>
      <AdminTopBar
        title={`${puja.name} — ${membershipTypeLabels[type]}`}
        description={`Manage ${puja.name} activity for ${membershipTypeLabels[type]} plan members.`}
        backHref="/admin"
      />
      <section className="section-py">
        <Container>
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((t) => (
              <button
                key={t.id}
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

          {tab === "profile" && (
            <div className="rounded-2xl bg-white/70 border border-maroon-500/10 overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-charcoal-light border-b border-maroon-500/10">
                    <th className="p-4">Member</th>
                    <th className="p-4">Member ID</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">City</th>
                    <th className="p-4">Valid Until</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-maroon-500/10">
                  {pujaMembers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-charcoal-light">
                        No {membershipTypeLabels[type]} members have registered for {puja.name} yet.
                      </td>
                    </tr>
                  ) : (
                    pujaMembers.map((m) => (
                      <tr key={m.id}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-saffron-100 text-maroon-600 font-display font-bold text-xs shrink-0">
                              {m.fullName.charAt(0)}
                            </span>
                            <span className="font-semibold text-charcoal">{m.fullName}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-xs text-charcoal-light">{m.memberId}</td>
                        <td className="p-4">
                          <div className="space-y-1 text-xs text-charcoal-light">
                            <p className="flex items-center gap-1.5">
                              <Mail className="h-3 w-3 text-saffron-600 shrink-0" /> {m.email}
                            </p>
                            <p className="flex items-center gap-1.5">
                              <Phone className="h-3 w-3 text-saffron-600 shrink-0" /> {m.mobile}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">{m.city || "—"}</td>
                        <td className="p-4">{m.validUntil === "Lifetime" ? "Lifetime" : formatDate(m.validUntil)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {tab === "business" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {businessSponsors.length === 0 ? (
                <p className="text-charcoal-light">
                  No {membershipTypeLabels[type]} members have sponsored {puja.name} as a business yet.
                </p>
              ) : (
                businessSponsors.map((s) => <SponsorCard key={s.id} sponsor={s} />)
              )}
            </div>
          )}

          {tab === "individual" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {individualSponsors.length === 0 ? (
                <p className="text-charcoal-light">
                  No {membershipTypeLabels[type]} members have made an individual sponsorship for {puja.name} yet.
                </p>
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
                  {pujaEvents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-charcoal-light">
                        No {puja.name} events scheduled yet.
                      </td>
                    </tr>
                  ) : (
                    pujaEvents.map((e) => (
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

          {tab === "images" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-maroon-500 to-maroon-700 shadow-card"
                >
                  <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-cream/15 px-2 py-1 text-[10px] font-semibold text-cream/80">
                    <Camera className="h-3 w-3" /> Photo {i + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
