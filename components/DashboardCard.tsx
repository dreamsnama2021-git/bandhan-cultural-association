"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardCard({
  href,
  icon,
  title,
  description,
  cta,
  featured = false,
  className,
  index = 0,
}: {
  href: string;
  icon: keyof typeof Icons;
  title: string;
  description: string;
  cta: string;
  featured?: boolean;
  className?: string;
  index?: number;
}) {
  const Icon = (Icons[icon] as LucideIcon) || Icons.Sparkles;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.07, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className={cn("h-full", className)}
    >
      <Link
        href={href}
        className={cn(
          "group flex h-full flex-col justify-between rounded-2xl p-6 sm:p-7 border transition-colors focus-ring",
          featured
            ? "bg-maroon-500 border-maroon-500 text-cream shadow-card-hover"
            : "bg-white/60 border-maroon-500/10 hover:border-saffron-500/50 shadow-card"
        )}
      >
        <div>
          <span
            className={cn(
              "inline-flex h-12 w-12 items-center justify-center rounded-full",
              featured ? "bg-cream/15 text-saffron-300" : "bg-saffron-100 text-maroon-500"
            )}
          >
            <Icon className="h-6 w-6" />
          </span>
          <h3 className="mt-5 font-display text-xl sm:text-2xl font-semibold">
            {title}
          </h3>
          <p
            className={cn(
              "mt-2 text-sm leading-relaxed",
              featured ? "text-cream/80" : "text-charcoal-light"
            )}
          >
            {description}
          </p>
        </div>
        <div
          className={cn(
            "mt-6 inline-flex items-center gap-1.5 text-sm font-semibold",
            featured ? "text-saffron-300" : "text-maroon-600"
          )}
        >
          {cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  );
}
