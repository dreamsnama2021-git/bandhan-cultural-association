"use client";

import Link from "next/link";
import { Lock, Sunrise, ChevronRight } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import { cn, formatDate } from "@/lib/utils";
import { navratriDays } from "@/data/navratriDays";
import { isNavratriDayUnlocked } from "@/lib/bhogCoupons";
import { useMemberGuard } from "@/lib/useMemberGuard";

export default function BhogPage() {
  const session = useMemberGuard();

  if (!session) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-charcoal-light">Checking your session…</p>
      </section>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Bhog"
        title="Navratri Bhog Coupons"
        description="Pick a day below — once it arrives, you'll find that day's Bhog coupon here, one for every registered family member."
      />

      <section className="section-py">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {navratriDays.map((day) => {
              const unlocked = isNavratriDayUnlocked(day.date);
              const content = (
                <>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs font-semibold text-saffron-700">
                      <Sunrise className="h-4 w-4" /> Day {day.dayNumber}
                    </span>
                    {unlocked ? (
                      <ChevronRight className="h-4 w-4 text-maroon-500" />
                    ) : (
                      <Lock className="h-4 w-4 text-charcoal-light" />
                    )}
                  </div>
                  <p className="mt-3 font-display text-xl font-semibold text-maroon-500">{day.tithi}</p>
                  <p className="mt-1 text-sm text-charcoal-light">{formatDate(day.date)}</p>
                  <p className="mt-3 text-xs text-charcoal-light">
                    {unlocked ? "Tap to view today's Bhog coupon." : "Unlocks on the morning of this day."}
                  </p>
                </>
              );

              return unlocked ? (
                <Link
                  key={day.dayNumber}
                  href={`/bhog/${day.dayNumber}`}
                  className="rounded-2xl bg-white/70 border border-maroon-500/10 p-5 hover:border-saffron-500/50 hover:shadow-card-hover transition-all focus-ring"
                >
                  {content}
                </Link>
              ) : (
                <div
                  key={day.dayNumber}
                  className={cn("rounded-2xl bg-white/40 border border-maroon-500/10 p-5 opacity-60")}
                >
                  {content}
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
