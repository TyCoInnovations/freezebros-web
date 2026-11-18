import { CartButton } from "@/components/layout/cart-button";
import { Logo } from "@/components/layout/logo";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { DesktopNav } from "@/components/layout/nav-links";
import { TruckIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { formatPriceShort } from "@/lib/money";

function AnnouncementBar() {
  return (
    <div role="region" aria-label="Store announcement" className="bg-ink text-white">
      <p className="container-page flex min-h-10 items-center justify-center gap-2 py-2 text-center text-sm font-medium">
        <TruckIcon size={18} className="shrink-0 text-sun" />
        <span>
          Free shipping on orders over{" "}
          <strong className="font-bold text-sun">
            {formatPriceShort(siteConfig.shipping.freeThreshold)}
          </strong>
          <span className="hidden sm:inline"> · Australia-wide delivery</span>
        </span>
      </p>
    </div>
  );
}

export function Header() {
  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/80 backdrop-blur-lg">
        <div className="container-page flex h-[4.25rem] items-center justify-between gap-4">
          <Logo />
          <DesktopNav />
          <div className="flex items-center gap-1.5">
            <CartButton />
            <MobileMenu />
          </div>
        </div>
      </header>
    </>
  );
}
