"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { cn, generateMemberId, generatePassword, isValidEmail, isValidMobile } from "@/lib/utils";
import { saveCredential } from "@/lib/credentials";
import { registrationMembershipTypes } from "@/data/membership";
import { useAdminMembers } from "@/components/AdminMembersContext";
import type { Member, MembershipType } from "@/types";

const makeEmptyDraft = (defaultType: MembershipType) => ({
  fullName: "",
  mobile: "",
  email: "",
  city: "",
  membershipType: defaultType,
});

export default function AdminAddMemberModal({
  open,
  onClose,
  defaultType = "core",
  lockType = false,
}: {
  open: boolean;
  onClose: () => void;
  defaultType?: MembershipType;
  lockType?: boolean;
}) {
  const { addMember } = useAdminMembers();
  const [draft, setDraft] = useState(makeEmptyDraft(defaultType));
  const [draftErrors, setDraftErrors] = useState<Partial<Record<keyof ReturnType<typeof makeEmptyDraft>, string>>>({});
  const [created, setCreated] = useState<{ member: Member; password: string } | null>(null);

  const reset = () => {
    setDraft(makeEmptyDraft(defaultType));
    setDraftErrors({});
    setCreated(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof draftErrors = {};
    if (!draft.fullName.trim()) next.fullName = "Name is required.";
    if (!isValidMobile(draft.mobile)) next.mobile = "Enter a valid 10-digit number.";
    if (!isValidEmail(draft.email)) next.email = "Enter a valid email address.";
    setDraftErrors(next);
    if (Object.keys(next).length > 0) return;

    const joined = new Date();
    const valid = new Date(joined);
    valid.setFullYear(valid.getFullYear() + 1);
    const newMember: Member = {
      id: `mem-${Date.now()}`,
      memberId: generateMemberId(),
      fullName: draft.fullName,
      email: draft.email,
      mobile: draft.mobile,
      address: "",
      city: draft.city,
      membershipType: draft.membershipType,
      familyMembers: 0,
      joinedOn: joined.toISOString(),
      validUntil: valid.toISOString(),
      // Only Core-tier members added directly by admin count as "Leader";
      // General-tier members are always regular members, no matter who adds them.
      role: draft.membershipType === "core" ? "leader" : "member",
    };
    const password = generatePassword();
    saveCredential({ email: draft.email, password, member: newMember, familyMembers: [] });
    addMember(newMember);
    setCreated({ member: newMember, password });
  };

  return (
    <Modal open={open} onClose={handleClose} title={created ? "Member Added" : "Add Member"}>
      {!created ? (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <p className="text-xs text-charcoal-light">
            Add a member directly — no self-registration, Aadhar/PAN or payment required. A login ID and password
            will be generated for them automatically. Only <span className="font-semibold text-maroon-600">Core</span>{" "}
            members added here count as Leaders — General members do not.
          </p>
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">Full Name</label>
            <input
              className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
              value={draft.fullName}
              onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
            />
            {draftErrors.fullName && <p className="mt-1 text-xs text-maroon-600">{draftErrors.fullName}</p>}
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
              {draftErrors.mobile && <p className="mt-1 text-xs text-maroon-600">{draftErrors.mobile}</p>}
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
            {draftErrors.email && <p className="mt-1 text-xs text-maroon-600">{draftErrors.email}</p>}
          </div>
          {!lockType && (
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">Membership Type</label>
              <div className="grid grid-cols-2 gap-3">
                {registrationMembershipTypes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setDraft({ ...draft, membershipType: t.id })}
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
          )}
          <Button type="submit" size="lg" className="w-full justify-center">
            Add Member &amp; Generate Login
          </Button>
        </form>
      ) : (
        <div>
          <div className="flex items-center gap-2 text-emerald-700 mb-4">
            <CheckCircle2 className="h-5 w-5" />
            <p className="text-sm font-semibold">{created.member.fullName} has been added successfully.</p>
          </div>
          <div className="rounded-xl bg-beige-light border border-beige-dark p-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-charcoal-light">Member ID</span>
              <span className="font-mono font-semibold text-charcoal">{created.member.memberId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-charcoal-light">Login ID (Email)</span>
              <span className="font-semibold text-charcoal">{created.member.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-charcoal-light">Password</span>
              <span className="font-mono font-semibold text-charcoal">{created.password}</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-charcoal-light">
            Share these credentials with the member directly — they can log in with them right away.
          </p>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={reset}>
              Add Another
            </Button>
            <Button className="flex-1 justify-center" onClick={handleClose}>
              Done
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
