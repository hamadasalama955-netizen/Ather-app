import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Flame,
  Plus,
  Minus,
  Trophy,
  RotateCcw,
  Milestone,
  Check,
  Compass,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { KhatmaTrackerData, getKhatmaState, saveKhatmaState } from '../../services/trackerService';

interface Props {
  onOpenQuranTab: () => void;
  isDark?: boolean;
}

export const KhatmaTrackerCard: React.FC<Props> = ({ onOpenQuranTab, isDark: propIsDark }) => {
  const [khatma, setKhatma] = useState<KhatmaTrackerData>(getKhatmaState());
  const [inputPage, setInputPage] = useState<string>(String(khatma.currentPage));
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  const isDark = propIsDark !== undefined
    ? propIsDark
    : typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  const TOTAL_PAGES = 604;
  const targetDays = khatma.targetDays || 30;
  const currentPage = Math.max(1, Math.min(TOTAL_PAGES, khatma.currentPage || 1));

  // Calculations
  const pagesPerDay = Math.ceil(TOTAL_PAGES / targetDays);
  const remainingPages = Math.max(0, TOTAL_PAGES - currentPage);
  const progressPercent = Math.min(100, Math.round((currentPage / TOTAL_PAGES) * 100));
  const remainingDays = Math.ceil(remainingPages / (pagesPerDay || 1));
  const currentJuz = Math.min(30, Math.floor((currentPage - 1) / 20) + 1);

  // Target presets
  const presets = [
    { days: 30, label: '٣٠ يوماً (شهر)', pages: 20 },
    { days: 60, label: '٦٠ يوماً (شهران)', pages: 10 },
    { days: 90, label: '٩٠ يوماً (٣ أشهر)', pages: 7 },
    { days: 120, label: '١٢٠ يوماً (٤ أشهر)', pages: 5 },
  ];

  const handleUpdateTargetDays = (days: number) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
    const updated = saveKhatmaState({ targetDays: days });
    setKhatma(updated);
  };

  const handleSavePage = (newPage: number) => {
    const clamped = Math.max(1, Math.min(TOTAL_PAGES, newPage));
    const updated = saveKhatmaState({ currentPage: clamped });
    setKhatma(updated);
    setInputPage(String(clamped));

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(25);
    }
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 2000);
  };

  const handleAddPages = (delta: number) => {
    handleSavePage(currentPage + delta);
  };

  // Ring calculations
  const ringRadius = 46;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const strokeOffset = ringCircumference - (ringCircumference * progressPercent) / 100;

  // Major milestone checkpoints across 30 Juz
  const milestones = [
    { juz: 1, page: 1, label: 'الفاتحة' },
    { juz: 5, page: 100, label: 'النساء' },
    { juz: 10, page: 200, label: 'التوبة' },
    { juz: 15, page: 300, label: 'الكهف' },
    { juz: 20, page: 400, label: 'النمل' },
    { juz: 25, page: 500, label: 'الجاثية' },
    { juz: 30, page: 604, label: 'الختم' },
  ];

  return (
    <div
      className={`rounded-3xl border p-4 sm:p-5 shadow-sm space-y-4 transition-colors select-none ${
        isDark
          ? 'bg-[#141414] border-[#d4af37]/35 text-white'
          : 'bg-[#faf8f5] border-[#c5a059]/40 text-stone-900'
      }`}
      dir="rtl"
    >
      {/* 1. Header Banner */}
      <div
        className={`relative overflow-hidden rounded-3xl p-5 sm:p-6 border-2 transition-all ${
          isDark
            ? 'bg-gradient-to-br from-[#241e15] via-[#1a1711] to-[#0d0c0a] border-[#d4af37]/45 text-white shadow-xl'
            : 'bg-gradient-to-br from-[#ffffff] via-[#fdfbf7] to-[#f5eedc] border-[#ca8a04] text-stone-900 shadow-md'
        }`}
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center sm:text-right">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full border bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-[#facc15]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>مصحف التلاوة والتدبر</span>
            </div>

            <h3
              className={`text-2xl sm:text-3xl font-black tracking-tight ${
                isDark ? 'text-[#f5e6b8]' : 'text-stone-950'
              }`}
              style={{ fontFamily: "'Traditional Arabic', 'Amiri', serif" }}
            >
              {progressPercent === 100 ? 'تمت الختمة المباركة بفضل الله! 🎉' : 'رحلة ختم القرآن العظيم'}
            </h3>

            <p className={`text-xs leading-relaxed max-w-sm ${isDark ? 'text-amber-200/90' : 'text-stone-700'}`}>
              {progressPercent === 100
                ? 'تقبل الله ختمتكم وجعل القرآن الكريم شفيعاً ونوراً في قلوبكم'
                : `هدفك المبارك: إتمام الختمة في ${targetDays} يوماً بمعدل قراءة ${pagesPerDay} صفحة يومياً`}
            </p>
          </div>

          {/* Radial Progress Gauge */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 drop-shadow-md" viewBox="0 0 110 110">
              <circle
                cx="55"
                cy="55"
                r={ringRadius}
                fill="none"
                stroke={isDark ? '#2a241b' : '#e7e0cf'}
                strokeWidth="8"
              />
              <circle
                cx="55"
                cy="55"
                r={ringRadius}
                fill="none"
                stroke={isDark ? '#facc15' : '#ca8a04'}
                strokeWidth="8"
                strokeDasharray={ringCircumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-xl font-black font-mono ${isDark ? 'text-[#fef08a]' : 'text-stone-950'}`}>
                {progressPercent}%
              </span>
              <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400">
                مكتمل
              </span>
            </div>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="relative z-10 mt-4 pt-3 border-t border-[#d4af37]/25 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-stone-100/90 dark:bg-black/40 rounded-2xl p-2.5 border border-stone-200 dark:border-amber-500/25">
            <div className="text-[10px] font-bold text-stone-500 dark:text-amber-300">الجزء الحالي</div>
            <div className="text-sm font-black font-mono text-stone-900 dark:text-white mt-0.5">
              {currentJuz} / 30
            </div>
          </div>

          <div className="bg-stone-100/90 dark:bg-black/40 rounded-2xl p-2.5 border border-stone-200 dark:border-amber-500/25">
            <div className="text-[10px] font-bold text-stone-500 dark:text-amber-300">المتبقي للختم</div>
            <div className="text-sm font-black font-mono text-amber-700 dark:text-[#facc15] mt-0.5">
              {remainingPages} ص
            </div>
          </div>

          <div className="bg-stone-100/90 dark:bg-black/40 rounded-2xl p-2.5 border border-stone-200 dark:border-amber-500/25">
            <div className="text-[10px] font-bold text-stone-500 dark:text-amber-300">الأيام المقدرة</div>
            <div className="text-sm font-black font-mono text-stone-900 dark:text-white mt-0.5">
              ~{remainingDays} يوماً
            </div>
          </div>
        </div>
      </div>

      {/* 2. Milestone Road Map (30 Juz) */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#181818] border border-stone-200 dark:border-stone-800 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-1.5 text-stone-900 dark:text-[#f5e6b8]">
            <Milestone className="w-4 h-4 text-[#ca8a04]" />
            <span>خريطة طريق الختمة المباركة (٣٠ جزءاً)</span>
          </div>
          <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-[#facc15]">
            صفحة {currentPage} من ٦٠٤
          </span>
        </div>

        {/* Milestone Steps Bar */}
        <div className="relative pt-2 pb-1">
          <div className="absolute top-4 left-3 right-3 h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full" />
          <div
            className="absolute top-4 right-3 h-1.5 bg-gradient-to-l from-[#d4af37] to-[#ca8a04] rounded-full transition-all duration-300"
            style={{ width: `calc(${progressPercent}% * 0.94)` }}
          />

          <div className="relative flex justify-between items-center text-center">
            {milestones.map((ms) => {
              const reached = currentPage >= ms.page;
              return (
                <div key={ms.juz} className="flex flex-col items-center">
                  <button
                    onClick={() => handleSavePage(ms.page)}
                    title={`انتقال إلى صفحة ${ms.page}`}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                      reached
                        ? 'bg-gradient-to-r from-[#d4af37] to-[#ca8a04] text-stone-950 shadow-xs scale-105'
                        : 'bg-stone-100 dark:bg-stone-900 text-stone-500 border border-stone-300 dark:border-stone-700'
                    }`}
                  >
                    {reached ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : `ج${ms.juz}`}
                  </button>
                  <span className="text-[9px] font-bold text-stone-600 dark:text-stone-300 mt-1">
                    {ms.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Duration Selector Presets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <label className="flex items-center gap-1.5 text-stone-800 dark:text-stone-200">
            <Calendar className="w-3.5 h-3.5 text-amber-700 dark:text-[#facc15]" />
            <span>حدد مدة الختمة المرغوبة:</span>
          </label>
          <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-[#facc15]">
            {pagesPerDay} صفحة يومياً
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.days}
              onClick={() => handleUpdateTargetDays(preset.days)}
              className={`p-3 rounded-2xl border text-center transition active:scale-95 ${
                targetDays === preset.days
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#ca8a04] text-stone-950 font-black border-[#d4af37] shadow-sm'
                  : 'bg-white dark:bg-[#181818] border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-[#d4af37]/50'
              }`}
            >
              <div className="text-xs font-black">{preset.label}</div>
              <div className="text-[10px] mt-0.5 opacity-80">
                {preset.pages} صفحة / يوم
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Quick Page Progress Controller */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#181818] border border-stone-200 dark:border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
            تسجيل تقدم القراءة:
          </span>
          {showSavedFeedback && (
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>تم الحفظ</span>
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => handleAddPages(-1)}
            disabled={currentPage <= 1}
            className="flex-1 py-2 px-3 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-bold text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-200 transition disabled:opacity-40"
          >
            -١ صفحة
          </button>

          <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-[#d4af37]/40 text-center font-mono font-black text-sm text-stone-950 dark:text-[#fef08a]">
            صفحة {currentPage}
          </div>

          <button
            onClick={() => handleAddPages(1)}
            disabled={currentPage >= TOTAL_PAGES}
            className="flex-1 py-2 px-3 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-stone-950 font-bold text-xs hover:from-[#fef08a] hover:to-[#d4af37] transition shadow-xs disabled:opacity-40"
          >
            +١ صفحة
          </button>

          <button
            onClick={() => handleAddPages(5)}
            disabled={currentPage >= TOTAL_PAGES}
            className="py-2 px-3 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-bold text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-200 transition disabled:opacity-40"
          >
            +٥
          </button>
        </div>

        {/* Direct CTA to open Mushaf */}
        <button
          onClick={onOpenQuranTab}
          className="w-full py-3 px-4 rounded-2xl bg-stone-900 dark:bg-[#201d17] border border-[#d4af37]/40 text-white font-black text-xs sm:text-sm hover:border-[#d4af37] transition flex items-center justify-center gap-2 shadow-sm active:scale-98"
        >
          <BookOpen className="w-4 h-4 text-[#facc15]" />
          <span>فتح المصحف الشريف والمتابعة من صفحة {currentPage}</span>
          <ArrowRight className="w-4 h-4 text-[#facc15] rotate-180" />
        </button>
      </div>
    </div>
  );
};
