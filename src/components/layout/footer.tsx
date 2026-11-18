import { cacheLife } from "next/cache";
import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { LockIcon, MailIcon } from "@/components/ui/icons";
import { footerNav, siteConfig } from "@/config/site";

/** The current year, refreshed daily so the copyright line never goes stale. */
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  const socialLinks = Object.entries(siteConfig.social).filter(([, url]) => Boolean(url));

  return (
    <footer className="relative mt-auto overflow-hidden bg-ink text-white/75">
      <div
        aria-hidden="true"
        className="h-1.5 w-full bg-gradient-to-r from-pink via-purple to-ice"
      />
      <div className="container-page grid grid-cols-2 gap-x-6 gap-y-10 py-14 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="col-span-2 lg:col-span-1">
          <Logo inverted />
          <p className="mt-4 max-w-xs text-[0.95rem] leading-relaxed text-white/70">
            Freeze dried fruit and lollies with a seriously big crunch. Made for snacking, sharing
            and gifting.
          </p>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
          >
            <MailIcon size={16} />
            {siteConfig.contact.email}
          </a>
          {socialLinks.length > 0 ? (
            <ul className="mt-4 flex gap-3 text-sm">
              {socialLinks.map(([name, url]) => (
                <li key={name}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="capitalize text-white/80 underline-offset-4 hover:text-white hover:underline"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {footerNav.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="font-display text-base font-semibold text-white">{group.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.95rem] text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-sm text-white/65 md:flex-row md:items-center md:justify-between">
          <p>
            © <CurrentYear /> {siteConfig.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            <LockIcon size={14} />
            Secure payments powered by Stripe
          </p>
          <p>
            Website built by{" "}
            <a
              href={siteConfig.builtBy.url}
              target="_blank"
              rel="noopener"
              className="font-semibold text-white underline decoration-pink decoration-2 underline-offset-4 transition-colors hover:text-pink"
            >
              {siteConfig.builtBy.name}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
