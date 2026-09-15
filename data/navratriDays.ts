import type { NavratriDay } from "@/types";

// The 9 days of Navratri leading up to Vijaya Dashami (2026-10-20), which is
// when our Durga Puja celebrations (2026-10-17 to 2026-10-20) fall — the last
// four days of Navratri (Shashthi through Dashami).
export const navratriDays: NavratriDay[] = [
  { dayNumber: 1, date: "2026-10-12", tithi: "Pratipada" },
  { dayNumber: 2, date: "2026-10-13", tithi: "Dwitiya" },
  { dayNumber: 3, date: "2026-10-14", tithi: "Tritiya" },
  { dayNumber: 4, date: "2026-10-15", tithi: "Chaturthi" },
  { dayNumber: 5, date: "2026-10-16", tithi: "Panchami" },
  { dayNumber: 6, date: "2026-10-17", tithi: "Shashthi" },
  { dayNumber: 7, date: "2026-10-18", tithi: "Saptami" },
  { dayNumber: 8, date: "2026-10-19", tithi: "Ashtami" },
  { dayNumber: 9, date: "2026-10-20", tithi: "Navami / Vijaya Dashami" },
];
