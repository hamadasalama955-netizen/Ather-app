import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  Share2,
  BookOpen,
  Volume2,
  Languages,
} from 'lucide-react';
import { MushafPageAyah, QuranBookmark } from '../../types';
import { fetchAyahTafseer, formatAyahShareCard, AyahTafseerResult } from '../../services/quranTafseerService';

interface Props {
  ayah: MushafPageAyah;
  onClose: () => void;
  isPlayingAudio: boolean;
  onToggleAudio: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const QuranAyahBottomSheet: React.FC<Props> = ({
  ayah,
  onClose,
  isPlayingAudio,
  onToggleAudio,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [tafseerData, setTafseerData] = useState<AyahTafseerResult | null>(null);
  const [isLoadingTafseer, setIsLoadingTafseer] = useState<boolean>(true);
  const [copiedType, setCopiedType] = useState<'ayah' | 'card' | null>(null);
  const [activeTab, setActiveTab] = useState<'tafseer' | 'words'>('tafseer');

  useEffect(() => {
    let isMounted = true;
    setIsLoadingTafseer(true);

    fetchAyahTafseer(ayah.number, ayah.text)
      .then((data) => {
        if (isMounted) {
          setTafseerData(data);
          setIsLoadingTafseer(false);
        }
      })
      .catch((err) => {
        console.warn('Error fetching tafseer', err);
        if (isMounted) setIsLoadingTafseer(false);
      });

    return () => {
      isMounted = false;
    };
  }, [ayah.number, ayah.text]);

  const handleCopyAyahOnly = () => {
    const text = `﴿${ayah.text}﴾ [سورة ${ayah.surah.name} - الآية ${ayah.numberInSurah}]`;
    navigator.clipboard.writeText(text);
    setCopiedType('ayah');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyCard = () => {
    const card = formatAyahShareCard(
      ayah.surah.name,
      ayah.numberInSurah,
      ayah.text,
      tafseerData?.tafseerText || '',
      tafseerData?.wordMeanings || []
    );
    navigator.clipboard.writeText(card);
    setCopiedType('card');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleShareCard = async () => {
    const card = formatAyahShareCard(
      ayah.surah.name,
      ayah.numberInSurah,
      ayah.text,
      tafseerData?.tafseerText || '',
      tafseerData?.wordMeanings || []
    );

    if (navigator.share) {
      try {
        await navigator.share({
          title: `سورة ${ayah.surah.name} - الآية ${ayah.numberInSurah}`,
          text: card,
        });
      } catch (err) {
        console.warn(err);
      }
    } else {
      handleCopyCard();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Bottom Sheet Modal */}
      <div className="relative w-full max-w-xl max-h-[85vh] bg-white dark:bg-[#141414] border-t border-stone-200 dark:border-stone-800 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 z-10">
        {/* Grab bar */}
        <div className="w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto my-2 shrink-0" />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-stone-100 dark:border-stone-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-[#d4af37]/20 text-[#d4af37] text-xs font-mono font-bold flex items-center justify-center border border-[#d4af37]/30">
              {ayah.numberInSurah}
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-stone-900 dark:text-white">
                سورة {ayah.surah.name}
              </h3>
              <p className="text-[10px] text-stone-400">
                الآية {ayah.numberInSurah} • الجزء {ayah.juz} • صفحة {ayah.page}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Audio recitation button */}
            <button
              onClick={onToggleAudio}
              className={`p-2 rounded-xl text-xs font-bold transition active:scale-95 ${
                isPlayingAudio
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
              title="تلاوة الآية"
            >
              {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            {/* Bookmark button */}
            <button
              onClick={onToggleBookmark}
              className={`p-2 rounded-xl text-xs font-bold transition active:scale-95 ${
                isBookmarked
                  ? 'bg-[#d4af37] text-stone-950 font-bold shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
              title="فاصلة المصحف"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-amber-300" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Sheet Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* 1. Quranic Ayah Text Box */}
          <div className="p-4 rounded-2xl bg-[#fdfbf7] dark:bg-stone-950/80 border border-amber-600/30 text-center shadow-xs">
            <p
              className="text-lg sm:text-xl text-stone-900 dark:text-amber-100 font-medium leading-[2.3] select-text"
              style={{ fontFamily: "'Traditional Arabic', 'Amiri', serif" }}
            >
              ﴿ {ayah.text} ﴾
            </p>
          </div>

          {/* Tab Switcher: التفسير الميسر vs معاني الكلمات */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-stone-100 dark:bg-stone-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('tafseer')}
              className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'tafseer'
                  ? 'bg-white dark:bg-stone-700 text-[#d4af37] shadow-xs'
                  : 'text-stone-500 dark:text-stone-400'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>التفسير الميسر</span>
            </button>

            <button
              onClick={() => setActiveTab('words')}
              className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'words'
                  ? 'bg-white dark:bg-stone-700 text-[#d4af37] shadow-xs'
                  : 'text-stone-500 dark:text-stone-400'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>معاني الكلمات واللغويات</span>
            </button>
          </div>

          {/* 2. Tafseer Tab */}
          {activeTab === 'tafseer' && (
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-bold text-[#d4af37]">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>تفسير الآية (الميسر):</span>
                </span>
                <span className="text-[10px] text-stone-400 font-normal">
                  مجمع الملك فهد لطباعة المصحف الشريف
                </span>
              </div>

              {isLoadingTafseer ? (
                <div className="py-6 text-center text-xs text-stone-400 animate-pulse space-y-2">
                  <div className="w-6 h-6 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p>جاري استخراج التفسير الميسر المعتمد...</p>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-200 leading-relaxed font-normal text-justify">
                  {tafseerData?.tafseerText}
                </p>
              )}
            </div>
          )}

          {/* 3. Word Meanings Tab */}
          {activeTab === 'words' && (
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-bold text-[#d4af37]">
                <span className="flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5" />
                  <span>معاني المفردات واللغويات الصعبة في الآية:</span>
                </span>
                <span className="text-[10px] text-stone-400 font-normal">
                  غريب القرآن
                </span>
              </div>

              {tafseerData?.wordMeanings && tafseerData.wordMeanings.length > 0 ? (
                <div className="space-y-2">
                  {tafseerData.wordMeanings.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700/80 flex items-start gap-2.5"
                    >
                      <span className="px-2 py-0.5 rounded-lg bg-[#d4af37]/20 text-[#d4af37] font-bold text-xs shrink-0 font-serif">
                        {m.word}
                      </span>
                      <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                        {m.meaning}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-500 py-3 text-center">
                  ألفاظ هذه الآية الكريمة واضحة بينة ومفصلة في التفسير الميسر.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Bottom Action Buttons */}
        <div className="p-4 bg-stone-50 dark:bg-stone-950 border-t border-stone-200/80 dark:border-stone-800 flex items-center gap-2 shrink-0">
          {/* Copy Ayah with Tafseer */}
          <button
            onClick={handleCopyCard}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-[#d4af37] hover:bg-[#c5a059] text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
          >
            {copiedType === 'card' ? (
              <>
                <Check className="w-4 h-4 text-amber-300 stroke-[3]" />
                <span>تم نسخ الآية والتفسير!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>نسخ الآية مع التفسير</span>
              </>
            )}
          </button>

          {/* Share as Text Card */}
          <button
            onClick={handleShareCard}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>مشاركة كبطاقة نصية</span>
          </button>
        </div>
      </div>
    </div>
  );
};
