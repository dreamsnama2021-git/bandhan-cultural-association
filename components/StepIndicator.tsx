import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StepIndicator({
  steps,
  currentStep,
}: {
  steps: string[];
  currentStep: number;
}) {
  return (
    <ol className="flex items-center w-full overflow-x-auto pb-1" aria-label="Progress">
      {steps.map((step, i) => {
        const isDone = i < currentStep;
        const isActive = i === currentStep;
        return (
          <li key={step} className="flex items-center flex-1 min-w-[110px] last:flex-none last:min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  isDone && "bg-maroon-500 text-cream",
                  isActive && "bg-saffron-500 text-charcoal",
                  !isDone && !isActive && "bg-charcoal/10 text-charcoal-light"
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-xs sm:text-sm font-semibold whitespace-nowrap",
                  isActive ? "text-maroon-500" : isDone ? "text-charcoal" : "text-charcoal-light"
                )}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span className={cn("mx-3 h-px flex-1 min-w-[16px]", isDone ? "bg-maroon-500" : "bg-charcoal/10")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
