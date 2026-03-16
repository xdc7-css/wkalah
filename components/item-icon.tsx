"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { getItemIcon } from "@/lib/item-icons";

interface ItemIconProps {
  name: string;
  size?: number;
  className?: string;
}

export function ItemIcon({
  name,
  size = 24,
  className,
}: ItemIconProps) {
  const iconSrc = getItemIcon(name);

  return (
    <div 
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image 
        src={iconSrc}
        alt={name}
        width={size}
        height={size}
        className={cn(
          "object-contain transition-all duration-300",
          "brightness-95 contrast-110 dark:brightness-[1.12] dark:contrast-[1.15]"
        )}
        unoptimized
      />
    </div>
  );
}
