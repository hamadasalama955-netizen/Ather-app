import React from 'react';
import { NavigationTab } from '../../types';

interface Props {
  onNavigateTab: (tab: NavigationTab) => void;
  onOpenAthkar?: (subTab: 'athkar' | 'sebha') => void;
  onOpenTracker?: (subView: any) => void;
  onOpenQibla?: () => void;
  onOpenShareReward?: () => void;
  onOpenIslamicHistory?: () => void;
  onOpenRamadan?: () => void;
  onOpenHisnMuslim?: () => void;
  onOpenDuas?: () => void;
  onOpenQuranIntro?: () => void;
  onOpenAllahNames?: () => void;
  isDark?: boolean;
}

export const QuickAccessGrid: React.FC<Props> = ({
  onNavigateTab,
  onOpenAthkar,
  onOpenTracker,
  onOpenQibla,
  onOpenShareReward,
  onOpenIslamicHistory,
  onOpenRamadan,
  onOpenHisnMuslim,
  onOpenDuas,
  onOpenQuranIntro,
  onOpenAllahNames,
  isDark = false,
}) => {
  const iconColor = isDark ? '#d4af37' : '#3a5330';

  // 15 Complete, unique services displayed directly in the circular design without any badges or sprouts
  const services = [
    // 1. طاعاتك
    {
      id: 'sunan',
      title: 'طاعاتك',
      action: () => (onOpenTracker ? onOpenTracker('daily') : onNavigateTab('tracker')),
      svg: (
        <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7 sm:w-8 sm:h-8">
          <path
            d="M18 5L21.5 12.5H29.5L23 17.5L25.5 25L18 20.5L10.5 25L13 17.5L6.5 12.5H14.5L18 5Z"
            stroke={iconColor}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="18" cy="18" r="4" stroke={iconColor} strokeWidth="1.2" />
          <path d="M12 29C14 26 22 26 24 29" stroke={iconColor} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ),
    },
    // 2. حصن المسلم
    {
      id: 'hisn',
      title: 'حصن المسلم',
      action: () => (onOpenHisnMuslim ? onOpenHisnMuslim() : onNavigateTab('athkar')),
      svg: (
        <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7 sm:w-8 sm:h-8">
          <path
            d="M7 11C11 9 15 10 18 12C21 10 25 9 29 11V25C25 23 21 24 18 26C15 24 11 23 7 25V11Z"
            stroke={iconColor}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <line x1="18" y1="12" x2="18" y2="26" stroke={iconColor} strokeWidth="1.6" />
          <path d="M10 15H15M10 18H14M22 15H26M22 18H25" stroke={iconColor} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      ),
    },
    // 3. رحلة الختمة
    {
      id: 'khatma',
      title: 'رحلة الختمة',
      action: () => (onOpenTracker ? onOpenTracker('khatma') : onNavigateTab('tracker')),
      svg: (
        <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7 sm:w-8 sm:h-8">
          <rect x="9" y="7" width="18" height="22" rx="2" stroke={iconColor} strokeWidth="1.6" />
          <path d="M9 11H27" stroke={iconColor} strokeWidth="1.2" />
          <circle cx="18" cy="18" r="4.5" stroke={iconColor} strokeWidth="1.4" />
          <circle cx="18" cy="18" r="1.5" fill={iconColor} />
          <path d="M13 29V32L15 30.5L17 32V29" fill={iconColor} />
        </svg>
      ),
    },
    // 4. المصحف الشريف
    {
      id: 'quran',
      title: 'المصحف الشريف',
      action: () => (onOpenQuranIntro ? onOpenQuranIntro() : onNavigateTab('quran')),
      svg: (
        <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7 sm:w-8 sm:h-8">
          <path
            d="M21 9C14.37 9 9 14.37 9 21C9 27.63 14.37 33 21 33C24.5 33 27.6 31.5 29.8 29.1C24.5 28.5 20.5 24 20.5 18.5C20.5 13.5 24 9.5 28.5 9.1C26.3 9 23.5 9 21 9Z"
            stroke={iconColor}
            strokeWidth="1.6"
            fill="none"
          />
          <path
            d="M25 15L26.5 18H29.5L27 20L28 23L25 21.2L22 23L23 20L20.5 18H23.5L25 15Z"
            fill={iconColor}
          />
        </svg>
      ),
    },
    // 5. رمضان
    {
      id: 'ramadan',
      title: 'رمضان',
      action: () => (onOpenRamadan ? onOpenRamadan() : onNavigateTab('home')),
      svg: (
        <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7 sm:w-8 sm:h-8">
          <path
            d="M22 8C15 8 9 14 9 21C9 28 15 34 22 34C25.5 34 28.5 32.5 30.5 30C25 29.5 21 25 21 19.5C21 14.5 24.5 10.5 29.5 10C27.5 8.7 25 8 22 8Z"
            stroke={iconColor}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <polygon
            points="23,17 24,19 26,19 24.5,20.2 25,22 23,21 21,22 21.5,20.2 20,19 22,19"
            fill={iconColor}
          />
        </svg>
      ),
    },
    // 6. محطات إسلامية
    {
      id: 'history',
      title: 'محطات إسلامية',
      action: () => (onOpenIslamicHistory ? onOpenIslamicHistory() : onNavigateTab('home')),
      svg: (
        <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7 sm:w-8 sm:h-8">
          <rect x="10" y="10" width="16" height="16" stroke={iconColor} strokeWidth="1.6" />
          <rect
            x="10"
            y="10"
            width="16"
            height="16"
            stroke={iconColor}
            strokeWidth="1.6"
            transform="rotate(45 18 18)"
          />
          <circle cx="18" cy="18" r="3" fill={iconColor} />
        </svg>
      ),
    },
    // 7. أسماء الله الحسنى
    {
      id: 'allah_names',
      title: 'أسماء الله الحسنى',
      action: () => (onOpenAllahNames ? onOpenAllahNames() : onOpenTracker ? onOpenTracker('names') : onNavigateTab('tracker')),
      svg: (
        <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7 sm:w-8 sm:h-8">
          <path
            d="M10 24V14M15 24V10M20 24V13C20 11 23 11 23 13V24M23 20C25 20 27 21 27 23C27 25 25 26 23 26"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M17 7L18 8.5L19 7" stroke={iconColor} strokeWidth="1.2" strokeLinecap="round" />
          <line x1="18" y1="5" x2="18" y2="6.5" stroke={iconColor} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      ),
    },
    // 8. حاسبة الزكاة
    {
      id: 'zakat',
      title: 'حاسبة الزكاة',
      action: () => (onOpenTracker ? onOpenTracker('zakat') : onNavigateTab('tracker')),
      svg: (
        <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7 sm:w-8 sm:h-8">
          <path
            d="M8 14L18 9L28 14V27L18 31L8 27V14Z"
            stroke={iconColor}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M18 9V31M8 14L18 18L28 14" stroke={iconColor} strokeWidth="1.4" />
          <circle cx="26" cy="25" r="5" fill={isDark ? '#141414' : '#ffffff'} stroke={iconColor} strokeWidth="1.4" />
          <path d="M26 22.5V27.5M23.5 25H28.5" stroke={iconColor} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ),
    },
    // 9. الدعاء (يفتح نافذة الأدعية الشاملة مع الحالات النفسية والمصنفة)
    {
      id: 'duaa',
      title: 'الدعاء',
      action: () => (onOpenDuas ? onOpenDuas() : onOpenTracker ? onOpenTracker('duas') : onNavigateTab('athkar')),
      svg: (
        <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7 sm:w-8 sm:h-8">
          <path
            d="M13 14V22C13 25 15.5 27 18 27C20.5 27 23 25 23 22V14"
            stroke={iconColor}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path d="M10 18V21C10 24 13 26 15 27" stroke={iconColor} strokeWidth="1.4" />
          <path d="M26 18V21C26 24 23 26 21 27" stroke={iconColor} strokeWidth="1.4" />
          <line x1="18" y1="16" x2="18" y2="24" stroke={iconColor} strokeWidth="1.2" />
        </svg>
      ),
    },
    // 10. اتجاه القبلة
    {
      id: 'qibla',
      title: 'اتجاه القبلة',
      action: () => (onOpenQibla ? onOpenQibla() : onNavigateTab('prayers')),
      svg: (
        <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7 sm:w-8 sm:h-8">
          <circle cx="18" cy="18" r="12" stroke={iconColor} strokeWidth="1.5" />
          <polygon points="18,9 21.5,18 18,16 14.5,18" fill={iconColor} />
          <polygon points="18,27 21.5,18 18,20 14.5,18" stroke={iconColor} strokeWidth="1" fill="none" />
        </svg>
      ),
    },
    // 11. راجع صلاتك
    {
      id: 'review_prayer',
      title: 'راجع صلاتك',
      action: () => onNavigateTab('review_prayer'),
      svg: (
        <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7 sm:w-8 sm:h-8">
          <circle cx="25" cy="19" r="3" stroke={iconColor} strokeWidth="1.5" />
          <path
            d="M9 25C11 25 13 22 15 22C17 22 20 24 22 25"
            stroke={iconColor}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path d="M7 26H29" stroke={iconColor} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
    // 12. الأجر بالنشر
    {
      id: 'share_reward',
      title: 'الأجر بالنشر',
      action: () => (onOpenShareReward ? onOpenShareReward() : null),
      svg: (
        <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7 sm:w-8 sm:h-8">
          <path
            d="M18 13C15 11 10 11 7 13V24C10 22 15 22 18 24C21 22 26 22 29 24V13C26 11 21 11 18 13Z"
            stroke={iconColor}
            strokeWidth="1.6"
          />
          <path d="M18 13V24" stroke={iconColor} strokeWidth="1.6" />
          <path d="M18 8V5M14 6L15 7M22 6L21 7" stroke={iconColor} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ),
    },
    // 13. التقويم والمناسبات
    {
      id: 'calendar',
      title: 'التقويم والمناسبات',
      action: () => (onOpenTracker ? onOpenTracker('calendar') : onNavigateTab('tracker')),
      svg: (
        <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7 sm:w-8 sm:h-8">
          <rect x="8" y="9" width="20" height="20" rx="3" stroke={iconColor} strokeWidth="1.6" />
          <line x1="8" y1="15" x2="28" y2="15" stroke={iconColor} strokeWidth="1.4" />
          <circle cx="14" cy="20" r="1.5" fill={iconColor} />
          <circle cx="18" cy="20" r="1.5" fill={iconColor} />
          <circle cx="22" cy="20" r="1.5" fill={iconColor} />
          <circle cx="14" cy="24" r="1.5" fill={iconColor} />
          <circle cx="18" cy="24" r="1.5" fill={iconColor} />
          <line x1="13" y1="6" x2="13" y2="10" stroke={iconColor} strokeWidth="1.6" strokeLinecap="round" />
          <line x1="23" y1="6" x2="23" y2="10" stroke={iconColor} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
    // 14. ١٠٠ حديث شريف
    {
      id: 'hadith',
      title: '١٠٠ حديث شريف',
      action: () => onNavigateTab('hadith'),
      svg: (
        <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7 sm:w-8 sm:h-8">
          <path
            d="M10 7H26C27.1 7 28 7.9 28 9V27C28 28.1 27.1 29 26 29H10C8.9 29 8 28.1 8 27V9C8 7.9 8.9 7 10 7Z"
            stroke={iconColor}
            strokeWidth="1.6"
          />
          <path d="M13 13H23M13 18H23M13 23H19" stroke={iconColor} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ),
    },
    // 15. الإعدادات والمزيد
    {
      id: 'settings',
      title: 'الإعدادات والمزيد',
      action: () => onNavigateTab('more'),
      svg: (
        <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7 sm:w-8 sm:h-8">
          <circle cx="18" cy="18" r="4" stroke={iconColor} strokeWidth="1.6" />
          <path
            d="M18 6V9M18 27V30M6 18H9M27 18H30M9.5 9.5L11.6 11.6M24.4 24.4L26.5 26.5M9.5 26.5L11.6 24.4M24.4 11.6L26.5 9.5"
            stroke={iconColor}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Title strictly 'الخدمات الإسلامية' without extra badges */}
      <div className="flex items-center justify-between px-1">
        <div />
        <h3
          className={`text-base sm:text-lg font-black tracking-tight ${
            isDark ? 'text-white' : 'text-[#2e4426]'
          }`}
        >
          الخدمات الإسلامية
        </h3>
      </div>

      {/* Pure Circular Artistic Badges Grid (بدون أي علامات جديد أو جامع أو زخارف أوراق أو أزرار عرض المزيد) */}
      <div className="grid grid-cols-4 gap-y-4 gap-x-2 sm:gap-x-3 text-center" dir="rtl">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={service.action}
            className="group flex flex-col items-center justify-start focus:outline-hidden active:scale-95 transition-transform"
          >
            {/* The Pure Circular Button */}
            <div className="relative">
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-105 ${
                  isDark
                    ? 'bg-gradient-to-b from-[#1c1a16] to-[#0e0e0e] border border-[#d4af37]/40 shadow-[0_4px_14px_rgba(0,0,0,0.6)] group-hover:border-[#d4af37] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    : 'bg-gradient-to-b from-[#ffffff] to-[#f7f5ee] border border-[#c5a059]/40 shadow-[0_3px_10px_rgba(0,0,0,0.05)] group-hover:border-[#8c6b2d]'
                }`}
              >
                {/* Inner Delicate Rim */}
                <div className="absolute inset-1 rounded-full border border-current opacity-10 pointer-events-none" />
                {service.svg}
              </div>
            </div>

            {/* Title Centered Directly Under the Circle */}
            <span
              className={`text-[11px] sm:text-xs font-bold mt-2 leading-tight transition-colors line-clamp-1 ${
                isDark
                  ? 'text-stone-200 group-hover:text-[#d4af37]'
                  : 'text-stone-800 group-hover:text-[#2e4426]'
              }`}
            >
              {service.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
