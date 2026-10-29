import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  RotateCcw,
  Heart,
  Share2,
  Copy,
  Check,
  Info,
  List,
  CheckCheck,
} from 'lucide-react';
import { AthkarItem } from '../../types';
import {
  getAthkarProgress,
  incrementAthkarProgress,
  resetCategoryProgress,
  toggleFavoriteAthkar,
  getFavoriteAthkarIds,
} from '../../services/athkarService';

interface Props {
  category: string;
  items: AthkarItem[];
  onBack: () => void;
}

export const AthkarCategoryView: React.FC<Props> = ({ category, items, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState<Record<number, number>>(() => getAthkarProgress());
  const [favorites, setFavorites] = useState<number[]>(() => getFavoriteAthkarIds());
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showListModal, setShowListModal] = useState(false);
  const [isPressing, setIsPressing] = useState(false);

  // Completion timestamp key for this category
  const todayDateStr = new Date().toISOString().split('T')[0];
  const completionStorageKey = `athar_completed_time_${category}_${todayDateStr}`;

  const [completedTime, setCompletedTime] = useState<string | null>(() => {
    try {
      return localStorage.getItem(completionStorageKey);
    } catch {
      return null;
    }
  });

  // Calculate completed count
  const completedCount = items.filter((item) => (progress[item.id] || 0) >= item.count).length;
  const isAllCompleted = items.length > 0 && completedCount === items.length;

  // If completed just now, record the formatted time
  useEffect(() => {
    if (isAllCompleted && !completedTime) {
      const timeStr = new Date().toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
      });
      setCompletedTime(timeStr);
      try {
        localStorage.setItem(completionStorageKey, timeStr);
      } catch {
        // ignore
      }
    }
  }, [isAllCompleted, completedTime, completionStorageKey]);

  // Current item
  const currentItem = items[currentIndex] || items[0];
  const currentDoneCount = currentItem ? progress[currentItem.id] || 0 : 0;
  const remainingCount = currentItem ? Math.max(0, currentItem.count - currentDoneCount) : 0;
  const isCurrentDone = remainingCount === 0;

  // Handle count decrement / increment
  const handleTap = () => {
    if (!currentItem) return;

    // Haptic vibration
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(25);
    }

    // Ripple visual effect
    setIsPressing(true);
    setTimeout(() => setIsPressing(false), 180);

    const currentVal = progress[currentItem.id] || 0;
    if (currentVal < currentItem.count) {
      const next = incrementAthkarProgress(currentItem.id, currentItem.count);
      setProgress((prev) => ({ ...prev, [currentItem.id]: next }));

      // If finished this dhikr, auto-advance immediately to next
      if (next >= currentItem.count) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([40, 60, 40]);
        }

        // Auto-advance after brief smooth transition (350ms)
        setTimeout(() => {
          if (currentIndex < items.length - 1) {
            setCurrentIndex((prev) => prev + 1);
          }
        }, 350);
      }
    } else {
      // Already finished, tapping moves to next if available
      if (currentIndex < items.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleToggleFav = (id: number) => {
    const isFav = toggleFavoriteAthkar(id);
    setFavorites((prev) => (isFav ? [...prev, id] : prev.filter((x) => x !== id)));
  };

  const handleCopy = (item: AthkarItem) => {
    const textToCopy = `﴿ ${item.text} ﴾\n\n[تكرار: ${item.count} مرة]\n${item.description ? `فضل الذكر: ${item.description}\n` : ''}${item.reference ? `المصدر: ${item.reference}\n` : ''}\n— من تطبيق «أثر | رفيق المسلم»`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async (item: AthkarItem) => {
    const textToShare = `﴿ ${item.text} ﴾\n\n${item.description ? `فضله: ${item.description}\n` : ''}${item.reference ? `المصدر: ${item.reference}\n` : ''}\n— من تطبيق «أثر | رفيق المسلم»`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: category,
          text: textToShare,
        });
      } catch {
        // user cancelled
      }
    } else {
      handleCopy(item);
    }
  };

  const handleResetAll = () => {
    const ids = items.map((i) => i.id);
    resetCategoryProgress(ids);
    setProgress((prev) => {
      const copy = { ...prev };
      ids.forEach((id) => delete copy[id]);
      return copy;
    });
    setCompletedTime(null);
    try {
      localStorage.removeItem(completionStorageKey);
    } catch {
      // ignore
    }
    setCurrentIndex(0);
  };

  if (!currentItem) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-stone-500">لا توجد أذكار في هذا الباب حالياً.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#c5a059] text-stone-950 font-bold text-xs"
        >
          العودة للقائمة
        </button>
      </div>
    );
  }

  const isFav = favorites.includes(currentItem.id);

  // Progress percentage for this single current dhikr (0 to 100)
  const singleDhikrPercent = Math.min(100, Math.round((currentDoneCount / currentItem.count) * 100));

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-300" dir="rtl">
      {/* 1. Sticky Navigation Header */}
      <div className="sticky top-0 z-20 -mx-4 px-4 py-2.5 bg-[#fcfbf7]/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-[rgba(212,175,55,0.2)] flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-stone-100 dark:bg-[#141414] hover:bg-stone-200 dark:hover:bg-[#1a1814] text-xs font-bold text-stone-700 dark:text-[#ffffff] border border-stone-300/60 dark:border-[rgba(212,175,55,0.2)] transition active:scale-95"
        >
          <ArrowRight className="w-4 h-4 text-[#d4af37]" />
          <span>الأبواب</span>
        </button>

        <div className="text-center truncate px-2">
          <h2 className="text-sm font-extrabold text-stone-900 dark:text-[#ffffff] truncate">
            {category}
          </h2>
          <span className="text-[11px] font-bold text-[#9c783e] dark:text-[#d4af37]">
            الذكر {currentIndex + 1} من {items.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowListModal(true)}
            title="فهرس أذكار هذا الباب"
            className="p-2 rounded-2xl bg-stone-100 dark:bg-[#141414] text-stone-600 dark:text-[#a39e93] hover:text-[#d4af37] border border-stone-300/60 dark:border-[rgba(212,175,55,0.2)] transition active:scale-95"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetAll}
            title="إعادة تعيين الورد"
            className="p-2 rounded-2xl bg-stone-100 dark:bg-[#141414] text-stone-600 dark:text-[#a39e93] hover:text-rose-500 border border-stone-300/60 dark:border-[rgba(212,175,55,0.2)] transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Completion Status Bar (shows when all athkar of category are completed) */}
      {isAllCompleted && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#1a1814] to-[#141414] border border-[#d4af37]/40 text-stone-100 dark:text-[#ffffff] shadow-md flex items-center justify-between gap-2 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] shrink-0">
              <CheckCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#d4af37]">
                تم قراءة الأذكار كاملة
                {completedTime ? ` الساعة ${completedTime}` : ''}
              </div>
              <p className="text-[11px] text-stone-300 dark:text-[#a39e93]">
                تقبل الله طاعتكم وجعلها حصناً مباركاً لكم اليوم.
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAll}
            className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white dark:text-[#d4af37] text-[11px] font-bold border border-white/20 dark:border-[#d4af37]/30 transition shrink-0"
          >
            إعادة القراءة
          </button>
        </div>
      )}

      {/* Overall Category Progress Bar */}
      <div className="w-full bg-stone-200 dark:bg-[#141414] h-1.5 rounded-full overflow-hidden border border-stone-300/40 dark:border-[rgba(212,175,55,0.15)]">
        <div
          className="h-full bg-gradient-to-r from-[#c5a059] to-[#d4af37] transition-all duration-300 rounded-full"
          style={{ width: `${(completedCount / Math.max(1, items.length)) * 100}%` }}
        />
      </div>

      {/* 3. The Focused Center Dhikr Card (ذكر واحد في الشاشة + نصوص كاملة) */}
      <div
        onClick={handleTap}
        className={`relative overflow-hidden rounded-3xl border transition-all duration-200 p-5 sm:p-6 shadow-md cursor-pointer select-none ${
          isCurrentDone
            ? 'bg-[#d4af37]/10 dark:bg-[#141414] border-[#d4af37]/50'
            : 'bg-white dark:bg-[#141414] border-stone-200/90 dark:border-[rgba(212,175,55,0.2)] hover:border-[#d4af37]/50 shadow-amber-950/5'
        } ${isPressing ? 'scale-[0.99] ring-2 ring-[#d4af37]/30' : ''}`}
      >
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header: Category & Actions */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-between pb-3.5 border-b border-stone-100 dark:border-stone-800/80 text-xs"
        >
          <div className="flex items-center gap-1.5 font-bold text-stone-500 dark:text-[#a39e93]">
            <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
            <span>الذكر {currentIndex + 1} من {items.length}</span>
            {isCurrentDone && (
              <span className="text-[10px] bg-[#d4af37]/20 text-[#d4af37] px-2 py-0.5 rounded-full font-bold">
                مكتمل ✔
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleToggleFav(currentItem.id)}
              title="إضافة إلى المفضلة"
              className={`p-2 rounded-xl transition active:scale-95 ${
                isFav
                  ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                  : 'text-stone-400 hover:text-rose-500 bg-stone-100 dark:bg-[#1a1814]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={() => handleShare(currentItem)}
              title="مشاركة الذكر"
              className="p-2 rounded-xl text-stone-500 dark:text-[#a39e93] hover:text-[#d4af37] bg-stone-100 dark:bg-[#1a1814] transition active:scale-95"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleCopy(currentItem)}
              title="نسخ الذكر"
              className="p-2 rounded-xl text-stone-500 dark:text-[#a39e93] hover:text-[#d4af37] bg-stone-100 dark:bg-[#1a1814] transition active:scale-95"
            >
              {copiedId === currentItem.id ? (
                <Check className="w-4 h-4 text-[#d4af37]" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Full Dhikr Text with Full Tashkeel in Large Luxurious Font */}
        <div className="py-6 min-h-[160px] flex items-center justify-center">
          <p
            style={{ fontFamily: 'var(--font-quran), Amiri, serif' }}
            className="text-xl sm:text-2xl leading-[2.3] text-stone-900 dark:text-[#ffffff] text-center select-text font-normal tracking-wide"
          >
            {currentItem.text}
          </p>
        </div>

        {/* Elegant Gold Divider Line */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200 dark:border-[rgba(212,175,55,0.25)]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white dark:bg-[#141414] px-3 text-[#d4af37]">
              ❦
            </span>
          </div>
        </div>

        {/* Virtue / Reward Text (فضل الذكر أو ثوابه) */}
        {currentItem.description && (
          <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-[#1a1814] border border-amber-200/60 dark:border-[rgba(212,175,55,0.2)] text-xs text-stone-700 dark:text-[#a39e93] leading-relaxed my-2 space-y-1">
            <div className="font-bold text-amber-800 dark:text-[#d4af37] flex items-center gap-1.5 text-xs">
              <Heart className="w-3.5 h-3.5 text-[#d4af37] shrink-0 fill-[#d4af37]" />
              <span>فضل الذكر وثوابه:</span>
            </div>
            <p className="text-[12px] sm:text-xs text-stone-700 dark:text-stone-300 font-sans leading-relaxed">
              {currentItem.description}
            </p>
          </div>
        )}

        {/* Reference Attribution */}
        {currentItem.reference && (
          <div className="text-[11px] text-stone-500 dark:text-[#a39e93] flex items-center gap-1.5 pt-1">
            <Info className="w-3 h-3 text-[#d4af37] shrink-0" />
            <span>المصدر: {currentItem.reference}</span>
          </div>
        )}

        {/* Tap Helper Hint */}
        <div className="text-center pt-2">
          <span className="text-[10px] text-stone-400 dark:text-stone-500">
            {isCurrentDone
              ? 'تم إكمال عدد التكرار • اضغط للتالي'
              : 'اضغط على البطاقة أو الزر بالأسفل للعد'}
          </span>
        </div>
      </div>

      {/* 4. Bottom Control Bar (شريط التحكم الدائري والتنقل) */}
      <div
        className="rounded-3xl p-4 bg-white dark:bg-[#141414] border border-stone-200/80 dark:border-[rgba(212,175,55,0.2)] shadow-md flex items-center justify-between gap-3"
      >
        {/* Previous Button (Right arrow in RTL) */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          title="الذكر السابق"
          className="flex items-center gap-1 px-3 py-2.5 rounded-2xl bg-stone-100 dark:bg-[#1a1814] disabled:opacity-40 text-stone-700 dark:text-[#ffffff] border border-stone-200 dark:border-stone-800 font-bold text-xs transition active:scale-95 shrink-0"
        >
          <ChevronRight className="w-4 h-4 text-[#d4af37]" />
          <span className="hidden xs:inline">السابق</span>
        </button>

        {/* Big Circular Counter Button in Center (الزر الدائري الكبير بالمنتصف) */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleTap}
            disabled={isCurrentDone}
            aria-label={`تكرار متبقي: ${remainingCount}`}
            className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-full flex flex-col items-center justify-center font-black transition-all active:scale-90 shadow-lg ${
              isCurrentDone
                ? 'bg-[#d4af37] text-stone-950 shadow-[#d4af37]/20'
                : 'bg-gradient-to-br from-[#dfb76c] via-[#d4af37] to-[#b3882e] hover:from-[#f0cf8e] hover:to-[#dfb76c] text-stone-950 shadow-amber-900/25 ring-4 ring-[#d4af37]/20 animate-pulse'
            }`}
          >
            {/* Circular Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1">
              <circle
                cx="50%"
                cy="50%"
                r="44%"
                className="stroke-black/10 dark:stroke-white/10 fill-none"
                strokeWidth="3"
              />
              <circle
                cx="50%"
                cy="50%"
                r="44%"
                className={`fill-none transition-all duration-200 ${
                  isCurrentDone ? 'stroke-stone-950' : 'stroke-stone-950'
                }`}
                strokeWidth="3.5"
                strokeDasharray="100"
                strokeDashoffset={100 - singleDhikrPercent}
                strokeLinecap="round"
              />
            </svg>

            {isCurrentDone ? (
              <>
                <CheckCircle2 className="w-7 h-7 text-stone-950" />
                <span className="text-[10px] font-bold mt-0.5">تم</span>
              </>
            ) : (
              <>
                <span className="text-2xl sm:text-3xl font-black font-mono leading-none">
                  {remainingCount}
                </span>
                <span className="text-[9px] font-bold opacity-80 uppercase tracking-wider mt-0.5">
                  متبقي
                </span>
              </>
            )}
          </button>
          <span className="text-[11px] font-bold text-stone-500 dark:text-[#a39e93] mt-1.5">
            الهدف: {currentItem.count} {currentItem.count === 1 ? 'مرة' : 'مرات'}
          </span>
        </div>

        {/* Next Button (Left arrow in RTL) */}
        <button
          onClick={handleNext}
          disabled={currentIndex === items.length - 1}
          title="الذكر التالي"
          className="flex items-center gap-1 px-3 py-2.5 rounded-2xl bg-stone-100 dark:bg-[#1a1814] disabled:opacity-40 text-stone-700 dark:text-[#ffffff] border border-stone-200 dark:border-stone-800 font-bold text-xs transition active:scale-95 shrink-0"
        >
          <span className="hidden xs:inline">التالي</span>
          <ChevronLeft className="w-4 h-4 text-[#d4af37]" />
        </button>
      </div>

      {/* 5. Jump List Modal (فهرس الأذكار السريع للتنقل المباشر) */}
      {showListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200" dir="rtl">
          <div className="w-full max-w-sm max-h-[80vh] rounded-3xl bg-white dark:bg-[#141414] border border-stone-200 dark:border-[rgba(212,175,55,0.25)] p-5 shadow-2xl flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2.5">
              <h4 className="font-extrabold text-sm text-stone-900 dark:text-[#ffffff]">
                فهرس {category}
              </h4>
              <span className="text-xs text-[#d4af37] font-bold">
                {completedCount} / {items.length} مكتمل
              </span>
            </div>

            <div className="overflow-y-auto space-y-2 max-h-[55vh] pr-1">
              {items.map((item, idx) => {
                const isItemDone = (progress[item.id] || 0) >= item.count;
                const isSelected = idx === currentIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowListModal(false);
                    }}
                    className={`w-full text-right p-3 rounded-2xl border transition flex items-center justify-between gap-2 text-xs ${
                      isSelected
                        ? 'bg-[#d4af37]/15 border-[#d4af37] font-bold text-stone-900 dark:text-[#ffffff]'
                        : isItemDone
                        ? 'bg-[#d4af37]/10 border-[#d4af37]/30 text-stone-600 dark:text-stone-300'
                        : 'bg-stone-50 dark:bg-[#1a1814] border-stone-200/70 dark:border-stone-800 text-stone-700 dark:text-[#a39e93]'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-bold flex items-center gap-1.5">
                        <span>الذكر {idx + 1}</span>
                        {isItemDone && <Check className="w-3.5 h-3.5 text-[#d4af37]" />}
                      </div>
                      <p className="truncate text-[11px] opacity-80 mt-0.5">
                        {item.text.slice(0, 50)}...
                      </p>
                    </div>

                    <span className="font-mono text-xs tabular-nums shrink-0 px-2 py-0.5 rounded-lg bg-stone-200/60 dark:bg-black/40">
                      {progress[item.id] || 0}/{item.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowListModal(false)}
              className="w-full py-2.5 rounded-2xl bg-stone-200 dark:bg-[#1a1814] text-stone-800 dark:text-[#ffffff] font-bold text-xs"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
