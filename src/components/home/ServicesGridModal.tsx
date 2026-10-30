import React from 'react';
import { X, BookOpen } from 'lucide-react';
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
import { NavigationTab } from '../../types';

export interface ServiceGridActionProps {
  onNavigateTab: (tab: NavigationTab) => void;
  onOpenAthkar?: (subTab: 'athkar' | 'sebha') => void;
  onOpenTracker?: (subView: any) => void;
  onOpenQibla?: () => void;
  onOpenShareReward?: () => void;
  onOpenIslamicHistory?: () => void;
  onOpenRamadan?: () => void;
  onOpenHisnMuslim?: () => void;
  onOpenQuiz?: () => void;
}

interface Props extends ServiceGridActionProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ServiceGridItem {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  renderIcon: () => React.ReactNode;
  action: () => void;
}

export const useServicesList = (props: ServiceGridActionProps, onClose?: () => void): ServiceGridItem[] => {
  const trigger = (fn?: () => void) => {
    if (onClose) onClose();
    if (fn) fn();
  };

  return [
    {
      id: 'quran',
      title: 'المصحف الشريف',
      subtitle: 'صفحات المصحف المعتمد',
      renderIcon: () => <QuranServiceIcon className="w-10 h-10" />,
      action: () => trigger(() => props.onNavigateTab('quran')),
    },
    {
      id: 'khatma',
      title: 'رحلة الختمة',
      subtitle: 'خطة وإنجاز القراءة',
      renderIcon: () => <KhatmaServiceIcon className="w-10 h-10" />,
      action: () => trigger(() => (props.onOpenTracker ? props.onOpenTracker('khatma') : props.onNavigateTab('tracker'))),
    },
    {
      id: 'athkar',
      title: 'الأذكار',
      subtitle: 'الأذكار اليومية وأوراد التحصين',
      renderIcon: () => <AthkarServiceIcon className="w-10 h-10" />,
      action: () => trigger(() => (props.onOpenAthkar ? props.onOpenAthkar('athkar') : props.onNavigateTab('athkar'))),
    },
    {
      id: 'sunan',
      title: 'طاعاتك',
      subtitle: 'السنن والنوافل والرواتب',
      renderIcon: () => <SunanServiceIcon className="w-10 h-10" />,
      action: () => trigger(() => (props.onOpenTracker ? props.onOpenTracker('daily') : props.onNavigateTab('tracker'))),
    },
    {
      id: 'review_prayer',
      title: 'راجع صلاتك',
      subtitle: 'فحص الأركان وسجود السهو',
      renderIcon: () => <ReviewPrayerServiceIcon className="w-10 h-10" />,
      action: () => trigger(() => props.onNavigateTab('review_prayer')),
    },
    {
      id: 'duaa',
      title: 'الدعاء',
      subtitle: 'الذكر حسب حالتك النفسية',
      renderIcon: () => <DuaServiceIcon className="w-10 h-10" />,
      action: () => trigger(() => (props.onOpenTracker ? props.onOpenTracker('emotional_duas') : props.onNavigateTab('tracker'))),
    },
    {
      id: 'share_reward',
      title: 'الأجر بالنشر',
      subtitle: 'الدال على الخير كفاعله',
      renderIcon: () => <ShareRewardServiceIcon className="w-10 h-10" />,
      action: () => trigger(() => (props.onOpenShareReward ? props.onOpenShareReward() : null)),
    },
    {
      id: 'qibla',
      title: 'اتجاه القبلة',
      subtitle: 'بوصلة الكعبة المشرفة',
      renderIcon: () => <QiblaServiceIcon className="w-10 h-10" />,
      action: () => trigger(() => (props.onOpenQibla ? props.onOpenQibla() : props.onNavigateTab('prayers'))),
    },
    {
      id: 'zakat',
      title: 'حاسبة الزكاة',
      subtitle: 'الذهب والفضة والمدخرات',
      renderIcon: () => <ZakatServiceIcon className="w-10 h-10" />,
      action: () => trigger(() => (props.onOpenTracker ? props.onOpenTracker('zakat') : props.onNavigateTab('tracker'))),
    },
    {
      id: 'names',
      title: 'أسماء الله الحسنى',
      subtitle: '٩٩ اسماً تدبراً ودعاءً',
      renderIcon: () => <AllahNamesServiceIcon className="w-10 h-10" />,
      action: () => trigger(() => (props.onOpenTracker ? props.onOpenTracker('names') : props.onNavigateTab('tracker'))),
    },
    {
      id: 'history',
      title: 'محطات إسلامية',
      subtitle: 'حدث في مثل هذا اليوم',
      renderIcon: () => <HistoryServiceIcon className="w-10 h-10" />,
      action: () => trigger(() => (props.onOpenIslamicHistory ? props.onOpenIslamicHistory() : null)),
    },
    {
      id: 'ramadan',
      title: 'رمضان',
      subtitle: 'الصيام والإمساك والإفطار',
      renderIcon: () => <RamadanServiceIcon className="w-10 h-10" />,
      action: () => trigger(() => (props.onOpenRamadan ? props.onOpenRamadan() : null)),
    },
    {
      id: 'calendar',
      title: 'التقويم والمناسبات',
      subtitle: 'الهجري والأيام البيض',
      renderIcon: () => <CalendarServiceIcon className="w-10 h-10" />,
      action: () => trigger(() => (props.onOpenTracker ? props.onOpenTracker('calendar') : props.onNavigateTab('tracker'))),
    },
    {
      id: 'hadith',
      title: '١٠٠ حديث شريف',
      subtitle: 'صحيحي البخاري ومسلم بالشرح',
      renderIcon: () => <HadithServiceIcon className="w-10 h-10" />,
      action: () => trigger(() => props.onNavigateTab('hadith')),
    },
    {
      id: 'quiz',
      title: 'المسابقة',
      subtitle: 'أسئلة وتحدي ديني بالصوت',
      badge: 'جديد',
      renderIcon: () => <QuizServiceIcon className="w-10 h-10" />,
      action: () => trigger(() => (props.onOpenQuiz ? props.onOpenQuiz() : null)),
    },
    {
      id: 'settings',
      title: 'الإعدادات والمزيد',
      subtitle: 'حساب المواقيت والوضع',
      renderIcon: () => <SettingsServiceIcon className="w-10 h-10" />,
      action: () => trigger(() => props.onNavigateTab('more')),
    },
  ];
};

