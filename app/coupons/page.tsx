"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Ticket, Plus } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import CouponCard from "@/components/CouponCard";
import Button from "@/components/Button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/Toast";
import { coupons as initialCoupons } from "@/data/coupons";
import type { Coupon } from "@/types";

export default function CouponsPage() {
  const [tab, setTab] = useState<"browse" | "create">("browse");
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const { showToast } = useToast();

  const [form, setForm] = useState({
    businessName: "",
    code: "",
    discount: "",
    startDate: "",
    endDate: "",
    terms: "",
    category: "Food & Dining",
  });

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    const newCoupon: Coupon = {
      id: `cp-${Date.now()}`,
      ...form,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    showToast("Coupon created successfully", "success");
    setForm({ businessName: "", code: "", discount: "", startDate: "", endDate: "", terms: "", category: "Food & Dining" });
    setTab("browse");
  };

  const inputClass = "w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-3 text-sm focus-ring";

  return (
    <>
      <PageHeader
        eyebrow="Coupons"
        title="Member coupons & business offers"
        description="Businesses can create promotional coupons; members can browse and redeem them."
        crumbs={[{ label: "Coupons" }]}
      />
      <section className="section-py">
        <Container>
          <div className="flex gap-2 mb-10">
            <TabButton active={tab === "browse"} onClick={() => setTab("browse")} icon={Ticket} label="Browse Coupons" />
            <TabButton active={tab === "create"} onClick={() => setTab("create")} icon={Plus} label="Create a Coupon" />
          </div>

          {tab === "browse" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((coupon, i) => (
                <CouponCard key={coupon.id} coupon={coupon} index={i} />
              ))}
            </div>
          ) : (
            <form onSubmit={handleCreate} className="max-w-xl space-y-5" noValidate>
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">Business Name</label>
                <input required className={inputClass} value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-1.5">Coupon Code</label>
                  <input required className={inputClass} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="BCA20OFF" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-1.5">Category</label>
                  <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option>Food & Dining</option>
                    <option>Fashion & Apparel</option>
                    <option>Electronics</option>
                    <option>Beauty & Wellness</option>
                    <option>Home & Décor</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">Discount</label>
                <input required className={inputClass} value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} placeholder="e.g. 15% off on all items" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-1.5">Start Date</label>
                  <input required type="date" className={inputClass} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-1.5">End Date</label>
                  <input required type="date" className={inputClass} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">Terms & Conditions</label>
                <textarea required rows={3} className={inputClass} value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} />
              </div>
              <Button type="submit" size="lg">Create Coupon</Button>
            </form>
          )}
        </Container>
      </section>
    </>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Ticket;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors focus-ring",
        active ? "bg-maroon-500 text-cream" : "bg-white/70 text-charcoal hover:bg-maroon-50"
      )}
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}
