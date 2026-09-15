"use client";

import { motion } from "framer-motion";
import { Store } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import type { Stall } from "@/types";

const statusStyles: Record<Stall["status"], string> = {
  available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  reserved: "bg-saffron-50 text-saffron-700 border-saffron-300",
  "sold-out": "bg-charcoal/5 text-charcoal-light border-charcoal/10",
};

const statusLabel: Record<Stall["status"], string> = {
  available: "Available",
  reserved: "Reserved",
  "sold-out": "Sold Out",
};

export default function StallCard({
  stall,
  onClick,
  index = 0,
}: {
  stall: Stall;
  onClick: () => void;
  index?: number;
}) {
  const disabled = stall.status !== "available";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: (index % 10) * 0.03 }}
      whileHover={!disabled ? { y: -3 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 p-4 aspect-square transition-colors focus-ring",
        stall.status === "available" && "border-maroon-500/15 bg-white hover:border-saffron-500 cursor-pointer",
        stall.status === "reserved" && "border-saffron-300 bg-saffron-50 cursor-not-allowed",
        stall.status === "sold-out" && "border-charcoal/10 bg-charcoal/5 cursor-not-allowed opacity-70"
      )}
      disabled={disabled}
      aria-label={`Stall ${stall.code}, ${statusLabel[stall.status]}`}
    >
      <Store className={cn("h-5 w-5", disabled ? "text-charcoal-light" : "text-maroon-500")} />
      <span className="font-display font-bold text-lg text-charcoal">{stall.code}</span>
      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", statusStyles[stall.status])}>
        {statusLabel[stall.status]}
      </span>
      {stall.status === "available" && (
        <span className="text-xs font-semibold text-charcoal-light">
          {stall.sizeType === "half" ? formatCurrency(stall.pricing.full10) : `From ${formatCurrency(stall.pricing.first5 ?? stall.pricing.full10)}`}
        </span>
      )}
    </motion.button>
  );
}
