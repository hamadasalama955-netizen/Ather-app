import React from 'react';
import { X, Sparkles } from 'lucide-react';
import {
  QuranRehalSvg,
  KhatmaProgressSvg,
  DailyAthkarSvg,
  HisnMuslimSvg,
  DigitalSebhaSvg,
  MihrabNawafilSvg,
  SupplicationHandsSvg,
  AjrSharingSvg,
  QiblaCompassSvg,
  ZakatCharitySvg,
  AllahNamesCalligraphySvg,
  IslamicHistoryScrollSvg,
  RamadanFanousSvg,
  IslamicCalendarSvg,
  PropheticHadithSvg,
  SettingsIslamicGearSvg,
  ReviewPrayerSvg,
} from './ServicesSvgIcons';
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
  renderSvg: () => React.ReactNode;
  bgGradient: string;
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
      badge: '٦٠٤ ص',
      bgGradient: 'from-[#0d3b2e]/10 to-[#dfb76c]/15 dark:from-[#dfb76c]/10 dark:to-[#0d3b2e]/30',
      renderSvg: () => <QuranRehalSvg className="w-8 h-8 sm:w-9 sm:h-9" />,
      action: () => trigger(() => props.onNavigateTab('quran')),
    },
    {
      id: 'khatma',
      title: 'رحلة الختمة',
      subtitle: 'خطة وإنجاز القراءة',
      badge: 'متابعة',
      bgGradient: 'from-amber-500/10 to-[#dfb76c]/20 dark:from-amber-400/10 dark:to-[#0d3b2e]/30',
      renderSvg: () => <KhatmaProgressSvg className="w-8 h-8 sm:w-9 sm:h-9" />,
      action: () => trigger(() => (props.onOpenTracker ? props.onOpenTracker('khatma') : props.onNavigateTab('tracker'))),
    },
    {
      id: 'hisn',
      title: 'حصن المسلم',
      subtitle: 'الأذكار اليومية وأوراد التحصين والمسبحة',
      badge: 'جامع',
      bgGradient: 'from-emerald-500/15 to-[#dfb76c]/20 dark:from-emerald-500/20 dark:to-[#0d3b2e]/35',
      renderSvg: () => <HisnMuslimSvg className="w-8 h-8 sm:w-9 sm:h-9" />,
      action: () => trigger(() => (props.onOpenHisnMuslim ? props.onOpenHisnMuslim() : props.onNavigateTab('athkar'))),
    },
    {
      id: 'sunan',
      title: 'طاعاتك',
      subtitle: 'السنن والنوافل والرواتب',
      bgGradient: 'from-[#0d3b2e]/10 to-[#dfb76c]/20 dark:from-[#0d3b2e]/30 dark:to-[#dfb76c]/15',
      renderSvg: () => <MihrabNawafilSvg className="w-8 h-8 sm:w-9 sm:h-9" />,
      action: () => trigger(() => (props.onOpenTracker ? props.onOpenTracker('daily') : props.onNavigateTab('tracker'))),
    },
    {
      id: 'review_prayer',
      title: 'راجع صلاتك',
      subtitle: 'فحص الأركان وسجود السهو',
      badge: 'جديد',
      bgGradient: 'from-[#0d3b2e]/15 to-[#dfb76c]/20 dark:from-[#dfb76c]/15 dark:to-[#0d3b2e]/35',
      renderSvg: () => <ReviewPrayerSvg className="w-8 h-8 sm:w-9 sm:h-9" />,
      action: () => trigger(() => props.onNavigateTab('review_prayer')),
    },
    {
      id: 'duaa',
      title: 'الدعاء',
      subtitle: 'الذكر حسب حالتك النفسية',
      bgGradient: 'from-rose-500/10 to-amber-500/15 dark:from-rose-500/15 dark:to-[#0d3b2e]/30',
      renderSvg: () => <SupplicationHandsSvg className="w-8 h-8 sm:w-9 sm:h-9" />,
      action: () => trigger(() => (props.onOpenTracker ? props.onOpenTracker('emotional_duas') : props.onNavigateTab('tracker'))),
    },
    {
      id: 'share_reward',
      title: 'الأجر بالنشر',
      subtitle: 'الدال على الخير كفاعله',
      badge: 'أجر',
      bgGradient: 'from-[#dfb76c]/15 to-emerald-500/15 dark:from-[#dfb76c]/20 dark:to-[#0d3b2e]/30',
      renderSvg: () => <AjrSharingSvg className="w-8 h-8 sm:w-9 sm:h-9" />,
      action: () => trigger(() => (props.onOpenShareReward ? props.onOpenShareReward() : null)),
    },
    {
      id: 'qibla',
      title: 'اتجاه القبلة',
      subtitle: 'بوصلة الكعبة المشرفة',
      bgGradient: 'from-[#0d3b2e]/10 to-[#dfb76c]/20 dark:from-[#0d3b2e]/30 dark:to-[#dfb76c]/15',
      renderSvg: () => <QiblaCompassSvg className="w-8 h-8 sm:w-9 sm:h-9" />,
      action: () => trigger(() => (props.onOpenQibla ? props.onOpenQibla() : props.onNavigateTab('prayers'))),
    },
    {
      id: 'zakat',
      title: 'حاسبة الزكاة',
      subtitle: 'الذهب والفضة والمدخرات',
      bgGradient: 'from-amber-500/10 to-[#dfb76c]/25 dark:from-[#dfb76c]/20 dark:to-[#0d3b2e]/30',
      renderSvg: () => <ZakatCharitySvg className="w-8 h-8 sm:w-9 sm:h-9" />,
      action: () => trigger(() => (props.onOpenTracker ? props.onOpenTracker('zakat') : props.onNavigateTab('tracker'))),
    },
    {
      id: 'names',
      title: 'أسماء الله الحسنى',
      subtitle: '٩٩ اسماً تدبراً ودعاءً',
      bgGradient: 'from-[#0d3b2e]/15 to-[#dfb76c]/20 dark:from-[#0d3b2e]/30 dark:to-[#dfb76c]/15',
      renderSvg: () => <AllahNamesCalligraphySvg className="w-8 h-8 sm:w-9 sm:h-9" />,
      action: () => trigger(() => (props.onOpenTracker ? props.onOpenTracker('names') : props.onNavigateTab('tracker'))),
    },
    {
      id: 'history',
      title: 'محطات إسلامية',
      subtitle: 'حدث في مثل هذا اليوم',
      badge: 'تاريخ',
      bgGradient: 'from-amber-600/10 to-[#dfb76c]/15 dark:from-amber-600/15 dark:to-[#0d3b2e]/30',
      renderSvg: () => <IslamicHistoryScrollSvg className="w-8 h-8 sm:w-9 sm:h-9" />,
      action: () => trigger(() => (props.onOpenIslamicHistory ? props.onOpenIslamicHistory() : null)),
    },
    {
      id: 'ramadan',
      title: 'رمضان',
      subtitle: 'الصيام والإمساك والإفطار',
      badge: 'مبارك',
      bgGradient: 'from-amber-500/15 to-[#0d3b2e]/15 dark:from-amber-400/15 dark:to-[#0d3b2e]/30',
      renderSvg: () => <RamadanFanousSvg className="w-8 h-8 sm:w-9 sm:h-9" />,
      action: () => trigger(() => (props.onOpenRamadan ? props.onOpenRamadan() : null)),
    },
    {
      id: 'calendar',
      title: 'التقويم والمناسبات',
      subtitle: 'الهجري والأيام البيض',
      bgGradient: 'from-[#0d3b2e]/10 to-[#dfb76c]/15 dark:from-[#0d3b2e]/30 dark:to-[#dfb76c]/15',
      renderSvg: () => <IslamicCalendarSvg className="w-8 h-8 sm:w-9 sm:h-9" />,
      action: () => trigger(() => (props.onOpenTracker ? props.onOpenTracker('calendar') : props.onNavigateTab('tracker'))),
    },
    {
      id: 'hadith',
      title: '١٠٠ حديث شريف',
      subtitle: 'صحيحي البخاري ومسلم بالشرح',
      badge: 'نبوي',
      bgGradient: 'from-amber-600/10 to-[#dfb76c]/20 dark:from-amber-500/15 dark:to-[#0d3b2e]/30',
      renderSvg: () => <PropheticHadithSvg className="w-8 h-8 sm:w-9 sm:h-9" />,
      action: () => trigger(() => props.onNavigateTab('hadith')),
    },
    {
      id: 'settings',
      title: 'الإعدادات والمزيد',
      subtitle: 'حساب المواقيت والوضع',
      bgGradient: 'from-stone-400/10 to-[#dfb76c]/15 dark:from-stone-700/20 dark:to-[#0d3b2e]/30',
      renderSvg: () => <SettingsIslamicGearSvg className="w-8 h-8 sm:w-9 sm:h-9" />,
      action: () => trigger(() => props.onNavigateTab('more')),
    },
  ];
};

