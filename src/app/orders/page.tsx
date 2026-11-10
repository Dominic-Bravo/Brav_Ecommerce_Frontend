"use client";

import { useAuthSession } from "@/features/auth/providers/auth-provider";
import { OrderManagement } from "@/features/components/orders/OrderList";
import Link from "next/link";

export default function Page() {
    const { isAuthenticated, isInitialized } = useAuthSession();

    // 1. Show a quick loading state while checking the session on first load
    if (!isInitialized) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center font-sans">
                <div className="flex items-center gap-3 bg-brav-surface px-6 py-4 rounded-xl border border-brav-border shadow-xs">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-brav-gold border-t-transparent" />
                    <p className="text-sm font-medium text-brav-charcoal">Loading session...</p>
                </div>
            </div>
        );
    }

    // 2. If the user is NOT authenticated, show the login/signup prompt
    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4 font-sans selection:bg-brav-gold/20">
                <div className="max-w-md bg-brav-white p-8 rounded-2xl border border-brav-border shadow-xl space-y-4">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brav-gold">
                        Authentication Required
                    </span>
                    <h1 className="font-display text-3xl font-medium text-brav-charcoal tracking-tight">
                        Access Restricted
                    </h1>
                    <p className="text-xs sm:text-sm text-brav-muted leading-relaxed">
                        You need to be logged in to view and manage orders. Please log in or sign up to continue.
                    </p>
                    <div className="flex justify-center gap-3 pt-2">
                        <Link
                            href="/login"
                            className="px-6 py-2.5 bg-brav-charcoal hover:bg-brav-dark text-brav-white font-semibold text-xs rounded-xl shadow-md transition-all"
                        >
                            Log In
                        </Link>
                        <Link
                            href="/signup"
                            className="px-6 py-2.5 bg-brav-surface hover:bg-brav-white text-brav-charcoal font-semibold text-xs rounded-xl border border-brav-border transition-all"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // 3. If authenticated, render the protected order management component
    return <OrderManagement />;
}