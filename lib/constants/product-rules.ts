export const CATEGORIES_WITHOUT_KABJA_HOLFASS = ['window', 'railing'];

// Helper function to check if a category should show kabja and holfass
export function canShowKabjaAndHolfass(category: string): boolean {
  const normalizedCategory = category.toLowerCase();
  return !CATEGORIES_WITHOUT_KABJA_HOLFASS.some(c => normalizedCategory.includes(c));
}
