"use client";

import { MinusIcon, PlusIcon } from "@/components/ui/icons";
import { MAX_QUANTITY } from "@/lib/cart";
import { cn } from "@/lib/cn";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  /** Accessible name for the control, e.g. "Quantity for Mango Chunks". */
  label: string;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}

/**
 * A simple − / + quantity control. Buttons use aria-disabled (rather than
 * disabled) at the limits so keyboard focus never gets lost.
 */
export function QuantityStepper({
  value,
  onChange,
  label,
  min = 1,
  max = MAX_QUANTITY,
  size = "md",
  className,
}: QuantityStepperProps) {
  const atMin = value <= min;
  const atMax = value >= max;
  const buttonSize = size === "sm" ? "size-9" : "size-11";

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-center rounded-full bg-white p-0.5 ring-2 ring-ink/10",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        aria-disabled={atMin}
        onClick={() => {
          if (!atMin) onChange(value - 1);
        }}
        className={cn(
          "inline-flex items-center justify-center rounded-full text-ink transition-colors",
          "hover:bg-ink/5 aria-disabled:cursor-not-allowed aria-disabled:opacity-35 aria-disabled:hover:bg-transparent",
          buttonSize,
        )}
      >
        <MinusIcon size={size === "sm" ? 16 : 18} />
      </button>
      <output
        aria-live="polite"
        className={cn(
          "min-w-8 text-center font-bold tabular-nums",
          size === "sm" ? "text-sm" : "text-base",
        )}
      >
        <span className="sr-only">Quantity: </span>
        {value}
      </output>
      <button
        type="button"
        aria-label="Increase quantity"
        aria-disabled={atMax}
        onClick={() => {
          if (!atMax) onChange(value + 1);
        }}
        className={cn(
          "inline-flex items-center justify-center rounded-full text-ink transition-colors",
          "hover:bg-ink/5 aria-disabled:cursor-not-allowed aria-disabled:opacity-35 aria-disabled:hover:bg-transparent",
          buttonSize,
        )}
      >
        <PlusIcon size={size === "sm" ? 16 : 18} />
      </button>
    </div>
  );
}
