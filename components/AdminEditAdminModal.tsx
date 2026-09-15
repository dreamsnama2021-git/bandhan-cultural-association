"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { isValidEmail } from "@/lib/utils";
import { getAdminProfile, saveAdminProfile, type AdminProfile } from "@/lib/adminProfile";

export default function AdminEditAdminModal({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [draft, setDraft] = useState<AdminProfile>({ name: "", email: "" });
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (open) setDraft(getAdminProfile());
  }, [open]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!isValidEmail(draft.email)) {
      setError("Enter a valid email address.");
      return;
    }
    saveAdminProfile(draft);
    onSaved();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Admin">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <p className="text-xs text-charcoal-light">
          This updates how the Admin&apos;s name and contact email are shown across the panel. The Admin login itself
          stays fixed.
        </p>
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Name</label>
          <input
            className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Email</label>
          <input
            type="email"
            className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
            value={draft.email}
            onChange={(e) => setDraft({ ...draft, email: e.target.value })}
          />
        </div>
        {error && <p className="text-xs text-maroon-600">{error}</p>}
        <Button type="submit" size="lg" className="w-full justify-center">
          Save Changes
        </Button>
      </form>
    </Modal>
  );
}
