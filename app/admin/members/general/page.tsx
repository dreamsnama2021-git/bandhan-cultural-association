"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AdminMemberDetailList from "@/components/AdminMemberDetailList";
import AdminPujaTypeGrid from "@/components/AdminPujaTypeGrid";
import AdminPujaTypeDashboard, { type TabId } from "@/components/AdminPujaTypeDashboard";
import { useAdminMembers } from "@/components/AdminMembersContext";
import { pujaCategories } from "@/data/pujaCategories";

function AdminGeneralMembersContent() {
  const { members } = useAdminMembers();
  const searchParams = useSearchParams();
  const pujaId = searchParams.get("puja");
  const section = searchParams.get("section") as TabId | null;
  const activePuja = pujaCategories.find((c) => c.id === pujaId);

  if (activePuja && section) {
    return <AdminPujaTypeDashboard puja={activePuja} type="general" initialTab={section} />;
  }

  if (activePuja) {
    return <AdminPujaTypeGrid puja={activePuja} type="general" />;
  }

  const generalMembers = members.filter((m) => m.membershipType === "general");

  return (
    <AdminMemberDetailList
      title="General Members"
      description="Members on the General membership plan."
      members={generalMembers}
      defaultType="general"
      lockType
    />
  );
}

export default function AdminGeneralMembersPage() {
  return (
    <Suspense fallback={null}>
      <AdminGeneralMembersContent />
    </Suspense>
  );
}
