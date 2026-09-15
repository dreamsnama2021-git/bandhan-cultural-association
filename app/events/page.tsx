import Link from "next/link";
import { X } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import EventCard from "@/components/EventCard";
import { events } from "@/data/events";
import { pujaCategories } from "@/data/pujaCategories";
import { formatDateShort } from "@/lib/utils";

export default function EventsPage({
  searchParams,
}: {
  searchParams: { puja?: string };
}) {
  const pujaFilter = searchParams.puja;
  const activePuja = pujaCategories.find((c) => c.id === pujaFilter);
  const filtered = activePuja ? events.filter((e) => e.category === activePuja.id) : events;
  const sorted = [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <>
      <PageHeader
        eyebrow="Event / Calendar"
        title={activePuja ? `${activePuja.name} Calendar` : "Upcoming events & festival dates"}
        description="Every Puja, cultural evening and community gathering — all in one calendar."
        crumbs={[{ label: "Events" }]}
      />

      <section className="section-py">
        <Container>
          {activePuja && (
            <div className="mb-8 flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-saffron-100 text-maroon-600 text-sm font-semibold px-4 py-2">
                Filtered by: {activePuja.name}
                <Link href="/events" aria-label="Clear filter" className="hover:text-maroon-700">
                  <X className="h-3.5 w-3.5" />
                </Link>
              </span>
            </div>
          )}

          {sorted.length === 0 ? (
            <p className="text-charcoal-light">No events found for {activePuja?.name} right now.</p>
          ) : (
            <>
              <div className="rounded-2xl bg-beige-light border border-beige-dark p-6 mb-12 overflow-x-auto">
                <div className="flex gap-4 min-w-max">
                  {sorted.map((event) => (
                    <div key={event.id} className="flex flex-col items-center rounded-xl bg-white/80 px-5 py-4 min-w-[110px] border border-maroon-500/10">
                      <span className="text-xs font-semibold text-saffron-700 uppercase">{formatDateShort(event.date)}</span>
                      <span className="mt-2 text-xs text-center text-charcoal-light leading-snug">{event.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sorted.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
              </div>
            </>
          )}
        </Container>
      </section>
    </>
  );
}
