import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Order Placed Successfully!
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Thank you for your purchase. We are processing your order now.
      </p>

      <Link
        href="/"
        className="mt-6 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
      >
        Continue Shopping
      </Link>
    </main>
  );
}