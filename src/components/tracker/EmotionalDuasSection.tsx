import React, { useState } from 'react';
import {
  Heart,
  Smile,
  ShieldAlert,
  Coins,
  Compass,
  Copy,
  Check,
  Share2,
  RefreshCw,
  Feather,
} from 'lucide-react';
import { EMOTIONAL_DUAS } from '../../data/emotionalDuasData';
import { EmotionalCategory, EmotionalDuaItem } from '../../types';

interface PastelConfig {
  id: EmotionalCategory;
  title: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeText: string;
  bgPastel: string;
  borderPastel: string;
  textPastel: string;
  cardBg: string;
  buttonColor: string;
}

export const EmotionalDuasSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<EmotionalCategory>('anxiety_distress');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const emotionTabs: PastelConfig[] = [
    {
      id: 'anxiety_distress',
      title: 'ضيق وقلق',
      sublabel: 'سكينة وانشراح الصدر',
      icon: ShieldAlert,
      badgeText: 'انشراح الصدر والسكينة',
      bgPastel: 'from-purple-500/10 via-violet-500/10 to-indigo-500/10',
      borderPastel: 'border-purple-300/60 dark:border-purple-800/50',
      textPastel: 'text-purple-700 dark:text-purple-300',
      cardBg: 'bg-purple-50/40 dark:bg-purple-950/20',
      buttonColor: 'bg-purple-600 hover:bg-purple-700 text-white',
    },
    {
      id: 'grief_relief',
      title: 'حزن وكرب',
      sublabel: 'طلب الفرج وطمأنينة القلب',
      icon: Heart,
      badgeText: 'الطمأنينة وتفريج الكرب',
      bgPastel: 'from-sky-500/10 via-blue-500/10 to-cyan-500/10',
      borderPastel: 'border-sky-300/60 dark:border-sky-800/50',
      textPastel: 'text-sky-700 dark:text-sky-300',
      cardBg: 'bg-sky-50/40 dark:bg-sky-950/20',
      buttonColor: 'bg-sky-600 hover:bg-sky-700 text-white',
    },
    {
      id: 'joy_gratitude',
      title: 'رجاء وشكر',
      sublabel: 'حفظ النعم وحسن الأمل',
      icon: Smile,
      badgeText: 'الرجاء وحسن الظن',
      bgPastel: 'from-[#d4af37]/15 via-amber-500/10 to-[#c5a059]/10',
      borderPastel: 'border-[#d4af37]/40 dark:border-[#d4af37]/30',
      textPastel: 'text-stone-900 dark:text-[#d4af37]',
      cardBg: 'bg-[#d4af37]/10 dark:bg-[#141414]',
      buttonColor: 'bg-[#d4af37] hover:bg-[#c5a059] text-stone-950',
    },
    {
      id: 'sustenance_ease',
      title: 'رزق وتيسير',
      sublabel: 'قضاء الحوائج وبركة السعي',
      icon: Coins,
      badgeText: 'البركة وتيسير الرزق',
      bgPastel: 'from-amber-500/10 via-orange-500/10 to-yellow-500/10',
      borderPastel: 'border-amber-300/60 dark:border-amber-800/50',
      textPastel: 'text-amber-700 dark:text-amber-300',
      cardBg: 'bg-amber-50/40 dark:bg-amber-950/20',
      buttonColor: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    {
      id: 'fear_hesitation',
      title: 'خوف أو تردد',
      sublabel: 'الاستخارة وحسن التوكل',
      icon: Compass,
      badgeText: 'الأمان وحسن التوكل',
      bgPastel: 'from-cyan-500/10 via-teal-500/10 to-sky-500/10',
      borderPastel: 'border-cyan-300/60 dark:border-cyan-800/50',
      textPastel: 'text-cyan-700 dark:text-cyan-300',
      cardBg: 'bg-cyan-50/40 dark:bg-cyan-950/20',
      buttonColor: 'bg-cyan-600 hover:bg-cyan-700 text-white',
    },
  ];

  const currentTab = emotionTabs.find((t) => t.id === selectedCategory) || emotionTabs[0];

  const handleIncrement = (id: string, target: number) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(18);
    }
    setCounts((prev) => {
      const cur = prev[id] || 0;
      return { ...prev, [id]: cur < target ? cur + 1 : 0 };
    });
  };

  const handleCopy = (item: EmotionalDuaItem) => {
    const text = `${item.arabicText}\n[المصدر: ${item.source}] - تطبيق أثَر | Athar`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleShare = async (item: EmotionalDuaItem) => {
    const text = `${item.arabicText}\n[المصدر: ${item.source}] - تطبيق أثَر | Athar`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: text,
        });
      } catch (err) {
        console.warn(err);
      }
    } else {
      handleCopy(item);
    }
  };

  const activeDuas = EMOTIONAL_DUAS.filter((d) => d.category === selectedCategory);

  return (
    <div className="space-y-4">
      {/* 1. Psychological Soothing Header */}
      <div
        className={`p-5 rounded-3xl bg-gradient-to-r ${currentTab.bgPastel} border ${currentTab.borderPastel} backdrop-blur-sm transition-all duration-300 space-y-1.5`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Feather className={`w-4 h-4 ${currentTab.textPastel}`} />
            <h3 className="text-sm font-extrabold text-stone-900 dark:text-white">
              الذكر حسب الحالة النفسية والوجدانية
            </h3>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${currentTab.cardBg} ${currentTab.textPastel} border ${currentTab.borderPastel}`}>
            {currentTab.badgeText}
          </span>
        </div>
        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
          أدعية نبوية وقرآنية مأثورة تبث الطمأنينة في القلب وتعينك في شتى أحوالك وكروبك.
        </p>
      </div>

      {/* 2. Soft Pastel Category Pill Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {emotionTabs.map((tab) => {
          const isSelected = selectedCategory === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                  navigator.vibrate(15);
                }
                setSelectedCategory(tab.id);
              }}
              className={`p-3 rounded-2xl border text-right transition-all duration-200 active:scale-95 flex items-center gap-2.5 shadow-xs ${
                isSelected
                  ? `${tab.cardBg} ${tab.borderPastel} shadow-md`
                  : 'bg-white dark:bg-stone-900 border-stone-200/80 dark:border-stone-800 hover:bg-stone-50'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                  isSelected
                    ? `${tab.buttonColor} shadow-sm scale-105`
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div
                  className={`text-xs font-bold truncate ${
                    isSelected ? tab.textPastel : 'text-stone-900 dark:text-white'
                  }`}
                >
                  {tab.title}
                </div>
                <div className="text-[10px] text-stone-400 truncate mt-0.5">
                  {tab.sublabel}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Soft Pastel Dua Cards List */}
      <div className="space-y-3 pt-1">
        {activeDuas.map((dua) => {
          const currentCount = counts[dua.id] || 0;
          const isDone = currentCount >= dua.targetCount && dua.targetCount > 1;

          return (
            <div
              key={dua.id}
              className={`p-4 sm:p-5 rounded-3xl ${currentTab.cardBg} border ${currentTab.borderPastel} shadow-xs space-y-3 transition-all duration-200 hover:shadow-md`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-stone-200/60 dark:border-stone-800/80 pb-2">
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white dark:bg-stone-900 ${currentTab.textPastel} border ${currentTab.borderPastel}`}
                >
                  {dua.feelingTitle}
                </span>

                <span className="text-xs font-bold text-stone-900 dark:text-white truncate max-w-[180px]">
                  {dua.title}
                </span>
              </div>

              {/* Arabic Text in Traditional Amiri Calligraphy */}
              <div className="py-1">
                <p
                  style={{ fontFamily: "'Traditional Arabic', 'Amiri', 'Scheherazade New', serif" }}
                  className="text-lg sm:text-xl leading-[2.2] text-stone-900 dark:text-stone-100 select-text font-medium text-center px-1"
                >
                  {dua.arabicText}
                </p>
              </div>

              {/* Guidance & Source Box */}
              <div className="text-[11px] space-y-1 bg-white/70 dark:bg-stone-900/70 p-2.5 rounded-2xl border border-stone-200/50 dark:border-stone-800 leading-relaxed">
                {dua.guidance && (
                  <div className="text-amber-800 dark:text-amber-300 font-medium">
                    💡 <span className="font-normal">{dua.guidance}</span>
                  </div>
                )}
                <div className="text-stone-400 font-mono text-[10px]">
                  المصدر: {dua.source}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => handleIncrement(dua.id, dua.targetCount)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                    isDone
                      ? `${currentTab.buttonColor} shadow-xs`
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>
                    الترديد: {currentCount} / {dua.targetCount}
                  </span>
                  {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(dua)}
                    title="نسخ الدعاء"
                    className="p-2 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-100 text-stone-600 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700 transition"
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
                    className="p-2 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-100 text-stone-600 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700 transition"
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
