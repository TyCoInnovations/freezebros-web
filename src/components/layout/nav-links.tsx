"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

import { mainNav } from "@/config/site";
import { cn } from "@/lib/cn";

interface NavListProps {
  /** The current page's path, used to highlight its link. */
  activePath?: string;
  onNavigate?: () => void;
}

function DesktopNavList({ activePath }: NavListProps) {
  return (
    <ul className="flex items-center gap-1">
      {mainNav.map((item) => {
        const active = activePath === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative rounded-full px-4 py-2 text-[0.95rem] font-semibold transition-colors",
                active ? "bg-pink-soft text-pink-deep" : "text-ink hover:bg-ink/5",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function MobileNavList({ activePath, onNavigate }: NavListProps) {
  return (
    <ul className="space-y-1">
      {mainNav.map((item) => {
        const active = activePath === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-xl font-semibold transition-colors",
                active ? "bg-pink-soft text-pink-deep" : "text-ink hover:bg-ink/5",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function ActiveDesktopNavList() {
  return <DesktopNavList activePath={usePathname()} />;
}

function ActiveMobileNavList({ onNavigate }: { onNavigate: () => void }) {
  return <MobileNavList activePath={usePathname()} onNavigate={onNavigate} />;
}

/*
 * The active link depends on the URL, which isn't known ahead of time for
 * every page. The Suspense fallbacks render the same links (just without the
 * highlight) so the rest of the page can always be prerendered.
 */

export function DesktopNav() {
  return (
    <nav aria-label="Main" className="hidden lg:block">
      <Suspense fallback={<DesktopNavList />}>
        <ActiveDesktopNavList />
      </Suspense>
    </nav>
  );
}

export function MobileNavLinks({ onNavigate }: { onNavigate: () => void }) {
  return (
    <Suspense fallback={<MobileNavList onNavigate={onNavigate} />}>
      <ActiveMobileNavList onNavigate={onNavigate} />
    </Suspense>
  );
}
