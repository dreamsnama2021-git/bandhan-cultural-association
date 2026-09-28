"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { cn } from "@/lib/utils";
import { useAdminData } from "@/components/AdminDataContext";
import type { IndividualSponsorshipCategory, IndividualSponsorshipItem } from "@/types";

const categories: { id: IndividualSponsorshipCategory; label: string }[] = [
  { id: "puja", label: "Puja" },
  { id: "mahabhog", label: "Mahabhog" },
];

export default function AdminIndividualSponsorshipItemModal({
  open,
  existing,
  onClose,
}: {
  open: boolean;
  existing: IndividualSponsorshipItem | null;
  onClose: () => void;
}) {
  const { addIndividualSponsorshipItem, updateIndividualSponsorshipItem } = useAdminData();
  const [day, setDay] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<IndividualSponsorshipCategory>("puja");
  const [price, setPrice] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<"day" | "name" | "price", string>>>({});

  useEffect(() => {
    setDay(existing?.day ?? "");
    setName(existing?.name ?? "");
    setCategory(existing?.category ?? "puja");
    setPrice(existing?.price ?? 0);
    setErrors({});
  }, [existing, open]);

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!day.trim()) next.day = "Day is required.";
    if (!name.trim()) next.name = "Name is required.";
    if (!price || price <= 0) next.price = "Enter a valid price.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const fields = { day, name, category, price };
    if (existing) {
      updateIndividualSponsorshipItem(existing.id, fields);
    } else {
      addIndividualSponsorshipItem(fields);
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={existing ? "Edit Sponsorship Item" : "Add Sponsorship Item"}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Category</label>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={cn(
                  "rounded-xl border-2 px-3 py-2.5 text-xs font-semibold transition-colors focus-ring",
                  category === c.id
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
            <label className="block text-xs font-semibold text-charcoal mb-1.5">Day</label>
            <input
              className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              placeholder="e.g. Ashtami"
            />
            {errors.day && <p className="mt-1 text-xs text-maroon-600">{errors.day}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">Price (₹)</label>
            <input
              type="number"
              className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            {errors.price && <p className="mt-1 text-xs text-maroon-600">{errors.price}</p>}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Name</label>
          <input
            className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ashtami Sandhi Puja"
          />
          {errors.name && <p className="mt-1 text-xs text-maroon-600">{errors.name}</p>}
        </div>
        <Button type="submit" size="lg" className="w-full justify-center">
          {existing ? "Save Changes" : "Add Item"}
        </Button>
      </form>
    </Modal>
  );
}
