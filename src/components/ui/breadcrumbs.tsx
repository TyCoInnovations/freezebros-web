import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { ChevronRightIcon } from "@/components/ui/icons";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export interface Crumb {
  name: string;
  path: string;
}

/** Breadcrumb trail, also described to search engines as BreadcrumbList data. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail: Crumb[] = [{ name: "Home", path: "/" }, ...items];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-ink-soft">
          {trail.map((crumb, index) => {
            const isLast = index === trail.length - 1;
            return (
              <li key={crumb.path} className="flex items-center gap-1">
                {isLast ? (
                  <span aria-current="page" className="font-semibold text-ink">
                    {crumb.name}
                  </span>
                ) : (
                  <>
                    <Link
                      href={crumb.path}
                      className="rounded underline-offset-4 transition-colors hover:text-pink-strong hover:underline"
                    >
                      {crumb.name}
                    </Link>
                    <ChevronRightIcon size={14} className="text-ink-soft/60" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
