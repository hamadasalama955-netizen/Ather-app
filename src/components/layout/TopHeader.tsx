import React from 'react';
import { Sun, Moon, MapPin, Home, LayoutGrid } from 'lucide-react';
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
  onOpenLocationPicker,
  onNavigateHome,
  onOpenServices,
  activeTab,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-[#faf8f5]/90 dark:bg-[#0a0a0a]/90 border-b border-[#d4af37]/25 transition-colors duration-200">
      <div className="max-w-md mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Right side in RTL: Home Return Button & Brand */}
        <div className="flex items-center gap-2">
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              title="العودة للشاشة الرئيسية"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-white dark:bg-[#141414] border border-[#d4af37]/30 text-stone-800 dark:text-[#f5e6b8] hover:border-[#d4af37] shadow-2xs text-xs font-bold transition active:scale-95"
            >
              <Home className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[11px]">الرئيسية</span>
            </button>
          )}

          {/* Active section title & App branding */}
          <div className="flex items-center gap-2 text-right pr-0.5">
            <div className="w-7 h-7 rounded-xl overflow-hidden p-0.5 bg-black border border-[#d4af37]/40 shadow-xs flex items-center justify-center shrink-0">
              <img src="/icon-192.png" alt="أثر" className="w-full h-full object-contain" />
            </div>
            <span className="text-xs sm:text-sm font-black text-stone-900 dark:text-[#d4af37] whitespace-nowrap">
              أثر
            </span>
            {activeTab && activeTab !== 'home' && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-stone-500 dark:text-[#a39e93]">
                <span>·</span>
                <span>{TAB_TITLES[activeTab]}</span>
              </span>
            )}
          </div>
        </div>

        {/* Center / Left actions: Services grid trigger + theme + location */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Services grid trigger (Hidden when on جدول المواقيت as requested) */}
          {onOpenServices && activeTab !== 'prayers' && (
            <button
              onClick={onOpenServices}
              title="شبكة الخدمات الإسلامية"
              className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-[#faf8f5] dark:bg-[#141414] text-stone-800 dark:text-[#d4af37] border border-[#d4af37]/35 text-xs font-bold shadow-2xs hover:border-[#d4af37] transition active:scale-95"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[11px]">الخدمات</span>
            </button>
          )}

          {/* Location selector */}
          <button
            onClick={onOpenLocationPicker}
            title="تغيير المدينة أو الموقع"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#141414] border border-[#d4af37]/30 text-stone-700 dark:text-[#f5e6b8] text-xs font-medium transition max-w-[110px] truncate"
          >
            <MapPin className="w-3 h-3 text-[#d4af37] shrink-0" />
            <span className="truncate">{location.label.split('(')[0].trim()}</span>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="تبديل الوضع الليلي"
            title={isDark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-600 dark:text-[#d4af37] bg-white dark:bg-[#141414] border border-[#d4af37]/30 hover:border-[#d4af37] transition active:scale-90"
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-[#8c6b2d]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
