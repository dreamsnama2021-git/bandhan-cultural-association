"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Container from "@/components/Container";
import AdminTopBar from "@/components/AdminTopBar";
import AdminAddMemberModal from "@/components/AdminAddMemberModal";
import AdminEditMemberModal from "@/components/AdminEditMemberModal";
import AdminEditAdminModal from "@/components/AdminEditAdminModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import Button from "@/components/Button";
import { cn, formatDate } from "@/lib/utils";
import { membershipTypeLabels } from "@/data/membership";
import { useAdminMembers } from "@/components/AdminMembersContext";
import { useAdminIdentity } from "@/components/admin/AdminAccessContext";
import { getAdminProfile } from "@/lib/adminProfile";
import type { Member } from "@/types";

export default function AdminMembersPage() {
  const identity = useAdminIdentity();
  const { members, deleteMember } = useAdminMembers();
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [deleting, setDeleting] = useState<Member | null>(null);
  const [editingAdmin, setEditingAdmin] = useState(false);
  const [deletingAdmin, setDeletingAdmin] = useState(false);
  const [adminProfile, setAdminProfile] = useState(getAdminProfile());

  const confirmDelete = () => {
    if (deleting) deleteMember(deleting.id);
    setDeleting(null);
  };

  return (
    <>
      <AdminTopBar title="All Members" description="Every registered and admin-added member of the association." />
      <section className="section-py">
        <Container>
          <div className="flex items-center justify-end mb-4">
            <Button size="sm" onClick={() => setAddOpen(true)} icon={<Plus className="h-4 w-4" />}>
              Add Member
            </Button>
          </div>

          <div className="rounded-2xl bg-white/70 border border-maroon-500/10 overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-charcoal-light border-b border-maroon-500/10">
                  <th className="p-4">Member</th>
                  <th className="p-4">Member ID</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Valid Until</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-maroon-500/10">
                <tr>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-maroon-500 text-cream font-display font-bold text-xs shrink-0">
                        {adminProfile.name.charAt(0)}
                      </span>
                      <span className="font-semibold text-charcoal">{adminProfile.name}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs text-charcoal-light">—</td>
                  <td className="p-4">Admin</td>
                  <td className="p-4">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-maroon-500 text-cream">
                      ADMIN
                    </span>
                  </td>
                  <td className="p-4">—</td>
                  <td className="p-4">Lifetime</td>
                  <td className="p-4">
                    {identity.isTrueAdmin && (
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setEditingAdmin(true)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-maroon-600 hover:text-maroon-700 focus-ring rounded px-1"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingAdmin(true)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 focus-ring rounded px-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>

                {members.map((m) => (
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
                    <td className="p-4">{m.role === "leader" ? "Leader" : membershipTypeLabels[m.membershipType]}</td>
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
                    <td className="p-4">{m.city}</td>
                    <td className="p-4">{m.validUntil === "Lifetime" ? "Lifetime" : formatDate(m.validUntil)}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <AdminAddMemberModal open={addOpen} onClose={() => setAddOpen(false)} />
      <AdminEditMemberModal member={editing} onClose={() => setEditing(null)} />
      <AdminEditAdminModal
        open={editingAdmin}
        onClose={() => setEditingAdmin(false)}
        onSaved={() => setAdminProfile(getAdminProfile())}
      />
      <ConfirmDialog
        open={!!deleting}
        title="Remove Member"
        description={deleting ? `Remove ${deleting.fullName} from the member directory?` : ""}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
      <ConfirmDialog
        open={deletingAdmin}
        title="Remove Admin"
        description="The Admin account can't be removed — the association always needs at least one Admin."
        confirmLabel="Okay"
        onConfirm={() => setDeletingAdmin(false)}
        onCancel={() => setDeletingAdmin(false)}
      />
    </>
  );
}
