import { AyahData, SurahMeta, SurahDetailResponse, Reciter, MushafPageData, MushafPageAyah } from '../types';

export const QURAN_RECITERS: Reciter[] = [
  { id: 'ar.alafasy', name: 'مشاري راشد العفاسي', subname: 'مرتل ومتقن' },
  { id: 'ar.abdulbasitmurattal', name: 'عبد الباسط عبد الصمد', subname: 'مرتل' },
  { id: 'ar.husary', name: 'محمود خليل الحصري', subname: 'المصحف المرتل' },
  { id: 'ar.minshawi', name: 'محمد صديق المنشاوي', subname: 'مرتل' },
  { id: 'ar.saoodshuraym', name: 'سعود الشريم', subname: 'الحرم المكي' },
  { id: 'ar.abdurrahmaansudais', name: 'عبد الرحمن السديس', subname: 'الحرم المكي' },
];

const AYAH_CACHE_PREFIX = 'noor_ayah_v2_';
const SURAHS_CACHE_KEY = 'noor_surahs_list';
const SURAH_DETAIL_CACHE_PREFIX = 'noor_surah_detail_v2_';

const BASMALAH_PREFIX_1 = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
const BASMALAH_PREFIX_2 = 'بِّسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

/**
 * Strips the Basmalah prefix from Ayah 1 for any surah other than Al-Fatiha (1).
 * In Al-Fatiha, the Basmalah is Ayah 1 itself. In other surahs, it is the surah opening header.
 */
export function cleanAyahBasmalah(text: string, surahNumber: number, numberInSurah: number): string {
  if (surahNumber !== 1 && numberInSurah === 1) {
    if (text.startsWith(BASMALAH_PREFIX_1)) {
      return text.slice(BASMALAH_PREFIX_1.length).trim();
    }
    if (text.startsWith(BASMALAH_PREFIX_2)) {
      return text.slice(BASMALAH_PREFIX_2.length).trim();
    }
  }
  return text;
}

// A curated list of reference Ayah IDs (1 to 6236) in the Holy Quran to rotate through daily
// E.g. Ayat Al-Kursi is #262 in total Quran index (Surah 2 Ayah 255)
// Al-Fatiha 1 is #1, etc.
const NOTABLE_AYAH_INDICES = [
  262, // Ayat Al-Kursi (2:255)
  293, // Al-Baqarah (2:286)
  286, // Al-Baqarah (2:285)
  158, // Al-Baqarah (2:152) "فاذكروني أذكركم"
  192, // Al-Baqarah (2:186) "وإذا سألك عبادي عني فإني قريب"
  387, // Al-Imran (3:133)
  517, // Al-Imran (3:200)
  824, // An-Nisa (4:135)
  1800, // At-Tawbah (9:128)
  2164, // Yusuf (12:86) "إنما أشكو بثي وحزني إلى الله"
  2228, // Ibrahim (14:7) "لئن شكرتم لأزيدنكم"
  2461, // Al-Isra (17:82) "وننزل من القرآن ما هو شفاء"
  2500, // Al-Kahf (18:10)
  2540, // Al-Kahf (18:46) "المال والبنون زينة الحياة الدنيا"
  2615, // Maryam (19:96)
  2673, // Ta-Ha (20:114) "وقل رب زدني علما"
  2720, // Al-Anbiya (21:87) "لا إله إلا أنت سبحانك إني كنت من الظالمين"
  2880, // Al-Hajj (22:77)
  2978, // Al-Mu'minun (23:115)
  3020, // An-Nur (24:35) "الله نور السماوات والأرض"
  3150, // Al-Furqan (25:74) "ربنا هب لنا من أزواجنا وذرياتنا قرة أعين"
  3324, // Ash-Shu'ara (26:80) "وإذا مرضت فهو يشفين"
  3450, // Al-Qasas (28:77)
  3540, // Al-Ankabut (29:69)
  3630, // Luqman (31:17)
  3740, // As-Sajdah (32:16)
  3820, // Al-Ahzab (33:56) "إن الله وملائكته يصلون على النبي"
  4130, // Fatir (35:15)
  4200, // Ya-Sin (36:58) "سلام قولا من رب رحيم"
  4320, // Az-Zumar (39:53) "قل يا عبادي الذين أسرفوا على أنفسهم"
  4380, // Ghafir (40:60) "وقال ربكم ادعوني أستجب لكم"
  4520, // Fussilat (41:34)
  4680, // Ash-Shura (42:38)
  4810, // Ad-Dukhan (44:38)
  4940, // Al-Hujurat (49:13) "يا أيها الناس إنا خلقناكم من ذكر وأنثى"
  5000, // Qaf (50:16) "ونحن أقرب إليه من حبل الوريد"
  5080, // Adh-Dhariyat (51:56)
  5150, // An-Najm (53:39) "وأن ليس للإنسان إلا ما سعى"
  5260, // Al-Qamar (54:17) "ولقد يسرنا القرآن للذكر فهل من مدكر"
  5300, // Ar-Rahman (55:13)
  5420, // Al-Waqi'ah (56:88)
  5490, // Al-Hadid (57:4) "وهو معكم أين ما كنتم"
  5560, // Al-Hashr (59:22)
  5650, // As-Saff (61:13) "نصر من الله وفتح قريب"
  5700, // Al-Jumu'ah (62:9)
  5780, // At-Talaq (65:3) "ومن يتوكل على الله فهو حسبه"
  5850, // Al-Mulk (67:1) "تبارك الذي بيده الملك"
  5920, // Al-Qalam (68:4) "وإنك لعلى خلق عظيم"
  6020, // An-Naba (78:31)
  6080, // Al-Infitar (82:6)
  6120, // Al-A'la (87:14) "قد أفلح من تزكى"
  6140, // Al-Ghashiyah (88:17)
  6170, // Ash-Sharh (94:5) "فإن مع العسر يسرا"
  6180, // At-Tin (95:4)
  6190, // Al-Alaq (96:1) "اقرأ باسم ربك الذي خلق"
  6200, // Al-Qadr (97:1)
  6230, // Al-Ikhlas (112:1)
  6233, // Al-Falaq (113:1)
  6236, // An-Nas (114:1)
];

