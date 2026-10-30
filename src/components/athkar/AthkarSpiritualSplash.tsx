import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface Props {
  onDismiss: () => void;
  durationMs?: number;
  isDark?: boolean;
}

export const AthkarSpiritualSplash: React.FC<Props> = ({
  onDismiss,
  durationMs = 2400,
  isDark: propIsDark,
}) => {
  const [progress, setProgress] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  // Check dark mode dynamically
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (propIsDark !== undefined) return propIsDark;
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (propIsDark !== undefined) {
      setIsDark(propIsDark);
    } else if (typeof document !== 'undefined') {
      const observer = new MutationObserver(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      return () => observer.disconnect();
    }
  }, [propIsDark]);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, (elapsed / durationMs) * 100);
      setProgress(currentProgress);

      if (elapsed >= durationMs) {
        clearInterval(interval);
        handleClose();
      }
    }, 30);

    return () => clearInterval(interval);
  }, [durationMs]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onDismiss();
    }, 280);
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md cursor-pointer select-none transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      } ${
        isDark
          ? 'bg-black/85'
          : 'bg-stone-900/40'
      }`}
      dir="rtl"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#d4af37]/20 blur-3xl pointer-events-none" />

      {/* Main Spiritual Card with high contrast and crystal clear typography */}
      <div
        className={`relative max-w-sm w-full rounded-3xl p-6 sm:p-8 text-center space-y-6 border-2 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95 ${
          isDark
            ? 'bg-[#141414] text-white border-[#d4af37]/60 shadow-[0_10px_35px_rgba(0,0,0,0.8)]'
            : 'bg-white text-stone-900 border-[#c5a059] shadow-[0_12px_40px_rgba(212,175,55,0.25)]'
        }`}
      >
        {/* Soft Golden Icon */}
        <div
          className={`w-16 h-16 mx-auto rounded-full border-2 flex items-center justify-center shadow-md transition-colors ${
            isDark
              ? 'bg-[#221f14] border-[#d4af37] text-[#facc15]'
              : 'bg-amber-50 border-[#d4af37] text-amber-600'
          }`}
        >
          <Heart className="w-8 h-8 fill-current animate-pulse" />
        </div>

        {/* The Quranic Verse Section */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border border-[#d4af37]/40 bg-amber-500/10 text-amber-600 dark:text-amber-300">
            <span>رسالة روحانية</span>
          </div>

          <h2
            className={`text-2xl sm:text-3xl font-black leading-relaxed tracking-wide py-1 transition-colors ${
              isDark ? 'text-[#facc15] drop-shadow-[0_2px_10px_rgba(250,204,21,0.3)]' : 'text-[#854d0e]'
            }`}
            style={{ fontFamily: "'Traditional Arabic', 'Amiri', 'Scheherazade New', serif" }}
          >
            ﴿ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ ﴾
          </h2>

          <p
            className={`text-xs sm:text-sm font-bold tracking-wide transition-colors ${
              isDark ? 'text-amber-200/90' : 'text-stone-600'
            }`}
          >
            [سورة الرعد: الآية 28]
          </p>
        </div>

        {/* Subtitle / Meaning Description with maximum clarity */}
        <p
          className={`text-sm sm:text-base font-bold leading-relaxed max-w-xs mx-auto transition-colors ${
            isDark ? 'text-stone-100' : 'text-stone-800'
          }`}
        >
          طُمأنينة لقلبك، وسكينة لروحك، ونورٌ ساطع يبارك يومك بذكر الله عز وجل.
        </p>

        {/* Progress Bar & Dismiss Hint */}
        <div className="pt-2 space-y-2.5">
          <div
            className={`w-full h-2 rounded-full overflow-hidden border ${
              isDark ? 'bg-stone-800 border-[#d4af37]/40' : 'bg-stone-100 border-amber-300'
            }`}
          >
            <div
              className="h-full bg-gradient-to-r from-[#c5a059] via-[#d4af37] to-[#facc15] transition-all duration-75 rounded-full shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p
            className={`text-xs font-medium transition-colors ${
              isDark ? 'text-stone-300 hover:text-white' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            اضغط في أي مكان لتخطي الشاشة والدخول المباشر
          </p>
        </div>
      </div>
    </div>
  );
};
