import type { Member, ProfileHistoryItem } from "@/types";

export const currentMember: Member = {
  id: "mem-001",
  memberId: "BCA-2026-1042",
  fullName: "Ananya Banerjee",
  email: "ananya.banerjee@example.com",
  mobile: "9830045612",
  address: "42 Lake Gardens Road",
  city: "Kolkata",
  membershipType: "core",
  familyMembers: 4,
  joinedOn: "2024-08-12",
  validUntil: "2027-08-11",
  role: "member",
  pujas: ["durga-puja", "kali-puja"],
};

export const members: Member[] = [
  currentMember,
  {
    id: "mem-002",
    memberId: "BCA-2026-1043",
    fullName: "Debashish Roy",
    email: "debashish.roy@example.com",
    mobile: "9831122334",
    address: "12 Rashbehari Avenue",
    city: "Kolkata",
    membershipType: "core",
    familyMembers: 5,
    joinedOn: "2023-09-02",
    validUntil: "2026-09-01",
    role: "member",
    pujas: ["durga-puja", "laxmi-puja", "saraswati-puja"],
  },
  {
    id: "mem-003",
    memberId: "BCA-2026-1044",
    fullName: "Priya Sen",
    email: "priya.sen@example.com",
    mobile: "9800112233",
    address: "7 Ballygunge Place",
    city: "Kolkata",
    membershipType: "general",
    familyMembers: 1,
    joinedOn: "2025-07-20",
    validUntil: "2026-07-19",
    role: "member",
    pujas: ["durga-puja"],
  },
  {
    id: "mem-004",
    memberId: "BCA-2025-0921",
    fullName: "Subrata Ghosh",
    email: "subrata.ghosh@example.com",
    mobile: "9876543210",
    address: "23 Gariahat Road",
    city: "Kolkata",
    membershipType: "general",
    familyMembers: 6,
    joinedOn: "2025-09-14",
    validUntil: "2026-09-13",
    role: "member",
    pujas: ["kali-puja", "saraswati-puja"],
  },
];

export const sponsorshipHistory: ProfileHistoryItem[] = [
  { id: "sp-1", label: "Individual Sponsorship — Durga Puja 2025", date: "2025-10-01", amount: 5000, status: "Confirmed" },
];

export const ticketHistory: ProfileHistoryItem[] = [
  { id: "tk-1", label: "Durga Puja 2025 — VIP Pass x2", date: "2025-10-18", amount: 1000, status: "Used" },
  { id: "tk-2", label: "Cultural Evening — Premium Seating", date: "2025-10-19", amount: 300, status: "Used" },
];

export const bookingHistory: ProfileHistoryItem[] = [
  { id: "bk-1", label: "Membership Renewal — Family Plan", date: "2025-08-12", amount: 2500, status: "Confirmed" },
];

export const couponHistory: ProfileHistoryItem[] = [
  { id: "cp-h-1", label: "BCASWEET — Mishti Mukh Sweets", date: "2025-10-22", status: "Redeemed" },
];
