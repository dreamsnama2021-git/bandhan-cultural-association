"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { cn } from "@/lib/utils";
import { useAdminData } from "@/components/AdminDataContext";
import { pujaCategories } from "@/data/pujaCategories";
import type { EventItem } from "@/types";

const categoryOptions: { id: EventItem["category"]; label: string }[] = [
  ...pujaCategories.map((c) => ({ id: c.id as EventItem["category"], label: c.name })),
  { id: "cultural-program", label: "Cultural Program" },
  { id: "community", label: "Community Event" },
];

const emptyForm = {
  name: "",
  category: categoryOptions[0].id,
  date: "",
  time: "",
  venue: "",
  ticketPriceFrom: 0,
  seatsAvailable: 0,
};

export default function AdminEditEventModal({
  open,
  existing,
  onClose,
}: {
  open: boolean;
  existing: EventItem | null;
  onClose: () => void;
}) {
  const { addEvent, updateEvent } = useAdminData();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<"name" | "venue" | "date" | "time", string>>>({});

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name,
        category: existing.category,
        date: existing.date,
        time: existing.time,
        venue: existing.venue,
        ticketPriceFrom: existing.ticketPriceFrom,
        seatsAvailable: existing.seatsAvailable,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [existing, open]);

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "Event name is required.";
    if (!form.venue.trim()) next.venue = "Venue is required.";
    if (!form.date) next.date = "Date is required.";
    if (!form.time.trim()) next.time = "Time is required.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (existing) {
      updateEvent(existing.id, form);
    } else {
      addEvent({ ...form, description: "", image: "default" });
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={existing ? "Edit Event" : "Add Event"}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Event Name</label>
          <input
            className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <p className="mt-1 text-xs text-maroon-600">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Puja / Category</label>
          <div className="grid grid-cols-3 gap-2">
            {categoryOptions.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setForm({ ...form, category: c.id })}
                className={cn(
                  "rounded-xl border-2 px-2 py-2 text-xs font-semibold transition-colors focus-ring",
                  form.category === c.id
                    ? "border-saffron-500 bg-saffron-50 text-maroon-500"
                    : "border-maroon-500/10 bg-white/60 text-charcoal hover:border-saffron-500/40"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">Date</label>
            <input
              type="date"
              className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            {errors.date && <p className="mt-1 text-xs text-maroon-600">{errors.date}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">Time</label>
            <input
              className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              placeholder="e.g. 6:00 PM – 9:00 PM"
            />
            {errors.time && <p className="mt-1 text-xs text-maroon-600">{errors.time}</p>}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Venue</label>
          <input
            className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
          />
          {errors.venue && <p className="mt-1 text-xs text-maroon-600">{errors.venue}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">Ticket Price From (₹)</label>
            <input
              type="number"
              className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
              value={form.ticketPriceFrom}
              onChange={(e) => setForm({ ...form, ticketPriceFrom: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">Seats Available</label>
            <input
              type="number"
              className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
              value={form.seatsAvailable}
              onChange={(e) => setForm({ ...form, seatsAvailable: Number(e.target.value) })}
            />
          </div>
        </div>
        <Button type="submit" size="lg" className="w-full justify-center">
          {existing ? "Save Changes" : "Add Event"}
        </Button>
      </form>
    </Modal>
  );
}
