import PageHeader from "@/components/PageHeader";
import Container from "@/components/Container";
import DashboardCard from "@/components/DashboardCard";

export default function GuestPage() {
  return (
    <>
      <PageHeader
        eyebrow="Guest"
        title="Explore Bandhan Cultural Association"
        description="Browse sponsorships, stalls, tickets and the puja calendar. Register as a member to view your profile and photo galleries."
      />

      <section className="section-py">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            <DashboardCard
              href="/register"
              icon="UserCircle"
              title="Profile"
              description="Register as a member to create and view your profile."
              cta="Register to Continue"
              index={0}
            />
            <DashboardCard
              href="/sponsorship/business"
              icon="Building2"
              title="Business Sponsor"
              description="Business sponsorships received for the association."
              cta="View Sponsors"
              index={1}
            />
            <DashboardCard
              href="/stalls"
              icon="Store"
              title="Stall Space"
              description="Festival stall inventory and booking status."
              cta="View Stalls"
              index={2}
            />
            <DashboardCard
              href="/sponsorship/individual"
              icon="HeartHandshake"
              title="Individual Sponsor"
              description="Individual contributions received."
              cta="View Sponsors"
              index={3}
            />
            <DashboardCard
              href="/tickets"
              icon="Ticket"
              title="Tickets"
              description="Ticket sales for upcoming events."
              cta="View Tickets"
              index={4}
            />
            <DashboardCard
              href="/events"
              icon="CalendarDays"
              title="Pooja Calendar"
              description="Full puja event schedule."
              cta="View Calendar"
              index={5}
            />
            <DashboardCard
              href="/register"
              icon="Images"
              title="View Images"
              description="Register as a member to view the photo gallery."
              cta="Register to Continue"
              index={6}
            />
          </div>
        </Container>
      </section>
    </>
  );
}
