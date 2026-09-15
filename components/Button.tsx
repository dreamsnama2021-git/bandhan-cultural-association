"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-maroon-500 text-cream hover:bg-maroon-600 shadow-card",
  secondary:
    "bg-saffron-500 text-charcoal hover:bg-saffron-600 shadow-gold",
  outline:
    "border-2 border-maroon-500 text-maroon-500 hover:bg-maroon-500 hover:text-cream",
  ghost: "text-maroon-500 hover:bg-maroon-50",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-base sm:text-lg",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  icon?: ReactNode;
}

interface ButtonAsButton extends BaseProps, Omit<HTMLMotionProps<"button">, "children"> {
  href?: undefined;
}

interface ButtonAsLink extends BaseProps {
  href: string;
  target?: string;
  rel?: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children, icon } = props;

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-colors focus-ring disabled:opacity-50 disabled:pointer-events-none",
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} target={props.target} rel={props.rel} className={classes}>
        {children}
        {icon}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { href: _href, variant: _variant, size: _size, className: _className, children: _children, icon: _icon, ...rest } = props as ButtonAsButton;

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={classes}
      {...rest}
    >
      {children}
      {icon}
    </motion.button>
  );
}
