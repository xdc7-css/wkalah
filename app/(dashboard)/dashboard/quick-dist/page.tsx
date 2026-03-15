import { getActiveItems } from "@/lib/db";
import { getCurrentMonthYear } from "@/lib/utils";
import { QuickDistForm } from "@/components/quick-dist-form";
import { BackButton } from "@/components/ui/back-button";

export const dynamic = "force-dynamic";

export default async function QuickDistPage() {
  const items = await getActiveItems();
  const { month, year } = getCurrentMonthYear();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton href="/dashboard" />
        <h1 className="text-2xl font-extrabold text-white">توزيع سريع</h1>
      </div>
      
      <QuickDistForm 
        items={items} 
        initialMonth={month} 
        initialYear={year} 
      />
    </div>
  );
}
