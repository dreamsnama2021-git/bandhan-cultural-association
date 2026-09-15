import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminTopBar({
  title,
  description,
  backHref = "/admin",
  backLabel = "Admin Home",
}: {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="border-b border-maroon-500/10 bg-cream/50">
      <div className="mx-auto w-full max-w-7xl container-px py-6 sm:py-8">
        {backHref !== "/admin" && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-maroon-600 hover:text-maroon-700 focus-ring rounded mb-3"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> {backLabel}
          </Link>
        )}
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-maroon-500">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-charcoal-light max-w-2xl">{description}</p>}
      </div>
    </div>
  );
}
