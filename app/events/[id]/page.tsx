import { notFound } from "next/navigation";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/Button";
import { events, getEventById } from "@/data/events";
import { formatDate } from "@/lib/utils";
import { eventVisuals } from "@/components/eventVisuals";

export function generateStaticParams() {
  return events.map((e) => ({ id: e.id }));
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const event = getEventById(params.id);
  if (!event) notFound();

  const visual = eventVisuals[event.image] ?? eventVisuals.default;

  return (
    <>
      <PageHeader
        eyebrow="Event Details"
        title={event.name}
        crumbs={[{ label: "Events", href: "/events" }, { label: event.name }]}
      />
      <section className="section-py">
        <Container className="max-w-3xl">
          <div className={`rounded-2xl h-56 flex items-center justify-center ${visual.bg}`}>
            <visual.Icon className="h-20 w-20 text-cream/90" />
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <Info icon={CalendarDays} label="Date" value={`${formatDate(event.date)}${event.endDate ? ` – ${formatDate(event.endDate)}` : ""}`} />
            <Info icon={Clock} label="Time" value={event.time} />
            <Info icon={MapPin} label="Venue" value={event.venue} />
          </div>

          <p className="mt-8 text-charcoal-light leading-relaxed text-base">{event.description}</p>

          <div className="mt-8 flex items-center gap-2 text-sm text-charcoal-light">
            <Users className="h-4 w-4 text-saffron-600" /> {event.seatsAvailable} seats available
          </div>

          <Button href={`/tickets/${event.id}`} size="lg" className="mt-8">
            {event.ticketPriceFrom > 0 ? "Buy Tickets" : "Register for Free"}
          </Button>
        </Container>
      </section>
    </>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/70 border border-maroon-500/10 p-4">
      <div className="flex items-center gap-1.5 text-xs text-charcoal-light">
        <Icon className="h-3.5 w-3.5 text-saffron-600" /> {label}
      </div>
      <p className="mt-1 font-semibold text-charcoal">{value}</p>
    </div>
  );
}
