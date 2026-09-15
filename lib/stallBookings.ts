import type { Stall, StallBooking, StallDuration, StallStatus } from "@/types";

const STORAGE_KEY = "bca_demo_stall_bookings";

export function readStallBookings(): StallBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StallBooking[]) : [];
  } catch {
    return [];
  }
}

function writeStallBookings(bookings: StallBooking[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function addStallBooking(booking: StallBooking) {
  writeStallBookings([...readStallBookings(), booking]);
}

export function updateStallBooking(id: string, patch: Partial<StallBooking>) {
  writeStallBookings(readStallBookings().map((b) => (b.id === id ? { ...b, ...patch } : b)));
}

// A stall's real-world status is the base inventory status, overridden by
// whichever active (non-rejected) booking currently holds it — this lets a
// rejected request automatically free the stall back up without any extra
// bookkeeping on the Stall record itself.
export function effectiveStallStatus(stall: Stall, bookings: StallBooking[]): StallStatus {
  const active = bookings.find((b) => b.stallId === stall.id && b.status !== "rejected");
  if (!active) return stall.status;
  return active.status === "paid" ? "sold-out" : "reserved";
}

export const stallDurationLabels: Record<StallDuration, string> = {
  first5: "First 5 Days (11–15 Oct)",
  last5: "Last 5 Days (16–20 Oct)",
  full10: "Full 10 Days (11–20 Oct)",
};

// Half-size stalls (per the rate card) only ever have one flat 10-day price;
// full-size stalls offer the first-5/last-5/full-10 tiers.
export function getStallDurationOptions(stall: Stall): { duration: StallDuration; label: string; price: number }[] {
  const { pricing, sizeType } = stall;
  if (sizeType === "half" || pricing.first5 === undefined || pricing.last5 === undefined) {
    return [{ duration: "full10", label: stallDurationLabels.full10, price: pricing.full10 }];
  }
  return [
    { duration: "first5", label: stallDurationLabels.first5, price: pricing.first5 },
    { duration: "last5", label: stallDurationLabels.last5, price: pricing.last5 },
    { duration: "full10", label: stallDurationLabels.full10, price: pricing.full10 },
  ];
}
