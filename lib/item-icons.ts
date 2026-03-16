export const ITEM_ICONS_MAP: Record<string, string> = {
  "تمن": "/icons/items/rice.png",
  "ارز": "/icons/items/rice.png",
  "رز": "/icons/items/rice.png",
  "حمص": "/icons/items/vegetarian.png",
  "زيت": "/icons/items/olive-oil.png",
  "شكر": "/icons/items/sugar.png",
  "سكر": "/icons/items/sugar.png",
  "طحين": "/icons/items/wheat.png",
  "عدس": "/icons/items/lentils.png",
  "فاصوليا": "/icons/items/bean.png",
  "بقوليات": "/icons/items/bean.png",
  "معجون": "/icons/items/tomato.png",
  "معجون كبير": "/icons/items/tomato-big.png",
  "معجون صغير": "/icons/items/tomato.png",
  "معلبات": "/icons/items/canned-food.png",
};

function normalizeArabic(text: string) {
  return text
    .trim()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/\s+/g, " ");
}

export function getItemIcon(name: string): string {
  const defaultIcon = "/icons/items/default.png";
  if (!name) return defaultIcon;
  
  const normalized = normalizeArabic(name);

  if (ITEM_ICONS_MAP[normalized]) return ITEM_ICONS_MAP[normalized];

  const key = Object.keys(ITEM_ICONS_MAP).find((k) => normalized.includes(k));
  return key ? ITEM_ICONS_MAP[key] : defaultIcon;
}