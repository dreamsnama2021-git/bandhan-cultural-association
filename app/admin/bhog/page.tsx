"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, Sunrise } from "lucide-react";
import Container from "@/components/Container";
import AdminTopBar from "@/components/AdminTopBar";
import AdminBhogCouponModal from "@/components/AdminBhogCouponModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { cn, formatDate } from "@/lib/utils";
import { navratriDays } from "@/data/navratriDays";
import { getBhogCoupons, deleteBhogCoupon } from "@/lib/bhogCoupons";
import type { BhogCoupon, NavratriDay } from "@/types";

export default function AdminBhogPage() {
  const [coupons, setCoupons] = useState<BhogCoupon[]>([]);
  const [editingDay, setEditingDay] = useState<NavratriDay | null>(null);
  const [deletingDay, setDeletingDay] = useState<NavratriDay | null>(null);

  const refresh = () => setCoupons(getBhogCoupons());

  useEffect(() => {
    refresh();
  }, []);

  const couponFor = (dayNumber: number) => coupons.find((c) => c.dayNumber === dayNumber) ?? null;

  const confirmDelete = () => {
    if (deletingDay) {
      deleteBhogCoupon(deletingDay.dayNumber);
      refresh();
    }
    setDeletingDay(null);
  };

  return (
    <>
      <AdminTopBar
        title="Bhog Coupons"
        description="Generate the Navratri-day Bhog coupon members will see each morning. Each member gets one coupon per registered family member."
      />
      <section className="section-py">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {navratriDays.map((day) => {
              const coupon = couponFor(day.dayNumber);
              return (
                <div key={day.dayNumber} className="rounded-2xl bg-white/70 border border-maroon-500/10 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-2 text-xs font-semibold text-saffron-700">
                      <Sunrise className="h-4 w-4" /> Day {day.dayNumber} · {day.tithi}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-light mb-4">{formatDate(day.date)}</p>

                  {coupon ? (
                    <>
                      <p className="font-display text-lg font-semibold text-maroon-500">{coupon.title}</p>
                      {coupon.description && (
                        <p className="mt-1 text-sm text-charcoal-light">{coupon.description}</p>
                      )}
                      <p className="mt-2 font-mono text-xs text-charcoal-light bg-beige-light rounded-full inline-block px-3 py-1">
                        {coupon.code}
                      </p>
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-maroon-500/10">
                        <button
                          type="button"
                          onClick={() => setEditingDay(day)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-maroon-600 hover:text-maroon-700 focus-ring rounded px-1"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingDay(day)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 focus-ring rounded px-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-charcoal-light">No coupon generated yet.</p>
                      <button
                        type="button"
                        onClick={() => setEditingDay(day)}
                        className={cn(
                          "inline-flex items-center gap-1.5 mt-4 pt-4 border-t border-maroon-500/10 w-full",
                          "text-xs font-semibold text-maroon-600 hover:text-maroon-700 focus-ring rounded px-1"
                        )}
                      >
                        <Plus className="h-3.5 w-3.5" /> Generate Coupon
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <AdminBhogCouponModal
        day={editingDay}
        existing={editingDay ? couponFor(editingDay.dayNumber) : null}
        onClose={() => setEditingDay(null)}
        onSaved={refresh}
      />
      <ConfirmDialog
        open={!!deletingDay}
        title="Remove Bhog Coupon"
        description={deletingDay ? `Remove the Day ${deletingDay.dayNumber} (${deletingDay.tithi}) Bhog coupon?` : ""}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingDay(null)}
      />
    </>
  );
}
