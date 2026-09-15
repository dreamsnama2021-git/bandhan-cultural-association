import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-sm text-charcoal-light mb-6">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-saffron-500" />}
          {item.href ? (
            <Link href={item.href} className="hover:text-maroon-500 focus-ring rounded">
              {item.label}
            </Link>
          ) : (
            <span className="text-maroon-500 font-semibold">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
