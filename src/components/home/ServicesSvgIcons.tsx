import React from 'react';

interface SvgProps {
  className?: string;
  size?: number;
}

/**
 * 1. المصحف الشريف: رسم مصحف مفتوح على حامل خشبي تقليدي (Rehal)
 */
export const QuranRehalSvg: React.FC<SvgProps> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Wooden Rehal Stand - Lower crossed legs */}
    <path
      d="M10 40L24 28L38 40"
      stroke="#8B5A2B"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 38L24 30L34 38"
      stroke="#5C3A1E"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Rehal carved base feet */}
    <circle cx="10" cy="40" r="1.8" fill="#5C3A1E" />
    <circle cx="38" cy="40" r="1.8" fill="#5C3A1E" />

    {/* Upper Rehal V-support */}
    <path
      d="M8 22L24 30L40 22"
      stroke="#8B5A2B"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M24 29V32"
      stroke="#DFB76C"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* Open Quran Pages - Left Page */}
    <path
      d="M24 13C18 10 11 11 6 13V27C11 25 18 24 24 27V13Z"
      fill="#FFFDF7"
      stroke="#0D3B2E"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* Open Quran Pages - Right Page */}
    <path
      d="M24 13C30 10 37 11 42 13V27C37 25 30 24 24 27V13Z"
      fill="#F9F6EE"
      stroke="#0D3B2E"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* Book Cover edges */}
    <path
      d="M5 14L4 28C10 26 18 25 24 28C30 25 38 26 44 28L43 14"
      stroke="#0D3B2E"
      strokeWidth="1.6"
      strokeLinecap="round"
    />

    {/* Decorative Quranic text lines on pages */}
    <line x1="9" y1="16" x2="20" y2="15" stroke="#DFB76C" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="9" y1="19" x2="20" y2="18" stroke="#0D3B2E" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.4" />
    <line x1="9" y1="22" x2="19" y2="21" stroke="#0D3B2E" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.4" />

    <line x1="28" y1="15" x2="39" y2="16" stroke="#DFB76C" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="28" y1="18" x2="39" y2="19" stroke="#0D3B2E" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.4" />
    <line x1="29" y1="21" x2="39" y2="22" stroke="#0D3B2E" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.4" />

    {/* Central Golden Bookmark Ribbon */}
    <path
      d="M24 12V33L26 31L28 33V25"
      fill="#DFB76C"
      stroke="#C5A059"
      strokeWidth="0.8"
    />
  </svg>
);

/**
 * 2. رحلة الختمة: رسم مصحف مع علامة مرجعية (فاصل قراءة) وشريط إنجاز دائري
 */
export const KhatmaProgressSvg: React.FC<SvgProps> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Circular Progress Arc */}
    <circle
      cx="24"
      cy="24"
      r="20"
      stroke="#E5E7EB"
      strokeWidth="2.5"
      strokeOpacity="0.3"
    />
    <path
      d="M24 4A20 20 0 1 1 7.2 34.8"
      stroke="url(#khatma-progress-grad)"
      strokeWidth="3.2"
      strokeLinecap="round"
    />

    {/* Star milestone on progress track */}
    <circle cx="24" cy="4" r="2.5" fill="#DFB76C" />

    {/* Quran Book Body */}
    <rect
      x="13"
      y="12"
      width="22"
      height="26"
      rx="3"
      fill="#0D3B2E"
      stroke="#DFB76C"
      strokeWidth="1.5"
    />
    {/* Book Pages Thickness */}
    <path
      d="M16 10H33C34.1 10 35 10.9 35 12V36H16V10Z"
      fill="#FFFDF7"
      stroke="#C5A059"
      strokeWidth="1"
    />
    {/* Book spine line */}
    <line x1="16" y1="10" x2="16" y2="38" stroke="#09231B" strokeWidth="2.5" strokeLinecap="round" />

    {/* Bookmark Ribbon Hanging Down */}
    <path
      d="M27 9V26L23.5 23L20 26V9H27Z"
      fill="#DFB76C"
      stroke="#B88A35"
      strokeWidth="0.8"
    />

    {/* Golden Emblem in center of cover */}
    <circle cx="25.5" cy="24" r="4.5" fill="#0D3B2E" stroke="#DFB76C" strokeWidth="1" />
    <path
      d="M25.5 21.5L26.5 23.5L28.5 24L26.5 24.5L25.5 26.5L24.5 24.5L22.5 24L24.5 23.5L25.5 21.5Z"
      fill="#DFB76C"
    />

    <defs>
      <linearGradient id="khatma-progress-grad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#DFB76C" />
        <stop offset="0.6" stopColor="#10B981" />
        <stop offset="1" stopColor="#0D3B2E" />
      </linearGradient>
    </defs>
  </svg>
);

