"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import Container from "@/components/Container";
import AdminTopBar from "@/components/AdminTopBar";
import AdminEditEventModal from "@/components/AdminEditEventModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useAdminData } from "@/components/AdminDataContext";
import { formatCurrency } from "@/lib/utils";
import { pujaCategories } from "@/data/pujaCategories";
import type { EventItem } from "@/types";

export default function AdminTicketsPage() {
  const { events, deleteEvent } = useAdminData();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [deleting, setDeleting] = useState<EventItem | null>(null);

  const pujaName = (category: EventItem["category"]) =>
    pujaCategories.find((c) => c.id === category)?.name ?? category;

  const confirmDelete = () => {
    if (deleting) deleteEvent(deleting.id);
    setDeleting(null);
  };

  return (
    <>
      <AdminTopBar title="Tickets" description="Ticket pricing and seat availability across all Puja events." />
      <section className="section-py">
        <Container>
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-maroon-500 text-cream text-sm font-semibold px-4 py-2 focus-ring"
            >
              <Plus className="h-4 w-4" /> Add Event
            </button>
          </div>
          <div className="rounded-2xl bg-white/70 border border-maroon-500/10 overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-charcoal-light border-b border-maroon-500/10">
                  <th className="p-4">Event</th>
                  <th className="p-4">Puja</th>
                  <th className="p-4">Ticket From</th>
                  <th className="p-4">Seats Available</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-maroon-500/10">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-charcoal-light">
                      No events found.
                    </td>
                  </tr>
                ) : (
                  events.map((e) => (
                    <tr key={e.id}>
                      <td className="p-4 font-semibold text-charcoal">{e.name}</td>
                      <td className="p-4">{pujaName(e.category)}</td>
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

      <AdminEditEventModal open={adding} existing={null} onClose={() => setAdding(false)} />
      <AdminEditEventModal open={!!editing} existing={editing} onClose={() => setEditing(null)} />
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
