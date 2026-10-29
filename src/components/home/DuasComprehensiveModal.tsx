import React, { useState } from 'react';
import {
  X,
  Heart,
  Smile,
  ShieldAlert,
  Coins,
  Compass,
  Search,
  Copy,
  Check,
  Share2,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { DUAS_LIST } from '../../data/duasData';
import { EMOTIONAL_DUAS } from '../../data/emotionalDuasData';
import { EmotionalCategory, DuaItem, EmotionalDuaItem } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

export const DuasComprehensiveModal: React.FC<Props> = ({ isOpen, onClose, isDark = false }) => {
  const [activeTab, setActiveTab] = useState<'emotional' | 'categories'>('emotional');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionalCategory>('anxiety_distress');
  const [selectedDuaCategory, setSelectedDuaCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});

  if (!isOpen) return null;

  // Emotional states matching image_fb3b7d0a.png
  const emotionStates: {
    id: EmotionalCategory;
    title: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    badgeText: string;
  }[] = [
    {
      id: 'anxiety_distress',
      title: 'ضيق وقلق',
      sublabel: 'سكينة وانشراح الصدر',
      icon: ShieldAlert,
      badgeText: 'انشراح الصدر والسكينة',
    },
    {
      id: 'grief_relief',
      title: 'حزن وكرب',
      sublabel: 'طلب الفرج وطمأنينة القلب',
      icon: Heart,
      badgeText: 'الطمأنينة وتفريج الكرب',
    },
    {
      id: 'joy_gratitude',
      title: 'رجاء وشكر',
      sublabel: 'حفظ النعم وحسن الأمل',
      icon: Smile,
      badgeText: 'الرجاء وحسن الظن',
    },
    {
      id: 'sustenance_ease',
      title: 'رزق وتيسير',
      sublabel: 'قضاء الحوائج وبركة السعي',
      icon: Coins,
      badgeText: 'البركة وتيسير الرزق',
    },
    {
      id: 'fear_hesitation',
      title: 'خوف أو تردد',
      sublabel: 'الاستخارة وحسن التوكل',
      icon: Compass,
      badgeText: 'الأمان وحسن التوكل',
    },
  ];

  // Dua categories matching image_e1ebb203.png
  const duaCategories = [
    { id: 'all', label: 'كل' },
    { id: 'quran', label: 'أدعية قرآنية' },
    { id: 'distress', label: 'تفريج الكرب' },
    { id: 'sustenance', label: 'الرزق والبركة' },
    { id: 'healing', label: 'الشفاء والعافية' },
    { id: 'travel_istikhara', label: 'الاستخارة والسفر' },
    { id: 'morning_evening', label: 'الصباح والمساء' },
  ];

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleIncrement = (id: string, target: number) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(25);
    }
    setCounts((prev) => {
      const current = prev[id] || 0;
      return { ...prev, [id]: current < target ? current + 1 : 0 };
    });
  };

  // Filtered duas for standard categories
  const filteredCategoryDuas = DUAS_LIST.filter((dua) => {
    if (selectedDuaCategory !== 'all' && dua.category !== selectedDuaCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return (
      dua.title.toLowerCase().includes(q) ||
      dua.arabicText.toLowerCase().includes(q) ||
      dua.source.toLowerCase().includes(q)
    );
  });

  // Emotional duas list
  const currentEmotionConfig = emotionStates.find((e) => e.id === selectedEmotion) || emotionStates[0];
  const currentEmotionDuas = EMOTIONAL_DUAS.filter((d) => d.category === selectedEmotion);

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
        <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/20 shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center border shadow-xs ${
                isDark
                  ? 'bg-[#1a1814] text-[#d4af37] border-[#d4af37]/35'
                  : 'bg-[#eef2e6] text-[#2e4426] border-[#2e4426]/20'
              }`}
            >
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3
                className={`text-base font-black tracking-tight ${
                  isDark ? 'text-white' : 'text-[#2e4426]'
                }`}
              >
                الأدعية المأثورة والجامعة
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-[#a39e93]">
                أدعية القرآن والسنة النبوية وأدعية الحالات الوجدانية
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl transition active:scale-95 ${
              isDark
                ? 'hover:bg-white/10 text-stone-300'
                : 'hover:bg-stone-200 text-stone-600'
            }`}
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dual Tab Switcher: 1. حسب الحالة النفسية (image 4) | 2. أدعية مصنفة (image 3) */}
        <div className="grid grid-cols-2 gap-2 my-3 shrink-0" dir="rtl">
          <button
            onClick={() => setActiveTab('emotional')}
            className={`py-2 px-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'emotional'
                ? isDark
                  ? 'bg-[#d4af37] text-stone-950 font-black shadow-md'
                  : 'bg-[#2e4426] text-white font-black shadow-sm'
                : isDark
                ? 'bg-[#1a1814] text-stone-300 border border-[#d4af37]/20'
                : 'bg-white text-stone-700 border border-stone-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>حسب الحالة النفسية</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`py-2 px-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'categories'
                ? isDark
                  ? 'bg-[#d4af37] text-stone-950 font-black shadow-md'
                  : 'bg-[#2e4426] text-white font-black shadow-sm'
                : isDark
                ? 'bg-[#1a1814] text-stone-300 border border-[#d4af37]/20'
                : 'bg-white text-stone-700 border border-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>أدعية مصنفة وقرآنية</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto pr-0.5 space-y-4 no-scrollbar">
          {/* TAB 1: EMOTIONAL STATE DUAS (مطابق للصورة الرابعة) */}
          {activeTab === 'emotional' && (
            <div className="space-y-3.5">
              {/* Banner intro matching image_fb3b7d0a.png */}
              <div
                className={`p-3.5 rounded-2xl border text-center space-y-1.5 ${
                  isDark
                    ? 'bg-[#1a1814] border-[#d4af37]/35 text-white'
                    : 'bg-[#f4f7ee] border-[#2e4426]/20 text-[#2e4426]'
                }`}
              >
                <div className="inline-block px-3 py-0.5 rounded-full text-[10px] font-bold border border-current opacity-80 mb-0.5">
                  {currentEmotionConfig.badgeText}
                </div>
                <h4 className="text-sm font-black">الذكر حسب الحالة النفسية والوجدانية</h4>
                <p className="text-[11px] opacity-80 leading-relaxed max-w-sm mx-auto">
                  أدعية نبوية وقرآنية مأثورة تبث الطمأنينة في القلب وتعينك في شتى أحوالك وكروبك.
                </p>
              </div>

              {/* 5 Emotional Selector Cards matching image_fb3b7d0a.png */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" dir="rtl">
                {emotionStates.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedEmotion === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedEmotion(item.id)}
                      className={`p-2.5 rounded-2xl border flex items-center justify-between gap-2 text-right transition-all active:scale-95 ${
                        isSelected
                          ? isDark
                            ? 'bg-[#1f1d18] border-[#d4af37] text-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.3)] ring-1 ring-[#d4af37]'
                            : 'bg-white border-[#2e4426] text-[#2e4426] shadow-sm ring-1 ring-[#2e4426]'
                          : isDark
                          ? 'bg-[#141414] border-[#d4af37]/20 text-stone-300 hover:border-[#d4af37]/40'
                          : 'bg-white/80 border-stone-200 text-stone-700 hover:border-[#2e4426]/40'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-black">{item.title}</div>
                        <div className="text-[10px] opacity-70 line-clamp-1">{item.sublabel}</div>
                      </div>
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? isDark
                              ? 'bg-[#d4af37] text-stone-950'
                              : 'bg-[#2e4426] text-white'
                            : isDark
                            ? 'bg-[#1a1814] text-stone-400'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Duas list for selected emotional state */}
              <div className="space-y-2.5 pt-1" dir="rtl">
                {currentEmotionDuas.map((dua: EmotionalDuaItem, idx: number) => {
                  const count = counts[dua.id] || 0;
                  const isFinished = count >= (dua.targetCount || 1);
                  const isCopied = copiedId === dua.id;

                  return (
                    <div
                      key={dua.id || idx}
                      className={`p-4 rounded-2xl border space-y-3 transition-all ${
                        isDark
                          ? 'bg-[#181818] border-[#d4af37]/25 text-stone-100'
                          : 'bg-white border-stone-200 text-stone-900 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#b89328] dark:text-[#d4af37] flex items-center gap-1">
                          <span>✦</span>
                          <span>{dua.title}</span>
                        </span>
                        <span className="text-[10px] text-stone-400">{dua.source}</span>
                      </div>

                      <p
                        className="text-base sm:text-lg leading-relaxed text-center font-bold px-1 select-text"
                        style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
                      >
                        «{dua.arabicText}»
                      </p>

                      {dua.guidance && (
                        <p className="text-[11px] text-stone-500 dark:text-[#a39e93] text-center italic">
                          {dua.guidance}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 dark:border-stone-800">
                        <button
                          onClick={() => handleIncrement(dua.id, dua.targetCount || 1)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                            isFinished
                              ? 'bg-emerald-600 text-white'
                              : isDark
                              ? 'bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 hover:bg-[#d4af37]/25'
                              : 'bg-[#2e4426]/10 text-[#2e4426] border border-[#2e4426]/20 hover:bg-[#2e4426]/20'
                          }`}
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>
                            {count} / {dua.targetCount || 1}
                          </span>
                        </button>

                        <button
                          onClick={() => handleCopyText(dua.arabicText, dua.id)}
                          className={`p-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition ${
                            isCopied
                              ? 'bg-[#d4af37] text-stone-950 border-[#d4af37]'
                              : isDark
                              ? 'bg-[#141414] border-stone-700 text-stone-300'
                              : 'bg-stone-100 border-stone-200 text-stone-700'
                          }`}
                          title="نسخ الدعاء"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="text-[10px]">{isCopied ? 'تم النسخ' : 'نسخ'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CATEGORIZED & QURANIC DUAS (مطابق للصورة الثالثة) */}
          {activeTab === 'categories' && (
            <div className="space-y-3.5">
              {/* Horizontal Category Pill Tabs matching image_e1ebb203.png */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar" dir="rtl">
                {duaCategories.map((cat) => {
                  const isSelected = selectedDuaCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedDuaCategory(cat.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition active:scale-95 ${
                        isSelected
                          ? isDark
                            ? 'bg-[#d4af37] text-stone-950 font-black shadow-xs'
                            : 'bg-[#c5a059] text-stone-950 font-black shadow-xs'
                          : isDark
                          ? 'bg-[#1a1814] text-stone-300 border border-[#d4af37]/25 hover:border-[#d4af37]'
                          : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في الأدعية..."
                  className={`w-full py-2 pr-9 pl-3 rounded-xl text-xs outline-none border transition ${
                    isDark
                      ? 'bg-[#181818] border-stone-800 text-white placeholder-stone-500 focus:border-[#d4af37]'
                      : 'bg-white border-stone-200 text-stone-900 placeholder-stone-400 focus:border-[#2e4426]'
                  }`}
                  dir="rtl"
                />
              </div>

              {/* Duas List */}
              <div className="space-y-2.5" dir="rtl">
                {filteredCategoryDuas.length === 0 ? (
                  <div className="py-10 text-center text-xs text-stone-400">
                    لا توجد نتائج مطابقة لبحثك
                  </div>
                ) : (
                  filteredCategoryDuas.map((dua) => {
                    const count = counts[dua.id] || 0;
                    const isFinished = count >= (dua.targetCount || 1);
                    const isCopied = copiedId === dua.id;

                    return (
                      <div
                        key={dua.id}
                        className={`p-4 rounded-2xl border space-y-3 transition-all ${
                          isDark
                            ? 'bg-[#181818] border-[#d4af37]/25 text-stone-100'
                            : 'bg-white border-stone-200 text-stone-900 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#b89328] dark:text-[#d4af37] flex items-center gap-1">
                            <span>✦</span>
                            <span>{dua.title}</span>
                          </span>
                          <span className="text-[10px] text-stone-400">{dua.source}</span>
                        </div>

                        <p
                          className="text-base sm:text-lg leading-relaxed text-center font-bold px-1 select-text"
                          style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
                        >
                          «{dua.arabicText}»
                        </p>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 dark:border-stone-800">
                          <button
                            onClick={() => handleIncrement(dua.id, dua.targetCount || 1)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                              isFinished
                                ? 'bg-emerald-600 text-white'
                                : isDark
                                ? 'bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 hover:bg-[#d4af37]/25'
                                : 'bg-[#2e4426]/10 text-[#2e4426] border border-[#2e4426]/20 hover:bg-[#2e4426]/20'
                            }`}
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>
                              {count} / {dua.targetCount || 1}
                            </span>
                          </button>

                          <button
                            onClick={() => handleCopyText(dua.arabicText, dua.id)}
                            className={`p-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition ${
                              isCopied
                                ? 'bg-[#d4af37] text-stone-950 border-[#d4af37]'
                                : isDark
                                ? 'bg-[#141414] border-stone-700 text-stone-300'
                                : 'bg-stone-100 border-stone-200 text-stone-700'
                            }`}
                            title="نسخ الدعاء"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span className="text-[10px]">{isCopied ? 'تم النسخ' : 'نسخ'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
