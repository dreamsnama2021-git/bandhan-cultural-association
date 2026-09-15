"use client";

import { useState } from "react";
import { Video, UploadCloud, CheckCircle2, Check } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import Checkout from "@/components/Checkout";
import Confirmation from "@/components/Confirmation";
import Button from "@/components/Button";
import { cn, formatCurrency } from "@/lib/utils";
import { videoSponsorshipOptions } from "@/data/sponsorshipPackages";
import type { PaymentResult } from "@/types";

export default function VideoSponsorshipPage() {
  const [selectedId, setSelectedId] = useState(videoSponsorshipOptions[0].id);
  const [sponsorName, setSponsorName] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);

  const selected = videoSponsorshipOptions.find((v) => v.id === selectedId)!;

  return (
    <>
      <PageHeader
        eyebrow="Sponsorship / Video Sponsorship"
        title="Video Sponsorship"
        description="Place your brand in front of the festival audience through video."
        crumbs={[{ label: "Sponsorship", href: "/sponsorship" }, { label: "Video" }]}
      />
      <section className="section-py">
        <Container className="max-w-4xl">
          {result ? (
            <Confirmation result={result} title="Video Sponsorship Booked" message="Please share your final video file with our team before the event." />
          ) : !showCheckout ? (
            <>
              <div className="rounded-2xl bg-charcoal text-cream p-8 flex flex-col items-center justify-center gap-2 h-44">
                <Video className="h-14 w-14 text-saffron-300" />
                <span className="text-xs text-cream/60">Video sponsorship preview</span>
              </div>

              <div className="mt-8 space-y-4">
                {videoSponsorshipOptions.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedId(v.id)}
                    className={cn(
                      "w-full text-left rounded-xl border-2 p-5 transition-colors focus-ring",
                      selectedId === v.id ? "border-saffron-500 bg-saffron-50" : "border-maroon-500/10 bg-white/60 hover:border-saffron-500/40"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-display text-lg font-semibold text-maroon-500">{v.placement}</p>
                        <p className="text-sm text-charcoal-light mt-1">{v.event} &middot; {v.duration} &middot; Audience: {v.estimatedAudience}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-display text-lg font-bold text-charcoal">{formatCurrency(v.price)}</span>
                        {selectedId === v.id && <Check className="h-5 w-5 text-saffron-600" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-1.5">Sponsor / Business Name</label>
                  <input
                    className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-3 text-sm focus-ring"
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-1.5">Upload Video (simulated)</label>
                  <label className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-maroon-500/25 py-3 cursor-pointer hover:border-saffron-500 transition-colors h-[46px]">
                    <input type="file" accept="video/*" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)} />
                    {fileName ? (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-charcoal">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" /> {fileName}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-charcoal-light">
                        <UploadCloud className="h-4 w-4 text-saffron-600" /> Choose file
                      </span>
                    )}
                  </label>
                </div>
              </div>

              <Button size="lg" className="mt-8" disabled={!sponsorName} onClick={() => setShowCheckout(true)}>
                Continue to Payment
              </Button>
            </>
          ) : (
            <Checkout
              summary={{ itemLabel: `Video Sponsorship — ${selected.placement}`, itemDescription: sponsorName, price: selected.price }}
              onComplete={setResult}
            />
          )}
        </Container>
      </section>
    </>
  );
}
