import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface Props {
  onDismiss: () => void;
  durationMs?: number;
}

export const AthkarSpiritualSplash: React.FC<Props> = ({ onDismiss, durationMs = 2100 }) => {
  const [progress, setProgress] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

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
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-b from-[#0a0a0a]/95 via-[#141414]/90 to-[#0a0a0a]/95 backdrop-blur-md cursor-pointer select-none transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#d4af37]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#c5a059]/10 blur-3xl pointer-events-none" />

      {/* Decorative Islamic geometric vignette */}
      <div className="relative max-w-sm w-full rounded-3xl p-6 sm:p-8 text-center text-white space-y-6 border border-[#d4af37]/30 shadow-2xl bg-[#141414]/90 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500">
        {/* Soft Golden Icon */}
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-[#d4af37]/20 via-[#c5a059]/30 to-[#d4af37]/40 border border-[#d4af37]/50 flex items-center justify-center shadow-lg shadow-black/50">
          <Heart className="w-8 h-8 text-[#d4af37] fill-[#d4af37]/30 animate-pulse" />
        </div>

        {/* The Quranic Verse */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-[#d4af37] text-xs font-semibold">
            <span>رسالة روحانية</span>
          </div>

          <h2
            className="text-2xl sm:text-3xl font-extrabold text-[#d4af37] leading-relaxed tracking-wide drop-shadow-md py-1"
            style={{ fontFamily: "'Traditional Arabic', 'Amiri', 'Scheherazade New', serif" }}
          >
            ﴿ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ ﴾
          </h2>

          <p className="text-xs text-[#a39e93] font-medium">
            [سورة الرعد: الآية 28]
          </p>
        </div>

        {/* Subtitle */}
        <p className="text-xs text-stone-300/90 leading-relaxed max-w-xs mx-auto">
          طُمأنينة لقلبك، وسكينة لروحك، ونورٌ ساطع يبارك يومك بذكر الله عز وجل.
        </p>

        {/* 2-second Progress Bar & Tap affordance */}
        <div className="pt-2 space-y-2">
          <div className="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden border border-[#d4af37]/30">
            <div
              className="h-full bg-gradient-to-r from-[#c5a059] via-[#d4af37] to-[#e5c96b] transition-all duration-75 rounded-full shadow-sm shadow-[#d4af37]/50"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="text-[11px] text-stone-400 hover:text-stone-200 transition">
            اضغط في أي مكان لتخطي الشاشة والدخول المباشر
          </div>
        </div>
      </div>
    </div>
  );
};
