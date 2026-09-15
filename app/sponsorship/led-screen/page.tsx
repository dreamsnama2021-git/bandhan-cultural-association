"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2, MonitorPlay } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import Checkout from "@/components/Checkout";
import Confirmation from "@/components/Confirmation";
import Button from "@/components/Button";
import { adOptions } from "@/lib/config";
import type { PaymentResult } from "@/types";

const option = adOptions.find((a) => a.id === "led-screen")!;

const timeline = [
  { day: "Day 1", slot: "10 AM – 1 PM", plays: "8 plays" },
  { day: "Day 1", slot: "5 PM – 9 PM", plays: "12 plays" },
  { day: "Day 2", slot: "10 AM – 1 PM", plays: "8 plays" },
  { day: "Day 2", slot: "5 PM – 9 PM", plays: "12 plays" },
  { day: "Day 3", slot: "5 PM – 10 PM", plays: "15 plays" },
  { day: "Day 4", slot: "5 PM – 10 PM", plays: "15 plays" },
];

export default function LedScreenPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [sponsorName, setSponsorName] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);

  return (
    <>
      <PageHeader
        eyebrow="Sponsorship / LED Screen Ads"
        title={option.title}
        description={option.description}
        crumbs={[{ label: "Sponsorship", href: "/sponsorship" }, { label: "LED Screen Ads" }]}
      />
      <section className="section-py">
        <Container className="max-w-4xl grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            {result ? (
              <Confirmation result={result} title="LED Screen Ad Booked" message="Your creative will be scheduled per the timeline you reviewed." />
            ) : !showCheckout ? (
              <>
                <div className="rounded-2xl bg-charcoal text-cream p-6 flex flex-col items-center justify-center h-48 gap-2">
                  <MonitorPlay className="h-14 w-14 text-saffron-300" />
                  <span className="text-xs text-cream/60">LED screen preview</span>
                </div>

                <h3 className="mt-8 font-display text-lg font-semibold text-maroon-500">Ad Play Timeline</h3>
                <div className="mt-4 space-y-2">
                  {timeline.map((t) => (
                    <div key={`${t.day}-${t.slot}`} className="flex items-center justify-between rounded-lg bg-white/70 border border-maroon-500/10 px-4 py-2.5 text-sm">
                      <span className="font-semibold text-charcoal">{t.day}</span>
                      <span className="text-charcoal-light">{t.slot}</span>
                      <span className="text-saffron-700 font-semibold">{t.plays}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-charcoal mb-1.5">Sponsor / Business Name</label>
                  <input
                    className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-3 text-sm focus-ring"
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-charcoal mb-1.5">Upload Creative</label>
                  <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-maroon-500/25 py-10 cursor-pointer hover:border-saffron-500 transition-colors">
                    <input type="file" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)} />
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
                summary={{ itemLabel: option.title, itemDescription: sponsorName, price: option.price, discountPercent: option.discountPercent }}
                onComplete={setResult}
              />
            )}
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-beige-light border border-beige-dark p-6 sticky top-24">
              <h3 className="font-display text-lg font-semibold text-maroon-500 mb-3">LED Screen Package</h3>
              <ul className="space-y-2 text-sm text-charcoal-light">
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
