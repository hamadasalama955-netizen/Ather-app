import { AthkarItem } from '../types';

const ATHKAR_LOCAL_STORAGE_KEY = 'noor_athkar_data_v1';
const ATHKAR_FAVORITES_KEY = 'noor_athkar_favorites';
const ATHKAR_PROGRESS_KEY = 'noor_athkar_progress';

/**
 * Loads authentic Athkar from Hisn Al-Muslim verified database
 * Source: حصن المسلم من أذكار الكتاب والسنة - للشيخ د. سعيد بن علي بن وهف القحطاني
 */
export async function fetchAllAthkar(): Promise<AthkarItem[]> {
  try {
    const cached = localStorage.getItem(ATHKAR_LOCAL_STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn('Athkar cache read error:', e);
  }

  // Fetch from the local validated bundle in /public/data/hisn_azkar.json
  const res = await fetch('/data/hisn_azkar.json');
  if (!res.ok) {
    throw new Error('تعذر تحميل بيانات الأذكار المعتمدة');
  }

  const items: AthkarItem[] = await res.json();

  try {
    localStorage.setItem(ATHKAR_LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Athkar cache write error:', e);
  }

  return items;
}

/**
 * Extract distinct categories from athkar list
 */
export function getAthkarCategories(items: AthkarItem[]): string[] {
  const categoriesSet = new Set<string>();
  items.forEach((item) => {
    if (item.category) categoriesSet.add(item.category);
  });
  return Array.from(categoriesSet);
}

/**
 * Favorites local storage helpers
 */
export function getFavoriteAthkarIds(): number[] {
  try {
    const stored = localStorage.getItem(ATHKAR_FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function toggleFavoriteAthkar(id: number): boolean {
  const current = getFavoriteAthkarIds();
  let updated: number[];
  let isFav = false;
  if (current.includes(id)) {
    updated = current.filter((x) => x !== id);
    isFav = false;
  } else {
    updated = [...current, id];
    isFav = true;
  }
  try {
    localStorage.setItem(ATHKAR_FAVORITES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed writing favorites:', e);
  }
  return isFav;
}

/**
 * Tracks daily read counts for athkar items (e.g. 1/3, 2/3) in local storage
 */
export function getAthkarProgress(): Record<number, number> {
  try {
    const stored = localStorage.getItem(ATHKAR_PROGRESS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function incrementAthkarProgress(id: number, maxCount: number): number {
  const progress = getAthkarProgress();
  const current = progress[id] || 0;
  const next = current >= maxCount ? maxCount : current + 1;
  progress[id] = next;
  try {
    localStorage.setItem(ATHKAR_PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Failed saving athkar progress:', e);
  }
  return next;
}

export function resetCategoryProgress(itemIds: number[]) {
  const progress = getAthkarProgress();
  itemIds.forEach((id) => {
    delete progress[id];
  });
  try {
    localStorage.setItem(ATHKAR_PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Failed resetting athkar progress:', e);
  }
}
