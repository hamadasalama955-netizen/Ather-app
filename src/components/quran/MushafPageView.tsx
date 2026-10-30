import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BookOpen,
  Home,
  Play,
  Pause,
  Bookmark,
  BookmarkCheck,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Compass,
  X,
} from 'lucide-react';
import { MushafPageData, MushafPageAyah, QuranBookmark } from '../../types';
import { fetchMushafPage, QURAN_RECITERS } from '../../services/quranApi';
import { saveQuranWardPosition, saveKhatmaState } from '../../services/trackerService';
import { QuranAyahBottomSheet } from './QuranAyahBottomSheet';
import {
  SurahCloudHeader,
  SurahCloudFooter,
  BasmalahBanner,
  toArabicDigits,
} from './MushafIlluminatedBorder';
import { ScreenBackButton } from '../common/ScreenBackButton';

const LAST_PAGE_STORAGE_KEY = 'noor_last_mushaf_page';
const FONT_SIZE_STORAGE_KEY = 'noor_quran_font_size';
const RECITER_STORAGE_KEY = 'noor_quran_reciter';

interface Props {
  initialPage?: number;
  onOpenIndex: () => void;
  bookmark: QuranBookmark | null;
  onSaveBookmark: (surahNumber: number, surahName: string, ayahNumber: number) => void;
  onShowSplash?: () => void;
}