/**
 * 3. الأذكار اليومية: رسم مسبحة مع شمس وإشراقة نور
 */
export const DailyAthkarSvg: React.FC<SvgProps> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Radiant Morning Sun */}
    <circle cx="24" cy="17" r="7" fill="#F59E0B" />
    <circle cx="24" cy="17" r="5" fill="#FDE047" />

    {/* Sun Rays */}
    <path
      d="M24 5V8M24 26V29M12 17H15M33 17H36M15.5 8.5L17.6 10.6M30.4 23.4L32.5 25.5M15.5 25.5L17.6 23.4M30.4 10.6L32.5 8.5"
      stroke="#FBBF24"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Prayer Beads Loop (مسبحة) */}
    <ellipse cx="24" cy="33" rx="14" ry="9" stroke="#0D3B2E" strokeWidth="1" strokeDasharray="1 3" opacity="0.4" />
    
    {/* Individual prayer beads */}
    <circle cx="10" cy="33" r="2.2" fill="#DFB76C" stroke="#8B5A2B" strokeWidth="0.8" />
    <circle cx="12" cy="27" r="2.2" fill="#DFB76C" stroke="#8B5A2B" strokeWidth="0.8" />
    <circle cx="16" cy="23" r="2.2" fill="#DFB76C" stroke="#8B5A2B" strokeWidth="0.8" />
    <circle cx="21" cy="22" r="2.2" fill="#DFB76C" stroke="#8B5A2B" strokeWidth="0.8" />
    <circle cx="27" cy="22" r="2.2" fill="#DFB76C" stroke="#8B5A2B" strokeWidth="0.8" />
    <circle cx="32" cy="23" r="2.2" fill="#DFB76C" stroke="#8B5A2B" strokeWidth="0.8" />
    <circle cx="36" cy="27" r="2.2" fill="#DFB76C" stroke="#8B5A2B" strokeWidth="0.8" />
    <circle cx="38" cy="33" r="2.2" fill="#DFB76C" stroke="#8B5A2B" strokeWidth="0.8" />
    <circle cx="35" cy="38" r="2.2" fill="#DFB76C" stroke="#8B5A2B" strokeWidth="0.8" />
    <circle cx="29" cy="41" r="2.2" fill="#DFB76C" stroke="#8B5A2B" strokeWidth="0.8" />
    <circle cx="24" cy="42" r="2.6" fill="#0D3B2E" stroke="#DFB76C" strokeWidth="1" /> {/* Minaret / Main Bead */}
    <circle cx="19" cy="41" r="2.2" fill="#DFB76C" stroke="#8B5A2B" strokeWidth="0.8" />
    <circle cx="13" cy="38" r="2.2" fill="#DFB76C" stroke="#8B5A2B" strokeWidth="0.8" />

    {/* Tassel hanging from minaret bead */}
    <path d="M24 43V46" stroke="#DFB76C" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M22 47H26" stroke="#DFB76C" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * 4. حصن المسلم: رسم درع إسلامي بداخله كتاب أو نجمة للحفظ
 */
export const HisnMuslimSvg: React.FC<SvgProps> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Outer Shield Contour */}
    <path
      d="M24 4L39 9V22C39 32.5 32.5 39.5 24 44C15.5 39.5 9 32.5 9 22V9L24 4Z"
      fill="#0D3B2E"
      stroke="#DFB76C"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Inner Shield Inset */}
    <path
      d="M24 7.5L36 11.5V22C36 30.5 30.8 36.5 24 40.5C17.2 36.5 12 30.5 12 22V11.5L24 7.5Z"
      fill="#09231B"
      stroke="#DFB76C"
      strokeWidth="1"
      strokeOpacity="0.6"
    />

    {/* 8-pointed Islamic Star of Protection inside */}
    <g transform="translate(24, 21.5)">
      <rect x="-6" y="-6" width="12" height="12" fill="#DFB76C" rx="1.5" />
      <rect x="-6" y="-6" width="12" height="12" fill="#DFB76C" rx="1.5" transform="rotate(45)" />
      {/* Sacred book inside the star */}
      <circle cx="0" cy="0" r="3.2" fill="#0D3B2E" />
      <path d="M-2 -1.5H0V1.5H-2V-1.5ZM0 -1.5H2V1.5H0V-1.5Z" fill="#FFFDF7" />
    </g>

    {/* Laurel / Protection leaves at bottom */}
    <path
      d="M17 33C19 35.5 21.5 36.5 24 37C26.5 36.5 29 35.5 31 33"
      stroke="#DFB76C"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * 5. المسبحة الإلكترونية: رسم مسبحة رقمية مع عداد نقرات
 */
