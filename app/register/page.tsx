"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Check } from "lucide-react";
import Container from "@/components/Container";
import Button from "@/components/Button";
import Checkout from "@/components/Checkout";
import Confirmation from "@/components/Confirmation";
import FamilyMemberForm from "@/components/FamilyMemberForm";
import { cn, isValidEmail, isValidMobile } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { membershipConfig } from "@/lib/config";
import { pujaCategories } from "@/data/pujaCategories";
import { registrationMembershipTypes } from "@/data/membership";
import type { FamilyMemberDetails, MembershipType, PaymentResult } from "@/types";

type Phase = "form" | "family" | "payment" | "confirmation";

export default function RegisterPage() {
  const [phase, setPhase] = useState<Phase>("form");
  const [pujas, setPujas] = useState<string[]>([]);
  const [membershipType, setMembershipType] = useState<MembershipType | null>(null);
  const [fullName, setFullName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberDetails[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedPlan = registrationMembershipTypes.find((t) => t.id === membershipType);

  const togglePuja = (id: string) => {
    setPujas((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (pujas.length === 0) next.pujas = "Select at least one Puja.";
    if (!membershipType) next.membershipType = "Select a membership type.";
    if (!fullName.trim()) next.fullName = "Enter your full name.";
    if (!isValidMobile(number)) next.number = "Enter a valid 10-digit number.";
    if (!isValidEmail(email)) next.email = "Enter a valid email address.";
    if (password.length < 8) next.password = "Password must be at least 8 characters.";
    setErrors(next);
    if (Object.keys(next).length === 0) setPhase("family");
  };

  const createAccount = async (members: FamilyMemberDetails[]) => {
    if (submitting) return;
    setSubmitting(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName.trim(),
          mobile: number,
          membership_type: membershipType,
          pujas,
          family_members: members.map(({ name, contact, age }) => ({ name, contact, age })),
        },
      },
    });
    setSubmitting(false);

    // Supabase returns a user with no identities (instead of an error) when
    // the email is already registered.
    const alreadyRegistered = !error && data.user && (data.user.identities?.length ?? 0) === 0;
    if (error || alreadyRegistered) {
      setErrors({
        email: alreadyRegistered
          ? "This email is already registered. Please log in instead."
          : error?.message ?? "Could not create your account. Please try again.",
      });
      setPhase("form");
      return;
    }

    setFamilyMembers(members);
    setPhase("payment");
  };

  const inputClass =
    "w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-3 text-sm text-charcoal focus-ring";

  return (
    <section className="section-py bg-cream motif-dots">
      <Container className="max-w-xl">
        {phase === "form" && (
          <>
            <h1 className="font-display text-3xl font-semibold text-maroon-500 text-center">
              Register New
            </h1>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-8 rounded-2xl bg-white/70 border border-maroon-500/10 p-6 sm:p-8 shadow-card">
              <div>
                <p className="text-sm font-semibold text-charcoal mb-1">
                  <span className="text-saffron-700">1</span> &nbsp;Membership For
                </p>
                <p className="text-xs text-charcoal-light mb-3">
                  Select as many as you like — anywhere from one Puja to all four.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {pujaCategories.map((cat) => {
                    const active = pujas.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => togglePuja(cat.id)}
                        className={cn(
                          "flex items-center justify-between gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-colors focus-ring",
                          active ? "border-saffron-500 bg-saffron-50 text-maroon-500" : "border-maroon-500/10 bg-white/60 text-charcoal hover:border-saffron-500/40"
                        )}
                      >
                        {cat.name}
                        <span className={cn("flex h-5 w-5 items-center justify-center rounded border-2 shrink-0", active ? "border-saffron-500 bg-saffron-500" : "border-maroon-500/20")}>
                          {active && <Check className="h-3.5 w-3.5 text-charcoal" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.pujas && <p className="mt-1.5 text-xs text-maroon-600">{errors.pujas}</p>}
              </div>

              <div>
                <p className="text-sm font-semibold text-charcoal mb-3">
                  <span className="text-saffron-700">2</span> &nbsp;Membership Type
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {registrationMembershipTypes.map((t) => {
                    const active = membershipType === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setMembershipType(t.id)}
                        className={cn(
                          "flex flex-col items-center gap-1 rounded-xl border-2 px-4 py-3 transition-colors focus-ring",
                          active ? "border-saffron-500 bg-saffron-50" : "border-maroon-500/10 bg-white/60 hover:border-saffron-500/40"
                        )}
                      >
                        <span className="font-display text-lg font-semibold text-maroon-500">{t.name}</span>
                        <span className="text-xs text-charcoal-light">₹{t.price.toLocaleString("en-IN")}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.membershipType && <p className="mt-1.5 text-xs text-maroon-600">{errors.membershipType}</p>}
              </div>

              <div>
                <p className="text-sm font-semibold text-charcoal mb-1.5">
                  <span className="text-saffron-700">3</span> &nbsp;Full Name
                </p>
                <input className={inputClass} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="As you'd like it on your membership card" />
                {errors.fullName && <p className="mt-1.5 text-xs text-maroon-600">{errors.fullName}</p>}
              </div>

              <div>
                <p className="text-sm font-semibold text-charcoal mb-1.5">
                  <span className="text-saffron-700">4</span> &nbsp;Number
                </p>
                <input className={inputClass} value={number} onChange={(e) => setNumber(e.target.value)} placeholder="98300 12345" inputMode="numeric" />
                {errors.number && <p className="mt-1.5 text-xs text-maroon-600">{errors.number}</p>}
              </div>

              <div>
                <p className="text-sm font-semibold text-charcoal mb-1.5">
                  <span className="text-saffron-700">5</span> &nbsp;Email
                </p>
                <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                <p className="mt-1.5 text-xs text-charcoal-light">We&apos;ll send a verification link to this address.</p>
                {errors.email && <p className="mt-1.5 text-xs text-maroon-600">{errors.email}</p>}
              </div>

              <div>
                <p className="text-sm font-semibold text-charcoal mb-1.5">
                  <span className="text-saffron-700">6</span> &nbsp;Password
                </p>
                <input type="password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" />
                {errors.password && <p className="mt-1.5 text-xs text-maroon-600">{errors.password}</p>}
              </div>

              <Button type="submit" size="lg" className="w-full justify-center">
                Continue to Payment
              </Button>
            </form>
          </>
        )}

        {phase === "family" && selectedPlan && (
          <FamilyMemberForm
            maxMembers={
              membershipType === "core"
                ? membershipConfig.plans.core.familyLimit
                : membershipType === "general"
                ? membershipConfig.plans.general.familyLimit
                : 0
            }
            onBack={() => setPhase("form")}
            onContinue={createAccount}
            submitting={submitting}
          />
        )}

        {phase === "payment" && selectedPlan && (
          <div>
            <h1 className="font-display text-2xl font-semibold text-maroon-500 mb-6 text-center">
              Complete your payment
            </h1>
            <Checkout
              summary={{
                itemLabel: `${selectedPlan.name} Membership`,
                itemDescription: [
                  pujaCategories.filter((c) => pujas.includes(c.id)).map((c) => c.name).join(", "),
                  familyMembers.length > 0 ? `+ ${familyMembers.length} family member(s) (free)` : "",
                ]
                  .filter(Boolean)
                  .join(" · "),
                price: selectedPlan.price,
              }}
              onComplete={(res) => {
                setResult(res);
                setPhase("confirmation");
              }}
            />
          </div>
        )}

        {phase === "confirmation" && result && (
          <Confirmation
            result={result}
            title="One Last Step — Verify Your Email"
            message="Your payment is confirmed. Activate your membership by verifying your email address."
          >
            <div className="rounded-2xl bg-beige-light border border-beige-dark p-5 text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-saffron-700 mb-2">
                Check your inbox
              </p>
              <p className="text-sm text-charcoal">
                We&apos;ve sent a verification link to <span className="font-semibold">{email}</span>. Click it to
                activate your account, then log in with this email and the password you chose.
              </p>
              <p className="mt-2 text-xs text-charcoal-light">
                Can&apos;t find it? Check your spam folder.
              </p>
              <Button href="/login" size="md" className="mt-4">
                Go to Login
              </Button>
            </div>
          </Confirmation>
        )}
      </Container>
    </section>
  );
}
