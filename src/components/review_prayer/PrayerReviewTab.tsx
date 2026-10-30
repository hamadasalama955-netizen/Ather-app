import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Copy,
  Check,
  Compass,
  Heart,
  ShieldAlert,
  ArrowRight,
  Filter,
} from 'lucide-react';
import {
  PRAYER_CONDITIONS,
  PRAYER_PILLARS,
  PRAYER_OBLIGATIONS,
  SUJUD_SAHW_CASES,
  PRAYER_MISTAKES,
  PROPHETIC_PRAYER_STEPS,
  PrayerConditionItem,
  SujudSahwCase,
} from './prayerReviewData';
import { NavigationTab } from '../../types';
import { ScreenBackButton } from '../common/ScreenBackButton';

interface Props {
  onNavigateHome?: () => void;
  onNavigateTab?: (tab: NavigationTab) => void;
}

type ReviewSubTab = 'audit' | 'sahw' | 'mistakes' | 'guide' | 'khushu';

export const PrayerReviewTab: React.FC<Props> = ({ onNavigateHome, onNavigateTab }) => {
  const [activeSubTab, setActiveSubTab] = useState<ReviewSubTab>('audit');

  // Interactive Checklist State stored in localStorage
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('noor_prayer_review_checked');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Filter for audit tab
  const [auditCategory, setAuditCategory] = useState<'all' | 'condition' | 'pillar' | 'obligation'>('all');

  // Interactive Sujud As-Sahw Solver state
  const [sahwQuestionType, setSahwQuestionType] = useState<'all' | 'نقص' | 'زيادة' | 'شك'>('all');
  const [expandedSahwId, setExpandedSahwId] = useState<string | null>('case_shakk_aqall');

  // Interactive Mistake Filter
  const [mistakeFilter, setMistakeFilter] = useState<'all' | 'يبطل الصلاة' | 'محرم وفاسد للصلاة' | 'مكروه ومنقص للأجر'>('all');

  // Copy du'a feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Step guide expanded step
  const [expandedStepId, setExpandedStepId] = useState<string | null>('step_1');

  const handleToggleCheck = (id: string) => {
    const next = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(next);
    localStorage.setItem('noor_prayer_review_checked', JSON.stringify(next));
  };

  const handleResetChecklist = () => {
    setCheckedItems({});
    localStorage.removeItem('noor_prayer_review_checked');
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Calculate audit stats
  const allAuditItems: PrayerConditionItem[] = [
    ...PRAYER_CONDITIONS,
    ...PRAYER_PILLARS,
    ...PRAYER_OBLIGATIONS,
  ];

  const totalAuditCount = allAuditItems.length;
  const checkedAuditCount = allAuditItems.filter((item) => checkedItems[item.id]).length;
  const auditProgressPercent = Math.round((checkedAuditCount / totalAuditCount) * 100);

  const filteredAuditItems = allAuditItems.filter((item) => {
    if (auditCategory === 'all') return true;
    return item.category === auditCategory;
  });

  const filteredSahwCases = SUJUD_SAHW_CASES.filter((c) => {
    if (sahwQuestionType === 'all') return true;
    return c.causeType === sahwQuestionType;
  });

  const filteredMistakes = PRAYER_MISTAKES.filter((m) => {
    if (mistakeFilter === 'all') return true;
    return m.dangerLevel === mistakeFilter;
  });

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300">
      {/* 1. Regal Hero Banner: «صلوا كما رأيتموني أصلي» with Back Button */}
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
                <span>فقه الصلاة وتصحيحها</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                راجع صلاتك
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
                «صلّوا كَما رأيتُمُوني أُصلِّي» · دليل فقهي وتطبيقي شامل لمراجعة الأركان والشروط وتفادي الأخطاء وسجود السهو.
              </p>
            </div>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#dfb76c]/25 to-[#d4af37] border border-[#dfb76c]/40 flex items-center justify-center text-[#dfb76c] shrink-0 shadow-xs">
            <Compass className="w-6 h-6 text-[#dfb76c]" />
          </div>
        </div>

        {/* Motivational Prophetic Hadith Quote */}
        <div className="mt-4 p-3 rounded-2xl bg-[#061b14]/75 border border-[#dfb76c]/25 text-xs space-y-1">
          <div className="text-[#dfb76c] font-bold text-[11px]">
            حديث المسيء صلاته:
          </div>
          <div className="text-stone-200 italic leading-relaxed text-[11px]">
            «ارْجِعْ فَصَلِّ، فَإِنَّكَ لَمْ تُصَلِّ» قاله ﷺ ثلاثاً لرجل كان ينقر صلاته، ثم علمه الطمأنينة ركناً ركناً.
          </div>
        </div>
      </div>

      {/* 2. Sub-Tab Segmented Switcher (Functional interactive controls) */}
      <div className="grid grid-cols-5 gap-1 p-1 bg-stone-200/70 dark:bg-[#141414] rounded-2xl border border-stone-300/60 dark:border-stone-800 text-xs">
        <button
          onClick={() => setActiveSubTab('audit')}
          className={`py-2 px-1 text-center font-bold rounded-xl transition-all duration-150 ${
            activeSubTab === 'audit'
              ? 'bg-white dark:bg-[#d4af37] text-[#d4af37] dark:text-[#dfb76c] shadow-xs border border-stone-200 dark:border-[#dfb76c]/30'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          فاحص الصلاة
        </button>

        <button
          onClick={() => setActiveSubTab('sahw')}
          className={`py-2 px-1 text-center font-bold rounded-xl transition-all duration-150 ${
            activeSubTab === 'sahw'
              ? 'bg-white dark:bg-[#d4af37] text-[#d4af37] dark:text-[#dfb76c] shadow-xs border border-stone-200 dark:border-[#dfb76c]/30'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          سجود السهو
        </button>

        <button
          onClick={() => setActiveSubTab('mistakes')}
          className={`py-2 px-1 text-center font-bold rounded-xl transition-all duration-150 ${
            activeSubTab === 'mistakes'
              ? 'bg-white dark:bg-[#d4af37] text-[#d4af37] dark:text-[#dfb76c] shadow-xs border border-stone-200 dark:border-[#dfb76c]/30'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          أخطاء شائعة
        </button>

        <button
          onClick={() => setActiveSubTab('guide')}
          className={`py-2 px-1 text-center font-bold rounded-xl transition-all duration-150 ${
            activeSubTab === 'guide'
              ? 'bg-white dark:bg-[#d4af37] text-[#d4af37] dark:text-[#dfb76c] shadow-xs border border-stone-200 dark:border-[#dfb76c]/30'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          صفة الصلاة
        </button>

        <button
          onClick={() => setActiveSubTab('khushu')}
          className={`py-2 px-1 text-center font-bold rounded-xl transition-all duration-150 ${
            activeSubTab === 'khushu'
              ? 'bg-white dark:bg-[#d4af37] text-[#d4af37] dark:text-[#dfb76c] shadow-xs border border-stone-200 dark:border-[#dfb76c]/30'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          زاد الخشوع
        </button>
      </div>

      {/* 3. Sub-Tab 1: فاحص الصلاة التفاعلي (Interactive Audit & Checklist) */}
      {activeSubTab === 'audit' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Progress Card */}
          <div className="p-4 rounded-3xl bg-[#fcfbf7] dark:bg-[#141414] border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  مستوى إتقان شروط وأركان الصلاة
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  راجع بنود صلاتك وضع علامة صح على ما تتقنه وتحافظ عليه
                </p>
              </div>

              <div className="text-right">
                <span className="text-xl font-black text-[#d4af37] dark:text-[#dfb76c] font-mono tabular-nums">
                  {auditProgressPercent}%
                </span>
                <span className="text-[10px] text-stone-400 block font-sans">
                  {checkedAuditCount} من {totalAuditCount}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#d4af37] via-[#d4af37] to-[#dfb76c] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${auditProgressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-stone-600 dark:text-stone-300 font-medium">
                {auditProgressPercent === 100
                  ? '🎉 ما شاء الله! أتممت مراجعة جميع الشروط والأركان والواجبات.'
                  : auditProgressPercent >= 60
                  ? '✨ ممتاز! استمر في تثبيت باقي الأركان والواجبات لحفظ كمال صلاتك.'
                  : '💡 ابدأ بمراجعة الشروط والأركان للتأكد من صحة الفريضة.'}
              </span>

              {checkedAuditCount > 0 && (
                <button
                  onClick={handleResetChecklist}
                  className="flex items-center gap-1 text-[10px] text-rose-600 dark:text-rose-400 hover:underline shrink-0"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>إعادة الضبط</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setAuditCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                auditCategory === 'all'
                  ? 'bg-[#d4af37] text-stone-950 dark:bg-[#dfb76c] text-stone-950 shadow-xs'
                  : 'bg-white dark:bg-[#141414] text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-800'
              }`}
            >
              الكل ({allAuditItems.length})
            </button>
            <button
              onClick={() => setAuditCategory('condition')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                auditCategory === 'condition'
                  ? 'bg-[#d4af37] text-stone-950 dark:bg-[#dfb76c] text-stone-950 shadow-xs'
                  : 'bg-white dark:bg-[#141414] text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-800'
              }`}
            >
              الشروط قبل الصلاة ({PRAYER_CONDITIONS.length})
            </button>
            <button
              onClick={() => setAuditCategory('pillar')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                auditCategory === 'pillar'
                  ? 'bg-[#d4af37] text-stone-950 dark:bg-[#dfb76c] text-stone-950 shadow-xs'
                  : 'bg-white dark:bg-[#141414] text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-800'
              }`}
            >
              الأركان الـ ١٤ ({PRAYER_PILLARS.length})
            </button>
            <button
              onClick={() => setAuditCategory('obligation')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                auditCategory === 'obligation'
                  ? 'bg-[#d4af37] text-stone-950 dark:bg-[#dfb76c] text-stone-950 shadow-xs'
                  : 'bg-white dark:bg-[#141414] text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-800'
              }`}
            >
              الواجبات الـ ٨ ({PRAYER_OBLIGATIONS.length})
            </button>
          </div>

          {/* Checklist Items */}
          <div className="space-y-2.5">
            {filteredAuditItems.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleCheck(item.id)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all duration-150 flex items-start gap-3 select-none ${
                    isChecked
                      ? 'bg-#d4af37]/15 dark:bg-black/30 border-#d4af37]/40 dark:border-#d4af37]/40'
                      : 'bg-[#fcfbf7] dark:bg-[#141414] border-stone-200/80 dark:border-stone-800 hover:border-[#dfb76c]/50'
                  }`}
                >
                  {/* Interactive Checkbox Indicator */}
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isChecked
                        ? 'bg-[#d4af37] text-white shadow-xs'
                        : 'border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-[#1a1814]'
                    }`}
                  >
                    {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>

                  {/* Item Content */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-stone-900 dark:text-stone-100">
                          {item.title}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                            item.category === 'condition'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                              : item.category === 'pillar'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                          }`}
                        >
                          {item.category === 'condition'
                            ? 'شرط صحة'
                            : item.category === 'pillar'
                            ? 'ركن لا يسقط'
                            : 'واجب يُجبر'}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono">#{item.number}</span>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      {item.details}
                    </p>

                    <div className="text-[10px] text-stone-500 dark:text-stone-400 flex items-center gap-1.5 pt-0.5">
                      <span className="font-semibold text-[#d4af37] dark:text-[#dfb76c]">الدليل:</span>
                      <span className="italic">{item.dalil}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Sub-Tab 2: دليل سجود السهو الذكي (Interactive Sujud As-Sahw Solver) */}
      {activeSubTab === 'sahw' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Quick Solver Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-[#d4af37] to-[#0a0a0a] text-[#fcfbf7] border border-[#dfb76c]/40 shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#dfb76c]/20 text-[#dfb76c] flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  القاعدة الذهبية لسجود السهو
                </h3>
                <p className="text-[10px] text-[#dfb76c]">
                  متى أسجد قبل السلام ومتى بعد السلام؟
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-2xl bg-[#061b14]/80 border border-[#dfb76c]/20 space-y-1">
                <div className="text-[#dfb76c] font-bold text-xs flex items-center gap-1">
                  <span>قبل السلام</span>
                  <span className="text-[9px] px-1 bg-[#dfb76c]/20 rounded">حالتان</span>
                </div>
                <p className="text-[11px] text-stone-300 leading-tight">
                  ١. النقص (كنسيان التشهد الأول).
                  <br />
                  ٢. الشك مع البناء على الأقل (اليقين).
                </p>
              </div>

              <div className="p-2.5 rounded-2xl bg-[#061b14]/80 border border-[#dfb76c]/20 space-y-1">
                <div className="text-[#d4af37] font-bold text-xs flex items-center gap-1">
                  <span>بعد السلام</span>
                  <span className="text-[9px] px-1 bg-[#d4af37]/20 rounded">حالتان</span>
                </div>
                <p className="text-[11px] text-stone-300 leading-tight">
                  ١. الزيادة (كركعة أو سجود زائد).
                  <br />
                  ٢. الشك مع غلبة الظن والترجيح.
                </p>
              </div>
            </div>
          </div>

          {/* Filter by cause */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400 pl-1 shrink-0">
              تصفية الحالات:
            </span>
            <button
              onClick={() => setSahwQuestionType('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                sahwQuestionType === 'all'
                  ? 'bg-[#d4af37] text-stone-950 dark:bg-[#dfb76c] text-stone-950 shadow-xs'
                  : 'bg-white dark:bg-[#141414] text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-800'
              }`}
            >
              جميع الحالات ({SUJUD_SAHW_CASES.length})
            </button>
            <button
              onClick={() => setSahwQuestionType('نقص')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                sahwQuestionType === 'نقص'
                  ? 'bg-[#d4af37] text-stone-950 dark:bg-[#dfb76c] text-stone-950 shadow-xs'
                  : 'bg-white dark:bg-[#141414] text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-800'
              }`}
            >
              حالات النقص
            </button>
            <button
              onClick={() => setSahwQuestionType('زيادة')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                sahwQuestionType === 'زيادة'
                  ? 'bg-[#d4af37] text-stone-950 dark:bg-[#dfb76c] text-stone-950 shadow-xs'
                  : 'bg-white dark:bg-[#141414] text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-800'
              }`}
            >
              حالات الزيادة
            </button>
            <button
              onClick={() => setSahwQuestionType('شك')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                sahwQuestionType === 'شك'
                  ? 'bg-[#d4af37] text-stone-950 dark:bg-[#dfb76c] text-stone-950 shadow-xs'
                  : 'bg-white dark:bg-[#141414] text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-800'
              }`}
            >
              حالات الشك
            </button>
          </div>

          {/* Cases List */}
          <div className="space-y-3">
            {filteredSahwCases.map((c) => {
              const isExpanded = expandedSahwId === c.id;
              return (
                <div
                  key={c.id}
                  className="rounded-2xl bg-[#fcfbf7] dark:bg-[#141414] border border-stone-200/80 dark:border-stone-800 overflow-hidden shadow-xs transition"
                >
                  <button
                    onClick={() => setExpandedSahwId(isExpanded ? null : c.id)}
                    className="w-full p-4 flex items-center justify-between text-right gap-3 hover:bg-stone-50/60 dark:hover:bg-[#1f1d19] transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                          {c.title}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            c.timing === 'قبل السلام'
                              ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                              : 'bg-[#d4af37]/20 text-[#d4af37] dark:bg-[#d4af37]/40 dark:text-[#d4af37] border border-[#d4af37] dark:border-[#d4af37]'
                          }`}
                        >
                          يسجد: {c.timing}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        السبب: {c.causeType}
                      </p>
                    </div>

                    <div className="p-1 rounded-lg text-stone-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-stone-200/60 dark:border-stone-800 space-y-3 text-xs">
                      {/* Practical Solution */}
                      <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-[#1a1814] border border-stone-200/60 dark:border-stone-800 space-y-1">
                        <div className="font-bold text-[#d4af37] dark:text-[#dfb76c] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>كيف تتصرف وتصحح صلاتك؟</span>
                        </div>
                        <p className="text-stone-800 dark:text-stone-200 leading-relaxed">
                          {c.howToFix}
                        </p>
                      </div>

                      {/* Fiqh Explanation */}
                      <div className="space-y-1">
                        <span className="font-bold text-stone-700 dark:text-stone-300">الحكم والتفصيل:</span>
                        <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                          {c.ruling}
                        </p>
                      </div>

                      {/* Evidence */}
                      <div className="text-[10px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-200/40 dark:border-stone-800">
                        <span className="font-semibold text-stone-700 dark:text-stone-300">الدليل النبوي: </span>
                        <span className="italic">{c.dalil}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Sub-Tab 3: مصيدة الأخطاء الشائعة (Common Mistakes with Fixes) */}
      {activeSubTab === 'mistakes' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Header Description */}
          <div className="p-3 rounded-2xl bg-[#fcfbf7] dark:bg-[#141414] border border-stone-200/80 dark:border-stone-800 flex items-center gap-2.5 text-xs">
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-stone-900 dark:text-stone-100">
                أخطاء صلاة يقع فيها الكثيرون
              </div>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                احذر هذه العادات والمخالفات لحفظ ثواب صلاتك من البطلان أو النقص
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setMistakeFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                mistakeFilter === 'all'
                  ? 'bg-[#d4af37] text-stone-950 dark:bg-[#dfb76c] text-stone-950 shadow-xs'
                  : 'bg-white dark:bg-[#141414] text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-800'
              }`}
            >
              الكل ({PRAYER_MISTAKES.length})
            </button>
            <button
              onClick={() => setMistakeFilter('يبطل الصلاة')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                mistakeFilter === 'يبطل الصلاة'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#141414] text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-800'
              }`}
            >
              يبطل الصلاة
            </button>
            <button
              onClick={() => setMistakeFilter('محرم وفاسد للصلاة')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                mistakeFilter === 'محرم وفاسد للصلاة'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#141414] text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-800'
              }`}
            >
              محرم
            </button>
            <button
              onClick={() => setMistakeFilter('مكروه ومنقص للأجر')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                mistakeFilter === 'مكروه ومنقص للأجر'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#141414] text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-800'
              }`}
            >
              مكروه ومنقص للأجر
            </button>
          </div>

          {/* Mistakes Cards */}
          <div className="space-y-3">
            {filteredMistakes.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-3xl bg-[#fcfbf7] dark:bg-[#141414] border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                    {m.title}
                  </h4>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      m.dangerLevel === 'يبطل الصلاة'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-300 dark:border-rose-700'
                        : m.dangerLevel === 'محرم وفاسد للصلاة'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                    }`}
                  >
                    {m.dangerLevel}
                  </span>
                </div>

                {/* Wrong Practice */}
                <div className="p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs space-y-1">
                  <div className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>الخطأ الشائع:</span>
                  </div>
                  <p className="text-stone-800 dark:text-stone-200 leading-relaxed text-[11px]">
                    {m.wrongPractice}
                  </p>
                </div>

                {/* Correct Practice */}
                <div className="p-2.5 rounded-xl bg-#d4af37]/15 dark:bg-black/30 border border-[#d4af37]/30 dark:border-[#d4af37]/40 text-xs space-y-1">
                  <div className="font-bold text-[#d4af37] dark:text-[#d4af37] flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>الصواب النبوي:</span>
                  </div>
                  <p className="text-stone-800 dark:text-stone-200 leading-relaxed text-[11px]">
                    {m.correctPractice}
                  </p>
                </div>

                {/* Tip & Dalil */}
                <div className="pt-1 flex flex-col gap-1 text-[10px] text-stone-500 dark:text-stone-400">
                  <div>
                    <span className="font-bold text-[#d4af37] dark:text-[#dfb76c]">نصيحة عملية: </span>
                    <span>{m.tip}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-600 dark:text-stone-300">الدليل: </span>
                    <span className="italic">{m.dalil}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Sub-Tab 4: صفة صلاة النبي ﷺ خطوة بخطوة مع الأذكار */}
      {activeSubTab === 'guide' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-3.5 rounded-2xl bg-[#fcfbf7] dark:bg-[#141414] border border-stone-200/80 dark:border-stone-800 flex items-center gap-3 text-xs">
            <div className="w-8 h-8 rounded-xl bg-[#d4af37]/10 dark:bg-[#dfb76c]/15 text-[#d4af37] dark:text-[#dfb76c] flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-stone-900 dark:text-stone-100">
                صفة صلاة النبي ﷺ من التكبير إلى التسليم
              </div>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                مرتبة بالخطوات النبوية الصحيحة مع الأذكار وهيئة الجوارح وأسرار الخشوع
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {PROPHETIC_PRAYER_STEPS.map((step) => {
              const isExpanded = expandedStepId === step.id;
              return (
                <div
                  key={step.id}
                  className="rounded-3xl bg-[#fcfbf7] dark:bg-[#141414] border border-stone-200/80 dark:border-stone-800 overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                    className="w-full p-4 flex items-center justify-between text-right gap-3 hover:bg-stone-50/60 dark:hover:bg-[#1f1d19] transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#d4af37] text-stone-950 font-black font-mono text-xs flex items-center justify-center shrink-0 border border-[#dfb76c]/30">
                        {step.stepNumber}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                            {step.title}
                          </h4>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                              step.type === 'ركن'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                                : 'bg-[#d4af37]/20 text-[#d4af37] dark:bg-[#d4af37]/40 dark:text-[#d4af37]'
                            }`}
                          >
                            {step.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">
                          {step.bodyPosition}
                        </p>
                      </div>
                    </div>

                    <div className="p-1 rounded-lg text-stone-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-stone-200/60 dark:border-stone-800 space-y-3 text-xs">
                      {/* Detailed Description */}
                      <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-xs">
                        {step.description}
                      </p>

                      {/* Dhikr with Copy Button if available */}
                      {step.dhikr && (
                        <div className="p-3 rounded-2xl bg-[#d4af37]/8 dark:bg-[#1a1814] border border-[#dfb76c]/30 space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-[#d4af37] dark:text-[#dfb76c]">
                              الذكر المسنون:
                            </span>
                            <button
                              onClick={() => handleCopyText(step.id, step.dhikr!)}
                              className="flex items-center gap-1 text-[10px] font-bold text-[#d4af37] dark:text-[#dfb76c] hover:underline"
                            >
                              {copiedId === step.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                                  <span>تم النسخ</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>نسخ الذكر</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div
                            style={{ fontFamily: 'var(--font-quran), Amiri, serif' }}
                            className="text-base sm:text-lg leading-[2.1] text-stone-900 dark:text-stone-100 text-center py-1"
                          >
                            {step.dhikr}
                          </div>
                        </div>
                      )}

                      {/* Body Position Guide */}
                      <div className="p-2.5 rounded-xl bg-stone-100/70 dark:bg-[#1f1d19] text-[11px] text-stone-700 dark:text-stone-300">
                        <span className="font-bold text-stone-900 dark:text-stone-100">هيئة الجسد: </span>
                        <span>{step.bodyPosition}</span>
                      </div>

                      {/* Khushu Secret */}
                      <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">سر الخشوع: </span>
                          <span>{step.khushuSecret}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. Sub-Tab 5: زاد الخشوع والتغلب على الوسواس */}
      {activeSubTab === 'khushu' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Main Khushu Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#d4af37] via-[#1f1d19] to-[#1a1814] text-[#fcfbf7] border border-[#dfb76c]/40 shadow-xl space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#dfb76c]/20 text-[#dfb76c] flex items-center justify-center font-bold">
                <Heart className="w-5 h-5 text-[#dfb76c] fill-[#dfb76c]/20" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  روح الصلاة: الخشوع وحضور القلب
                </h3>
                <p className="text-[11px] text-stone-300">
                  ﴿قَدْ أَفْلَحَ الْمُؤْمِنُونَ • الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ﴾
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-200 leading-relaxed pt-1">
              ليس للمرء من صلاته إلا ما عقل منها؛ فالصلاة بلا خشوع كجسد ميت بلا روح. إليك مفاتيح استحضار عظمة الله في صلاتك:
            </p>
          </div>

          {/* Dealing with Khanzab (وسواس الصلاة) */}
          <div className="p-4 rounded-3xl bg-[#fcfbf7] dark:bg-[#141414] border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>كيف تتعامل مع شيطان الصلاة (خِنْزَب)؟</span>
            </div>
            <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              جاء عثمان بن أبي العاص إلى النبي ﷺ فقال: يا رسول الله إن الشيطان قد حال بيني وبين صلاتي وقراءتي يلبسها علي! فقال رسول الله ﷺ:
            </p>
            <div className="p-3 rounded-2xl bg-stone-100/80 dark:bg-[#1a1814] border border-stone-200 dark:border-stone-800 text-xs italic text-[#d4af37] dark:text-[#dfb76c] leading-relaxed">
              «ذَاكَ شَيْطَانٌ يُقَالُ لَهُ: خِنْزَبٌ، فَإِذَا أَحْسَسْتَهُ فَتَعَوَّذْ بِاللهِ مِنْهُ، وَاتْفُلْ عَلَى يَسَارِكَ ثَلَاثاً» [صحيح مسلم].
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              قال عثمان: ففعلت ذلك فأذهبه الله عني. (والتفل هو نفخ خفيف مع رذاذ يسير لا يؤذي المصلين بجانبك).
            </p>
          </div>

          {/* 5 Practical Steps to Khushu */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 px-1">
              ٥ خطوات عملية قبل وأثناء الصلاة:
            </h4>

            <div className="p-3 rounded-2xl bg-[#fcfbf7] dark:bg-[#141414] border border-stone-200/80 dark:border-stone-800 space-y-1 text-xs">
              <div className="font-bold text-[#d4af37] dark:text-[#dfb76c] flex items-center gap-1.5">
                <span>١. التهيئة قبل تكبيرة الإحرام:</span>
              </div>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-[11px]">
                توقف لمدة ٣٠ ثانية قبل التكبير، أفرغ ذهنك من المشاغل، وتذكر أنك تقف بين يدي من يعلم سرك ونجواك.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#fcfbf7] dark:bg-[#141414] border border-stone-200/80 dark:border-stone-800 space-y-1 text-xs">
              <div className="font-bold text-[#d4af37] dark:text-[#dfb76c] flex items-center gap-1.5">
                <span>٢. استشعار مناجاة الفاتحة:</span>
              </div>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-[11px]">
                توقف عند كل آية واستشعر جواب الله لك في الحديث القدسي: «حمدني عبدي... أثنى علي عبدي... مجدني عبدي... هذا بيني وبين عبدي ولعبدي ما سأل».
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#fcfbf7] dark:bg-[#141414] border border-stone-200/80 dark:border-stone-800 space-y-1 text-xs">
              <div className="font-bold text-[#d4af37] dark:text-[#dfb76c] flex items-center gap-1.5">
                <span>٣. تنويع الأذكار والسور المقروءة:</span>
              </div>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-[11px]">
                احفظ أدعية استفتاح مختلفة وأذكار ركوع وسجود متعددة واقرأ سوراً جديدة تكسر الروتين الحركي التلقائي.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#fcfbf7] dark:bg-[#141414] border border-stone-200/80 dark:border-stone-800 space-y-1 text-xs">
              <div className="font-bold text-[#d4af37] dark:text-[#dfb76c] flex items-center gap-1.5">
                <span>٤. تركيز البصر على موضع السجود:</span>
              </div>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-[11px]">
                حبس البصر يمنع التشتت البصري وانشغال العقل بما يحيط به من ألوان ونقوش وأشخاص.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#fcfbf7] dark:bg-[#141414] border border-stone-200/80 dark:border-stone-800 space-y-1 text-xs">
              <div className="font-bold text-[#d4af37] dark:text-[#dfb76c] flex items-center gap-1.5">
                <span>٥. صلاة مودع:</span>
              </div>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-[11px]">
                قال ﷺ: «إذا قُمتَ في صَلاتِكَ فصَلِّ صَلاةَ مُودِّعٍ»؛ تخيل أنها آخر صلاة لك في الدنيا قبل أن تلقى الله.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Return Home Footer Button */}
      {onNavigateHome && (
        <div className="pt-2 text-center">
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
