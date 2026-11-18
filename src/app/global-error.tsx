"use client";

import "./globals.css";

/** Last-resort error page, shown only if the main layout itself fails. */
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en-AU">
      <body className="flex min-h-dvh items-center justify-center bg-cream p-6 text-center font-sans text-ink">
        <main>
          <h1 className="text-4xl font-bold">Something went wrong</h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-ink-soft">
            Sorry, the page couldn&apos;t be loaded. Please try again.
          </p>
          <button type="button" onClick={() => retry()} className="btn btn-primary btn-lg mt-8">
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