export const DigitalSebhaSvg: React.FC<SvgProps> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Main Curved Handheld Device Body */}
    <rect
      x="12"
      y="6"
      width="24"
      height="33"
      rx="10"
      fill="#0D3B2E"
      stroke="#DFB76C"
      strokeWidth="2"
    />
    <rect
      x="14"
      y="8"
      width="20"
      height="29"
      rx="8"
      fill="#081F17"
    />

    {/* LCD Screen Display */}
    <rect
      x="16"
      y="11"
      width="16"
      height="9"
      rx="2.5"
      fill="#1B3E2F"
      stroke="#DFB76C"
      strokeWidth="1"
    />
    {/* Digital Numbers "33" in LCD */}
    <text
      x="24"
      y="18"
      textAnchor="middle"
      fill="#DFB76C"
      fontSize="7.5"
      fontWeight="bold"
      fontFamily="monospace"
    >
      033
    </text>

    {/* Big Tactile Click Button */}
    <circle cx="24" cy="27" r="5" fill="#DFB76C" stroke="#C5A059" strokeWidth="1.2" />
    <circle cx="24" cy="27" r="3.2" fill="#EBD29B" />

    {/* Small Reset Button */}
    <circle cx="30" cy="22" r="1.6" fill="#EF4444" />

    {/* Device Finger Strap / Ring Loop */}
    <path
      d="M19 39C19 43 29 43 29 39"
      stroke="#DFB76C"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="24" cy="44" r="1.5" fill="#DFB76C" />
  </svg>
);

/**
 * 6. طاعاتك (السنن والنوافل): رسم محراب مع سجادة صلاة متجهة نحوه
 */
export const MihrabNawafilSvg: React.FC<SvgProps> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Mosque Mihrab Arch (Background Arch Wall) */}
    <path
      d="M12 42V18C12 11.4 17.4 6 24 6C30.6 6 36 11.4 36 18V42"
      stroke="#DFB76C"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Inner Pointed Islamic Arch Niche */}
    <path
      d="M16 42V20C16 15 20 10 24 8C28 10 32 15 32 20V42"
      fill="#09231B"
      stroke="#C5A059"
      strokeWidth="1.2"
    />

    {/* Hanging Lantern (قنديل المحراب) */}
    <line x1="24" y1="8" x2="24" y2="16" stroke="#DFB76C" strokeWidth="1" />
    <path
      d="M22 16L24 19L26 16H22Z"
      fill="#DFB76C"
    />
    <circle cx="24" cy="18" r="1.5" fill="#FDE047" />

    {/* Prayer Rug (سجادة الصلاة) Perspective in Foreground */}
    <path
      d="M17 26L20 42H28L31 26L24 23L17 26Z"
      fill="#0D3B2E"
      stroke="#DFB76C"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    {/* Prayer rug inner arch / dome motif */}
    <path
      d="M19 28L24 25L29 28V39H19V28Z"
      fill="#124A3A"
      stroke="#DFB76C"
      strokeWidth="0.8"
    />
    {/* Rug fringes at bottom */}
    <line x1="20" y1="42.5" x2="28" y2="42.5" stroke="#DFB76C" strokeWidth="1.5" strokeDasharray="1.5 1.5" />
  </svg>
);

/**
 * 7. الدعاء (الذكر حسب الحالة): رسم كفي يد مرفوعتين بالدعاء مع هالة سكينة ناعمة
 */
export const SupplicationHandsSvg: React.FC<SvgProps> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Soft Serenity Halo / Glowing Aura */}
    <ellipse cx="24" cy="16" rx="14" ry="10" fill="url(#duaa-halo-grad)" opacity="0.6" />
    <circle cx="24" cy="14" r="2" fill="#DFB76C" />
    <path d="M24 7V10M18 10L20 12M30 10L28 12" stroke="#DFB76C" strokeWidth="1.5" strokeLinecap="round" />

    {/* Right Hand (Left side of viewer in 3/4) */}
    <path
      d="M13 36C12 32 12 26 15 22C16.5 20 19 18 21.5 17C22.5 16.6 23.5 18 23 19C22 21 21 24 21 27L22 36"
      fill="#F5D0A9"
      stroke="#A46830"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M17 21C18.5 18.5 20.5 17.5 22 19"
      stroke="#A46830"
      strokeWidth="1"
      strokeLinecap="round"
    />

    {/* Left Hand (Right side of viewer in 3/4, cupped together) */}
    <path
      d="M35 36C36 32 36 26 33 22C31.5 20 29 18 26.5 17C25.5 16.6 24.5 18 25 19C26 21 27 24 27 27L26 36"
      fill="#F5D0A9"
      stroke="#A46830"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M31 21C29.5 18.5 27.5 17.5 26 19"
      stroke="#A46830"
      strokeWidth="1"
      strokeLinecap="round"
    />

    {/* Cupped Palms touching at the base */}
    <path
      d="M22 36C22.5 38 23.5 39 24 39C24.5 39 25.5 38 26 36"
      stroke="#A46830"
      strokeWidth="1.4"
      strokeLinecap="round"
    />

    {/* Sleeves */}
    <path d="M12 36H22V42H12V36Z" fill="#0D3B2E" stroke="#DFB76C" strokeWidth="1" />
    <path d="M26 36H36V42H26V36Z" fill="#0D3B2E" stroke="#DFB76C" strokeWidth="1" />

    <defs>
      <radialGradient id="duaa-halo-grad" cx="0.5" cy="0.5" r="0.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#DFB76C" stopOpacity="0.4" />
        <stop offset="1" stopColor="#DFB76C" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

