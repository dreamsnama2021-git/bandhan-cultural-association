import AdminTopBar from "@/components/AdminTopBar";
import Container from "@/components/Container";
import DashboardCard from "@/components/DashboardCard";
import { membershipTypeLabels } from "@/data/membership";
import type { MembershipType, PujaCategoryInfo } from "@/types";

export default function AdminPujaTypeGrid({
  puja,
  type,
}: {
  puja: PujaCategoryInfo;
  type: MembershipType;
}) {
  const baseHref = `/admin/members/${type}?puja=${puja.id}`;

  return (
    <>
      <AdminTopBar
        title={`${puja.name} — ${membershipTypeLabels[type]}`}
        description={`Manage ${puja.name} activity for ${membershipTypeLabels[type]} plan members.`}
        backHref="/admin"
      />
      <section className="section-py">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            <DashboardCard
              href={`${baseHref}&section=profile`}
              icon="Users"
              title="Profile"
              description={`View the ${membershipTypeLabels[type]} members registered for ${puja.name}.`}
              cta="View Members"
              featured
              className="col-span-2 lg:col-span-3"
              index={0}
            />
            <DashboardCard
              href={`${baseHref}&section=business`}
              icon="Building2"
              title="Business Sponsor"
              description="Business sponsorships received for the association."
              cta="View Sponsors"
              index={1}
            />
            <DashboardCard
              href={`${baseHref}&section=stall`}
              icon="Store"
              title="Stall Space"
              description="Festival stall inventory and booking status."
              cta="View Stalls"
              index={2}
            />
            <DashboardCard
              href={`${baseHref}&section=individual`}
              icon="HeartHandshake"
              title="Individual Sponsor"
              description="Individual contributions received."
              cta="View Sponsors"
              index={3}
            />
            <DashboardCard
              href={`${baseHref}&section=tickets`}
              icon="Ticket"
              title="Tickets"
              description={`Ticket sales for ${puja.name} events.`}
              cta="View Tickets"
              index={4}
            />
            <DashboardCard
              href={`${baseHref}&section=calendar`}
              icon="CalendarDays"
              title="Pooja Calendar"
              description={`${puja.name} event schedule.`}
              cta="View Calendar"
              index={5}
            />
            <DashboardCard
              href={`${baseHref}&section=images`}
              icon="Images"
              title="View Images"
              description={`Photo gallery for ${puja.name}.`}
              cta="View Gallery"
              index={6}
            />
            <DashboardCard
              href="/admin/bhog"
              icon="Soup"
              title="Bhog"
              description="Generate and manage Navratri-day Bhog coupons for members."
              cta="Manage Bhog Coupons"
              className="col-span-2 lg:col-span-3"
              index={7}
            />
          </div>
        </Container>
      </section>
    </>
  );
}