export const MushafPageView: React.FC<Props> = ({
  initialPage,
  onOpenIndex,
  bookmark,
  onSaveBookmark,
  onShowSplash,
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
  const [activeAyahNumber, setActiveAyahNumber] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingFullPage, setIsPlayingFullPage] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Selected ayah action popup
  const [selectedAyah, setSelectedAyah] = useState<MushafPageAyah | null>(null);

  // Jump to page modal state
  const [isJumpModalOpen, setIsJumpModalOpen] = useState(false);
  const [jumpPageInput, setJumpPageInput] = useState<string>('');

  // Touch Swipe tracking refs
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);
  const pageContainerRef = useRef<HTMLDivElement | null>(null);

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

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

  // Always scroll to top at "بسم الله الرحمن الرحيم" when opening surah or turning page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    if (pageContainerRef.current) {
      pageContainerRef.current.scrollTop = 0;
    }
  }, [currentPage]);

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
          const msg = err instanceof Error ? err.message : 'تعذر تحميل الصفحة';
          setError(msg);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadPage();
    return () => {
      isMounted = false;
    };
  }, [currentPage, selectedReciter, recordPageChange]);

  // Turn to Next Page (Mushaf page orientation: RTL, Next page = currentPage + 1)
  const handleNextPage = useCallback(() => {
    if (currentPage < 604) {
      setPageAnimation('slide-left');
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage]);

  // Turn to Previous Page (Previous page = currentPage - 1)
  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setPageAnimation('slide-right');
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  // Handle touch gestures for smooth swiping
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    const diffY = e.changedTouches[0].clientY - touchStartY.current;
    const timeTaken = Date.now() - touchStartTime.current;

    // Reset touch refs
    touchStartX.current = null;
    touchStartY.current = null;

    // Only process horizontal swipes if horizontal diff is significantly larger than vertical
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.5 && timeTaken < 600) {
      // In RTL (Arabic Quran):
      // Swiping to the Left (diffX < 0) moves forward to NEXT page
      // Swiping to the Right (diffX > 0) moves back to PREVIOUS page
      if (diffX < 0) {
        handleNextPage();
      } else {
        handlePrevPage();
      }
    }
  };

  // Font size changer
  const handleFontSizeChange = (delta: number) => {
    setFontSize((prev) => {
      const next = Math.min(32, Math.max(18, prev + delta));
      try {
        localStorage.setItem(FONT_SIZE_STORAGE_KEY, next.toString());
      } catch {}
      return next;
    });
  };

  // Reciter changer
  const handleReciterChange = (reciterId: string) => {
    setSelectedReciter(reciterId);
    try {
      localStorage.setItem(RECITER_STORAGE_KEY, reciterId);
    } catch {}
  };

  // Audio Playback
  const handlePlayAyah = (ayah: MushafPageAyah) => {
    const audioSrc = ayah.audioUrl || ayah.audio;
    if (!audioSrc) return;

    if (activeAyahNumber === ayah.number && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      setIsPlayingFullPage(false);
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioSrc;
        audioRef.current.play().catch((e) => console.warn('Audio playback error', e));
        setActiveAyahNumber(ayah.number);
        setIsPlaying(true);
      }
    }
  };

  const handlePlayFullPage = () => {
    if (!pageData || pageData.ayahs.length === 0) return;

    if (isPlayingFullPage && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      setIsPlayingFullPage(false);
      setActiveAyahNumber(null);
    } else {
      setIsPlayingFullPage(true);
      const firstAyah = pageData.ayahs[0];
      const audioSrc = firstAyah?.audioUrl || firstAyah?.audio;
      if (firstAyah && audioRef.current && audioSrc) {
        audioRef.current.src = audioSrc;
        audioRef.current.play().catch((e) => console.warn('Audio playback error', e));
        setActiveAyahNumber(firstAyah.number);
        setIsPlaying(true);
      }
    }
  };

  const handleAudioEnded = () => {
    if (!pageData) {
      setIsPlaying(false);
      setIsPlayingFullPage(false);
      setActiveAyahNumber(null);
      return;
    }

    if (isPlayingFullPage) {
      const currentIndex = pageData.ayahs.findIndex((a) => a.number === activeAyahNumber);
      if (currentIndex !== -1 && currentIndex < pageData.ayahs.length - 1) {
        const nextAyah = pageData.ayahs[currentIndex + 1];
        const nextAudioSrc = nextAyah?.audioUrl || nextAyah?.audio;
        if (nextAyah && audioRef.current && nextAudioSrc) {
          audioRef.current.src = nextAudioSrc;
          audioRef.current.play().catch((e) => console.warn('Audio error', e));
          setActiveAyahNumber(nextAyah.number);
          setIsPlaying(true);
          return;
        }
      } else if (currentIndex === pageData.ayahs.length - 1 && currentPage < 604) {
        handleNextPage();
        return;
      }
    }

    setIsPlaying(false);
    setIsPlayingFullPage(false);
    setActiveAyahNumber(null);
  };

  const handleJumpToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= 604) {
      setCurrentPage(pageNum);
      setIsJumpModalOpen(false);
    }
  };

  // Group ayahs by Surah on this page
  const surahGroups: { surah: MushafPageAyah['surah']; ayahs: MushafPageAyah[] }[] = [];
  if (pageData) {
    let currentSurahNumber = -1;
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

  const primarySurah = pageData?.primarySurah;
  const primarySurahName = primarySurah?.name || 'سورة';
  const primarySurahNum = primarySurah?.number || 1;
  const juzNumber = pageData?.juz || Math.min(30, Math.ceil(currentPage / 20.13)) || 1;
  const hizbNumber = pageData?.ayahs[0]?.hizbQuarter
    ? Math.ceil(pageData.ayahs[0].hizbQuarter / 4)
    : Math.min(60, Math.ceil(currentPage / 10.06)) || 1;

  // Toggle bookmark for page
  const isPageBookmarked =
    bookmark &&
    pageData?.ayahs.some(
      (a) => a.surah.number === bookmark.surahNumber && a.numberInSurah === bookmark.ayahNumberInSurah
    );

  const handleTogglePageBookmark = () => {
    if (pageData && pageData.ayahs.length > 0) {
      const targetAyah = pageData.ayahs[0];
      onSaveBookmark(targetAyah.surah.number, targetAyah.surah.name, targetAyah.numberInSurah);
    }
  };

  return (
    <div className="space-y-3 pb-24 animate-in fade-in duration-200 select-none">
      {/* Hidden audio element */}
      <audio ref={audioRef} onEnded={handleAudioEnded} onError={() => setIsPlaying(false)} />

      {/* ========================================================
          1. TOP APP BAR MATCHING IMAGE_14.PNG
          [Left: Surah Title] [Center: Home Icon] [Right: Bookmark Icon]
         ======================================================== */}
      <div className="flex items-center justify-between px-2 py-1.5 rounded-2xl bg-[#faf8f5] dark:bg-[#141414] border border-[#d4af37]/25 shadow-2xs">
        {/* Left in RTL: Surah Title and Number (e.g. "٢. البقرة") */}
        <div className="flex items-center gap-1.5">
          <span
            className="text-sm sm:text-base font-extrabold text-[#1c1917] dark:text-[#f5e6b8]"
            style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
          >
            {toArabicDigits(primarySurahNum)}. {primarySurahName.replace('سُورَةُ ', '')}
          </span>
        </div>

        {/* Center: Back to Index Button matching image_1d94b71d.png */}
        <ScreenBackButton onClick={onOpenIndex} ariaLabel="الرجوع إلى الفهرس" />

        {/* Right in RTL: Bookmark Toggle matching image_14.png */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleTogglePageBookmark}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition active:scale-95 shadow-2xs ${
              isPageBookmarked
                ? 'bg-[#d4af37] text-stone-950 border-[#d4af37]'
                : 'bg-white dark:bg-[#1a1814] border-[#d4af37]/30 text-stone-700 dark:text-[#d4af37] hover:border-[#d4af37]'
            }`}
            title={isPageBookmarked ? 'تم حفظ الفاصلة' : 'حفظ فاصلة القراءة في هذه الصفحة'}
          >
            {isPageBookmarked ? (
              <BookmarkCheck className="w-4 h-4 fill-current text-stone-950" />
            ) : (
              <Bookmark className="w-4 h-4 text-[#b89328] dark:text-[#d4af37]" />
            )}
          </button>
        </div>
      </div>

      {/* ========================================================
          SUB-BAR CONTROLS: Reciter, Font Size, Audio
         ======================================================== */}
      <div className="flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-2xl bg-[#faf8f5]/90 dark:bg-[#141414]/90 border border-stone-200/60 dark:border-stone-800/60 text-xs">
        {/* Quick Recitation Play/Pause Button - No reciter name written, plays immediately */}
        <button
          onClick={handlePlayFullPage}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 shadow-2xs ${
            isPlayingFullPage
              ? 'bg-[#d4af37] text-stone-950 font-black'
              : 'bg-white dark:bg-[#1a1814] text-stone-800 dark:text-[#d4af37] border border-[#d4af37]/30 hover:border-[#d4af37]'
          }`}
          title="تلاوة الصفحة صوتياً"
        >
          {isPlayingFullPage ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>إيقاف التلاوة</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current text-[#b89328] dark:text-[#d4af37]" />
              <span>تلاوة</span>
            </>
          )}
        </button>

        {/* Font resize buttons */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-stone-200/60 dark:bg-stone-800/60 p-0.5 rounded-lg border border-stone-300/40 dark:border-stone-700/50">
            <button
              onClick={() => handleFontSizeChange(2)}
              disabled={fontSize >= 32}
              className="w-6 h-6 flex items-center justify-center text-[10px] font-bold rounded hover:bg-white dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 disabled:opacity-40"
              title="تكبير الخط"
            >
              A+
            </button>
            <button
              onClick={() => handleFontSizeChange(-2)}
              disabled={fontSize <= 18}
              className="w-6 h-6 flex items-center justify-center text-[10px] font-bold rounded hover:bg-white dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 disabled:opacity-40"
              title="تصغير الخط"
            >
              A-
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. AUTHENTIC MADINAH MUSHAF ILLUMINATED FRAME (IMAGE_14.PNG)
         ======================================================== */}
      <div
        ref={pageContainerRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={`relative rounded-2xl sm:rounded-3xl p-1.5 sm:p-3.5 shadow-xl select-text transition-all duration-200 overflow-hidden -mx-2 sm:mx-0 ${
          pageAnimation === 'slide-right'
            ? 'animate-in slide-in-from-right-2 fade-in-50'
            : pageAnimation === 'slide-left'
            ? 'animate-in slide-in-from-left-2 fade-in-50'
            : 'animate-in fade-in'
        } ${
          isDark
            ? 'bg-[#0a0a0a] border-2 border-[#d4af37]/40'
            : 'bg-[#faf8f5] border-2 border-[#d4af37]/50'
        }`}
        style={{
          boxShadow: isDark
            ? '0 8px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(212, 175, 55, 0.15)'
            : '0 8px 24px rgba(184, 147, 40, 0.12)',
        }}
      >
        {/* Authentic Madinah Lapis Lazuli & Gold Arabesque Border (كما في image_14.png) */}
        <div className="relative rounded-xl sm:rounded-2xl p-1.5 sm:p-2.5 bg-[#0d233d] dark:bg-[#081525] border-2 border-[#d4af37] shadow-inner">
          {/* Corner Ruby Red Rosette Jewels */}
          <div className="absolute top-1 left-1 w-3.5 h-3.5 rounded-full bg-[#991b1b] border border-[#d4af37] flex items-center justify-center shadow-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
          </div>
          <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#991b1b] border border-[#d4af37] flex items-center justify-center shadow-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
          </div>
          <div className="absolute bottom-1 left-1 w-3.5 h-3.5 rounded-full bg-[#991b1b] border border-[#d4af37] flex items-center justify-center shadow-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
          </div>
          <div className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-[#991b1b] border border-[#d4af37] flex items-center justify-center shadow-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
          </div>

          {/* Side Center Ruby Medallions */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0.5 w-3 h-3 rounded-full bg-[#991b1b] border border-[#d4af37] flex items-center justify-center shadow-xs">
            <div className="w-1 h-1 rounded-full bg-[#d4af37]" />
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-0.5 w-3 h-3 rounded-full bg-[#991b1b] border border-[#d4af37] flex items-center justify-center shadow-xs">
            <div className="w-1 h-1 rounded-full bg-[#d4af37]" />
          </div>

          {/* Inner Golden Double Border Canvas */}
          <div
            className={`rounded-lg sm:rounded-xl p-2 sm:p-4 border-2 border-[#d4af37] transition-colors ${
              isDark ? 'bg-[#141414]' : 'bg-[#fffefb]'
            }`}
            style={{
              backgroundImage: isDark
                ? 'radial-gradient(ellipse at 50% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 80%)'
                : 'radial-gradient(ellipse at 50% 50%, rgba(212, 175, 55, 0.03) 0%, transparent 80%)',
            }}
          >
            {/* Loading / Error States */}
            {isLoading ? (
              <div className="py-28 text-center text-xs space-y-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin mx-auto" />
                <p className="font-semibold text-stone-700 dark:text-[#d4af37]">
                  جاري تحميل الصفحة الكريمة رقم {toArabicDigits(currentPage)}...
                </p>
              </div>
            ) : error ? (
              <div className="py-20 text-center space-y-3">
                <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
                <button
                  onClick={() => setCurrentPage((p) => p)}
                  className="px-4 py-2 rounded-xl bg-[#d4af37] text-stone-950 text-xs font-bold hover:bg-[#c5a059] transition"
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
                    const endsOnThisPage = group.ayahs.some(
                      (a) => a.numberInSurah === group.surah.numberOfAyahs
                    );

                    return (
                      <div key={`${group.surah.number}-${groupIdx}`} className="space-y-3">
                        {/* 1. Surah Header Cloud Cartouche if a Surah starts on this page (image_14.png) */}
                        {startsOnThisPage && (
                          <div className="space-y-2">
                            <SurahCloudHeader surahName={group.surah.name} isDark={isDark} />

                            {/* Basmalah Banner (unless Surah 9 At-Tawbah or Surah 1 Al-Fatiha) */}
                            {group.surah.number !== 9 && group.surah.number !== 1 && (
                              <BasmalahBanner isDark={isDark} />
                            )}
                          </div>
                        )}

                        {/* 2. Continuous Justified Page Quran Text */}
                        <div
                          style={{
                            fontFamily: "'Amiri Quran', 'Amiri', 'Traditional Arabic', serif",
                            fontSize: `${fontSize}px`,
                            lineHeight: `${fontSize * 2.3}px`,
                            textAlign: 'justify',
                            textJustify: 'revert',
                          }}
                          className={`px-1 pt-1 tracking-normal font-normal ${
                            isDark ? 'text-[#f5e6b8]' : 'text-[#1c1917]'
                          }`}
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
                                    ? 'bg-[#d4af37]/40 text-stone-950 dark:text-[#fef08a] ring-1 ring-[#d4af37]'
                                    : isSelected
                                    ? 'bg-amber-200/60 dark:bg-amber-950/60 ring-1 ring-[#d4af37]'
                                    : isBookmarked
                                    ? 'bg-[#d4af37]/25 underline decoration-[#d4af37] decoration-wavy'
                                    : 'hover:bg-[#d4af37]/15'
                                }`}
                                title={`الآية ${toArabicDigits(ayah.numberInSurah)} [سورة ${ayah.surah.name}] (انقر للتفسير)`}
                              >
                                <span>{ayah.text}</span>
                                {/* Ayah End Traditional Marker ﴿١﴾ */}
                                <span
                                  style={{ fontSize: `${Math.max(13, fontSize * 0.72)}px` }}
                                  className="inline-flex items-center justify-center mx-1 font-bold text-[#b89328] dark:text-[#d4af37] select-none align-middle font-mono"
                                >
                                  ﴿{toArabicDigits(ayah.numberInSurah)}﴾
                                </span>
                              </span>
                            );
                          })}
                        </div>

                        {/* 3. Surah Footer Cloud Cartouche if a Surah ends on this page (image_14.png) */}
                        {endsOnThisPage && (
                          <SurahCloudFooter ayahCount={group.surah.numberOfAyahs} isDark={isDark} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* ========================================================
          3. OUTSIDE BOTTOM MARGINS MATCHING IMAGE_14.PNG
          [Right: الجزء ١] [Center: رقم الصفحة ٢] [Left: الحزب ١]
         ======================================================== */}
      <div className="flex items-center justify-between px-3 py-1 text-xs font-bold text-stone-700 dark:text-[#a39e93] select-none">
        {/* Right in RTL: Juz */}
        <span
          className="text-sm font-extrabold text-[#b89328] dark:text-[#d4af37]"
          style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
        >
          الجزء {toArabicDigits(juzNumber)}
        </span>

        {/* Center: Page Number Pill (Clickable to jump) */}
        <button
          onClick={() => {
            setJumpPageInput(currentPage.toString());
            setIsJumpModalOpen(true);
          }}
          className="px-4 py-1 rounded-full bg-[#faf8f5] dark:bg-[#141414] border border-[#d4af37]/40 hover:border-[#d4af37] text-stone-900 dark:text-[#d4af37] shadow-2xs font-mono text-xs font-black transition active:scale-95"
          title="انقر للانتقال السريع لصفحة"
        >
          {toArabicDigits(currentPage)}
        </button>

        {/* Left in RTL: Hizb */}
        <span
          className="text-sm font-extrabold text-[#b89328] dark:text-[#d4af37]"
          style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
        >
          الحزب {toArabicDigits(hizbNumber)}
        </span>
      </div>

      {/* ========================================================
          PAGE NAVIGATION ARROWS (Floating Bottom Bar)
         ======================================================== */}
      <div className="flex items-center justify-between pt-1 px-1">
        <button
          onClick={handleNextPage}
          disabled={currentPage >= 604}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#faf8f5] dark:bg-[#141414] border border-[#d4af37]/30 hover:border-[#d4af37] text-xs font-bold text-stone-800 dark:text-[#d4af37] disabled:opacity-40 transition active:scale-95 shadow-2xs"
        >
          <ChevronRight className="w-4 h-4 text-[#d4af37]" />
          <span>الصفحة التالية ({toArabicDigits(Math.min(604, currentPage + 1))})</span>
        </button>

        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#faf8f5] dark:bg-[#141414] border border-[#d4af37]/30 hover:border-[#d4af37] text-xs font-bold text-stone-800 dark:text-[#d4af37] disabled:opacity-40 transition active:scale-95 shadow-2xs"
        >
          <span>الصفحة السابقة ({toArabicDigits(Math.max(1, currentPage - 1))})</span>
          <ChevronLeft className="w-4 h-4 text-[#d4af37]" />
        </button>
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
          <div className="w-full max-w-sm rounded-3xl bg-[#faf8f5] dark:bg-[#141414] border border-[#d4af37]/40 p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-2">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#d4af37]" />
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
                <label className="block text-xs font-semibold text-stone-600 dark:text-[#a39e93] mb-1.5">
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
                  className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-[#1a1814] border border-[#d4af37]/30 font-mono text-center text-lg font-bold text-stone-900 dark:text-[#f5e6b8] focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
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
                  className="w-full accent-[#d4af37]"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                  <span>1 (الفاتحة)</span>
                  <span>302 (الكهف)</span>
                  <span>604 (الناس)</span>
                </div>
              </div>

              {/* Quick Jump Buttons */}
              <div className="pt-2 border-t border-[#d4af37]/20">
                <p className="text-[11px] font-semibold text-stone-500 dark:text-[#a39e93] mb-1.5">
                  انتقال لأبرز المواضع:
                </p>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  <button
                    onClick={() => handleJumpToPage(1)}
                    className="p-1.5 rounded-xl bg-white dark:bg-[#1a1814] border border-stone-200/80 dark:border-stone-800 hover:border-[#d4af37] font-bold text-stone-700 dark:text-[#d4af37]"
                  >
                    الفاتحة (1)
                  </button>
                  <button
                    onClick={() => handleJumpToPage(293)}
                    className="p-1.5 rounded-xl bg-white dark:bg-[#1a1814] border border-stone-200/80 dark:border-stone-800 hover:border-[#d4af37] font-bold text-stone-700 dark:text-[#d4af37]"
                  >
                    الكهف (293)
                  </button>
                  <button
                    onClick={() => handleJumpToPage(440)}
                    className="p-1.5 rounded-xl bg-white dark:bg-[#1a1814] border border-stone-200/80 dark:border-stone-800 hover:border-[#d4af37] font-bold text-stone-700 dark:text-[#d4af37]"
                  >
                    يس (440)
                  </button>
                  <button
                    onClick={() => handleJumpToPage(562)}
                    className="p-1.5 rounded-xl bg-white dark:bg-[#1a1814] border border-stone-200/80 dark:border-stone-800 hover:border-[#d4af37] font-bold text-stone-700 dark:text-[#d4af37]"
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
                className="flex-1 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#c5a059] text-stone-950 font-bold text-xs shadow-md transition active:scale-95"
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
