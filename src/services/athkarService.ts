import { AthkarItem } from '../types';

const ATHKAR_LOCAL_STORAGE_KEY = 'noor_athkar_data_v1';
const ATHKAR_FAVORITES_KEY = 'noor_athkar_favorites';
const ATHKAR_PROGRESS_KEY = 'noor_athkar_progress';

const FALLBACK_ATHKAR: AthkarItem[] = [
  {
    id: 1,
    category: 'أذكار الصباح',
    count: 1,
    description: 'من قالها حين يصبح أجير من الجن حتى يمسي',
    reference: 'صحيح الترغيب والترهيب',
    text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ'
  },
  {
    id: 2,
    category: 'أذكار الصباح',
    count: 3,
    description: 'تكفيه من كل شيء',
    reference: 'رواه أبو داود والترمذي',
    text: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ'
  },
  {
    id: 3,
    category: 'أذكار الصباح',
    count: 3,
    description: 'لم يضره شيء في ذلك اليوم',
    reference: 'رواه أبو داود والترمذي',
    text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ'
  },
  {
    id: 4,
    category: 'أذكار الصباح',
    count: 1,
    description: 'سيد الاستغفار',
    reference: 'رواه البخاري',
    text: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ'
  },
  {
    id: 5,
    category: 'أذكار المساء',
    count: 1,
    description: 'أمسينا وأمسى الملك لله والحمد لله',
    reference: 'رواه مسلم',
    text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ'
  },
  {
    id: 6,
    category: 'أذكار النوم',
    count: 1,
    description: 'باسمك ربي وضعت جنبي',
    reference: 'متفق عليه',
    text: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ'
  },
  {
    id: 7,
    category: 'أذكار بعد الصلاة',
    count: 33,
    description: 'التسبيح والتحميد والتكبير بعد الصلاة المكتوبة',
    reference: 'رواه مسلم',
    text: 'سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَاللَّهُ أَكْبَرُ'
  }
];

/**
 * Loads authentic Athkar from Hisn Al-Muslim verified database with 100% offline fallback
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

  try {
    const res = await fetch('/data/hisn_azkar.json');
    if (res.ok) {
      const items: AthkarItem[] = await res.json();
      try {
        localStorage.setItem(ATHKAR_LOCAL_STORAGE_KEY, JSON.stringify(items));
      } catch {
        // ignore
      }
      return items;
    }
  } catch (err) {
    console.warn('Failed loading /data/hisn_azkar.json, switching to offline fallback athkar:', err);
  }

  return FALLBACK_ATHKAR;
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
