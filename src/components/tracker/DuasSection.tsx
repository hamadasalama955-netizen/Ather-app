import React, { useState } from 'react';
import { Search, Copy, Check, Share2, Heart, RefreshCw } from 'lucide-react';
import { DUAS_LIST } from '../../data/duasData';
import { DuaItem } from '../../types';

export const DuasSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const categories = [
    { id: 'all', label: 'الكل' },
    { id: 'quran', label: 'أدعية قرآنية' },
    { id: 'distress', label: 'تفريج الكرب' },
    { id: 'sustenance', label: 'الرزق والبركة' },
    { id: 'healing', label: 'الشفاء والعافية' },
    { id: 'travel_istikhara', label: 'الاستخارة والسفر' },
    { id: 'morning_evening', label: 'الصباح والمساء' },
  ];

  const handleIncrement = (id: string, target: number) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
    setCounts((prev) => {
      const current = prev[id] || 0;
      return { ...prev, [id]: current < target ? current + 1 : 0 };
    });
  };

  const handleCopy = (dua: DuaItem) => {
    const text = `${dua.arabicText}\n[المصدر: ${dua.source}] - أثَر | Athar`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleShare = async (dua: DuaItem) => {
    const text = `${dua.arabicText}\n[المصدر: ${dua.source}] - أثَر | Athar`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: dua.title,
          text: text,
        });
      } catch (err) {
        console.warn(err);
      }
    } else {
      handleCopy(dua);
    }
  };

  const filteredDuas = DUAS_LIST.filter((dua) => {
    if (activeCategory !== 'all' && dua.category !== activeCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return (
      dua.title.toLowerCase().includes(q) ||
      dua.arabicText.toLowerCase().includes(q) ||
      dua.source.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Header intro */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-[#1a1814] to-[#141414] text-white border border-[#d4af37]/30 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-[#d4af37] flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-[#d4af37]" />
            <span>الأدعية المأثورة الجامعة</span>
          </h3>
          <p className="text-[11px] text-stone-300 leading-relaxed">
            أدعية صحيحة ثابتة من القرآن الكريم وصحيح السنة النبوية مع عداد التكرار
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث في الأدعية (مثال: الكرب، الرزق، الشفاء، ربنا)..."
          className="w-full pr-9 pl-4 py-2.5 rounded-xl bg-white dark:bg-[#141414] text-stone-900 dark:text-white placeholder-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#d4af37] border border-stone-200/80 dark:border-[#d4af37]/25 shadow-xs"
        />
        <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
      </div>

      {/* Category Pills (Horizontal scrollable) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-xl font-semibold transition shrink-0 ${
              activeCategory === cat.id
                ? 'bg-[#d4af37] text-stone-950 font-bold shadow-xs'
                : 'bg-white dark:bg-[#141414] border border-stone-200/80 dark:border-[#d4af37]/25 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#1a1814]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Duas List */}
      <div className="space-y-3">
        {filteredDuas.map((dua) => {
          const currentCount = counts[dua.id] || 0;
          const isFinished = currentCount >= dua.targetCount && dua.targetCount > 1;

          return (
            <div
              key={dua.id}
              className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#141414] border border-stone-200/80 dark:border-[#d4af37]/25 shadow-sm space-y-3 transition"
            >
              {/* Dua Category and Title */}
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800/80 pb-2">
                <span className="text-[11px] font-bold text-stone-900 dark:text-[#d4af37] bg-[#d4af37]/15 px-2.5 py-0.5 rounded-full border border-[#d4af37]/20">
                  {dua.categoryTitle}
                </span>

                <h4 className="text-xs font-bold text-stone-900 dark:text-white truncate max-w-[200px]">
                  {dua.title}
                </h4>
              </div>

              {/* Dua Arabic Text */}
              <div className="py-1">
                <p
                  style={{ fontFamily: 'var(--font-quran), Amiri, serif' }}
                  className="text-lg sm:text-xl leading-[2.2] text-stone-900 dark:text-stone-100 select-text font-medium text-center px-1"
                >
                  {dua.arabicText}
                </p>
              </div>

              {/* Source & Reward */}
              <div className="text-[11px] space-y-1 bg-stone-50 dark:bg-[#1a1814] p-2.5 rounded-xl border border-stone-100 dark:border-stone-800">
                <div className="font-semibold text-stone-700 dark:text-stone-300">
                  المصدر: <span className="font-normal text-stone-500 dark:text-stone-400">{dua.source}</span>
                </div>
                {dua.reward && (
                  <div className="text-amber-800 dark:text-amber-300 font-medium">
                    فضل الدعاء: <span className="font-normal">{dua.reward}</span>
                  </div>
                )}
              </div>

              {/* Actions Footer: Counter + Copy + Share */}
              <div className="flex items-center justify-between pt-1">
                {/* Repetition counter button */}
                <button
                  onClick={() => handleIncrement(dua.id, dua.targetCount)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                    isFinished
                      ? 'bg-[#d4af37] text-stone-950 font-bold'
                      : 'bg-stone-100 dark:bg-[#1a1814] text-stone-800 dark:text-[#d4af37] hover:bg-stone-200 border border-transparent dark:border-[#d4af37]/20'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>
                    التكرار: {currentCount} / {dua.targetCount}
                  </span>
                  {isFinished && <Check className="w-3.5 h-3.5 text-stone-950 stroke-[3]" />}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(dua)}
                    title="نسخ الدعاء"
                    className="p-2 rounded-xl bg-stone-100 dark:bg-[#1a1814] hover:bg-stone-200 text-stone-600 dark:text-stone-300 transition"
                  >
                    {copiedId === dua.id ? (
                      <Check className="w-4 h-4 text-[#d4af37]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => handleShare(dua)}
                    title="مشاركة الدعاء"
                    className="p-2 rounded-xl bg-stone-100 dark:bg-[#1a1814] hover:bg-stone-200 text-stone-600 dark:text-stone-300 transition"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
