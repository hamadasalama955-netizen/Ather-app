import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Bookmark, ChevronLeft, Trophy, Layers } from 'lucide-react';
import { SurahMeta, QuranBookmark } from '../../types';
import { fetchAllSurahs, getSurahStartPage } from '../../services/quranApi';
import { getKhatmaState } from '../../services/trackerService';
import { MushafPageView } from './MushafPageView';
import { toArabicDigits } from './MushafIlluminatedBorder';

const BOOKMARK_STORAGE_KEY = 'noor_quran_bookmark';
const LAST_PAGE_STORAGE_KEY = 'noor_last_mushaf_page';

// 30 Ajza' Reference Data for Juz Index Tab
interface JuzInfo {
  number: number;
  name: string;
  startSurah: string;
  startAyah: string;
  startPage: number;
}

const QURAN_AJZA: JuzInfo[] = [
  { number: 1, name: 'الجزء الأول', startSurah: 'الفاتحة', startAyah: 'الحمد لله رب العالمين', startPage: 1 },
  { number: 2, name: 'الجزء الثاني', startSurah: 'البقرة', startAyah: 'سيقول السفهاء من الناس', startPage: 22 },
  { number: 3, name: 'الجزء الثالث', startSurah: 'البقرة', startAyah: 'تلك الرسل فضلنا بعضهم', startPage: 42 },
  { number: 4, name: 'الجزء الرابع', startSurah: 'آل عمران', startAyah: 'لن تنالوا البر حتى تنفقوا', startPage: 62 },
  { number: 5, name: 'الجزء الخامس', startSurah: 'النساء', startAyah: 'والمحصنات من النساء', startPage: 82 },
  { number: 6, name: 'الجزء السادس', startSurah: 'النساء', startAyah: 'لا يحب الله الجهر بالسوء', startPage: 102 },
  { number: 7, name: 'الجزء السابع', startSurah: 'المائدة', startAyah: 'لتجدن أشد الناس عداوة', startPage: 121 },
  { number: 8, name: 'الجزء الثامن', startSurah: 'الأنعام', startAyah: 'ولو أننا نزلنا إليهم', startPage: 142 },
  { number: 9, name: 'الجزء التاسع', startSurah: 'الأعراف', startAyah: 'قال الملأ الذين استكبروا', startPage: 162 },
  { number: 10, name: 'الجزء العاشر', startSurah: 'الأنفال', startAyah: 'واعلموا أنما غنمتم', startPage: 182 },
  { number: 11, name: 'الجزء الحادي عشر', startSurah: 'يونس', startAyah: 'إنما السبيل على الذين', startPage: 201 },
  { number: 12, name: 'الجزء الثاني عشر', startSurah: 'هود', startAyah: 'وما من دابة في الأرض', startPage: 222 },
  { number: 13, name: 'الجزء الثالث عشر', startSurah: 'يوسف', startAyah: 'وما أبرئ نفسي', startPage: 242 },
  { number: 14, name: 'الجزء الرابع عشر', startSurah: 'الحجر', startAyah: 'ربما يود الذين كفروا', startPage: 262 },
  { number: 15, name: 'الجزء الخامس عشر', startSurah: 'الإسراء', startAyah: 'سبحان الذي أسرى بعبده', startPage: 282 },
  { number: 16, name: 'الجزء السادس عشر', startSurah: 'الكهف', startAyah: 'قال ألم أقل لك', startPage: 302 },
  { number: 17, name: 'الجزء السابع عشر', startSurah: 'الأنبياء', startAyah: 'اقترب للناس حسابهم', startPage: 322 },
  { number: 18, name: 'الجزء الثامن عشر', startSurah: 'المؤمنون', startAyah: 'قد أفلح المؤمنون', startPage: 342 },
  { number: 19, name: 'الجزء التاسع عشر', startSurah: 'الفرقان', startAyah: 'وقال الذين لا يرجون لقاءنا', startPage: 362 },
  { number: 20, name: 'الجزء العشرون', startSurah: 'النمل', startAyah: 'فما كان جواب قومه', startPage: 382 },
  { number: 21, name: 'الجزء الحادي والعشرون', startSurah: 'العنكبوت', startAyah: 'ولا تجادلوا أهل الكتاب', startPage: 402 },
  { number: 22, name: 'الجزء الثاني والعشرون', startSurah: 'الأحزاب', startAyah: 'ومن يقنت منكن لله', startPage: 422 },
  { number: 23, name: 'الجزء الثالث والعشرون', startSurah: 'يس', startAyah: 'وما أنزلنا على قومه', startPage: 442 },
  { number: 24, name: 'الجزء الرابع والعشرون', startSurah: 'الزمر', startAyah: 'فمن أظلم ممن كذب', startPage: 462 },
  { number: 25, name: 'الجزء الخامس والعشرون', startSurah: 'فصلت', startAyah: 'إليه يرد علم الساعة', startPage: 482 },
  { number: 26, name: 'الجزء السادس والعشرون', startSurah: 'الأحقاف', startAyah: 'حم . تنزيل الكتاب', startPage: 502 },
  { number: 27, name: 'الجزء السابع والعشرون', startSurah: 'الذاريات', startAyah: 'قال فما خطبكم', startPage: 522 },
  { number: 28, name: 'الجزء الثامن والعشرون', startSurah: 'المجادلة', startAyah: 'قد سمع الله قول التي تجادلك', startPage: 542 },
  { number: 29, name: 'الجزء التاسع والعشرون (تبارك)', startSurah: 'الملك', startAyah: 'تبارك الذي بيده الملك', startPage: 562 },
  { number: 30, name: 'الجزء الثلاثون (عمّ)', startSurah: 'النبأ', startAyah: 'عم يتساءلون', startPage: 582 },
];

