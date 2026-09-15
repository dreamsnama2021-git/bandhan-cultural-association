// Core domain types for the Bandhan Cultural Association platform.

export type PujaCategory =
  | "durga-puja"
  | "laxmi-puja"
  | "kali-puja"
  | "saraswati-puja";

export interface PujaCategoryInfo {
  id: PujaCategory;
  name: string;
  tagline: string;
  description: string;
  icon: string;
}

export type MembershipType = "individual" | "family" | "patron" | "lifetime" | "core" | "general";

export interface FamilyMemberDetails {
  id: string;
  name: string;
  contact: string;
  age: string;
  aadharFile: string | null;
  panNumber: string;
}

export type MemberRole = "member" | "leader";

export interface Member {
  id: string;
  memberId: string;
  fullName: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  membershipType: MembershipType;
  familyMembers: number;
  joinedOn: string;
  validUntil: string;
  photoUrl?: string;
  // "leader": added directly by an admin with instant login credentials,
  // no self-registration/Aadhar/PAN/payment required.
  // "member": came through the public self-registration flow.
  role: MemberRole;
  // Puja categories this member registered for (self-registration only —
  // admin-added leaders have no puja association).
  pujas?: PujaCategory[];
}

export type SponsorType = "business" | "individual";

export interface BusinessSponsorDetails {
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  category: string;
  website?: string;
  socialMedia?: string;
  packageId: string;
  addOns: string[];
  message?: string;
}

export interface IndividualSponsorDetails {
  fullName: string;
  phone: string;
  email: string;
  amount: number;
  message?: string;
}

export interface Sponsor {
  id: string;
  type: SponsorType;
  name: string;
  contactEmail: string;
  contactPhone: string;
  packageId?: string;
  mrp?: number;
  discountPercent?: number;
  amount: number;
  status: "pending" | "confirmed";
  createdOn: string;
  memberEmail?: string;
  membershipType?: MembershipType;
  pujas?: PujaCategory[];
  category?: string;
}

export interface SponsorshipPackageTier {
  id: string;
  name: string;
  price: number;
  discountPercent: number;
  description: string;
  perks: string[];
  recommended?: boolean;
}

export interface AdOption {
  id: string;
  category: "brand-ads" | "led-screen" | "gate-ads" | "coupons" | "video" | "stall";
  title: string;
  description: string;
  placement: string;
  duration: string;
  estimatedReach: string;
  price: number;
  discountPercent?: number;
  icon: string;
}

export type StallStatus = "available" | "reserved" | "sold-out";
export type StallCategory = "Food" | "Product";
export type StallSizeType = "full" | "half";
export type StallDuration = "first5" | "last5" | "full10";

export interface StallPricing {
  first5?: number;
  last5?: number;
  full10: number;
}

export interface Stall {
  id: string;
  code: string;
  size: string;
  sizeType: StallSizeType;
  location: string;
  category: StallCategory;
  status: StallStatus;
  pricing: StallPricing;
}

export type StallBookingStatus = "pending" | "approved" | "rejected" | "paid";

export interface StallBooking {
  id: string;
  stallId: string;
  businessName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  duration: StallDuration;
  amount: number;
  status: StallBookingStatus;
  requestedOn: string;
  respondedOn?: string;
  paidOn?: string;
  memberEmail?: string;
}

export interface EventItem {
  id: string;
  slug: string;
  name: string;
  category: PujaCategory | "cultural-program" | "community";
  date: string;
  endDate?: string;
  time: string;
  venue: string;
  description: string;
  image: string;
  ticketPriceFrom: number;
  seatsAvailable: number;
  featured?: boolean;
}

export interface TicketTypeOption {
  id: string;
  name: string;
  price: number;
  description: string;
  perks: string[];
}

export interface TicketOrder {
  id: string;
  eventId: string;
  ticketTypeId: string;
  quantity: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  totalAmount: number;
  orderId: string;
  createdOn: string;
}

export interface Coupon {
  id: string;
  businessName: string;
  code: string;
  discount: string;
  startDate: string;
  endDate: string;
  terms: string;
  category: string;
  redemptions?: number;
}

export interface NavratriDay {
  dayNumber: number;
  date: string;
  tithi: string;
}

export interface BhogCoupon {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  code: string;
  createdOn: string;
}

export interface VideoSponsorshipOption {
  id: string;
  placement: string;
  duration: string;
  event: string;
  estimatedAudience: string;
  price: number;
}

export interface GateAdOption {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
}

export type PaymentMethod = "upi" | "card" | "netbanking";

export interface PaymentSummaryData {
  itemLabel: string;
  itemDescription?: string;
  price: number;
  discountPercent?: number;
  taxPercent?: number;
}

export interface PaymentResult {
  orderId: string;
  transactionId: string;
  date: string;
  amount: number;
  status: "success";
  method: PaymentMethod;
}

export interface Booking {
  id: string;
  type: "membership" | "sponsorship" | "stall" | "ticket" | "video" | "brand-ad" | "led-screen" | "gate-ad";
  referenceId: string;
  amount: number;
  createdOn: string;
  status: "confirmed" | "pending";
}

export interface ProfileHistoryItem {
  id: string;
  label: string;
  date: string;
  amount?: number;
  status: string;
}
