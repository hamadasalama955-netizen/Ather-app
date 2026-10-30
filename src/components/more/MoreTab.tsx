import React from 'react';
import {
  Moon,
  Sun,
  Laptop,
  MapPin,
  Clock,
  ShieldCheck,
  Smartphone,
  Info,
  CheckCircle2,
  Heart,
} from 'lucide-react';
import { ThemeMode, AppSettings, LocationConfig } from '../../types';
import { TrackerSubView } from '../tracker/TrackerTab';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { InstallAtharBanner } from '../common/InstallAtharBanner';
import { CALCULATION_METHODS } from '../../utils/constants';
import { CalendarCheck, Flame, BookHeart, Coins, ChevronLeft, BookOpen, Star } from 'lucide-react';
import { ScreenBackButton } from '../common/ScreenBackButton';

interface Props {
  theme: ThemeMode;
  onUpdateTheme: (theme: ThemeMode) => void;
  settings: AppSettings;
  location: LocationConfig;
  onOpenLocationModal: () => void;
  onUpdateMethod: (id: number) => void;
  onUpdateAsrSchool: (school: 'standard' | 'hanafi') => void;
  onUpdateTimeFormat: (is24h: boolean) => void;
  onOpenTracker?: (subView: TrackerSubView) => void;
  onNavigateHome?: () => void;
}

