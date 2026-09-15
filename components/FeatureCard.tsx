"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FeatureCard({
  href,
  icon,
  title,
  description,
  cta,
  tone = "maroon",
  size = "large",
  index = 0,
}: {
  href: string;
  icon: keyof typeof Icons;
  title: string;
  description: string;
  cta: string;
  tone?: "maroon" | "saffron";
  size?: "large" | "medium";
  index?: number;
}) {
  const isMaroon = tone === "maroon";
  const Icon = (Icons[icon] as LucideIcon) || Icons.Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: "easeOut" }}
    >
      <Link
        href={href}
        className={cn(
          "group relative block overflow-hidden rounded-2xl p-8 sm:p-10 h-full transition-shadow focus-ring",
          isMaroon
            ? "bg-maroon-500 text-cream shadow-card hover:shadow-card-hover"
            : "bg-beige-light border border-saffron-500/30 text-charcoal shadow-card hover:shadow-card-hover",
          size === "large" ? "min-h-[280px] sm:min-h-[320px]" : "min-h-[220px]"
        )}
      >
        <div
          className={cn(
            "absolute -top-10 -right-10 h-40 w-40 rounded-full blur-2xl transition-opacity group-hover:opacity-70",
            isMaroon ? "bg-saffron-400/25" : "bg-maroon-500/10"
          )}
          aria-hidden="true"
        />

        <div className="relative flex h-full flex-col justify-between">
          <div>
            <span
              className={cn(
                "inline-flex items-center justify-center h-14 w-14 rounded-xl2",
                isMaroon ? "bg-cream/15 text-saffron-300" : "bg-maroon-500/10 text-maroon-500"
              )}
            >
              <Icon className="h-7 w-7" />
            </span>
            <h3 className="mt-6 font-display text-2xl sm:text-3xl font-semibold text-balance">
              {title}
            </h3>
            <p
              className={cn(
                "mt-3 text-sm sm:text-base leading-relaxed max-w-sm",
                isMaroon ? "text-cream/80" : "text-charcoal-light"
              )}
            >
              {description}
            </p>
          </div>

          <div
            className={cn(
              "mt-8 inline-flex items-center gap-2 font-semibold text-sm",
              isMaroon ? "text-saffron-300" : "text-maroon-600"
            )}
          >
            {cta}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
