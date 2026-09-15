"use client";

import { useState } from "react";
import { Building2, User, Pencil, Trash2, Percent, Download } from "lucide-react";
import Container from "@/components/Container";
import AdminTopBar from "@/components/AdminTopBar";
import AdminEditSponsorModal from "@/components/AdminEditSponsorModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useAdminData } from "@/components/AdminDataContext";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { downloadCsv } from "@/lib/csv";
import { sponsorshipPackages } from "@/data/sponsorshipPackages";
import { sponsorshipDiscountTiers } from "@/lib/discounts";
import type { Sponsor } from "@/types";

function packageName(packageId?: string): string {
  if (!packageId) return "—";
  return sponsorshipPackages[packageId]?.name ?? packageId;
}

export default function AdminSponsorsPage() {
  const { sponsors, deleteSponsor } = useAdminData();
  const [editing, setEditing] = useState<Sponsor | null>(null);
  const [deleting, setDeleting] = useState<Sponsor | null>(null);

  const confirmDelete = () => {
    if (deleting) deleteSponsor(deleting.id);
    setDeleting(null);
  };

  const handleDownload = () => {
    const headers = ["Name", "Email", "Category", "Type", "Package", "MRP", "Discount", "Final Price", "Status", "Date"];
    const rows = sponsors.map((s) => [
      s.name,
      s.contactEmail,
      s.category ?? "—",
      s.type,
      packageName(s.packageId),
      s.mrp ? formatCurrency(s.mrp) : "—",
      s.discountPercent ? `${s.discountPercent}%` : "—",
      formatCurrency(s.amount),
      s.status.toUpperCase(),
      formatDate(s.createdOn),
    ]);
    downloadCsv("sponsorships.csv", headers, rows);
  };

  return (
    <>
      <AdminTopBar title="Sponsors" description="Business and individual sponsorships received by the association." />
      <section className="section-py">
        <Container>
          <h2 className="font-display text-xl font-semibold text-maroon-500 mb-4">
            Business Sponsorship — Core Spaces Rate Card
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {Object.values(sponsorshipPackages).map((p) => (
              <div key={p.id} className="rounded-2xl bg-white/70 border border-maroon-500/10 p-5">
                <p className="font-display text-lg font-semibold text-maroon-500">{p.name}</p>
                <p className="mt-1 font-display text-2xl font-bold text-charcoal">{formatCurrency(p.price)}</p>
                <p className="mt-2 text-xs text-charcoal-light">{p.description}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-beige-light border border-beige-dark p-5 mb-10">
            <p className="flex items-center gap-2 text-sm font-semibold text-maroon-600 mb-3">
              <Percent className="h-4 w-4" /> Discount applied automatically at checkout, by who&apos;s signed in
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {sponsorshipDiscountTiers.map((tier) => (
                <div key={tier.label} className="rounded-xl bg-white/70 border border-maroon-500/10 p-3">
                  <p className="font-display text-2xl font-bold text-maroon-500">{tier.percent}%</p>
                  <p className="text-xs text-charcoal-light mt-0.5">{tier.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-maroon-500">Sponsorships Received</h2>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-maroon-600 hover:text-maroon-700 focus-ring rounded px-2 py-1"
            >
              <Download className="h-3.5 w-3.5" /> Download Excel
            </button>
          </div>
          <div className="rounded-2xl bg-white/70 border border-maroon-500/10 overflow-x-auto">
            <table className="w-full text-sm min-w-[960px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-charcoal-light border-b border-maroon-500/10">
                  <th className="p-4">User</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Package Selected</th>
                  <th className="p-4">MRP</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Final Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-maroon-500/10">
                {sponsors.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-charcoal-light">
                      No sponsorships received yet.
                    </td>
                  </tr>
                ) : (
                  sponsors.map((s) => (
                    <tr key={s.id}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-saffron-100 text-maroon-500 shrink-0">
                            {s.type === "business" ? <Building2 className="h-4 w-4" /> : <User className="h-4 w-4" />}
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold text-charcoal truncate">{s.name}</p>
                            <p className="text-xs text-charcoal-light truncate">{s.contactEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{s.category ?? "—"}</td>
                      <td className="p-4">{packageName(s.packageId)}</td>
                      <td className="p-4">{s.mrp ? formatCurrency(s.mrp) : "—"}</td>
                      <td className="p-4">{s.discountPercent ? `${s.discountPercent}%` : "—"}</td>
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
    </>
  );
}
