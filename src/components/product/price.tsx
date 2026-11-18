import { formatPrice } from "@/lib/money";
import { cn } from "@/lib/cn";

interface PriceProps {
  amount: number;
  compareAt?: number;
  className?: string;
}

/** Shows a price, plus the old price crossed out when it's on sale. */
export function Price({ amount, compareAt, className }: PriceProps) {
  const onSale = typeof compareAt === "number" && compareAt > amount;
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className="font-bold tabular-nums">{formatPrice(amount)}</span>
      {onSale ? (
        <span className="text-sm font-medium text-ink-soft line-through tabular-nums">
          <span className="sr-only">Was </span>
          {formatPrice(compareAt)}
        </span>
      ) : null}
    </span>
  );
}
