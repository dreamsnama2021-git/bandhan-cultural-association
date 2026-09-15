"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AdminMemberDetailList from "@/components/AdminMemberDetailList";
import AdminPujaTypeGrid from "@/components/AdminPujaTypeGrid";
import AdminPujaTypeDashboard, { type TabId } from "@/components/AdminPujaTypeDashboard";
import { useAdminMembers } from "@/components/AdminMembersContext";
import { pujaCategories } from "@/data/pujaCategories";

function AdminCoreMembersContent() {
  const { members } = useAdminMembers();
  const searchParams = useSearchParams();
  const pujaId = searchParams.get("puja");
  const section = searchParams.get("section") as TabId | null;
  const activePuja = pujaCategories.find((c) => c.id === pujaId);

  if (activePuja && section) {
    return <AdminPujaTypeDashboard puja={activePuja} type="core" initialTab={section} />;
  }

  if (activePuja) {
    return <AdminPujaTypeGrid puja={activePuja} type="core" />;
  }

  const coreMembers = members.filter((m) => m.membershipType === "core" && m.role !== "leader");

  return (
    <AdminMemberDetailList
      title="Core Members"
      description="Members on the Core membership plan. Admin-added Leaders are shown separately."
      members={coreMembers}
      defaultType="core"
      lockType
    />
  );
}

export default function AdminCoreMembersPage() {
  return (
    <Suspense fallback={null}>
      <AdminCoreMembersContent />
    </Suspense>
  );
}
