/** Maps URL slug → display category name (used by /category/[slug]) */
export const categorySlugMap: Record<string, string> = {
  mall: 'Pharma Plus Mall',
  medicines: 'Medicines',
  health: 'Health & Wellness',
  'personal-care': 'Personal Care',
  vitamins: 'Vitamins & Supplements',
  'medical-devices': 'Medical Devices',
  'baby-care': 'Baby Care',
  'skin-care': 'Skin Care',
  'oral-care': 'Oral Care',
  'first-aid': 'First Aid',
  'sexual-wellness': 'Sexual Wellness',
  vouchers: 'Vouchers',
};

const nameToSlug = Object.fromEntries(
  Object.entries(categorySlugMap).map(([slug, name]) => [name, slug])
);

export function categorySlugFromName(name: string): string {
  return nameToSlug[name] ?? name.toLowerCase().replace(/\s+/g, '-');
}
