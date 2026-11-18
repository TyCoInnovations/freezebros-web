import type { ReactNode } from "react";

import { PageHeader } from "@/components/ui/page-header";

interface PolicyPageProps {
  title: string;
  intro: string;
  path: string;
  children: ReactNode;
}

/** Shared layout for policy pages (shipping, privacy, terms). */
export function PolicyPage({ title, intro, path, children }: PolicyPageProps) {
  return (
    <>
      <PageHeader title={title} intro={intro} breadcrumbs={[{ name: title, path }]} />
      <div className="container-page py-12 sm:py-16">
        <div className="max-w-3xl rounded-[2rem] bg-white p-6 shadow-card sm:p-10">
          <p className="rounded-2xl bg-sun-soft px-4 py-3 text-sm text-ink">
            <strong>Template:</strong> this policy is a starting point for the Freeze Bros proof of
            concept. Please review it (ideally with a legal professional) before launch.
          </p>
          <div className="prose-fb mt-8">{children}</div>
        </div>
      </div>
    </>
  );
}
