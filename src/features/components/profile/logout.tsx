"use client";

import React from "react";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { LogOut, Loader2 } from "lucide-react";

export interface LogoutButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function LogoutButton({
  variant = "danger",
  size = "md",
  showIcon = true,
  className = "",
  children,
  ...props
}: LogoutButtonProps) {
  const { logout, isPending } = useLogout();

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick?.(e);

    const refreshToken =
      typeof window !== "undefined"
        ? localStorage.getItem("refresh_token") || ""
        : "";

    logout({ refresh: refreshToken });
  };

  // Base luxury styling
  const baseStyles =
    "inline-flex items-center justify-center font-sans font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  // Size variants
  const sizeStyles = {
    sm: "px-3 py-1.5 text-[11px] gap-1.5",
    md: "px-4 py-2.5 text-xs gap-2",
    lg: "px-6 py-3 text-sm gap-2.5",
  };

  // Brav Color variants
  const variantStyles = {
    danger:
      "bg-rose-50/80 hover:bg-rose-100/80 text-rose-700 border border-rose-200/80 focus:ring-rose-200/50 shadow-xs",
    outline:
      "bg-brav-surface hover:bg-brav-white text-brav-charcoal border border-brav-border hover:border-brav-gold/40 focus:ring-brav-gold/10 shadow-xs",
    ghost:
      "bg-transparent text-brav-muted hover:text-brav-charcoal hover:bg-brav-surface focus:ring-brav-gold/10",
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending || props.disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
      ) : (
        showIcon && <LogOut className="w-3.5 h-3.5 text-current" />
      )}
      <span>
        {isPending ? "Logging out..." : children || "Log Out"}
      </span>
    </button>
  );
}