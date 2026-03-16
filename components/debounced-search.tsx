"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export function DebouncedSearch({
  placeholder = "ابحث...",
  defaultValue = "",
}: {
  placeholder?: string;
  defaultValue?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);
  const [isPending, setIsPending] = useState(false);
  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedValue) {
      params.set("q", debouncedValue);
    } else {
      params.delete("q");
    }
    params.set("page", "1");
    
    setIsPending(true);
    router.replace(`${pathname}?${params.toString()}` as any);
    
    const timeout = setTimeout(() => setIsPending(false), 300);
    return () => clearTimeout(timeout);
  }, [debouncedValue, pathname, router, searchParams]);

  return (
    <div className="relative group">
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {isPending ? (
          <Loader2 className="size-4 animate-spin text-accent" />
        ) : (
          <Search className="size-4 text-muted-foreground/40 group-focus-within:text-accent transition-colors" />
        )}
      </div>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="h-11 rounded-xl border-border bg-secondary/40 pr-10 pl-10 text-sm focus:border-accent/40 focus:ring-accent/5 transition-all focus:bg-secondary/60"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground/40 hover:bg-secondary hover:text-foreground"
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  );
}
