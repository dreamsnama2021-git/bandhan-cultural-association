import { readAllCredentials } from "@/lib/credentials";
import { membershipTypeLabels } from "@/data/membership";
import { formatDate } from "@/lib/utils";
import type { FamilyMemberDetails, Member } from "@/types";

export function getFamilyMembersFor(email: string): FamilyMemberDetails[] {
  const cred = readAllCredentials().find((c) => c.email.toLowerCase() === email.toLowerCase());
  return cred?.familyMembers ?? [];
}

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function downloadMembersCsv(members: Member[], filename: string) {
  const header = [
    "Name",
    "Member ID",
    "Plan",
    "Role",
    "Email",
    "Mobile",
    "City",
    "Valid Until",
    "Family Members",
  ];

  const rows = members.map((m) => {
    const family = getFamilyMembersFor(m.email);
    const familySummary = family.map((f) => `${f.name} (${f.age})`).join("; ");
    return [
      m.fullName,
      m.memberId,
      membershipTypeLabels[m.membershipType] ?? m.membershipType,
      m.role === "leader" ? "Leader" : "Member",
      m.email,
      m.mobile,
      m.city || "—",
      m.validUntil === "Lifetime" ? "Lifetime" : formatDate(m.validUntil),
      familySummary || "—",
    ];
  });

  const csvContent = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  const blob = new Blob(["﻿" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
