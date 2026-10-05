import React from 'react';
import { Sun, Moon, MapPin, Sparkles, Home, LayoutGrid, ChevronRight } from 'lucide-react';
import { LocationConfig, HijriDateInfo, NavigationTab } from '../../types';

interface Props {
  isDark: boolean;
  onToggleTheme: () => void;
  location: LocationConfig;
  hijriDate?: HijriDateInfo;
  onOpenLocationPicker?: () => void;
  onNavigateHome?: () => void;
  onOpenServices?: () => void;
  activeTab?: NavigationTab;
}

const TAB_TITLES: Record<string, string> = {
  home: 'الرئيسية',
  prayers: 'المواقيت والقبلة',
  quran: 'المصحف الشريف',
  athkar: 'حصن المسلم',
  hisn: 'حصن المسلم',
  tracker: 'المتابعة والعبادات',
  more: 'الإعدادات والمزيد',
  review_prayer: 'راجع صلاتك',
  hadith: '١٠٠ حديث شريف',
};

export const TopHeader: React.FC<Props> = ({
  isDark,
  onToggleTheme,
  location,
  hijriDate,
  onOpenLocationPicker,
  onNavigateHome,
  onOpenServices,
  activeTab,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-[#fcfbf7]/90 dark:bg-[#0b241c]/90 border-b border-stone-200/80 dark:border-[#dfb76c]/25 transition-colors duration-200">
      <div className="max-w-md mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Right side in RTL: Home Return Button & Brand */}
        <div className="flex items-center gap-2">
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              title="العودة للشاشة الرئيسية"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-white dark:bg-[#122e23] border border-stone-200/80 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-[#dfb76c]/60 shadow-2xs text-xs font-bold transition active:scale-95"
            >
              <Home className="w-3.5 h-3.5 text-[#0d3b2e] dark:text-[#dfb76c]" />
              <span className="text-[11px]">الرئيسية</span>
            </button>
          )}

          {/* Active section title & App branding */}
          <div className="flex items-center gap-1.5 text-right pr-0.5">
            <span className="text-xs sm:text-sm font-black text-[#0d3b2e] dark:text-[#dfb76c] whitespace-nowrap">
              أثَر | Athar - رفيق المسلم
            </span>
            {activeTab && activeTab !== 'home' && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                <span>·</span>
                <span>{TAB_TITLES[activeTab]}</span>
              </span>
            )}
          </div>
        </div>

        {/* Center / Left actions: Services grid trigger + theme + location */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onOpenServices && (
            <button
              onClick={onOpenServices}
              title="شبكة الخدمات الـ ١٥"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-gradient-to-r from-[#0d3b2e] to-[#144f3e] text-[#dfb76c] border border-[#dfb76c]/40 text-xs font-bold shadow-2xs transition active:scale-95"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="text-[11px]">الخدمات</span>
            </button>
          )}

          {/* Location selector */}
          <button
            onClick={onOpenLocationPicker}
            title="تغيير المدينة أو الموقع"
            className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-xl bg-stone-100 dark:bg-[#122e23] border border-stone-200/80 dark:border-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium transition max-w-[110px] truncate"
          >
            <MapPin className="w-3 h-3 text-[#dfb76c] shrink-0" />
            <span className="truncate">{location.label.split('(')[0].trim()}</span>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="تبديل الوضع الليلي"
            title={isDark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-600 dark:text-stone-300 bg-white dark:bg-[#122e23] border border-stone-200/80 dark:border-stone-800 hover:border-[#dfb76c]/50 transition active:scale-90"
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-[#0d3b2e]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
