import Link from "next/link";
import { pujaCategories } from "@/data/pujaCategories";

export default function Footer() {
  return (
    <footer className="shrink-0 bg-maroon-500 text-cream">
      <div className="mx-auto w-full max-w-7xl container-px py-8">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {pujaCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/membership/${cat.id}`}
              className="rounded-full border border-cream/20 px-5 py-2 text-sm font-semibold text-cream/90 hover:bg-cream/10 hover:text-cream focus-ring transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
