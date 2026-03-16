import * as React from "react";
import Link from "next/link";
import type { Route } from "next";

type Variant = "default" | "outline" | "destructive" | "ghost";
type Size = "default" | "sm" | "lg" | "icon";

function getButtonClasses(
  variant: Variant = "default",
  size: Size = "default"
) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-[20px] font-black transition-all duration-300 relative overflow-hidden whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none active:scale-95";

  const variantClasses = {
    default:
      "bg-accent text-accent-foreground shadow-[0_10px_30px_rgba(var(--accent-rgb),0.2)] hover:shadow-[0_15px_40px_rgba(var(--accent-rgb),0.3)] hover:-translate-y-0.5 border border-accent/20",
    outline:
      "border border-border bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground",
    destructive:
      "bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-500 hover:bg-red-500/20",
    ghost:
      "text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
  };

  const sizeClasses = {
    default: "h-12 px-6 py-2 text-sm",
    sm: "h-10 px-4 py-2 text-xs",
    lg: "h-14 px-8 py-3 text-base shadow-lg",
    icon: "h-11 w-11",
  };

  return `${base} ${variantClasses[variant]} ${sizeClasses[size]}`;
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  className = "",
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${getButtonClasses(variant, size)} ${className}`}
      {...props}
    />
  );
}

type ButtonLinkProps = {
  href: Route;
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
};

export function ButtonLink({
  href,
  children,
  className = "",
  variant = "default",
  size = "default",
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`${getButtonClasses(variant, size)} ${className}`}
    >
      {children}
    </Link>
  );
}

export function buttonVariants({
  variant = "default",
  size = "default",
  className = "",
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return `${getButtonClasses(variant, size)} ${className}`;
}