/**
 * 8. الأجر بالنشر: رسم سهم مشاركة ينطلق منه نور أو ورقة شجر يانعة
 */
export const AjrSharingSvg: React.FC<SvgProps> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Radiant Starburst Light Rays from arrow tip */}
    <path
      d="M37 11L43 5M37 11H44M37 11V4M33 7L38 2"
      stroke="#DFB76C"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="37" cy="11" r="2.5" fill="#DFB76C" />

    {/* Dynamic Curved Share Arrow (Rising upwards to the right) */}
    <path
      d="M12 36C12 25 18 16 35 13"
      stroke="#0D3B2E"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M27 9L37 11L33 21"
      stroke="#0D3B2E"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Golden Inlay on Arrow */}
    <path
      d="M14 36C14 26.5 19 18 34 14.5"
      stroke="#DFB76C"
      strokeWidth="1.8"
      strokeLinecap="round"
    />

    {/* Lush Green Sprout / Leaf (ورقة شجر يانعة ترمز للأجر المستمر والصدقة الجارية) */}
    <g transform="translate(8, 20)">
      <path
        d="M6 16C4 10 10 5 15 5C15 11 11 16 6 16Z"
        fill="#10B981"
        stroke="#0D3B2E"
        strokeWidth="1.2"
      />
      <path
        d="M6 16C9 14 12 11 15 5"
        stroke="#065F46"
        strokeWidth="0.8"
      />
    </g>

    {/* Seedling small leaf */}
    <path
      d="M12 32C10 28 14 25 17 25C17 29 15 32 12 32Z"
      fill="#34D399"
      stroke="#0D3B2E"
      strokeWidth="0.8"
    />
  </svg>
);

/**
 * 9. اتجاه القبلة: رسم بوصلة ذهبية تشير إبرتها مباشرة إلى مجسم الكعبة المشرفة
 */
export const QiblaCompassSvg: React.FC<SvgProps> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Outer Golden Compass Bezel */}
    <circle cx="24" cy="24" r="20" fill="#0D3B2E" stroke="#DFB76C" strokeWidth="2.5" />
    <circle cx="24" cy="24" r="17" fill="#09231B" stroke="#C5A059" strokeWidth="1" strokeDasharray="2 2" />

    {/* Compass Degree Tick Marks */}
    <line x1="24" y1="5" x2="24" y2="7.5" stroke="#DFB76C" strokeWidth="2" strokeLinecap="round" />
    <line x1="24" y1="40.5" x2="24" y2="43" stroke="#DFB76C" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="5" y1="24" x2="7.5" y2="24" stroke="#DFB76C" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="40.5" y1="24" x2="43" y2="24" stroke="#DFB76C" strokeWidth="1.5" strokeLinecap="round" />

    {/* Compass Needle (Emerald & Gold Arrow pointing North toward Kaaba) */}
    <polygon points="24,12 27,24 24,22" fill="#10B981" />
    <polygon points="24,12 21,24 24,22" fill="#059669" />
    <polygon points="24,36 26.5,24 24,25" fill="#DFB76C" opacity="0.8" />
    <polygon points="24,36 21.5,24 24,25" fill="#C5A059" opacity="0.8" />
    <circle cx="24" cy="24" r="2.5" fill="#DFB76C" stroke="#09231B" strokeWidth="1" />

    {/* Kaaba Miniature Representation at North */}
    <g transform="translate(24, 7.5)">
      {/* Kaaba Cube */}
      <rect x="-4.5" y="-4.5" width="9" height="9" rx="1" fill="#18181B" stroke="#DFB76C" strokeWidth="0.8" />
      {/* Golden Kiswah Band */}
      <line x1="-4.5" y1="-2" x2="4.5" y2="-2" stroke="#DFB76C" strokeWidth="1.4" />
      {/* Kaaba Golden Door */}
      <rect x="0.5" y="-1" width="2" height="4.5" fill="#DFB76C" />
    </g>
  </svg>
);