/**
 * Calculates a deterministic daily index for today
 */
export function getTodayAyahIndex(): number {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const diffDays = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  const arrayIndex = Math.abs(diffDays) % NOTABLE_AYAH_INDICES.length;
  return NOTABLE_AYAH_INDICES[arrayIndex];
}

import { OFFLINE_SURAHS_LIST, OFFLINE_AYAT_COLLECTION, OFFLINE_SURAH_DETAILS } from '../data/quranOfflineData';

/**
 * Fetch a specific Ayah with Arabic text and recitation audio from Alquran Cloud API, with 100% offline fallback
 */
export async function fetchAyah(ayahNumber: number): Promise<AyahData> {
  const cacheKey = `${AYAH_CACHE_PREFIX}${ayahNumber}`;

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn('Cache read error:', e);
  }

  // If offline, return immediately from offline collection
  if (typeof navigator !== 'undefined' && !navigator.onLine && OFFLINE_AYAT_COLLECTION[ayahNumber]) {
    return OFFLINE_AYAT_COLLECTION[ayahNumber];
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    // Request ayah with audio edition (ar.alafasy)
    const res = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/ar.alafasy`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json.code === 200 && json.data) {
        const rawData: AyahData = json.data;
        const data: AyahData = {
          ...rawData,
          text: cleanAyahBasmalah(rawData.text, rawData.surah.number, rawData.numberInSurah),
        };
        try {
          localStorage.setItem(cacheKey, JSON.stringify(data));
        } catch {
          // ignore
        }
        return data;
      }
    }
  } catch (err) {
    console.warn('Network ayah fetch failed, using offline ayah collection:', err);
  }

  // Offline fallback
  if (OFFLINE_AYAT_COLLECTION[ayahNumber]) {
    return OFFLINE_AYAT_COLLECTION[ayahNumber];
  }

  // Fallback to closest offline verse (e.g. Ayat Al-Kursi or first available)
  const fallbackAyah = OFFLINE_AYAT_COLLECTION[262] || Object.values(OFFLINE_AYAT_COLLECTION)[0];
  return fallbackAyah;
}

/**
 * Fetches the daily Ayah
 */
export async function fetchTodayAyah(customIndex?: number): Promise<AyahData> {
  const index = customIndex || getTodayAyahIndex();
  return fetchAyah(index);
}

/**
 * Fetches random inspiring Ayah from the Quran API
 */
export async function fetchRandomAyah(): Promise<AyahData> {
  const randomIndex = NOTABLE_AYAH_INDICES[Math.floor(Math.random() * NOTABLE_AYAH_INDICES.length)];
  return fetchAyah(randomIndex);
}

/**
 * Fetches the list of all 114 Surahs with 100% offline fallback
 */
export async function fetchAllSurahs(): Promise<SurahMeta[]> {
  try {
    const cached = localStorage.getItem(SURAHS_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn('Surahs cache read error:', e);
  }

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return OFFLINE_SURAHS_LIST;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://api.alquran.cloud/v1/surah', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json.code === 200 && json.data) {
        const surahs: SurahMeta[] = json.data;
        try {
          localStorage.setItem(SURAHS_CACHE_KEY, JSON.stringify(surahs));
        } catch {
          // ignore
        }
        return surahs;
      }
    }
  } catch (err) {
    console.warn('Network surahs fetch failed, using offline surah list:', err);
  }

  return OFFLINE_SURAHS_LIST;
}

/**
 * Fetches full Surah text (Uthmani script) and audio recitations with offline fallback
 */
export async function fetchSurahDetail(
  surahNumber: number,
  reciterId: string = 'ar.alafasy'
): Promise<SurahDetailResponse> {
  const cacheKey = `${SURAH_DETAIL_CACHE_PREFIX}${surahNumber}_${reciterId}`;

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn('Surah detail cache read error:', e);
  }

  // If offline and we have the offline detail pre-bundled
  if (typeof navigator !== 'undefined' && !navigator.onLine && OFFLINE_SURAH_DETAILS[surahNumber]) {
    return OFFLINE_SURAH_DETAILS[surahNumber];
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const [textRes, audioRes] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`, { signal: controller.signal }),
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${reciterId}`, { signal: controller.signal }).catch(() => null),
    ]);
    clearTimeout(timeoutId);

    if (textRes.ok) {
      const textJson = await textRes.json();
      const audioJson = audioRes && audioRes.ok ? await audioRes.json() : null;

      if (textJson.code === 200 && textJson.data) {
        const rawData = textJson.data;
        const audioAyahs = audioJson?.data?.ayahs || [];

        const mergedAyahs = rawData.ayahs.map((ayah: any, index: number) => {
          const audioAyah = audioAyahs[index];
          return {
            ...ayah,
            text: cleanAyahBasmalah(ayah.text, rawData.number, ayah.numberInSurah),
            audio: audioAyah?.audio || undefined,
            audioSecondary: audioAyah?.audioSecondary || undefined,
          };
        });

        const detail: SurahDetailResponse = {
          ...rawData,
          ayahs: mergedAyahs,
        };

        try {
          localStorage.setItem(cacheKey, JSON.stringify(detail));
        } catch {
          // ignore
        }
        return detail;
      }
    }
  } catch (err) {
    console.warn('Network surah detail fetch failed, using offline fallback:', err);
  }

  // Offline fallback
  if (OFFLINE_SURAH_DETAILS[surahNumber]) {
    return OFFLINE_SURAH_DETAILS[surahNumber];
  }

  // Fallback to Al-Fatiha or basic offline representation
  const surahMeta = OFFLINE_SURAHS_LIST.find((s) => s.number === surahNumber) || OFFLINE_SURAHS_LIST[0];
  return {
    number: surahMeta.number,
    name: surahMeta.name,
    englishName: surahMeta.englishName,
    englishNameTranslation: surahMeta.englishNameTranslation,
    revelationType: surahMeta.revelationType,
    numberOfAyahs: surahMeta.numberOfAyahs,
    ayahs: [
      {
        number: 1,
        text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        numberInSurah: 1,
        juz: 1,
        manzil: 1,
        page: 1,
        ruku: 1,
        hizbQuarter: 1,
        sajda: false
      }
    ]
  };
}

/**
 * Standard starting page for each of the 114 Surahs in the Medina Mushaf (Hafs 'an 'Asim, 604 pages)
 * Index 1 corresponds to Surah 1 (Al-Fatiha = page 1), etc.
 */
export const SURAH_STARTING_PAGES: number[] = [
  0,   // dummy 0-index
  1,   2,   50,  77,  106, 128, 151, 177, 187, 208, // 1 - 10
  221, 235, 249, 255, 262, 267, 282, 293, 305, 312, // 11 - 20
  322, 332, 342, 350, 359, 367, 377, 385, 396, 404, // 21 - 30
  411, 415, 418, 428, 434, 440, 446, 453, 458, 467, // 31 - 40
  477, 483, 489, 496, 499, 502, 507, 511, 515, 518, // 41 - 50
  520, 523, 526, 528, 531, 534, 537, 542, 545, 549, // 51 - 60
  551, 553, 554, 556, 558, 560, 562, 564, 566, 568, // 61 - 70
  570, 572, 574, 575, 577, 578, 580, 582, 583, 585, // 71 - 80
  586, 587, 587, 589, 590, 591, 591, 592, 593, 594, // 81 - 90
  595, 595, 596, 596, 597, 597, 598, 598, 599, 599, // 91 - 100
  600, 600, 601, 601, 601, 602, 602, 602, 603, 603, // 101 - 110
  603, 604, 604, 604                                  // 111 - 114
];

export function getSurahStartPage(surahNum: number): number {
  if (surahNum >= 1 && surahNum <= 114) {
    return SURAH_STARTING_PAGES[surahNum] || 1;
  }
  return 1;
}

const PAGE_CACHE_PREFIX = 'noor_mushaf_page_v2_';

/**
 * Fetch an entire Mushaf page (1 to 604) from Alquran Cloud API
 */
export async function fetchMushafPage(
  pageNumber: number,
  reciterId: string = 'ar.alafasy'
): Promise<MushafPageData> {
  const clampedPage = Math.max(1, Math.min(604, pageNumber));
  const cacheKey = `${PAGE_CACHE_PREFIX}${clampedPage}_${reciterId}`;

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn('Page cache read error:', e);
  }

  const [textRes, audioRes] = await Promise.all([
    fetch(`https://api.alquran.cloud/v1/page/${clampedPage}/quran-uthmani`),
    fetch(`https://api.alquran.cloud/v1/page/${clampedPage}/${reciterId}`),
  ]);

  if (!textRes.ok) {
    throw new Error(`تعذر جلب صفحة المصحف الشريف رقم ${clampedPage} (الرمز: ${textRes.status})`);
  }

  const textJson = await textRes.json();
  const audioJson = audioRes.ok ? await audioRes.json() : null;

  if (textJson.code !== 200 || !textJson.data || !textJson.data.ayahs) {
    throw new Error('استجابة غير صحيحة من خدمة صفحات المصحف');
  }

  const rawAyahs = textJson.data.ayahs;
  const audioAyahs = audioJson?.data?.ayahs || [];

  const combinedAyahs: MushafPageAyah[] = rawAyahs.map((ayah: any, index: number) => {
    return {
      number: ayah.number,
      text: cleanAyahBasmalah(ayah.text, ayah.surah.number, ayah.numberInSurah),
      numberInSurah: ayah.numberInSurah,
      juz: ayah.juz,
      page: ayah.page,
      hizbQuarter: ayah.hizbQuarter,
      surah: {
        number: ayah.surah.number,
        name: ayah.surah.name,
        englishName: ayah.surah.englishName,
        revelationType: ayah.surah.revelationType,
        numberOfAyahs: ayah.surah.numberOfAyahs,
      },
      audio: audioAyahs[index]?.audio,
    };
  });

  const firstAyah = combinedAyahs[0];
  const primarySurah = firstAyah
    ? firstAyah.surah
    : { number: 1, name: 'سُورَةُ ٱلْفَاتِحَةِ', revelationType: 'Meccan', numberOfAyahs: 7 };
  const juz = firstAyah?.juz || 1;

  const result: MushafPageData = {
    pageNumber: clampedPage,
    ayahs: combinedAyahs,
    primarySurah,
    juz,
  };

  try {
    localStorage.setItem(cacheKey, JSON.stringify(result));
  } catch (e) {
    console.warn('Page cache write error:', e);
  }

  // Pre-fetch next page in background (non-blocking)
  if (clampedPage < 604) {
    setTimeout(() => {
      fetchMushafPage(clampedPage + 1, reciterId).catch(() => {});
    }, 1200);
  }

  return result;
}

