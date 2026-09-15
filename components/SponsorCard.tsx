import { Building2, User } from "lucide-react";
import type { Sponsor } from "@/types";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

export default function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-white/70 border border-maroon-500/10 p-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-saffron-100 text-maroon-500 shrink-0">
        {sponsor.type === "business" ? <Building2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-charcoal truncate">{sponsor.name}</p>
        <p className="text-xs text-charcoal-light">{sponsor.contactEmail} &middot; {formatDate(sponsor.createdOn)}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-display font-semibold text-charcoal">{formatCurrency(sponsor.amount)}</p>
        <span
          className={cn(
            "text-[10px] font-semibold px-2 py-0.5 rounded-full",
            sponsor.status === "confirmed" ? "bg-emerald-50 text-emerald-700" : "bg-saffron-50 text-saffron-700"
          )}
        >
          {sponsor.status.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