/**
 * 10. حاسبة الزكاة: رسم يد تخرج صدقة/عملات ذهبية فوق كف محتاج
 */
export const ZakatCharitySvg: React.FC<SvgProps> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Upper Giving Hand (إعطاء الصدقة) */}
    <path
      d="M8 12H19C22 12 25 13.5 27 15L31 18C31.5 18.5 31 19.5 30 19.5L24 19L19 21H8"
      stroke="#DFB76C"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M8 8V16" stroke="#DFB76C" strokeWidth="1.8" strokeLinecap="round" />

    {/* Dropping Golden Dinar Coins */}
    <g transform="translate(25, 23)">
      <circle cx="0" cy="0" r="3.5" fill="#DFB76C" stroke="#926A27" strokeWidth="1" />
      <circle cx="0" cy="0" r="2" stroke="#FFF" strokeWidth="0.5" strokeDasharray="1 1" />
    </g>
    <g transform="translate(20, 27)">
      <circle cx="0" cy="0" r="3" fill="#EBD29B" stroke="#926A27" strokeWidth="0.9" />
    </g>
    <g transform="translate(29, 29)">
      <circle cx="0" cy="0" r="2.6" fill="#DFB76C" stroke="#926A27" strokeWidth="0.8" />
    </g>

    {/* Lower Receiving Open Palm */}
    <path
      d="M40 37H28C25 37 22 35.5 20 34L16 31C15.5 30.5 16 29.5 17 29.5L23 30L28 28H40"
      stroke="#10B981"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M40 33V41" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" />

    {/* Sparkles of barakah and reward */}
    <circle cx="26" cy="19" r="1" fill="#DFB76C" />
    <circle cx="34" cy="24" r="1.2" fill="#DFB76C" />
  </svg>
);

/**
 * 11. أسماء الله الحسنى: رسم لوحة خط عربي ثمانية الأضلاع بداخلها لفظ الجلالة "الله"
 */
export const AllahNamesCalligraphySvg: React.FC<SvgProps> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Octagonal Plaque Frame (نجمة ثمانية الأضلاع كلوحة خط تقليدية) */}
    <g transform="translate(24, 24)">
      <rect x="-18" y="-18" width="36" height="36" rx="4" fill="#0D3B2E" stroke="#DFB76C" strokeWidth="2" />
      <rect x="-18" y="-18" width="36" height="36" rx="4" fill="#0D3B2E" stroke="#DFB76C" strokeWidth="2" transform="rotate(45)" />

      {/* Inner Decorative Inset */}
      <circle cx="0" cy="0" r="13" fill="#09231B" stroke="#DFB76C" strokeWidth="1" strokeDasharray="2 1.5" />

      {/* Stylized Arabic Calligraphy for لفظ الجلالة "الله" */}
      <path
        d="M-5 -7V3M-1 -8V4M3 -8V4C3 6.5 1 8 -2 8C-4.5 8 -6.5 6.5 -6.5 4"
        stroke="#DFB76C"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Alif on the right in Arabic */}
      <path
        d="M6 -8V5"
        stroke="#DFB76C"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Shaddah and dagger alif on top */}
      <path
        d="M-2 -10C-1 -9 0 -10 1 -9"
        stroke="#DFB76C"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

/**
 * 12. محطات إسلامية (حدث في اليوم): رسم لفافة ورق ومخطوطة تاريخية مع ريشة
 */
export const IslamicHistoryScrollSvg: React.FC<SvgProps> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Ancient Parchment Scroll (مخطوطة تاريخية ملفوفة) */}
    <path
      d="M10 12C10 9.8 11.8 8 14 8H34C36.2 8 38 9.8 38 12V34C38 36.2 36.2 38 34 38H14C11.8 38 10 36.2 10 34V12Z"
      fill="#FBF7EC"
      stroke="#8B5A2B"
      strokeWidth="1.8"
    />
    {/* Top and Bottom Scroll Curl Handles */}
    <path
      d="M8 12C8 9 11 7 14 7H34C37 7 40 9 40 12C40 15 37 17 34 17H14C11 17 8 15 8 12Z"
      fill="#E6D3B1"
      stroke="#8B5A2B"
      strokeWidth="1.5"
    />
    <path
      d="M8 36C8 33 11 31 14 31H34C37 31 40 33 40 36C40 39 37 41 34 41H14C11 41 8 39 8 36Z"
      fill="#E6D3B1"
      stroke="#8B5A2B"
      strokeWidth="1.5"
    />

    {/* Ancient Arabic Handwritten Script Lines */}
    <line x1="14" y1="21" x2="30" y2="21" stroke="#0D3B2E" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.7" />
    <line x1="14" y1="25" x2="26" y2="25" stroke="#0D3B2E" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.6" />
    <line x1="14" y1="29" x2="28" y2="29" stroke="#DFB76C" strokeWidth="1.2" strokeLinecap="round" />

    {/* Calligraphic Feather Quill Pen (ريشة الخط التاريخية) */}
    <g transform="translate(32, 16) rotate(30)">
      <path
        d="M0 -14C2 -10 3 -4 1 6L0 12L-1 6C-3 -4 -2 -10 0 -14Z"
        fill="#DFB76C"
        stroke="#8B5A2B"
        strokeWidth="1"
      />
      {/* Quill nib */}
      <path d="M0 12V15" stroke="#0D3B2E" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  </svg>
);

