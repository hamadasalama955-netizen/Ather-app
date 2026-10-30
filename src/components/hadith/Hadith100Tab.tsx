import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Copy,
  Check,
  Star,
  BookOpen,
  Share2,
  ArrowRight,
  Filter,
  Flame,
  Bookmark,
} from 'lucide-react';
import { HADITH_100_LIST } from '../../data/hadithData';
import { HadithItem, NavigationTab } from '../../types';
import { ScreenBackButton } from '../common/ScreenBackButton';

interface Props {
  onNavigateHome?: () => void;
  onNavigateTab?: (tab: NavigationTab) => void;
}

export const Hadith100Tab: React.FC<Props> = ({ onNavigateHome }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [selectedSource, setSelectedSource] = useState<string>('الكل');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Favorites stored in localStorage
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('noor_hadith_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const toggleFavorite = (id: number) => {
    let next: number[];
    if (favorites.includes(id)) {
      next = favorites.filter((favId) => favId !== id);
    } else {
      next = [...favorites, id];
    }
    setFavorites(next);
    localStorage.setItem('noor_hadith_favorites', JSON.stringify(next));
  };

  const handleCopyHadith = (hadith: HadithItem) => {
    const textToCopy = `${hadith.text}\n\n[المصدر: ${hadith.source}]\n[الشرح الميسر]: ${hadith.explanation}\n[الفائدة]: ${hadith.benefit}\n— تطبيق أثَر | Athar - رفيق المسلم`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(hadith.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareHadith = async (hadith: HadithItem) => {
    const textToShare = `${hadith.text}\n\n[المصدر: ${hadith.source}]\n[الشرح]: ${hadith.explanation}\n— تطبيق أثَر | Athar - رفيق المسلم`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `حديث نبوي شريف #${hadith.number}`,
          text: textToShare,
        });
      } catch {
        // Ignored if cancelled
      }
    } else {
      handleCopyHadith(hadith);
    }
  };

  // Categories list
  const categories = [
    'الكل',
    'الإيمان والعقيدة',
    'العبادات والذكر',
    'الأخلاق والآداب',
    'المعاملات والحياة',
    'فضائل الأعمال',
  ];

  // Filtered Hadiths
  const filteredHadiths = useMemo(() => {
    return HADITH_100_LIST.filter((item) => {
      // Favorites filter
      if (showOnlyFavorites && !favorites.includes(item.id)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'الكل' && item.category !== selectedCategory) {
        return false;
      }

      // Source filter
      if (selectedSource !== 'الكل') {
        if (selectedSource === 'متفق عليه' && !item.source.includes('متفق')) return false;
        if (selectedSource === 'البخاري' && !item.source.includes('البخاري')) return false;
        if (selectedSource === 'مسلم' && !item.source.includes('مسلم')) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesText = item.text.toLowerCase().includes(query);
        const matchesExplanation = item.explanation.toLowerCase().includes(query);
        const matchesBenefit = item.benefit.toLowerCase().includes(query);
        const matchesSource = item.source.toLowerCase().includes(query);
        const matchesNumber = item.number.toString() === query;

        return matchesText || matchesExplanation || matchesBenefit || matchesSource || matchesNumber;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedSource, showOnlyFavorites, favorites]);

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300">
      {/* 1. Regal Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0a0a0a] via-[#d4af37] to-[#1a1814] text-[#fcfbf7] p-5 shadow-xl border border-[#dfb76c]/40">
        <div className="absolute top-0 left-0 w-36 h-36 bg-[#dfb76c]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-start gap-3">
            {onNavigateHome && (
              <ScreenBackButton onClick={onNavigateHome} ariaLabel="الرجوع إلى الرئيسية" />
            )}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#dfb76c]/20 border border-[#dfb76c]/40 text-[#dfb76c] text-[11px] font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>جوامع الكلم النبوية</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                ١٠٠ حديث شريف
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
                مختارات من صحيحي البخاري ومسلم في أصول الإيمان، والعبادات، ومكارم الأخلاق، مع شرح ميسر وفائدة عملية لكل حديث.
              </p>
            </div>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#dfb76c]/25 to-[#d4af37] border border-[#dfb76c]/40 flex items-center justify-center text-[#dfb76c] shrink-0 shadow-xs">
            <BookOpen className="w-6 h-6 text-[#dfb76c]" />
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-4 pt-3 border-t border-[#dfb76c]/20 flex items-center justify-between text-xs text-stone-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#dfb76c]" />
            <span>١٠٠ حديث معتمد وموثق</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                showOnlyFavorites
                  ? 'bg-[#dfb76c] text-[#1a1814]'
                  : 'bg-white/10 hover:bg-white/20 text-[#dfb76c]'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>المفضلة ({favorites.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="space-y-2.5">
        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بكلمة من متن الحديث أو الشرح أو برقم الحديث..."
            className="w-full py-2.5 pr-10 pl-9 rounded-2xl bg-[#fcfbf7] dark:bg-[#141414] border border-stone-200/80 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-[#dfb76c] shadow-2xs transition"
            dir="rtl"
          />
          <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 absolute left-3 top-2.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Categories scrollable pill row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setShowOnlyFavorites(false);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                selectedCategory === cat && !showOnlyFavorites
                  ? 'bg-[#d4af37] text-stone-950 font-bold dark:bg-[#d4af37] dark:text-stone-950 shadow-xs'
                  : 'bg-white dark:bg-[#141414] text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-800 hover:border-[#dfb76c]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Source sub-filter */}
        <div className="flex items-center justify-between px-1 text-xs">
          <div className="flex items-center gap-1 text-[11px] text-stone-500 dark:text-stone-400">
            <Filter className="w-3 h-3" />
            <span>المصدر:</span>
            {['الكل', 'متفق عليه', 'البخاري', 'مسلم'].map((src) => (
              <button
                key={src}
                onClick={() => setSelectedSource(src)}
                className={`px-2 py-0.5 rounded-md font-medium transition ${
                  selectedSource === src
                    ? 'text-[#d4af37] dark:text-[#dfb76c] font-bold underline'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                {src}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-bold text-stone-400 font-mono">
            {filteredHadiths.length} حديث
          </span>
        </div>
      </div>

      {/* 3. Hadith Cards List */}
      <div className="space-y-3.5">
        {filteredHadiths.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#fcfbf7] dark:bg-[#141414] border border-stone-200/80 dark:border-stone-800 text-center space-y-2">
            <p className="text-sm font-bold text-stone-600 dark:text-stone-300">
              لم يتم العثور على أحاديث مطابقة للبحث
            </p>
            <p className="text-xs text-stone-400">
              جرّب تغيير كلمات البحث أو اختيار فئة أخرى
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('الكل');
                setSelectedSource('الكل');
                setShowOnlyFavorites(false);
              }}
              className="text-xs font-bold text-[#d4af37] dark:text-[#dfb76c] underline pt-1"
            >
              عرض جميع الأحاديث
            </button>
          </div>
        ) : (
          filteredHadiths.map((hadith) => {
            const isFav = favorites.includes(hadith.id);
            return (
              <div
                key={hadith.id}
                className="p-4 sm:p-5 rounded-3xl bg-[#fcfbf7] dark:bg-[#141414] border border-stone-200/80 dark:border-stone-800 shadow-2xs hover:shadow-xs hover:border-[#dfb76c]/50 transition-all duration-150 space-y-3.5 relative overflow-hidden"
              >
                {/* Header: Number, Category, Source, and Actions */}
                <div className="flex items-center justify-between gap-2 border-b border-stone-200/60 dark:border-stone-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    {/* Serial Number Badge */}
                    <div className="w-7 h-7 rounded-xl bg-[#d4af37] text-stone-950 font-bold font-black font-mono text-xs flex items-center justify-center shrink-0 border border-[#dfb76c]/30 shadow-2xs">
                      {hadith.number}
                    </div>

                    {/* Category Label */}
                    <span className="text-[10px] font-bold text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-[#1a1814] px-2 py-0.5 rounded-lg border border-stone-200/60 dark:border-stone-800">
                      {hadith.category}
                    </span>
                  </div>

                  {/* Actions: Favorite, Copy, Share */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleFavorite(hadith.id)}
                      title={isFav ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
                      className={`p-1.5 rounded-xl transition ${
                        isFav
                          ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                          : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 bg-stone-100/70 dark:bg-stone-800'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleCopyHadith(hadith)}
                      title="نسخ الحديث والشرح"
                      className="p-1.5 rounded-xl bg-stone-100/70 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition"
                    >
                      {copiedId === hadith.id ? (
                        <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleShareHadith(hadith)}
                      title="مشاركة الحديث"
                      className="p-1.5 rounded-xl bg-stone-100/70 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Hadith Prophetic Text */}
                <div className="px-1 py-0.5 text-right">
                  <p
                    style={{ fontFamily: 'var(--font-quran), Amiri, serif' }}
                    className="text-base sm:text-lg leading-[2.2] text-stone-900 dark:text-stone-100 font-semibold select-text"
                  >
                    {hadith.text}
                  </p>
                </div>

                {/* Source Verification Badge */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[11px] font-bold text-[#d4af37] dark:text-[#dfb76c] flex items-center gap-1">
                    <Check className="w-3 h-3 text-[#dfb76c]" />
                    <span>{hadith.source}</span>
                  </span>

                  {copiedId === hadith.id && (
                    <span className="text-[10px] font-bold text-[#d4af37] dark:text-[#d4af37] animate-in fade-in">
                      تم نسخ الحديث بنجاح
                    </span>
                  )}
                </div>

                {/* Simplified Explanation & Benefit Box */}
                <div className="p-3.5 rounded-2xl bg-stone-100/75 dark:bg-[#1a1814] border border-stone-200/70 dark:border-stone-800/80 space-y-2">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-[#d4af37] dark:text-[#dfb76c] flex items-center gap-1.5">
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>الشرح الميسر:</span>
                    </div>
                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed text-justify">
                      {hadith.explanation}
                    </p>
                  </div>

                  {/* Core Benefit */}
                  <div className="pt-1.5 border-t border-stone-200/50 dark:border-stone-800 flex items-start gap-1.5 text-[11px] text-stone-600 dark:text-stone-300">
                    <span className="font-bold text-[#d4af37] dark:text-[#d4af37] shrink-0">
                      💡 الفائدة العملية:
                    </span>
                    <span className="font-medium">{hadith.benefit}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Return Home Button */}
      {onNavigateHome && (
        <div className="pt-3 text-center">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-stone-200/70 dark:bg-[#141414] hover:bg-stone-300 dark:hover:bg-[#1f1d19] text-stone-800 dark:text-stone-200 text-xs font-bold transition active:scale-95"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة للشاشة الرئيسية</span>
          </button>
        </div>
      )}
    </div>
  );
};
