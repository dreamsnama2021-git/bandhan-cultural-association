"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, Plus, X, Pencil, Trash2, Users, Download } from "lucide-react";
import Container from "@/components/Container";
import AdminTopBar from "@/components/AdminTopBar";
import AdminAddMemberModal from "@/components/AdminAddMemberModal";
import AdminEditMemberModal from "@/components/AdminEditMemberModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { useAdminMembers } from "@/components/AdminMembersContext";
import { cn, formatDate } from "@/lib/utils";
import { membershipTypeLabels } from "@/data/membership";
import { getFamilyMembersFor, downloadMembersCsv } from "@/lib/exportMembers";
import type { Member, MembershipType } from "@/types";

export default function AdminMemberDetailList({
  title,
  description,
  members,
  defaultType,
  lockType = false,
  filterChip,
}: {
  title: string;
  description: string;
  members: Member[];
  defaultType?: MembershipType;
  lockType?: boolean;
  filterChip?: { label: string; clearHref: string };
}) {
  const { deleteMember } = useAdminMembers();
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [deleting, setDeleting] = useState<Member | null>(null);
  const [viewingFamilyOf, setViewingFamilyOf] = useState<Member | null>(null);

  const confirmDelete = () => {
    if (deleting) deleteMember(deleting.id);
    setDeleting(null);
  };

  const handleDownload = () => {
    const filename = `${title.toLowerCase().replace(/\s+/g, "-")}.csv`;
    downloadMembersCsv(members, filename);
  };

  const familyOfViewing = viewingFamilyOf ? getFamilyMembersFor(viewingFamilyOf.email) : [];

  return (
    <>
      <AdminTopBar title={title} description={description} />
      <section className="section-py">
        <Container>
          <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
            {filterChip ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-saffron-100 text-maroon-600 text-sm font-semibold px-4 py-2">
                Filtered by: {filterChip.label}
                <Link href={filterChip.clearHref} aria-label="Clear filter" className="hover:text-maroon-700">
                  <X className="h-3.5 w-3.5" />
                </Link>
              </span>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownload}
                icon={<Download className="h-4 w-4" />}
                disabled={members.length === 0}
              >
                Download Excel
              </Button>
              <Button size="sm" onClick={() => setAddOpen(true)} icon={<Plus className="h-4 w-4" />}>
                Add Member
              </Button>
            </div>
          </div>

          {members.length === 0 ? (
            <p className="rounded-2xl bg-white/70 border border-maroon-500/10 p-8 text-center text-charcoal-light">
              No members here yet.
            </p>
          ) : (
            <div className="rounded-2xl bg-white/70 border border-maroon-500/10 overflow-x-auto">
              <table className="w-full text-sm min-w-[840px]">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-charcoal-light border-b border-maroon-500/10">
                    <th className="p-4">Member</th>
                    <th className="p-4">Member ID</th>
                    <th className="p-4">Plan</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">City</th>
                    <th className="p-4">Valid Until</th>
                    <th className="p-4">Family Members</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-maroon-500/10">
                  {members.map((m) => {
                    const familyCount = getFamilyMembersFor(m.email).length;
                    return (
                      <tr key={m.id}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-saffron-100 text-maroon-600 font-display font-bold text-xs shrink-0">
                              {m.fullName.charAt(0)}
                            </span>
                            <span className="font-semibold text-charcoal">{m.fullName}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-xs text-charcoal-light">{m.memberId}</td>
                        <td className="p-4">
                          <span className="inline-block text-xs font-semibold text-maroon-600 bg-maroon-50 px-2.5 py-1 rounded-full">
                            {m.role === "leader" ? "Leader" : membershipTypeLabels[m.membershipType]}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={cn(
                              "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                              m.role === "leader" ? "bg-saffron-100 text-maroon-600" : "bg-charcoal/5 text-charcoal-light"
                            )}
                          >
                            {m.role === "leader" ? "SUB-ADMIN" : "MEMBER"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1 text-xs text-charcoal-light">
                            <p className="flex items-center gap-1.5">
                              <Mail className="h-3 w-3 text-saffron-600 shrink-0" /> {m.email}
                            </p>
                            <p className="flex items-center gap-1.5">
                              <Phone className="h-3 w-3 text-saffron-600 shrink-0" /> {m.mobile}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">{m.city || "—"}</td>
                        <td className="p-4">{m.validUntil === "Lifetime" ? "Lifetime" : formatDate(m.validUntil)}</td>
                        <td className="p-4">
                          {familyCount > 0 ? (
                            <button
                              type="button"
                              onClick={() => setViewingFamilyOf(m)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-maroon-600 hover:text-maroon-700 focus-ring rounded px-1"
                            >
                              <Users className="h-3.5 w-3.5" /> View ({familyCount})
                            </button>
                          ) : (
                            <span className="text-xs text-charcoal-light">—</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setEditing(m)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-maroon-600 hover:text-maroon-700 focus-ring rounded px-1"
                            >
                              <Pencil className="h-3.5 w-3.5" /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleting(m)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 focus-ring rounded px-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Container>
      </section>

      <AdminAddMemberModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        defaultType={defaultType}
        lockType={lockType}
      />
      <AdminEditMemberModal member={editing} onClose={() => setEditing(null)} />
      <ConfirmDialog
        open={!!deleting}
        title="Remove Member"
        description={deleting ? `Remove ${deleting.fullName} from the member directory?` : ""}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
      <Modal
        open={!!viewingFamilyOf}
        onClose={() => setViewingFamilyOf(null)}
        title={viewingFamilyOf ? `${viewingFamilyOf.fullName}'s Family Members` : undefined}
      >
        <div className="space-y-3">
          {familyOfViewing.map((f) => (
            <div key={f.id} className="rounded-xl bg-beige-light border border-beige-dark p-4">
              <p className="font-semibold text-charcoal">{f.name}</p>
              <p className="text-xs text-charcoal-light mt-1">Age {f.age} &middot; {f.contact}</p>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
