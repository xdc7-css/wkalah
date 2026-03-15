"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-6">
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(createPageURL(1) as any)}
        disabled={currentPage <= 1}
        className="h-10 w-10 rounded-xl"
      >
        <ChevronsRight className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(createPageURL(currentPage - 1) as any)}
        disabled={currentPage <= 1}
        className="h-10 w-10 rounded-xl"
      >
        <ChevronRight className="size-4" />
      </Button>

      <div className="flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm">
        صفحة {currentPage} من {totalPages}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(createPageURL(currentPage + 1) as any)}
        disabled={currentPage >= totalPages}
        className="h-10 w-10 rounded-xl"
      >
        <ChevronLeft className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(createPageURL(totalPages) as any)}
        disabled={currentPage >= totalPages}
        className="h-10 w-10 rounded-xl"
      >
        <ChevronsLeft className="size-4" />
      </Button>
    </div>
  );
}
