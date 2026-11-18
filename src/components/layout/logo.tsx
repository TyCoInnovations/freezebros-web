import Link from "next/link";
import { useId } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

/** The Freeze Bros snowflake mark (same artwork as the favicon). */
export function LogoMark({ size = 40, className }: { size?: number; className?: string }) {
  const gradientId = `logo-gradient-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <svg
      viewBox="0 0 512 512"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff2e7e" />
          <stop offset=".55" stopColor="#9b3cf0" />
          <stop offset="1" stopColor="#2f8bff" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="120" fill={`url(#${gradientId})`} />
      <g
        transform="translate(256 262)"
        fill="none"
        stroke="#fff"
        strokeWidth="36"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M0-148V148M128.2-74-128.2 74M128.2 74-128.2-74" />
        <path d="M-44-128 0-88 44-128M88.9-102.1 76.2-44 132.9-25.9M132.9 25.9 76.2 44 88.9 102.1M44 128 0 88-44 128M-88.9 102.1-76.2 44-132.9 25.9M-132.9-25.9-76.2-44-88.9-102.1" />
      </g>
      <path
        d="M404 76c4 26 16 38 42 42-26 4-38 16-42 42-4-26-16-38-42-42 26-4 38-16 42-42Z"
        fill="#ffd23f"
      />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  /** Light text for dark backgrounds. */
  inverted?: boolean;
}

export function Logo({ className, inverted = false }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} home`}
      className={cn("group inline-flex items-center gap-2.5 rounded-xl", className)}
    >
      <LogoMark
        size={40}
        className="transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-105"
      />
      <span
        className={cn(
          "font-display text-[1.45rem] leading-none font-bold tracking-tight",
          inverted ? "text-white" : "text-ink",
        )}
      >
        Freeze <span className={inverted ? "text-pink" : "text-pink-strong"}>Bros</span>
      </span>
    </Link>
  );
}
