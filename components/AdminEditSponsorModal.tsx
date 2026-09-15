"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { cn, isValidEmail, isValidMobile } from "@/lib/utils";
import { useAdminData } from "@/components/AdminDataContext";
import type { Sponsor } from "@/types";

export default function AdminEditSponsorModal({
  sponsor,
  onClose,
}: {
  sponsor: Sponsor | null;
  onClose: () => void;
}) {
  const { updateSponsor } = useAdminData();
  const [draft, setDraft] = useState<Sponsor | null>(sponsor);
  const [errors, setErrors] = useState<Partial<Record<"name" | "contactEmail" | "contactPhone" | "amount", string>>>({});

  useEffect(() => {
    setDraft(sponsor);
    setErrors({});
  }, [sponsor]);

  if (!draft) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!draft.name.trim()) next.name = "Name is required.";
    if (!isValidEmail(draft.contactEmail)) next.contactEmail = "Enter a valid email address.";
    if (!isValidMobile(draft.contactPhone)) next.contactPhone = "Enter a valid 10-digit number.";
    if (!draft.amount || draft.amount <= 0) next.amount = "Enter a valid amount.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    updateSponsor(draft.id, {
      name: draft.name,
      contactEmail: draft.contactEmail,
      contactPhone: draft.contactPhone,
      amount: draft.amount,
      status: draft.status,
    });
    onClose();
  };

  return (
    <Modal open={!!sponsor} onClose={onClose} title="Edit Sponsor">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Name</label>
          <input
            className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
          {errors.name && <p className="mt-1 text-xs text-maroon-600">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Contact Email</label>
          <input
            type="email"
            className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
            value={draft.contactEmail}
            onChange={(e) => setDraft({ ...draft, contactEmail: e.target.value })}
          />
          {errors.contactEmail && <p className="mt-1 text-xs text-maroon-600">{errors.contactEmail}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">Contact Phone</label>
            <input
              className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
              value={draft.contactPhone}
              onChange={(e) => setDraft({ ...draft, contactPhone: e.target.value })}
              inputMode="numeric"
            />
            {errors.contactPhone && <p className="mt-1 text-xs text-maroon-600">{errors.contactPhone}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">Amount (₹)</label>
            <input
              type="number"
              className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
              value={draft.amount}
              onChange={(e) => setDraft({ ...draft, amount: Number(e.target.value) })}
            />
            {errors.amount && <p className="mt-1 text-xs text-maroon-600">{errors.amount}</p>}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Status</label>
          <div className="grid grid-cols-2 gap-3">
            {(["pending", "confirmed"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setDraft({ ...draft, status: s })}
                className={cn(
                  "rounded-xl border-2 px-4 py-2.5 text-sm font-semibold capitalize transition-colors focus-ring",
                  draft.status === s
                    ? "border-saffron-500 bg-saffron-50 text-maroon-500"
                    : "border-maroon-500/10 bg-white/60 text-charcoal hover:border-saffron-500/40"
                )}
              >
                {s}
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
