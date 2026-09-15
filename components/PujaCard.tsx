"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PujaCategoryInfo } from "@/types";

export default function PujaCard({
  category,
  index = 0,
}: {
  category: PujaCategoryInfo;
  index?: number;
}) {
  const Icon = (Icons[category.icon as keyof typeof Icons] as LucideIcon) || Icons.Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
    >
      <Link
        href={`/membership/${category.id}`}
        className="group relative flex flex-col h-full overflow-hidden rounded-2xl bg-white/70 border border-maroon-500/10 p-4 sm:p-7 shadow-card hover:shadow-card-hover hover:border-saffron-500/50 transition-all focus-ring"
      >
        <div className="absolute top-0 right-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-saffron-500/10 group-hover:bg-saffron-500/20 transition-colors" aria-hidden="true" />
        <span className="relative flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-maroon-500 text-white">
          <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
        </span>
        <h3 className="relative mt-3 sm:mt-5 font-display text-lg sm:text-2xl font-semibold text-maroon-500">
          {category.name}
        </h3>
        <p className="relative mt-1 sm:mt-2 text-xs sm:text-sm font-semibold text-saffron-700">
          {category.tagline}
        </p>
        <p className="relative mt-2 sm:mt-3 hidden sm:block text-sm text-charcoal-light leading-relaxed">
          {category.description}
        </p>
      </Link>
    </motion.div>
  );
}
