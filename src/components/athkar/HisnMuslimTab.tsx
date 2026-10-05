import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Search,
  ChevronLeft,
  Sun,
  Moon,
  Clock,
  ShieldCheck,
  Heart,
  Copy,
  Check,
  Share2,
  RotateCcw,
  Compass,
  Bookmark,
} from 'lucide-react';
import { AthkarItem, NavigationTab } from '../../types';
import { fetchAllAthkar, getAthkarCategories } from '../../services/athkarService';
import { AthkarCategoryView } from './AthkarCategoryView';
import { AthkarSpiritualSplash } from './AthkarSpiritualSplash';
import { SebhaSection } from './SebhaSection';

interface Props {
  initialCategory?: string | null;
  initialSubTab?: 'daily' | 'tahseen' | 'all' | 'sebha';
  onNavigateHome?: () => void;
  onNavigateTab?: (tab: NavigationTab) => void;
}

interface TahseenDuaItem {
  id: string;
  category: string;
  thikr: string;
  benefit: string;
  dalil: string;
  count: number;
}

const TAHSEEN_ITEMS: TahseenDuaItem[] = [
  {
    id: 'tahseen_1',
    category: 'التحصين التام الصباحي والمسائي',
    thikr: '«بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ»',
    benefit: 'حفظ ووقاية تامة من كل فجأة بلاء وضر وسم وسحر',
    dalil: 'رواه أبو داود والترمذي (من قالها ثلاثاً إذا أصبح وثلاثاً إذا أمسى لم يضره شيء)',
    count: 3,
  },
  {
    id: 'tahseen_2',
    category: 'الاستعاذة بكلمات الله التامات',
    thikr: '«أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ»',
    benefit: 'حصن منيع من الهوام والدواب وكل ذي شر ومكروه',
    dalil: 'رواه مسلم (من نزل منزلاً ثم قالها لم يضره شيء حتى يرتحل من منزله ذلك)',
    count: 3,
  },
  {
    id: 'tahseen_3',
    category: 'دعاء الخروج من المنزل والحماية',
    thikr: '«بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ»',
    benefit: 'كفاية ووقاية وهداية وتنحي الشيطان عن العبد',
    dalil: 'رواه الترمذي وأبو داود (يُقال له: هُديتَ وكُفيتَ ووُقيتَ، وتنحّى عنه الشيطان)',
    count: 1,
  },
  {
    id: 'tahseen_4',
    category: 'تفريج الهم والحزن وقضاء الديون',
    thikr: '«اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ»',
    benefit: 'دعاء نبوي جامع لانشراح الصدر والنجاة من كرب الدنيا والآخرة',
    dalil: 'رواه البخاري عن أنس بن مالك رضي الله عنه',
    count: 1,
  },
  {
    id: 'tahseen_5',
    category: 'سيد الاستغفار وموجب المغفرة',
    thikr: '«اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ»',
    benefit: 'أعظم صيغ التوبة والمغفرة وموجبة للجنة',
    dalil: 'رواه البخاري (من قالها موقناً بها حين يمسي فمات من ليلته دخل الجنة)',
    count: 1,
  },
];

