// Demo-only Bhog coupon store (localStorage). Admin creates/edits a Bhog
// coupon for each of the 9 Navratri days; members can view a day's coupon
// once that day has arrived. There is no real backend here.

import { bhogCoupons as seedBhogCoupons } from "@/data/bhogCoupons";
import type { BhogCoupon } from "@/types";

const STORAGE_KEY = "bca_bhog_coupons";

export function getBhogCoupons(): BhogCoupon[] {
  if (typeof window === "undefined") return seedBhogCoupons;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedBhogCoupons;
    return JSON.parse(raw) as BhogCoupon[];
  } catch {
    return seedBhogCoupons;
  }
}

function writeAll(list: BhogCoupon[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getBhogCouponForDay(dayNumber: number): BhogCoupon | null {
  return getBhogCoupons().find((c) => c.dayNumber === dayNumber) ?? null;
}

export function saveBhogCoupon(dayNumber: number, fields: { title: string; description: string; code: string }) {
  const all = getBhogCoupons();
  const existingIndex = all.findIndex((c) => c.dayNumber === dayNumber);
  if (existingIndex >= 0) {
    all[existingIndex] = { ...all[existingIndex], ...fields };
  } else {
    all.push({
      id: `bhog-${dayNumber}-${Date.now()}`,
      dayNumber,
      createdOn: new Date().toISOString(),
      ...fields,
    });
  }
  writeAll(all);
}

export function deleteBhogCoupon(dayNumber: number) {
  writeAll(getBhogCoupons().filter((c) => c.dayNumber !== dayNumber));
}

export function isNavratriDayUnlocked(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = new Date(dateStr);
  day.setHours(0, 0, 0, 0);
  return today.getTime() >= day.getTime();
}
