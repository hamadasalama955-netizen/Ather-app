import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Flame,
  Calendar,
  HeartHandshake,
  Coins,
  ChevronLeft,
  BookOpen,
  Heart,
} from 'lucide-react';
import { HijriDateInfo, NavigationTab, PrayerLog, WeeklyAnalytics } from '../../types';
import {
  getPrayerLog,
  savePrayerLog,
  getTodayDateKey,
  getWeeklyAnalytics,
  getHijriAdjustment,
  setHijriAdjustment,
} from '../../services/trackerService';
import { DailyPrayerCard } from './DailyPrayerCard';
import { QuranWardCard } from './QuranWardCard';
import { StreakAnalyticsCard } from './StreakAnalyticsCard';
import { HijriCalendarCard } from './HijriCalendarCard';
import { AllahNamesSection } from './AllahNamesSection';
import { DuasSection } from './DuasSection';
import { ZakatCalculatorSection } from './ZakatCalculatorSection';
import { KhatmaTrackerCard } from './KhatmaTrackerCard';
import { EmotionalDuasSection } from './EmotionalDuasSection';

export type TrackerSubView =
  | 'daily'
  | 'khatma'
  | 'emotional_duas'
  | 'analytics'
  | 'calendar'
  | 'names'
  | 'allah_names'
  | 'duas'
  | 'zakat';

interface Props {
  hijriDate?: HijriDateInfo;
  onNavigateTab?: (tab: NavigationTab) => void;
  initialSubView?: TrackerSubView;
  hideNavigation?: boolean;
}

export const TrackerTab: React.FC<Props> = ({
  hijriDate,
  onNavigateTab,
  initialSubView = 'daily',
  hideNavigation = true,
}) => {
  const [subView, setSubView] = useState<TrackerSubView>(initialSubView);

  useEffect(() => {
    if (initialSubView) {
      setSubView(initialSubView);
    }
  }, [initialSubView]);

  const [todayLog, setTodayLog] = useState<PrayerLog>(getPrayerLog());
  const [analytics, setAnalytics] = useState<WeeklyAnalytics>(getWeeklyAnalytics());
  const [hijriAdjustment, setAdjustment] = useState<number>(getHijriAdjustment());

  // Reload data
  const refreshData = () => {
    setTodayLog(getPrayerLog());
    setAnalytics(getWeeklyAnalytics());
  };

  const handleUpdateLog = (updated: Partial<PrayerLog>) => {
    const nextLog = { ...todayLog, ...updated };
    setTodayLog(nextLog);
    savePrayerLog(getTodayDateKey(), nextLog);
    setAnalytics(getWeeklyAnalytics());
  };

  const handleUpdateAdjustment = (offset: number) => {
    setAdjustment(offset);
    setHijriAdjustment(offset);
  };

  const navItems: { id: TrackerSubView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'daily', label: 'ورد اليوم والصلوات', icon: CalendarCheck },
    { id: 'khatma', label: 'رحلة الختمة', icon: BookOpen },
    { id: 'emotional_duas', label: 'الذكر حسب الحالة', icon: Heart },
    { id: 'analytics', label: 'الستريك والإحصائيات', icon: Flame },
    { id: 'calendar', label: 'التقويم والمناسبات', icon: Calendar },
    { id: 'names', label: 'أسماء الله الحسنى', icon: BookOpen },
    { id: 'duas', label: 'الأدعية المأثورة', icon: HeartHandshake },
    { id: 'zakat', label: 'حاسبة الزكاة', icon: Coins },
  ];

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      {/* Top Segmented Horizontal Navigation (Hidden on independent service pages) */}
      {!hideNavigation && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
          {navItems.map((item) => {
            const isActive = subView === item.id || (item.id === 'names' && subView === 'allah_names');
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setSubView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap shrink-0 active:scale-95 ${
                  isActive
                    ? 'bg-[#d4af37] text-stone-950 font-extrabold shadow-sm'
                    : 'bg-white dark:bg-[#141414] border border-stone-200/80 dark:border-[#d4af37]/25 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#1a1814]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-stone-950' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Sub View 1: ورد اليوم والتسجيل (Daily Prayers & Quran Ward) */}
      {subView === 'daily' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <DailyPrayerCard log={todayLog} onUpdateLog={handleUpdateLog} />
          <QuranWardCard
            log={todayLog}
            onUpdateLog={handleUpdateLog}
            onOpenQuranTab={() => (onNavigateTab ? onNavigateTab('quran') : undefined)}
          />
        </div>
      )}

      {/* Sub View: رحلة الختمة (Khatma Tracker) */}
      {subView === 'khatma' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <KhatmaTrackerCard onOpenQuranTab={() => (onNavigateTab ? onNavigateTab('quran') : undefined)} />
        </div>
      )}

      {/* Sub View: الذكر حسب الحالة (Emotional Duas) */}
      {subView === 'emotional_duas' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <EmotionalDuasSection />
        </div>
      )}

      {/* Sub View 2: الستريك والإحصائيات الأسبوعية */}
      {subView === 'analytics' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <StreakAnalyticsCard analytics={analytics} />
        </div>
      )}

      {/* Sub View 3: التقويم الهجري والمناسبات */}
      {subView === 'calendar' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <HijriCalendarCard
            hijriDate={hijriDate}
            hijriAdjustment={hijriAdjustment}
            onUpdateAdjustment={handleUpdateAdjustment}
          />
        </div>
      )}

      {/* Sub View 4: أسماء الله الحسنى الـ 99 */}
      {(subView === 'names' || subView === 'allah_names') && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <AllahNamesSection />
        </div>
      )}

      {/* Sub View 5: أدعية نبوية وقرآنية */}
      {subView === 'duas' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <DuasSection />
        </div>
      )}

      {/* Sub View 6: حاسبة الزكاة */}
      {subView === 'zakat' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <ZakatCalculatorSection />
        </div>
      )}
    </div>
  );
};