export const QuranTab: React.FC = () => {
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Meccan' | 'Medinan'>('all');
  const [activeCatalogTab, setActiveCatalogTab] = useState<'surahs' | 'ajza'>('surahs');

  // Requirement 3: Default to 'index' first directly so user can choose any surah/juz!
  const [viewMode, setViewMode] = useState<'index' | 'mushaf'>('index');

  // Last opened page or default 1
  const [activePage, setActivePage] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(LAST_PAGE_STORAGE_KEY);
      if (stored) {
        const p = parseInt(stored, 10);
        if (p >= 1 && p <= 604) return p;
      }
    } catch {}
    return 1;
  });

  // Bookmark in local storage
  const [bookmark, setBookmark] = useState<QuranBookmark | null>(() => {
    try {
      const stored = localStorage.getItem(BOOKMARK_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const khatma = getKhatmaState();
  const khatmaPercent = Math.min(100, Math.round((khatma.currentPage / 604) * 100));

  useEffect(() => {
    let isMounted = true;
    async function loadSurahs() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchAllSurahs();
        if (isMounted) setSurahs(data);
      } catch (err: unknown) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'تعذر تحميل فهرس السور';
          setError(message);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadSurahs();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveBookmark = (surahNumber: number, surahName: string, ayahNumber: number) => {
    const newBookmark: QuranBookmark = {
      surahNumber,
      surahName,
      ayahNumberInSurah: ayahNumber,
      timestamp: Date.now(),
    };
    setBookmark(newBookmark);
    try {
      localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(newBookmark));
    } catch (e) {
      console.warn('Bookmark write failed:', e);
    }
  };

  const handleOpenBookmark = () => {
    if (bookmark) {
      const page = getSurahStartPage(bookmark.surahNumber);
      setActivePage(page);
      setViewMode('mushaf');
    }
  };

  // Requirement 3: Upon clicking any surah from the index, immediately open that Surah in the Madinah frame at the top
  const handleSelectSurah = (surahNumber: number) => {
    const page = getSurahStartPage(surahNumber);
    setActivePage(page);
    setViewMode('mushaf');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  };

  const handleSelectPage = (pageNum: number) => {
    setActivePage(pageNum);
    setViewMode('mushaf');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  };

  // 1. If user selected a Surah or page, show MushafPageView with authentic Madinah frame!
  if (viewMode === 'mushaf') {
    return (
      <MushafPageView
        initialPage={activePage}
        onOpenIndex={() => setViewMode('index')}
        bookmark={bookmark}
        onSaveBookmark={handleSaveBookmark}
      />
    );
  }

  // 2. Default: Surahs & Ajza Index View (فهرس السور والأجزاء الـ 114)
  const filteredSurahs = surahs.filter((surah) => {
    const matchesSearch =
      surah.name.includes(searchQuery) ||
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.number.toString() === searchQuery.trim();

    const matchesFilter = filterType === 'all' || surah.revelationType === filterType;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-3.5 pb-24 animate-in fade-in duration-200">
      {/* Quran Header Card in Royal Theme */}
      <div className="rounded-3xl bg-[#faf8f5] dark:bg-[#141414] border border-[#d4af37]/30 shadow-md p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-b from-[#d4af37] to-[#aa7c11] text-stone-950 flex items-center justify-center font-bold shadow-sm">
              <BookOpen className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <h2
                className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-[#f5e6b8]"
                style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
              >
                فهرس القرآن الكريم
              </h2>
              <p className="text-xs text-[#b89328] dark:text-[#d4af37]">
                برسم مصحف المدينة المنورة (٦٠٤ صفحة)
              </p>
            </div>
          </div>

          {/* Quick jump to current reading page */}
          <button
            onClick={() => setViewMode('mushaf')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#d4af37] hover:bg-[#c5a059] text-stone-950 text-xs font-bold shadow-xs transition active:scale-95 shrink-0"
          >
            <span>فتح المصحف</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Khatma Quick Progress Banner */}
        <div className="p-3 rounded-2xl bg-white dark:bg-[#1a1814] border border-[#d4af37]/20 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-700 dark:text-[#f5e6b8] font-bold flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>موضع القراءة الحالي: صفحة {toArabicDigits(khatma.currentPage)} من ٦٠٤</span>
            </span>
            <span className="font-mono text-[#b89328] dark:text-[#d4af37] font-bold">
              %{toArabicDigits(khatmaPercent)}
            </span>
          </div>
          <div className="w-full bg-stone-200 dark:bg-black/50 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#c5a059] to-[#d4af37] rounded-full transition-all duration-300"
              style={{ width: `${khatmaPercent}%` }}
            />
          </div>
        </div>

        {/* Bookmark Quick Access Banner */}
        {bookmark && (
          <div className="p-3 rounded-2xl bg-white dark:bg-[#1a1814] border border-[#d4af37]/25 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#d4af37] shrink-0" />
              <div className="text-xs">
                <span className="text-stone-500 dark:text-[#a39e93]">فاصلة القراءة المحفوظة: </span>
                <span className="font-bold text-stone-900 dark:text-[#d4af37]">
                  {bookmark.surahName} (الآية {toArabicDigits(bookmark.ayahNumberInSurah)})
                </span>
              </div>
            </div>

            <button
              onClick={handleOpenBookmark}
              className="px-3 py-1.5 rounded-xl bg-[#d4af37] hover:bg-[#c5a059] text-stone-950 font-bold text-xs transition active:scale-95 shrink-0"
            >
              متابعة
            </button>
          </div>
        )}
      </div>

      {/* Index Mode Switcher: السور vs الأجزاء */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-[#faf8f5] dark:bg-[#141414] border border-[#d4af37]/25 rounded-2xl text-xs font-bold">
        <button
          onClick={() => setActiveCatalogTab('surahs')}
          className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
            activeCatalogTab === 'surahs'
              ? 'bg-[#d4af37] text-stone-950 shadow-xs'
              : 'text-stone-700 dark:text-[#a39e93] hover:text-[#d4af37]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>فهرس السور ({toArabicDigits(114)})</span>
        </button>

        <button
          onClick={() => setActiveCatalogTab('ajza')}
          className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
            activeCatalogTab === 'ajza'
              ? 'bg-[#d4af37] text-stone-950 shadow-xs'
              : 'text-stone-700 dark:text-[#a39e93] hover:text-[#d4af37]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>فهرس الأجزاء ({toArabicDigits(30)})</span>
        </button>
      </div>

      {/* SURAHS CATALOG VIEW */}
      {activeCatalogTab === 'surahs' && (
        <div className="space-y-3">
          {/* Search & Category Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="ابحث عن اسم السورة أو رقمها (مثال: الكهف أو 18)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-white dark:bg-[#141414] border border-[#d4af37]/25 text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#d4af37] shadow-2xs"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-[#faf8f5] dark:bg-[#141414] border border-[#d4af37]/20 rounded-xl text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition ${
                  filterType === 'all'
                    ? 'bg-[#d4af37] text-stone-950 shadow-2xs'
                    : 'text-stone-600 dark:text-[#a39e93]'
                }`}
              >
                كل السور ({toArabicDigits(surahs.length)})
              </button>
              <button
                onClick={() => setFilterType('Meccan')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition ${
                  filterType === 'Meccan'
                    ? 'bg-[#d4af37] text-stone-950 shadow-2xs'
                    : 'text-stone-600 dark:text-[#a39e93]'
                }`}
              >
                مكية (٨٦)
              </button>
              <button
                onClick={() => setFilterType('Medinan')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition ${
                  filterType === 'Medinan'
                    ? 'bg-[#d4af37] text-stone-950 shadow-2xs'
                    : 'text-stone-600 dark:text-[#a39e93]'
                }`}
              >
                مدنية (٢٨)
              </button>
            </div>
          </div>

          {/* Surahs List */}
          {isLoading ? (
            <div className="py-20 text-center text-xs text-stone-500 space-y-2">
              <div className="w-8 h-8 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin mx-auto" />
              <p>جاري تحميل فهرس السور الشريفة...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 text-rose-700 text-center text-xs">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2" dir="rtl">
              {filteredSurahs.map((surah) => {
                const startPage = getSurahStartPage(surah.number);
                return (
                  <button
                    key={surah.number}
                    onClick={() => handleSelectSurah(surah.number)}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#faf8f5] dark:bg-[#141414] border border-[#d4af37]/20 hover:border-[#d4af37]/60 shadow-2xs hover:shadow-xs transition active:scale-[0.99] text-right group"
                  >
                    <div className="flex items-center gap-3">
                      {/* Golden Circular Badge with Surah Number */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#1a1814] to-[#0a0a0a] border border-[#d4af37]/40 flex items-center justify-center font-mono font-bold text-xs text-[#d4af37] shrink-0 group-hover:scale-105 transition">
                        {toArabicDigits(surah.number)}
                      </div>

                      <div>
                        <h3
                          className="text-base sm:text-lg font-bold text-stone-900 dark:text-[#f5e6b8] group-hover:text-[#b89328] dark:group-hover:text-[#d4af37] transition leading-snug"
                          style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
                        >
                          {surah.name}
                        </h3>
                        <p className="text-[11px] text-stone-500 dark:text-[#a39e93] flex items-center gap-1.5">
                          <span>{surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
                          <span>•</span>
                          <span>{toArabicDigits(surah.numberOfAyahs)} آية</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-1 rounded-xl bg-white dark:bg-[#1a1814] border border-[#d4af37]/25 text-[#b89328] dark:text-[#d4af37] font-mono">
                        ص {toArabicDigits(startPage)}
                      </span>
                      <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-[#d4af37] transition" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* AJZA' (PARTS) CATALOG VIEW */}
      {activeCatalogTab === 'ajza' && (
        <div className="grid grid-cols-1 gap-2" dir="rtl">
          {QURAN_AJZA.map((juz) => (
            <button
              key={juz.number}
              onClick={() => handleSelectPage(juz.startPage)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#faf8f5] dark:bg-[#141414] border border-[#d4af37]/20 hover:border-[#d4af37]/60 shadow-2xs hover:shadow-xs transition active:scale-[0.99] text-right group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#1a1814] to-[#0a0a0a] border border-[#d4af37]/40 flex items-center justify-center font-mono font-bold text-xs text-[#d4af37] shrink-0 group-hover:scale-105 transition">
                  {toArabicDigits(juz.number)}
                </div>

                <div>
                  <h3
                    className="text-sm sm:text-base font-bold text-stone-900 dark:text-[#f5e6b8] group-hover:text-[#b89328] dark:group-hover:text-[#d4af37] transition"
                    style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
                  >
                    {juz.name}
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-[#a39e93] line-clamp-1">
                    يبدأ من سورة {juz.startSurah}: «{juz.startAyah}...»
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-1 rounded-xl bg-white dark:bg-[#1a1814] border border-[#d4af37]/25 text-[#b89328] dark:text-[#d4af37] font-mono">
                  ص {toArabicDigits(juz.startPage)}
                </span>
                <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-[#d4af37] transition" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
