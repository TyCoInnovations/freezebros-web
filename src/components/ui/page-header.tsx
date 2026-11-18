import type { ReactNode } from "react";

import { Breadcrumbs, type Crumb } from "@/components/ui/breadcrumbs";

interface PageHeaderProps {
  title: ReactNode;
  intro?: ReactNode;
  breadcrumbs: Crumb[];
  children?: ReactNode;
}

/** Colourful title band used at the top of inner pages. */
export function PageHeader({ title, intro, breadcrumbs, children }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-ink/5 bg-gradient-to-br from-pink-soft via-cream to-ice-soft">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-sun/30 blur-3xl"
      />
      <div className="container-page relative py-10 sm:py-14">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">{title}</h1>
        {intro ? <p className="mt-3 max-w-2xl text-lg text-ink-soft">{intro}</p> : null}
        {children}
      </div>
    </section>
  );
}
