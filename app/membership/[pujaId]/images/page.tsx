import { notFound } from "next/navigation";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Camera } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import { pujaCategories } from "@/data/pujaCategories";

export function generateStaticParams() {
  return pujaCategories.map((c) => ({ pujaId: c.id }));
}

const placeholderCount = 8;

export default function PujaImagesPage({ params }: { params: { pujaId: string } }) {
  const puja = pujaCategories.find((c) => c.id === params.pujaId);
  if (!puja) notFound();

  const Icon = (Icons[puja.icon as keyof typeof Icons] as LucideIcon) || Icons.Sparkles;

  return (
    <>
      <PageHeader
        eyebrow="View Images"
        title={`${puja.name} — Gallery`}
        description="Moments from previous celebrations, shared by the association."
        crumbs={[
          { label: "Membership", href: "/membership" },
          { label: puja.name, href: `/membership/${puja.id}` },
          { label: "Images" },
        ]}
      />
      <section className="section-py">
        <Container>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: placeholderCount }).map((_, i) => (
              <div
                key={i}
                className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-maroon-500 to-maroon-700 shadow-card"
              >
                <Icon className="h-10 w-10 text-cream/30 group-hover:scale-110 transition-transform" />
                <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-cream/15 px-2 py-1 text-[10px] font-semibold text-cream/80">
                  <Camera className="h-3 w-3" /> Photo {i + 1}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-charcoal-light">
            This is a demo gallery — real event photos will be added here by the committee after each celebration.
          </p>
        </Container>
      </section>
    </>
  );
}
