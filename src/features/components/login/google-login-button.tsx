"use client";

import React from "react";

interface GoogleLoginButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

export function GoogleLoginButton({
  text = "Continue with Google",
  onClick,
  disabled,
  ...props
}: GoogleLoginButtonProps) {

    // Default behavior if no custom onClick is passed: redirect to Google OAuth
  const handleDefaultClick = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
    
    if (!clientId || !redirectUri) {
      console.error("Google Client ID or Redirect URI is missing from environment variables.");
      return;
    }

    // Construct Google OAuth 2.0 URL
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=email%20profile`;

    // Redirect user to Google sign-in
    window.location.href = googleAuthUrl;
  };

  return (
    <button
      type="button"
      onClick={handleDefaultClick}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-brav-border rounded-xl bg-brav-surface text-brav-charcoal font-sans text-sm font-semibold hover:bg-brav-white hover:border-brav-gold/40 focus:outline-none focus:ring-4 focus:ring-brav-gold/10 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
      {...props}
    >
      {/* Official Google 'G' SVG Logo */}
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.19v3.15C3.17 21.3 7.22 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.19C.43 8.1 0 9.99 0 12s.43 3.9 1.19 5.42l4.09-3.15z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.17 2.7 1.19 6.58l4.09 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
        />
      </svg>
      <span className="font-sans text-sm font-semibold">{text}</span>
    </button>
  );
}