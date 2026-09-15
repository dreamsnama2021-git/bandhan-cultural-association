"use client";

import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import DashboardCard from "@/components/DashboardCard";
import { useMemberGuard } from "@/lib/useMemberGuard";

export default function DashboardPage() {
  const session = useMemberGuard();

  if (!session) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-charcoal-light">Checking your session…</p>
      </section>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Member Portal"
        title={`Welcome back, ${session.member.fullName.split(" ")[0]}`}
        description="Your community hub for membership, sponsorship, stalls, tickets and events."
      />

      <section className="section-py">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
            <DashboardCard
              href="/profile"
              icon="UserCircle2"
              title="Profile"
              description="Manage your personal and membership details."
              cta="View Profile"
              featured
              className="sm:col-span-2 lg:col-span-3"
              index={0}
            />
            <DashboardCard
              href="/sponsorship/business"
              icon="Building2"
              title="Business Sponsor"
              description="Promote your business through the association's festival ecosystem."
              cta="Sponsor as a Business"
              className="sm:col-span-2 lg:col-span-3"
              index={1}
            />
            <DashboardCard
              href="/stalls"
              icon="Store"
              title="Stall Space"
              description="Reserve a stall and connect with visitors during the celebration."
              cta="Book a Stall"
              className="lg:col-span-2"
              index={2}
            />
            <DashboardCard
              href="/sponsorship/individual"
              icon="HeartHandshake"
              title="Individual Sponsor"
              description="Support the celebration as an individual contributor."
              cta="Contribute"
              className="lg:col-span-2"
              index={3}
            />
            <DashboardCard
              href="/tickets"
              icon="Ticket"
              title="Buy Tickets"
              description="Get access to upcoming association events."
              cta="Browse Tickets"
              className="lg:col-span-2"
              index={4}
            />
            <DashboardCard
              href="/events"
              icon="CalendarDays"
              title="Event / Calendar"
              description="Explore upcoming events and reserve your participation."
              cta="View Calendar"
              className="sm:col-span-2 lg:col-span-3"
              index={5}
            />
            <DashboardCard
              href="/membership"
              icon="Images"
              title="Images"
              description="Browse festival photo galleries from each puja celebration."
              cta="View Gallery"
              className="sm:col-span-2 lg:col-span-3"
              index={6}
            />
            <DashboardCard
              href="/bhog"
              icon="Soup"
              title="Bhog"
              description="Pick a Navratri day to see your family's Bhog coupons."
              cta="View Navratri Days"
              className="sm:col-span-2 lg:col-span-3"
              index={7}
            />
          </div>
        </Container>
      </section>
    </>
  );
}
