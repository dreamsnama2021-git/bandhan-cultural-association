// ---------------------------------------------------------------------------
// CENTRAL APPLICATION CONFIGURATION
// ---------------------------------------------------------------------------
// Single source of truth for every editable price and discount in the app.
// Values sourced from an unclear hand-drawn wireframe are marked as
// placeholders — update them here and every screen updates automatically.
// ---------------------------------------------------------------------------

import { sponsorshipPackages, adOptions } from "@/data/sponsorshipPackages";

export const siteConfig = {
  name: "Bandhan Cultural Association",
  shortName: "BCA",
  tagline: "Celebrating culture, tradition and community — together.",
  supportEmail: "contact@bandhanculturalassociation.org",
  supportPhone: "+91 98300 12345",
  address: "Bandhan Community Grounds, Kolkata, West Bengal",
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    whatsapp: "https://wa.me/919830012345",
  },
};

// Fixed admin login — checked on the Member Login screen. Change these to
// rotate the admin credentials; this is a demo-only fixed account (no backend).
export const adminConfig = {
  email: "admin@bandhanculturalassociation.org",
  password: "Admin@123",
};

export const membershipConfig = {
  currency: "INR",
  plans: {
    individual: { price: 1100 },
    family: { price: 2500 },
    patron: { price: 5100 },
    lifetime: { price: 21000 },
    // Registration form (Login → Registration) membership types, per wireframe.
    // familyLimit = free family members that can be added during registration.
    core: { price: 10000, familyLimit: 4 },
    general: { price: 5000, familyLimit: 3 },
  },
  // Flat fee charged for each family member added after registration (via Profile).
  additionalFamilyMemberFee: 500,
};

export const stallConfig = {
  pricePerSqftPerDay: 250,
  baseAvailability: {
    available: 14,
    reserved: 5,
    soldOut: 3,
  },
};

export const ticketConfig = {
  gstPercent: 0,
  convenienceFee: 20,
};

export const paymentConfig = {
  taxPercent: 0,
  methods: ["upi", "card", "netbanking"] as const,
};

export const couponConfig = {
  listingFee: 0,
};

// Re-exported so this file can act as the single import for all pricing.
export { sponsorshipPackages, adOptions };