/**
 * 13. قسم رمضان: رسم فانوس رمضاني تقليدي وهلال منير وتمرات
 */
export const RamadanFanousSvg: React.FC<SvgProps> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Glowing Crescent Moon (هلال منير في الخلفية) */}
    <path
      d="M32 6C27 6 22 10.5 22 16.5C22 22.5 27 27 32 27C34 27 36 26 37.5 25C34 29 28 30 23 27C18 24 16 18 18 12C19.5 8 23 5 27 5C28.7 5 30.5 5.5 32 6Z"
      fill="#FBBF24"
      stroke="#DFB76C"
      strokeWidth="1"
    />

    {/* Hanging Ring & Chain for Fanous */}
    <circle cx="21" cy="7" r="2.5" stroke="#DFB76C" strokeWidth="1.2" fill="none" />
    <line x1="21" y1="9.5" x2="21" y2="13" stroke="#DFB76C" strokeWidth="1.2" />

    {/* Fanous Top Canopy */}
    <path
      d="M15 17L21 13L27 17H15Z"
      fill="#DFB76C"
      stroke="#8B5A2B"
      strokeWidth="1.2"
    />

    {/* Fanous Glass Chamber with Candle Light */}
    <path
      d="M15 17L17 29H25L27 17H15Z"
      fill="#FEF3C7"
      stroke="#DFB76C"
      strokeWidth="1.4"
    />
    {/* Inner Candle Flame */}
    <circle cx="21" cy="23" r="2" fill="#F59E0B" />
    <path d="M21 21C21 20 22 19 21 18C20 19 21 20 21 21Z" fill="#EF4444" />

    {/* Fanous Base and Feet */}
    <path
      d="M16 29L14 34H28L26 29H16Z"
      fill="#DFB76C"
      stroke="#8B5A2B"
      strokeWidth="1.2"
    />
    <circle cx="16" cy="35" r="1" fill="#8B5A2B" />
    <circle cx="26" cy="35" r="1" fill="#8B5A2B" />

    {/* Sweet Dates Cluster (تمرات مباركة للإفطار) */}
    <ellipse cx="34" cy="36" rx="4" ry="2.6" fill="#78350F" transform="rotate(-15 34 36)" />
    <ellipse cx="38" cy="38" rx="3.5" ry="2.4" fill="#92400E" transform="rotate(10 38 38)" />
    <ellipse cx="31" cy="39" rx="3" ry="2" fill="#78350F" />
  </svg>
);

/**
 * 14. التقويم والمناسبات: رسم ورقة تقويم جداري مع رمز الهلال
 */
export const IslamicCalendarSvg: React.FC<SvgProps> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Calendar Card Sheet */}
    <rect
      x="8"
      y="11"
      width="32"
      height="30"
      rx="5"
      fill="#FFFDF7"
      stroke="#DFB76C"
      strokeWidth="2"
    />

    {/* Calendar Header Band */}
    <path
      d="M8 16C8 13.2 10.2 11 13 11H35C37.8 11 40 13.2 40 16V20H8V16Z"
      fill="#0D3B2E"
    />

    {/* Top Spiral Rings / Binders */}
    <circle cx="15" cy="11" r="2" fill="#DFB76C" stroke="#09231B" strokeWidth="1" />
    <circle cx="24" cy="11" r="2" fill="#DFB76C" stroke="#09231B" strokeWidth="1" />
    <circle cx="33" cy="11" r="2" fill="#DFB76C" stroke="#09231B" strokeWidth="1" />

    {/* Calendar Day Grid Dots */}
    <circle cx="14" cy="26" r="1.5" fill="#D1D5DB" />
    <circle cx="20" cy="26" r="1.5" fill="#D1D5DB" />
    <circle cx="26" cy="26" r="1.5" fill="#D1D5DB" />
    <circle cx="32" cy="26" r="1.5" fill="#D1D5DB" />

    <circle cx="14" cy="32" r="1.5" fill="#D1D5DB" />
    <circle cx="20" cy="32" r="1.5" fill="#D1D5DB" />
    <circle cx="26" cy="32" r="1.5" fill="#D1D5DB" />
    <circle cx="32" cy="32" r="1.5" fill="#D1D5DB" />

    {/* Highlighted Today / Special Occasion with Crescent Badge */}
    <circle cx="20" cy="32" r="4.5" fill="#DFB76C" />
    {/* Mini crescent in the badge */}
    <path
      d="M21 30.5C19.5 30.5 18.5 31.5 18.5 33C18.5 34.5 19.5 35.5 21 35.5C21.5 35.5 22 35.3 22.3 35C21.3 34.8 20.5 34 20.5 33C20.5 32 21.3 31.2 22.3 31C22 30.7 21.5 30.5 21 30.5Z"
      fill="#0D3B2E"
    />
  </svg>
);

