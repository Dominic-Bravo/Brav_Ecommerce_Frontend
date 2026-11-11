import Link from "next/link";

export function OrderSuccessIllustration({ className = "w-48 h-48" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="120" cy="120" r="90" fill="#C5A880" fillOpacity="0.1" />
      <circle
        cx="120"
        cy="120"
        r="75"
        stroke="#C5A880"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        opacity="0.5"
      />
      <circle cx="120" cy="120" r="55" fill="#111827" />
      <path
        d="M97 120L111 134L145 100"
        stroke="#C5A880"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M60 70C60 75 55 78 50 78C55 78 60 81 60 86C60 81 65 78 70 78C65 78 60 75 60 70Z"
        fill="#C5A880"
      />
      <circle cx="180" cy="80" r="4" fill="#C5A880" />
      <path
        d="M175 165C175 169 171 171 167 171C171 171 175 173 175 177C175 173 179 171 183 171C179 171 175 169 175 165Z"
        fill="#C5A880"
      />
      <circle cx="70" cy="160" r="3" stroke="#111827" strokeWidth="2" />
    </svg>
  );
}

export default function OrderSuccessPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center p-6 text-center font-sans">
      <OrderSuccessIllustration className="w-32 h-32 mb-6" />

      <span className="text-xs font-semibold tracking-wider text-brav-gold uppercase mb-1">
        Transaction Complete
      </span>
      <h1 className="font-display text-3xl font-medium tracking-tight text-brav-charcoal">
        Order Placed Successfully!
      </h1>
      <p className="mt-2 text-sm text-brav-muted max-w-sm">
        Thank you for your purchase. We have received your order and are processing it now.
      </p>

      <Link
        href="/"
        className="mt-8 px-6 py-3 rounded-xl bg-brav-charcoal text-brav-white text-xs font-semibold shadow-sm hover:bg-brav-dark transition-colors"
      >
        Continue Shopping
      </Link>
    </main>
  );
}