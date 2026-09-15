"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Check } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import StepIndicator from "@/components/StepIndicator";
import PricingCard from "@/components/PricingCard";
import Checkout from "@/components/Checkout";
import Confirmation from "@/components/Confirmation";
import Button from "@/components/Button";
import { cn, isValidEmail, isValidMobile } from "@/lib/utils";
import { sponsorshipPackages, adOptions } from "@/lib/config";
import { getSponsorshipDiscountPercent, getSponsorshipCategory } from "@/lib/discounts";
import { addSponsorshipPurchase } from "@/lib/sponsorships";
import { getCurrentSessionMember } from "@/lib/credentials";
import type { BusinessSponsorDetails, PaymentResult } from "@/types";

const steps = ["Package", "Business Details", "Add-ons", "Payment", "Confirmation"];

const businessCategories = [
  "Food & Dining",
  "Fashion & Apparel",
  "Electronics",
  "Beauty & Wellness",
  "Home & Décor",
  "Real Estate",
  "Healthcare",
  "Other",
];

export default function BusinessSponsorshipPage() {
  const [step, setStep] = useState(0);
  const [packageId, setPackageId] = useState<string>("entrance-gate-pillars");
  const [addOns, setAddOns] = useState<string[]>([]);
  const [details, setDetails] = useState<BusinessSponsorDetails | null>(null);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof BusinessSponsorDetails, string>>>({});
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    setDiscountPercent(getSponsorshipDiscountPercent());
  }, []);

  const [form, setForm] = useState<Omit<BusinessSponsorDetails, "packageId" | "addOns">>({
    businessName: "",
    contactPerson: "",
    phone: "",
    email: "",
    category: businessCategories[0],
    website: "",
    socialMedia: "",
    message: "",
  });

  const pkg = sponsorshipPackages[packageId];

  const addOnTotal = useMemo(
    () => addOns.reduce((sum, id) => sum + (adOptions.find((a) => a.id === id)?.price ?? 0), 0),
    [addOns]
  );

  const toggleAddOn = (id: string) => {
    setAddOns((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  };

  const handleDetailsSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!form.businessName.trim()) next.businessName = "Business name is required.";
    if (!form.contactPerson.trim()) next.contactPerson = "Contact person is required.";
    if (!isValidMobile(form.phone)) next.phone = "Enter a valid 10-digit phone number.";
    if (!isValidEmail(form.email)) next.email = "Enter a valid email address.";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setDetails({ ...form, packageId, addOns });
      setStep(2);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-3 text-sm text-charcoal focus-ring";

  return (
    <>
      <PageHeader
        eyebrow="Business Sponsorship"
        title="Promote your business at our festivals"
        crumbs={[{ label: "Sponsorship", href: "/sponsorship" }, { label: "Business" }]}
      />
      <section className="section-py">
        <Container className="max-w-5xl">
          <StepIndicator steps={steps} currentStep={step} />

          <div className="mt-10">
            {step === 0 && (
              <div>
                <h2 className="font-display text-2xl font-semibold text-maroon-500 mb-2">Choose your sponsorship package</h2>
                {discountPercent > 0 ? (
                  <p className="text-sm text-emerald-700 font-semibold mb-6">
                    You qualify for a {discountPercent}% discount on every package below, applied at checkout.
                  </p>
                ) : (
                  <p className="text-sm text-charcoal-light mb-6">
                    Prices shown below are as per actual — log in as a member for a discount.
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                  {Object.values(sponsorshipPackages).map((p, i) => (
                    <PricingCard
                      key={p.id}
                      name={p.name}
                      price={p.price}
                      benefits={p.perks}
                      highlight={p.recommended}
                      selected={packageId === p.id}
                      onSelect={() => setPackageId(p.id)}
                      ctaLabel="Choose Package"
                      index={i}
                    />
                  ))}
                </div>
                <Button className="mt-8" size="lg" onClick={() => setStep(1)}>
                  Continue with {pkg.name}
                </Button>
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleDetailsSubmit} className="max-w-2xl" noValidate>
                <h2 className="font-display text-2xl font-semibold text-maroon-500 mb-6">Business details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-1.5">Business Name</label>
                    <input className={inputClass} value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
                    {errors.businessName && <p className="mt-1 text-xs text-maroon-600">{errors.businessName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-1.5">Contact Person</label>
                    <input className={inputClass} value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} />
                    {errors.contactPerson && <p className="mt-1 text-xs text-maroon-600">{errors.contactPerson}</p>}
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
                    <label className="block text-sm font-semibold text-charcoal mb-1.5">Business Category</label>
                    <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      {businessCategories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-1.5">Website (optional)</label>
                    <input className={inputClass} value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-charcoal mb-1.5">Social Media (optional)</label>
                    <input className={inputClass} value={form.socialMedia} onChange={(e) => setForm({ ...form, socialMedia: e.target.value })} placeholder="@yourbusiness" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-charcoal mb-1.5">Message (optional)</label>
                    <textarea rows={3} className={inputClass} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  </div>
                </div>
                <div className="mt-8 flex gap-3">
                  <Button type="button" variant="ghost" onClick={() => setStep(0)}>Back</Button>
                  <Button type="submit">Continue</Button>
                </div>
              </form>
            )}

            {step === 2 && (
              <div>
                <h2 className="font-display text-2xl font-semibold text-maroon-500 mb-2">Select advertising add-ons</h2>
                <p className="text-charcoal-light text-sm mb-6">Optional — enhance your sponsorship with additional visibility.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {adOptions.map((option) => {
                    const active = addOns.includes(option.id);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => toggleAddOn(option.id)}
                        className={cn(
                          "text-left rounded-xl border-2 p-5 transition-colors focus-ring",
                          active ? "border-saffron-500 bg-saffron-50" : "border-maroon-500/10 bg-white/60 hover:border-saffron-500/40"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-charcoal">{option.title}</span>
                          <span className={cn("flex h-5 w-5 items-center justify-center rounded border-2", active ? "border-saffron-500 bg-saffron-500" : "border-maroon-500/20")}>
                            {active && <Check className="h-3.5 w-3.5 text-charcoal" />}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-charcoal-light">{option.description}</p>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-8 flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={() => setStep(3)}>Continue to Payment</Button>
                </div>
              </div>
            )}

            {step === 3 && details && (
              <div>
                <h2 className="font-display text-2xl font-semibold text-maroon-500 mb-6">Complete your sponsorship payment</h2>
                <Checkout
                  summary={{
                    itemLabel: `${pkg.name}${addOns.length ? ` + ${addOns.length} add-on(s)` : ""}`,
                    itemDescription: details.businessName,
                    price: pkg.price + addOnTotal,
                    discountPercent,
                  }}
                  onComplete={(res) => {
                    const session = getCurrentSessionMember();
                    addSponsorshipPurchase({
                      id: `sp-${res.orderId}`,
                      type: "business",
                      name: details.businessName,
                      contactEmail: details.email,
                      contactPhone: details.phone,
                      packageId: details.packageId,
                      mrp: pkg.price + addOnTotal,
                      discountPercent,
                      amount: res.amount,
                      status: "confirmed",
                      createdOn: res.date,
                      memberEmail: session?.member.email,
                      membershipType: session?.member.membershipType,
                      pujas: session?.member.pujas,
                      category: getSponsorshipCategory(),
                    });
                    setResult(res);
                    setStep(4);
                  }}
                />
              </div>
            )}

            {step === 4 && result && (
              <Confirmation
                result={result}
                title="Sponsorship Confirmed"
                message="Thank you for supporting Bandhan Cultural Association. Our team will reach out with next steps for creative submission."
              />
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
