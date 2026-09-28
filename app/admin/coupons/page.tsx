"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import Container from "@/components/Container";
import AdminTopBar from "@/components/AdminTopBar";
import AdminEditCouponModal from "@/components/AdminEditCouponModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useAdminData } from "@/components/AdminDataContext";
import { formatDate } from "@/lib/utils";
import type { Coupon } from "@/types";

export default function AdminCouponsPage() {
  const { coupons, deleteCoupon } = useAdminData();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [deleting, setDeleting] = useState<Coupon | null>(null);

  const confirmDelete = () => {
    if (deleting) deleteCoupon(deleting.id);
    setDeleting(null);
  };

  return (
    <>
      <AdminTopBar title="Coupons" description="Business promo codes and redemption activity." />
      <section className="section-py">
        <Container>
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-maroon-500 text-cream text-sm font-semibold px-4 py-2 focus-ring"
            >
              <Plus className="h-4 w-4" /> Add Coupon
            </button>
          </div>
          <div className="rounded-2xl bg-white/70 border border-maroon-500/10 overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-charcoal-light border-b border-maroon-500/10">
                  <th className="p-4">Business</th>
                  <th className="p-4">Code</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Valid Till</th>
                  <th className="p-4">Redemptions</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-maroon-500/10">
                {coupons.map((c) => (
                  <tr key={c.id}>
                    <td className="p-4 font-semibold text-charcoal">{c.businessName}</td>
                    <td className="p-4 font-mono text-xs">{c.code}</td>
                    <td className="p-4">{c.discount}</td>
                    <td className="p-4">{formatDate(c.endDate)}</td>
                    <td className="p-4">{c.redemptions ?? 0}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setEditing(c)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-maroon-600 hover:text-maroon-700 focus-ring rounded px-1"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleting(c)}
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

      <AdminEditCouponModal open={adding} existing={null} onClose={() => setAdding(false)} />
      <AdminEditCouponModal open={!!editing} existing={editing} onClose={() => setEditing(null)} />
      <ConfirmDialog
        open={!!deleting}
        title="Remove Coupon"
        description={deleting ? `Remove coupon "${deleting.code}"?` : ""}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