export const ServicesGridModal: React.FC<Props> = (props) => {
  const { isOpen, onClose } = props;
  const services = useServicesList(props, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md max-h-[92vh] bg-[#fcfbf7] dark:bg-[#0b241c] text-stone-900 dark:text-stone-100 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between border border-[#dfb76c]/40 animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0d3b2e] to-[#09231b] text-[#dfb76c] flex items-center justify-center border border-[#dfb76c]/30 shadow-xs">
              <Sparkles className="w-4 h-4 fill-[#dfb76c]/30" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-[#0d3b2e] dark:text-[#dfb76c]">
                شبكة خدمات أثَر | Athar - رفيق المسلم
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

        {/* 4x4 Grid Matrix (16 Services in 4 Columns) */}
        <div className="overflow-y-auto flex-1 py-3 px-0.5 no-scrollbar">
          <div className="grid grid-cols-4 gap-2 sm:gap-2.5" dir="rtl">
            {services.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className="group relative flex flex-col items-center justify-start p-2 rounded-2xl bg-white dark:bg-[#122e23] border border-stone-200/80 dark:border-stone-800 hover:border-[#dfb76c]/60 shadow-2xs hover:shadow-xs transition-all duration-150 active:scale-90 text-center"
              >
                {/* Optional mini badge */}
                {item.badge && (
                  <span className="absolute -top-1.5 -left-1 text-[8px] font-bold px-1 rounded-md bg-[#dfb76c] text-[#0b241c] shadow-xs">
                    {item.badge}
                  </span>
                )}

                {/* Squircle container with custom vector SVG */}
                <div
                  className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-b ${item.bgGradient} border border-[#dfb76c]/25 flex items-center justify-center p-1.5 transition-transform group-hover:scale-105 shadow-2xs`}
                >
                  {item.renderSvg()}
                </div>

                {/* Title */}
                <span className="text-[10px] sm:text-[11px] font-bold text-stone-800 dark:text-stone-100 group-hover:text-[#0d3b2e] dark:group-hover:text-[#dfb76c] leading-tight line-clamp-2 mt-1.5 px-0.5">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer info note */}
        <div className="pt-2.5 border-t border-stone-200/80 dark:border-stone-800 text-center flex items-center justify-between text-[10px] text-stone-400">
          <span>🌿 تطبيق إسلامي نقي بدون إعلانات</span>
          <span>يعمل بدون اتصال بالإنترنت</span>
        </div>
      </div>
    </div>
  );
};
