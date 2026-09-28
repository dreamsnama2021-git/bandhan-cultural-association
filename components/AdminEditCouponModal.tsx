"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useAdminData } from "@/components/AdminDataContext";
import type { Coupon } from "@/types";

const emptyForm = {
  businessName: "",
  code: "",
  discount: "",
  category: "",
  startDate: "",
  endDate: "",
  terms: "",
};

export default function AdminEditCouponModal({
  open,
  existing,
  onClose,
}: {
  open: boolean;
  existing: Coupon | null;
  onClose: () => void;
}) {
  const { addCoupon, updateCoupon } = useAdminData();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<"businessName" | "code" | "discount" | "startDate" | "endDate", string>>>({});

  useEffect(() => {
    setForm(
      existing
        ? {
            businessName: existing.businessName,
            code: existing.code,
            discount: existing.discount,
            category: existing.category,
            startDate: existing.startDate,
            endDate: existing.endDate,
            terms: existing.terms,
          }
        : emptyForm
    );
    setErrors({});
  }, [existing, open]);

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!form.businessName.trim()) next.businessName = "Business name is required.";
    if (!form.code.trim()) next.code = "Coupon code is required.";
    if (!form.discount.trim()) next.discount = "Discount is required.";
    if (!form.startDate) next.startDate = "Start date is required.";
    if (!form.endDate) next.endDate = "Valid-till date is required.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (existing) {
      updateCoupon(existing.id, form);
    } else {
      addCoupon({ ...form, redemptions: 0 });
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={existing ? "Edit Coupon" : "Add Coupon"}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Business Name</label>
          <input
            className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
            value={form.businessName}
            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
          />
          {errors.businessName && <p className="mt-1 text-xs text-maroon-600">{errors.businessName}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">Coupon Code</label>
            <input
              className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm font-mono focus-ring"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            />
            {errors.code && <p className="mt-1 text-xs text-maroon-600">{errors.code}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">Category</label>
            <input
              className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. Food & Dining"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Discount</label>
          <input
            className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
            value={form.discount}
            onChange={(e) => setForm({ ...form, discount: e.target.value })}
            placeholder="e.g. 20% off on orders above ₹500"
          />
          {errors.discount && <p className="mt-1 text-xs text-maroon-600">{errors.discount}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">Start Date</label>
            <input
              type="date"
              className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
            {errors.startDate && <p className="mt-1 text-xs text-maroon-600">{errors.startDate}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">Valid Till</label>
            <input
              type="date"
              className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
            {errors.endDate && <p className="mt-1 text-xs text-maroon-600">{errors.endDate}</p>}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Terms</label>
          <textarea
            className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
            rows={2}
            value={form.terms}
            onChange={(e) => setForm({ ...form, terms: e.target.value })}
          />
        </div>
        <Button type="submit" size="lg" className="w-full justify-center">
          {existing ? "Save Changes" : "Add Coupon"}
        </Button>
      </form>
    </Modal>
  );
}
