"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useAdminData } from "@/components/AdminDataContext";
import type { EventItem } from "@/types";

export default function AdminEditEventModal({
  event,
  onClose,
}: {
  event: EventItem | null;
  onClose: () => void;
}) {
  const { updateEvent } = useAdminData();
  const [draft, setDraft] = useState<EventItem | null>(event);
  const [errors, setErrors] = useState<Partial<Record<"name" | "venue" | "date", string>>>({});

  useEffect(() => {
    setDraft(event);
    setErrors({});
  }, [event]);

  if (!draft) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!draft.name.trim()) next.name = "Event name is required.";
    if (!draft.venue.trim()) next.venue = "Venue is required.";
    if (!draft.date) next.date = "Date is required.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    updateEvent(draft.id, {
      name: draft.name,
      date: draft.date,
      venue: draft.venue,
      ticketPriceFrom: draft.ticketPriceFrom,
      seatsAvailable: draft.seatsAvailable,
    });
    onClose();
  };

  return (
    <Modal open={!!event} onClose={onClose} title="Edit Event">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Event Name</label>
          <input
            className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
          {errors.name && <p className="mt-1 text-xs text-maroon-600">{errors.name}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">Date</label>
            <input
              type="date"
              className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
            />
            {errors.date && <p className="mt-1 text-xs text-maroon-600">{errors.date}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">Venue</label>
            <input
              className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
              value={draft.venue}
              onChange={(e) => setDraft({ ...draft, venue: e.target.value })}
            />
            {errors.venue && <p className="mt-1 text-xs text-maroon-600">{errors.venue}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">Ticket Price From (₹)</label>
            <input
              type="number"
              className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
              value={draft.ticketPriceFrom}
              onChange={(e) => setDraft({ ...draft, ticketPriceFrom: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">Seats Available</label>
            <input
              type="number"
              className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
              value={draft.seatsAvailable}
              onChange={(e) => setDraft({ ...draft, seatsAvailable: Number(e.target.value) })}
            />
          </div>
        </div>
        <Button type="submit" size="lg" className="w-full justify-center">
          Save Changes
        </Button>
      </form>
    </Modal>
  );
}