export const ServicesGridModal: React.FC<Props> = (props) => {
  const { isOpen, onClose } = props;
  const services = useServicesList(props, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md max-h-[92vh] bg-[#faf8f5] dark:bg-[#141414] text-stone-900 dark:text-stone-100 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between border border-[#d4af37]/40 animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1a1814] to-[#0a0a0a] text-[#d4af37] flex items-center justify-center border border-[#d4af37]/30 shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-stone-900 dark:text-[#d4af37]">
                شبكة خدمات أثَر | Athar
              </h3>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                ١٥ خدمة روحانية متكاملة · بدون إعلانات
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4x4 Grid Matrix */}
        <div className="overflow-y-auto flex-1 py-3 px-0.5 no-scrollbar">
          <div className="grid grid-cols-4 gap-2 sm:gap-2.5" dir="rtl">
            {services.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className="group relative flex flex-col items-center justify-start p-2 rounded-2xl bg-white dark:bg-[#1a1814] border border-stone-200/80 dark:border-[#d4af37]/25 hover:border-[#d4af37]/60 shadow-2xs hover:shadow-xs transition-all duration-150 active:scale-90 text-center"
              >
                {/* Optional mini badge */}
                {item.badge && (
                  <span className="absolute -top-1.5 -left-1 text-[8px] font-bold px-1 rounded-md bg-[#d4af37] text-stone-950 shadow-xs">
                    {item.badge}
                  </span>
                )}

                {/* Squircle container with custom vector SVG */}
                <div
                  className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-white dark:bg-[#121212] border border-stone-200 dark:border-[#d4af37]/30 flex items-center justify-center p-1 transition-transform group-hover:scale-105 shadow-2xs"
                >
                  {item.renderIcon()}
                </div>

                {/* Title */}
                <span className="text-[10px] sm:text-[11px] font-bold text-stone-800 dark:text-stone-100 group-hover:text-[#d4af37] leading-tight line-clamp-2 mt-1.5 px-0.5">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer info note */}
        <div className="pt-2.5 border-t border-stone-200/80 dark:border-stone-800 text-center flex items-center justify-between text-[10px] text-stone-400">
          <span>✨ تطبيق إسلامي نقي بدون إعلانات</span>
          <span>يعمل بدون اتصال بالإنترنت</span>
        </div>
      </div>
    </div>
  );
};
