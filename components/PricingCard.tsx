"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import Button from "@/components/Button";

export default function PricingCard({
  name,
  price,
  billingLabel,
  benefits,
  highlight = false,
  ctaLabel = "Select",
  onSelect,
  href,
  selected = false,
  index = 0,
}: {
  name: string;
  price: number;
  billingLabel?: string;
  benefits: string[];
  highlight?: boolean;
  ctaLabel?: string;
  onSelect?: () => void;
  href?: string;
  selected?: boolean;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={cn(
        "relative flex flex-col rounded-2xl p-7 border-2 transition-all h-full",
        selected
          ? "border-saffron-500 bg-white shadow-card-hover"
          : highlight
          ? "border-maroon-500 bg-maroon-500 text-cream shadow-card-hover"
          : "border-maroon-500/10 bg-white/60 shadow-card hover:border-saffron-500/40"
      )}
    >
      {highlight && !selected && (
        <span className="absolute -top-3 left-7 rounded-full bg-saffron-500 text-charcoal text-xs font-bold px-3 py-1 tracking-wide">
          MOST POPULAR
        </span>
      )}
      <h3 className={cn("font-display text-2xl font-semibold", highlight && !selected ? "text-cream" : "text-maroon-500")}>
        {name}
      </h3>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className={cn("font-display text-4xl font-bold", highlight && !selected ? "text-cream" : "text-charcoal")}>
          {formatCurrency(price)}
        </span>
        {billingLabel && (
          <span className={cn("text-sm", highlight && !selected ? "text-cream/70" : "text-charcoal-light")}>
            /{billingLabel}
          </span>
        )}
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {benefits.map((b) => (
          <li key={b} className="flex items-start gap-2.5 text-sm">
            <Check
              className={cn(
                "h-4 w-4 mt-0.5 shrink-0",
                highlight && !selected ? "text-saffron-300" : "text-saffron-600"
              )}
            />
            <span className={highlight && !selected ? "text-cream/90" : "text-charcoal-light"}>
              {b}
            </span>
          </li>
        ))}
      </ul>

      {href ? (
        <Button
          href={href}
          variant={selected ? "secondary" : highlight ? "secondary" : "outline"}
          className="mt-7 w-full"
        >
          {ctaLabel}
        </Button>
      ) : (
        <Button
          onClick={onSelect}
          variant={selected ? "secondary" : highlight ? "secondary" : "outline"}
          className="mt-7 w-full"
        >
          {selected ? "Selected" : ctaLabel}
        </Button>
      )}
    </motion.div>
  );
}
