import React from 'react';

interface IconProps {
  className?: string;
}

// 1. أذكار الصباح: Rising warm golden sun with radiating sunbeams and light morning clouds over soft arch
export const MorningAthkarIcon: React.FC<IconProps> = ({ className = 'w-16 h-16 sm:w-20 sm:h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft sky arch background */}
    <path d="M15 88V45C15 25 30 14 50 14C70 14 85 25 85 45V88H15Z" fill="#fef9c3" opacity="0.65" />
    <path d="M38 18C44 14 56 14 62 18" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
    {/* Ambient soft clouds */}
    <ellipse cx="25" cy="38" rx="8" ry="3.5" fill="#bae6fd" opacity="0.8" />
    <ellipse cx="80" cy="30" rx="7" ry="3" fill="#bae6fd" opacity="0.8" />
    {/* Sunbeams */}
    <line x1="50" y1="28" x2="50" y2="20" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
    <line x1="33" y1="36" x2="26" y2="30" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
    <line x1="67" y1="36" x2="74" y2="30" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
    <line x1="22" y1="52" x2="14" y2="50" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
    <line x1="78" y1="52" x2="86" y2="50" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
    {/* Brilliant Sun Disc */}
    <circle cx="50" cy="55" r="22" fill="#facc15" />
    {/* Soft morning clouds at sun base */}
    <ellipse cx="40" cy="72" rx="14" ry="8" fill="#93c5fd" />
    <ellipse cx="58" cy="70" rx="16" ry="9" fill="#818cf8" opacity="0.85" />
    <ellipse cx="50" cy="74" rx="26" ry="6" fill="#bfdbfe" />
    {/* Baseline */}
    <line x1="12" y1="88" x2="88" y2="88" stroke="#cbd5e1" strokeWidth="1.5" />
  </svg>
);

// 2. أذكار المساء: Deep violet/night arch, glowing golden crescent moon, star, and soft night clouds
export const EveningAthkarIcon: React.FC<IconProps> = ({ className = 'w-16 h-16 sm:w-20 sm:h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Night arch in deep indigo/violet */}
    <path
      d="M15 88V45C15 25 30 14 50 14C70 14 85 25 85 45V88H15Z"
      fill="#2e1065"
    />
    <path d="M40 18C45 15 55 15 60 18" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
    {/* Distant soft night clouds */}
    <ellipse cx="25" cy="35" rx="7" ry="3" fill="#67e8f9" opacity="0.5" />
    <ellipse cx="78" cy="28" rx="6" ry="2.5" fill="#67e8f9" opacity="0.5" />
    {/* Golden Crescent Moon */}
    <path
      d="M54 38C44 38 36 47 38 58C39 67 47 75 58 74C65 73 71 69 74 62C65 65 54 62 49 54C46 48 48 42 54 38Z"
      fill="#facc15"
    />
    {/* Night Star */}
    <path
      d="M66 43L67.5 47L71.5 48.5L67.5 50L66 54L64.5 50L60.5 48.5L64.5 47L66 43Z"
      fill="#fef08a"
    />
    {/* Night cloud under crescent */}
    <ellipse cx="44" cy="74" rx="14" ry="6" fill="#67e8f9" opacity="0.85" />
    <ellipse cx="56" cy="72" rx="12" ry="5" fill="#a5f3fc" />
    {/* Baseline */}
    <line x1="12" y1="88" x2="88" y2="88" stroke="#cbd5e1" strokeWidth="1.5" />
  </svg>
);

// 3. أذكار النوم: Bed with wooden headboard, cozy orange blanket, pillow and full glowing moon in arch
export const SleepAthkarIcon: React.FC<IconProps> = ({ className = 'w-16 h-16 sm:w-20 sm:h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft gray/slate arch backdrop */}
    <path d="M15 88V45C15 25 30 14 50 14C70 14 85 25 85 45V88H15Z" fill="#e2e8f0" opacity="0.75" />
    {/* Distant soft clouds */}
    <ellipse cx="28" cy="30" rx="6" ry="2.5" fill="#cbd5e1" />
    <ellipse cx="76" cy="32" rx="7" ry="3" fill="#cbd5e1" />
    {/* Full glowing silver moon */}
    <circle cx="50" cy="40" r="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
    <circle cx="46" cy="37" r="2.5" fill="#e2e8f0" opacity="0.6" />
    <circle cx="53" cy="43" r="3" fill="#e2e8f0" opacity="0.6" />
    {/* Wooden Bed Structure */}
    <rect x="20" y="55" width="6" height="30" rx="1.5" fill="#78350f" />
    <rect x="80" y="65" width="5" height="20" rx="1.5" fill="#78350f" />
    <rect x="23" y="70" width="60" height="6" fill="#92400e" />
    {/* White Pillow */}
    <rect x="27" y="62" width="16" height="8" rx="3" fill="#ffffff" stroke="#e2e8f0" />
    {/* Orange Cozy Blanket */}
    <rect x="40" y="64" width="42" height="12" rx="2" fill="#ea580c" />
    <path d="M40 64C40 64 45 61 50 64C55 67 60 63 65 64H82V76H40V64Z" fill="#f97316" />
    {/* Baseline */}
    <line x1="12" y1="88" x2="88" y2="88" stroke="#cbd5e1" strokeWidth="1.5" />
  </svg>
);

// 4. أذكار الاستيقاظ: Cheerful person sitting in bed stretching both arms in the morning light
export const WakingAthkarIcon: React.FC<IconProps> = ({ className = 'w-16 h-16 sm:w-20 sm:h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Morning light arch */}
    <path d="M15 88V45C15 25 30 14 50 14C70 14 85 25 85 45V88H15Z" fill="#f0f9ff" opacity="0.8" />
    {/* Gentle clouds */}
    <ellipse cx="25" cy="32" rx="7" ry="3" fill="#bae6fd" />
    <ellipse cx="78" cy="35" rx="6" ry="2.5" fill="#bae6fd" />
    {/* Wooden Bench / Bed base */}
    <rect x="24" y="72" width="54" height="8" rx="2" fill="#b45309" />
    <rect x="30" y="80" width="5" height="8" fill="#78350f" />
    <rect x="71" y="80" width="5" height="8" fill="#78350f" />
    {/* Cheerful waking person */}
    {/* Head */}
    <circle cx="51" cy="35" r="7" fill="#ea580c" />
    {/* Torso */}
    <rect x="46" y="44" width="10" height="24" rx="2" fill="#0f172a" />
    {/* Legs sitting */}
    <rect x="52" y="65" width="6" height="15" rx="1.5" fill="#0f172a" />
    {/* Left stretching arm up */}
    <line x1="46" y1="48" x2="33" y2="34" stroke="#ea580c" strokeWidth="4.5" strokeLinecap="round" />
    {/* Right stretching arm up */}
    <line x1="56" y1="48" x2="69" y2="34" stroke="#ea580c" strokeWidth="4.5" strokeLinecap="round" />
    {/* Baseline */}
    <line x1="12" y1="88" x2="88" y2="88" stroke="#cbd5e1" strokeWidth="1.5" />
  </svg>
);

// 5. أذكار بعد الصلاة: Worshipper with white thobe kneeling in prayer posture on prayer mat
export const AfterPrayerAthkarIcon: React.FC<IconProps> = ({ className = 'w-16 h-16 sm:w-20 sm:h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Sky-blue Mosque Arch backdrop */}
    <path d="M15 88V45C15 25 30 14 50 14C70 14 85 25 85 45V88H15Z" fill="#e0f2fe" opacity="0.8" />
    {/* Soft clouds */}
    <ellipse cx="24" cy="32" rx="7" ry="3" fill="#bae6fd" />
    <ellipse cx="78" cy="30" rx="7" ry="3" fill="#bae6fd" />
    {/* Prayer Rug on floor */}
    <rect x="26" y="80" width="50" height="5" rx="1.5" fill="#047857" />
    {/* Kneeling Worshipper */}
    {/* Head & Kufi Cap */}
    <circle cx="55" cy="36" r="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
    <path d="M51 38C51 43 56 46 60 43L59 38Z" fill="#b45309" />
    {/* Upper Body / Thobe */}
    <path d="M55 42L48 54L44 76L66 76L64 54L57 42Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
    {/* Folded Knees / Legs in Tashahhud */}
    <ellipse cx="55" cy="77" rx="15" ry="6" fill="#0f172a" />
    <path d="M44 65L48 76H64L62 65Z" fill="#f8fafc" />
    {/* Baseline */}
    <line x1="12" y1="88" x2="88" y2="88" stroke="#cbd5e1" strokeWidth="1.5" />
  </svg>
);

// 6. كنوز: Radiant, multi-faceted blue crystal diamond with light beam
export const KunuzAthkarIcon: React.FC<IconProps> = ({ className = 'w-16 h-16 sm:w-20 sm:h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft sky arch backdrop */}
    <path d="M15 88V45C15 25 30 14 50 14C70 14 85 25 85 45V88H15Z" fill="#e0f2fe" opacity="0.75" />
    {/* Shimmering beam from bottom */}
    <path d="M22 88L35 60H65L78 88H22Z" fill="#bae6fd" opacity="0.6" />
    {/* Faceted Brilliant Diamond */}
    {/* Top crown table */}
    <polygon points="36,44 64,44 76,55 50,55 24,55" fill="#38bdf8" />
    <polygon points="36,44 50,44 50,55 38,55" fill="#7dd3fc" />
    <polygon points="50,44 64,44 62,55 50,55" fill="#0284c7" />
    {/* Center diamond facets */}
    <polygon points="24,55 50,55 50,80" fill="#0ea5e9" />
    <polygon points="50,55 76,55 50,80" fill="#0369a1" />
    <polygon points="38,55 50,55 50,80" fill="#38bdf8" />
    {/* Top glint star */}
    <path d="M34 46L36 49L34 52L32 49Z" fill="#ffffff" />
    <circle cx="34" cy="49" r="1.5" fill="#ffffff" />
    {/* Baseline */}
    <line x1="12" y1="88" x2="88" y2="88" stroke="#cbd5e1" strokeWidth="1.5" />
  </svg>
);

// 7. تسبيح: Night arch with golden prayer beads (misbaha) hanging in a loop with tassel
export const TasbeehAthkarIcon: React.FC<IconProps> = ({ className = 'w-16 h-16 sm:w-20 sm:h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Deep purple/indigo mosque arch */}
    <path d="M15 88V45C15 25 30 14 50 14C70 14 85 25 85 45V88H15Z" fill="#2e1065" />
    {/* Top decorative arch accent */}
    <path d="M40 18C45 15 55 15 60 18" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
    {/* Golden Misbaha Beads in circular loop */}
    {/* Beads loop */}
    {[
      { cx: 50, cy: 32 },
      { cx: 43, cy: 34 },
      { cx: 57, cy: 34 },
      { cx: 37, cy: 39 },
      { cx: 63, cy: 39 },
      { cx: 34, cy: 46 },
      { cx: 66, cy: 46 },
      { cx: 34, cy: 53 },
      { cx: 66, cy: 53 },
      { cx: 37, cy: 60 },
      { cx: 63, cy: 60 },
      { cx: 43, cy: 64 },
      { cx: 57, cy: 64 },
      { cx: 50, cy: 66 },
    ].map((b, i) => (
      <circle key={i} cx={b.cx} cy={b.cy} r="3.2" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
    ))}
    {/* Minaret / Spacer bead */}
    <rect x="48.5" y="68" width="3" height="6" rx="1.5" fill="#eab308" />
    {/* Golden hanging tassel */}
    <path d="M50 74L46 84H54L50 74Z" fill="#facc15" />
    <circle cx="50" cy="74.5" r="2" fill="#ca8a04" />
    {/* Baseline */}
    <line x1="12" y1="88" x2="88" y2="88" stroke="#cbd5e1" strokeWidth="1.5" />
  </svg>
);

// 8. حصن المسلم: Gentle open hands holding a rich emerald-green shield with white crescent & star
export const HisnMuslimIcon: React.FC<IconProps> = ({ className = 'w-16 h-16 sm:w-20 sm:h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft sky-blue arch */}
    <path d="M15 88V45C15 25 30 14 50 14C70 14 85 25 85 45V88H15Z" fill="#e0f2fe" opacity="0.8" />
    {/* Emerald Green Protective Shield */}
    <path
      d="M50 34C60 34 68 37 68 47C68 62 58 72 50 76C42 72 32 62 32 47C32 37 40 34 50 34Z"
      fill="#16a34a"
      stroke="#15803d"
      strokeWidth="1.5"
    />
    {/* White Crescent Moon inside shield */}
    <path
      d="M53 46C48 46 44 50 45 56C46 61 50 65 56 64C59 63 61 61 62 58C57 60 52 58 50 54C48 51 49 48 53 46Z"
      fill="#ffffff"
    />
    {/* White Star inside shield */}
    <path
      d="M58 48L58.8 50L61 50.8L58.8 51.5L58 53.5L57.2 51.5L55 50.8L57.2 50L58 48Z"
      fill="#ffffff"
    />
    {/* Protective Hands at the base holding the shield */}
    <path d="M30 76C32 72 38 72 42 77L48 81H34L30 76Z" fill="#fb7185" />
    <path d="M70 76C68 72 62 72 58 77L52 81H66L70 76Z" fill="#fb7185" />
    {/* Baseline */}
    <line x1="12" y1="88" x2="88" y2="88" stroke="#cbd5e1" strokeWidth="1.5" />
  </svg>
);
