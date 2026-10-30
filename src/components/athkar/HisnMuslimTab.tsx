import React, { useState, useEffect } from 'react';
import {
  Search,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  Check,
  RotateCcw,
  Copy,
} from 'lucide-react';
import { AthkarItem, NavigationTab } from '../../types';
import { ScreenBackButton } from '../common/ScreenBackButton';
import { fetchAllAthkar, getAthkarCategories } from '../../services/athkarService';
import { AthkarCategoryView } from './AthkarCategoryView';
import { AthkarSpiritualSplash } from './AthkarSpiritualSplash';
import { SebhaSection } from './SebhaSection';
import { KUNUZ_ATHKAR_ITEMS } from '../../data/kunuzAthkarData';
import {
  MorningAthkarIcon,
  EveningAthkarIcon,
  SleepAthkarIcon,
  WakingAthkarIcon,
  AfterPrayerAthkarIcon,
  KunuzAthkarIcon,
  TasbeehAthkarIcon,
  HisnMuslimIcon,
} from './AthkarGridIcons';

interface Props {
  initialCategory?: string | null;
  initialSubTab?: 'grid' | 'daily' | 'tahseen' | 'all' | 'sebha';
  onNavigateHome?: () => void;
  onNavigateTab?: (tab: NavigationTab) => void;
}

const normalizeSubTab = (t?: string): 'grid' | 'all' | 'sebha' =>
  t === 'all' ? 'all' : t === 'sebha' ? 'sebha' : 'grid';

