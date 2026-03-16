"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackButton({ 
  className = "", 
  href,
  label = "رجوع" 
}: { 
  className?: string; 
  href?: string;
  label?: string;
}) {
  const router = useRouter();

  const handleBack = () => {
    if (href) {
      router.push(href as any);
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className={`group gap-2 rounded-2xl px-3 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-300 ${className}`}
    >
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      <span className="text-sm font-bold">{label}</span>
    </Button>
  );
}
