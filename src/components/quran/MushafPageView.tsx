import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BookOpen,
  Play,
  Pause,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  Compass,
  X,
  RotateCcw,
} from 'lucide-react';
import { MushafPageData, MushafPageAyah, QuranBookmark } from '../../types';
import { fetchMushafPage, QURAN_RECITERS, getSurahStartPage } from '../../services/quranApi';
import { saveQuranWardPosition, saveKhatmaState } from '../../services/trackerService';
import { QuranAyahBottomSheet } from './QuranAyahBottomSheet';

const LAST_PAGE_STORAGE_KEY = 'noor_last_mushaf_page';
const FONT_SIZE_STORAGE_KEY = 'noor_quran_font_size';
const RECITER_STORAGE_KEY = 'noor_quran_reciter';

interface Props {
  initialPage?: number;
  onOpenIndex: () => void;
  bookmark: QuranBookmark | null;
  onSaveBookmark: (surahNumber: number, surahName: string, ayahNumber: number) => void;
}

export const MushafPageView: React.FC<Props> = ({
  initialPage,
  onOpenIndex,
  bookmark,
  onSaveBookmark,
}) => {
  // Current Mushaf Page (1 - 604)
  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (initialPage && initialPage >= 1 && initialPage <= 604) {
      return initialPage;
    }
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

  const [pageData, setPageData] = useState<MushafPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageAnimation, setPageAnimation] = useState<'slide-left' | 'slide-right' | 'fade'>('fade');

  // Font size setting (18px to 32px)
  const [fontSize, setFontSize] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(FONT_SIZE_STORAGE_KEY);
      return stored ? parseInt(stored, 10) : 23;
    } catch {
      return 23;
    }
  });

  // Audio reciter setting
  const [selectedReciter, setSelectedReciter] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(RECITER_STORAGE_KEY);
      return stored || 'ar.alafasy';
    } catch {
      return 'ar.alafasy';
    }
  });

  // Audio playback state
  const [activeAyahNumber, setActiveAyahNumber] = useState<number | null>(null); // global ayah number
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingFullPage, setIsPlayingFullPage] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Selected ayah action popup
  const [selectedAyah, setSelectedAyah] = useState<MushafPageAyah | null>(null);
  const [copiedAyahNum, setCopiedAyahNum] = useState<number | null>(null);

  // Jump to page modal state
  const [isJumpModalOpen, setIsJumpModalOpen] = useState(false);
  const [jumpPageInput, setJumpPageInput] = useState<string>('');

  // Touch Swipe tracking refs
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);
  const pageContainerRef = useRef<HTMLDivElement | null>(null);

  // Save page change to local storage and tracking services
  const recordPageChange = useCallback((pageNum: number) => {
    try {
      localStorage.setItem(LAST_PAGE_STORAGE_KEY, pageNum.toString());
      saveQuranWardPosition({ currentPage: pageNum });
      saveKhatmaState({ currentPage: pageNum });
    } catch (e) {
      console.warn('Failed to record page change', e);
    }
  }, []);

  // Sync if initialPage prop changes
  useEffect(() => {
    if (initialPage && initialPage >= 1 && initialPage <= 604 && initialPage !== currentPage) {
      setCurrentPage(initialPage);
      recordPageChange(initialPage);
    }
  }, [initialPage, recordPageChange]);

  // Load Mushaf Page Data
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    // Stop current audio when turning page
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsPlayingFullPage(false);
      setActiveAyahNumber(null);
    }

    async function loadPage() {
      try {
        const data = await fetchMushafPage(currentPage, selectedReciter);
        if (isMounted) {
          setPageData(data);
          recordPageChange(currentPage);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : 'تعذر تحميل صفحة المصحف';
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPage();

    return () => {
      isMounted = false;
    };
  }, [currentPage, selectedReciter, recordPageChange]);

  // Navigate to Next Page (صفحة تالية)
  const handleNextPage = useCallback(() => {
    if (currentPage < 604) {
      setPageAnimation('slide-right');
      setCurrentPage((prev) => {
        const next = Math.min(604, prev + 1);
        recordPageChange(next);
        return next;
      });
      setSelectedAyah(null);
    }
  }, [currentPage, recordPageChange]);

  // Navigate to Previous Page (صفحة سابقة)
  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setPageAnimation('slide-left');
      setCurrentPage((prev) => {
        const prevPage = Math.max(1, prev - 1);
        recordPageChange(prevPage);
        return prevPage;
      });
      setSelectedAyah(null);
    }
  }, [currentPage, recordPageChange]);

  // Jump directly to specific page
  const handleJumpToPage = (pageNum: number) => {
    const clamped = Math.max(1, Math.min(604, pageNum));
    setPageAnimation('fade');
    setCurrentPage(clamped);
    recordPageChange(clamped);
    setIsJumpModalOpen(false);
    setSelectedAyah(null);
  };

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (document.activeElement?.tagName === 'INPUT') return;

      if (e.key === 'ArrowRight') {
        // In Arabic context: Right arrow flips to Next page
        handleNextPage();
      } else if (e.key === 'ArrowLeft') {
        // Left arrow flips to Previous page
        handlePrevPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextPage, handlePrevPage]);

  // Touch Swipe Handlers (Arabic Pattern: Swipe Right = Next, Swipe Left = Prev)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    const elapsedTime = Date.now() - touchStartTime.current;

    touchStartX.current = null;
    touchStartY.current = null;

    // Must be predominantly horizontal and quick or deliberate
    if (Math.abs(deltaX) > Math.abs(deltaY) * 1.3 && Math.abs(deltaX) > 40 && elapsedTime < 800) {
      if (deltaX > 0) {
        // Swiped towards right: Next Page (حسب النمط العربي)
        handleNextPage();
      } else {
        // Swiped towards left: Previous Page (حسب النمط العربي)
        handlePrevPage();
      }
    }
  };

  // Font size adjust
  const handleFontSizeChange = (delta: number) => {
    setFontSize((prev) => {
      const next = Math.min(32, Math.max(18, prev + delta));
      try {
        localStorage.setItem(FONT_SIZE_STORAGE_KEY, next.toString());
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  // Reciter change
  const handleReciterChange = (reciterId: string) => {
    setSelectedReciter(reciterId);
    try {
      localStorage.setItem(RECITER_STORAGE_KEY, reciterId);
    } catch (e) {
      console.warn(e);
    }
  };

  // Play audio for specific ayah
  const handlePlayAyah = (ayah: MushafPageAyah) => {
    if (!ayah.audio) return;

    if (activeAyahNumber === ayah.number && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      setIsPlayingFullPage(false);
      return;
    }

    setActiveAyahNumber(ayah.number);
    if (audioRef.current) {
      audioRef.current.src = ayah.audio;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((e) => {
          console.warn('Playback error:', e);
          setIsPlaying(false);
        });
    }
  };

  // Play entire page from first ayah
  const handlePlayFullPage = () => {
    if (!pageData || pageData.ayahs.length === 0) return;

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      setIsPlayingFullPage(false);
      setActiveAyahNumber(null);
      return;
    }

    setIsPlayingFullPage(true);
    handlePlayAyah(pageData.ayahs[0]);
  };

  // Auto-advance to next ayah when audio ends
  const handleAudioEnded = () => {
    if (!pageData || activeAyahNumber === null) {
      setIsPlaying(false);
      setIsPlayingFullPage(false);
      return;
    }

    const currentIndex = pageData.ayahs.findIndex((a) => a.number === activeAyahNumber);
    if (currentIndex !== -1 && currentIndex + 1 < pageData.ayahs.length) {
      // Play next ayah on this page
      const nextAyah = pageData.ayahs[currentIndex + 1];
      handlePlayAyah(nextAyah);
    } else if (isPlayingFullPage && currentPage < 604) {
      // Page completed during full page playback, auto-flip to next page
      handleNextPage();
    } else {
      setIsPlaying(false);
      setIsPlayingFullPage(false);
      setActiveAyahNumber(null);
    }
  };

  // Copy Ayah Text
  const handleCopy = (ayah: MushafPageAyah) => {
    const copyText = `﴿${ayah.text}﴾ [سورة ${ayah.surah.name} - الآية ${ayah.numberInSurah}]`;
    navigator.clipboard.writeText(copyText);
    setCopiedAyahNum(ayah.number);
    setTimeout(() => setCopiedAyahNum(null), 2000);
  };

  // Group ayahs on this page by Surah to accurately display Surah Headers & Basmalah
  const surahGroups: { surah: MushafPageAyah['surah']; ayahs: MushafPageAyah[] }[] = [];
  if (pageData && pageData.ayahs.length > 0) {
    let currentSurahNumber: number | null = null;
    let currentGroup: { surah: MushafPageAyah['surah']; ayahs: MushafPageAyah[] } | null = null;

    pageData.ayahs.forEach((ayah) => {
      if (ayah.surah.number !== currentSurahNumber) {
        currentSurahNumber = ayah.surah.number;
        currentGroup = {
          surah: ayah.surah,
          ayahs: [ayah],
        };
        surahGroups.push(currentGroup);
      } else if (currentGroup) {
        currentGroup.ayahs.push(ayah);
      }
    });
  }

  // Primary Surah name for top page header
  const primarySurahName = pageData?.primarySurah?.name || 'سورة';
  const juzNumber = pageData?.juz || 1;

  return (
    <div className="space-y-3 pb-24 animate-in fade-in duration-200">
      {/* Hidden audio element */}
      <audio ref={audioRef} onEnded={handleAudioEnded} onError={() => setIsPlaying(false)} />

      {/* ========================================================
          TOP TOOLBAR: Index, Settings, Reciter, Font Resize
         ======================================================== */}
      <div className="sticky top-14 z-20 -mx-4 px-4 py-2 bg-stone-100/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between gap-2">
        {/* Index button */}
        <button
          onClick={onOpenIndex}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition active:scale-95 shrink-0"
        >
          <BookOpen className="w-4 h-4" />
          <span>فهرس السور</span>
        </button>

        {/* Quick Jump & Reciter Controls */}
        <div className="flex items-center gap-1.5">
          {/* Quick jump to page button */}
          <button
            onClick={() => {
              setJumpPageInput(currentPage.toString());
              setIsJumpModalOpen(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-200/80 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300 transition active:scale-95"
            title="الانتقال لصفحة محددة"
          >
            <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="font-mono">{currentPage}</span>
          </button>

          {/* Font Resize */}
          <div className="flex items-center bg-stone-200/60 dark:bg-stone-800/60 p-0.5 rounded-xl">
            <button
              onClick={() => handleFontSizeChange(2)}
              disabled={fontSize >= 32}
              className="w-7 h-7 flex items-center justify-center text-xs font-bold rounded-lg hover:bg-white dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 disabled:opacity-40"
              title="تكبير الخط"
            >
              A+
            </button>
            <button
              onClick={() => handleFontSizeChange(-2)}
              disabled={fontSize <= 18}
              className="w-7 h-7 flex items-center justify-center text-xs font-bold rounded-lg hover:bg-white dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 disabled:opacity-40"
              title="تصغير الخط"
            >
              A-
            </button>
          </div>
        </div>

        {/* Full Page Audio Toggle */}
        <button
          onClick={handlePlayFullPage}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 shrink-0 ${
            isPlayingFullPage
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-stone-200/80 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
          }`}
          title="تلاوة الصفحة كاملة"
        >
          {isPlayingFullPage ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>إيقاف</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current text-emerald-700 dark:text-emerald-400" />
              <span>تلاوة الصفحة</span>
            </>
          )}
        </button>
      </div>

      {/* Reciter bar */}
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-2xl bg-white/70 dark:bg-stone-900/70 border border-stone-200/60 dark:border-stone-800/60 text-xs">
        <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
          <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>القارئ:</span>
        </div>
        <select
          value={selectedReciter}
          onChange={(e) => handleReciterChange(e.target.value)}
          className="text-xs font-bold py-1 px-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-none focus:ring-1 focus:ring-emerald-600 outline-none"
        >
          {QURAN_RECITERS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* ========================================================
          MUSHAF PAGE CONTAINER (تصميم صفحة المصحف وتقليب الصفحات)
         ======================================================== */}
      <div
        ref={pageContainerRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={`relative rounded-3xl bg-[#fffef7] dark:bg-[#1a1916] border-2 border-amber-400/50 dark:border-amber-900/40 shadow-lg p-3 sm:p-6 select-text overflow-hidden transition-all duration-200 ${
          pageAnimation === 'slide-right'
            ? 'animate-in slide-in-from-right-2 fade-in-50'
            : pageAnimation === 'slide-left'
            ? 'animate-in slide-in-from-left-2 fade-in-50'
            : 'animate-in fade-in'
        }`}
      >
        {/* Subtle Double Islamic Margin Borders */}
        <div className="absolute inset-1.5 sm:inset-2.5 rounded-2xl border border-amber-600/20 dark:border-amber-400/15 pointer-events-none" />
        <div className="absolute inset-2 sm:inset-3 rounded-2xl border border-dashed border-amber-500/10 dark:border-amber-400/5 pointer-events-none" />

        {/* 1. TOP HEADER INSIDE MUSHAF FRAME (ترويسة الصفحة: اسم السورة + رقم الجزء) */}
        <div className="relative pb-2.5 mb-2 border-b border-amber-600/20 dark:border-amber-400/15 flex items-center justify-between text-xs font-bold text-stone-700 dark:text-amber-200/90 select-none">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-600 dark:text-amber-400">✦</span>
            <span>{primarySurahName}</span>
          </div>

          <div className="text-[11px] text-stone-400 dark:text-stone-500 font-normal">
            اسحب يمين ويسار للتقليب
          </div>

          <div className="flex items-center gap-1.5">
            <span>الجزء {juzNumber}</span>
            <span className="text-amber-600 dark:text-amber-400">✦</span>
          </div>
        </div>

        {/* 2. PAGE CONTENT / LOADING / ERROR */}
        {isLoading ? (
          <div className="py-28 text-center text-xs text-stone-500 space-y-3">
            <div className="w-10 h-10 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mx-auto" />
            <p className="font-semibold text-emerald-900 dark:text-emerald-300">
              جاري تحميل الصفحة الكريمة رقم {currentPage}...
            </p>
          </div>
        ) : error ? (
          <div className="py-20 text-center space-y-3">
            <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
            <button
              onClick={() => setCurrentPage((p) => p)}
              className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : pageData ? (
          <div className="min-h-[460px] flex flex-col justify-between">
            {/* Quran Text Content */}
            <div className="space-y-4">
              {surahGroups.map((group, groupIdx) => {
                const startsOnThisPage = group.ayahs.some((a) => a.numberInSurah === 1);

                return (
                  <div key={`${group.surah.number}-${groupIdx}`} className="space-y-3">
                    {/* Surah Header Banner if a Surah starts on this page */}
                    {startsOnThisPage && (
                      <div className="relative text-center my-3 select-none">
                        <div className="inline-flex items-center justify-center gap-3 px-5 sm:px-8 py-2 rounded-2xl bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 dark:from-stone-900 dark:via-emerald-950/40 dark:to-stone-900 border-2 border-amber-400/60 dark:border-amber-700/60 shadow-xs">
                          <span className="text-[11px] font-semibold text-emerald-900 dark:text-emerald-300">
                            {group.surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                          </span>

                          <div className="px-2">
                            <h2
                              style={{ fontFamily: 'var(--font-quran), Amiri, serif' }}
                              className="text-2xl sm:text-3xl font-extrabold text-emerald-950 dark:text-amber-200 tracking-wide"
                            >
                              سُورَةُ {group.surah.name.replace('سُورَةُ ', '')}
                            </h2>
                          </div>

                          <span className="text-[11px] font-semibold text-emerald-900 dark:text-emerald-300 font-mono">
                            {group.surah.numberOfAyahs} آيات
                          </span>
                        </div>

                        {/* Basmalah (unless Surah 9 At-Tawbah or Surah 1 Al-Fatiha) */}
                        {group.surah.number !== 9 && group.surah.number !== 1 && (
                          <div className="text-center py-2.5 my-1">
                            <p
                              style={{ fontFamily: 'var(--font-quran), Amiri, serif' }}
                              className="text-2xl sm:text-3xl text-emerald-950 dark:text-amber-100/90 font-bold"
                            >
                              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Continuous Justified Page Quran Text */}
                    <div
                      style={{
                        fontFamily: 'var(--font-quran), Amiri, serif',
                        fontSize: `${fontSize}px`,
                        lineHeight: `${fontSize * 2.25}px`,
                        textAlign: 'justify',
                        textJustify: 'revert',
                      }}
                      className="text-stone-900 dark:text-stone-100 px-1 pt-1 tracking-normal font-normal"
                    >
                      {group.ayahs.map((ayah) => {
                        const isCurrentPlaying = activeAyahNumber === ayah.number;
                        const isBookmarked =
                          bookmark?.surahNumber === ayah.surah.number &&
                          bookmark?.ayahNumberInSurah === ayah.numberInSurah;
                        const isSelected = selectedAyah?.number === ayah.number;

                        return (
                          <span
                            key={ayah.number}
                            onClick={() => setSelectedAyah(ayah)}
                            className={`cursor-pointer rounded-md px-0.5 transition-colors duration-150 inline ${
                              isCurrentPlaying
                                ? 'bg-amber-300/40 dark:bg-amber-500/30 text-emerald-950 dark:text-amber-200 ring-1 ring-amber-400'
                                : isSelected
                                ? 'bg-emerald-100/80 dark:bg-emerald-950/60 ring-1 ring-emerald-500'
                                : isBookmarked
                                ? 'bg-amber-100/60 dark:bg-amber-950/40 underline decoration-amber-500 decoration-wavy'
                                : 'hover:bg-amber-100/40 dark:hover:bg-stone-800/40'
                            }`}
                            title={`الآية ${ayah.numberInSurah} [سورة ${ayah.surah.name}] (انقر للخيارات)`}
                          >
                            <span>{ayah.text}</span>
                            {/* Ayah End Ornamental Marker ﴿١﴾ */}
                            <span
                              style={{ fontSize: `${Math.max(14, fontSize * 0.72)}px` }}
                              className="inline-flex items-center justify-center mx-1 font-bold text-amber-700 dark:text-amber-400 select-none align-middle font-mono"
                            >
                              ﴿{ayah.numberInSurah}﴾
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 3. BOTTOM FOOTER INSIDE FRAME (تذييل رقم الصفحة) */}
            <div className="relative pt-3 mt-4 border-t border-amber-600/20 dark:border-amber-400/15 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-sans select-none">
              <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400">
                {pageData.ayahs[pageData.ayahs.length - 1]?.surah.name}
              </span>

              {/* Centered Page Number (انقر للانتقال السريع) */}
              <button
                type="button"
                onClick={() => {
                  setJumpPageInput(currentPage.toString());
                  setIsJumpModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 dark:bg-stone-800/90 border border-amber-300/70 dark:border-amber-700/60 hover:bg-amber-200/80 dark:hover:bg-stone-700 transition active:scale-95 cursor-pointer shadow-2xs group"
                title="انقر للانتقال لصفحة محددة"
              >
                <span className="text-amber-600/60 dark:text-amber-400/60 text-xs">—</span>
                <span className="font-bold font-mono text-emerald-950 dark:text-amber-200 text-xs">
                  صفحة {pageData.pageNumber}
                </span>
                <span className="text-amber-600/60 dark:text-amber-400/60 text-xs">—</span>
              </button>

              <span className="text-[11px] text-stone-400 dark:text-stone-500">
                مصحف المدينة
              </span>
            </div>
          </div>
        ) : null}
      </div>

      {/* ========================================================
          SELECTED AYAH TOOLS BOTTOM SHEET (TAFSEER & VOCABULARY)
         ======================================================== */}
      {selectedAyah && (
        <QuranAyahBottomSheet
          ayah={selectedAyah}
          onClose={() => setSelectedAyah(null)}
          isPlayingAudio={activeAyahNumber === selectedAyah.number && isPlaying}
          onToggleAudio={() => handlePlayAyah(selectedAyah)}
          isBookmarked={
            bookmark?.surahNumber === selectedAyah.surah.number &&
            bookmark?.ayahNumberInSurah === selectedAyah.numberInSurah
          }
          onToggleBookmark={() =>
            onSaveBookmark(
              selectedAyah.surah.number,
              selectedAyah.surah.name,
              selectedAyah.numberInSurah
            )
          }
        />
      )}



      {/* ========================================================
          JUMP TO PAGE MODAL
         ======================================================== */}
      {isJumpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>انتقال سريع لصفحة في المصحف</span>
              </h3>
              <button
                onClick={() => setIsJumpModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1.5">
                  رقم الصفحة (1 إلى 604):
                </label>
                <input
                  type="number"
                  min="1"
                  max="604"
                  value={jumpPageInput}
                  onChange={(e) => setJumpPageInput(e.target.value)}
                  placeholder="مثال: 120"
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono text-center text-lg font-bold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Slider for smooth visual scrubbing */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="1"
                  max="604"
                  value={jumpPageInput ? parseInt(jumpPageInput, 10) || currentPage : currentPage}
                  onChange={(e) => setJumpPageInput(e.target.value)}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                  <span>1 (الفاتحة)</span>
                  <span>302 (الكهف)</span>
                  <span>604 (الناس)</span>
                </div>
              </div>

              {/* Quick Jump Buttons to Quarters & Juz */}
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                <p className="text-[11px] font-semibold text-stone-500 mb-1.5">انتقال لأبرز المواضع:</p>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  <button
                    onClick={() => handleJumpToPage(1)}
                    className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 font-bold text-stone-700 dark:text-stone-300"
                  >
                    الفاتحة (1)
                  </button>
                  <button
                    onClick={() => handleJumpToPage(293)}
                    className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 font-bold text-stone-700 dark:text-stone-300"
                  >
                    الكهف (293)
                  </button>
                  <button
                    onClick={() => handleJumpToPage(440)}
                    className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 font-bold text-stone-700 dark:text-stone-300"
                  >
                    يس (440)
                  </button>
                  <button
                    onClick={() => handleJumpToPage(562)}
                    className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 font-bold text-stone-700 dark:text-stone-300"
                  >
                    الملك (562)
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  const val = parseInt(jumpPageInput, 10);
                  if (!isNaN(val)) {
                    handleJumpToPage(val);
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition active:scale-95"
              >
                انتقال للصفحة
              </button>
              <button
                onClick={() => setIsJumpModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold text-xs transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
