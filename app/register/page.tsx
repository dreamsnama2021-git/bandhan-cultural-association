"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Check } from "lucide-react";
import Container from "@/components/Container";
import Button from "@/components/Button";
import Checkout from "@/components/Checkout";
import Confirmation from "@/components/Confirmation";
import MembershipCard from "@/components/MembershipCard";
import FamilyMemberForm from "@/components/FamilyMemberForm";
import { cn, isValidEmail, isValidMobile, generateMemberId, generatePassword } from "@/lib/utils";
import { saveCredential, setCurrentSession } from "@/lib/credentials";
import { membershipConfig } from "@/lib/config";
import { pujaCategories } from "@/data/pujaCategories";
import { registrationMembershipTypes } from "@/data/membership";
import type { FamilyMemberDetails, Member, MembershipType, PaymentResult, PujaCategory } from "@/types";

type Phase = "form" | "family" | "payment" | "confirmation";

export default function RegisterPage() {
  const [phase, setPhase] = useState<Phase>("form");
  const [pujas, setPujas] = useState<string[]>([]);
  const [membershipType, setMembershipType] = useState<MembershipType | null>(null);
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberDetails[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loginPassword, setLoginPassword] = useState("");

  const selectedPlan = registrationMembershipTypes.find((t) => t.id === membershipType);

  const togglePuja = (id: string) => {
    setPujas((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (pujas.length === 0) next.pujas = "Select at least one Puja.";
    if (!membershipType) next.membershipType = "Select a membership type.";
    if (!isValidMobile(number)) next.number = "Enter a valid 10-digit number.";
    if (!isValidEmail(email)) next.email = "Enter a valid email address.";
    setErrors(next);
    if (Object.keys(next).length === 0) setPhase("family");
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
                  <span className="text-saffron-700">3</span> &nbsp;Number
                </p>
                <input className={inputClass} value={number} onChange={(e) => setNumber(e.target.value)} placeholder="98300 12345" inputMode="numeric" />
                {errors.number && <p className="mt-1.5 text-xs text-maroon-600">{errors.number}</p>}
              </div>

              <div>
                <p className="text-sm font-semibold text-charcoal mb-1.5">
                  <span className="text-saffron-700">4</span> &nbsp;Email
                </p>
                <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                {errors.email && <p className="mt-1.5 text-xs text-maroon-600">{errors.email}</p>}
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
            onContinue={(members) => {
              setFamilyMembers(members);
              setPhase("payment");
            }}
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
                const newMember: Member = {
                  id: "new-member",
                  memberId: generateMemberId(),
                  fullName: email.split("@")[0].replace(/[._]/g, " ") || "New Member",
                  email,
                  mobile: number,
                  address: "",
                  city: "",
                  membershipType: membershipType ?? "general",
                  familyMembers: familyMembers.length,
                  joinedOn: new Date().toISOString(),
                  validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
                  role: "member",
                  pujas: pujas as PujaCategory[],
                };
                const password = generatePassword();
                saveCredential({
                  email,
                  password,
                  member: newMember,
                  familyMembers,
                });
                setCurrentSession(email);
                setMember(newMember);
                setLoginPassword(password);
                setResult(res);
                setPhase("confirmation");
              }}
            />
          </div>
        )}

        {phase === "confirmation" && result && member && (
          <Confirmation
            result={result}
            title="Welcome to the Association!"
            message="Your registration is complete. Your digital membership card is ready below."
          >
            <div className="rounded-2xl bg-beige-light border border-beige-dark p-5 text-left mb-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-saffron-700 mb-2">
                Login Details (sent to {email})
              </p>
              <div className="flex items-center justify-between text-sm py-1">
                <span className="text-charcoal-light">Login ID (Email)</span>
                <span className="font-semibold text-charcoal">{email}</span>
              </div>
              <div className="flex items-center justify-between text-sm py-1">
                <span className="text-charcoal-light">Password</span>
                <span className="font-mono font-semibold text-charcoal">{loginPassword}</span>
              </div>
              <p className="mt-2 text-xs text-charcoal-light">
                Use these credentials on the Member Login screen next time.
              </p>
            </div>
            <MembershipCard member={member} />
          </Confirmation>
        )}
      </Container>
    </section>
  );
}
