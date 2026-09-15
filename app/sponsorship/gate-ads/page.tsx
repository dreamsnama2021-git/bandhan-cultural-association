"use client";

import { useState } from "react";
import { DoorOpen, Check } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import Checkout from "@/components/Checkout";
import Confirmation from "@/components/Confirmation";
import Button from "@/components/Button";
import { cn, formatCurrency } from "@/lib/utils";
import { gateAdOptions } from "@/data/sponsorshipPackages";
import type { PaymentResult } from "@/types";

export default function GateAdsPage() {
  const [selectedId, setSelectedId] = useState(gateAdOptions[0].id);
  const [sponsorName, setSponsorName] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);

  const selected = gateAdOptions.find((g) => g.id === selectedId)!;

  return (
    <>
      <PageHeader
        eyebrow="Sponsorship / Gate Advertisement"
        title="Gate Advertisement"
        description="Be the first brand every visitor sees at our festival entrance."
        crumbs={[{ label: "Sponsorship", href: "/sponsorship" }, { label: "Gate Ads" }]}
      />
      <section className="section-py">
        <Container className="max-w-4xl">
          {result ? (
            <Confirmation result={result} title="Gate Advertisement Booked" message="Your placement is confirmed. Our team will contact you for banner artwork." />
          ) : !showCheckout ? (
            <>
              <div className="relative rounded-2xl bg-maroon-500 text-cream p-8 flex flex-col items-center justify-center gap-3 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-3 bg-saffron-500" aria-hidden="true" />
                <DoorOpen className="h-16 w-16 text-saffron-300" />
                <p className="font-display text-xl font-semibold">Festival Entrance Gate</p>
                <p className="text-xs text-cream/70">Selected: {selected.name}</p>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {gateAdOptions.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    disabled={!g.available}
                    onClick={() => setSelectedId(g.id)}
                    className={cn(
                      "text-left rounded-xl border-2 p-5 transition-colors focus-ring",
                      !g.available && "opacity-50 cursor-not-allowed",
                      selectedId === g.id ? "border-saffron-500 bg-saffron-50" : "border-maroon-500/10 bg-white/60 hover:border-saffron-500/40"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-lg font-semibold text-maroon-500">{g.name}</span>
                      {selectedId === g.id && <Check className="h-5 w-5 text-saffron-600" />}
                    </div>
                    <p className="mt-1 text-sm text-charcoal-light">{g.description}</p>
                    <p className="mt-2 font-semibold text-charcoal">{formatCurrency(g.price)}</p>
                    {!g.available && <p className="mt-1 text-xs text-maroon-600 font-semibold">Currently unavailable</p>}
                  </button>
                ))}
              </div>

              <div className="mt-8 max-w-md">
                <label className="block text-sm font-semibold text-charcoal mb-1.5">Sponsor / Business Name</label>
                <input
                  className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-3 text-sm focus-ring"
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                />
              </div>

              <Button size="lg" className="mt-8" disabled={!sponsorName} onClick={() => setShowCheckout(true)}>
                Continue to Payment
              </Button>
            </>
          ) : (
            <Checkout
              summary={{ itemLabel: `Gate Ad — ${selected.name}`, itemDescription: sponsorName, price: selected.price }}
              onComplete={setResult}
            />
          )}
        </Container>
      </section>
    </>
  );
}
