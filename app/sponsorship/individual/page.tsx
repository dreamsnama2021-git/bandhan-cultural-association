"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { HeartHandshake } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import StepIndicator from "@/components/StepIndicator";
import Checkout from "@/components/Checkout";
import Confirmation from "@/components/Confirmation";
import Button from "@/components/Button";
import { cn, formatCurrency, isValidEmail, isValidMobile } from "@/lib/utils";
import { individualSponsorshipItems } from "@/data/individualSponsorshipItems";
import { addSponsorshipPurchase } from "@/lib/sponsorships";
import { getCurrentSessionMember } from "@/lib/credentials";
import type { IndividualSponsorDetails, IndividualSponsorshipCategory, PaymentResult } from "@/types";

const steps = ["Select Sponsorship", "Your Details", "Payment", "Confirmation"];

const categoryTabs: { id: IndividualSponsorshipCategory; label: string }[] = [
  { id: "puja", label: "Puja Sponsorship" },
  { id: "mahabhog", label: "Mahabhog Sponsorship" },
];

export default function IndividualSponsorshipPage() {
  const [step, setStep] = useState(0);
  const [activeCategory, setActiveCategory] = useState<IndividualSponsorshipCategory>("puja");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [details, setDetails] = useState<IndividualSponsorDetails | null>(null);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof IndividualSponsorDetails, string>>>({});

  const [form, setForm] = useState({ fullName: "", phone: "", email: "", message: "" });

  const visibleItems = individualSponsorshipItems.filter((i) => i.category === activeCategory);
  const selectedItem = individualSponsorshipItems.find((i) => i.id === selectedItemId) ?? null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!isValidMobile(form.phone)) next.phone = "Enter a valid 10-digit phone number.";
    if (!isValidEmail(form.email)) next.email = "Enter a valid email address.";
    setErrors(next);
    if (Object.keys(next).length === 0 && selectedItem) {
      setDetails({ ...form, itemId: selectedItem.id, amount: selectedItem.price });
      setStep(2);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-3 text-sm text-charcoal focus-ring";

  return (
    <>
      <PageHeader
        eyebrow="Individual Sponsorship"
        title="Support the celebration as an individual"
        description="Choose a Puja or Mahabhog to sponsor — every contribution helps us keep the festival alive for the whole community."
        crumbs={[{ label: "Sponsorship", href: "/sponsorship" }, { label: "Individual" }]}
      />
      <section className="section-py">
        <Container className="max-w-2xl">
          <StepIndicator steps={steps} currentStep={step} />

          <div className="mt-10">
            {step === 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon-500/10 text-maroon-500">
                    <HeartHandshake className="h-6 w-6" />
                  </span>
                  <h2 className="font-display text-2xl font-semibold text-maroon-500">Choose a Sponsorship</h2>
                </div>

                <div className="flex gap-2 mb-5">
                  {categoryTabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveCategory(tab.id)}
                      className={cn(
                        "flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors focus-ring",
                        activeCategory === tab.id ? "bg-maroon-500 text-cream" : "bg-white/70 text-charcoal hover:bg-maroon-50"
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {visibleItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedItemId(item.id)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm transition-colors focus-ring",
                        selectedItemId === item.id ? "border-saffron-500 bg-saffron-50" : "border-maroon-500/10 bg-white/60 hover:border-saffron-500/40"
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block text-[10px] font-semibold uppercase tracking-wide text-saffron-700">{item.day}</span>
                        <span className="block font-semibold text-charcoal truncate">{item.name}</span>
                      </span>
                      <span className="font-semibold text-maroon-600 shrink-0">{formatCurrency(item.price)}</span>
                    </button>
                  ))}
                </div>

                <Button size="lg" className="mt-8 w-full sm:w-auto" onClick={() => setStep(1)} disabled={!selectedItem}>
                  {selectedItem ? `Continue with ${selectedItem.name} — ${formatCurrency(selectedItem.price)}` : "Select a sponsorship to continue"}
                </Button>
              </div>
            )}

            {step === 1 && selectedItem && (
              <form onSubmit={handleSubmit} noValidate>
                <h2 className="font-display text-2xl font-semibold text-maroon-500 mb-2">Your details</h2>
                <p className="text-sm text-charcoal-light mb-6">
                  Sponsoring: <span className="font-semibold text-maroon-600">{selectedItem.name}</span> ({selectedItem.day}) — {formatCurrency(selectedItem.price)}
                </p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-1.5">Full Name</label>
                    <input className={inputClass} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                    {errors.fullName && <p className="mt-1 text-xs text-maroon-600">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-1.5">Phone</label>
                    <input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    {errors.phone && <p className="mt-1 text-xs text-maroon-600">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-1.5">Email</label>
                    <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    {errors.email && <p className="mt-1 text-xs text-maroon-600">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-1.5">Message (optional)</label>
                    <textarea rows={3} className={inputClass} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  </div>
                </div>
                <div className="mt-8 flex gap-3">
                  <Button type="button" variant="ghost" onClick={() => setStep(0)}>Back</Button>
                  <Button type="submit">Continue to Payment</Button>
                </div>
              </form>
            )}

            {step === 2 && details && selectedItem && (
              <div>
                <h2 className="font-display text-2xl font-semibold text-maroon-500 mb-6">Complete your contribution</h2>
                <Checkout
                  summary={{ itemLabel: selectedItem.name, itemDescription: `${selectedItem.day} — ${details.fullName}`, price: details.amount }}
                  onComplete={(res) => {
                    const session = getCurrentSessionMember();
                    addSponsorshipPurchase({
                      id: `sp-${res.orderId}`,
                      type: "individual",
                      name: details.fullName,
                      contactEmail: details.email,
                      contactPhone: details.phone,
                      packageId: details.itemId,
                      mrp: details.amount,
                      amount: res.amount,
                      status: "confirmed",
                      createdOn: res.date,
                      memberEmail: session?.member.email,
                      membershipType: session?.member.membershipType,
                      pujas: session?.member.pujas,
                    });
                    setResult(res);
                    setStep(3);
                  }}
                />
              </div>
            )}

            {step === 3 && result && (
              <Confirmation
                result={result}
                title="Thank You for Supporting Us"
                message="Your contribution means a great deal to our community. A receipt has been sent to your email."
              />
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
