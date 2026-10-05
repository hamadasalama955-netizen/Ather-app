import React, { useState } from 'react';
import {
  Menu,
  Bell,
  BellRing,
  X,
  MapPin,
  Moon,
  Sun,
  BookOpen,
  Compass,
  Sparkles,
  Volume2,
  VolumeX,
  Check,
  ShieldCheck,
  ChevronLeft,
  LayoutGrid,
} from 'lucide-react';
import { LocationConfig, NavigationTab } from '../../types';

interface Props {
  location: LocationConfig;
  onOpenLocationModal: () => void;
  onNavigateTab: (tab: NavigationTab) => void;
  onOpenServicesGrid?: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const HomeTopBar: React.FC<Props> = ({
  location,
  onOpenLocationModal,
  onNavigateTab,
  onOpenServicesGrid,
  isDark,
  onToggleTheme,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Notification preferences stored in localStorage
  const [adhanEnabled, setAdhanEnabled] = useState(() => {
    return localStorage.getItem('noor_adhan_alerts') !== 'false';
  });
  const [athkarMorningEnabled, setAthkarMorningEnabled] = useState(() => {
    return localStorage.getItem('noor_athkar_morning_alert') !== 'false';
  });
  const [athkarEveningEnabled, setAthkarEveningEnabled] = useState(() => {
    return localStorage.getItem('noor_athkar_evening_alert') !== 'false';
  });
  const [tahajjudEnabled, setTahajjudEnabled] = useState(() => {
    return localStorage.getItem('noor_tahajjud_alert') === 'true';
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggleAdhan = () => {
    const next = !adhanEnabled;
    setAdhanEnabled(next);
    localStorage.setItem('noor_adhan_alerts', next ? 'true' : 'false');
    showSaveFeedback();
  };

  const handleToggleAthkarMorning = () => {
    const next = !athkarMorningEnabled;
    setAthkarMorningEnabled(next);
    localStorage.setItem('noor_athkar_morning_alert', next ? 'true' : 'false');
    showSaveFeedback();
  };

  const handleToggleAthkarEvening = () => {
    const next = !athkarEveningEnabled;
    setAthkarEveningEnabled(next);
    localStorage.setItem('noor_athkar_evening_alert', next ? 'true' : 'false');
    showSaveFeedback();
  };

  const handleToggleTahajjud = () => {
    const next = !tahajjudEnabled;
    setTahajjudEnabled(next);
    localStorage.setItem('noor_tahajjud_alert', next ? 'true' : 'false');
    showSaveFeedback();
  };

  const showSaveFeedback = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const requestBrowserNotification = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('أثَر | Athar - رفيق المسلم', {
          body: 'تم تفعيل التنبيهات والأذان بنجاح',
          icon: '/icon.svg',
        });
      }
    }
  };

  return (
    <>
      {/* 1. Sleek Top Bar Header */}
      <header className="w-full flex items-center justify-between py-2 px-1 text-stone-900 dark:text-stone-100 gap-1.5 sm:gap-2">
        {/* Right side in RTL: Menu + Brand */}
        <div className="flex items-center gap-2">
          {/* Menu Drawer Toggle */}
          <button
            onClick={() => setIsMenuOpen(true)}
            aria-label="القائمة الرئيسية"
            title="القائمة السريعة"
            className="w-9 h-9 rounded-2xl flex items-center justify-center bg-[#fcfbf7] dark:bg-[#122e23] border border-stone-200/80 dark:border-stone-800 text-stone-700 dark:text-stone-200 hover:border-[#dfb76c]/60 shadow-xs transition active:scale-90"
          >
            <Menu className="w-4 h-4 text-[#0d3b2e] dark:text-[#dfb76c]" />
          </button>

          {/* Brand Name */}
          <div>
            <h1 className="text-xs sm:text-sm font-black tracking-tight text-[#0d3b2e] dark:text-[#dfb76c] flex items-center gap-1.5 whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 text-[#dfb76c] shrink-0" />
              <span>أثَر | Athar - رفيق المسلم</span>
            </h1>
          </div>
        </div>

        {/* Left side in RTL: Prominent Services button + Notification Icon */}
        <div className="flex items-center gap-1.5">
          {onOpenServicesGrid && (
            <button
              onClick={onOpenServicesGrid}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-[#0d3b2e] to-[#144f3e] hover:from-[#114536] hover:to-[#19614d] text-[#dfb76c] border border-[#dfb76c]/40 text-xs font-bold shadow-xs active:scale-95 transition"
              title="فتح شبكة الخدمات الإسلامية"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#dfb76c]" />
              <span className="text-[11px] font-bold">الخدمات</span>
            </button>
          )}

          {/* Notification Icon */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            aria-label="تنبيهات الأذان والأذكار"
            title="التنبيهات والإشعارات"
            className="relative w-9 h-9 rounded-2xl flex items-center justify-center bg-[#fcfbf7] dark:bg-[#122e23] border border-stone-200/80 dark:border-stone-800 text-stone-700 dark:text-stone-200 hover:border-[#dfb76c]/60 shadow-xs transition active:scale-90"
          >
            <Bell className="w-4 h-4 text-[#0d3b2e] dark:text-[#dfb76c]" />
            {adhanEnabled && (
              <span className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-[#dfb76c] ring-2 ring-[#fcfbf7] dark:ring-[#122e23]" />
            )}
          </button>
        </div>
      </header>

      {/* 2. Menu Slide-over Modal */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xs h-full bg-[#fcfbf7] dark:bg-[#0b241c] text-stone-900 dark:text-stone-100 p-5 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300 border-l border-[#dfb76c]/30">
            {/* Drawer Top */}
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#0d3b2e] text-[#dfb76c] flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#0d3b2e] dark:text-[#dfb76c]">أثَر | Athar - رفيق المسلم</h2>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400">تطبيق إسلامي شامل بدون إعلانات</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Preferences Bar in Drawer */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenLocationModal();
                  }}
                  className="flex items-center gap-1.5 p-2.5 rounded-xl bg-stone-100 dark:bg-[#122e23] border border-stone-200/80 dark:border-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:border-[#dfb76c]/50 transition"
                >
                  <MapPin className="w-4 h-4 text-[#dfb76c] shrink-0" />
                  <span className="truncate">{location.label.split('(')[0].trim()}</span>
                </button>

                <button
                  onClick={onToggleTheme}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-stone-100 dark:bg-[#122e23] border border-stone-200/80 dark:border-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:border-[#dfb76c]/50 transition"
                >
                  {isDark ? (
                    <>
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>نهاري</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-[#0d3b2e]" />
                      <span>ليلي</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct Navigation Links */}
              <div className="space-y-1 pt-2">
                <div className="text-[11px] font-bold text-stone-400 dark:text-stone-500 px-1 mb-1">
                  أقسام التطبيق
                </div>

                {onOpenServicesGrid && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenServicesGrid();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#0d3b2e]/10 to-[#dfb76c]/15 text-xs font-bold text-[#0d3b2e] dark:text-[#dfb76c] border border-[#dfb76c]/30 transition text-right shadow-2xs mb-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <LayoutGrid className="w-4 h-4 text-[#dfb76c]" />
                      <span>شبكة الخدمات الإسلامية (١٥ خدمة)</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-[#dfb76c]" />
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onNavigateTab('quran');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-100 dark:hover:bg-[#122e23] text-xs font-bold text-stone-800 dark:text-stone-200 transition text-right"
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-[#c5a059]" />
                    <span>المصحف الشريف (صفحات المصحف)</span>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-stone-400" />
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onNavigateTab('athkar');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-100 dark:hover:bg-[#122e23] text-xs font-bold text-stone-800 dark:text-stone-200 transition text-right"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#dfb76c]" />
                    <span>حصن المسلم (الأذكار والتحصين)</span>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-stone-400" />
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onNavigateTab('prayers');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-100 dark:hover:bg-[#122e23] text-xs font-bold text-stone-800 dark:text-stone-200 transition text-right"
                >
                  <div className="flex items-center gap-2.5">
                    <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>جدول المواقيت وبوصلة القبلة</span>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-stone-400" />
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onNavigateTab('hadith');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-100 dark:hover:bg-[#122e23] text-xs font-bold text-stone-800 dark:text-stone-200 transition text-right"
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-[#dfb76c]" />
                    <span>١٠٠ حديث شريف (البخاري ومسلم)</span>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-stone-400" />
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onNavigateTab('more');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-100 dark:hover:bg-[#122e23] text-xs font-bold text-stone-800 dark:text-stone-200 transition text-right"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-stone-500" />
                    <span>الإعدادات المتقدمة والحساب الشرعي</span>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-stone-400" />
                </button>
              </div>
            </div>

            {/* Drawer Bottom */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 text-center space-y-1">
              <div className="text-[11px] font-bold text-[#0d3b2e] dark:text-[#dfb76c]">
                أثَر - تطبيق خالي من الإعلانات
              </div>
              <p className="text-[10px] text-stone-400">
                يعمل Offline وببيانات دقيقة وموثوقة
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Notifications Modal */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#fcfbf7] dark:bg-[#0b241c] text-stone-900 dark:text-stone-100 rounded-3xl p-5 shadow-2xl space-y-4 border border-[#dfb76c]/40 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#dfb76c]/20 text-[#c5a059] flex items-center justify-center">
                  <BellRing className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0d3b2e] dark:text-[#dfb76c]">
                    تنبيهات الصلاة والأذكار
                  </h3>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400">
                    خصص الإشعارات والتذكيرات اليومية
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List of Notification Toggles */}
            <div className="space-y-2.5">
              {/* Adhan alert toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-100/80 dark:bg-[#122e23] border border-stone-200/70 dark:border-stone-800">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    {adhanEnabled ? (
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                    )}
                    <span>تنبيهات أوقات الصلاة (الأذان)</span>
                  </div>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400">
                    تنبيه عند حلول موعد كل صلاة
                  </p>
                </div>
                <button
                  onClick={handleToggleAdhan}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    adhanEnabled ? 'bg-[#0d3b2e] dark:bg-[#dfb76c]' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      adhanEnabled ? '-translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Morning Athkar alert */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-100/80 dark:bg-[#122e23] border border-stone-200/70 dark:border-stone-800">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold">تذكير أذكار الصباح</div>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400">
                    تنبيه بعد شروق الشمس
                  </p>
                </div>
                <button
                  onClick={handleToggleAthkarMorning}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    athkarMorningEnabled ? 'bg-[#0d3b2e] dark:bg-[#dfb76c]' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      athkarMorningEnabled ? '-translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Evening Athkar alert */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-100/80 dark:bg-[#122e23] border border-stone-200/70 dark:border-stone-800">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold">تذكير أذكار المساء</div>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400">
                    تنبيه بعد صلاة العصر
                  </p>
                </div>
                <button
                  onClick={handleToggleAthkarEvening}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    athkarEveningEnabled ? 'bg-[#0d3b2e] dark:bg-[#dfb76c]' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      athkarEveningEnabled ? '-translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Tahajjud alert */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-100/80 dark:bg-[#122e23] border border-stone-200/70 dark:border-stone-800">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold">تذكير الثلث الأخير والقيام</div>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400">
                    تنبيه لصلاة الليل والاستغفار بالأسحار
                  </p>
                </div>
                <button
                  onClick={handleToggleTahajjud}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    tahajjudEnabled ? 'bg-[#0d3b2e] dark:bg-[#dfb76c]' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      tahajjudEnabled ? '-translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Permission trigger */}
            <div className="pt-2">
              <button
                onClick={requestBrowserNotification}
                className="w-full py-2.5 px-3 rounded-xl bg-[#0d3b2e] hover:bg-[#124a3a] text-[#fcfbf7] text-xs font-bold shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5 text-[#dfb76c]" />
                <span>طلب إذن إشعارات المتصفح والنظام</span>
              </button>
            </div>

            {savedSuccess && (
              <div className="text-center text-xs font-bold text-emerald-600 flex items-center justify-center gap-1 animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>تم حفظ تفضيلات التنبيه بنجاح</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
