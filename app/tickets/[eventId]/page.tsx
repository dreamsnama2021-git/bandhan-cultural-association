import { notFound } from "next/navigation";
import { events, getEventById } from "@/data/events";
import TicketFlow from "./TicketFlow";

export function generateStaticParams() {
  return events.map((e) => ({ eventId: e.id }));
}

export default function TicketPurchasePage({ params }: { params: { eventId: string } }) {
  const event = getEventById(params.eventId);
  if (!event) notFound();

  return <TicketFlow event={event} />;
}
