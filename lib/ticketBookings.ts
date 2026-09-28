// Ticket bookings per member. A signed-in member gets one free ticket for
// themselves plus one for each family member, per event; anything beyond
// that is paid. Stored in localStorage like the other transactional records.

export interface TicketBooking {
  id: string;
  memberEmail: string;
  eventId: string;
  ticketTypeName: string;
  freeQuantity: number;
  paidQuantity: number;
  amount: number;
  orderId: string;
  bookedOn: string;
}

const STORAGE_KEY = "bca_ticket_bookings";

export function readTicketBookings(): TicketBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TicketBooking[]) : [];
  } catch {
    return [];
  }
}

export function addTicketBooking(booking: Omit<TicketBooking, "id" | "bookedOn">) {
  if (typeof window === "undefined") return;
  const next: TicketBooking[] = [
    ...readTicketBookings(),
    { ...booking, id: `tk-${Date.now()}`, bookedOn: new Date().toISOString() },
  ];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

// Number of free tickets a member is entitled to for one event: self + family.
export function freeTicketAllowance(familyMemberCount: number): number {
  return 1 + familyMemberCount;
}

export function freeTicketsUsed(memberEmail: string, eventId: string): number {
  return readTicketBookings()
    .filter((b) => b.eventId === eventId && b.memberEmail.toLowerCase() === memberEmail.toLowerCase())
    .reduce((sum, b) => sum + b.freeQuantity, 0);
}
