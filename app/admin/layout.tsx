"use client";

import { useAdminAccess } from "@/lib/useAdminAccess";
import { AdminAccessProvider } from "@/components/admin/AdminAccessContext";
import { AdminMembersProvider } from "@/components/AdminMembersContext";
import { AdminDataProvider } from "@/components/AdminDataContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const access = useAdminAccess();

  if (!access) {
    return (
      <section className="flex min-h-[100dvh] items-center justify-center">
        <p className="text-sm text-charcoal-light">Checking admin access…</p>
      </section>
    );
  }

  return (
    <AdminAccessProvider value={access}>
      <AdminMembersProvider>
        <AdminDataProvider>
          <div className="flex min-h-[100dvh] bg-beige-light">
            <AdminSidebar />
            <div className="flex-1 min-w-0 flex flex-col">
              <AdminHeader />
              <main className="flex-1">{children}</main>
            </div>
          </div>
        </AdminDataProvider>
      </AdminMembersProvider>
    </AdminAccessProvider>
  );
}
