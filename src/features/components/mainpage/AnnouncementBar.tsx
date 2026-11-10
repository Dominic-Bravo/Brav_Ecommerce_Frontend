'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AnnouncementBarProps {
  message?: string;
  code?: string;
  linkHref?: string;
  linkLabel?: string;
}

export function AnnouncementBar({
  message = "Spring Sale is Live! Get 15% off your first order",
  code = "BRAV15",
  linkHref = "/shop",
  linkLabel = "Shop Now",
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-brav-dark text-brav-white py-2 px-4 text-xs font-sans relative border-b border-brav-dark/20">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center gap-2 pr-6 sm:pr-0">
        <span className="text-brav-white/90">{message}</span>
        
        {code && (
          <span className="inline-flex items-center gap-1 font-semibold text-brav-gold bg-brav-charcoal px-2 py-0.5 rounded border border-brav-gold/30">
            Use code: <code className="tracking-wide">{code}</code>
          </span>
        )}

        {linkHref && (
          <Link
            href={linkHref}
            className="underline underline-offset-4 hover:text-brav-gold font-medium transition-colors ml-1"
          >
            {linkLabel}
          </Link>
        )}
      </div>

      {/* Dismiss Button */}
      <button
        onClick={() => setIsVisible(false)}
        aria-label="Close announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brav-muted hover:text-brav-white transition-colors"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}