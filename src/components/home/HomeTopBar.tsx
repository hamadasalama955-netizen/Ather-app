import React, { useState } from 'react';
import {
  Bell,
  BellRing,
  X,
  MapPin,
  Moon,
  Sun,
  BookOpen,
  Compass,
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
        new Notification('أثَر | رفيق المسلم', {
          body: 'تم تفعيل تنبيهات مواقيت الصلاة والأذان بنجاح 🕌',
          icon: '/assets/aistudio/image_fdb94482.png',
          badge: '/icon-192.png',
          dir: 'rtl',
          lang: 'ar',
        });
      }
    }
  };

  return (
    <>
      {/* 1. Sleek Top Bar Header: App name on right, larger emblem in center, bell on left */}
      <header className="w-full flex items-center justify-between py-3 px-3 text-stone-900 dark:text-stone-100" dir="rtl">
        {/* Right: App Name in the empty right space */}
        <div className="flex flex-col text-right select-none min-w-[100px]">
          <span className="text-sm sm:text-base font-extrabold text-[#2e4426] dark:text-[#d4af37] tracking-tight leading-tight">
            أثَر | رفيق المسلم
          </span>
          <span className="text-[10px] font-semibold text-[#8c6b2d] dark:text-[#a39e93] mt-0.5">
            تطبيق المسلم الجامع
          </span>
        </div>

        {/* Center: Exact Royal Athar Logo Emblem matching new logo (image_fdb94482.png) */}
        <div className="flex items-center justify-center">
          <div
            onClick={() => setIsMenuOpen(true)}
            className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-black border-2 border-[#d4af37] shadow-[0_2px_16px_rgba(212,175,55,0.6)] flex items-center justify-center cursor-pointer active:scale-95 transition-transform select-none"
            title="أثر - انقر لفتح القائمة"
          >
            <img
              src="/assets/aistudio/image_fdb94482.png"
              alt="أثر"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Left: Bell Notification Icon */}
        <div className="flex items-center justify-end min-w-[100px]">
          <button
            onClick={() => setIsNotificationsOpen(true)}
            aria-label="تنبيهات الأذان والأذكار"
            title="التنبيهات والإشعارات"
            className="relative w-10 h-10 rounded-full flex items-center justify-center bg-[#eef2e6] dark:bg-[#141414] border border-[#2e4426]/20 dark:border-[#d4af37]/40 text-[#2e4426] dark:text-[#d4af37] hover:border-[#d4af37] shadow-2xs transition active:scale-90"
          >
            <Bell className="w-4.5 h-4.5 text-[#2e4426] dark:text-[#d4af37]" />
            {adhanEnabled && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#d4af37] ring-2 ring-[#eef2e6] dark:ring-[#141414]" />
            )}
          </button>
        </div>
      </header>

      {/* 2. Menu Slide-over Modal */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xs h-full bg-[#faf8f5] dark:bg-[#141414] text-stone-900 dark:text-stone-100 p-5 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300 border-l border-[#d4af37]/30">
            {/* Drawer Top */}
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#d4af37] text-stone-950 flex items-center justify-center font-bold">
                    <BookOpen className="w-4 h-4 text-stone-950" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-stone-900 dark:text-[#d4af37]">أثَر | رفيق المسلم</h2>
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
                  className="flex items-center gap-1.5 p-2.5 rounded-xl bg-stone-100 dark:bg-[#1a1814] border border-stone-200/80 dark:border-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:border-[#d4af37]/50 transition"
                >
                  <MapPin className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span className="truncate">{location.label.split('(')[0].trim()}</span>
                </button>

                <button
                  onClick={onToggleTheme}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-stone-100 dark:bg-[#1a1814] border border-stone-200/80 dark:border-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:border-[#d4af37]/50 transition"
                >
                  {isDark ? (
                    <>
                      <Sun className="w-4 h-4 text-[#d4af37]" />
                      <span>نهاري</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-stone-900" />
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
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#d4af37]/15 to-[#d4af37]/5 text-xs font-bold text-stone-900 dark:text-[#d4af37] border border-[#d4af37]/30 transition text-right shadow-2xs mb-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <LayoutGrid className="w-4 h-4 text-[#d4af37]" />
                      <span>شبكة الخدمات الإسلامية (١٥ خدمة)</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-[#d4af37]" />
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onNavigateTab('quran');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-100 dark:hover:bg-[#1a1814] text-xs font-bold text-stone-800 dark:text-stone-200 transition text-right"
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-[#d4af37]" />
                    <span>المصحف الشريف (صفحات المصحف)</span>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-stone-400" />
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onNavigateTab('athkar');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-100 dark:hover:bg-[#1a1814] text-xs font-bold text-stone-800 dark:text-stone-200 transition text-right"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                    <span>حصن المسلم (الأذكار والتحصين)</span>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-stone-400" />
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onNavigateTab('prayers');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-100 dark:hover:bg-[#1a1814] text-xs font-bold text-stone-800 dark:text-stone-200 transition text-right"
                >
                  <div className="flex items-center gap-2.5">
                    <Compass className="w-4 h-4 text-[#d4af37]" />
                    <span>جدول المواقيت وبوصلة القبلة</span>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-stone-400" />
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onNavigateTab('hadith');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-100 dark:hover:bg-[#1a1814] text-xs font-bold text-stone-800 dark:text-stone-200 transition text-right"
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-[#d4af37]" />
                    <span>١٠٠ حديث شريف (البخاري ومسلم)</span>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-stone-400" />
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onNavigateTab('more');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-100 dark:hover:bg-[#1a1814] text-xs font-bold text-stone-800 dark:text-stone-200 transition text-right"
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
              <div className="text-[11px] font-bold text-[#d4af37]">
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
          <div className="w-full max-w-sm bg-[#faf8f5] dark:bg-[#141414] text-stone-900 dark:text-stone-100 rounded-3xl p-5 shadow-2xl space-y-4 border border-[#d4af37]/40 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center">
                  <BellRing className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-[#d4af37]">
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
              <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-100/80 dark:bg-[#1a1814] border border-stone-200/70 dark:border-stone-800">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    {adhanEnabled ? (
                      <Volume2 className="w-3.5 h-3.5 text-[#d4af37]" />
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
                    adhanEnabled ? 'bg-[#d4af37]' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <div
                    className={`bg-white dark:bg-black w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      adhanEnabled ? '-translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Morning Athkar alert */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-100/80 dark:bg-[#1a1814] border border-stone-200/70 dark:border-stone-800">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold">تذكير أذكار الصباح</div>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400">
                    تنبيه بعد شروق الشمس
                  </p>
                </div>
                <button
                  onClick={handleToggleAthkarMorning}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    athkarMorningEnabled ? 'bg-[#d4af37]' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <div
                    className={`bg-white dark:bg-black w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      athkarMorningEnabled ? '-translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Evening Athkar alert */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-100/80 dark:bg-[#1a1814] border border-stone-200/70 dark:border-stone-800">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold">تذكير أذكار المساء</div>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400">
                    تنبيه بعد صلاة العصر
                  </p>
                </div>
                <button
                  onClick={handleToggleAthkarEvening}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    athkarEveningEnabled ? 'bg-[#d4af37]' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <div
                    className={`bg-white dark:bg-black w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      athkarEveningEnabled ? '-translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Tahajjud alert */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-100/80 dark:bg-[#1a1814] border border-stone-200/70 dark:border-stone-800">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold">تذكير الثلث الأخير والقيام</div>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400">
                    تنبيه لصلاة الليل والاستغفار بالأسحار
                  </p>
                </div>
                <button
                  onClick={handleToggleTahajjud}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    tahajjudEnabled ? 'bg-[#d4af37]' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <div
                    className={`bg-white dark:bg-black w-4 h-4 rounded-full shadow-md transform transition-transform ${
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
                className="w-full py-2.5 px-3 rounded-xl bg-[#d4af37] hover:bg-[#c5a059] text-stone-950 text-xs font-bold shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5 text-stone-950" />
                <span>طلب إذن إشعارات المتصفح والنظام</span>
              </button>
            </div>

            {savedSuccess && (
              <div className="text-center text-xs font-bold text-[#d4af37] flex items-center justify-center gap-1 animate-in fade-in">
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
