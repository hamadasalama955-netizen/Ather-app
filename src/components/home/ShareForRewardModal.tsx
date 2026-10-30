import React, { useState } from 'react';
import { X, Check, Share2, ArrowRight, HeartHandshake, Copy } from 'lucide-react';
import { ShareRewardServiceIcon } from './ServicesGridIcons';
import { ScreenBackButton } from '../common/ScreenBackButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  inline?: boolean;
}

interface ShareItem {
  id: string;
  category: string;
  title: string;
  text: string;
  source: string;
}

const SHARABLE_ITEMS: ShareItem[] = [
  {
    id: '1',
    category: 'حديث نبوي شريف',
    title: 'فضل نشر الخير والدلالة عليه',
    text: '«مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ»',
    source: 'صحيح مسلم',
  },
  {
    id: '2',
    category: 'آية وتدبر',
    title: 'طمأنينة القلوب بذكر الله',
    text: '﴿الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾',
    source: 'سورة الرعد: 28',
  },
  {
    id: '3',
    category: 'دعاء ورجاء',
    title: 'دعاء تيسير الأمور وتفريج الكرب',
    text: '«اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلاً، وَأَنْتَ تَجْعَلُ الحَزْنَ إِذَا شِئْتَ سَهْلاً»',
    source: 'صحيح ابن حبان',
  },
  {
    id: '4',
    category: 'كنز من كنوز الجنة',
    title: 'الحوقلة والاستعانة بالله',
    text: '«لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ، كنزٌ من كنوز الجنة ودواءٌ لكل همٍّ وضيق»',
    source: 'متفق عليه',
  },
  {
    id: '5',
    category: 'الصلاة على النبي ﷺ',
    title: 'مضاعفة الحسنات ومحو السيئات',
    text: '«مَنْ صَلَّى عَلَيَّ صَلَاةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا»',
    source: 'صحيح مسلم',
  },
  {
    id: '6',
    category: 'دعوة للتطبيق',
    title: 'رفيق المسلم اليومي النقي',
    text: 'ندعوكم لتجربة تطبيق "أثَر | رفيق المسلم"؛ لمتابعة الصلوات، المصحف الشريف، والأذكار والمسابقات، بلا إعلانات ويعمل بدون إنترنت.',
    source: 'أثَر | رفيق المسلم',
  },
];

export const ShareForRewardModal: React.FC<Props> = ({ isOpen, onClose, inline = false }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [totalShares, setTotalShares] = useState<number>(() => {
    return parseInt(localStorage.getItem('athar_shared_deeds_count') || '12', 10);
  });

  if (!isOpen) return null;

  const handleShare = async (item: ShareItem) => {
    const formatted = `✨ ${item.title} ✨\n\n${item.text}\n\n[المصدر: ${item.source}]\n\n✨ تطبيق أثَر | رفيق المسلم`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: formatted,
        });
        incrementDeeds();
        return;
      } catch (err) {
        // User cancelled or unsupported
      }
    }

    navigator.clipboard.writeText(formatted);
    setCopiedId(item.id);
    incrementDeeds();
    setTimeout(() => setCopiedId(null), 2500);
  };

  const incrementDeeds = () => {
    const next = totalShares + 1;
    setTotalShares(next);
    localStorage.setItem('athar_shared_deeds_count', next.toString());
  };

  const listItems = (
    <div className="space-y-3 pb-8">
      {SHARABLE_ITEMS.map((item) => (
        <div
          key={item.id}
          className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#141414] border border-stone-200 dark:border-[#d4af37]/25 space-y-3 shadow-xs transition hover:border-[#d4af37]/60"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-700 dark:text-[#facc15] bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-[#d4af37]/30">
              {item.category}
            </span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              {item.source}
            </span>
          </div>

          <h4 className="text-sm font-extrabold text-stone-900 dark:text-stone-100">
            {item.title}
          </h4>

          <p
            style={{ fontFamily: "'Traditional Arabic', 'Amiri', serif" }}
            className="text-lg sm:text-xl leading-relaxed text-stone-800 dark:text-stone-100 font-semibold select-text"
          >
            {item.text}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800/80">
            <span className="text-[11px] text-stone-400">الدال على الخير كفاعله</span>
            <button
              onClick={() => handleShare(item)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#aa7c11] hover:from-[#fef08a] hover:to-[#d4af37] text-stone-950 text-xs font-black transition active:scale-95 shadow-xs"
            >
              {copiedId === item.id ? (
                <>
                  <Check className="w-4 h-4 text-stone-950 stroke-[2.5]" />
                  <span>تم النسخ بنجاح</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 stroke-[2.5]" />
                  <span>مشاركة الأجر الآن</span>
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#fcfbf7] dark:bg-[#0c0c0c] text-stone-900 dark:text-stone-100 select-none animate-in fade-in duration-200"
      dir="rtl"
    >
      {/* Full Mobile Screen Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#faf8f5]/95 dark:bg-[#121212]/95 backdrop-blur-md border-b border-[#d4af37]/25 shadow-xs">
        <div className="flex items-center gap-3">
          <ScreenBackButton onClick={onClose} ariaLabel="رجوع" />

          <div>
            <h2 className="text-base sm:text-lg font-black text-stone-900 dark:text-[#f5e6b8] flex items-center gap-1.5">
              <span>الأجر بالنشر</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-[#facc15] font-bold">
                صدقة جارية
              </span>
            </h2>
            <p className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400">
              شارك الخير والأذكار والأحاديث الصحيحة مع أحبابك
            </p>
          </div>
        </div>
      </header>

      {/* Main Full-Screen Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 max-w-2xl mx-auto w-full space-y-4">
        {/* Banner with Total Deeds */}
        <div className="relative overflow-hidden p-5 rounded-3xl bg-gradient-to-r from-[#1c1811] via-[#12110e] to-[#0a0a0a] text-white border-2 border-[#d4af37]/40 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <ShareRewardServiceIcon className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                الدال على الخير كفاعله
              </h3>
              <p className="text-xs text-stone-300">
                انشر آية أو حديثاً أو ذكراً واكسب أجر من قرأ وعمل به
              </p>
            </div>
          </div>

          <div className="text-center bg-black/60 px-3.5 py-2 rounded-2xl border border-[#d4af37]/30 shrink-0">
            <span className="text-[10px] text-amber-300 block font-semibold">مشاركاتك</span>
            <span className="text-base font-black font-mono text-[#facc15]">{totalShares}</span>
          </div>
        </div>

        {/* Sharable items list */}
        {listItems}
      </div>
    </div>
  );
};
