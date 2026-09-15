import type { EventItem, TicketTypeOption } from "@/types";

export const events: EventItem[] = [
  {
    id: "evt-durga-puja-2026",
    slug: "durga-puja-2026",
    name: "Durga Puja Celebrations",
    category: "durga-puja",
    date: "2026-10-17",
    endDate: "2026-10-20",
    time: "10:00 AM – 10:00 PM",
    venue: "Bandhan Community Grounds, Kolkata",
    description:
      "Four days of pandal hopping, cultural evenings, community feasting and the grand sindoor khela on Dashami. Our biggest celebration of the year.",
    image: "durga",
    ticketPriceFrom: 100,
    seatsAvailable: 420,
    featured: true,
  },
  {
    id: "evt-cultural-evening-oct",
    slug: "cultural-evening-october",
    name: "Cultural Evening — Music & Dance",
    category: "cultural-program",
    date: "2026-10-18",
    time: "6:30 PM – 9:30 PM",
    venue: "BCA Main Stage",
    description:
      "An evening of classical and folk performances by community artists, followed by a youth dance showcase.",
    image: "cultural",
    ticketPriceFrom: 150,
    seatsAvailable: 180,
  },
  {
    id: "evt-laxmi-puja-2026",
    slug: "laxmi-puja-2026",
    name: "Laxmi Puja",
    category: "laxmi-puja",
    date: "2026-10-25",
    time: "5:00 PM – 9:00 PM",
    venue: "Bandhan Community Hall",
    description:
      "A warm, intimate evening of prayer, prasad and prosperity — celebrated together as one association family.",
    image: "laxmi",
    ticketPriceFrom: 0,
    seatsAvailable: 150,
  },
  {
    id: "evt-kali-puja-2026",
    slug: "kali-puja-2026",
    name: "Kali Puja",
    category: "kali-puja",
    date: "2026-11-08",
    time: "7:00 PM – 12:00 AM",
    venue: "Bandhan Community Grounds",
    description:
      "An evening of devotion, lights and community gathering, with midnight aarti and prasad distribution.",
    image: "kali",
    ticketPriceFrom: 0,
    seatsAvailable: 300,
  },
  {
    id: "evt-community-feast",
    slug: "community-winter-feast",
    name: "Community Winter Feast",
    category: "community",
    date: "2026-12-13",
    time: "1:00 PM – 4:00 PM",
    venue: "Bandhan Community Hall",
    description:
      "Our annual winter get-together — a community lunch with games for children and a felicitation ceremony for long-standing members.",
    image: "feast",
    ticketPriceFrom: 250,
    seatsAvailable: 220,
  },
  {
    id: "evt-saraswati-puja-2027",
    slug: "saraswati-puja-2027",
    name: "Saraswati Puja",
    category: "saraswati-puja",
    date: "2027-01-23",
    time: "9:00 AM – 1:00 PM",
    venue: "Bandhan Community Hall",
    description:
      "Honouring knowledge and the arts with morning offerings and a youth-led cultural programme, followed by khichuri prasad.",
    image: "saraswati",
    ticketPriceFrom: 0,
    seatsAvailable: 200,
  },
];

export const ticketTypesByEvent: Record<string, TicketTypeOption[]> = {
  "evt-durga-puja-2026": [
    { id: "general", name: "General Entry", price: 100, description: "Access to all four days of the celebration.", perks: ["Pandal entry", "Cultural program seating (open)"] },
    { id: "family-pass", name: "Family Pass (4)", price: 320, description: "Discounted entry for a family of four.", perks: ["Pandal entry for 4", "Reserved family seating"] },
    { id: "vip", name: "VIP Pass", price: 500, description: "Priority entry and reserved seating for cultural evenings.", perks: ["Priority pandal entry", "Reserved front seating", "Complimentary prasad box"] },
  ],
  "evt-cultural-evening-oct": [
    { id: "general", name: "General Seating", price: 150, description: "Open seating for the full evening program.", perks: ["Full program access"] },
    { id: "premium", name: "Premium Seating", price: 300, description: "Reserved seats closer to the stage.", perks: ["Reserved seating", "Complimentary refreshments"] },
  ],
  "evt-community-feast": [
    { id: "adult", name: "Adult Plate", price: 250, description: "Full community lunch for one adult.", perks: ["Lunch", "Entry to games & felicitation"] },
    { id: "child", name: "Child Plate (under 12)", price: 120, description: "Full community lunch for one child.", perks: ["Lunch", "Entry to games"] },
  ],
};

export function getEventById(id: string) {
  return events.find((e) => e.id === id);
}

export function getEventBySlug(slug: string) {
  return events.find((e) => e.slug === slug);
}
