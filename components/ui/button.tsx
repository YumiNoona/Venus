"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-primary text-black hover:brightness-110 active:scale-[0.98]",
    secondary: "bg-surface text-text hover:bg-surface-hover active:scale-[0.98] border border-border",
    ghost: "bg-transparent text-text hover:bg-bg-soft active:scale-[0.98]",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 active:scale-[0.98] border border-red-500/20",
    outline: "bg-transparent border border-border text-text hover:bg-bg-soft"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
