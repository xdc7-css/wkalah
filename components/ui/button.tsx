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
    "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses = {
    default:
      "bg-gradient-to-l from-violet-600 to-indigo-500 text-white shadow-sm hover:opacity-95",
    outline:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    destructive:
      "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
    ghost:
      "text-slate-700 hover:bg-slate-100",
  };

  const sizeClasses = {
    default: "h-11 px-4 py-2 text-sm",
    sm: "h-9 px-3 py-2 text-sm",
    lg: "h-12 px-5 py-3 text-base",
    icon: "h-10 w-10",
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