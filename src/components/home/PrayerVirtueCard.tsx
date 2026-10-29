import React from 'react';
import { Heart, BookOpen, Clock, Check, Copy, Share2 } from 'lucide-react';
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
        // Fallback to clipboard
      }
    }

    navigator.clipboard.writeText(shareText);
    setShared(true);
    setTimeout(() => setShared(false), 2500);
  };

  return (
    <div className="rounded-3xl bg-[#faf8f5] dark:bg-[#141414] border border-[#d4af37]/25 p-4 sm:p-5 shadow-2xs space-y-3.5 transition-all">
      {/* Header: Dynamic with current prayer, clean without badges, share on the left */}
      <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-2.5" dir="rtl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#aa7c11] text-stone-950 flex items-center justify-center font-bold shadow-2xs">
            <BookOpen className="w-4 h-4 text-stone-950" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
              نفحات وقت {prayerArabicName}
            </h3>
            <p className="text-[10px] text-stone-500 dark:text-[#a39e93] mt-0.5">
              {virtueInfo.title}
            </p>
          </div>
        </div>

        {/* Share Button on the left (ناحية الشمال) */}
        <div>
          <button
            onClick={handleQuickShare}
            title="مشاركة سريعة لنفحات وفضل الصلاة"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1a1814] hover:bg-[#d4af37]/20 text-[#8c6b2d] dark:text-[#d4af37] text-xs font-bold transition active:scale-95 border border-[#d4af37]/35 shadow-2xs"
          >
            {shared ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>تم النسخ</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>مشاركة</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hadith / Quranic Virtue */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1a1814] border border-[#d4af37]/20 space-y-1.5">
        <div className="text-[11px] font-bold text-[#8c6b2d] dark:text-[#d4af37] flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>من فضل هذه الصلاة المباركة:</span>
        </div>
        <p
          style={{ fontFamily: "'Amiri Quran', 'Amiri', 'Traditional Arabic', serif" }}
          className="text-base sm:text-lg leading-relaxed text-stone-800 dark:text-[#f5e6b8] select-text"
        >
          {virtueInfo.hadithOrAyah}
        </p>
        <div className="text-[10px] text-stone-500 dark:text-[#a39e93] font-medium">
          المصدر: {virtueInfo.source}
        </div>
      </div>

      {/* Recommended Thikr for this prayer */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1a1814] border border-[#d4af37]/25 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold text-stone-800 dark:text-[#d4af37] flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>ذكر مأثور يُستحب قوله عند الأذان أو بعد الصلاة:</span>
          </div>

          <button
            onClick={handleCopyThikr}
            title="نسخ الذكر"
            className="p-1 rounded-lg hover:bg-[#d4af37]/20 text-[#d4af37] transition"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[#d4af37]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <p
          style={{ fontFamily: "'Amiri Quran', 'Amiri', 'Traditional Arabic', serif" }}
          className="text-base sm:text-lg text-stone-900 dark:text-[#f5e6b8] leading-relaxed font-semibold select-text"
        >
          {virtueInfo.recommendedThikr}
        </p>

        <div className="flex items-center justify-between text-[10px] text-stone-600 dark:text-[#a39e93] pt-1 border-t border-[#d4af37]/20">
          <span>{virtueInfo.thikrBenefit}</span>
          <span className="text-stone-500 dark:text-stone-400">{virtueInfo.practicalTip}</span>
        </div>
      </div>
    </div>
  );
};
