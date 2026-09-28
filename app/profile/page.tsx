"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import {
  UserCircle2,
  Pencil,
  Save,
  Ticket,
  HeartHandshake,
  CalendarCheck,
  Tag,
  Users,
  CheckCircle2,
  XCircle,
  Plus,
  UploadCloud,
} from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Checkout from "@/components/Checkout";
import { cn, formatCurrency, formatDate, generateId, isValidMobile } from "@/lib/utils";
import { useToast } from "@/components/Toast";
import { getCurrentSessionMember, updateFamilyMembers, updateMemberRecord } from "@/lib/credentials";
import { supabase } from "@/lib/supabase";
import { membershipConfig } from "@/lib/config";
import {
  currentMember,
  sponsorshipHistory,
  ticketHistory,
  bookingHistory,
  couponHistory,
} from "@/data/members";
import { membershipTypeLabels } from "@/data/membership";
import type { FamilyMemberDetails, Member, ProfileHistoryItem } from "@/types";

type TabId = "sponsorships" | "tickets" | "bookings" | "coupons";

const tabs: { id: TabId; label: string; icon: typeof Ticket; data: ProfileHistoryItem[] }[] = [
  { id: "bookings", label: "Bookings", icon: CalendarCheck, data: bookingHistory },
  { id: "sponsorships", label: "Sponsorships", icon: HeartHandshake, data: sponsorshipHistory },
  { id: "tickets", label: "Tickets", icon: Ticket, data: ticketHistory },
  { id: "coupons", label: "Coupons", icon: Tag, data: couponHistory },
];

const CHILD_AGE_LIMIT = 5;
const emptyDraft: FamilyMemberDetails = { id: "", name: "", contact: "", age: "", aadharFile: null, panNumber: "" };

