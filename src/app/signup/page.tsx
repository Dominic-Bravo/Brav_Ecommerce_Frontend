// src/app/signup/page.tsx

'use client';

import Link from 'next/link';
import { RegisterForm } from "@/features/components/signup/signup-form";

export default function Page() {
  return (
    <main className="min-h-screen bg-brav-surface flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 font-sans selection:bg-brav-gold/20">
      
      {/* Brand Logo Header */}
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="font-display text-4xl font-semibold tracking-tight text-brav-charcoal hover:text-brav-gold transition-colors inline-block"
        >
          Brav
        </Link>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-brav-white p-8 sm:p-10 rounded-2xl border border-brav-border shadow-xl space-y-6">
        
        {/* Page Title & Subtitle */}
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl font-medium text-brav-charcoal tracking-tight">
            Create an Account
          </h1>
          <p className="font-sans font-normal text-xs sm:text-sm text-brav-muted leading-relaxed">
            Join Brav to experience curated quality and exclusive benefits.
          </p>
        </div>

        {/* Client Signup Form */}
        <RegisterForm />

        {/* Navigation link to the login page */}
        <p className="pt-2 text-center text-sm font-sans text-brav-muted border-t border-brav-border/60">
          Already have an account?{' '}
          <Link href="/login" className="text-brav-charcoal hover:text-brav-gold font-semibold transition-colors">
            Sign in
          </Link>
        </p>

      </div>

      {/* Footer Minimal Copyright */}
      <p className="mt-8 text-center text-xs text-brav-muted font-normal">
        © {new Date().getFullYear()} Brav Inc. All rights reserved.
      </p>

    </main>
  );
}