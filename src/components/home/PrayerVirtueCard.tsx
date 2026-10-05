import React from 'react';
import { Sparkles, Heart, BookOpen, Clock, Check, Copy, Share2 } from 'lucide-react';
import { PRAYER_VIRTUES, PrayerVirtueInfo } from '../../data/prayerVirtuesData';

interface Props {
  currentOrNextPrayerKey?: string;
  prayerArabicName: string;
}

export const PrayerVirtueCard: React.FC<Props> = ({
  currentOrNextPrayerKey = 'Fajr',
  prayerArabicName,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);

  const virtueInfo: PrayerVirtueInfo =
    PRAYER_VIRTUES[currentOrNextPrayerKey] || PRAYER_VIRTUES.Fajr;

  const handleCopyThikr = () => {
    const text = `${virtueInfo.recommendedThikr}\n[${virtueInfo.thikrBenefit}]`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickShare = async () => {
    const shareText = `✨ نفحات صلاة ${prayerArabicName} - أثَر | Athar:
${virtueInfo.hadithOrAyah}
(المصدر: ${virtueInfo.source})

🌿 الذكر المستحب:
${virtueInfo.recommendedThikr}
[${virtueInfo.thikrBenefit}]`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `نفحات صلاة ${prayerArabicName}`,
          text: shareText,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
        return;
      } catch (err) {
        // Fallback to clipboard if user dismissed or unsupported
      }
    }

    navigator.clipboard.writeText(shareText);
    setShared(true);
    setTimeout(() => setShared(false), 2500);
  };

  return (
    <div className="rounded-3xl bg-[#fcfbf7] dark:bg-[#122e23] border border-[#dfb76c]/40 dark:border-[#dfb76c]/30 p-4 sm:p-5 shadow-sm space-y-3.5 transition-all">
      {/* Header: Dynamic with current prayer */}
      <div className="flex items-center justify-between border-b border-stone-200/70 dark:border-stone-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#dfb76c] to-[#c5a059] text-[#0b241c] flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-4 h-4 fill-[#0b241c]" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <span>نفحات وقت {prayerArabicName}</span>
              <span className="text-[10px] font-semibold text-[#0d3b2e] dark:text-[#dfb76c] bg-[#0d3b2e]/10 dark:bg-[#dfb76c]/15 px-2 py-0.5 rounded-full border border-[#0d3b2e]/20 dark:border-[#dfb76c]/30">
                فضل الصلاة والذكر
              </span>
            </h3>
            <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
              {virtueInfo.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleQuickShare}
            title="مشاركة سريعة لنفحات وفضل الصلاة"
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#0d3b2e]/10 dark:bg-[#dfb76c]/20 hover:bg-[#0d3b2e]/20 text-[#0d3b2e] dark:text-[#dfb76c] text-[11px] font-bold transition active:scale-95 border border-[#dfb76c]/30 shadow-xs"
          >
            {shared ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>تم النسخ</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>مشاركة</span>
              </>
            )}
          </button>

          <div className="hidden sm:flex text-[10px] text-[#926a27] dark:text-[#dfb76c] font-mono font-semibold items-center gap-1 bg-[#dfb76c]/15 dark:bg-[#dfb76c]/20 px-2 py-1 rounded-xl border border-[#dfb76c]/30">
            <Clock className="w-3 h-3 text-[#c5a059]" />
            <span>وقت مبارك</span>
          </div>
        </div>
      </div>

      {/* Hadith / Quranic Virtue */}
      <div className="p-3.5 rounded-2xl bg-amber-500/8 dark:bg-amber-400/5 border border-amber-600/20 dark:border-amber-500/20 space-y-1.5">
        <div className="text-[11px] font-bold text-[#85591c] dark:text-[#dfb76c] flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>من فضل هذه الصلاة المباركة:</span>
        </div>
        <p
          style={{ fontFamily: 'var(--font-quran), Amiri, serif' }}
          className="text-base sm:text-lg leading-relaxed text-stone-800 dark:text-stone-100 select-text"
        >
          {virtueInfo.hadithOrAyah}
        </p>
        <div className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">
          المصدر: {virtueInfo.source}
        </div>
      </div>

      {/* Recommended Thikr for this prayer */}
      <div className="p-3.5 rounded-2xl bg-[#0d3b2e]/8 dark:bg-[#0d3b2e]/40 border border-[#0d3b2e]/20 dark:border-[#dfb76c]/25 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold text-[#0d3b2e] dark:text-[#dfb76c] flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#0d3b2e] dark:text-[#dfb76c]" />
            <span>ذكر مأثور يُستحب قوله عند الأذان أو بعد الصلاة:</span>
          </div>

          <button
            onClick={handleCopyThikr}
            title="نسخ الذكر"
            className="p-1 rounded-lg hover:bg-stone-200/60 dark:hover:bg-stone-800/60 text-[#0d3b2e] dark:text-[#dfb76c] transition"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <p
          style={{ fontFamily: 'var(--font-quran), Amiri, serif' }}
          className="text-base sm:text-lg text-[#082218] dark:text-stone-100 leading-relaxed font-semibold select-text"
        >
          {virtueInfo.recommendedThikr}
        </p>

        <div className="flex items-center justify-between text-[10px] text-stone-600 dark:text-stone-300 pt-1 border-t border-stone-200/60 dark:border-stone-800">
          <span>✨ {virtueInfo.thikrBenefit}</span>
          <span className="text-stone-500 dark:text-stone-400">{virtueInfo.practicalTip}</span>
        </div>
      </div>
    </div>
  );
};
