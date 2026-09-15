"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Tag } from "lucide-react";
import type { Coupon } from "@/types";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/Toast";
import Button from "@/components/Button";

export default function CouponCard({ coupon, index = 0 }: { coupon: Coupon; index?: number }) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
    } catch {
      // clipboard may be unavailable; still reflect intent to the user
    }
    setCopied(true);
    showToast(`Coupon code ${coupon.code} copied`, "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.06 }}
      className="relative flex flex-col rounded-2xl bg-white/70 border border-dashed border-saffron-500/60 p-6 shadow-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-saffron-700">{coupon.category}</span>
          <h3 className="mt-1 font-display text-lg font-semibold text-maroon-500">{coupon.businessName}</h3>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-maroon-500/10 text-maroon-500 shrink-0">
          <Tag className="h-5 w-5" />
        </span>
      </div>

      <p className="mt-3 font-semibold text-charcoal">{coupon.discount}</p>
      <p className="mt-2 text-xs text-charcoal-light leading-relaxed">{coupon.terms}</p>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-beige-light px-4 py-2.5 border border-beige-dark">
        <span className="font-mono font-bold tracking-wider text-charcoal">{coupon.code}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-semibold text-maroon-600 hover:text-maroon-700 focus-ring rounded px-1"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-charcoal-light">Valid till {formatDate(coupon.endDate)}</span>
        <Button size="sm" variant="ghost" onClick={handleCopy}>
          Redeem
        </Button>
      </div>
    </motion.div>
  );
}
