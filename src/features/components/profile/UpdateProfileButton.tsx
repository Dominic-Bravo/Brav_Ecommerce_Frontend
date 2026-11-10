"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Edit3 } from "lucide-react";

export interface UpdateProfileButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function UpdateProfileButton({
  size = "md",
  showIcon = true,
  className = "",
  children,
  ...props
}: UpdateProfileButtonProps) {
  const router = useRouter();

  const handleUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick?.(e);
    router.push("/profile/edit");
  };

  const baseStyles =
    "inline-flex items-center justify-center font-sans font-semibold rounded-xl bg-brav-gold text-brav-white hover:bg-brav-gold/90 transition-all duration-200 shadow-xs focus:outline-none focus:ring-4 focus:ring-brav-gold/20 active:scale-[0.98]";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-[11px] gap-1.5",
    md: "px-5 py-2.5 text-xs sm:text-sm gap-2",
    lg: "px-6 py-3.5 text-sm gap-2.5",
  };

  return (
    <button
      type="button"
      onClick={handleUpdate}
      className={`${baseStyles} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {showIcon && <Edit3 className="w-3.5 h-3.5" />}
      <span>{children || "Update Profile"}</span>
    </button>
  );
}