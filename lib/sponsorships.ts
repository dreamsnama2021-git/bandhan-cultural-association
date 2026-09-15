import type { Sponsor } from "@/types";

const STORAGE_KEY = "bca_demo_sponsorships";

export function readSponsorshipPurchases(): Sponsor[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Sponsor[]) : [];
  } catch {
    return [];
  }
}

export function addSponsorshipPurchase(sponsor: Sponsor) {
  if (typeof window === "undefined") return;
  const all = readSponsorshipPurchases();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...all, sponsor]));
}

export function deleteSponsorshipPurchase(id: string) {
  if (typeof window === "undefined") return;
  const all = readSponsorshipPurchases();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all.filter((s) => s.id !== id)));
}