export const HisnMuslimTab: React.FC<Props> = ({
  initialCategory = null,
  initialSubTab = 'grid',
  onNavigateHome,
  onNavigateTab,
}) => {
  const [subTab, setSubTab] = useState<'grid' | 'all' | 'sebha'>(() => normalizeSubTab(initialSubTab));
  const [showSpiritualSplash, setShowSpiritualSplash] = useState(true);
  const [athkarList, setAthkarList] = useState<AthkarItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active view: category reader or main listing
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  // Sync initialSubTab when parent changes it
  useEffect(() => {
    if (initialSubTab) {
      setSubTab(normalizeSubTab(initialSubTab));
    }
  }, [initialSubTab]);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchAllAthkar();
        if (isMounted) {
          setAthkarList(data);
          const cats = getAthkarCategories(data);
          setCategories(cats);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : 'تعذر تحميل كتاب حصن المسلم';
          setError(msg);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered categories for complete 135 doors
  const filteredCategories = categories.filter((c) =>
    c.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  // Category view active: Render AthkarCategoryView matching image 3 (image_e17c58f9.png)
  if (activeCategory) {
    const itemsForCategory =
      activeCategory === 'كنوز'
        ? KUNUZ_ATHKAR_ITEMS
        : athkarList.filter((item) => item.category === activeCategory);

    return (
      <AthkarCategoryView
        category={activeCategory}
        items={itemsForCategory.length > 0 ? itemsForCategory : KUNUZ_ATHKAR_ITEMS}
        onBack={() => setActiveCategory(null)}
      />
    );
  }

  // 8 Main Cards matching image 2 (image_b31003b4.png)
  const mainAthkarCategories = [
    {
      id: 'morning',
      title: 'أذكار الصباح',
      targetCategory: 'أذكار الصباح',
      icon: <MorningAthkarIcon className="w-16 h-16 sm:w-20 sm:h-20" />,
      onClick: () => setActiveCategory('أذكار الصباح'),
    },
    {
      id: 'evening',
      title: 'أذكار المساء',
      targetCategory: 'أذكار المساء',
      icon: <EveningAthkarIcon className="w-16 h-16 sm:w-20 sm:h-20" />,
      onClick: () => setActiveCategory('أذكار المساء'),
    },
    {
      id: 'sleep',
      title: 'أذكار النوم',
      targetCategory: 'أذكار النوم',
      icon: <SleepAthkarIcon className="w-16 h-16 sm:w-20 sm:h-20" />,
      onClick: () => setActiveCategory('أذكار النوم'),
    },
    {
      id: 'waking',
      title: 'أذكار الاستيقاظ',
      targetCategory: 'أذكار الاستيقاظ من النوم',
      icon: <WakingAthkarIcon className="w-16 h-16 sm:w-20 sm:h-20" />,
      onClick: () => setActiveCategory('أذكار الاستيقاظ من النوم'),
    },
    {
      id: 'after_prayer',
      title: 'أذكار بعد الصلاه',
      targetCategory: 'الأذكار بعد السلام من الصلاة',
      icon: <AfterPrayerAthkarIcon className="w-16 h-16 sm:w-20 sm:h-20" />,
      onClick: () => setActiveCategory('الأذكار بعد السلام من الصلاة'),
    },
    {
      id: 'kunuz',
      title: 'كنوز',
      targetCategory: 'كنوز',
      icon: <KunuzAthkarIcon className="w-16 h-16 sm:w-20 sm:h-20" />,
      onClick: () => setActiveCategory('كنوز'),
    },
    {
      id: 'tasbeeh',
      title: 'تسبيح',
      targetCategory: null,
      icon: <TasbeehAthkarIcon className="w-16 h-16 sm:w-20 sm:h-20" />,
      onClick: () => setSubTab('sebha'),
    },
    {
      id: 'hisn',
      title: 'حصن المسلم',
      targetCategory: null,
      icon: <HisnMuslimIcon className="w-16 h-16 sm:w-20 sm:h-20" />,
      onClick: () => setSubTab('all'),
    },
  ];

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300" dir="rtl">
      {/* 1. Welcoming Spiritual Splash Screen (image_b23d028a.png) with theme support */}
      {showSpiritualSplash && (
        <AthkarSpiritualSplash
          onDismiss={() => setShowSpiritualSplash(false)}
          isDark={isDark}
        />
      )}

      {/* 2. Main Header for Ward Al-Athkar */}
      <div className="rounded-3xl bg-[#faf8f5] dark:bg-[#141414] text-stone-900 dark:text-white p-5 border border-[#d4af37]/35 shadow-md space-y-1 relative overflow-hidden text-center sm:text-right">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <ScreenBackButton
              onClick={() => {
                if (subTab !== 'grid') {
                  setSubTab('grid');
                } else if (onNavigateHome) {
                  onNavigateHome();
                }
              }}
              ariaLabel="رجوع"
            />
            <div className="space-y-0.5 text-right">
              <h2
                className="text-xl sm:text-2xl font-black text-stone-900 dark:text-[#f5e6b8]"
                style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
              >
                ورد الأذكار
              </h2>
              <p className="text-xs text-[#8c6b2d] dark:text-[#d4af37]">
                الأوراد اليومية والمأثورات النبوية الشريفة
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. MAIN VIEW: 8 ATHKAR CARDS (MATCHING IMAGE_B31003B4.PNG)
         ======================================================== */}
      {subTab === 'grid' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
            {mainAthkarCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={cat.onClick}
                className="group relative flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-3xl bg-white dark:bg-[#141414] border border-stone-200/80 dark:border-[#d4af37]/25 hover:border-[#d4af37]/60 transition-all duration-200 active:scale-95 shadow-xs hover:shadow-md"
              >
                {/* Visual Icon Illustration */}
                <div className="flex items-center justify-center my-1 transition-transform group-hover:scale-105">
                  {cat.icon}
                </div>

                {/* Bold Category Title */}
                <span
                  className="text-xs sm:text-sm font-extrabold text-stone-900 dark:text-stone-100 group-hover:text-[#d4af37] transition-colors text-center mt-1 leading-snug"
                  style={{ fontFamily: "'Traditional Arabic', 'Amiri', serif" }}
                >
                  {cat.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          4. VIEW: COMPLETE 135 CHAPTERS INDEX (WHEN CLICKING HISN AL-MUSLIM)
         ======================================================== */}
      {subTab === 'all' && (
        <div className="space-y-3">
          {/* Header & Back to 8 cards */}
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200">
              أبواب حصن المسلم الكاملة (١٣٥ باباً):
            </h3>
            <button
              onClick={() => setSubTab('grid')}
              className="text-xs font-bold text-[#d4af37] hover:underline flex items-center gap-1"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة للأذكار</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="ابحث في أبواب حصن المسلم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-2xl bg-white dark:bg-[#141414] border border-stone-200/80 dark:border-[#d4af37]/25 text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37] shadow-2xs"
            />
          </div>

          {/* Complete Categories List */}
          <div className="space-y-1.5">
            {isLoading ? (
              <div className="py-12 text-center text-xs text-stone-500 animate-pulse space-y-2">
                <div className="w-8 h-8 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin mx-auto" />
                <p>جاري تحميل كتاب حصن المسلم كاملاً...</p>
              </div>
            ) : error ? (
              <div className="py-6 text-center text-xs text-rose-600 dark:text-rose-400">
                {error}
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-500">
                لا توجد أبواب أذكار مطابقة لبحثك
              </div>
            ) : (
              <div className="space-y-1.5">
                {filteredCategories.map((cat, idx) => {
                  const count = athkarList.filter((i) => i.category === cat).length;

                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#141414] border border-stone-200/80 dark:border-[#d4af37]/25 hover:border-[#d4af37]/60 hover:bg-stone-50 dark:hover:bg-[#1a1814] transition text-right group active:scale-[0.99] shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-stone-100 dark:bg-[#1a1814] text-stone-600 dark:text-[#d4af37] font-mono text-xs flex items-center justify-center font-bold border border-stone-200/60 dark:border-[#d4af37]/20">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white group-hover:text-[#d4af37] transition-colors">
                            {cat}
                          </h4>
                          <span className="text-[10px] text-stone-400">
                            {count} {count === 1 ? 'ذكر مأثور' : 'أذكار مأثورة'}
                          </span>
                        </div>
                      </div>

                      <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-[#d4af37] transition-transform group-hover:-translate-x-0.5" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          5. VIEW: SEBHA SECTION (WHEN CLICKING TASBEEH)
         ======================================================== */}
      {subTab === 'sebha' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200">
              المسبحة الإلكترونية والتسبيح:
            </h3>
            <button
              onClick={() => setSubTab('grid')}
              className="text-xs font-bold text-[#d4af37] hover:underline flex items-center gap-1"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة للأذكار</span>
            </button>
          </div>
          <SebhaSection />
        </div>
      )}
    </div>
  );
};
