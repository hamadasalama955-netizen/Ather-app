import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Flame,
  Plus,
  Minus,
  Sparkles,
  Trophy,
  Save,
  RotateCcw,
  Milestone,
  Check,
  Compass,
} from 'lucide-react';
import { KhatmaTrackerData, getKhatmaState, saveKhatmaState } from '../../services/trackerService';

interface Props {
  onOpenQuranTab: () => void;
}

export const KhatmaTrackerCard: React.FC<Props> = ({ onOpenQuranTab }) => {
  const [khatma, setKhatma] = useState<KhatmaTrackerData>(getKhatmaState());
  const [inputPage, setInputPage] = useState<string>(String(khatma.currentPage));
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

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
    { days: 30, label: '30 يوماً (شهر)', pages: 20 },
    { days: 60, label: '60 يوماً (شهران)', pages: 10 },
    { days: 90, label: '90 يوماً (3 أشهر)', pages: 7 },
    { days: 120, label: '120 يوماً (4 أشهر)', pages: 5 },
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
      navigator.vibrate(30);
    }
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 2000);
  };

  const handleManualInputSave = () => {
    const val = parseInt(inputPage, 10);
    if (!isNaN(val)) {
      handleSavePage(val);
    }
  };

  const handleResetKhatma = () => {
    if (confirm('هل تريد بدء ختمة جديدة والعودة للصفحة 1؟')) {
      handleSavePage(1);
    }
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
    <div className="rounded-3xl bg-[#fdfbf7] dark:bg-[#1c1611] border border-amber-900/20 dark:border-amber-700/40 p-4 sm:p-5 shadow-sm space-y-4">
      {/* 1. Ancient Manuscript Inspired Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2a1d13] via-[#3d2a1b] to-[#1c120a] text-white p-5 shadow-lg border-2 border-amber-500/40">
        {/* Subtle antique parchment texture grid */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#fde68a_1px,transparent_1px)] [background-size:14px_14px]" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center sm:text-right">
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-bold px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>مصحف التلاوة والتدبر</span>
            </div>

            <h3
              className="text-2xl sm:text-3xl font-extrabold text-amber-100 tracking-tight"
              style={{ fontFamily: "'Traditional Arabic', 'Amiri', serif" }}
            >
              {progressPercent === 100 ? 'تمت الختمة المباركة بفضل الله! 🎉' : `رحلة ختم القرآن العظيم`}
            </h3>

            <p className="text-xs text-amber-200/90 leading-relaxed max-w-sm">
              {progressPercent === 100
                ? 'تقبل الله ختمتكم وجعل القرآن العظيم حجة لكم وشفيعاً ونوراً في قلوبكم'
                : `هدفك: إتمام الختمة في ${targetDays} يوماً بمعدل قراءة ${pagesPerDay} صفحة يومياً`}
            </p>
          </div>

          {/* Attractive Circular Manuscript Progress Ring */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 drop-shadow-md" viewBox="0 0 110 110">
              <defs>
                <linearGradient id="manuscriptGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="40%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
              </defs>
              <circle
                cx="55"
                cy="55"
                r={ringRadius}
                fill="none"
                stroke="#451a03"
                strokeWidth="7"
                opacity="0.6"
              />
              <circle
                cx="55"
                cy="55"
                r={ringRadius}
                fill="none"
                stroke="url(#manuscriptGold)"
                strokeWidth="7"
                strokeDasharray={ringCircumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black font-mono tabular-nums text-amber-200 leading-none">
                {progressPercent}%
              </span>
              <span className="text-[10px] text-amber-300/80 font-serif mt-0.5">
                مكتمل
              </span>
            </div>
          </div>
        </div>

        {/* Highlights Row */}
        <div className="relative z-10 mt-4 pt-3 border-t border-amber-600/30 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-black/35 rounded-xl p-2 border border-amber-500/20">
            <div className="text-[10px] text-amber-300">الجزء الحالي</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">
              {currentJuz} / 30
            </div>
          </div>
          <div className="bg-black/35 rounded-xl p-2 border border-amber-500/20">
            <div className="text-[10px] text-amber-300">المتبقي للختم</div>
            <div className="text-sm font-bold text-amber-200 font-mono mt-0.5">
              {remainingPages} صفحة
            </div>
          </div>
          <div className="bg-black/35 rounded-xl p-2 border border-amber-500/20">
            <div className="text-[10px] text-amber-300">الأيام المقدرة</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">
              ~{remainingDays} يوماً
            </div>
          </div>
        </div>
      </div>

      {/* 2. Graduated Quranic Roadmap (خريطة طريق متدرجة) */}
      <div className="p-4 rounded-2xl bg-[#f7f2e7] dark:bg-[#251d16] border border-amber-700/20 dark:border-amber-700/40 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-amber-950 dark:text-amber-200">
          <div className="flex items-center gap-1.5">
            <Milestone className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span>خريطة طريق الختمة المباركة (30 جزءاً)</span>
          </div>
          <span className="text-[11px] font-mono text-amber-800 dark:text-amber-400">
            الصفحة {currentPage} من 604
          </span>
        </div>

        {/* Milestone Steps Bar */}
        <div className="relative pt-2 pb-1">
          {/* Connecting track */}
          <div className="absolute top-4 left-3 right-3 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full" />
          <div
            className="absolute top-4 right-3 h-1.5 bg-gradient-to-l from-amber-500 to-amber-600 rounded-full transition-all duration-500"
            style={{ width: `calc(${progressPercent}% * 0.94)` }}
          />

          {/* Milestone nodes */}
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
                        ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-300 scale-105'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-300 dark:border-stone-700'
                    }`}
                  >
                    {reached ? <Check className="w-3 h-3 stroke-[3]" /> : `ج${ms.juz}`}
                  </button>
                  <span className="text-[9px] text-amber-900 dark:text-amber-300 font-semibold mt-1">
                    {ms.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Target Duration Presets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-stone-800 dark:text-stone-200">
          <label className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>حدد مدة الختمة المرغوبة:</span>
          </label>
          <span className="text-[11px] text-amber-800 dark:text-amber-400 font-mono">
            {pagesPerDay} صفحة / يومياً
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {presets.map((preset) => {
            const isSelected = targetDays === preset.days;
            return (
              <button
                key={preset.days}
                onClick={() => handleUpdateTargetDays(preset.days)}
                className={`p-2.5 rounded-2xl border text-center transition active:scale-95 flex flex-col items-center justify-center min-h-[50px] ${
                  isSelected
                    ? 'bg-[#3d2a1b] border-amber-600 text-amber-100 shadow-sm'
                    : 'bg-white dark:bg-[#251d16] border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-50/50'
                }`}
              >
                <span className="text-xs font-bold">{preset.days} يوماً</span>
                <span
                  className={`text-[10px] mt-0.5 ${
                    isSelected ? 'text-amber-300' : 'text-stone-500 dark:text-stone-400'
                  }`}
                >
                  ~{preset.pages} صفحة يومياً
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Page Stepper & Manual Entry */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-[#251d16] border border-amber-900/20 dark:border-amber-700/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>تسجيل آخر صفحة تم إتمامها:</span>
          </div>

          {showSavedFeedback && (
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/70 px-2.5 py-0.5 rounded-full animate-in fade-in">
              تم تسجيل الصفحة بنجاح ✓
            </span>
          )}
        </div>

        {/* Stepper Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSavePage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex-1 min-h-[44px] flex items-center justify-center gap-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs transition disabled:opacity-40 active:scale-95"
          >
            <Minus className="w-3.5 h-3.5" />
            <span>-1 ص</span>
          </button>

          <button
            onClick={() => handleSavePage(currentPage + 1)}
            disabled={currentPage >= TOTAL_PAGES}
            className="flex-1 min-h-[44px] flex items-center justify-center gap-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition disabled:opacity-40 active:scale-95 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+1 ص</span>
          </button>

          <button
            onClick={() => handleSavePage(currentPage + pagesPerDay)}
            disabled={currentPage >= TOTAL_PAGES}
            className="px-3 min-h-[44px] flex items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-200 font-bold text-xs transition disabled:opacity-40 active:scale-95"
            title="إتمام ورد اليوم"
          >
            <span>+{pagesPerDay} ص (ورد اليوم)</span>
          </button>
        </div>

        {/* Manual Page Input */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex-1 flex items-center gap-2 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-1.5">
            <span className="text-xs text-stone-500 whitespace-nowrap">رقم الصفحة:</span>
            <input
              type="number"
              min="1"
              max="604"
              value={inputPage}
              onChange={(e) => setInputPage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleManualInputSave();
              }}
              className="w-full text-center font-mono font-bold text-stone-900 dark:text-white bg-transparent focus:outline-none text-sm"
            />
            <span className="text-[11px] text-stone-400">/ 604</span>
          </div>

          <button
            onClick={handleManualInputSave}
            className="px-4 py-2 min-h-[40px] rounded-xl bg-[#3d2a1b] text-amber-200 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 hover:bg-[#4a3523] shrink-0"
          >
            <Save className="w-3.5 h-3.5" />
            <span>حفظ</span>
          </button>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onOpenQuranTab}
          className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 hover:underline"
        >
          <BookOpen className="w-4 h-4" />
          <span>متابعة القراءة في المصحف الشريف</span>
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleResetKhatma}
          title="بدء ختمة جديدة"
          className="flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>بدء ختمة جديدة</span>
        </button>
      </div>
    </div>
  );
};
