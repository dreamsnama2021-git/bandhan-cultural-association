"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useAdminData } from "@/components/AdminDataContext";
import type { Coupon } from "@/types";

export default function AdminEditCouponModal({
  coupon,
  onClose,
}: {
  coupon: Coupon | null;
  onClose: () => void;
}) {
  const { updateCoupon } = useAdminData();
  const [draft, setDraft] = useState<Coupon | null>(coupon);
  const [errors, setErrors] = useState<Partial<Record<"businessName" | "code" | "discount" | "endDate", string>>>({});

  useEffect(() => {
    setDraft(coupon);
    setErrors({});
  }, [coupon]);

  if (!draft) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!draft.businessName.trim()) next.businessName = "Business name is required.";
    if (!draft.code.trim()) next.code = "Coupon code is required.";
    if (!draft.discount.trim()) next.discount = "Discount is required.";
    if (!draft.endDate) next.endDate = "Valid-till date is required.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    updateCoupon(draft.id, {
      businessName: draft.businessName,
      code: draft.code,
      discount: draft.discount,
      endDate: draft.endDate,
    });
    onClose();
  };

  return (
    <Modal open={!!coupon} onClose={onClose} title="Edit Coupon">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Business Name</label>
          <input
            className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
            value={draft.businessName}
            onChange={(e) => setDraft({ ...draft, businessName: e.target.value })}
          />
          {errors.businessName && <p className="mt-1 text-xs text-maroon-600">{errors.businessName}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Coupon Code</label>
          <input
            className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm font-mono focus-ring"
            value={draft.code}
            onChange={(e) => setDraft({ ...draft, code: e.target.value.toUpperCase() })}
          />
          {errors.code && <p className="mt-1 text-xs text-maroon-600">{errors.code}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Discount</label>
          <input
            className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
            value={draft.discount}
            onChange={(e) => setDraft({ ...draft, discount: e.target.value })}
          />
          {errors.discount && <p className="mt-1 text-xs text-maroon-600">{errors.discount}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Valid Till</label>
          <input
            type="date"
            className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
            value={draft.endDate}
            onChange={(e) => setDraft({ ...draft, endDate: e.target.value })}
          />
          {errors.endDate && <p className="mt-1 text-xs text-maroon-600">{errors.endDate}</p>}
        </div>
        <Button type="submit" size="lg" className="w-full justify-center">
          Save Changes
        </Button>
      </form>
    </Modal>
  );
}
