"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { cn } from "@/lib/utils";
import { useAdminData } from "@/components/AdminDataContext";
import type { Stall, StallCategory, StallSizeType, StallStatus } from "@/types";

const statuses: StallStatus[] = ["available", "reserved", "sold-out"];
const categories: StallCategory[] = ["Food", "Product"];
const sizeTypes: { id: StallSizeType; label: string; size: string }[] = [
  { id: "full", label: "Full Stall", size: "10x10 ft" },
  { id: "half", label: "Half Stall", size: "5x10 ft" },
];

export default function AdminEditStallModal({
  stall,
  onClose,
}: {
  stall: Stall | null;
  onClose: () => void;
}) {
  const { updateStall } = useAdminData();
  const [draft, setDraft] = useState<Stall | null>(stall);
  const [errors, setErrors] = useState<Partial<Record<"location" | "first5" | "last5" | "full10", string>>>({});

  useEffect(() => {
    setDraft(stall);
    setErrors({});
  }, [stall]);

  if (!draft) return null;

  const setSizeType = (sizeType: StallSizeType) => {
    const size = sizeTypes.find((s) => s.id === sizeType)!.size;
    setDraft({
      ...draft,
      sizeType,
      size,
      pricing: sizeType === "half" ? { full10: draft.pricing.full10 } : { first5: draft.pricing.first5 ?? 0, last5: draft.pricing.last5 ?? 0, full10: draft.pricing.full10 },
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!draft.location.trim()) next.location = "Location is required.";
    if (!draft.pricing.full10 || draft.pricing.full10 <= 0) next.full10 = "Enter a valid price.";
    if (draft.sizeType === "full") {
      if (!draft.pricing.first5 || draft.pricing.first5 <= 0) next.first5 = "Enter a valid price.";
      if (!draft.pricing.last5 || draft.pricing.last5 <= 0) next.last5 = "Enter a valid price.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    updateStall(draft.id, {
      location: draft.location,
      category: draft.category,
      sizeType: draft.sizeType,
      size: draft.size,
      pricing: draft.pricing,
      status: draft.status,
    });
    onClose();
  };

  return (
    <Modal open={!!stall} onClose={onClose} title={`Edit Stall ${draft.code}`}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Location</label>
          <input
            className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
            value={draft.location}
            onChange={(e) => setDraft({ ...draft, location: e.target.value })}
          />
          {errors.location && <p className="mt-1 text-xs text-maroon-600">{errors.location}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Category</label>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setDraft({ ...draft, category: c })}
                className={cn(
                  "rounded-xl border-2 px-3 py-2.5 text-xs font-semibold transition-colors focus-ring",
                  draft.category === c
                    ? "border-saffron-500 bg-saffron-50 text-maroon-500"
                    : "border-maroon-500/10 bg-white/60 text-charcoal hover:border-saffron-500/40"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Stall Size</label>
          <div className="grid grid-cols-2 gap-3">
            {sizeTypes.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSizeType(s.id)}
                className={cn(
                  "rounded-xl border-2 px-3 py-2.5 text-xs font-semibold transition-colors focus-ring",
                  draft.sizeType === s.id
                    ? "border-saffron-500 bg-saffron-50 text-maroon-500"
                    : "border-maroon-500/10 bg-white/60 text-charcoal hover:border-saffron-500/40"
                )}
              >
                {s.label} ({s.size})
              </button>
            ))}
          </div>
        </div>

        {draft.sizeType === "full" ? (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">First 5 Days (₹)</label>
              <input
                type="number"
                className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-3 py-2.5 text-sm focus-ring"
                value={draft.pricing.first5 ?? 0}
                onChange={(e) => setDraft({ ...draft, pricing: { ...draft.pricing, first5: Number(e.target.value) } })}
              />
              {errors.first5 && <p className="mt-1 text-xs text-maroon-600">{errors.first5}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">Last 5 Days (₹)</label>
              <input
                type="number"
                className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-3 py-2.5 text-sm focus-ring"
                value={draft.pricing.last5 ?? 0}
                onChange={(e) => setDraft({ ...draft, pricing: { ...draft.pricing, last5: Number(e.target.value) } })}
              />
              {errors.last5 && <p className="mt-1 text-xs text-maroon-600">{errors.last5}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">Full 10 Days (₹)</label>
              <input
                type="number"
                className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-3 py-2.5 text-sm focus-ring"
                value={draft.pricing.full10}
                onChange={(e) => setDraft({ ...draft, pricing: { ...draft.pricing, full10: Number(e.target.value) } })}
              />
              {errors.full10 && <p className="mt-1 text-xs text-maroon-600">{errors.full10}</p>}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">Price for 10 Days (₹)</label>
            <input
              type="number"
              className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
              value={draft.pricing.full10}
              onChange={(e) => setDraft({ ...draft, pricing: { full10: Number(e.target.value) } })}
            />
            {errors.full10 && <p className="mt-1 text-xs text-maroon-600">{errors.full10}</p>}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Status</label>
          <div className="grid grid-cols-3 gap-3">
            {statuses.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setDraft({ ...draft, status: s })}
                className={cn(
                  "rounded-xl border-2 px-3 py-2.5 text-xs font-semibold capitalize transition-colors focus-ring",
                  draft.status === s
                    ? "border-saffron-500 bg-saffron-50 text-maroon-500"
                    : "border-maroon-500/10 bg-white/60 text-charcoal hover:border-saffron-500/40"
                )}
              >
                {s.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>
        <Button type="submit" size="lg" className="w-full justify-center">
          Save Changes
        </Button>
      </form>
    </Modal>
  );
}
