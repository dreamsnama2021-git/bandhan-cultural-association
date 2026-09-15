"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sunrise, Soup, Lock } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import { formatDate } from "@/lib/utils";
import { navratriDays } from "@/data/navratriDays";
import { getBhogCouponForDay, isNavratriDayUnlocked } from "@/lib/bhogCoupons";
import { useMemberGuard } from "@/lib/useMemberGuard";
import type { BhogCoupon } from "@/types";

export default function BhogDayPage({ params }: { params: { dayNumber: string } }) {
  const session = useMemberGuard();
  const dayNumber = Number(params.dayNumber);
  const day = navratriDays.find((d) => d.dayNumber === dayNumber);
  const [coupon, setCoupon] = useState<BhogCoupon | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (day) setCoupon(getBhogCouponForDay(day.dayNumber));
    setLoaded(true);
  }, [day]);

  if (!session) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-charcoal-light">Checking your session…</p>
      </section>
    );
  }

  if (!day) {
    return (
      <>
        <PageHeader eyebrow="Bhog" title="Day not found" crumbs={[{ label: "Bhog", href: "/bhog" }, { label: "Not found" }]} />
        <section className="section-py">
          <Container className="max-w-lg text-center">
            <Link href="/bhog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-maroon-600">
              <ArrowLeft className="h-4 w-4" /> Back to Navratri days
            </Link>
          </Container>
        </section>
      </>
    );
  }

  const unlocked = isNavratriDayUnlocked(day.date);
  const quantity = 1 + session.member.familyMembers;

  return (
    <>
      <PageHeader
        eyebrow="Bhog"
        title={`Day ${day.dayNumber} — ${day.tithi}`}
        description={formatDate(day.date)}
      />

      <section className="section-py">
        <Container className="max-w-2xl">
          <Link href="/bhog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-maroon-600 hover:text-maroon-700 mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Navratri days
          </Link>

          {!unlocked && (
            <div className="rounded-2xl bg-white/70 border border-maroon-500/10 p-8 text-center">
              <Lock className="h-8 w-8 text-charcoal-light mx-auto" />
              <p className="mt-4 font-display text-xl font-semibold text-maroon-500">Not unlocked yet</p>
              <p className="mt-2 text-sm text-charcoal-light">
                This day's Bhog coupon will be available from the morning of {formatDate(day.date)}. Come back then.
              </p>
            </div>
          )}

          {unlocked && loaded && !coupon && (
            <div className="rounded-2xl bg-white/70 border border-maroon-500/10 p-8 text-center">
              <Soup className="h-8 w-8 text-charcoal-light mx-auto" />
              <p className="mt-4 font-display text-xl font-semibold text-maroon-500">Coupon coming soon</p>
              <p className="mt-2 text-sm text-charcoal-light">
                The admin hasn't generated a Bhog coupon for this day yet. Please check back shortly.
              </p>
            </div>
          )}

          {unlocked && loaded && coupon && (
            <>
              <p className="text-sm text-charcoal-light mb-4">
                You have {quantity} coupon{quantity > 1 ? "s" : ""} today — one for you and one for each registered
                family member ({session.member.familyMembers}).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: quantity }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-maroon-500 text-cream p-5 shadow-card">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs font-semibold text-saffron-300">
                        <Sunrise className="h-4 w-4" /> Day {day.dayNumber}
                      </span>
                      <span className="text-[10px] font-semibold text-cream/70">
                        {i + 1} of {quantity}
                      </span>
                    </div>
                    <p className="mt-3 font-display text-lg font-semibold">{coupon.title}</p>
                    {coupon.description && <p className="mt-1 text-sm text-cream/80">{coupon.description}</p>}
                    <p className="mt-3 font-mono text-sm bg-cream/15 rounded-full inline-block px-3 py-1">
                      {coupon.code}-{i + 1}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </Container>
      </section>
    </>
  );
}
