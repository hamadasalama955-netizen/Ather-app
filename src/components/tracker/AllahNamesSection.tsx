import React, { useState, useEffect } from 'react';
import { Search, Star, BookOpen, Check } from 'lucide-react';
import { ALLAH_NAMES } from '../../data/allahNamesData';
import { AllahName } from '../../types';

const SAVED_NAMES_KEY = 'nur_al_huda_saved_allah_names';

export const AllahNamesSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [onlySaved, setOnlySaved] = useState(false);

  // Load saved names from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVED_NAMES_KEY);
      if (stored) {
        setSavedIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleSave = (id: number) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
    const updated = savedIds.includes(id)
      ? savedIds.filter((item) => item !== id)
      : [...savedIds, id];
    setSavedIds(updated);
    try {
      localStorage.setItem(SAVED_NAMES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Name of the day based on day of year
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
  );
  const featuredName = ALLAH_NAMES[dayOfYear % ALLAH_NAMES.length] || ALLAH_NAMES[0];

  const filteredNames = ALLAH_NAMES.filter((item) => {
    if (onlySaved && !savedIds.includes(item.id)) return false;
    if (!searchQuery.trim()) return true;
    const query = searchQuery.trim().toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.meaning.toLowerCase().includes(query) ||
      item.reflection.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      {/* Featured Name of the Day Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1a1814] via-[#141414] to-[#0a0a0a] border border-[#d4af37]/40 text-white p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-[#d4af37] mb-2">
          <div className="flex items-center gap-1.5 font-bold">
            <BookOpen className="w-4 h-4 text-[#d4af37]" />
            <span>اسم اليوم للتأمل والدعاء</span>
          </div>
          <span className="font-mono text-[11px] bg-white/10 px-2 py-0.5 rounded-full text-[#d4af37]">
            #{featuredName.id} من 99
          </span>
        </div>

        <div className="text-center py-2">
          <h2
            style={{ fontFamily: 'var(--font-quran), Amiri, serif' }}
            className="text-4xl sm:text-5xl font-bold tracking-wide text-[#d4af37] select-text"
          >
            {featuredName.name}
          </h2>
          <p className="text-sm font-medium text-white/95 mt-2 max-w-sm mx-auto leading-relaxed">
            {featuredName.meaning}
          </p>
          <div className="mt-3 inline-block bg-black/40 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-[#d4af37]/20 text-xs text-stone-200">
            💡 {featuredName.reflection}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl bg-white dark:bg-[#141414] border border-stone-200/80 dark:border-[#d4af37]/25 p-3 space-y-2.5 shadow-sm">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم أو المعنى (مثال: الرحيم، الرزاق، العفو)..."
            className="w-full pr-9 pl-4 py-2.5 rounded-xl bg-stone-100 dark:bg-[#1a1814] text-stone-900 dark:text-white placeholder-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#d4af37] border border-stone-200 dark:border-stone-700"
          />
          <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlySaved(false)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                !onlySaved
                  ? 'bg-[#d4af37] text-stone-950 font-bold'
                  : 'bg-stone-100 dark:bg-[#1a1814] text-stone-600 dark:text-stone-300'
              }`}
            >
              جميع الأسماء (99)
            </button>
            <button
              onClick={() => setOnlySaved(true)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-semibold transition ${
                onlySaved
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-stone-100 dark:bg-[#1a1814] text-stone-600 dark:text-stone-300'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>المحفوظة ({savedIds.length})</span>
            </button>
          </div>

          <span className="text-[11px] text-stone-400">
            {filteredNames.length} اسماً
          </span>
        </div>
      </div>

      {/* Names Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {filteredNames.map((item) => {
          const isSaved = savedIds.includes(item.id);
          return (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-[#141414] border border-stone-200/80 dark:border-[#d4af37]/25 shadow-xs hover:border-[#d4af37]/50 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-stone-100 dark:bg-[#1a1814] text-stone-500 text-[11px] font-mono flex items-center justify-center font-bold">
                    {item.id}
                  </span>
                  <h3
                    style={{ fontFamily: 'var(--font-quran), Amiri, serif' }}
                    className="text-xl font-bold text-stone-900 dark:text-[#d4af37]"
                  >
                    {item.name}
                  </h3>
                </div>

                <button
                  onClick={() => toggleSave(item.id)}
                  title={isSaved ? 'إزالة من المحفوظة' : 'تعليم كمحفوظ'}
                  className={`p-1.5 rounded-xl transition ${
                    isSaved
                      ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400'
                      : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <Star className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                  {item.meaning}
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-normal">
                  ✨ {item.reflection}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {filteredNames.length === 0 && (
        <div className="text-center py-12 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
          <BookOpen className="w-8 h-8 text-stone-400 mx-auto" />
          <p className="text-xs font-semibold text-stone-600 dark:text-stone-400">
            لم يتم العثور على أسماء مطابقة لبحثك
          </p>
        </div>
      )}
    </div>
  );
};
