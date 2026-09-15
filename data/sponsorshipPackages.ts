// ---------------------------------------------------------------------------
// CENTRAL SPONSORSHIP PRICING CONFIGURATION
// ---------------------------------------------------------------------------
// Core Spaces sponsorship rates for Durga Utsav 2026 (10 days inclusive), as
// per "CORE SPACES SPONSORSHIP RATES_BCA DURGA UTSAV 2026". Discounts are not
// stored per-package — they're applied dynamically based on who is signed in
// (see lib/discounts.ts): Admin & Managing Community get 20% off, Core
// members 15%, General members 10%.
// ---------------------------------------------------------------------------

import type { AdOption, SponsorshipPackageTier } from "@/types";

export const sponsorshipPackages: Record<string, SponsorshipPackageTier> = {
  "entrance-gate-pillars": {
    id: "entrance-gate-pillars",
    name: "Entrance Gate Pillars",
    price: 51000,
    discountPercent: 0,
    description: "Main road approach point branding — no overhead joinder, per gate pillar.",
    perks: [
      "6 pillars available across main road approach points",
      "Size: 20 ft height × 4 ft breadth × 4 ft depth",
      "Priced per gate pillar",
    ],
  },
  "club-entrance-gate": {
    id: "club-entrance-gate",
    name: "Club Entrance Gate",
    price: 150000,
    discountPercent: 0,
    description: "Main entry, co-branded gate — the single most visible entrance branding available.",
    perks: [
      "Only 1 available — main entry co-branded gate",
      "Header: 25 ft breadth × 4 ft height × 4 ft depth",
      "2 pillars: 22 ft height × 4 ft breadth × 4 ft depth",
    ],
    recommended: true,
  },
  "tower-lights-4-side": {
    id: "tower-lights-4-side",
    name: "Tower Lights — All 4 Sides",
    price: 100000,
    discountPercent: 0,
    description: "Banner branding on all four sides of a tower light, per tower.",
    perks: [
      "2 towers available",
      "Banner on all four sides",
      "Priced per tower",
    ],
  },
  "tower-lights-single-8ft": {
    id: "tower-lights-single-8ft",
    name: "Tower Lights — Single Side (16×8 ft)",
    price: 45000,
    discountPercent: 0,
    description: "Single-side tower light banner, larger format.",
    perks: [
      "4 sides available across 2 towers",
      "Size: 16 ft × 8 ft",
      "Priced per side",
    ],
  },
  "tower-lights-single-4ft": {
    id: "tower-lights-single-4ft",
    name: "Tower Lights — Single Side (16×4 ft)",
    price: 30000,
    discountPercent: 0,
    description: "Single-side tower light banner, compact format.",
    perks: [
      "4 sides available across 2 towers",
      "Size: 16 ft × 4 ft",
      "Priced per side",
    ],
  },
  "full-pandal": {
    id: "full-pandal",
    name: "Full Pandal",
    price: 1500000,
    discountPercent: 0,
    description: "Complete pandal sponsorship — our highest tier of visibility for Durga Utsav 2026.",
    perks: [
      "Exclusive branding across the entire pandal",
      "Covers the full 10-day celebration",
      "Only 1 available — first come, first served",
    ],
  },
};

export const businessSponsorConfig = {
  discountPercent: 90,
  basePrice: 7000,
};

export const adOptions: AdOption[] = [
  {
    id: "brand-ads",
    category: "brand-ads",
    title: "Brand Advertisement",
    description: "Keep your brand visible throughout the celebration with premium print and digital placements.",
    placement: "Festival booklet, banners & digital screens",
    duration: "Full event duration (4 days)",
    estimatedReach: "8,000+ visitors",
    price: 5000,
    discountPercent: 10,
    icon: "Megaphone",
  },
  {
    id: "led-screen",
    category: "led-screen",
    title: "LED Screen Ads",
    description: "Loop your creative on our high-visibility LED screens at the main pandal throughout the event.",
    placement: "Main stage LED screen",
    duration: "15 sec loop, 30 plays/day",
    estimatedReach: "10,000+ impressions/day",
    price: 8000,
    discountPercent: 15,
    icon: "MonitorPlay",
  },
  {
    id: "gate-ads",
    category: "gate-ads",
    title: "Gate Advertisement",
    description: "Be the first brand every visitor sees — premium entrance branding at the festival gate.",
    placement: "Main Gate / Entry Banner / Side Banner",
    duration: "Full event duration (4 days)",
    estimatedReach: "12,000+ footfall",
    price: 12000,
    discountPercent: 10,
    icon: "DoorOpen",
  },
  {
    id: "coupons",
    category: "coupons",
    title: "Coupon Campaign",
    description: "Distribute promotional coupons to our members and festival visitors to drive footfall to your business.",
    placement: "Coupons page + printed handouts",
    duration: "Valid for the campaign period you set",
    estimatedReach: "3,000+ members",
    price: 2500,
    discountPercent: 0,
    icon: "Ticket",
  },
  {
    id: "video",
    category: "video",
    title: "Video Sponsorship",
    description: "Play your promotional video before cultural programs and on our video wall.",
    placement: "Main stage video wall",
    duration: "30–60 sec, 3 plays/session",
    estimatedReach: "6,000+ attendees",
    price: 10000,
    discountPercent: 15,
    icon: "Video",
  },
  {
    id: "stall",
    category: "stall",
    title: "Stall Space",
    description: "Set up a stall and connect directly with visitors during the celebration.",
    placement: "Festival grounds — multiple zones",
    duration: "Full event duration (4 days)",
    estimatedReach: "Direct footfall interaction",
    price: 6000,
    discountPercent: 0,
    icon: "Store",
  },
];

export const gateAdOptions = [
  { id: "main-gate", name: "Main Gate", description: "The primary entrance banner seen by every visitor.", price: 15000, available: true },
  { id: "entry-banner", name: "Entry Banner", description: "Banner along the entry walkway leading to the pandal.", price: 9000, available: true },
  { id: "side-banner", name: "Side Banner", description: "Secondary entrance banner for overflow footfall.", price: 6000, available: true },
  { id: "welcome-board", name: "Welcome Board", description: "Standee-style welcome board at the gate.", price: 4000, available: false },
];

export const videoSponsorshipOptions = [
  { id: "pre-show", placement: "Pre-show reel (before cultural programs)", duration: "30 sec", event: "Durga Puja — Evening Program", estimatedAudience: "5,000+", price: 8000 },
  { id: "video-wall", placement: "Main stage video wall loop", duration: "60 sec", event: "All 4 days", estimatedAudience: "10,000+", price: 14000 },
  { id: "intermission", placement: "Intermission slot", duration: "45 sec", event: "Cultural Evening — Saraswati Puja", estimatedAudience: "3,500+", price: 6000 },
];

export function getSponsorshipTotal(basePrice: number, discountPercent = 0) {
  const discount = (basePrice * discountPercent) / 100;
  return {
    basePrice,
    discount,
    total: basePrice - discount,
  };
}
