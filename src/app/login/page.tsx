// src/app/login/page.tsx

import Link from 'next/link';
import LoginForm from "@/features/components/login/login-form";

export default function LoginPage() {
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
            Welcome Back
          </h1>
          <p className="font-sans font-normal text-xs sm:text-sm text-brav-muted leading-relaxed">
            Please enter your details to access your Brav account.
          </p>
        </div>

        {/* Client Login Form */}
        <LoginForm />

      </div>

      {/* Footer Minimal Copyright */}
      <p className="mt-8 text-center text-xs text-brav-muted font-normal">
        © {new Date().getFullYear()} Brav Inc. All rights reserved.
      </p>

    </main>
  ); 
}