export const HisnMuslimTab: React.FC<Props> = ({
  initialCategory = null,
  initialSubTab = 'daily',
  onNavigateHome,
  onNavigateTab,
}) => {
  const [subTab, setSubTab] = useState<'daily' | 'tahseen' | 'all' | 'sebha'>(initialSubTab);
  const [showSpiritualSplash, setShowSpiritualSplash] = useState(true);
  const [athkarList, setAthkarList] = useState<AthkarItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active view: category reader or main listing
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  // Tahseen repetition counter state
  const [tahseenCounts, setTahseenCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    TAHSEEN_ITEMS.forEach((item) => {
      initial[item.id] = 0;
    });
    return initial;
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync initialSubTab when parent changes it
  useEffect(() => {
    if (initialSubTab) {
      setSubTab(initialSubTab);
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

  const handleTahseenIncrement = (item: TahseenDuaItem) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(25);
    }
    setTahseenCounts((prev) => {
      const current = prev[item.id] || 0;
      if (current < item.count) {
        const next = current + 1;
        if (next === item.count && typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([40, 50, 40]);
        }
        return { ...prev, [item.id]: next };
      }
      return prev;
    });
  };

  const handleResetTahseen = (id: string) => {
    setTahseenCounts((prev) => ({ ...prev, [id]: 0 }));
  };

  const handleCopyTahseen = (item: TahseenDuaItem) => {
    const text = `${item.thikr}\n[الفضل: ${item.benefit}]\n[المصدر: ${item.dalil}]\n— من حصن المسلم · أثَر`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Category view active
  if (activeCategory) {
    const itemsForCategory = athkarList.filter((item) => item.category === activeCategory);
    return (
      <AthkarCategoryView
        category={activeCategory}
        items={itemsForCategory}
        onBack={() => setActiveCategory(null)}
      />
    );
  }

  // Top core daily athkar categories
  const topDailyCategories = [
    { title: 'أذكار الصباح', icon: Sun, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60' },
    { title: 'أذكار المساء', icon: Moon, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60' },
    { title: 'الأذكار بعد السلام من الصلاة', icon: Clock, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60' },
    { title: 'أذكار النوم', icon: Moon, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60' },
    { title: 'أذكار الاستيقاظ من النوم', icon: Sun, color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/60' },
  ];

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      {/* Spiritual Transition Splash on Opening */}
      {showSpiritualSplash && (
        <AthkarSpiritualSplash onDismiss={() => setShowSpiritualSplash(false)} />
      )}

      {/* Main Header Banner for Hisn Muslim */}
      <div className="rounded-3xl bg-gradient-to-br from-[#092b21] via-[#0d3b2e] to-[#081e17] text-white p-5 border border-[#dfb76c]/40 shadow-xl space-y-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#dfb76c]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#dfb76c] to-[#c5a059] text-[#0d3b2e] flex items-center justify-center font-bold shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-1.5">
                <span>حصن المسلم</span>
                <Sparkles className="w-4 h-4 text-[#dfb76c]" />
              </h2>
              <p className="text-xs text-[#dfb76c]/90">
                جامع الأذكار اليومية وأوراد التحصين النبوية الشريفة
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-white/10 text-[#dfb76c] border border-white/10 shrink-0 font-mono">
            {categories.length > 0 ? `${categories.length} باباً` : '١٣٥ باباً'}
          </span>
        </div>

        <div className="text-[11px] text-stone-300 pt-2 border-t border-white/10 flex items-center justify-between flex-wrap gap-1">
          <span>المصدر: كتاب «حصن المسلم من أذكار الكتاب والسنة»</span>
          <span className="text-[#dfb76c] font-semibold">٣٤٥ ذكراً مأثوراً</span>
        </div>
      </div>

      {/* 4 Clean Sub-Tab Switches: الأوراد اليومية | أوراد التحصين | أبواب الحصن | المسبحة */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-stone-200/80 dark:bg-[#122e23] rounded-2xl border border-stone-300/60 dark:border-stone-800 text-[11px] font-bold shadow-2xs">
        <button
          onClick={() => setSubTab('daily')}
          className={`py-2 px-1 text-center rounded-xl transition ${
            subTab === 'daily'
              ? 'bg-white dark:bg-[#0d3b2e] text-[#0d3b2e] dark:text-[#dfb76c] shadow-xs border border-stone-200 dark:border-[#dfb76c]/30 font-black'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          أذكار اليوم
        </button>
        <button
          onClick={() => setSubTab('tahseen')}
          className={`py-2 px-1 text-center rounded-xl transition ${
            subTab === 'tahseen'
              ? 'bg-white dark:bg-[#0d3b2e] text-[#0d3b2e] dark:text-[#dfb76c] shadow-xs border border-stone-200 dark:border-[#dfb76c]/30 font-black'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          أوراد التحصين
        </button>
        <button
          onClick={() => setSubTab('all')}
          className={`py-2 px-1 text-center rounded-xl transition ${
            subTab === 'all'
              ? 'bg-white dark:bg-[#0d3b2e] text-[#0d3b2e] dark:text-[#dfb76c] shadow-xs border border-stone-200 dark:border-[#dfb76c]/30 font-black'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          أبواب الحصن
        </button>
        <button
          onClick={() => setSubTab('sebha')}
          className={`py-2 px-1 text-center rounded-xl transition ${
            subTab === 'sebha'
              ? 'bg-white dark:bg-[#0d3b2e] text-[#0d3b2e] dark:text-[#dfb76c] shadow-xs border border-stone-200 dark:border-[#dfb76c]/30 font-black'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          المسبحة
        </button>
      </div>

      {/* VIEW 1: DAILY CORE ATHKAR */}
      {subTab === 'daily' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>الأوراد اليومية المأثورة</span>
            </h3>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              اضغط على الورد للقراءة والعد
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {topDailyCategories.map((top) => {
              const count = athkarList.filter((i) => i.category === top.title).length;
              const IconComponent = top.icon;

              return (
                <button
                  key={top.title}
                  onClick={() => setActiveCategory(top.title)}
                  className="p-4 rounded-3xl bg-white dark:bg-[#122e23] border border-stone-200/80 dark:border-stone-800 hover:border-[#dfb76c]/60 text-right transition shadow-xs group active:scale-[0.98] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${top.color} shadow-2xs`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-white group-hover:text-[#0d3b2e] dark:group-hover:text-[#dfb76c] transition-colors">
                        {top.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                        {count > 0 ? `${count} ذكراً مأثوراً` : 'أذكار موثقة'}
                      </p>
                    </div>
                  </div>

                  <ChevronLeft className="w-5 h-5 text-stone-400 group-hover:text-[#0d3b2e] dark:group-hover:text-[#dfb76c] transition-transform group-hover:-translate-x-1 shrink-0" />
                </button>
              );
            })}
          </div>

          {/* Quick Banner to Explore All Doors */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-[#dfb76c]/15 to-[#0d3b2e]/10 border border-[#dfb76c]/30 flex items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold text-[#0d3b2e] dark:text-[#dfb76c]">
                تريد أذكاراً لأوقات وأحوال أخرى؟
              </h4>
              <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-0.5">
                تصفح فهرس أبواب حصن المسلم الكامل (١٣٥ باباً)
              </p>
            </div>
            <button
              onClick={() => setSubTab('all')}
              className="px-3 py-1.5 rounded-xl bg-[#0d3b2e] text-[#dfb76c] text-xs font-bold hover:bg-[#114536] transition shrink-0"
            >
              عرض الأبواب
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: PROPHETIC TAHSEEN & PROTECTION DUAS */}
      {subTab === 'tahseen' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/25 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>أدعية التحصين الكبرى: اضغط على البطاقة لتسجيل التكرار</span>
            </div>
          </div>

          <div className="space-y-3">
            {TAHSEEN_ITEMS.map((item) => {
              const current = tahseenCounts[item.id] || 0;
              const isCompleted = current >= item.count;

              return (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 rounded-3xl border transition-all shadow-xs space-y-3 ${
                    isCompleted
                      ? 'bg-emerald-50/70 dark:bg-[#0f2e22] border-emerald-500/50'
                      : 'bg-white dark:bg-[#122e23] border-stone-200/80 dark:border-stone-800 hover:border-[#dfb76c]/50'
                  }`}
                >
                  {/* Card Header: Category & Counter */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#0d3b2e] dark:text-[#dfb76c] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#dfb76c]" />
                      <span>{item.category}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      {isCompleted && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-600 text-white flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>اكتمل الورد</span>
                        </span>
                      )}

                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-[#dfb76c]/20 text-[#855e1b] dark:text-[#dfb76c]">
                        {current} / {item.count}
                      </span>
                    </div>
                  </div>

                  {/* Sacred Thikr Text */}
                  <div
                    onClick={() => handleTahseenIncrement(item)}
                    className="cursor-pointer active:scale-[0.99] p-2 rounded-2xl transition hover:bg-stone-50/60 dark:hover:bg-white/5"
                  >
                    <p
                      style={{ fontFamily: 'var(--font-quran), Amiri, serif' }}
                      className="text-lg sm:text-xl leading-loose text-stone-900 dark:text-stone-100 font-semibold select-text text-center sm:text-right"
                    >
                      {item.thikr}
                    </p>
                  </div>

                  {/* Benefit & Evidence */}
                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-[#0b241c] border border-stone-200/60 dark:border-stone-800/80 space-y-1 text-xs">
                    <div className="flex items-baseline gap-1 text-[#0d3b2e] dark:text-[#dfb76c] font-semibold">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.benefit}</span>
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400">
                      {item.dalil}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-stone-800/80 text-xs">
                    <button
                      onClick={() => handleResetTahseen(item.id)}
                      title="إعادة التكرار"
                      className="flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>إعادة</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyTahseen(item)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-[#0d3b2e]/60 text-stone-700 dark:text-stone-200 hover:text-[#0d3b2e] dark:hover:text-[#dfb76c] text-[11px] font-bold transition active:scale-95"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>تم النسخ</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleTahseenIncrement(item)}
                        disabled={isCompleted}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                          isCompleted
                            ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-default'
                            : 'bg-gradient-to-r from-[#0d3b2e] to-[#144f3e] text-[#dfb76c] border border-[#dfb76c]/40 shadow-xs'
                        }`}
                      >
                        {isCompleted ? 'تم' : 'كرر الذكر +1'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: COMPLETE 135 CHAPTERS INDEX WITH SEARCH */}
      {subTab === 'all' && (
        <div className="space-y-3">
          {/* Search All Categories */}
          <div className="relative">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="ابحث في ١٣٥ باباً من حصن المسلم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-2xl bg-white dark:bg-[#122e23] border border-stone-200/80 dark:border-stone-800 text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0d3b2e] dark:focus:ring-[#dfb76c] shadow-2xs"
            />
          </div>

          {/* Complete Categories List */}
          <div className="space-y-1.5">
            {isLoading ? (
              <div className="py-12 text-center text-xs text-stone-500 animate-pulse space-y-2">
                <div className="w-8 h-8 rounded-full border-2 border-[#0d3b2e] dark:border-[#dfb76c] border-t-transparent animate-spin mx-auto" />
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
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#122e23] border border-stone-200/80 dark:border-stone-800 hover:border-[#dfb76c]/60 hover:bg-stone-50 dark:hover:bg-[#16382b] transition text-right group active:scale-[0.99] shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-stone-100 dark:bg-[#0b241c] text-stone-600 dark:text-[#dfb76c] font-mono text-xs flex items-center justify-center font-bold border border-stone-200/60 dark:border-stone-800">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white group-hover:text-[#0d3b2e] dark:group-hover:text-[#dfb76c] transition-colors">
                            {cat}
                          </h4>
                          <span className="text-[10px] text-stone-400">
                            {count} {count === 1 ? 'ذكر مأثور' : 'أذكار مأثورة'}
                          </span>
                        </div>
                      </div>

                      <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-[#0d3b2e] dark:group-hover:text-[#dfb76c] transition-transform group-hover:-translate-x-0.5" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 4: SEBHA SECTION */}
      {subTab === 'sebha' && (
        <div className="space-y-3">
          <SebhaSection />
        </div>
      )}
    </div>
  );
};
