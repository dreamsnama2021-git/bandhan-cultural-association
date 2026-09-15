"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserCircle2, ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import PujaCard from "@/components/PujaCard";
import PricingCard from "@/components/PricingCard";
import Accordion from "@/components/Accordion";
import { pujaCategories } from "@/data/pujaCategories";
import { registrationMembershipTypes } from "@/data/membership";
import { getCurrentSessionMember } from "@/lib/credentials";

const faqItems = [
  {
    question: "What does my membership include?",
    answer:
      "Every membership includes participation across our full festival calendar plus community event access. The Core plan unlocks a larger family limit and priority seating at cultural programs.",
  },
  {
    question: "What if I need to add more family members later?",
    answer:
      "You can add family members during registration for a flat add-on fee per member. Children under 5 years are exempt from the Aadhar and PAN requirement.",
  },
  {
    question: "How long is my membership valid?",
    answer: "Memberships are valid for 12 months from the date of registration.",
  },
];

export default function MembershipPage() {
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    setIsMember(!!getCurrentSessionMember());
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Membership"
        title="Choose your celebration"
        description="Select a festival to participate in, or explore our full membership plans below."
        crumbs={[{ label: "Membership" }]}
      />

      <section className="section-py">
        <Container>
          <SectionHeading title="Celebrate with us" description="Each Puja is open to every member — pick one to get started." />
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {pujaCategories.map((cat, i) => (
              <PujaCard key={cat.id} category={cat} index={i} />
            ))}
            <Link
              href="/profile"
              className="group flex flex-col items-center justify-center text-center rounded-2xl border-2 border-dashed border-maroon-500/25 p-4 sm:p-7 hover:border-saffron-500 transition-colors focus-ring"
            >
              <span className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-saffron-100 text-maroon-500">
                <UserCircle2 className="h-5 w-5 sm:h-7 sm:w-7" />
              </span>
              <h3 className="mt-3 sm:mt-5 font-display text-lg sm:text-2xl font-semibold text-maroon-500">Profile</h3>
              <p className="mt-1 sm:mt-2 hidden sm:block text-sm text-charcoal-light">Already a member? Manage your details.</p>
              <span className="mt-2 sm:mt-4 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-maroon-600">
                Go to Profile <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </Container>
      </section>

      {!isMember && (
        <section className="section-py bg-beige-light border-y border-maroon-500/10">
          <Container>
            <SectionHeading
              eyebrow="Membership Plans"
              title="Membership benefits, by plan"
              description="Pick the plan that fits your family — every plan gets you into every festival."
              align="center"
            />
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch max-w-2xl mx-auto">
              {registrationMembershipTypes.map((plan, i) => (
                <PricingCard
                  key={plan.id}
                  name={plan.name}
                  price={plan.price}
                  billingLabel="year"
                  benefits={plan.benefits}
                  highlight={plan.highlight}
                  ctaLabel="Register Now"
                  href="/register"
                  index={i}
                />
              ))}
            </div>
            <div className="mt-6 text-center text-xs text-charcoal-light">
              Membership prices are configured centrally and may be updated by the committee.
            </div>
          </Container>
        </section>
      )}

      <section className="section-py">
        <Container className="max-w-3xl">
          <SectionHeading title="Frequently asked questions" />
          <div className="mt-8">
            <Accordion items={faqItems} />
          </div>
        </Container>
      </section>
    </>
  );
}
