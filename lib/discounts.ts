import { isAdminSession, getCurrentSessionMember } from "@/lib/credentials";

// Single source of truth for the role/plan-based sponsorship discount tiers —
// used both to compute a viewer's actual discount and to display the tiers
// as a reference table (e.g. on the Admin Sponsors page).
export const sponsorshipDiscountTiers = [
  { label: "Admin & Managing Community (Sub-admin)", percent: 20 },
  { label: "Core Member", percent: 15 },
  { label: "General Member", percent: 10 },
  { label: "Guest / Not logged in", percent: 0 },
];

// Role/plan-based discount applied to Business Sponsorship packages.
// Admin & Managing Community (Sub-admin / Leader) get 20% off, Core members
// 15%, General members 10%. Guests and unrecognized sessions get no discount.
// Must only be called on the client (reads localStorage via credentials.ts).
export function getSponsorshipDiscountPercent(): number {
  if (typeof window === "undefined") return 0;
  if (isAdminSession()) return 20;

  const session = getCurrentSessionMember();
  if (!session) return 0;
  if (session.member.role === "leader") return 20;
  if (session.member.membershipType === "core") return 15;
  if (session.member.membershipType === "general") return 10;
  return 0;
}

// Which discount tier a purchase falls under, recorded on the sponsorship
// record itself so the admin table can show "who" bought at what category
// even after the buyer's own session/role changes later.
export function getSponsorshipCategory(): string {
  if (typeof window === "undefined") return "Guest";
  if (isAdminSession()) return "Admin";

  const session = getCurrentSessionMember();
  if (!session) return "Guest";
  if (session.member.role === "leader") return "Managing Community";
  if (session.member.membershipType === "core") return "Core Member";
  if (session.member.membershipType === "general") return "General Member";
  return "Guest";
}
