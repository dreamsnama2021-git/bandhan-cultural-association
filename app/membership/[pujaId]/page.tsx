import { notFound } from "next/navigation";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import DashboardCard from "@/components/DashboardCard";
import { pujaCategories } from "@/data/pujaCategories";

export function generateStaticParams() {
  return pujaCategories.map((c) => ({ pujaId: c.id }));
}

export default function PujaDashboardPage({ params }: { params: { pujaId: string } }) {
  const puja = pujaCategories.find((c) => c.id === params.pujaId);
  if (!puja) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Membership"
        title={puja.name}
        description={puja.tagline}
        crumbs={[{ label: "Membership", href: "/membership" }, { label: puja.name }]}
      />
      <section className="section-py">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            <DashboardCard
              href="/profile"
              icon="UserCircle2"
              title="Profile"
              description="Manage your personal and membership details."
              cta="View Profile"
              featured
              className="col-span-2 lg:col-span-3"
              index={0}
            />
            <DashboardCard
              href="/sponsorship/business"
              icon="Building2"
              title="Business Sponsor"
              description="Promote your business through the association's festival ecosystem."
              cta="Sponsor as a Business"
              index={1}
            />
            <DashboardCard
              href="/stalls"
              icon="Store"
              title="Stall Space"
              description="Reserve a stall and connect with visitors during the celebration."
              cta="Book a Stall"
              index={2}
            />
            <DashboardCard
              href="/sponsorship/individual"
              icon="HeartHandshake"
              title="Individual Sponsor"
              description="Support the celebration as an individual contributor."
              cta="Contribute"
              index={3}
            />
            <DashboardCard
              href={`/tickets?puja=${puja.id}`}
              icon="Ticket"
              title="Buy Tickets"
              description={`Get access to upcoming ${puja.name} events.`}
              cta="Browse Tickets"
              index={4}
            />
            <DashboardCard
              href={`/events?puja=${puja.id}`}
              icon="CalendarDays"
              title="Pooja Calendar"
              description={`Explore ${puja.name} dates and reserve your participation.`}
              cta="View Calendar"
              index={5}
            />
            <DashboardCard
              href={`/membership/${puja.id}/images`}
              icon="Images"
              title="View Images"
              description={`Photos from previous years' ${puja.name} celebrations.`}
              cta="View Gallery"
              index={6}
            />
            <DashboardCard
              href="/bhog"
              icon="Soup"
              title="Bhog"
              description="Pick a Navratri day to see your family's Bhog coupons."
              cta="View Navratri Days"
              className="col-span-2 lg:col-span-3"
              index={7}
            />
          </div>
        </Container>
      </section>
    </>
  );
}
