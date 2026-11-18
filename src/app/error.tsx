"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex flex-col items-center py-20 text-center sm:py-28">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Oops, that didn&apos;t go to plan</h1>
      <p className="mt-4 max-w-md text-lg text-ink-soft">
        Sorry about that. Please try again, and if it keeps happening, get in touch.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={() => retry()} className="btn btn-primary btn-lg">
          Try again
        </button>
        <Link href="/" className="btn btn-outline btn-lg">
          Back to home
        </Link>
      </div>
    </div>
  );
}
