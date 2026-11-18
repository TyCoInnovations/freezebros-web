"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type MouseEvent, type PointerEvent } from "react";

import { MobileNavLinks } from "@/components/layout/nav-links";
import { CloseIcon, MenuIcon, TruckIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { formatPriceShort } from "@/lib/money";
import { rememberScrollbarWidth } from "@/lib/scroll-lock";

const secondaryLinks = [
  { href: "/shipping-returns", label: "Shipping & returns" },
  { href: "/contact", label: "Contact us" },
];

/** Hamburger menu for phones and tablets, built on the native <dialog>. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pointerDownOnBackdrop = useRef(false);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      rememberScrollbarWidth();
      dialog.showModal();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Close the menu if the screen grows to desktop size while it's open.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  const close = () => setOpen(false);

  function handlePointerDown(event: PointerEvent<HTMLDialogElement>) {
    pointerDownOnBackdrop.current = event.target === event.currentTarget;
  }
  function handleClick(event: MouseEvent<HTMLDialogElement>) {
    if (pointerDownOnBackdrop.current && event.target === event.currentTarget) close();
    pointerDownOnBackdrop.current = false;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="icon-btn lg:hidden"
        aria-label="Open menu"
        aria-haspopup="dialog"
      >
        <MenuIcon size={24} />
      </button>

      <dialog
        ref={dialogRef}
        className="drawer drawer-left"
        aria-labelledby={titleId}
        onClose={close}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
            <h2 id={titleId} className="text-xl font-semibold">
              Menu
            </h2>
            <button type="button" onClick={close} className="icon-btn -mr-2" aria-label="Close menu">
              <CloseIcon size={22} />
            </button>
          </div>

          <nav aria-label="Main" className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
            <MobileNavLinks onNavigate={close} />

            <ul className="mt-4 space-y-1 border-t border-ink/10 pt-4">
              {secondaryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className="block rounded-2xl px-4 py-3 font-semibold text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-3 border-t border-ink/10 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <p className="flex items-center gap-2 rounded-2xl bg-sun-soft px-4 py-3 text-sm font-semibold">
              <TruckIcon size={18} className="shrink-0" />
              Free shipping on orders over {formatPriceShort(siteConfig.shipping.freeThreshold)}
            </p>
            <Link href="/shop" onClick={close} className="btn btn-primary w-full">
              Shop all treats
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
