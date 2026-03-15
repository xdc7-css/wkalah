"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getItemIcon } from "@/lib/item-icons";

interface ItemIconProps {
  name: string;
  size?: number;
  className?: string;
  fallbackSrc?: string;
}

export function ItemIcon({
  name,
  size = 24,
  className,
  fallbackSrc = "/icons/items/default.png"
}: ItemIconProps) {
  // Use a unique name for the local state to avoid any potential collision myths
  const [currentSrc, setCurrentSrc] = useState(getItemIcon(name));
  const [isFallback, setIsFallback] = useState(false);

  // Update src if name changes
  useEffect(() => {
    setCurrentSrc(getItemIcon(name));
    setIsFallback(false);
  }, [name]);

  const handleError = () => {
    if (!isFallback) {
      setCurrentSrc(fallbackSrc);
      setIsFallback(true);
    }
  };

  return (
    <div 
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={currentSrc}
        alt={name}
        width={size}
        height={size}
        className="object-contain"
        onError={handleError}
        unoptimized
      />
    </div>
  );
}
