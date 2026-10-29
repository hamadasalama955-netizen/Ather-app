import React from 'react';
import { BookOpen, Check, Plus, Minus, ChevronLeft, Bookmark, CheckCircle2, ListChecks } from 'lucide-react';
import { PrayerLog } from '../../types';

interface Props {
  log: PrayerLog;
  onUpdateLog: (updated: Partial<PrayerLog>) => void;
  onOpenQuranTab: () => void;
  onOpenKhatma?: () => void;
}

export const QuranWardCard: React.FC<Props> = ({ log, onUpdateLog, onOpenQuranTab, onOpenKhatma }) => {
  const currentPage = log.currentPageNumber || 1;
  const pagesRead = log.quranPagesRead || 0;
  const targetPages = log.quranPageTarget || 4;
  const isCompleted = log.quranCompleted || pagesRead >= targetPages;

  const handleUpdatePage = (newPage: number) => {
    const clamped = Math.max(1, Math.min(604, newPage));
    const delta = Math.max(0, clamped - currentPage);
    onUpdateLog({
      currentPageNumber: clamped,
      quranPagesRead: pagesRead + delta,
      quranCompleted: pagesRead + delta >= targetPages,
    });
  };

  const handleToggleComplete = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(25);
    }
    const nextCompleted = !isCompleted;
    onUpdateLog({
      quranCompleted: nextCompleted,
      quranPagesRead: nextCompleted ? Math.max(pagesRead, targetPages) : 0,
    });
  };

  // Estimate Juz approximately from page (604 pages, 30 juz ~ 20 pages per juz)
  const currentJuz = Math.min(30, Math.floor((currentPage - 1) / 20) + 1);

  // Daily Quran Checklist Items
  const checklistItems = [
    {
      id: 'reading',
      title: `قراءة صفحات الورد (${pagesRead}/${targetPages} ص)`,
      completed: isCompleted,
      onClick: handleToggleComplete,
    },
    {
      id: 'tadabbur',
      title: 'تدبر آية وفهم تفسيرها ومعانيها',
      completed: isCompleted,
      onClick: handleToggleComplete,
    },
  ];

  return (
    <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-stone-900 dark:text-white">
              قائمة الورد القرآني اليومي
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              تابع تلاوتك اليومية وثبّت موضعك في المصحف
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenQuranTab}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-xs font-semibold text-teal-800 dark:text-teal-300 transition active:scale-95"
          >
            <span>المصحف</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Stats: Current Page & Progress */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Current Page Box */}
        <div className="p-3.5 rounded-2xl bg-stone-50/80 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 text-center">
          <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-center gap-1 font-semibold">
            <Bookmark className="w-3 h-3 text-amber-500" />
            <span>الصفحة الحالية</span>
          </div>
          <div className="text-3xl font-black text-stone-900 dark:text-white font-mono tabular-nums mt-1">
            {currentPage}
          </div>
          <div className="text-[10px] text-amber-700 dark:text-amber-400 font-bold mt-0.5">
            الجزء {currentJuz} من 30
          </div>
        </div>

        {/* Today's Reading Box */}
        <div className="p-3.5 rounded-2xl bg-stone-50/80 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 text-center">
          <div className="text-[11px] text-stone-500 dark:text-stone-400 font-semibold">
            صفحات اليوم / الهدف
          </div>
          <div className="text-3xl font-black text-teal-800 dark:text-teal-400 font-mono tabular-nums mt-1">
            {pagesRead} <span className="text-xs font-normal text-stone-400">/ {targetPages}</span>
          </div>
          <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 font-medium">
            {isCompleted ? 'تم إنجاز الورد بفضل الله ✨' : `باقي ${Math.max(0, targetPages - pagesRead)} صفحات`}
          </div>
        </div>
      </div>

      {/* Page Adjusters */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
          <span className="font-semibold">تعديل رقم الصفحة المقروءة:</span>
          <span className="font-mono text-[10px] text-stone-400">مصحف المدينة (604 ص)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleUpdatePage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex-1 min-h-[44px] flex items-center justify-center gap-1 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs transition disabled:opacity-40 active:scale-95"
          >
            <Minus className="w-3.5 h-3.5" />
            <span>-1 ص</span>
          </button>

          <button
            onClick={() => handleUpdatePage(currentPage + 1)}
            disabled={currentPage >= 604}
            className="flex-1 min-h-[44px] flex items-center justify-center gap-1 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-800 dark:text-teal-300 font-bold text-xs transition disabled:opacity-40 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+1 ص</span>
          </button>

          <button
            onClick={() => handleUpdatePage(currentPage + targetPages)}
            disabled={currentPage >= 600}
            className="px-3 min-h-[44px] flex items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-800 dark:text-amber-300 font-bold text-xs transition disabled:opacity-40 active:scale-95"
            title="إتمام الورد كاملاً"
          >
            <span>+{targetPages} ص</span>
          </button>
        </div>
      </div>

      {/* Modern Checklist Task Button for Completion */}
      <button
        onClick={handleToggleComplete}
        className={`w-full p-3 rounded-2xl border text-right transition-all duration-200 active:scale-[0.99] flex items-center justify-between gap-3 ${
          isCompleted
            ? 'bg-teal-50/80 dark:bg-teal-950/40 border-teal-500/50 text-teal-950 dark:text-teal-200 shadow-xs'
            : 'bg-stone-50/80 dark:bg-stone-800/40 border-stone-200/80 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-6 h-6 rounded-xl flex items-center justify-center transition-all ${
              isCompleted
                ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30 scale-105'
                : 'border-2 border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800'
            }`}
          >
            {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
          <div>
            <div className="text-xs font-bold">
              {isCompleted ? 'تم إتمام الورد القرآني لليوم بفضل الله' : 'مهمة: تلاوة الورد اليومي المقرر'}
            </div>
            <div className="text-[10px] text-stone-400">
              {isCompleted ? 'مبارك! تقبل الله تلاوتك' : 'انقر لتسجيل إتمام القراءة في السجل'}
            </div>
          </div>
        </div>

        {isCompleted && (
          <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/60 px-2 py-0.5 rounded-full">
            مكتمل ✓
          </span>
        )}
      </button>
    </div>
  );
};
