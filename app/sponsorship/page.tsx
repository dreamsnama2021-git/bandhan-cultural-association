import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import FeatureCard from "@/components/FeatureCard";
import { adOptions } from "@/lib/config";
import { formatCurrency } from "@/lib/utils";

export default function SponsorshipPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sponsorship"
        title="Support the celebration"
        description="Partner with Bandhan Cultural Association as a business or an individual sponsor."
        crumbs={[{ label: "Sponsorship" }]}
      />

      <section className="section-py">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FeatureCard
              href="/sponsorship/business"
              icon="Building2"
              title="Business Sponsorship"
              description="Sponsor as a business and unlock brand ads, LED screens, gate branding and stall opportunities."
              cta="Sponsor as a Business"
              tone="maroon"
              index={0}
            />
            <FeatureCard
              href="/sponsorship/individual"
              icon="HeartHandshake"
              title="Individual Sponsorship"
              description="Support the celebration directly with a contribution of your choice."
              cta="Sponsor as an Individual"
              tone="saffron"
              index={1}
            />
          </div>
        </Container>
      </section>

      <section className="section-py bg-beige-light border-y border-maroon-500/10">
        <Container>
          <SectionHeading
            eyebrow="Advertising Opportunities"
            title="Ways to get your brand seen"
            description="Every festival day brings thousands of visitors — here's how your brand can be part of it."
          />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adOptions.map((option, i) => {
              const Icon = (Icons[option.icon as keyof typeof Icons] as LucideIcon) || Icons.Megaphone;
              const hrefMap: Record<string, string> = {
                "brand-ads": "/sponsorship/brand-ads",
                "led-screen": "/sponsorship/led-screen",
                "gate-ads": "/sponsorship/gate-ads",
                coupons: "/coupons",
                video: "/sponsorship/video",
                stall: "/stalls",
              };
              return (
                <Link
                  key={option.id}
                  href={hrefMap[option.category]}
                  className="group flex flex-col h-full rounded-2xl bg-white/70 border border-maroon-500/10 p-6 shadow-card hover:shadow-card-hover hover:border-saffron-500/50 transition-all focus-ring"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon-500/10 text-maroon-500">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold text-maroon-500">{option.title}</h3>
                  <p className="mt-2 text-sm text-charcoal-light leading-relaxed flex-1">{option.description}</p>
                  <div className="mt-5 pt-4 border-t border-maroon-500/10 flex items-center justify-between">
                    <span className="font-display text-lg font-semibold text-charcoal">
                      {formatCurrency(option.price)}
                    </span>
                    <span className="text-sm font-semibold text-maroon-600">Learn more &rarr;</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
