"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, UserCircle2, LayoutGrid } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
}

export default function MobileMenu({
  open,
  onClose,
  links,
}: {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-charcoal/50 md:hidden"
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-y-0 left-0 z-50 w-[82%] max-w-xs bg-cream shadow-card-hover md:hidden flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between px-5 h-16 border-b border-maroon-500/10">
              <span className="font-display font-semibold text-lg text-maroon-500">
                Bandhan Cultural Association
              </span>
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-full text-maroon-500 hover:bg-maroon-50 focus-ring"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile primary">
              <ul className="flex flex-col gap-1">
                <li>
                  <Link
                    href="/dashboard"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-charcoal font-semibold hover:bg-maroon-50"
                  >
                    <LayoutGrid className="h-5 w-5 text-saffron-600" />
                    Dashboard
                  </Link>
                </li>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="block px-4 py-3 rounded-xl text-charcoal font-semibold hover:bg-maroon-50"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/profile"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-charcoal font-semibold hover:bg-maroon-50"
                  >
                    <UserCircle2 className="h-5 w-5 text-saffron-600" />
                    Profile
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="p-5 border-t border-maroon-500/10 text-xs text-charcoal-light">
              &copy; {new Date().getFullYear()} Bandhan Cultural Association
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
