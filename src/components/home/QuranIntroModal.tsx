import React from 'react';
import { X, BookOpen, ChevronLeft, Bookmark, Heart, Share2, Check } from 'lucide-react';
import { toArabicDigits } from '../quran/MushafIlluminatedBorder';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuranIndex: () => void;
  onOpenMushafPage: (page: number) => void;
  isDark?: boolean;
}

interface QuranVirtueItem {
  id: string;
  category: string;
  arabicText: string;
  source: string;
  benefit: string;
}

const QURAN_VIRTUES: QuranVirtueItem[] = [
  {
    id: '1',
    category: 'هداية القلوب والسكينة',
    arabicText: '«إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ وَيُبَشِّرُ الْمُؤْمِنِينَ الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ أَنَّ لَهُمْ أَجْرًا كَبِيرًا»',
    source: 'سورة الإسراء: 9',
    benefit: 'القرآن نور البصائر وأعدل المناهج وحصن المؤمن في دنياه وآخرته.',
  },
  {
    id: '2',
    category: 'شفاعة القرآن يوم القيامة',
    arabicText: '«اقْرَءُوا القُرْآنَ فإنَّه يَأْتي يَومَ القِيامَةِ شَفِيعًا لأَصْحابِهِ»',
    source: 'صحيح مسلم',
    benefit: 'يأتي القرآن الكريم حجة لصاحبه وشافعاً له عند أهوال يوم القيامة.',
  },
  {
    id: '3',
    category: 'فضل مدارسة القرآن وتعليمه',
    arabicText: '«خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ»',
    source: 'صحيح البخاري',
    benefit: 'أعلى مراتب الأمة وأشرفها من اشتغل بكتاب الله تلاوة وتدبراً وعملاً.',
  },
  {
    id: '4',
    category: 'منزلة الماهر بالقرآن',
    arabicText: '«الَّذِي يَقْرَأُ القُرْآنَ وَهو ماهِرٌ به مع السَّفَرَةِ الكِرامِ البَرَرَةِ، والذي يَقْرَأُ القُرْآنَ ويَتَتَعْتَعُ فِيهِ وهو عليه شاقٌّ له أجْرانِ»',
    source: 'متفق عليه',
    benefit: 'بشارة عظيمة لمن أتقن القراءة ولمن جاهد نفسه في التلاوة بحصول الأجرين.',
  },
  {
    id: '5',
    category: 'دعاء تدبر كلام الله ونور البصيرة',
    arabicText: '«اللَّهُمَّ اجْعَلِ الْقُرْآنَ الْعَظِيمَ رَبِيعَ قُلُوبِنَا، وَنُورَ صُدُورِنَا، وَجَلَاءَ أَحْزَانِنَا، وَذَهَابَ هُمُومِنَا وَغُمُومِنَا»',
    source: 'مسند الإمام أحمد',
    benefit: 'دعاء نبوي مبارك لانشراح الصدر والسكينة وتفريج الكروب بكتاب الله.',
  },
];

export const QuranIntroModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenQuranIndex,
  onOpenMushafPage,
  isDark = false,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  // Retrieve last saved mushaf page
  let lastPage = 1;
  try {
    const stored = localStorage.getItem('noor_last_mushaf_page');
    if (stored) {
      const p = parseInt(stored, 10);
      if (p >= 1 && p <= 604) lastPage = p;
    }
  } catch {}

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
        <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/20 shrink-0" dir="rtl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-b from-[#d4af37] to-[#aa7c11] text-stone-950 flex items-center justify-center font-bold shadow-sm">
              <BookOpen className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <h2
                className={`text-base sm:text-lg font-extrabold ${
                  isDark ? 'text-[#f5e6b8]' : 'text-[#2e4426]'
                }`}
                style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
              >
                المصحف الشريف
              </h2>
              <p className="text-[11px] text-[#8c6b2d] dark:text-[#d4af37]">
                برسم مصحف المدينة المنورة (٦٠٤ صفحة)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition ${
              isDark
                ? 'hover:bg-[#1f1d18] text-stone-400 hover:text-white'
                : 'hover:bg-stone-200 text-stone-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons to Enter Quran */}
        <div className="grid grid-cols-2 gap-2.5 my-3 shrink-0" dir="rtl">
          <button
            onClick={() => {
              onClose();
              onOpenMushafPage(lastPage);
            }}
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#bfa034] text-stone-950 font-extrabold text-xs sm:text-sm shadow-md hover:brightness-105 active:scale-95 transition"
          >
            <Bookmark className="w-4 h-4 fill-stone-950" />
            <span>متابعة (ص {toArabicDigits(lastPage)})</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenQuranIndex();
            }}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm border transition active:scale-95 shadow-2xs ${
              isDark
                ? 'bg-[#1a1814] border-[#d4af37]/40 text-[#d4af37] hover:bg-[#25221b]'
                : 'bg-white border-[#2e4426]/30 text-[#2e4426] hover:bg-stone-50'
            }`}
          >
            <span>فهرس السور والأجزاء</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Virtues & Quranic Reflections */}
        <div className="flex-1 overflow-y-auto space-y-3 px-1 py-1 no-scrollbar" dir="rtl">
          <div className="text-[11px] font-bold text-[#8c6b2d] dark:text-[#d4af37] flex items-center gap-1.5 px-1">
            <Heart className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37]" />
            <span>فضائل تلاوة القرآن وتدبر آياته:</span>
          </div>

          {QURAN_VIRTUES.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
                isDark
                  ? 'bg-[#181818] border-[#d4af37]/25 text-stone-100 hover:border-[#d4af37]/45'
                  : 'bg-white border-stone-200 text-stone-900 shadow-2xs hover:border-[#2e4426]/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#d4af37]/15 text-[#8c6b2d] dark:text-[#d4af37] border border-[#d4af37]/30">
                  {item.category}
                </span>

                <button
                  onClick={() => handleCopy(item.id, item.arabicText)}
                  className={`p-1.5 rounded-lg transition ${
                    isDark ? 'hover:bg-[#25221b] text-stone-400' : 'hover:bg-stone-100 text-stone-500'
                  }`}
                  title="نسخ"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <p
                className={`text-base sm:text-lg leading-relaxed font-bold select-text ${
                  isDark ? 'text-[#f5e6b8]' : 'text-stone-900'
                }`}
                style={{ fontFamily: "'Amiri Quran', 'Amiri', 'Traditional Arabic', serif" }}
              >
                {item.arabicText}
              </p>

              <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-[#a39e93] pt-1.5 border-t border-stone-200/60 dark:border-stone-800">
                <span className="font-medium">{item.benefit}</span>
                <span className="font-semibold text-[#8c6b2d] dark:text-[#d4af37] shrink-0 mr-2">
                  {item.source}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#d4af37]/20 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 shrink-0" dir="rtl">
          <span>ورد يومي متجدد • خالي من الإعلانات</span>
          <button
            onClick={() => {
              onClose();
              onOpenQuranIndex();
            }}
            className="text-xs font-bold text-[#8c6b2d] dark:text-[#d4af37] hover:underline"
          >
            فتح فهرس الـ ١١٤ سورة ←
          </button>
        </div>
      </div>
    </div>
  );
};
