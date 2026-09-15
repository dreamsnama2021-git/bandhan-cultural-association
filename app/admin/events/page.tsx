"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { X, Pencil, Trash2 } from "lucide-react";
import Container from "@/components/Container";
import AdminTopBar from "@/components/AdminTopBar";
import AdminEditEventModal from "@/components/AdminEditEventModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useAdminData } from "@/components/AdminDataContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import { pujaCategories } from "@/data/pujaCategories";
import type { EventItem } from "@/types";

function AdminEventsContent() {
  const { events, deleteEvent } = useAdminData();
  const searchParams = useSearchParams();
  const pujaId = searchParams.get("puja");
  const activePuja = pujaCategories.find((c) => c.id === pujaId);
  const filteredEvents = activePuja ? events.filter((e) => e.category === activePuja.id) : events;
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [deleting, setDeleting] = useState<EventItem | null>(null);

  const confirmDelete = () => {
    if (deleting) deleteEvent(deleting.id);
    setDeleting(null);
  };

  return (
    <>
      <AdminTopBar
        title={activePuja ? `${activePuja.name} — Events & Tickets` : "Events & Tickets"}
        description="All upcoming events and their ticket pricing."
      />
      <section className="section-py">
        <Container>
          {activePuja && (
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-saffron-100 text-maroon-600 text-sm font-semibold px-4 py-2">
                Filtered by: {activePuja.name}
                <Link href="/admin/events" aria-label="Clear filter" className="hover:text-maroon-700">
                  <X className="h-3.5 w-3.5" />
                </Link>
              </span>
            </div>
          )}

          <div className="rounded-2xl bg-white/70 border border-maroon-500/10 overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-charcoal-light border-b border-maroon-500/10">
                  <th className="p-4">Event</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Venue</th>
                  <th className="p-4">Ticket From</th>
                  <th className="p-4">Seats Available</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-maroon-500/10">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-charcoal-light">
                      No events found{activePuja ? ` for ${activePuja.name}` : ""}.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((e) => (
                    <tr key={e.id}>
                      <td className="p-4 font-semibold text-charcoal">{e.name}</td>
                      <td className="p-4">{formatDate(e.date)}</td>
                      <td className="p-4">{e.venue}</td>
                      <td className="p-4">{e.ticketPriceFrom > 0 ? formatCurrency(e.ticketPriceFrom) : "Free"}</td>
                      <td className="p-4">{e.seatsAvailable}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setEditing(e)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-maroon-600 hover:text-maroon-700 focus-ring rounded px-1"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleting(e)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 focus-ring rounded px-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <AdminEditEventModal event={editing} onClose={() => setEditing(null)} />
      <ConfirmDialog
        open={!!deleting}
        title="Remove Event"
        description={deleting ? `Remove event "${deleting.name}"?` : ""}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}

export default function AdminEventsPage() {
  return (
    <Suspense fallback={null}>
      <AdminEventsContent />
    </Suspense>
  );
}
