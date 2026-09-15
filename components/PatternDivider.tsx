import { cn } from "@/lib/utils";

export default function PatternDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex items-center justify-center gap-3 select-none", className)}
      aria-hidden="true"
    >
      <span className="h-px w-12 sm:w-24 bg-gradient-to-r from-transparent to-saffron-500" />
      <svg width="22" height="22" viewBox="0 0 22 22" className="text-saffron-600 shrink-0">
        <path
          d="M11 1c1.5 3 3 4.5 6 4.5-3 1.5-4.5 3-6 6-1.5-3-3-4.5-6-6 3 0 4.5-1.5 6-4.5z"
          fill="currentColor"
        />
        <circle cx="11" cy="18" r="1.6" fill="currentColor" />
      </svg>
      <span className="h-px w-12 sm:w-24 bg-gradient-to-l from-transparent to-saffron-500" />
    </div>
  );
}
