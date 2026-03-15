import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMonthYear } from "@/lib/utils";

function extractDeliveredQuantity(item: any): number {
  const possibleKeys = [
    "delivered_quantity",
    "quantity",
    "qty",
    "amount",
    "item_quantity",
    "delivered_total",
    "total",
  ];

  for (const key of possibleKeys) {
    const value = item?.[key];
    const num = Number(value ?? 0);

    if (Number.isFinite(num) && num > 0) {
      return num;
    }
  }

  return 0;
}

function extractItemName(item: any): string {
  const possibleKeys = [
    "item_name_snapshot",
    "item_name",
    "name",
    "title",
  ];

  for (const key of possibleKeys) {
    const value = String(item?.[key] ?? "").trim();
    if (value) return value;
  }

  return "";
}

export const getDashboardStats = cache(async () => {
  const supabase = await createClient();
  const { month, year } = getCurrentMonthYear();

  const [familiesRes, membersRes, deliveredRes, distributionsRes, itemsRes] =
    await Promise.all([
      supabase
        .from("families")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true),

      supabase
        .from("families")
        .select("members_count")
        .eq("is_active", true),

      supabase
        .from("monthly_distributions")
        .select("id", { count: "exact", head: true })
        .eq("month", month)
        .eq("year", year),

      supabase
        .from("monthly_distributions")
        .select(`
          id,
          month,
          year,
          monthly_distribution_items (*)
        `)
        .eq("month", month)
        .eq("year", year),

      supabase
        .from("items")
        .select("id, is_active"),
    ]);

  if (familiesRes.error) throw familiesRes.error;
  if (membersRes.error) throw membersRes.error;
  if (deliveredRes.error) throw deliveredRes.error;
  if (distributionsRes.error) throw distributionsRes.error;
  if (itemsRes.error) throw itemsRes.error;

  const totalFamilies = familiesRes.count ?? 0;

  const totalMembers = (membersRes.data ?? []).reduce(
    (sum, row) => sum + Number(row.members_count ?? 0),
    0
  );

  const deliveredFamilies = deliveredRes.count ?? 0;
  const pendingFamilies = Math.max(totalFamilies - deliveredFamilies, 0);

  const totalItemsCount = itemsRes.data?.length ?? 0;
  const activeItemsCount = itemsRes.data?.filter(i => i.is_active).length ?? 0;

  const totalsMap = new Map<string, number>();

  for (const distribution of distributionsRes.data ?? []) {
    const items = Array.isArray(distribution.monthly_distribution_items)
      ? distribution.monthly_distribution_items
      : [];

    for (const item of items) {
      const itemName = extractItemName(item);
      const qty = extractDeliveredQuantity(item);

      if (!itemName || qty <= 0) continue;

      totalsMap.set(itemName, (totalsMap.get(itemName) ?? 0) + qty);
    }
  }

  const totalsByItem = Array.from(totalsMap.entries())
    .map(([item_name_snapshot, delivered_total]) => ({
      item_name_snapshot,
      delivered_total,
    }))
    .sort((a, b) => b.delivered_total - a.delivered_total);

  return {
    totalFamilies,
    totalMembers,
    deliveredFamilies,
    pendingFamilies,
    totalItemsCount,
    activeItemsCount,
    totalsByItem,
    month,
    year,
  };
});

export async function getFamilies(search = "", page = 1, pageSize = 12) {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("families")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search.trim()) {
    query = query.or(
      `family_code.ilike.%${search}%,family_name.ilike.%${search}%`
    );
  }

  const { data, count, error } = await query;
  if (error) throw error;

  return { data: data ?? [], count: count ?? 0 };
}

export async function getItems() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("items").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getActiveItems() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) throw error;
  return data ?? [];
}

export async function searchFamilies(query: string) {
  const supabase = await createClient();

  let builder = supabase
    .from("families")
    .select("id,family_code,family_name,members_count,phone,area,is_active")
    .eq("is_active", true)
    .order("family_name")
    .limit(10);

  if (query.trim()) {
    builder = builder.or(
      `family_code.ilike.%${query}%,family_name.ilike.%${query}%`
    );
  }

  const { data, error } = await builder;
  if (error) throw error;

  return data ?? [];
}

export async function getFamilyById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("families")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function getFamilyByCode(code: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("families")
    .select("*")
    .eq("family_code", code)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getFamilyHistory(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("monthly_distributions")
    .select(`
      *,
      monthly_distribution_items (*)
    `)
    .eq("family_id", id)
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getDistributionByFamilyMonthYear(
  familyId: string,
  month: number,
  year: number
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("monthly_distributions")
    .select(`
      *,
      monthly_distribution_items (*)
    `)
    .eq("family_id", familyId)
    .eq("month", month)
    .eq("year", year)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getMonthlyReport(month: number, year: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("monthly_distributions")
    .select(`
      id,
      family_id,
      month,
      year,
      members_count_at_delivery,
      notes,
      delivered_at,
      created_at,
      families (family_code, family_name, area),
      monthly_distribution_items (*)
    `)
    .eq("month", month)
    .eq("year", year)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getRecentDistributions(limit = 10) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("monthly_distributions")
    .select(`
      id,
      month,
      year,
      delivered_at,
      families (family_name),
      monthly_distribution_items (id)
    `)
    .not("delivered_at", "is", null)
    .order("delivered_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((d: any) => ({
    id: d.id,
    family_name: d.families?.family_name || "عائلة غير معروفة",
    item_count: d.monthly_distribution_items?.length || 0,
    delivered_at: d.delivered_at,
  }));
}