import { membershipConfig } from "@/lib/config";

export const membershipTypeLabels: Record<string, string> = {
  individual: "Individual",
  family: "Family",
  patron: "Patron",
  lifetime: "Lifetime",
  core: "Core",
  general: "General",
};

// Registration-form membership types (data/sponsorshipPackages.ts-style: centrally editable pricing)
export const registrationMembershipTypes = [
  {
    id: "core" as const,
    name: "Core",
    price: membershipConfig.plans.core.price,
    benefits: [
      "All festival participation (Durga, Laxmi, Kali, Saraswati Puja)",
      `Up to ${membershipConfig.plans.core.familyLimit} free family members`,
      "Priority seating at cultural programs",
      "Special member recognition",
    ],
    highlight: true,
  },
  {
    id: "general" as const,
    name: "General",
    price: membershipConfig.plans.general.price,
    benefits: [
      "All festival participation (Durga, Laxmi, Kali, Saraswati Puja)",
      `Up to ${membershipConfig.plans.general.familyLimit} free family members`,
      "Community event access",
      "Member newsletter",
    ],
  },
];
