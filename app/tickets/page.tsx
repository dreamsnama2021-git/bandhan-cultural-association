import Link from "next/link";
import { X } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import EventCard from "@/components/EventCard";
import { events } from "@/data/events";
import { pujaCategories } from "@/data/pujaCategories";

export default function TicketsPage({
  searchParams,
}: {
  searchParams: { puja?: string };
}) {
  const pujaFilter = searchParams.puja;
  const activePuja = pujaCategories.find((c) => c.id === pujaFilter);
  const filteredEvents = activePuja ? events.filter((e) => e.category === activePuja.id) : events;

  return (
    <>
      <PageHeader
        eyebrow="Tickets"
        title={activePuja ? `${activePuja.name} Tickets` : "Buy tickets for upcoming events"}
        description="Reserve your spot at our celebrations — from Durga Puja evenings to community feasts."
        crumbs={[{ label: "Tickets" }]}
      />
      <section className="section-py">
        <Container>
          {activePuja && (
            <div className="mb-8 flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-saffron-100 text-maroon-600 text-sm font-semibold px-4 py-2">
                Filtered by: {activePuja.name}
                <Link href="/tickets" aria-label="Clear filter" className="hover:text-maroon-700">
                  <X className="h-3.5 w-3.5" />
                </Link>
              </span>
            </div>
          )}
          {filteredEvents.length === 0 ? (
            <p className="text-charcoal-light">No ticketed events found for {activePuja?.name} right now.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
