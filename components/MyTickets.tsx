"use client";

import { useEffect, useState } from "react";
import { Ticket, CalendarDays, MapPin, Gift } from "lucide-react";
import { getCurrentSessionMember, SESSION_CHANGE_EVENT, type StoredCredential } from "@/lib/credentials";
import { readTicketBookings, type TicketBooking } from "@/lib/ticketBookings";
import { events } from "@/data/events";
import { formatCurrency, formatDate } from "@/lib/utils";

// The signed-in member's ticket bookings (free member tickets and paid ones).
export default function MyTickets() {
  const [session, setSession] = useState<StoredCredential | null>(null);
  const [bookings, setBookings] = useState<TicketBooking[]>([]);

  useEffect(() => {
    const refresh = () => {
      const current = getCurrentSessionMember();
      setSession(current);
      setBookings(
        current
          ? readTicketBookings()
              .filter((b) => b.memberEmail.toLowerCase() === current.email.toLowerCase())
              .sort((a, b) => b.bookedOn.localeCompare(a.bookedOn))
          : []
      );
    };
    refresh();
    window.addEventListener(SESSION_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(SESSION_CHANGE_EVENT, refresh);
  }, []);

  if (!session || bookings.length === 0) return null;

  // Names admitted on free tickets: the member first, then family members.
  const attendees = [session.member.fullName, ...session.familyMembers.map((f) => f.name)];

  return (
    <div className="mb-12">
      <h2 className="font-display text-2xl font-semibold text-maroon-500 mb-1">My Tickets</h2>
      <p className="text-sm text-charcoal-light mb-5">Your booked tickets for association events.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookings.map((b) => {
          const event = events.find((e) => e.id === b.eventId);
          const total = b.freeQuantity + b.paidQuantity;
          const isFree = b.freeQuantity > 0;
          return (
            <div key={b.id} className="rounded-2xl bg-white/70 border border-maroon-500/10 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-semibold text-maroon-500">{event?.name ?? b.eventId}</h3>
                  {event && (
                    <div className="mt-2 space-y-1 text-sm text-charcoal-light">
                      <p className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-saffron-600 shrink-0" />
                        {formatDate(event.date)}
                        {event.endDate ? ` – ${formatDate(event.endDate)}` : ""} · {event.time}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-saffron-600 shrink-0" />
                        {event.venue}
                      </p>
                    </div>
                  )}
                </div>
                <span
                  className={
                    isFree
                      ? "inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 shrink-0"
                      : "inline-flex items-center gap-1 rounded-full bg-saffron-100 text-maroon-600 text-xs font-semibold px-3 py-1 shrink-0"
                  }
                >
                  {isFree ? <Gift className="h-3.5 w-3.5" /> : <Ticket className="h-3.5 w-3.5" />}
                  {isFree ? "FREE" : "PAID"}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-maroon-500/10 text-sm space-y-1.5">
                <p className="flex justify-between">
                  <span className="text-charcoal-light">Ticket</span>
                  <span className="font-semibold text-charcoal">
                    {b.ticketTypeName} &times; {total}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-charcoal-light">Amount</span>
                  <span className="font-semibold text-charcoal">{b.amount === 0 ? "Free" : formatCurrency(b.amount)}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-charcoal-light">Order ID</span>
                  <span className="font-semibold text-charcoal">{b.orderId}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-charcoal-light">Booked on</span>
                  <span className="font-semibold text-charcoal">{formatDate(b.bookedOn)}</span>
                </p>
              </div>

              {isFree && (
                <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900">
                  <p className="font-semibold mb-1">Admit</p>
                  <p>{attendees.slice(0, b.freeQuantity).join(", ")}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
