"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import type { TicketTypeOption } from "@/types";

export default function TicketCard({
  ticket,
  selected,
  onSelect,
  index = 0,
}: {
  ticket: TicketTypeOption;
  selected: boolean;
  onSelect: () => void;
  index?: number;
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "text-left rounded-2xl p-6 border-2 transition-colors w-full focus-ring",
        selected ? "border-saffron-500 bg-saffron-50" : "border-maroon-500/10 bg-white/60 hover:border-saffron-500/40"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-display text-xl font-semibold text-maroon-500">{ticket.name}</h4>
          <p className="mt-1 text-sm text-charcoal-light">{ticket.description}</p>
        </div>
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full border-2 shrink-0",
            selected ? "border-saffron-500 bg-saffron-500" : "border-maroon-500/20"
          )}
        >
          {selected && <Check className="h-4 w-4 text-charcoal" />}
        </span>
      </div>
      <p className="mt-4 font-display text-2xl font-bold text-charcoal">{ticket.priceLabel ?? formatCurrency(ticket.price)}</p>
      <ul className="mt-3 space-y-1.5">
        {ticket.perks.map((p) => (
          <li key={p} className="text-xs text-charcoal-light flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-saffron-600" /> {p}
          </li>
        ))}
      </ul>
    </motion.button>
  );
}
