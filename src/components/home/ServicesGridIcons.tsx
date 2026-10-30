import React from 'react';

interface IconProps {
  className?: string;
}

// 1. طاعاتك: Soft golden arch, glowing prayer star, checklist checkmark with amber radiant rays
export const SunanServiceIcon: React.FC<IconProps> = ({ className = 'w-9 h-9 sm:w-10 sm:h-10' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="80" height="80" rx="20" fill="#fef9c3" />
    <path d="M16 68V36C16 22 28 14 40 14C52 14 64 22 64 36V68H16Z" fill="#fef08a" opacity="0.8" />
    <circle cx="40" cy="38" r="14" fill="#facc15" />
    {/* Glowing golden star */}
    <path
      d="M40 26L43.5 33.5L52 34.5L45.5 40.5L47.5 49L40 44.5L32.5 49L34.5 40.5L28 34.5L36.5 33.5L40 26Z"
      fill="#b45309"
    />
    {/* Green checkmark pill */}
    <rect x="22" y="55" width="36" height="12" rx="6" fill="#16a34a" />
    <path d="M34 61L38 65L46 57" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 2. الأذكار: Sacred remembrance book with radiant amber and emerald light
export const AthkarServiceIcon: React.FC<IconProps> = ({ className = 'w-9 h-9 sm:w-10 sm:h-10' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="80" height="80" rx="20" fill="#ecfdf5" />
    <path d="M16 68V36C16 22 28 14 40 14C52 14 64 22 64 36V68H16Z" fill="#a7f3d0" opacity="0.7" />
    {/* Open Book */}
    <path
      d="M18 30C25 27 32 28 40 32C48 28 55 27 62 30V56C55 53 48 54 40 58C32 54 25 53 18 56V30Z"
      fill="#059669"
    />
    <path
      d="M20 32C26 29 33 30 40 34C47 30 54 29 60 32V54C54 51 47 52 40 56C33 52 26 51 20 54V32Z"
      fill="#ffffff"
    />
    <line x1="40" y1="34" x2="40" y2="56" stroke="#059669" strokeWidth="2" />
    {/* Book Ribbon */}
    <path d="M40 34V64L37 61L34 64V40" fill="#d97706" />
    {/* Sparkles */}
    <circle cx="26" cy="24" r="2.5" fill="#f59e0b" />
    <circle cx="54" cy="22" r="2" fill="#f59e0b" />
  </svg>
);

// 3. رحلة الختمة: Holy Quran on wooden engraved stand (Rihal) with bookmark
export const KhatmaServiceIcon: React.FC<IconProps> = ({ className = 'w-9 h-9 sm:w-10 sm:h-10' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="80" height="80" rx="20" fill="#f0fdf4" />
    <path d="M16 68V36C16 22 28 14 40 14C52 14 64 22 64 36V68H16Z" fill="#bbf7d0" opacity="0.6" />
    {/* Crossed Wooden Rihal (Stand) */}
    <path d="M22 68L58 48M58 68L22 48" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
    {/* Open Quran Pages on Stand */}
    <path
      d="M20 36C27 33 34 35 40 38C46 35 53 33 60 36V52C53 49 46 51 40 54C34 51 27 49 20 52V36Z"
      fill="#15803d"
    />
    <path
      d="M22 38C28 35 34 37 40 40C46 37 52 35 58 38V50C52 47 46 49 40 52C34 49 28 47 22 50V38Z"
      fill="#fefce8"
    />
    <line x1="40" y1="40" x2="40" y2="52" stroke="#15803d" strokeWidth="2" />
    {/* Golden Bookmark */}
    <path d="M40 40V62L43 59L46 62V46" fill="#eab308" />
  </svg>
);

// 4. المصحف الشريف: Deep emerald and gold Quran cover with ornate medallion
export const QuranServiceIcon: React.FC<IconProps> = ({ className = 'w-9 h-9 sm:w-10 sm:h-10' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="80" height="80" rx="20" fill="#fef3c7" />
    <path d="M16 68V36C16 22 28 14 40 14C52 14 64 22 64 36V68H16Z" fill="#fde68a" opacity="0.7" />
    {/* Book Cover */}
    <rect x="22" y="20" width="36" height="46" rx="4" fill="#065f46" stroke="#ca8a04" strokeWidth="2.5" />
    {/* Inner Ornate Gold Border */}
    <rect x="26" y="24" width="28" height="38" rx="2" stroke="#eab308" strokeWidth="1.5" fill="#047857" />
    {/* Center Medallion */}
    <circle cx="40" cy="43" r="8" fill="#ca8a04" />
    <circle cx="40" cy="43" r="6" fill="#fef08a" />
    <circle cx="40" cy="43" r="3" fill="#ca8a04" />
    {/* Book Spine Ribs */}
    <line x1="22" y1="28" x2="25" y2="28" stroke="#ca8a04" strokeWidth="2" />
    <line x1="22" y1="58" x2="25" y2="58" stroke="#ca8a04" strokeWidth="2" />
  </svg>
);

// 5. رمضان: Nocturnal sky with glowing traditional lantern (Fanous) and crescent
export const RamadanServiceIcon: React.FC<IconProps> = ({ className = 'w-9 h-9 sm:w-10 sm:h-10' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="80" height="80" rx="20" fill="#f3e8ff" />
    <path d="M16 68V36C16 22 28 14 40 14C52 14 64 22 64 36V68H16Z" fill="#3b0764" />
    {/* Crescent Moon */}
    <path
      d="M58 24C50 24 44 31 46 39C47 46 53 51 60 50C54 50 49 44 50 38C51 32 55 27 58 24Z"
      fill="#facc15"
    />
    {/* Hanging Cord */}
    <line x1="34" y1="14" x2="34" y2="28" stroke="#ca8a04" strokeWidth="1.5" />
    {/* Fanous (Lantern) */}
    <path d="M30 28H38L42 34H26L30 28Z" fill="#d97706" />
    <rect x="27" y="34" width="14" height="18" rx="2" fill="#fef08a" stroke="#d97706" strokeWidth="1.5" />
    {/* Flame */}
    <circle cx="34" cy="43" r="3" fill="#f97316" />
    <path d="M26 52H42L38 58H30L26 52Z" fill="#b45309" />
    {/* Base Ring */}
    <circle cx="34" cy="60" r="2" fill="#d97706" />
  </svg>
);

// 6. محطات إسلامية: Majestic Islamic Mosque Dome with Minaret in golden sand tones
export const HistoryServiceIcon: React.FC<IconProps> = ({ className = 'w-9 h-9 sm:w-10 sm:h-10' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="80" height="80" rx="20" fill="#fff7ed" />
    <path d="M16 68V36C16 22 28 14 40 14C52 14 64 22 64 36V68H16Z" fill="#fed7aa" opacity="0.6" />
    {/* Mosque Base */}
    <rect x="22" y="48" width="36" height="20" fill="#ea580c" opacity="0.85" rx="2" />
    <path d="M34 68V56C34 53 37 51 40 51C43 51 46 53 46 56V68H34Z" fill="#431407" />
    {/* Central Dome */}
    <path d="M24 48C24 35 32 28 40 24C48 28 56 35 56 48H24Z" fill="#c2410c" />
    {/* Minaret */}
    <rect x="58" y="28" width="6" height="40" fill="#9a3412" rx="1" />
    <polygon points="61,18 58,28 64,28" fill="#c2410c" />
    <circle cx="61" cy="17" r="1.5" fill="#facc15" />
    {/* Crescent Finial on Dome */}
    <circle cx="40" cy="22" r="2" fill="#facc15" />
  </svg>
);

// 7. أسماء الله الحسنى: Radiant divine golden medallion with shining rays
export const AllahNamesServiceIcon: React.FC<IconProps> = ({ className = 'w-9 h-9 sm:w-10 sm:h-10' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="80" height="80" rx="20" fill="#fefce8" />
    <path d="M16 68V36C16 22 28 14 40 14C52 14 64 22 64 36V68H16Z" fill="#fef08a" opacity="0.7" />
    {/* 8-Pointed Star Medallion */}
    <rect x="26" y="26" width="28" height="28" rx="4" fill="#ca8a04" />
    <rect x="26" y="26" width="28" height="28" rx="4" fill="#eab308" transform="rotate(45 40 40)" />
    {/* Inner Circle */}
    <circle cx="40" cy="40" r="13" fill="#854d0e" />
    <circle cx="40" cy="40" r="10" fill="#fef08a" />
    {/* Stylized Allah Calligraphy Center */}
    <path
      d="M36 44V36M40 44V34M44 44V36C44 34 45.5 34 46 36V44"
      stroke="#854d0e"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// 8. حاسبة الزكاة: Shiny golden coins stack with emerald growth sprout
export const ZakatServiceIcon: React.FC<IconProps> = ({ className = 'w-9 h-9 sm:w-10 sm:h-10' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="80" height="80" rx="20" fill="#f0fdf4" />
    <path d="M16 68V36C16 22 28 14 40 14C52 14 64 22 64 36V68H16Z" fill="#bbf7d0" opacity="0.6" />
    {/* Gold Coins Stack */}
    <ellipse cx="40" cy="58" rx="16" ry="6" fill="#ca8a04" />
    <ellipse cx="40" cy="54" rx="16" ry="6" fill="#eab308" />
    <ellipse cx="40" cy="50" rx="16" ry="6" fill="#facc15" />
    <ellipse cx="40" cy="46" rx="14" ry="5" fill="#fde047" />
    {/* Sprout emerging from wealth */}
    <path d="M40 46V28" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
    <path d="M40 34C45 30 52 32 52 36C46 37 42 36 40 34Z" fill="#16a34a" />
    <path d="M40 30C35 26 28 28 28 32C34 33 38 32 40 30Z" fill="#22c55e" />
  </svg>
);

// 9. الدعاء: Hands raised in sincere supplication under a serene sky
export const DuaServiceIcon: React.FC<IconProps> = ({ className = 'w-9 h-9 sm:w-10 sm:h-10' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="80" height="80" rx="20" fill="#f0fdfa" />
    <path d="M16 68V36C16 22 28 14 40 14C52 14 64 22 64 36V68H16Z" fill="#99f6e4" opacity="0.6" />
    {/* Glowing Light Beam */}
    <polygon points="40,16 32,45 48,45" fill="#fef08a" opacity="0.5" />
    {/* Left Supplicating Hand */}
    <path
      d="M36 60C36 60 26 58 26 48C26 44 28 40 31 38C33 36 36 38 36 42V56"
      stroke="#0f766e"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Right Supplicating Hand */}
    <path
      d="M44 60C44 60 54 58 54 48C54 44 52 40 49 38C47 36 44 38 44 42V56"
      stroke="#0f766e"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="40" cy="28" r="3" fill="#f59e0b" />
  </svg>
);

// 10. اتجاه القبلة: The Holy Kaaba with directional gold compass indicator
export const QiblaServiceIcon: React.FC<IconProps> = ({ className = 'w-9 h-9 sm:w-10 sm:h-10' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="80" height="80" rx="20" fill="#f5f5f4" />
    <circle cx="40" cy="40" r="28" fill="#e7e5e4" opacity="0.7" />
    {/* Compass Ring */}
    <circle cx="40" cy="40" r="26" stroke="#ca8a04" strokeWidth="2" strokeDasharray="3 3" />
    {/* The Holy Kaaba */}
    <rect x="28" y="28" width="24" height="24" rx="3" fill="#1c1917" stroke="#ca8a04" strokeWidth="1.5" />
    {/* Golden Kiswah Band */}
    <line x1="28" y1="35" x2="52" y2="35" stroke="#facc15" strokeWidth="3" />
    <rect x="36" y="42" width="6" height="10" fill="#ca8a04" rx="1" />
    {/* Directional Compass Needle */}
    <polygon points="40,12 43,24 40,22 37,24" fill="#dc2626" />
    <polygon points="40,68 43,56 40,58 37,56" fill="#78716c" />
  </svg>
);

// 11. راجع صلاتك: Faithful worshipper in sujud on prayer mat with mihrab glow
export const ReviewPrayerServiceIcon: React.FC<IconProps> = ({ className = 'w-9 h-9 sm:w-10 sm:h-10' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="80" height="80" rx="20" fill="#f0fdf4" />
    <path d="M16 68V36C16 22 28 14 40 14C52 14 64 22 64 36V68H16Z" fill="#86efac" opacity="0.5" />
    {/* Prayer Rug */}
    <rect x="18" y="60" width="44" height="6" rx="2" fill="#15803d" />
    <line x1="22" y1="60" x2="22" y2="66" stroke="#facc15" strokeWidth="1.5" />
    {/* Worshipper in Sujud */}
    <circle cx="28" cy="54" r="4.5" fill="#ca8a04" />
    <path
      d="M28 54L35 56L44 48L52 54L55 60"
      stroke="#166534"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Divine Noor above */}
    <circle cx="40" cy="24" r="3" fill="#facc15" />
    <line x1="40" y1="29" x2="40" y2="34" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 12. الأجر بالنشر: Soft coral/rose arch with radiating messenger blessing
export const ShareRewardServiceIcon: React.FC<IconProps> = ({ className = 'w-9 h-9 sm:w-10 sm:h-10' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="80" height="80" rx="20" fill="#fff1f2" />
    <path d="M16 68V36C16 22 28 14 40 14C52 14 64 22 64 36V68H16Z" fill="#fecdd3" opacity="0.7" />
    {/* Heart Envelope */}
    <rect x="22" y="32" width="36" height="26" rx="4" fill="#e11d48" />
    <polygon points="22,32 40,46 58,32" fill="#fda4af" />
    {/* Radiant Star / Heart */}
    <circle cx="40" cy="24" r="7" fill="#f43f5e" />
    <path
      d="M40 28C40 28 36 24 36 22C36 20 37.5 19 39 20C40 21 40 21 40 21C40 21 40 21 41 20C42.5 19 44 20 44 22C44 24 40 28 40 28Z"
      fill="#ffffff"
    />
    <circle cx="28" cy="20" r="2" fill="#fb7185" />
    <circle cx="52" cy="20" r="2" fill="#fb7185" />
  </svg>
);

// 13. التقويم والمناسبات: Elegant Hijri calendar leaf with crescent badge
export const CalendarServiceIcon: React.FC<IconProps> = ({ className = 'w-9 h-9 sm:w-10 sm:h-10' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="80" height="80" rx="20" fill="#fafaf9" />
    <path d="M16 68V36C16 22 28 14 40 14C52 14 64 22 64 36V68H16Z" fill="#e7e5e4" opacity="0.6" />
    {/* Calendar Page */}
    <rect x="20" y="24" width="40" height="42" rx="6" fill="#ffffff" stroke="#d6d3d1" strokeWidth="2" />
    {/* Red / Gold Top Header */}
    <rect x="20" y="24" width="40" height="12" rx="6" fill="#b91c1c" />
    {/* Binder Rings */}
    <rect x="28" y="20" width="4" height="8" rx="2" fill="#78716c" />
    <rect x="48" y="20" width="4" height="8" rx="2" fill="#78716c" />
    {/* Date Crescent */}
    <path
      d="M43 44C38 44 34 48 35 53C36 57 40 60 44 59C40 59 37 55 38 51C39 47 41 45 43 44Z"
      fill="#ca8a04"
    />
    <circle cx="44" cy="46" r="1.5" fill="#ca8a04" />
  </svg>
);

// 14. ١٠٠ حديث شريف: Prophetic Green Dome with an open golden parchment scroll
export const HadithServiceIcon: React.FC<IconProps> = ({ className = 'w-9 h-9 sm:w-10 sm:h-10' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="80" height="80" rx="20" fill="#f0fdf4" />
    <path d="M16 68V36C16 22 28 14 40 14C52 14 64 22 64 36V68H16Z" fill="#86efac" opacity="0.6" />
    {/* Prophetic Green Dome */}
    <path d="M26 48C26 34 33 26 40 22C47 26 54 34 54 48H26Z" fill="#15803d" />
    <circle cx="40" cy="20" r="2.5" fill="#facc15" />
    {/* Hadith Scroll Banner */}
    <rect x="20" y="50" width="40" height="16" rx="4" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
    <line x1="26" y1="55" x2="54" y2="55" stroke="#854d0e" strokeWidth="2" strokeLinecap="round" />
    <line x1="26" y1="60" x2="48" y2="60" stroke="#854d0e" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 15. المسابقة: Golden trophy of Islamic knowledge with crescent and stars
export const QuizServiceIcon: React.FC<IconProps> = ({ className = 'w-9 h-9 sm:w-10 sm:h-10' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="80" height="80" rx="20" fill="#fefce8" />
    <path d="M16 68V36C16 22 28 14 40 14C52 14 64 22 64 36V68H16Z" fill="#fef08a" opacity="0.65" />
    {/* Golden Trophy Cup */}
    <path
      d="M26 24H54V40C54 48 48 54 40 54C32 54 26 48 26 40V24Z"
      fill="#ca8a04"
      stroke="#a16207"
      strokeWidth="2"
    />
    <path
      d="M29 27H51V39C51 45 46 50 40 50C34 50 29 45 29 39V27Z"
      fill="#facc15"
    />
    {/* Trophy Handles */}
    <path
      d="M26 28C20 28 18 35 22 42C24 45 26 44 26 44"
      stroke="#ca8a04"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path
      d="M54 28C60 28 62 35 58 42C56 45 54 44 54 44"
      stroke="#ca8a04"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    {/* Stem & Base */}
    <rect x="36" y="54" width="8" height="8" fill="#ca8a04" />
    <rect x="28" y="62" width="24" height="6" rx="2" fill="#854d0e" />
    {/* Star inside Cup */}
    <circle cx="40" cy="38" r="4.5" fill="#ca8a04" />
    <polygon
      points="40,32 41.5,36 45,36.5 42.5,39 43.5,43 40,41 36.5,43 37.5,39 35,36.5 38.5,36"
      fill="#fef08a"
    />
  </svg>
);

// 16. الإعدادات والمزيد: Master-crafted Islamic 8-point geometric gear
export const SettingsServiceIcon: React.FC<IconProps> = ({ className = 'w-9 h-9 sm:w-10 sm:h-10' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="80" height="80" rx="20" fill="#f8fafc" />
    <path d="M16 68V36C16 22 28 14 40 14C52 14 64 22 64 36V68H16Z" fill="#cbd5e1" opacity="0.6" />
    {/* Concentric Islamic Arabesque Star */}
    <rect x="26" y="26" width="28" height="28" rx="4" fill="#475569" />
    <rect x="26" y="26" width="28" height="28" rx="4" fill="#64748b" transform="rotate(45 40 40)" />
    {/* Inner Rim */}
    <circle cx="40" cy="40" r="11" fill="#ca8a04" />
    <circle cx="40" cy="40" r="8" fill="#f8fafc" />
    <circle cx="40" cy="40" r="4" fill="#ca8a04" />
  </svg>
);
