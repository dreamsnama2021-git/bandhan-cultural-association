"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-block text-saffron-700 font-semibold tracking-[0.2em] uppercase text-xs mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-maroon-500 leading-tight text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-charcoal-light text-base sm:text-lg leading-relaxed text-balance">
          {description}
        </p>
      )}
    </motion.div>
  );
}