export default function ProfilePage() {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [member, setMember] = useState<Member>(currentMember);
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberDetails[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>("bookings");
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const { showToast } = useToast();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addPhase, setAddPhase] = useState<"form" | "payment">("form");
  const [draft, setDraft] = useState<FamilyMemberDetails>(emptyDraft);
  const [draftErrors, setDraftErrors] = useState<Partial<Record<keyof FamilyMemberDetails, string>>>({});

  useEffect(() => {
    const session = getCurrentSessionMember();
    if (session) {
      setMember(session.member);
      setFamilyMembers(session.familyMembers);
      setSessionEmail(session.email);
      setChecked(true);
    } else {
      router.replace("/login");
    }
  }, [router]);

  const activeData = tabs.find((t) => t.id === activeTab)!.data;

  const handleSave = async () => {
    const { error } = await supabase
      .from("members")
      .update({ full_name: member.fullName, mobile: member.mobile, city: member.city, address: member.address })
      .eq("id", member.id);
    if (error) {
      showToast("Could not save your changes. Please try again.", "error");
      return;
    }
    updateMemberRecord(member.id, {
      fullName: member.fullName,
      mobile: member.mobile,
      city: member.city,
      address: member.address,
    });
    setEditing(false);
    showToast("Profile updated successfully", "success");
  };

  const inputClass = "w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring";

  const isChildDraft = draft.age !== "" && Number(draft.age) < CHILD_AGE_LIMIT;

  const openAddModal = () => {
    setDraft({ ...emptyDraft, id: generateId("FAM") });
    setDraftErrors({});
    setAddPhase("form");
    setAddModalOpen(true);
  };

  const handleDraftSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof draftErrors = {};
    if (!draft.name.trim()) next.name = "Name is required.";
    if (!isValidMobile(draft.contact)) next.contact = "Enter a valid 10-digit number.";
    if (!draft.age.trim() || Number(draft.age) < 0) next.age = "Enter a valid age.";
    if (!isChildDraft) {
      if (!draft.aadharFile) next.aadharFile = "Aadhar upload is required.";
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(draft.panNumber.toUpperCase())) next.panNumber = "Enter a valid PAN number.";
    }
    setDraftErrors(next);
    if (Object.keys(next).length === 0) setAddPhase("payment");
  };

  const handlePaymentComplete = () => {
    const nextFamily = [...familyMembers, draft];
    setFamilyMembers(nextFamily);
    setMember((m) => ({ ...m, familyMembers: m.familyMembers + 1 }));
    if (sessionEmail) updateFamilyMembers(sessionEmail, nextFamily);
    supabase
      .from("family_members")
      .insert({ member_id: member.id, name: draft.name, contact: draft.contact, age: draft.age })
      .then(({ error }) => {
        if (error) showToast("Family member saved locally, but could not sync to your account.", "error");
      });
    setAddModalOpen(false);
    showToast("Family member added successfully", "success");
  };

  if (!checked) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-charcoal-light">Checking your session…</p>
      </section>
    );
  }

  return (
    <>
      <PageHeader eyebrow="My Account" title="Profile" crumbs={[{ label: "Profile" }]} />
      <section className="section-py">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="rounded-2xl bg-maroon-500 text-cream p-7 text-center">
                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cream/15">
                  <UserCircle2 className="h-12 w-12 text-saffron-300" />
                </span>
                <h2 className="mt-4 font-display text-2xl font-semibold">{member.fullName}</h2>
                <p className="text-sm text-cream/70">{member.memberId}</p>
                <div className="mt-4 inline-block rounded-full bg-saffron-500 text-charcoal text-xs font-bold px-3 py-1">
                  {membershipTypeLabels[member.membershipType]} MEMBER
                </div>
                <p className="mt-3 text-xs text-cream/60">
                  Valid until {member.validUntil === "Lifetime" ? "Lifetime" : formatDate(member.validUntil)}
                </p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-white/70 border border-maroon-500/10 p-7">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-xl font-semibold text-maroon-500">Personal Details</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => (editing ? handleSave() : setEditing(true))}
                    icon={editing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                  >
                    {editing ? "Save" : "Edit"}
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Full Name" value={member.fullName} editing={editing} onChange={(v) => setMember({ ...member, fullName: v })} inputClass={inputClass} />
                  <Field label="Phone" value={member.mobile} editing={editing} onChange={(v) => setMember({ ...member, mobile: v })} inputClass={inputClass} />
                  <Field label="Email" value={member.email} editing={false} onChange={() => {}} inputClass={inputClass} />
                  <Field label="City" value={member.city} editing={editing} onChange={(v) => setMember({ ...member, city: v })} inputClass={inputClass} />
                  <Field label="Address" value={member.address} editing={editing} onChange={(v) => setMember({ ...member, address: v })} inputClass={inputClass} className="sm:col-span-2" />
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-white/70 border border-maroon-500/10 p-7">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-saffron-100 text-maroon-500">
                      <Users className="h-[18px] w-[18px]" />
                    </span>
                    <h3 className="font-display text-xl font-semibold text-maroon-500">
                      Family Members ({familyMembers.length})
                    </h3>
                  </div>
                  <Button size="sm" variant="outline" onClick={openAddModal} icon={<Plus className="h-4 w-4" />}>
                    Add Member
                  </Button>
                </div>

                {familyMembers.length === 0 ? (
                  <p className="text-sm text-charcoal-light">
                    No family members added yet. Adding one here costs {formatCurrency(membershipConfig.additionalFamilyMemberFee)}.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {familyMembers.map((fm, i) => {
                      const isChild = fm.age !== "" && Number(fm.age) < CHILD_AGE_LIMIT;
                      return (
                        <div key={fm.id} className="rounded-xl bg-beige-light border border-beige-dark p-5">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold text-charcoal">
                              {fm.name || `Member ${i + 2}`}
                              {isChild && (
                                <span className="ml-2 text-[10px] font-semibold text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded-full align-middle">
                                  CHILD
                                </span>
                              )}
                            </span>
                            <span className="text-xs text-charcoal-light">Age: {fm.age || "—"}</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                              <p className="text-charcoal-light">Contact No.</p>
                              <p className="font-semibold text-charcoal mt-0.5">{fm.contact || "—"}</p>
                            </div>
                            <div>
                              <p className="text-charcoal-light">Aadhar</p>
                              <p className="flex items-center gap-1 font-semibold text-charcoal mt-0.5">
                                {fm.aadharFile ? (
                                  <>
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Uploaded
                                  </>
                                ) : isChild ? (
                                  <span className="text-charcoal-light font-normal">Not required</span>
                                ) : (
                                  <>
                                    <XCircle className="h-3.5 w-3.5 text-maroon-500" /> Missing
                                  </>
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-charcoal-light">PAN Number</p>
                              <p className="font-semibold text-charcoal mt-0.5">
                                {fm.panNumber || (isChild ? <span className="text-charcoal-light font-normal">Not required</span> : "—")}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-8">
                <div className="flex flex-wrap gap-2 mb-6">
                  {tabs.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors focus-ring",
                        activeTab === t.id ? "bg-maroon-500 text-cream" : "bg-white/70 text-charcoal hover:bg-maroon-50"
                      )}
                    >
                      <t.icon className="h-4 w-4" /> {t.label}
                    </button>
                  ))}
                </div>

                <div className="rounded-2xl bg-white/70 border border-maroon-500/10 divide-y divide-maroon-500/10">
                  {activeData.length === 0 ? (
                    <p className="p-6 text-sm text-charcoal-light">No records yet.</p>
                  ) : (
                    activeData.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-5">
                        <div>
                          <p className="font-semibold text-charcoal text-sm">{item.label}</p>
                          <p className="text-xs text-charcoal-light mt-0.5">{formatDate(item.date)}</p>
                        </div>
                        <div className="text-right">
                          {item.amount !== undefined && (
                            <p className="font-semibold text-charcoal text-sm">₹{item.amount.toLocaleString("en-IN")}</p>
                          )}
                          <span className="text-xs text-saffron-700 font-semibold">{item.status}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add Family Member">
        {addPhase === "form" && (
          <form onSubmit={handleDraftSubmit} noValidate className="space-y-4">
            <p className="flex items-center justify-between rounded-xl bg-beige-light border border-beige-dark px-4 py-3 text-sm">
              <span className="text-charcoal-light">Charge for this member</span>
              <span className="font-display text-lg font-bold text-maroon-500">
                {formatCurrency(membershipConfig.additionalFamilyMemberFee)}
              </span>
            </p>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">Name</label>
              <input className={inputClass} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              {draftErrors.name && <p className="mt-1 text-xs text-maroon-600">{draftErrors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">Contact No.</label>
                <input className={inputClass} value={draft.contact} onChange={(e) => setDraft({ ...draft, contact: e.target.value })} inputMode="numeric" />
                {draftErrors.contact && <p className="mt-1 text-xs text-maroon-600">{draftErrors.contact}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">Age</label>
                <input className={inputClass} value={draft.age} onChange={(e) => setDraft({ ...draft, age: e.target.value })} inputMode="numeric" placeholder="e.g. 4" />
                {draftErrors.age && <p className="mt-1 text-xs text-maroon-600">{draftErrors.age}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">
                  Upload Aadhar {isChildDraft && <span className="text-charcoal-light font-normal">(optional)</span>}
                </label>
                <label className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-maroon-500/25 py-2.5 cursor-pointer hover:border-saffron-500 transition-colors h-[42px]">
                  <input type="file" className="hidden" onChange={(e) => setDraft({ ...draft, aadharFile: e.target.files?.[0]?.name ?? null })} />
                  {draft.aadharFile ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-charcoal truncate">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> <span className="truncate">{draft.aadharFile}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-charcoal-light">
                      <UploadCloud className="h-3.5 w-3.5 text-saffron-600" /> Upload
                    </span>
                  )}
                </label>
                {draftErrors.aadharFile && <p className="mt-1 text-xs text-maroon-600">{draftErrors.aadharFile}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">
                  PAN Number {isChildDraft && <span className="text-charcoal-light font-normal">(optional)</span>}
                </label>
                <input
                  className={cn(inputClass, "uppercase")}
                  value={draft.panNumber}
                  onChange={(e) => setDraft({ ...draft, panNumber: e.target.value.toUpperCase() })}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                />
                {draftErrors.panNumber && <p className="mt-1 text-xs text-maroon-600">{draftErrors.panNumber}</p>}
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full justify-center">
              Continue to Payment
            </Button>
          </form>
        )}

        {addPhase === "payment" && (
          <Checkout
            summary={{
              itemLabel: "Additional Family Member",
              itemDescription: draft.name,
              price: membershipConfig.additionalFamilyMemberFee,
            }}
            onComplete={handlePaymentComplete}
          />
        )}
      </Modal>
    </>
  );
}

function Field({
  label,
  value,
  editing,
  onChange,
  inputClass,
  className,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
  inputClass: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold uppercase tracking-wide text-charcoal-light mb-1.5">{label}</label>
      {editing ? (
        <input className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <p className="text-sm font-semibold text-charcoal">{value}</p>
      )}
    </div>
  );
}
