import type { ReactNode } from "react";

import { SparkleIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  /** id for the heading, so the section can be labelled by it. */
  id?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-2xl", className)}>
      {eyebrow ? (
        <p className="eyebrow">
          <SparkleIcon size={14} />
          {eyebrow}
        </p>
      ) : null}
      <h2 id={id} className="mt-2 text-3xl font-bold sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {description ? <p className="mt-3 text-lg text-ink-soft">{description}</p> : null}
    </div>
  );
}
