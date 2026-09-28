import type { Metadata } from "next";
import { Cormorant_Garamond, Mulish } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ConditionalFooter from "@/components/ConditionalFooter";
import { ToastProvider } from "@/components/Toast";
import SupabaseSessionSync from "@/components/SupabaseSessionSync";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Mulish({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bandhan Cultural Association",
  description:
    "Bandhan Cultural Association — membership, sponsorship, events and tickets for our community's festivals and celebrations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} bg-cream text-charcoal antialiased font-body overflow-hidden`}
      >
        <ToastProvider>
          <SupabaseSessionSync />
          <div className="flex h-[100dvh] flex-col overflow-hidden bg-cream">
            <Navbar />
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <main>{children}</main>
              <ConditionalFooter />
            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
