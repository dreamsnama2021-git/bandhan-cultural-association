"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useAdminData } from "@/components/AdminDataContext";
import type { SponsorshipPackageTier } from "@/types";

export default function AdminSponsorshipPackageModal({
  open,
  existing,
  onClose,
}: {
  open: boolean;
  existing: SponsorshipPackageTier | null;
  onClose: () => void;
}) {
  const { addSponsorshipPackage, updateSponsorshipPackage } = useAdminData();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [perksText, setPerksText] = useState("");
  const [recommended, setRecommended] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<"name" | "price" | "description", string>>>({});

  useEffect(() => {
    setName(existing?.name ?? "");
    setPrice(existing?.price ?? 0);
    setDescription(existing?.description ?? "");
    setPerksText(existing?.perks.join("\n") ?? "");
    setRecommended(existing?.recommended ?? false);
    setErrors({});
  }, [existing, open]);

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Package name is required.";
    if (!price || price <= 0) next.price = "Enter a valid price.";
    if (!description.trim()) next.description = "Description is required.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const perks = perksText
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);

    const fields = { name, price, description, perks, discountPercent: 0, recommended };
    if (existing) {
      updateSponsorshipPackage(existing.id, fields);
    } else {
      addSponsorshipPackage(fields);
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={existing ? "Edit Sponsorship Package" : "Add Sponsorship Package"}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Package Name</label>
          <input
            className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Entrance Gate Pillars"
          />
          {errors.name && <p className="mt-1 text-xs text-maroon-600">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Price for 10 Days (₹)</label>
          <input
            type="number"
            className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
          {errors.price && <p className="mt-1 text-xs text-maroon-600">{errors.price}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Description</label>
          <textarea
            className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && <p className="mt-1 text-xs text-maroon-600">{errors.description}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Perks (one per line)</label>
          <textarea
            className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
            rows={4}
            value={perksText}
            onChange={(e) => setPerksText(e.target.value)}
            placeholder={"6 pillars available\nSize: 20 ft height × 4 ft breadth"}
          />
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-charcoal">
          <input
            type="checkbox"
            checked={recommended}
            onChange={(e) => setRecommended(e.target.checked)}
            className="h-4 w-4 rounded border-maroon-500/30 text-maroon-500 focus-ring"
          />
          Mark as &ldquo;Most Popular&rdquo;
        </label>
        <Button type="submit" size="lg" className="w-full justify-center">
          {existing ? "Save Changes" : "Add Package"}
        </Button>
      </form>
    </Modal>
  );
}
