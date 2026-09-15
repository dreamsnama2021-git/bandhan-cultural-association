import type { Sponsor } from "@/types";

export const sponsors: Sponsor[] = [
  { id: "sn-1", type: "business", name: "Kolkata Biryani House", contactEmail: "owner@kolkatabiryani.com", contactPhone: "9831234567", amount: 30000, status: "confirmed", createdOn: "2026-08-20" },
  { id: "sn-2", type: "business", name: "TechZone Electronics", contactEmail: "sales@techzone.com", contactPhone: "9832345678", amount: 15000, status: "confirmed", createdOn: "2026-08-25" },
  { id: "sn-3", type: "individual", name: "Ritwik Chatterjee", contactEmail: "ritwik.c@example.com", contactPhone: "9833456789", amount: 2500, status: "confirmed", createdOn: "2026-09-01" },
  { id: "sn-4", type: "business", name: "Sharma Silk Emporium", contactEmail: "info@sharmasilk.com", contactPhone: "9834567890", amount: 7000, status: "pending", createdOn: "2026-09-05" },
  { id: "sn-5", type: "individual", name: "Mousumi Dutta", contactEmail: "mousumi.d@example.com", contactPhone: "9835678901", amount: 1000, status: "confirmed", createdOn: "2026-09-06" },
];
