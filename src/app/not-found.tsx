import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-16 text-center sm:py-24">
      <div className="relative size-44 sm:size-52">
        <div aria-hidden="true" className="absolute inset-4 rounded-full bg-gradient-to-br from-pink via-purple to-ice opacity-90" />
        <Image
          src="/images/stickers/marshmallow.svg"
          alt=""
          aria-hidden="true"
          width={240}
          height={240}
          className="relative h-auto w-full -rotate-12"
        />
      </div>
      <p className="eyebrow mt-8">Error 404</p>
      <h1 className="mt-2 text-4xl font-bold sm:text-5xl">This page has melted away</h1>
      <p className="mt-4 max-w-md text-lg text-ink-soft">
        We couldn&apos;t find the page you were looking for. It may have moved, or the link might be
        wrong.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/shop" className="btn btn-primary btn-lg">
          Shop all treats
          <ArrowRightIcon size={20} />
        </Link>
        <Link href="/" className="btn btn-outline btn-lg">
          Back to home
        </Link>
      </div>
    </div>
  );
}
