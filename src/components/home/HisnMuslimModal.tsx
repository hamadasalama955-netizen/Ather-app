import React, { useState } from 'react';
import { X, ShieldCheck, Heart, Sparkles, Copy, Check } from 'lucide-react';
import { HisnMuslimSvg } from './ServicesSvgIcons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  inline?: boolean;
}

interface HisnItem {
  id: string;
  category: string;
  thikr: string;
  benefit: string;
  count: number;
}

const HISN_ITEMS: HisnItem[] = [
  {
    id: '1',
    category: 'التحصين الصباحي والمسائي',
    thikr: '«بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ»',
    benefit: 'من قالها ثلاثاً لم يضره شيء حتى يمسي أو يصبح',
    count: 3,
  },
  {
    id: '2',
    category: 'الاستعاذة التامة',
    thikr: '«أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ»',
    benefit: 'حماية وحصن من كل سوء ومكروه ودابة',
    count: 3,
  },
  {
    id: '3',
    category: 'الخروج من المنزل',
    thikr: '«بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ»',
    benefit: 'يُقال له: كُفِيتَ، وَوُقِيتَ، وَهُدِيتَ، وَتَنَحَّى عَنْهُ الشَّيْطَانُ',
    count: 1,
  },
  {
    id: '4',
    category: 'الهم والغم والحزن',
    thikr: '«اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ»',
    benefit: 'دعاء نبوي جامع لتفريج الكروب والهموم وقضاء الديون',
    count: 1,
  },
  {
    id: '5',
    category: 'سيد الاستغفار',
    thikr: '«اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ»',
    benefit: 'من قالها موقناً بها فمات من يومه أو ليلته دخل الجنة',
    count: 1,
  },
];

export const HisnMuslimModal: React.FC<Props> = ({ isOpen, onClose, inline = false }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (item: HisnItem) => {
    navigator.clipboard.writeText(`${item.thikr}\n[${item.benefit}]`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const listContent = (
    <div className="space-y-3">
      {HISN_ITEMS.map((item) => (
        <div
          key={item.id}
          className="p-4 rounded-3xl bg-white dark:bg-[#122e23] border border-stone-200/80 dark:border-stone-800 space-y-2 shadow-xs transition hover:border-[#dfb76c]/40"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#0d3b2e] dark:text-[#dfb76c]">
              {item.category}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[#dfb76c]/15 text-[#926a27] dark:text-[#dfb76c] font-bold">
              {item.count > 1 ? `${item.count} مرات` : 'مرة واحدة'}
            </span>
          </div>

          <p
            style={{ fontFamily: 'var(--font-quran), Amiri, serif' }}
            className="text-base sm:text-lg leading-relaxed text-stone-800 dark:text-stone-100 font-semibold select-text"
          >
            {item.thikr}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800/80">
            <span className="text-xs text-stone-500 dark:text-stone-400">
              ✨ {item.benefit}
            </span>

            <button
              onClick={() => handleCopy(item)}
              title="نسخ الدعاء"
              className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-[#0d3b2e] dark:text-[#dfb76c] transition active:scale-90"
            >
              {copiedId === item.id ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
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
        <div className="p-4 rounded-3xl bg-gradient-to-r from-[#0d3b2e] to-[#09231b] text-white border border-[#dfb76c]/30 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#dfb76c]/20 border border-[#dfb76c]/30 flex items-center justify-center text-[#dfb76c]">
              <HisnMuslimSvg className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>حصن المسلم المعتمد</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#dfb76c]" />
              </h2>
              <p className="text-[10px] text-stone-300">
                أدعية الحفظ والتحصين والوقاية اليومية
              </p>
            </div>
          </div>
        </div>
        {listContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm max-h-[90vh] bg-[#fcfbf7] dark:bg-[#0b241c] text-stone-900 dark:text-stone-100 rounded-3xl p-5 shadow-2xl space-y-4 border border-[#dfb76c]/40 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0d3b2e] dark:bg-[#122e23] border border-[#dfb76c]/30 flex items-center justify-center text-[#dfb76c]">
              <HisnMuslimSvg className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0d3b2e] dark:text-[#dfb76c] flex items-center gap-1.5">
                <span>حصن المسلم المعتمد</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#dfb76c]" />
              </h3>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                أدعية الحفظ والتحصين والوقاية اليومية
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

        {/* List of fortress invocations */}
        <div className="space-y-3 overflow-y-auto flex-1 pr-0.5 no-scrollbar py-1">
          {listContent}
        </div>

        <div className="pt-2 text-center text-[10px] text-stone-400">
          «احفظ الله يحفظك، احفظ الله تجده تجاهك»
        </div>
      </div>
    </div>
  );
};
