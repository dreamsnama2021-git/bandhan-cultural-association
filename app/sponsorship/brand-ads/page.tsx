"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2, Megaphone, Clock, Target, MapPin } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import Checkout from "@/components/Checkout";
import Confirmation from "@/components/Confirmation";
import Button from "@/components/Button";
import { adOptions } from "@/lib/config";
import type { PaymentResult } from "@/types";

const option = adOptions.find((a) => a.id === "brand-ads")!;

export default function BrandAdsPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [sponsorName, setSponsorName] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);

  return (
    <>
      <PageHeader
        eyebrow="Sponsorship / Brand Ads"
        title={option.title}
        description={option.description}
        crumbs={[{ label: "Sponsorship", href: "/sponsorship" }, { label: "Brand Ads" }]}
      />
      <section className="section-py">
        <Container className="max-w-4xl grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            {result ? (
              <Confirmation
                result={result}
                title="Brand Ad Booked"
                message="Our design team will reach out to finalize your artwork placement."
              />
            ) : !showCheckout ? (
              <>
                <div className="rounded-2xl bg-maroon-500 text-cream p-6 flex items-center justify-center h-48">
                  <Megaphone className="h-16 w-16 text-saffron-300" />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <Meta icon={MapPin} label="Placement" value={option.placement} />
                  <Meta icon={Clock} label="Duration" value={option.duration} />
                  <Meta icon={Target} label="Estimated Reach" value={option.estimatedReach} />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-charcoal mb-1.5">Sponsor / Business Name</label>
                  <input
                    className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-3 text-sm focus-ring"
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                    placeholder="Your business name"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-charcoal mb-1.5">Upload Artwork</label>
                  <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-maroon-500/25 py-10 cursor-pointer hover:border-saffron-500 transition-colors">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                    />
                    {fileName ? (
                      <span className="flex items-center gap-2 text-sm font-semibold text-charcoal">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" /> {fileName}
                      </span>
                    ) : (
                      <>
                        <UploadCloud className="h-6 w-6 text-saffron-600" />
                        <span className="text-sm text-charcoal-light">Click to upload your creative (demo)</span>
                      </>
                    )}
                  </label>
                </div>

                <Button size="lg" className="mt-8" disabled={!sponsorName} onClick={() => setShowCheckout(true)}>
                  Continue to Payment
                </Button>
              </>
            ) : (
              <Checkout
                summary={{
                  itemLabel: option.title,
                  itemDescription: sponsorName,
                  price: option.price,
                  discountPercent: option.discountPercent,
                }}
                onComplete={setResult}
              />
            )}
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-beige-light border border-beige-dark p-6 sticky top-24">
              <h3 className="font-display text-lg font-semibold text-maroon-500 mb-3">Brand Ad Package</h3>
              <p className="text-sm text-charcoal-light leading-relaxed">{option.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-charcoal-light">
                <li>Placement: {option.placement}</li>
                <li>Duration: {option.duration}</li>
                <li>Reach: {option.estimatedReach}</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function Meta({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/70 border border-maroon-500/10 p-3">
      <div className="flex items-center gap-1.5 text-xs text-charcoal-light">
        <Icon className="h-3.5 w-3.5 text-saffron-600" /> {label}
      </div>
      <p className="mt-1 text-sm font-semibold text-charcoal">{value}</p>
    </div>
  );
}
