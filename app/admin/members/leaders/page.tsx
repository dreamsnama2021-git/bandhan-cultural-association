"use client";

import AdminMemberDetailList from "@/components/AdminMemberDetailList";
import { useAdminMembers } from "@/components/AdminMembersContext";

export default function AdminLeadersPage() {
  const { members } = useAdminMembers();
  const leaders = members.filter((m) => m.role === "leader");

  return (
    <AdminMemberDetailList
      title="Managing Community"
      description="Members added directly by the admin — no self-registration or payment involved. Only Core-plan members added here count as Leaders, and can add members of their own from their Managing Community dashboard."
      members={leaders}
      defaultType="core"
      lockType
    />
  );
}
