import React from 'react';
import { NavigationTab } from '../../types';
import {
  SunanServiceIcon,
  AthkarServiceIcon,
  KhatmaServiceIcon,
  QuranServiceIcon,
  RamadanServiceIcon,
  HistoryServiceIcon,
  AllahNamesServiceIcon,
  ZakatServiceIcon,
  DuaServiceIcon,
  QiblaServiceIcon,
  ReviewPrayerServiceIcon,
  ShareRewardServiceIcon,
  CalendarServiceIcon,
  HadithServiceIcon,
  QuizServiceIcon,
  SettingsServiceIcon,
} from './ServicesGridIcons';

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
  onOpenQuiz?: () => void;
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
  onOpenDuas,
  onOpenQuranIntro,
  onOpenAllahNames,
  onOpenQuiz,
  isDark = false,
}) => {
  // 15 Complete, uniquely illustrated services matching the aesthetic of Image 7
  const services = [
    // 1. طاعاتك
    {
      id: 'sunan',
      title: 'طاعاتك',
      action: () => (onOpenTracker ? onOpenTracker('daily') : onNavigateTab('tracker')),
      icon: <SunanServiceIcon className="w-11 h-11 sm:w-12 sm:h-12" />,
    },
    // 2. الأذكار
    {
      id: 'athkar',
      title: 'الأذكار',
      action: () => (onOpenAthkar ? onOpenAthkar('athkar') : onNavigateTab('athkar')),
      icon: <AthkarServiceIcon className="w-11 h-11 sm:w-12 sm:h-12" />,
    },
    // 3. رحلة الختمة
    {
      id: 'khatma',
      title: 'رحلة الختمة',
      action: () => (onOpenTracker ? onOpenTracker('khatma') : onNavigateTab('tracker')),
      icon: <KhatmaServiceIcon className="w-11 h-11 sm:w-12 sm:h-12" />,
    },
    // 4. المصحف الشريف
    {
      id: 'quran',
      title: 'المصحف الشريف',
      action: () => (onOpenQuranIntro ? onOpenQuranIntro() : onNavigateTab('quran')),
      icon: <QuranServiceIcon className="w-11 h-11 sm:w-12 sm:h-12" />,
    },
    // 5. رمضان
    {
      id: 'ramadan',
      title: 'رمضان',
      action: () => (onOpenRamadan ? onOpenRamadan() : onNavigateTab('home')),
      icon: <RamadanServiceIcon className="w-11 h-11 sm:w-12 sm:h-12" />,
    },
    // 6. محطات إسلامية
    {
      id: 'history',
      title: 'محطات إسلامية',
      action: () => (onOpenIslamicHistory ? onOpenIslamicHistory() : onNavigateTab('home')),
      icon: <HistoryServiceIcon className="w-11 h-11 sm:w-12 sm:h-12" />,
    },
    // 7. أسماء الله الحسنى
    {
      id: 'allah_names',
      title: 'أسماء الله الحسنى',
      action: () =>
        onOpenAllahNames
          ? onOpenAllahNames()
          : onOpenTracker
          ? onOpenTracker('names')
          : onNavigateTab('tracker'),
      icon: <AllahNamesServiceIcon className="w-11 h-11 sm:w-12 sm:h-12" />,
    },
    // 8. حاسبة الزكاة
    {
      id: 'zakat',
      title: 'حاسبة الزكاة',
      action: () => (onOpenTracker ? onOpenTracker('zakat') : onNavigateTab('tracker')),
      icon: <ZakatServiceIcon className="w-11 h-11 sm:w-12 sm:h-12" />,
    },
    // 9. الدعاء
    {
      id: 'duaa',
      title: 'الدعاء',
      action: () =>
        onOpenDuas
          ? onOpenDuas()
          : onOpenTracker
          ? onOpenTracker('duas')
          : onNavigateTab('athkar'),
      icon: <DuaServiceIcon className="w-11 h-11 sm:w-12 sm:h-12" />,
    },
    // 10. اتجاه القبلة
    {
      id: 'qibla',
      title: 'اتجاه القبلة',
      action: () => (onOpenQibla ? onOpenQibla() : onNavigateTab('prayers')),
      icon: <QiblaServiceIcon className="w-11 h-11 sm:w-12 sm:h-12" />,
    },
    // 11. راجع صلاتك
    {
      id: 'review_prayer',
      title: 'راجع صلاتك',
      action: () => onNavigateTab('review_prayer'),
      icon: <ReviewPrayerServiceIcon className="w-11 h-11 sm:w-12 sm:h-12" />,
    },
    // 12. الأجر بالنشر
    {
      id: 'share_reward',
      title: 'الأجر بالنشر',
      action: () => (onOpenShareReward ? onOpenShareReward() : null),
      icon: <ShareRewardServiceIcon className="w-11 h-11 sm:w-12 sm:h-12" />,
    },
    // 13. التقويم والمناسبات
    {
      id: 'calendar',
      title: 'التقويم والمناسبات',
      action: () => (onOpenTracker ? onOpenTracker('calendar') : onNavigateTab('tracker')),
      icon: <CalendarServiceIcon className="w-11 h-11 sm:w-12 sm:h-12" />,
    },
    // 14. ١٠٠ حديث شريف
    {
      id: 'hadith',
      title: '١٠٠ حديث شريف',
      action: () => onNavigateTab('hadith'),
      icon: <HadithServiceIcon className="w-11 h-11 sm:w-12 sm:h-12" />,
    },
    // 15. المسابقة
    {
      id: 'quiz',
      title: 'المسابقة',
      action: () => (onOpenQuiz ? onOpenQuiz() : null),
      icon: <QuizServiceIcon className="w-11 h-11 sm:w-12 sm:h-12" />,
    },
    // 16. الإعدادات والمزيد
    {
      id: 'settings',
      title: 'الإعدادات والمزيد',
      action: () => onNavigateTab('more'),
      icon: <SettingsServiceIcon className="w-11 h-11 sm:w-12 sm:h-12" />,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Title strictly 'الخدمات الإسلامية' */}
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

      {/* Styled Grid inspired by Image 7 cards */}
      <div className="grid grid-cols-4 gap-y-4 gap-x-2 sm:gap-x-3 text-center" dir="rtl">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={service.action}
            className="group flex flex-col items-center justify-start focus:outline-hidden active:scale-95 transition-transform"
          >
            {/* The Illustrated Icon Container */}
            <div className="relative">
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center p-1 transition-all duration-200 group-hover:scale-105 shadow-sm border ${
                  isDark
                    ? 'bg-[#181818] border-[#d4af37]/30 shadow-[0_4px_14px_rgba(0,0,0,0.5)] group-hover:border-[#d4af37]'
                    : 'bg-white border-stone-200/90 shadow-[0_3px_10px_rgba(0,0,0,0.06)] group-hover:border-[#c5a059]'
                }`}
              >
                {service.icon}
              </div>
            </div>

            {/* Title Centered Directly Under the Icon */}
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
