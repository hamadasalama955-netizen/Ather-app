import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Bookmark, ChevronLeft, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { SurahMeta, QuranBookmark } from '../../types';
import { fetchAllSurahs, getSurahStartPage } from '../../services/quranApi';
import { getKhatmaState } from '../../services/trackerService';
import { MushafPageView } from './MushafPageView';

const BOOKMARK_STORAGE_KEY = 'noor_quran_bookmark';
const LAST_PAGE_STORAGE_KEY = 'noor_last_mushaf_page';

export const QuranTab: React.FC = () => {
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Meccan' | 'Medinan'>('all');

  // View mode: 'mushaf' (default per requirement) or 'index'
  const [viewMode, setViewMode] = useState<'mushaf' | 'index'>('mushaf');

  // Last opened page or default 1
  const [activePage, setActivePage] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(LAST_PAGE_STORAGE_KEY);
      if (stored) {
        const p = parseInt(stored, 10);
        if (p >= 1 && p <= 604) return p;
      }
    } catch {
      // fallback
    }
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

  const handleSelectSurah = (surahNumber: number) => {
    const page = getSurahStartPage(surahNumber);
    setActivePage(page);
    setViewMode('mushaf');
  };

  // If in Mushaf page-flip mode, display MushafPageView
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

  // ========================================================
  // SURAH INDEX VIEW (فهرس السور الـ 114)
  // ========================================================
  const filteredSurahs = surahs.filter((surah) => {
    const matchesSearch =
      surah.name.includes(searchQuery) ||
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.number.toString() === searchQuery.trim();

    const matchesFilter = filterType === 'all' || surah.revelationType === filterType;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-200">
      {/* Quran Header Card */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 to-emerald-950 text-white p-5 border border-emerald-700/60 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">فهرس سور القرآن الكريم</h2>
              <p className="text-xs text-amber-300">برسم مصحف المدينة المنورة (604 صفحة)</p>
            </div>
          </div>

          {/* Quick return to Mushaf */}
          <button
            onClick={() => setViewMode('mushaf')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold shadow-md transition active:scale-95 shrink-0"
          >
            <span>عرض المصحف</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>

        {/* Khatma Quick Progress Banner */}
        <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-amber-200 font-bold flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>موضع قراءتك الحالي: صفحة {khatma.currentPage} من 604</span>
            </span>
            <span className="font-mono text-amber-300 font-bold">{khatmaPercent}%</span>
          </div>
          <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${khatmaPercent}%` }}
            />
          </div>
        </div>

        {/* Bookmark Quick Access Banner */}
        {bookmark && (
          <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-xs">
                <span className="text-stone-300">فاصلة القراءة المحفوظة: </span>
                <span className="font-bold text-amber-300">
                  {bookmark.surahName} (الآية {bookmark.ayahNumberInSurah})
                </span>
              </div>
            </div>

            <button
              onClick={handleOpenBookmark}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs transition active:scale-95 shrink-0"
            >
              متابعة
            </button>
          </div>
        )}
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="ابحث عن اسم السورة أو رقمها (مثال: الكهف أو 18)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-sm"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-200/50 dark:bg-stone-800/60 rounded-xl text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
              filterType === 'all'
                ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-sm'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            كل السور ({surahs.length})
          </button>
          <button
            onClick={() => setFilterType('Meccan')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
              filterType === 'Meccan'
                ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-sm'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            مكية (86)
          </button>
          <button
            onClick={() => setFilterType('Medinan')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
              filterType === 'Medinan'
                ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-sm'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            مدنية (28)
          </button>
        </div>
      </div>

      {/* Surahs List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-stone-500 animate-pulse space-y-2">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mx-auto" />
            <p>جاري تحميل فهرس سور القرآن الكريم...</p>
          </div>
        ) : error ? (
          <div className="py-6 text-center text-xs text-rose-600 dark:text-rose-400">
            {error}
          </div>
        ) : filteredSurahs.length === 0 ? (
          <div className="py-10 text-center text-xs text-stone-500">
            لا توجد سور مطابقة لبحثك
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {filteredSurahs.map((surah) => {
              const startPage = getSurahStartPage(surah.number);

              return (
                <button
                  key={surah.number}
                  onClick={() => handleSelectSurah(surah.number)}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 hover:border-emerald-500/50 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition shadow-sm text-right group active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    {/* Number Badge */}
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-xs flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60 shrink-0">
                      {surah.number}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-stone-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {surah.name}
                      </h3>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        {surah.englishName} · {surah.numberOfAyahs} آيات
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Start Page Badge */}
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200/60 dark:border-stone-700/60">
                      صفحة {startPage}
                    </span>

                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-lg font-medium ${
                        surah.revelationType === 'Meccan'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40'
                      }`}
                    >
                      {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                    </span>

                    <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 transition-transform group-hover:-translate-x-0.5" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
