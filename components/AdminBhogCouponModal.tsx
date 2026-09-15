"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { saveBhogCoupon } from "@/lib/bhogCoupons";
import type { BhogCoupon, NavratriDay } from "@/types";

export default function AdminBhogCouponModal({
  day,
  existing,
  onClose,
  onSaved,
}: {
  day: NavratriDay | null;
  existing: BhogCoupon | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<Partial<Record<"title" | "code", string>>>({});

  useEffect(() => {
    setTitle(existing?.title ?? "");
    setDescription(existing?.description ?? "");
    setCode(existing?.code ?? (day ? `BHOG-DAY${day.dayNumber}` : ""));
    setErrors({});
  }, [day, existing]);

  if (!day) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!title.trim()) next.title = "Title is required.";
    if (!code.trim()) next.code = "Coupon code is required.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    saveBhogCoupon(day.dayNumber, { title, description, code: code.toUpperCase() });
    onSaved();
    onClose();
  };

  return (
    <Modal open={!!day} onClose={onClose} title={`Day ${day.dayNumber} — ${day.tithi} Bhog Coupon`}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <p className="text-xs text-charcoal-light">
          This coupon will unlock for members on the morning of{" "}
          {new Date(day.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}. Each
          member will see one coupon instance per registered family member.
        </p>
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Coupon Title</label>
          <input
            className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Shashthi Bhog Prasad"
          />
          {errors.title && <p className="mt-1 text-xs text-maroon-600">{errors.title}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Description</label>
          <textarea
            className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's on the menu, where to collect it, etc."
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Coupon Code</label>
          <input
            className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm font-mono focus-ring"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
          {errors.code && <p className="mt-1 text-xs text-maroon-600">{errors.code}</p>}
        </div>
        <Button type="submit" size="lg" className="w-full justify-center">
          {existing ? "Save Changes" : "Generate Coupon"}
        </Button>
      </form>
    </Modal>
  );
}