/**
 * 15. متابعة العبادات: رسم قائمة مهام (Checklist) بجانبها علامات صح خضراء
 */
export const WorshipChecklistSvg: React.FC<SvgProps> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Clipboard / Tracker Board Body */}
    <rect
      x="9"
      y="10"
      width="30"
      height="32"
      rx="4"
      fill="#FFFDF7"
      stroke="#0D3B2E"
      strokeWidth="2"
    />

    {/* Top Metallic Clip with gold finish */}
    <path
      d="M19 8C19 6.9 19.9 6 21 6H27C28.1 6 29 6.9 29 8V12H19V8Z"
      fill="#DFB76C"
      stroke="#8B5A2B"
      strokeWidth="1.2"
    />
    <circle cx="24" cy="9" r="1.5" fill="#0D3B2E" />

    {/* Checklist Row 1: Fajr / Daily Prayer */}
    <circle cx="15" cy="18" r="3.5" fill="#10B981" />
    <path d="M13.5 18L14.7 19.2L16.8 17" stroke="#FFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="21" y1="18" x2="34" y2="18" stroke="#0D3B2E" strokeWidth="1.8" strokeLinecap="round" />

    {/* Checklist Row 2: Quran Ward */}
    <circle cx="15" cy="26" r="3.5" fill="#10B981" />
    <path d="M13.5 26L14.7 27.2L16.8 25" stroke="#FFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="21" y1="26" x2="32" y2="26" stroke="#0D3B2E" strokeWidth="1.8" strokeLinecap="round" />

    {/* Checklist Row 3: Daily Athkar */}
    <circle cx="15" cy="34" r="3.5" fill="#10B981" />
    <path d="M13.5 34L14.7 35.2L16.8 33" stroke="#FFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="21" y1="34" x2="30" y2="34" stroke="#DFB76C" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/**
 * 16. الإعدادات والمزيد: رسم ترس ميكانيكي إسلامي ناعم وأنيق
 */
export const SettingsIslamicGearSvg: React.FC<SvgProps> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Main Gear Outer Contour with 8 Precision Cogs */}
    <g transform="translate(24, 24)">
      <path
        d="M-5 -21H5L6.5 -16C8.5 -15 10.3 -13.8 11.8 -12.3L16.5 -14.5L21.5 -9.5L19.3 -4.8C20.5 -3.3 21.5 -1.5 22.2 0.5L27 2V12L22.2 13.5C21.5 15.5 20.5 17.3 19.3 18.8L21.5 23.5L16.5 28.5L11.8 26.3C10.3 27.8 8.5 29 6.5 30L5 35H-5L-6.5 30C-8.5 29 -10.3 27.8 -11.8 26.3L-16.5 28.5L-21.5 23.5L-19.3 18.8C-20.5 17.3 -21.5 15.5 -22.2 13.5L-27 12V2L-22.2 0.5C-21.5 -1.5 -20.5 -3.3 -19.3 -4.8L-21.5 -9.5L-16.5 -14.5L-11.8 -12.3C-10.3 -13.8 -8.5 -15 -6.5 -16L-5 -21Z"
        fill="#0D3B2E"
        stroke="#DFB76C"
        strokeWidth="1.6"
        strokeLinejoin="round"
        transform="scale(0.68)"
      />

      {/* Islamic 8-Pointed Star Medallion in Center */}
      <rect x="-8" y="-8" width="16" height="16" rx="2" fill="#DFB76C" />
      <rect x="-8" y="-8" width="16" height="16" rx="2" fill="#DFB76C" transform="rotate(45)" />

      {/* Central Brass Jewel Core */}
      <circle cx="0" cy="0" r="4.5" fill="#0D3B2E" stroke="#FFFDF7" strokeWidth="1" />
      <circle cx="0" cy="0" r="2" fill="#DFB76C" />
    </g>
  </svg>
);

/**
 * 17. راجع صلاتك: رسم مصلي في محراب مع درع التدقيق وعلامة الصحة والكمال
 */
