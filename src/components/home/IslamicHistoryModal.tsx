import React, { useState } from 'react';
import { X, Calendar, ChevronRight, ChevronLeft, BookOpen, Feather } from 'lucide-react';
import { IslamicHistoryScrollSvg } from './ServicesSvgIcons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  inline?: boolean;
}

interface HistoricalStation {
  id: string;
  hijriDate: string;
  title: string;
  era: string;
  story: string;
  lesson: string;
}

const STATIONS: HistoricalStation[] = [
  {
    id: '1',
    hijriDate: '١٧ رمضان ٢ هـ',
    title: 'غزوة بدر الكبرى (يوم الفرقان)',
    era: 'العصر النبوي الشريف',
    story: 'أول معركة فاصلة بين الحق والباطل، التقى فيها جند الإيمان بقيادة رسول الله ﷺ بجموع قريش، وتنزلت فيها ملائكة السماء تثبيتاً للمؤمنين.',
    lesson: 'النصر لا يكون بالكثرة العددية والعتاد فقط، وإنما بالإخلاص والتوكل على الله وبذل الأسباب المشروعة.',
  },
  {
    id: '2',
    hijriDate: '٢٠ رمضان ٨ هـ',
    title: 'فتح مكة المكرمة وتطهير البيت العتيق',
    era: 'العصر النبوي الشريف',
    story: 'دخل النبي ﷺ مكة مطأطئ الرأس تواضعاً لله وهو يقرأ سورة الفتح، وحطم الأصنام حول الكعبة معلناً: ﴿وَقُلْ جَاءَ الْحَقُّ وَزَهَقَ الْبَاطِلُ﴾ وعفا عن أهلها قائلاً: «اذهبوا فأنتم الطلقاء».',
    lesson: 'العفو عند المقدرة، والتواضع عند بلوغ النصر، وحرمة بيوت الله.',
  },
  {
    id: '3',
    hijriDate: '١ ربيع الأول ١ هـ',
    title: 'الهجرة النبوية المباركة إلى المدينة المنورة',
    era: 'بداية التاريخ الهجري',
    story: 'خرج النبي ﷺ بصحبة الصديق أبي بكر رضي الله عنه مهاجرين إلى يثرب، فأنار الهدى أرض طيبة، وتأسست الدولة الإسلامية الأولى القائمة على المؤاخاة والعدل.',
    lesson: 'التضحية بالأوطان والأموال في سبيل العقيدة، وقيمة الصحبة الصالحة في الشدائد.',
  },
  {
    id: '4',
    hijriDate: '٢٧ رجب قبل الهجرة',
    title: 'معجزة الإسراء والمعراج وفرض الصلوات الخمس',
    era: 'العهد المكي',
    story: 'أُسري بالحبيب المصطفى ﷺ ليلاً من المسجد الحرام إلى المسجد الأقصى، ثم عُرِج به إلى سدرة المنتهى، حيث فُرضت على الأمة الصلاة صلةً مباشرة بين العبد وربه.',
    lesson: 'علو منزلة الصلاة في ديننا، ومكانة المسجد الأقصى المبارك في عقيدة المسلمين.',
  },
  {
    id: '5',
    hijriDate: '٢٧ رجب ٥٨٣ هـ',
    title: 'تحرير بيت المقدس بقيادة صلاح الدين الأيوبي',
    era: 'الدولة الأيوبية',
    story: 'بعد معركة حطين الخالدة، استرد القائد المسلم صلاح الدين الأيوبي القدس الشريف، مع ضرب أروع الأمثلة في التسامح الإنساني والرحمة بغير المسلمين.',
    lesson: 'وحدة الصف والجهاد القائم على العدل والأخلاق يعيد للأمة عزتها ومقدساتها.',
  },
  {
    id: '6',
    hijriDate: '٢٥ رمضان ٦٥٨ هـ',
    title: 'معركة عين جالوت وكسر شوكة التتار',
    era: 'دولة المماليك',
    story: 'صرخة السلطان قطز: «وا إسلاماه!» كانت الشرارة التي حطمت أسطورة الجيش المغولي الذي لا يقهر، وأنقذت العالم الإسلامي وحواضره من الإبادة.',
    lesson: 'الثبات في أحلك الظروف، وتقديم الصالح العام للأمة على كل خلاف شخصي.',
  },
];

export const IslamicHistoryModal: React.FC<Props> = ({ isOpen, onClose, inline = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen) return null;

  const currentStation = STATIONS[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % STATIONS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + STATIONS.length) % STATIONS.length);
  };

  const content = (
    <div className="space-y-4">
      {/* Current Station Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#141414] border border-stone-200/80 dark:border-[#d4af37]/25 space-y-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#d4af37]/20 text-stone-900 dark:text-[#d4af37] border border-[#d4af37]/30 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{currentStation.hijriDate}</span>
          </span>

          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
            {currentStation.era}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white leading-snug">
          {currentStation.title}
        </h3>

        <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
          {currentStation.story}
        </p>

        <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-[#1a1814] border border-stone-200/60 dark:border-[#d4af37]/20 space-y-1">
          <div className="text-[11px] font-bold text-stone-900 dark:text-[#d4af37] flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-[#d4af37]" />
            <span>العبرة والدلالة الإيمانية:</span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            {currentStation.lesson}
          </p>
        </div>
      </div>

      {/* Navigation Pager */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-[#1a1814] border border-stone-200 dark:border-stone-800 text-xs font-bold text-stone-700 dark:text-stone-200 transition active:scale-95"
        >
          <ChevronRight className="w-4 h-4" />
          <span>المحطة السابقة</span>
        </button>

        <span className="text-xs font-mono font-bold text-stone-400">
          {currentIndex + 1} / {STATIONS.length}
        </span>

        <button
          onClick={handleNext}
          className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#d4af37] hover:bg-[#c5a059] text-stone-950 text-xs font-bold transition active:scale-95 shadow-xs"
        >
          <span>المحطة التالية</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  if (inline) {
    return (
      <div className="space-y-4 pb-12 animate-in fade-in duration-200">
        <div className="p-4 rounded-3xl bg-gradient-to-r from-[#1a1814] to-[#141414] text-white border border-[#d4af37]/30 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
              <IslamicHistoryScrollSvg className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>محطات إسلامية</span>
                <Feather className="w-3.5 h-3.5 text-[#d4af37]" />
              </h2>
              <p className="text-[10px] text-stone-300">
                حدث في التاريخ الإسلامي · عبر ودروس
              </p>
            </div>
          </div>
        </div>
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#faf8f5] dark:bg-[#141414] text-stone-900 dark:text-stone-100 rounded-3xl p-5 shadow-2xl space-y-4 border border-[#d4af37]/40 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#1a1814] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
              <IslamicHistoryScrollSvg className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-[#d4af37] flex items-center gap-1.5">
                <span>محطات إسلامية</span>
                <Feather className="w-3.5 h-3.5 text-[#d4af37]" />
              </h3>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                حدث في التاريخ الإسلامي · عبر ودروس
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

        {content}
      </div>
    </div>
  );
};