export const MoreTab: React.FC<Props> = ({
  theme,
  onUpdateTheme,
  settings,
  location,
  onOpenLocationModal,
  onUpdateMethod,
  onUpdateAsrSchool,
  onUpdateTimeFormat,
  onOpenTracker,
  onNavigateHome,
}) => {
  const currentMethod =
    CALCULATION_METHODS.find((m) => m.id === settings.methodId) || CALCULATION_METHODS[0];

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      {/* 1. App Info Header with Back Button */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1a1814] to-[#141414] text-white p-5 border border-[#d4af37]/40 shadow-lg text-center space-y-2 relative">
        {onNavigateHome && (
          <div className="absolute top-4 right-4">
            <ScreenBackButton onClick={onNavigateHome} ariaLabel="الرجوع إلى الرئيسية" />
          </div>
        )}
        <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold mx-auto shadow-md">
          <Heart className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-extrabold text-white">أثَر | Athar - رفيق المسلم</h2>
        <p className="text-xs text-amber-200">
          تطبيق إسلامي عربي مصمم للموبايل أولاً · خصوصية تامة وبدون إعلانات
        </p>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/20 text-[11px] text-[#d4af37] mt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>كل البيانات محفوظة محلياً على جهازك فقط</span>
        </div>
      </div>

      {/* 2. Islamic Features & Tracker Quick Hub */}
      {onOpenTracker && (
        <div className="rounded-3xl bg-white dark:bg-[#141414] border border-stone-200/80 dark:border-stone-800 p-4 shadow-sm space-y-2.5">
          <h3 className="text-xs font-bold text-stone-700 dark:text-stone-300 px-1">
            المتابعة والتقويم والعبادات
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenTracker('daily')}
              className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-800 text-right hover:border-[#d4af37]/50 transition group flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-xl bg-[#d4af37]/15 dark:bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center mb-2">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900 dark:text-white">المتابعة والورد</div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">تسجيل الصلوات والقرآن</div>
              </div>
            </button>

            <button
              onClick={() => onOpenTracker('khatma')}
              className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-800 text-right hover:border-[#d4af37]/50 transition group flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-xl bg-[#d4af37]/15 dark:bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center mb-2">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900 dark:text-white">رحلة الختمة</div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">تتبع الأيام ونسبة الإنجاز</div>
              </div>
            </button>

            <button
              onClick={() => onOpenTracker('emotional_duas')}
              className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-800 text-right hover:border-[#d4af37]/50 transition group flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-400 flex items-center justify-center mb-2">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900 dark:text-white">الذكر حسب الحالة</div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">عند القلق والحزن والشكر</div>
              </div>
            </button>

            <button
              onClick={() => onOpenTracker('calendar')}
              className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-800 text-right hover:border-[#d4af37]/50 transition group flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-400 flex items-center justify-center mb-2">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900 dark:text-white">التقويم والمناسبات</div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">الأيام البيض وضبط الرؤية</div>
              </div>
            </button>

            <button
              onClick={() => onOpenTracker('names')}
              className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-800 text-right hover:border-[#d4af37]/50 transition group flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-xl bg-[#d4af37]/15 dark:bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center mb-2">
                <Star className="w-4 h-4 fill-[#d4af37]/30" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900 dark:text-white">أسماء الله الحسنى</div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">99 اسماً مع المعاني</div>
              </div>
            </button>

            <button
              onClick={() => onOpenTracker('duas')}
              className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-800 text-right hover:border-[#d4af37]/50 transition group flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-400 flex items-center justify-center mb-2">
                <BookHeart className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900 dark:text-white">الأدعية المأثورة</div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">أدعية قرآنية ونبوية</div>
              </div>
            </button>

            <button
              onClick={() => onOpenTracker('zakat')}
              className="col-span-2 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-800 text-right hover:border-[#d4af37]/50 transition group flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#d4af37]/15 dark:bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center shrink-0">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 dark:text-white">حاسبة زكاة المال والمدخرات</div>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400">حساب نسبة 2.5% مع إيضاح النصاب الشرعي</div>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-[#d4af37] transition" />
            </button>
          </div>
        </div>
      )}

      {/* 3. PWA Install Section */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-stone-600 dark:text-stone-300 px-1">
          تثبيت التطبيق على الموبايل (100% Offline)
        </h3>
        <InstallAtharBanner variant="card" />
        <PWAInstallButton variant="card" />
      </div>

      {/* 3. Appearance (Theme) */}
      <div className="rounded-3xl bg-white dark:bg-[#141414] border border-stone-200/80 dark:border-stone-800 p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-stone-700 dark:text-stone-300">
          المظهر والوضع الليلي
        </h3>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onUpdateTheme('light')}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition active:scale-95 ${
              theme === 'light'
                ? 'bg-amber-50 dark:bg-stone-800 border-amber-500 text-amber-900 dark:text-amber-300 font-bold'
                : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500 mb-1" />
            <span className="text-xs">النهاري</span>
          </button>

          <button
            onClick={() => onUpdateTheme('dark')}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition active:scale-95 ${
              theme === 'dark'
                ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37] font-bold'
                : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50'
            }`}
          >
            <Moon className="w-5 h-5 text-[#d4af37] mb-1" />
            <span className="text-xs">الليلي</span>
          </button>

          <button
            onClick={() => onUpdateTheme('system')}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition active:scale-95 ${
              theme === 'system'
                ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37] font-bold'
                : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50'
            }`}
          >
            <Laptop className="w-5 h-5 text-stone-500 mb-1" />
            <span className="text-xs">تلقائي (الجهاز)</span>
          </button>
        </div>
      </div>

      {/* 4. Location Settings */}
      <div className="rounded-3xl bg-white dark:bg-[#141414] border border-stone-200/80 dark:border-stone-800 p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#d4af37]" />
            <h3 className="text-xs font-bold text-stone-900 dark:text-white">
              الموقع الجغرافي للمواقيت
            </h3>
          </div>
          <button
            onClick={onOpenLocationModal}
            className="text-xs font-semibold text-[#d4af37] hover:underline"
          >
            تغيير
          </button>
        </div>

        <p className="text-xs text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-800/60 p-2.5 rounded-xl border border-stone-100 dark:border-stone-800">
          {location.label}
        </p>
      </div>

      {/* 5. Prayer Calculation Preferences */}
      <div className="rounded-3xl bg-white dark:bg-[#141414] border border-stone-200/80 dark:border-stone-800 p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-stone-700 dark:text-stone-300">
          إعدادات الحساب والتوقيت
        </h3>

        {/* Calculation method */}
        <div className="space-y-1">
          <label className="text-xs text-stone-500 dark:text-stone-400">
            طريقة حساب الفجر والعشاء:
          </label>
          <select
            value={settings.methodId}
            onChange={(e) => onUpdateMethod(Number(e.target.value))}
            className="w-full p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white border border-stone-200 dark:border-stone-700 text-xs font-semibold focus:ring-2 focus:ring-[#d4af37] focus:outline-none"
          >
            {CALCULATION_METHODS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.arabicName}
              </option>
            ))}
          </select>
        </div>

        {/* Asr Juristic School */}
        <div className="space-y-1 pt-2 border-t border-stone-100 dark:border-stone-800">
          <label className="text-xs text-stone-500 dark:text-stone-400">
            طريقة حساب صلاة العصر:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUpdateAsrSchool('standard')}
              className={`py-2 rounded-xl text-xs font-semibold transition ${
                settings.asrSchool === 'standard'
                  ? 'bg-[#d4af37] text-stone-950 font-bold'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              الجمهور (شافعي/مالكي/حنبلي)
            </button>
            <button
              onClick={() => onUpdateAsrSchool('hanafi')}
              className={`py-2 rounded-xl text-xs font-semibold transition ${
                settings.asrSchool === 'hanafi'
                  ? 'bg-[#d4af37] text-stone-950 font-bold'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              المذهب الحنفي
            </button>
          </div>
        </div>

        {/* Time format */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
          <span className="text-xs text-stone-600 dark:text-stone-400">نظام الوقت 24 ساعة:</span>
          <button
            onClick={() => onUpdateTimeFormat(!settings.timeFormat24)}
            className={`w-12 h-6 rounded-full transition-colors p-1 ${
              settings.timeFormat24 ? 'bg-[#d4af37]' : 'bg-stone-300 dark:bg-stone-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.timeFormat24 ? '-translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 6. Authentic Sources & Local Storage Info */}
      <div className="rounded-3xl bg-amber-50/70 dark:bg-[#141414] border border-amber-300/50 dark:border-stone-800 p-4 shadow-sm space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-400">
          <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
          <span>مصادر النصوص الدينية المعتمدة</span>
        </div>
        <ul className="text-xs text-stone-600 dark:text-stone-300 space-y-2 list-none pr-1">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] mt-1.5 shrink-0" />
            <div>
              <strong className="text-stone-900 dark:text-white">القرآن الكريم: </strong>
              مأخوذ بالكامل برسم المصحف العثماني من Alquran Cloud API المعتمد (مجمع الملك فهد لطباعة المصحف الشريف) وتلاوات كبار القراء.
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] mt-1.5 shrink-0" />
            <div>
              <strong className="text-stone-900 dark:text-white">الأذكار والأدعية: </strong>
              مأخوذة بنصوصها وتخريجها وأعدادها من كتاب <strong>«حصن المسلم من أذكار الكتاب والسنة»</strong> للشيخ د. سعيد بن وهف القحطاني.
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] mt-1.5 shrink-0" />
            <div>
              <strong className="text-stone-900 dark:text-white">مواقيت الصلاة: </strong>
              محسوبة بدقة عبر Aladhan API المعتمد وفق الهيئات الفلكية والشرعية الإسلامية الرسمية.
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] mt-1.5 shrink-0" />
            <div>
              <strong className="text-stone-900 dark:text-white">التخزين والخصوصية: </strong>
              جميع بياناتك (فاصلة قراءة المصحف، عداد الأذكار، تسبيحات المسبحة، التفضيلات) محفوظة محلياً 100% على جهازك (LocalStorage) دون أي خادم خارجي.
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
