"use client";

import { useState } from "react";
import { Check, Download, Pencil, Trash2, X } from "lucide-react";
import Container from "@/components/Container";
import AdminTopBar from "@/components/AdminTopBar";
import AdminEditStallModal from "@/components/AdminEditStallModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useAdminData } from "@/components/AdminDataContext";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { downloadCsv } from "@/lib/csv";
import { effectiveStallStatus, stallDurationLabels } from "@/lib/stallBookings";
import type { Stall, StallBookingStatus } from "@/types";

function priceSummary(stall: Stall): string {
  if (stall.sizeType === "half") return formatCurrency(stall.pricing.full10);
  return `${formatCurrency(stall.pricing.first5 ?? 0)} – ${formatCurrency(stall.pricing.full10)}`;
}

const statusStyles: Record<StallBookingStatus, string> = {
  pending: "bg-saffron-50 text-saffron-700",
  approved: "bg-blue-50 text-blue-700",
  paid: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
};

export default function AdminStallsPage() {
  const { stalls, deleteStall, stallBookings, approveStallBooking, rejectStallBooking } = useAdminData();
  const [editing, setEditing] = useState<Stall | null>(null);
  const [deleting, setDeleting] = useState<Stall | null>(null);

  const confirmDelete = () => {
    if (deleting) deleteStall(deleting.id);
    setDeleting(null);
  };

  const stallCode = (stallId: string) => stalls.find((s) => s.id === stallId)?.code ?? stallId;

  const handleDownload = () => {
    const headers = ["Business Name", "Contact Person", "Phone", "Email", "Stall", "Duration", "Amount", "Status", "Requested On"];
    const rows = stallBookings.map((b) => [
      b.businessName,
      b.contactPerson,
      b.contactPhone,
      b.contactEmail,
      stallCode(b.stallId),
      stallDurationLabels[b.duration],
      formatCurrency(b.amount),
      b.status.toUpperCase(),
      formatDate(b.requestedOn),
    ]);
    downloadCsv("stall-bookings.csv", headers, rows);
  };

  return (
    <>
      <AdminTopBar title="Stall Bookings" description="Festival stall inventory, pricing and booking status." />
      <section className="section-py">
        <Container>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-maroon-500">Stall Booking Requests</h2>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-maroon-600 hover:text-maroon-700 focus-ring rounded px-2 py-1"
            >
              <Download className="h-3.5 w-3.5" /> Download Excel
            </button>
          </div>
          <div className="rounded-2xl bg-white/70 border border-maroon-500/10 overflow-x-auto mb-10">
            <table className="w-full text-sm min-w-[920px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-charcoal-light border-b border-maroon-500/10">
                  <th className="p-4">Business / Contact</th>
                  <th className="p-4">Stall</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Requested On</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-maroon-500/10">
                {stallBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-charcoal-light">
                      No stall booking requests yet.
                    </td>
                  </tr>
                ) : (
                  stallBookings.map((b) => (
                    <tr key={b.id}>
                      <td className="p-4">
                        <p className="font-semibold text-charcoal">{b.businessName}</p>
                        <p className="text-xs text-charcoal-light">{b.contactPerson} &middot; {b.contactEmail}</p>
                      </td>
                      <td className="p-4 font-semibold text-charcoal">{stallCode(b.stallId)}</td>
                      <td className="p-4">{stallDurationLabels[b.duration]}</td>
                      <td className="p-4">{formatCurrency(b.amount)}</td>
                      <td className="p-4">
                        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", statusStyles[b.status])}>
                          {b.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">{formatDate(b.requestedOn)}</td>
                      <td className="p-4">
                        {b.status === "pending" ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => approveStallBooking(b.id)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 focus-ring rounded px-2 py-1"
                            >
                              <Check className="h-3.5 w-3.5" /> Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => rejectStallBooking(b.id)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 focus-ring rounded px-2 py-1"
                            >
                              <X className="h-3.5 w-3.5" /> Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-charcoal-light">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <h2 className="font-display text-xl font-semibold text-maroon-500 mb-4">Stall Inventory</h2>
          <div className="rounded-2xl bg-white/70 border border-maroon-500/10 overflow-x-auto">
            <table className="w-full text-sm min-w-[740px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-charcoal-light border-b border-maroon-500/10">
                  <th className="p-4">Stall</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-maroon-500/10">
                {stalls.map((s) => (
                  <tr key={s.id}>
                    <td className="p-4 font-semibold text-charcoal">{s.code}</td>
                    <td className="p-4">{s.location}</td>
                    <td className="p-4">{s.category}</td>
                    <td className="p-4">{priceSummary(s)}</td>
                    <td className="p-4 capitalize">{effectiveStallStatus(s, stallBookings).replace("-", " ")}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setEditing(s)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-maroon-600 hover:text-maroon-700 focus-ring rounded px-1"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleting(s)}
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

      <AdminEditStallModal stall={editing} onClose={() => setEditing(null)} />
      <ConfirmDialog
        open={!!deleting}
        title="Remove Stall"
        description={deleting ? `Remove stall ${deleting.code}?` : ""}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
