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
import type { IndividualSponsorDetails, PaymentResult } from "@/types";

const steps = ["Amount", "Your Details", "Payment", "Confirmation"];
const presetAmounts = [1000, 2500, 5000, 10000];

export default function IndividualSponsorshipPage() {
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState<number>(2500);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [details, setDetails] = useState<IndividualSponsorDetails | null>(null);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof IndividualSponsorDetails, string>>>({});

  const [form, setForm] = useState({ fullName: "", phone: "", email: "", message: "" });

  const finalAmount = isCustom ? Number(customAmount) || 0 : amount;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!isValidMobile(form.phone)) next.phone = "Enter a valid 10-digit phone number.";
    if (!isValidEmail(form.email)) next.email = "Enter a valid email address.";
    if (finalAmount <= 0) next.amount = "Enter a valid contribution amount.";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setDetails({ ...form, amount: finalAmount });
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
        description="Every contribution — big or small — helps us keep the festival alive for the whole community."
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
                  <h2 className="font-display text-2xl font-semibold text-maroon-500">Choose a contribution amount</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {presetAmounts.map((a) => (
                    <button
                      key={a}
                      onClick={() => {
                        setAmount(a);
                        setIsCustom(false);
                      }}
                      className={cn(
                        "rounded-xl border-2 py-4 text-center font-display font-semibold transition-colors focus-ring",
                        !isCustom && amount === a ? "border-saffron-500 bg-saffron-50 text-maroon-500" : "border-maroon-500/10 bg-white/60 hover:border-saffron-500/40"
                      )}
                    >
                      {formatCurrency(a)}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setIsCustom(true)}
                  className={cn(
                    "mt-3 w-full rounded-xl border-2 py-4 text-center font-semibold transition-colors focus-ring",
                    isCustom ? "border-saffron-500 bg-saffron-50" : "border-maroon-500/10 bg-white/60 hover:border-saffron-500/40"
                  )}
                >
                  Custom Amount
                </button>
                {isCustom && (
                  <input
                    type="number"
                    min={1}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter amount in ₹"
                    className={cn(inputClass, "mt-3")}
                  />
                )}
                <Button size="lg" className="mt-8 w-full sm:w-auto" onClick={() => setStep(1)}>
                  Continue with {formatCurrency(finalAmount)}
                </Button>
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleSubmit} noValidate>
                <h2 className="font-display text-2xl font-semibold text-maroon-500 mb-6">Your details</h2>
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

            {step === 2 && details && (
              <div>
                <h2 className="font-display text-2xl font-semibold text-maroon-500 mb-6">Complete your contribution</h2>
                <Checkout
                  summary={{ itemLabel: "Individual Sponsorship", itemDescription: details.fullName, price: details.amount }}
                  onComplete={(res) => {
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
