import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Heart,
  Share2,
  Copy,
  Check,
  BookOpen,
  Info,
  Sparkles,
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
  const [progress, setProgress] = useState<Record<number, number>>(() => getAthkarProgress());
  const [favorites, setFavorites] = useState<number[]>(() => getFavoriteAthkarIds());
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleIncrement = (item: AthkarItem) => {
    // Vibrate gently
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(25);
    }
    const currentVal = progress[item.id] || 0;
    if (currentVal < item.count) {
      const next = incrementAthkarProgress(item.id, item.count);
      setProgress((prev) => ({ ...prev, [item.id]: next }));
      if (next === item.count && typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([40, 50, 40]);
      }
    }
  };

  const handleToggleFav = (id: number) => {
    const isFav = toggleFavoriteAthkar(id);
    setFavorites((prev) => (isFav ? [...prev, id] : prev.filter((x) => x !== id)));
  };

  const handleResetAll = () => {
    const ids = items.map((i) => i.id);
    resetCategoryProgress(ids);
    setProgress((prev) => {
      const copy = { ...prev };
      ids.forEach((id) => delete copy[id]);
      return copy;
    });
  };

  const handleCopy = (item: AthkarItem) => {
    const text = `${item.text}\n[${item.description || ''} - تكرار: ${item.count} مرة]\nالمصدر: ${item.reference}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Completion stats
  const completedCount = items.filter((item) => (progress[item.id] || 0) >= item.count).length;
  const isAllCompleted = items.length > 0 && completedCount === items.length;

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="sticky top-14 z-20 -mx-4 px-4 py-2.5 bg-stone-100/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-200/70 dark:bg-stone-800/70 hover:bg-stone-200 dark:hover:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300 transition active:scale-95"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الأبواب</span>
        </button>

        <div className="text-center truncate max-w-[200px]">
          <h2 className="text-sm font-extrabold text-emerald-900 dark:text-emerald-400 truncate">
            {category}
          </h2>
          <span className="text-[10px] text-stone-500 dark:text-stone-400">
            {completedCount} من {items.length} مكتمل
          </span>
        </div>

        <button
          onClick={handleResetAll}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-200/60 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400 hover:text-rose-600 text-xs font-semibold"
          title="إعادة تعيين عداد الأذكار لهذا الباب"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>تصفير</span>
        </button>
      </div>

      {/* Progress Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-800 to-emerald-950 text-white shadow-md space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-amber-300">إنجاز الورد:</span>
          <span className="font-mono tabular-nums text-emerald-200">
            {completedCount} / {items.length} ({items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0}%)
          </span>
        </div>

        <div className="w-full h-2 bg-emerald-950 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-300"
            style={{ width: `${items.length > 0 ? (completedCount / items.length) * 100 : 0}%` }}
          />
        </div>

        {isAllCompleted && (
          <div className="pt-2 text-center text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>تقبل الله ذكرك، أتممت جميع أذكار هذا الباب!</span>
          </div>
        )}
      </div>

      {/* Athkar Cards List */}
      <div className="space-y-3">
        {items.map((item, index) => {
          const currentCount = progress[item.id] || 0;
          const isDone = currentCount >= item.count;
          const isFav = favorites.includes(item.id);

          return (
            <div
              key={item.id}
              className={`rounded-3xl border transition-all duration-200 p-4 space-y-3 ${
                isDone
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-400/50 opacity-90'
                  : 'bg-white dark:bg-stone-900 border-stone-200/80 dark:border-stone-800 shadow-sm'
              }`}
            >
              {/* Header: Item index, favorite, copy */}
              <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-100 dark:border-stone-800">
                <span className="font-bold text-stone-500 dark:text-stone-400">
                  الذكر {index + 1} من {items.length}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleFav(item.id)}
                    className={`p-1.5 rounded-lg transition active:scale-95 ${
                      isFav
                        ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40'
                        : 'text-stone-400 hover:text-rose-600'
                    }`}
                    title="إضافة للمفضلة"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={() => handleCopy(item)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                    title="نسخ الذكر"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Athkar Text in Amiri Font */}
              <p
                style={{ fontFamily: 'var(--font-quran), Amiri, serif' }}
                className="text-lg leading-[2.1] text-stone-900 dark:text-stone-100 text-right select-text font-normal"
              >
                {item.text}
              </p>

              {/* Description / Virtue */}
              {item.description && (
                <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-200/50 dark:border-stone-700/60 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  <span className="font-bold text-amber-800 dark:text-amber-400">الفضل: </span>
                  {item.description}
                </div>
              )}

              {/* Reference Attribution */}
              {item.reference && (
                <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
                  <Info className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>المصدر: {item.reference}</span>
                </div>
              )}

              {/* Counter Button */}
              <button
                onClick={() => handleIncrement(item)}
                disabled={isDone}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-between px-5 transition active:scale-[0.98] ${
                  isDone
                    ? 'bg-emerald-600/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40 cursor-default'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  )}
                  <span>{isDone ? 'تم الانتهاء' : 'اضغط للعد'}</span>
                </div>

                <div className="font-mono text-base tabular-nums flex items-baseline gap-1" dir="ltr">
                  <span className={isDone ? 'text-emerald-600 font-black' : 'text-amber-300 font-black'}>
                    {currentCount}
                  </span>
                  <span className="text-xs opacity-75">/ {item.count}</span>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Verified Book Source Attribution */}
      <div className="p-3.5 rounded-2xl bg-stone-200/50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-400 text-center leading-relaxed">
        المصدر: صحيح الأذكار المعتمد من كتاب <strong>«حصن المسلم من أذكار الكتاب والسنة»</strong> للشيخ د. سعيد بن وهف القحطاني، بدقة كاملة وبدون أي تعديل.
      </div>
    </div>
  );
};
