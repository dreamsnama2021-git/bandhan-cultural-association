"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CalendarDays, MapPin, Clock, Users } from "lucide-react";
import type { EventItem } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { eventVisuals } from "@/components/eventVisuals";

export default function EventCard({ event, index = 0 }: { event: EventItem; index?: number }) {
  const visual = eventVisuals[event.image] ?? eventVisuals.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
      className="group flex flex-col h-full rounded-2xl overflow-hidden bg-white/70 border border-maroon-500/10 shadow-card hover:shadow-card-hover transition-shadow"
    >
      <div className={`relative h-40 flex items-center justify-center ${visual.bg}`}>
        <visual.Icon className="h-14 w-14 text-cream/90" />
        {event.featured && (
          <span className="absolute top-3 left-3 bg-saffron-500 text-charcoal text-xs font-bold px-3 py-1 rounded-full">
            FEATURED
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-semibold text-maroon-500">{event.name}</h3>
        <div className="mt-3 space-y-1.5 text-sm text-charcoal-light">
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-saffron-600 shrink-0" />
            {formatDate(event.date)}
            {event.endDate ? ` – ${formatDate(event.endDate)}` : ""}
          </p>
          <p className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-saffron-600 shrink-0" />
            {event.time}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-saffron-600 shrink-0" />
            {event.venue}
          </p>
          <p className="flex items-center gap-2">
            <Users className="h-4 w-4 text-saffron-600 shrink-0" />
            {event.seatsAvailable} seats available
          </p>
        </div>
        <p className="mt-3 text-sm text-charcoal-light leading-relaxed line-clamp-2">
          {event.description}
        </p>
        <div className="mt-5 pt-5 border-t border-maroon-500/10 flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-charcoal">
            {event.ticketPriceFrom > 0 ? `From ${formatCurrency(event.ticketPriceFrom)}` : "Free entry"}
          </span>
          <Link
            href={`/tickets/${event.id}`}
            className="text-sm font-semibold text-maroon-600 hover:text-maroon-700 focus-ring rounded"
          >
            Buy Ticket &rarr;
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
