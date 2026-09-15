"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

const noFooterRoutes = ["/", "/login", "/register"];

export default function ConditionalFooter() {
  const pathname = usePathname();
  if (noFooterRoutes.includes(pathname) || pathname?.startsWith("/admin")) return null;
  return <Footer />;
}
