"use client";

import { useState } from "react";
import { User, Pencil, Trash2, Download, Plus } from "lucide-react";
import Container from "@/components/Container";
import AdminTopBar from "@/components/AdminTopBar";
import AdminEditSponsorModal from "@/components/AdminEditSponsorModal";
import AdminIndividualSponsorshipItemModal from "@/components/AdminIndividualSponsorshipItemModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useAdminData } from "@/components/AdminDataContext";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { downloadCsv } from "@/lib/csv";
import type { IndividualSponsorshipCategory, IndividualSponsorshipItem, Sponsor } from "@/types";

const categoryTabs: { id: IndividualSponsorshipCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "puja", label: "Puja" },
  { id: "mahabhog", label: "Mahabhog" },
];

export default function AdminIndividualSponsorsPage() {
  const {
    sponsors,
    deleteSponsor,
    individualSponsorshipItems,
    deleteIndividualSponsorshipItem,
  } = useAdminData();
  const individualSponsors = sponsors.filter((s) => s.type === "individual");
  const [editing, setEditing] = useState<Sponsor | null>(null);
  const [deleting, setDeleting] = useState<Sponsor | null>(null);

  const [filter, setFilter] = useState<IndividualSponsorshipCategory | "all">("all");
  const [addingItem, setAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<IndividualSponsorshipItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<IndividualSponsorshipItem | null>(null);

  const visibleItems = filter === "all" ? individualSponsorshipItems : individualSponsorshipItems.filter((i) => i.category === filter);

  const itemLabel = (itemId?: string) => {
    if (!itemId) return "—";
    const item = individualSponsorshipItems.find((i) => i.id === itemId);
    return item ? `${item.name} (${item.day})` : itemId;
  };

  const confirmDelete = () => {
    if (deleting) deleteSponsor(deleting.id);
    setDeleting(null);
  };

  const confirmDeleteItem = () => {
    if (deletingItem) deleteIndividualSponsorshipItem(deletingItem.id);
    setDeletingItem(null);
  };

  const handleDownload = () => {
    const headers = ["Name", "Email", "Phone", "Sponsorship", "Amount", "Status", "Date"];
    const rows = individualSponsors.map((s) => [
      s.name,
      s.contactEmail,
      s.contactPhone,
      itemLabel(s.packageId),
      formatCurrency(s.amount),
      s.status.toUpperCase(),
      formatDate(s.createdOn),
    ]);
    downloadCsv("individual-sponsorships.csv", headers, rows);
  };

  return (
    <>
      <AdminTopBar title="Individual Sponsors" description="Individual contributions received by the association." />
      <section className="section-py">
        <Container>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-maroon-500">
              Individual Sponsorship — Puja &amp; Mahabhog Rate Card
            </h2>
            <button
              type="button"
              onClick={() => setAddingItem(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-maroon-500 text-cream text-sm font-semibold px-4 py-2 focus-ring"
            >
              <Plus className="h-4 w-4" /> Add Item
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold transition-colors focus-ring",
                  filter === tab.id ? "bg-maroon-500 text-cream" : "bg-white/70 text-charcoal hover:bg-maroon-50"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {visibleItems.map((item) => (
              <div key={item.id} className="rounded-2xl bg-white/70 border border-maroon-500/10 p-5">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-saffron-700">{item.day}</span>
                <p className="font-display text-lg font-semibold text-maroon-500 mt-1">{item.name}</p>
                <p className="mt-1 font-display text-2xl font-bold text-charcoal">{formatCurrency(item.price)}</p>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-maroon-500/10">
                  <button
                    type="button"
                    onClick={() => setEditingItem(item)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-maroon-600 hover:text-maroon-700 focus-ring rounded px-1"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingItem(item)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 focus-ring rounded px-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-maroon-500">Contributions Received</h2>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-maroon-600 hover:text-maroon-700 focus-ring rounded px-2 py-1"
            >
              <Download className="h-3.5 w-3.5" /> Download Excel
            </button>
          </div>
          <div className="rounded-2xl bg-white/70 border border-maroon-500/10 overflow-x-auto">
            <table className="w-full text-sm min-w-[860px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-charcoal-light border-b border-maroon-500/10">
                  <th className="p-4">Contributor</th>
                  <th className="p-4">Sponsorship</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-maroon-500/10">
                {individualSponsors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-charcoal-light">
                      No individual contributions received yet.
                    </td>
                  </tr>
                ) : (
                  individualSponsors.map((s) => (
                    <tr key={s.id}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-saffron-100 text-maroon-500 shrink-0">
                            <User className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold text-charcoal truncate">{s.name}</p>
                            <p className="text-xs text-charcoal-light truncate">{s.contactEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{itemLabel(s.packageId)}</td>
                      <td className="p-4 font-semibold text-charcoal">{formatCurrency(s.amount)}</td>
                      <td className="p-4">
                        <span
                          className={cn(
                            "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                            s.status === "confirmed" ? "bg-emerald-50 text-emerald-700" : "bg-saffron-50 text-saffron-700"
                          )}
                        >
                          {s.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">{formatDate(s.createdOn)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditing(s)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-maroon-600 hover:text-maroon-700 focus-ring rounded px-2 py-1"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleting(s)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 focus-ring rounded px-2 py-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <AdminEditSponsorModal sponsor={editing} onClose={() => setEditing(null)} />
      <ConfirmDialog
        open={!!deleting}
        title="Remove Sponsor"
        description={deleting ? `Remove sponsor "${deleting.name}"?` : ""}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />

      <AdminIndividualSponsorshipItemModal open={addingItem} existing={null} onClose={() => setAddingItem(false)} />
      <AdminIndividualSponsorshipItemModal open={!!editingItem} existing={editingItem} onClose={() => setEditingItem(null)} />
      <ConfirmDialog
        open={!!deletingItem}
        title="Remove Sponsorship Item"
        description={deletingItem ? `Remove "${deletingItem.name}"?` : ""}
        onConfirm={confirmDeleteItem}
        onCancel={() => setDeletingItem(null)}
      />
    </>
  );
}
