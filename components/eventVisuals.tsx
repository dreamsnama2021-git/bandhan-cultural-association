import { Flower2, Sparkles, Flame, BookOpen, Music4, UtensilsCrossed, type LucideIcon } from "lucide-react";

interface EventVisual {
  Icon: LucideIcon;
  bg: string;
}

export const eventVisuals: Record<string, EventVisual> = {
  durga: { Icon: Flower2, bg: "bg-maroon-500" },
  laxmi: { Icon: Sparkles, bg: "bg-saffron-600" },
  kali: { Icon: Flame, bg: "bg-charcoal" },
  saraswati: { Icon: BookOpen, bg: "bg-maroon-400" },
  cultural: { Icon: Music4, bg: "bg-saffron-700" },
  feast: { Icon: UtensilsCrossed, bg: "bg-maroon-600" },
  default: { Icon: Sparkles, bg: "bg-maroon-500" },
};
