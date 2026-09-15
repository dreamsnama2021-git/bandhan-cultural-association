"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { generateId, isValidMobile } from "@/lib/utils";
import Button from "@/components/Button";
import type { FamilyMemberDetails } from "@/types";

type Errors = Partial<Record<keyof FamilyMemberDetails, string>>;

export default function FamilyMemberForm({
  maxMembers,
  onContinue,
  onBack,
}: {
  maxMembers: number;
  onContinue: (members: FamilyMemberDetails[]) => void;
  onBack: () => void;
}) {
  const [members, setMembers] = useState<FamilyMemberDetails[]>([]);
  const [errors, setErrors] = useState<Record<string, Errors>>({});

  const addMember = () => {
    if (members.length >= maxMembers) return;
    setMembers((prev) => [
      ...prev,
      { id: generateId("FAM"), name: "", contact: "", age: "", aadharFile: null, panNumber: "" },
    ]);
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const updateMember = (id: string, field: keyof FamilyMemberDetails, value: string | null) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const handleSubmit = () => {
    const nextErrors: Record<string, Errors> = {};
    members.forEach((m) => {
      const memberErrors: Errors = {};
      if (!m.name.trim()) memberErrors.name = "Name is required.";
      if (!isValidMobile(m.contact)) memberErrors.contact = "Enter a valid 10-digit number.";
      if (!m.age.trim() || Number(m.age) < 0) memberErrors.age = "Enter a valid age.";
      if (Object.keys(memberErrors).length > 0) nextErrors[m.id] = memberErrors;
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onContinue(members);
  };

  const inputClass =
    "w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm text-charcoal focus-ring";

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-maroon-500 text-center">
        Family Member Details
      </h1>
      <p className="mt-2 text-center text-sm text-charcoal-light">
        Note: Fill up for add-on family members
        {maxMembers > 0 && ` (up to ${maxMembers}, free)`}.
      </p>

      <div className="mt-8 space-y-6">
        {members.map((m, i) => {
          const memberErrors = errors[m.id] ?? {};
          return (
            <div key={m.id} className="rounded-2xl bg-white/70 border border-maroon-500/10 p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <span className="font-display text-lg font-semibold text-maroon-500">
                  Family Member {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeMember(m.id)}
                  className="p-1.5 rounded-full text-maroon-600 hover:bg-maroon-50 focus-ring"
                  aria-label="Remove family member"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1.5">Name</label>
                  <input className={inputClass} value={m.name} onChange={(e) => updateMember(m.id, "name", e.target.value)} />
                  {memberErrors.name && <p className="mt-1 text-xs text-maroon-600">{memberErrors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1.5">Contact No.</label>
                    <input className={inputClass} value={m.contact} onChange={(e) => updateMember(m.id, "contact", e.target.value)} inputMode="numeric" />
                    {memberErrors.contact && <p className="mt-1 text-xs text-maroon-600">{memberErrors.contact}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1.5">Age</label>
                    <input className={inputClass} value={m.age} onChange={(e) => updateMember(m.id, "age", e.target.value)} inputMode="numeric" placeholder="e.g. 4" />
                    {memberErrors.age && <p className="mt-1 text-xs text-maroon-600">{memberErrors.age}</p>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {members.length < maxMembers && (
        <button
          type="button"
          onClick={addMember}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-maroon-500/25 py-3.5 text-sm font-semibold text-maroon-600 hover:border-saffron-500 hover:bg-saffron-50 transition-colors focus-ring"
        >
          <Plus className="h-4 w-4" /> Add Family Member
        </button>
      )}

      <div className="mt-8 flex gap-3">
        <Button type="button" variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button type="button" size="lg" className="flex-1 justify-center" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}
