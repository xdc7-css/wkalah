"use client";

import { useState, useMemo, useTransition } from "react";
import { saveDistributionAction } from "@/server/distribution-actions";
import type { Item } from "@/lib/types";

type FamilyLite = {
  id: string;
  family_code: string;
  family_name: string;
  members_count: number;
  area: string | null;
};

export function useDistributionState(
  items: Item[],
  initialMonth: number,
  initialYear: number
) {
  const [selectedFamily, setSelectedFamily] = useState<FamilyLite | null>(null);
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [notes, setNotes] = useState("");
  const [membersCount, setMembersCount] = useState(1);
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [isPending, startTransition] = useTransition();

  const calculatedItems = useMemo(() => {
    return items.map((item) => {
      const calculated =
        item.calculation_type === "per_person"
          ? Number(item.default_quantity) * membersCount
          : Number(item.default_quantity);

      return {
        ...item,
        calculated,
        delivered: overrides[item.id] ?? calculated,
      };
    });
  }, [items, membersCount, overrides]);

  const selectFamily = (family: FamilyLite) => {
    setSelectedFamily(family);
    setMembersCount(family.members_count);
    setOverrides({});
    setNotes("");
  };

  const handleOverride = (itemId: string, value: number) => {
    setOverrides((prev) => ({ ...prev, [itemId]: value }));
  };

  const reset = () => {
    setSelectedFamily(null);
    setNotes("");
    setOverrides({});
    setMembersCount(1);
  };

  return {
    selectedFamily,
    setSelectedFamily: selectFamily,
    month,
    setMonth,
    year,
    setYear,
    notes,
    setNotes,
    membersCount,
    setMembersCount,
    calculatedItems,
    handleOverride,
    isPending,
    startTransition,
    reset,
  };
}
