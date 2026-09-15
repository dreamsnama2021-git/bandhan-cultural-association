"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { cn, isValidEmail, isValidMobile } from "@/lib/utils";
import { registrationMembershipTypes } from "@/data/membership";
import { useAdminMembers } from "@/components/AdminMembersContext";
import { updateMemberRecord } from "@/lib/credentials";
import { addNotification } from "@/lib/notifications";
import type { Member, MemberRole, MembershipType } from "@/types";

export default function AdminEditMemberModal({
  member,
  onClose,
}: {
  member: Member | null;
  onClose: () => void;
}) {
  const { updateMember } = useAdminMembers();
  const [draft, setDraft] = useState<Member | null>(member);
  const [errors, setErrors] = useState<Partial<Record<"fullName" | "mobile" | "email", string>>>({});

  useEffect(() => {
    setDraft(member);
    setErrors({});
  }, [member]);

  if (!draft) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!draft.fullName.trim()) next.fullName = "Name is required.";
    if (!isValidMobile(draft.mobile)) next.mobile = "Enter a valid 10-digit number.";
    if (!isValidEmail(draft.email)) next.email = "Enter a valid email address.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const patch = {
      fullName: draft.fullName,
      mobile: draft.mobile,
      email: draft.email,
      city: draft.city,
      membershipType: draft.membershipType,
      role: draft.role,
    };
    updateMember(draft.id, patch);
    updateMemberRecord(draft.id, patch);
    addNotification(draft.id, "Your profile details were updated by the admin.");
    onClose();
  };

  return (
    <Modal open={!!member} onClose={onClose} title="Edit Member">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Full Name</label>
          <input
            className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
            value={draft.fullName}
            onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
          />
          {errors.fullName && <p className="mt-1 text-xs text-maroon-600">{errors.fullName}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">Mobile</label>
            <input
              className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
              value={draft.mobile}
              onChange={(e) => setDraft({ ...draft, mobile: e.target.value })}
              inputMode="numeric"
            />
            {errors.mobile && <p className="mt-1 text-xs text-maroon-600">{errors.mobile}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">City</label>
            <input
              className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
              value={draft.city}
              onChange={(e) => setDraft({ ...draft, city: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Email</label>
          <input
            type="email"
            className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
            value={draft.email}
            onChange={(e) => setDraft({ ...draft, email: e.target.value })}
          />
          {errors.email && <p className="mt-1 text-xs text-maroon-600">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Membership Type</label>
          <div className="grid grid-cols-2 gap-3">
            {registrationMembershipTypes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setDraft({ ...draft, membershipType: t.id as MembershipType })}
                className={cn(
                  "rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-colors focus-ring",
                  draft.membershipType === t.id
                    ? "border-saffron-500 bg-saffron-50 text-maroon-500"
                    : "border-maroon-500/10 bg-white/60 text-charcoal hover:border-saffron-500/40"
                )}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">Role</label>
          <div className="grid grid-cols-2 gap-3">
            {(["member", "leader"] as MemberRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setDraft({ ...draft, role: r })}
                className={cn(
                  "rounded-xl border-2 px-4 py-2.5 text-sm font-semibold capitalize transition-colors focus-ring",
                  draft.role === r
                    ? "border-saffron-500 bg-saffron-50 text-maroon-500"
                    : "border-maroon-500/10 bg-white/60 text-charcoal hover:border-saffron-500/40"
                )}
              >
                {r}
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
