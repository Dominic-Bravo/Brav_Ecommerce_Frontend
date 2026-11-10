// src/features/auth/components/login-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useV1UsersLoginCreate } from '@/api/generated/endpoints/authentication/authentication';
import { tokenStore } from '@/features/auth/lib/token-store';
import { useAuthSession } from '@/features/auth/providers/auth-provider';
import Link from 'next/link';
import { GoogleLoginButton } from './google-login-button';

export default function LoginForm() {
  const router = useRouter();
  const { setAuthenticated } = useAuthSession();

  const loginMutation = useV1UsersLoginCreate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = () => {
    // TODO: Trigger your Google OAuth redirect or Firebase/NextAuth login handler here
    console.log("Google login clicked");
  }; 

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await loginMutation.mutateAsync({
        data: {
          email: email.trim(),
          password,
        },
      });

      // Store the access token.
      tokenStore.setAccessToken(response.access);

      // Update the authentication state.
      setAuthenticated(true);

      // Navigate to profile.
      router.replace('/profile');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

return (
  <div className="w-full max-w-md mx-auto">
    <form onSubmit={handleLogin} className="space-y-5 font-sans">
      
      {/* Email Field */}
      <div className="space-y-1.5">
        <label 
          htmlFor="email" 
          className="block text-xs font-semibold uppercase tracking-wider text-brav-charcoal/80"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          placeholder="name@example.com"
          className="w-full rounded-xl border border-brav-border bg-brav-surface px-4 py-3 text-sm text-brav-charcoal placeholder:text-brav-muted focus:border-brav-gold focus:bg-brav-white focus:outline-none focus:ring-4 focus:ring-brav-gold/10 transition-all duration-200"
        />
      </div>

      {/* Password Field */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label 
            htmlFor="password" 
            className="block text-xs font-semibold uppercase tracking-wider text-brav-charcoal/80"
          >
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-brav-gold hover:underline transition-colors"
          >
            Forgot?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="w-full rounded-xl border border-brav-border bg-brav-surface px-4 py-3 text-sm text-brav-charcoal placeholder:text-brav-muted focus:border-brav-gold focus:bg-brav-white focus:outline-none focus:ring-4 focus:ring-brav-gold/10 transition-all duration-200"
        />
      </div>

      {/* Error Alert */}
      {loginMutation.isError && (
        <div className="rounded-xl border border-red-200 bg-red-50/70 p-3.5 text-xs text-red-700 flex items-start gap-2.5">
          <svg className="w-4 h-4 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p role="alert" className="font-medium leading-relaxed">
            Unable to log in. Please check your email and password.
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full flex items-center justify-center rounded-xl bg-brav-charcoal px-4 py-3 text-sm font-semibold text-brav-white shadow-md shadow-brav-charcoal/10 hover:bg-brav-dark focus:outline-none focus:ring-4 focus:ring-brav-gold/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {loginMutation.isPending ? (
          <span className="flex items-center space-x-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-brav-gold border-t-transparent" />
            <span>Signing in...</span>
          </span>
        ) : (
          'Sign In'
        )}
      </button>

    </form>

    {/* Divider */}
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-brav-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase tracking-wider font-sans">
        <span className="bg-brav-white px-3 text-brav-muted font-medium">Or continue with</span>
      </div>
    </div>

    {/* Google Login Button Container */}
    <div className="w-full">
      <GoogleLoginButton onClick={handleGoogleLogin} />
    </div>

    {/* Navigation link to the signup page */}
    <p className="mt-8 text-center text-sm font-sans text-brav-muted">
      Don&apos;t have an account?{' '}
      <Link href="/signup" className="text-brav-charcoal hover:text-brav-gold font-semibold transition-colors">
        Sign up
      </Link>
    </p>
  </div>
);
}