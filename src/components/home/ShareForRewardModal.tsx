import React, { useState } from 'react';
import { X, Check, Share2 } from 'lucide-react';
import { AjrSharingSvg } from './ServicesSvgIcons';

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
    title: 'فضل نشر الخير',
    text: '«مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ»',
    source: 'صحيح مسلم',
  },
  {
    id: '2',
    category: 'آية وتدبر',
    title: 'طمأنينة القلوب',
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
    category: 'ذكر عظيم',
    title: 'كنز من كنوز الجنة',
    text: '«لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ، دَوَاءٌ لِتِسْعَةٍ وَتِسْعِينَ دَاءً أَيْسَرُهَا الْهَمُّ»',
    source: 'المستدرك على الصحيحين',
  },
  {
    id: '5',
    category: 'دعوة للتطبيق',
    title: 'رفيق المسلم اليومي',
    text: 'ندعوكم لتجربة تطبيق "أثَر | Athar - رفيق المسلم"؛ لمتابعة الصلوات، المصحف بصفحاته، والأذكار بلا إعلانات تجارية.',
    source: 'أثَر',
  },
];

export const ShareForRewardModal: React.FC<Props> = ({ isOpen, onClose, inline = false }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [totalShares, setTotalShares] = useState<number>(() => {
    return parseInt(localStorage.getItem('noor_shared_deeds_count') || '7', 10);
  });

  if (!isOpen) return null;

  const handleShare = async (item: ShareItem) => {
    const formatted = `✨ ${item.title} ✨\n\n${item.text}\n\n[المصدر: ${item.source}]\n\n✨ تطبيق أثَر | Athar - رفيق المسلم`;

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
    localStorage.setItem('noor_shared_deeds_count', next.toString());
  };

  const listItems = (
    <div className="space-y-3">
      {SHARABLE_ITEMS.map((item) => (
        <div
          key={item.id}
          className="p-4 rounded-3xl bg-white dark:bg-[#141414] border border-stone-200/80 dark:border-[#d4af37]/25 space-y-2.5 shadow-xs transition hover:border-[#d4af37]/40"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-900 dark:text-[#d4af37]">
              {item.category}
            </span>
            <span className="text-[10px] text-stone-500 dark:text-stone-400">
              {item.source}
            </span>
          </div>

          <h4 className="text-sm font-extrabold text-stone-900 dark:text-stone-100">
            {item.title}
          </h4>

          <p
            style={{ fontFamily: 'var(--font-quran), Amiri, serif' }}
            className="text-base sm:text-lg leading-relaxed text-stone-800 dark:text-stone-100 font-semibold select-text"
          >
            {item.text}
          </p>

          <div className="flex items-center justify-end gap-2 pt-1 border-t border-stone-100 dark:border-stone-800/80">
            <button
              onClick={() => handleShare(item)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#d4af37] hover:bg-[#c5a059] text-stone-950 text-xs font-bold transition active:scale-95 shadow-xs"
            >
              {copiedId === item.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-stone-950" />
                  <span>تم النسخ</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>مشاركة الأجر</span>
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  if (inline) {
    return (
      <div className="space-y-4 pb-12 animate-in fade-in duration-200">
        <div className="p-4 rounded-3xl bg-gradient-to-r from-[#1a1814] to-[#141414] text-white border border-[#d4af37]/30 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
              <AjrSharingSvg className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                الأجر بالنشر
              </h2>
              <p className="text-[10px] text-stone-300">
                الدال على الخير كفاعله · صدقة جارية
              </p>
            </div>
          </div>

          <div className="text-left bg-black/40 px-3 py-1.5 rounded-xl border border-[#d4af37]/20">
            <div className="text-[10px] text-stone-300">مشاركاتك المباركة</div>
            <div className="text-sm font-bold font-mono text-[#d4af37] text-center">{totalShares}</div>
          </div>
        </div>
        {listItems}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm max-h-[90vh] bg-[#faf8f5] dark:bg-[#141414] text-stone-900 dark:text-stone-100 rounded-3xl p-5 shadow-2xl flex flex-col justify-between border border-[#d4af37]/40 animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#1a1814] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
              <AjrSharingSvg className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-[#d4af37]">
                الأجر بالنشر
              </h3>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                الدال على الخير كفاعله · صدقة جارية
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sharable Cards List */}
        <div className="space-y-3 overflow-y-auto flex-1 pr-0.5 no-scrollbar py-2">
          {listItems}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-stone-200/80 dark:border-stone-800 text-center">
          <p className="text-[10px] text-stone-400">
            «إذا مات ابن آدم انقطع عمله إلا من ثلاث: صدقة جارية، أو علم يُنتفع به، أو ولد صالح يدعو له»
          </p>
        </div>
      </div>
    </div>
  );
};
