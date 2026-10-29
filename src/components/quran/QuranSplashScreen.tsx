import React, { useEffect, useState } from 'react';
import { BookOpen, ChevronLeft } from 'lucide-react';

interface Props {
  onContinue: () => void;
  isDark?: boolean;
}

export const QuranSplashScreen: React.FC<Props> = ({ onContinue, isDark = true }) => {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Auto-advance after 2.6 seconds if user doesn't tap earlier
    const timer = setTimeout(() => {
      handleDismiss();
    }, 2600);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    if (fadingOut) return;
    setFadingOut(true);
    setTimeout(() => {
      onContinue();
    }, 280);
  };

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-50 flex flex-col justify-between items-center py-10 px-6 cursor-pointer select-none transition-opacity duration-300 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } ${
        isDark
          ? 'bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] text-white'
          : 'bg-[#faf8f5] text-stone-900'
      }`}
      style={{
        backgroundImage: isDark
          ? 'radial-gradient(ellipse at 50% 35%, rgba(212, 175, 55, 0.12) 0%, transparent 70%)'
          : 'radial-gradient(ellipse at 50% 35%, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
      }}
    >
      {/* 1. Top Verse Calligraphy Section matching image_13.png */}
      <div className="pt-6 sm:pt-10 text-center space-y-2 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 mb-2">
          <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
          <span className="text-[11px] font-bold text-[#d4af37]">كتاب الله العزيز</span>
        </div>

        {/* Verse text in Quranic calligraphic typography */}
        <p
          className={`font-quran text-lg sm:text-2xl leading-relaxed max-w-sm sm:max-w-md mx-auto ${
            isDark ? 'text-[#f5e6b8]' : 'text-[#8c6b2d]'
          }`}
          style={{ fontFamily: "'Amiri Quran', 'Amiri', 'Traditional Arabic', serif" }}
        >
          {`﴿ إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ ﴾`}
        </p>
        <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-[#a39e93]' : 'text-stone-500'}`}>
          (الإسراء: 9)
        </p>
      </div>

      {/* 2. Center Ornate Arabesque Medallion matching image_13.png */}
      <div className="relative my-auto flex flex-col items-center justify-center animate-in zoom-in-95 duration-800">
        {/* Ambient Golden Halo Glow */}
        <div className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-[#d4af37]/15 blur-3xl pointer-events-none" />

        {/* Traditional Islamic Arabesque Medallion SVG with Deep Blue/Gold Calligraphy */}
        <svg
          viewBox="0 0 320 400"
          className="w-64 h-80 sm:w-72 sm:h-96 drop-shadow-[0_12px_24px_rgba(212,175,55,0.25)] transition-transform duration-500 hover:scale-[1.02]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldGradSplash" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f7e096" />
              <stop offset="25%" stopColor="#d4af37" />
              <stop offset="60%" stopColor="#aa7c11" />
              <stop offset="85%" stopColor="#f3e5ab" />
              <stop offset="100%" stopColor="#aa7c11" />
            </linearGradient>

            <linearGradient id="blueGradSplash" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <filter id="goldShine" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#d4af37" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Top Decorative Finial (قمة الزخرفة العلوية) */}
          <path
            d="M 160 20 L 163 32 C 168 35 174 42 169 50 C 165 57 160 62 160 68 C 160 62 155 57 151 50 C 146 42 152 35 157 32 Z"
            fill="url(#goldGradSplash)"
          />
          <circle cx="160" cy="18" r="4" fill="url(#goldGradSplash)" />
          <circle cx="160" cy="8" r="2.5" fill="#f7e096" />

          {/* Bottom Decorative Finial (قمة الزخرفة السفلية) */}
          <path
            d="M 160 380 L 163 368 C 168 365 174 358 169 350 C 165 343 160 338 160 332 C 160 338 155 343 151 350 C 146 358 152 365 157 368 Z"
            fill="url(#goldGradSplash)"
          />
          <circle cx="160" cy="382" r="4" fill="url(#goldGradSplash)" />
          <circle cx="160" cy="392" r="2.5" fill="#f7e096" />

          {/* Outer Arabesque Floral Crown Shell (الإطار المزخرف الخارجي) */}
          <path
            d="M 160 55 C 220 55 270 110 270 200 C 270 290 220 345 160 345 C 100 345 50 290 50 200 C 50 110 100 55 160 55 Z"
            fill={isDark ? '#141414' : '#fffef8'}
            stroke="url(#goldGradSplash)"
            strokeWidth="3.5"
            filter="url(#goldShine)"
          />

          {/* Inner Arabesque Leaf Pattern & Filigree */}
          <path
            d="M 160 65 C 210 65 258 115 258 200 C 258 285 210 335 160 335 C 110 335 62 285 62 200 C 62 115 110 65 160 65 Z"
            stroke="url(#goldGradSplash)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            fill="none"
          />

          {/* Arabesque Flourish Petals */}
          <g stroke="url(#goldGradSplash)" strokeWidth="1.8" fill="none">
            {/* Top Arcs */}
            <path d="M 160 70 Q 185 95 160 120 Q 135 95 160 70" fill="rgba(212,175,55,0.15)" />
            <path d="M 160 280 Q 185 305 160 330 Q 135 305 160 280" fill="rgba(212,175,55,0.15)" />
            {/* Left / Right Side Tendrils */}
            <path d="M 75 200 Q 105 170 120 200 Q 105 230 75 200" fill="rgba(212,175,55,0.12)" />
            <path d="M 245 200 Q 215 170 200 200 Q 215 230 245 200" fill="rgba(212,175,55,0.12)" />
            {/* Corner Filigree Leaves */}
            <path d="M 100 120 C 130 110 140 130 150 140" />
            <path d="M 220 120 C 190 110 180 130 170 140" />
            <path d="M 100 280 C 130 290 140 270 150 260" />
            <path d="M 220 280 C 190 290 180 270 170 260" />
          </g>

          {/* Central Circular Dial Frame */}
          <circle
            cx="160"
            cy="200"
            r="68"
            fill={isDark ? '#0f141d' : '#fcfbf7'}
            stroke="#c2410c"
            strokeWidth="2"
          />
          <circle
            cx="160"
            cy="200"
            r="64"
            stroke="url(#goldGradSplash)"
            strokeWidth="2.5"
            fill="none"
          />

          {/* Royal Blue / Lapis Center Backdrop */}
          <circle cx="160" cy="200" r="59" fill={isDark ? '#0d1829' : '#fefdfa'} />

          {/* Ornate Arabic Thuluth Calligraphy: "القرآن الكريم" */}
          <g transform="translate(160, 200) scale(0.92) translate(-160, -200)">
            {/* Artistic stylized Arabic Calligraphy lines */}
            {/* Alif-Lam letters */}
            <path
              d="M 132 160 L 132 230 M 140 155 L 140 235 M 172 155 L 172 235 M 180 160 L 180 230"
              stroke={isDark ? '#f7e096' : '#1e3a8a'}
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            {/* Qaf and Ra loop */}
            <path
              d="M 125 210 C 125 195 145 190 152 205 C 158 220 175 225 188 215 C 195 208 200 200 198 185"
              stroke={isDark ? '#f7e096' : '#1e3a8a'}
              strokeWidth="3.4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Al-Kareem loop and Ye-Meem swoosh */}
            <path
              d="M 120 185 C 135 175 165 175 195 185 M 130 225 C 150 240 175 240 195 225"
              stroke={isDark ? '#d4af37' : '#1e3a8a'}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* Decorative dots / tashkeel */}
            <circle cx="145" cy="180" r="2.5" fill={isDark ? '#f7e096' : '#1e3a8a'} />
            <circle cx="151" cy="177" r="2.5" fill={isDark ? '#f7e096' : '#1e3a8a'} />
            <circle cx="168" cy="225" r="2.2" fill={isDark ? '#f7e096' : '#1e3a8a'} />
            <circle cx="174" cy="227" r="2.2" fill={isDark ? '#f7e096' : '#1e3a8a'} />
            {/* Center Arabic Text Fallback for Perfect Legibility */}
            <text
              x="160"
              y="206"
              textAnchor="middle"
              fill={isDark ? '#ffffff' : '#1e3a8a'}
              fontSize="20"
              fontWeight="bold"
              fontFamily="'Amiri', 'Traditional Arabic', serif"
              style={{ letterSpacing: '0.5px' }}
            >
              الْقُرْآنُ الْكَرِيمُ
            </text>
          </g>
        </svg>

        {/* 3. Text Title Below Medallion matching image_13.png */}
        <div className="mt-4 text-center space-y-1">
          <h1
            className={`text-2xl sm:text-3xl font-extrabold tracking-wide ${
              isDark ? 'text-[#f5e6b8]' : 'text-[#8c6b2d]'
            }`}
            style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
          >
            الْقُرْآنُ الْكَرِيمُ
          </h1>
          <p className={`text-xs sm:text-sm font-semibold tracking-wider ${isDark ? 'text-[#a39e93]' : 'text-stone-500'}`}>
            مع تفسير
          </p>
        </div>
      </div>

      {/* 4. Bottom Hint & Tap to Proceed */}
      <div className="pb-2 text-center space-y-3 animate-in fade-in duration-1000">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#d4af37] text-stone-950 font-bold text-xs shadow-md hover:bg-[#c5a059] active:scale-95 transition"
        >
          <span>تصفح المصحف الشريف</span>
          <ChevronLeft className="w-4 h-4" />
        </button>

        <p className={`text-[10px] ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
          اضغط في أي مكان للمتابعة فوراً
        </p>

        {/* Native phone home indicator line */}
        <div className={`w-32 h-1 rounded-full mx-auto ${isDark ? 'bg-stone-800' : 'bg-stone-300'}`} />
      </div>
    </div>
  );
};
