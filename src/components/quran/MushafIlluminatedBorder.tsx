import React from 'react';

interface SurahCloudHeaderProps {
  surahName: string;
  isDark?: boolean;
}

export const SurahCloudHeader: React.FC<SurahCloudHeaderProps> = ({ surahName, isDark = false }) => {
  const formattedName = surahName.startsWith('سورة') || surahName.startsWith('سُورَةُ')
    ? surahName
    : `سُورَةُ ${surahName}`;

  return (
    <div className="relative w-full my-3 px-1 select-none text-center">
      <div className="relative inline-flex items-center justify-center max-w-full">
        {/* Scalloped Arabesque Cloud Cartouche Background matching image_14.png */}
        <div
          className={`relative px-8 sm:px-12 py-2.5 sm:py-3 rounded-full border-2 border-[#d4af37] shadow-md transition-all ${
            isDark
              ? 'bg-gradient-to-r from-[#1a1814] via-[#241e16] to-[#1a1814]'
              : 'bg-gradient-to-r from-[#faf6ed] via-[#fffefc] to-[#faf6ed]'
          }`}
          style={{
            boxShadow: '0 4px 14px rgba(212, 175, 55, 0.25)',
          }}
        >
          {/* Outer Scalloped SVG border accents */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#991b1b] border-2 border-[#d4af37] flex items-center justify-center shadow-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37]" />
          </div>
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#991b1b] border-2 border-[#d4af37] flex items-center justify-center shadow-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37]" />
          </div>

          {/* Surah Name in Calligraphy Font */}
          <h2
            className={`text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide ${
              isDark ? 'text-[#f5e6b8]' : 'text-[#1c1917]'
            }`}
            style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
          >
            {formattedName}
          </h2>
        </div>
      </div>
    </div>
  );
};

interface SurahCloudFooterProps {
  ayahCount: number;
  isDark?: boolean;
}

export function toArabicDigits(num: number | string): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/\d/g, (d) => arabicDigits[parseInt(d, 10)]);
}

export const SurahCloudFooter: React.FC<SurahCloudFooterProps> = ({ ayahCount, isDark = false }) => {
  return (
    <div className="relative w-full my-3 px-1 select-none text-center">
      <div className="relative inline-flex items-center justify-center">
        {/* Scalloped Arabesque Cloud Cartouche Background matching image_14.png */}
        <div
          className={`relative px-6 sm:px-10 py-1.5 sm:py-2 rounded-full border-2 border-[#d4af37] shadow-xs ${
            isDark
              ? 'bg-gradient-to-r from-[#1a1814] via-[#241e16] to-[#1a1814]'
              : 'bg-gradient-to-r from-[#faf6ed] via-[#fffefc] to-[#faf6ed]'
          }`}
          style={{
            boxShadow: '0 2px 8px rgba(212, 175, 55, 0.2)',
          }}
        >
          {/* Outer Mini Rosettes */}
          <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#991b1b] border border-[#d4af37] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
          </div>
          <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#991b1b] border border-[#d4af37] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
          </div>

          <span
            className={`text-sm sm:text-base font-bold ${
              isDark ? 'text-[#f5e6b8]' : 'text-[#8c6b2d]'
            }`}
            style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
          >
            وَهِيَ «{toArabicDigits(ayahCount)}» آيَة
          </span>
        </div>
      </div>
    </div>
  );
};

interface BasmalahBannerProps {
  isDark?: boolean;
}

export const BasmalahBanner: React.FC<BasmalahBannerProps> = ({ isDark = false }) => {
  return (
    <div className="relative text-center my-2 select-none w-full flex items-center justify-center overflow-hidden">
      <div className="inline-flex items-center justify-center gap-1.5 sm:gap-3 px-2 py-0.5 max-w-full">
        <span className="text-[#d4af37] opacity-60 text-[10px] sm:text-xs select-none shrink-0">✦ ✦</span>
        <p
          className={`text-base sm:text-xl md:text-2xl font-extrabold whitespace-nowrap tracking-wide leading-relaxed select-none ${
            isDark ? 'text-[#f5e6b8]' : 'text-[#1c1917]'
          }`}
          style={{ fontFamily: "'Amiri Quran', 'Amiri', 'Traditional Arabic', serif" }}
        >
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>
        <span className="text-[#d4af37] opacity-60 text-[10px] sm:text-xs select-none shrink-0">✦ ✦</span>
      </div>
    </div>
  );
};