export const ReviewPrayerSvg: React.FC<SvgProps> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Background Mihrab Arch of Prayer */}
    <path
      d="M10 42V20C10 12.3 16.3 6 24 6C31.7 6 38 12.3 38 20V42"
      fill="#09231B"
      stroke="#DFB76C"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M14 42V22C14 16.5 18.5 12 24 10C29.5 12 34 16.5 34 22V42"
      fill="#0D3B2E"
      stroke="#C5A059"
      strokeWidth="1"
      strokeOpacity="0.7"
    />

    {/* Prayer Rug Base */}
    <ellipse cx="24" cy="38" rx="11" ry="3.5" fill="#124A3A" stroke="#DFB76C" strokeWidth="1" />

    {/* Stylized Praying Figure in Deep Sujud / Humility */}
    {/* Head in Sujud */}
    <circle cx="17.5" cy="35" r="3" fill="#DFB76C" stroke="#8B5A2B" strokeWidth="0.8" />
    {/* Body arched in Sujud */}
    <path
      d="M19 35.5C21 32 25 29 29 30C32 31 33 34 32.5 37"
      stroke="#FFFDF7"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Arms resting correctly on ground */}
    <path
      d="M21 36L15.5 37.5"
      stroke="#DFB76C"
      strokeWidth="1.8"
      strokeLinecap="round"
    />

    {/* Hanging Spiritual Lamp above */}
    <line x1="24" y1="10" x2="24" y2="16" stroke="#DFB76C" strokeWidth="1" />
    <path d="M22 16L24 19L26 16H22Z" fill="#DFB76C" />
    <circle cx="24" cy="18" r="1.5" fill="#FDE047" />

    {/* Verification / Review Seal Badge at Top-Right */}
    <g transform="translate(34, 15)">
      {/* Golden Starburst / Seal */}
      <circle cx="0" cy="0" r="7.5" fill="#0D3B2E" stroke="#DFB76C" strokeWidth="1.5" />
      <circle cx="0" cy="0" r="6" fill="#10B981" />
      {/* Clean Checkmark for verified prayer */}
      <path
        d="M-2.5 0.2L-0.8 1.9L2.8 -1.7"
        stroke="#FFF"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

/**
 * 18. ١٠٠ حديث شريف: رسم كتاب السنة الشريفة مع ختم النبوة وسراج النور
 */
export const PropheticHadithSvg: React.FC<SvgProps> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Radiant Prophetic Glow Aura */}
    <circle cx="24" cy="22" r="18" fill="url(#hadith-glow-grad)" opacity="0.45" />

    {/* Book Base (صحيح البخاري ومسلم) */}
    <rect
      x="11"
      y="11"
      width="26"
      height="29"
      rx="3.5"
      fill="#0D3B2E"
      stroke="#DFB76C"
      strokeWidth="2"
    />
    {/* Page layers / thickness */}
    <path
      d="M14 9H34C35.5 9 37 10.3 37 12V38H14V9Z"
      fill="#FFFDF7"
      stroke="#C5A059"
      strokeWidth="1.2"
    />
    {/* Book spine line */}
    <line x1="14" y1="9" x2="14" y2="40" stroke="#09231B" strokeWidth="3" strokeLinecap="round" />

    {/* Golden Calligraphic Seal in center of Book (رمز السنة الشريفة) */}
    <circle cx="25.5" cy="23" r="7.5" fill="#0D3B2E" stroke="#DFB76C" strokeWidth="1.2" />
    <circle cx="25.5" cy="23" r="5.5" fill="#09231B" stroke="#DFB76C" strokeWidth="0.8" strokeDasharray="1.5 1.5" />

    {/* Sacred Calligraphy Strokes (رمز النبوة والحديث) */}
    <path
      d="M23 20V26M25.5 19V27M28 21V25"
      stroke="#DFB76C"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    {/* Hanging Bookmark Ribbon */}
    <path
      d="M29 8V18L26.5 16L24 18V8H29Z"
      fill="#DFB76C"
      stroke="#B88A35"
      strokeWidth="0.8"
    />

    {/* Number 100 Golden Badge at Bottom Right */}
    <g transform="translate(32, 33)">
      <rect x="-8" y="-4.5" width="16" height="9" rx="3" fill="#DFB76C" stroke="#0D3B2E" strokeWidth="1" />
      <text
        x="0"
        y="2.5"
        textAnchor="middle"
        fill="#0B241C"
        fontSize="6.5"
        fontWeight="900"
        fontFamily="monospace"
      >
        100
      </text>
    </g>

    <defs>
      <radialGradient id="hadith-glow-grad" cx="0.5" cy="0.5" r="0.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#DFB76C" stopOpacity="0.8" />
        <stop offset="1" stopColor="#DFB76C" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

