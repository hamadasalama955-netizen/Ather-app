import React, { useState } from 'react';
import { X, Search, Star, BookOpen, Check, Copy } from 'lucide-react';
import { ALLAH_NAMES } from '../../data/allahNamesData';
import { AllahName } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

const SAVED_NAMES_KEY = 'athar_saved_allah_names';

export const AllahNamesModal: React.FC<Props> = ({ isOpen, onClose, isDark = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedIds, setSavedIds] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_NAMES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [onlySaved, setOnlySaved] = useState(false);

  if (!isOpen) return null;

  const toggleSave = (id: number) => {
    const updated = savedIds.includes(id)
      ? savedIds.filter((item) => item !== id)
      : [...savedIds, id];
    setSavedIds(updated);
    try {
      localStorage.setItem(SAVED_NAMES_KEY, JSON.stringify(updated));
    } catch {}
  };

  const handleCopy = (name: AllahName) => {
    const text = `﴿ ${name.name} ﴾\n${name.meaning}\nالتأمل والدعاء: ${name.reflection}`;
    navigator.clipboard.writeText(text);
    setCopiedId(name.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Day of year featured name
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg max-h-[92vh] rounded-[28px] p-4 sm:p-5 shadow-2xl flex flex-col justify-between border animate-in zoom-in-95 duration-200 overflow-hidden ${
          isDark
            ? 'bg-[#141414] text-[#fcfbf7] border-[#d4af37]/40'
            : 'bg-[#faf8f5] text-stone-900 border-[#d4af37]/30 shadow-xl'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/20 shrink-0" dir="rtl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-b from-[#d4af37] to-[#aa7c11] text-stone-950 flex items-center justify-center font-bold shadow-sm">
              <span className="text-lg font-bold" style={{ fontFamily: 'Amiri, serif' }}>الله</span>
            </div>
            <div>
              <h2
                className={`text-base sm:text-lg font-extrabold ${
                  isDark ? 'text-[#f5e6b8]' : 'text-[#2e4426]'
                }`}
                style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
              >
                أسماء الله الحسنى الـ ٩٩
              </h2>
              <p className="text-[11px] text-[#8c6b2d] dark:text-[#d4af37]">
                «وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا»
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition ${
              isDark
                ? 'hover:bg-[#1f1d18] text-stone-400 hover:text-white'
                : 'hover:bg-stone-200 text-stone-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Featured Name Card */}
        <div
          className={`p-3.5 rounded-2xl my-3 shrink-0 text-center border relative overflow-hidden ${
            isDark
              ? 'bg-gradient-to-b from-[#1a1814] to-[#12110e] border-[#d4af37]/40 text-white'
              : 'bg-white border-[#d4af37]/35 text-stone-900 shadow-2xs'
          }`}
          dir="rtl"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-[#8c6b2d] dark:text-[#d4af37] mb-1">
            <span>اسم اليوم للتأمل والدعاء:</span>
            <span className="font-mono text-[10px] bg-[#d4af37]/15 px-2 py-0.5 rounded-full border border-[#d4af37]/30">
              #{featuredName.id} من ٩٩
            </span>
          </div>

          <h3
            className="text-2xl sm:text-3xl font-extrabold text-[#d4af37] py-1 select-text"
            style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
          >
            {featuredName.name}
          </h3>
          <p className="text-xs sm:text-sm font-medium leading-relaxed max-w-sm mx-auto text-stone-700 dark:text-stone-200">
            {featuredName.meaning}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-2 mb-3 shrink-0" dir="rtl">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في أسماء الله الحسنى أو المعاني..."
              className={`w-full py-2 pr-9 pl-3 rounded-xl text-xs font-medium border focus:outline-none transition ${
                isDark
                  ? 'bg-[#1a1814] border-[#d4af37]/30 text-white focus:border-[#d4af37]'
                  : 'bg-white border-stone-300 text-stone-900 focus:border-[#2e4426]'
              }`}
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>

          <button
            onClick={() => setOnlySaved(!onlySaved)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1 shrink-0 ${
              onlySaved
                ? 'bg-[#d4af37] text-stone-950 border-[#d4af37]'
                : isDark
                ? 'bg-[#1a1814] text-stone-300 border-[#d4af37]/30'
                : 'bg-white text-stone-700 border-stone-300'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlySaved ? 'fill-stone-950 text-stone-950' : ''}`} />
            <span>المحفوظة ({savedIds.length})</span>
          </button>
        </div>

        {/* Grid of 99 Names */}
        <div className="flex-1 overflow-y-auto space-y-2.5 px-1 py-1 no-scrollbar" dir="rtl">
          {filteredNames.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-500">
              لا توجد نتائج مطابقة لبحثك
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredNames.map((item) => {
                const isSaved = savedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border transition space-y-1.5 ${
                      isDark
                        ? 'bg-[#181818] border-[#d4af37]/25 text-stone-100 hover:border-[#d4af37]/45'
                        : 'bg-white border-stone-200 text-stone-900 shadow-2xs hover:border-[#2e4426]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#d4af37]/15 text-[#8c6b2d] dark:text-[#d4af37]">
                          #{item.id}
                        </span>
                        <h4
                          className="text-base sm:text-lg font-bold text-[#d4af37] select-text"
                          style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
                        >
                          {item.name}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopy(item)}
                          className={`p-1.5 rounded-lg transition ${
                            isDark ? 'hover:bg-[#25221b] text-stone-400' : 'hover:bg-stone-100 text-stone-500'
                          }`}
                          title="نسخ"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => toggleSave(item.id)}
                          className={`p-1.5 rounded-lg transition ${
                            isSaved
                              ? 'text-[#d4af37]'
                              : isDark
                              ? 'text-stone-500 hover:text-stone-300'
                              : 'text-stone-400 hover:text-stone-600'
                          }`}
                          title={isSaved ? 'إزالة من المحفوظات' : 'حفظ'}
                        >
                          <Star className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#d4af37]' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                      {item.meaning}
                    </p>

                    {item.reflection && (
                      <p className="text-[11px] text-stone-500 dark:text-[#a39e93] italic border-t border-stone-200/50 dark:border-stone-800 pt-1">
                        {item.reflection}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#d4af37]/20 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 shrink-0" dir="rtl">
          <span>«إِنَّ لِلَّهِ تِسْعَةً وَتِسْعِينَ اسْمًا مَنْ أَحْصَاهَا دَخَلَ الْجَنَّةَ»</span>
          <span className="font-mono">{filteredNames.length} من ٩٩</span>
        </div>
      </div>
    </div>
  );
};
