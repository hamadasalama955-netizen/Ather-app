import React, { useState, useRef } from 'react';
import {
  Clock,
  Compass,
  MapPin,
  Settings,
  ChevronDown,
  Volume2,
  VolumeX,
  Info,
  Calendar,
  Check,
  Maximize2,
} from 'lucide-react';
import { PrayerTimesResponse, LocationConfig, AppSettings } from '../../types';
import { CALCULATION_METHODS } from '../../utils/constants';
import {
  cleanTimeString,
  formatArabicTime,
  calculateNextPrayer,
  calculateQiblaDegree,
} from '../../utils/prayerUtils';
import { QiblaCompassModal } from '../home/QiblaCompassModal';
import { ScreenBackButton } from '../common/ScreenBackButton';

interface Props {
  prayerData: PrayerTimesResponse | null;
  isLoading: boolean;
  error: string | null;
  location: LocationConfig;
  settings: AppSettings;
  onUpdateMethod: (methodId: number) => void;
  onUpdateAsrSchool: (school: 'standard' | 'hanafi') => void;
  onUpdateTimeFormat: (is24h: boolean) => void;
  onOpenLocationModal: () => void;
  onNavigateHome?: () => void;
}

export const PrayersTab: React.FC<Props> = ({
  prayerData,
  isLoading,
  error,
  location,
  settings,
  onUpdateMethod,
  onUpdateAsrSchool,
  onUpdateTimeFormat,
  onOpenLocationModal,
  onNavigateHome,
}) => {
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [isQiblaModalOpen, setIsQiblaModalOpen] = useState(false);
  const [isPlayingAdhan, setIsPlayingAdhan] = useState(false);
  const audioAdhanRef = useRef<HTMLAudioElement | null>(null);

  const now = new Date();
  const nextPrayer = prayerData ? calculateNextPrayer(prayerData.timings, now) : null;

  // Qibla degree
  const lat = location.latitude ?? prayerData?.meta?.latitude ?? 21.4225;
  const lng = location.longitude ?? prayerData?.meta?.longitude ?? 39.8262;
  const qiblaAngle = calculateQiblaDegree(lat, lng);

  const currentMethod = CALCULATION_METHODS.find((m) => m.id === settings.methodId) || CALCULATION_METHODS[0];

  const handleToggleAdhan = () => {
    if (!audioAdhanRef.current) return;
    if (isPlayingAdhan) {
      audioAdhanRef.current.pause();
      audioAdhanRef.current.currentTime = 0;
      setIsPlayingAdhan(false);
    } else {
      audioAdhanRef.current.play().then(() => {
        setIsPlayingAdhan(true);
      }).catch((e) => {
        console.warn('Adhan play error:', e);
        setIsPlayingAdhan(false);
      });
    }
  };

  const prayerScheduleItems = [
    { key: 'Imsak', name: 'الإمساك', icon: '🌙', isSunnah: true },
    { key: 'Fajr', name: 'الفجر', icon: '🌅', isObligatory: true },
    { key: 'Sunrise', name: 'الشروق', icon: '☀️', isSunnah: true },
    { key: 'Dhuhr', name: 'الظهر', icon: '🌤️', isObligatory: true },
    { key: 'Asr', name: 'العصر', icon: '⛅', isObligatory: true },
    { key: 'Maghrib', name: 'المغرب', icon: '🌇', isObligatory: true },
    { key: 'Isha', name: 'العشاء', icon: '🌌', isObligatory: true },
    { key: 'Midnight', name: 'منتصف الليل', icon: '🌑', isSunnah: true },
    { key: 'Lastthird', name: 'الثلث الأخير', icon: '✨', isSunnah: true },
  ];

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      {/* 1. Header Location & Date Bar */}
      <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            {onNavigateHome && (
              <ScreenBackButton onClick={onNavigateHome} ariaLabel="الرجوع إلى الرئيسية" />
            )}
            <div>
              <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>الموقع الحالي</span>
              </div>
              <h2 className="text-base font-bold text-stone-900 dark:text-white mt-0.5">
                {location.label}
              </h2>
            </div>
          </div>

          <button
            onClick={onOpenLocationModal}
            className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-semibold text-[#d4af37] transition active:scale-95 shrink-0"
          >
            تغيير المدينة
          </button>
        </div>

        {prayerData && (
          <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>{prayerData.date.hijri.weekday.ar}، {prayerData.date.hijri.day} {prayerData.date.hijri.month.ar} {prayerData.date.hijri.year} هـ</span>
            </div>
            <div className="text-[11px] font-mono tabular-nums">
              {prayerData.date.gregorian.date} م
            </div>
          </div>
        )}
      </div>

      {/* 2. Calculation Method Quick Card */}
      <div className="rounded-2xl bg-stone-50 dark:bg-[#141414] border border-[#d4af37]/30 p-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-[#d4af37]">
              طريقة الحساب المعتمدة
            </span>
            <p className="text-xs font-semibold text-stone-800 dark:text-stone-200">
              {currentMethod.arabicName}
            </p>
          </div>

          <button
            onClick={() => setShowMethodModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#d4af37] text-stone-950 font-bold hover:bg-[#c5a059] text-xs font-semibold shadow-sm transition active:scale-95 shrink-0"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>تغيير الطريقة</span>
          </button>
        </div>
      </div>

      {/* 3. Next Prayer Banner if available */}
      {nextPrayer && (
        <div className="rounded-2xl bg-gradient-to-r from-[#1a1814] to-[#141414] border border-[#d4af37]/30 text-white p-3.5 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[11px] text-amber-300 font-bold">الأذان القادم</span>
            <h3 className="text-lg font-extrabold">{nextPrayer.nextPrayerArabic}</h3>
          </div>
          <div className="text-left font-mono tabular-nums" dir="ltr">
            <div className="text-lg font-black text-amber-300">
              {formatArabicTime(nextPrayer.nextPrayerTime, settings.timeFormat24)}
            </div>
            <div className="text-[11px] text-stone-300 font-sans">
              متبقي {nextPrayer.formattedCountdown.hours}س و {nextPrayer.formattedCountdown.minutes}د
            </div>
          </div>
        </div>
      )}

      {/* 4. Complete Prayers Timeline Table */}
      <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
          <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#d4af37]" />
            مواقيت الصلاة لليوم
          </h3>

          {/* 12h/24h Toggle */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl text-xs font-semibold">
            <button
              onClick={() => onUpdateTimeFormat(false)}
              className={`px-2 py-1 rounded-lg transition ${
                !settings.timeFormat24
                  ? 'bg-white dark:bg-stone-700 text-[#d4af37] shadow-sm'
                  : 'text-stone-500'
              }`}
            >
              12 ساعة
            </button>
            <button
              onClick={() => onUpdateTimeFormat(true)}
              className={`px-2 py-1 rounded-lg transition ${
                settings.timeFormat24
                  ? 'bg-white dark:bg-stone-700 text-[#d4af37] shadow-sm'
                  : 'text-stone-500'
              }`}
            >
              24 ساعة
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-stone-500 animate-pulse space-y-2">
            <div className="w-8 h-8 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin mx-auto" />
            <p>جاري تحديث مواقيت الصلاة من Aladhan API...</p>
          </div>
        ) : error ? (
          <div className="py-6 text-center text-xs text-rose-600 dark:text-rose-400 space-y-2">
            <p>{error}</p>
          </div>
        ) : prayerData ? (
          <div className="space-y-1.5">
            {prayerScheduleItems.map((item) => {
              const rawTime = prayerData.timings[item.key];
              if (!rawTime) return null;

              const isNext = nextPrayer?.nextPrayer === item.key;
              const formatted = formatArabicTime(rawTime, settings.timeFormat24);

              return (
                <div
                  key={item.key}
                  className={`flex items-center justify-between p-3 rounded-2xl transition ${
                    isNext
                      ? 'bg-[#d4af37] text-stone-950 font-bold shadow-md scale-[1.01]'
                      : 'hover:bg-stone-50 dark:hover:bg-stone-800/50 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base select-none">{item.icon}</span>
                    <div>
                      <span className={`text-sm ${isNext ? 'text-white font-black' : 'font-bold'}`}>
                        {item.name}
                      </span>
                      {isNext && (
                        <span className="mr-2 text-[10px] bg-amber-400 text-stone-950 font-bold px-2 py-0.5 rounded-full">
                          القادمة
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="font-mono text-base font-bold tabular-nums" dir="ltr">
                    {formatted}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* 5. Qibla Direction Compass Card */}
      <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-stone-900 dark:text-white">
              اتجاه القبلة نحو الكعبة المشرفة
            </h3>
          </div>
          <button
            onClick={() => setIsQiblaModalOpen(true)}
            className="flex items-center gap-1 text-xs font-bold text-[#d4af37] bg-stone-100 dark:bg-[#141414] px-2.5 py-1 rounded-xl border border-[#d4af37]/30 hover:bg-[#d4af37]/10 transition active:scale-95"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>البوصلة الحية</span>
          </button>
        </div>

        <div
          onClick={() => setIsQiblaModalOpen(true)}
          className="flex items-center gap-4 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800/70 transition"
        >
          {/* Compass Dial representation */}
          <div className="relative w-20 h-20 rounded-full border-2 border-dashed border-[#d4af37]/40 flex items-center justify-center shrink-0 bg-stone-100 dark:bg-stone-800">
            <div className="absolute top-1 text-[9px] font-bold text-stone-400">N</div>
            <div className="absolute bottom-1 text-[9px] font-bold text-stone-400">S</div>
            <div className="absolute right-1 text-[9px] font-bold text-stone-400">E</div>
            <div className="absolute left-1 text-[9px] font-bold text-stone-400">W</div>

            {/* Qibla Needle */}
            <div
              className="w-1 h-12 bg-gradient-to-t from-transparent via-amber-400 to-amber-600 rounded-full origin-center transition-transform duration-700"
              style={{ transform: `rotate(${qiblaAngle}deg)` }}
            />
            <div className="w-3 h-3 rounded-full bg-[#d4af37] border-2 border-amber-300 z-10" />
          </div>

          <div className="space-y-1 text-xs text-stone-600 dark:text-stone-300">
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900 dark:text-white">
                زاوية القبلة: {qiblaAngle}° من الشمال
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md">
                مستشعر الهاتف
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
              انقر لفتح البوصلة التفاعلية الحية التي تدور في الوقت الفعلي مع حركة وتدوير الهاتف.
            </p>
          </div>
        </div>
      </div>

      {/* Qibla Compass Real-Time Modal */}
      <QiblaCompassModal
        isOpen={isQiblaModalOpen}
        onClose={() => setIsQiblaModalOpen(false)}
        location={location}
      />

      {/* 6. Adhan Sound Test */}
      <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-4 shadow-sm flex items-center justify-between">
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-stone-900 dark:text-white">
            صوت الأذان (معاينة)
          </h4>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            استمع إلى نداء الصلاة الشريف
          </p>
        </div>

        {/* Real Audio of Adhan */}
        <audio
          ref={audioAdhanRef}
          src="https://media.sd.ma/assabile/adhan_37432/adhan_makkah.mp3"
          onEnded={() => setIsPlayingAdhan(false)}
          onError={() => setIsPlayingAdhan(false)}
        />

        <button
          onClick={handleToggleAdhan}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition active:scale-95 ${
            isPlayingAdhan
              ? 'bg-amber-500 text-white animate-pulse'
              : 'bg-[#d4af37] hover:bg-[#c5a059] text-stone-950 font-bold'
          }`}
        >
          {isPlayingAdhan ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>إيقاف الأذان</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>تشغيل الأذان</span>
            </>
          )}
        </button>
      </div>

      {/* Calculation Method Modal */}
      {showMethodModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full max-w-md max-h-[80vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                اختيار طريقة حساب المواقيت
              </h3>
              <button
                onClick={() => setShowMethodModal(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-sm font-semibold"
              >
                إغلاق
              </button>
            </div>

            <div className="overflow-y-auto p-4 space-y-2">
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">
                تختلف زوايا حساب الفجر والعشاء حسب الهيئة الشرعية أو الفلكية المعتمدة في كل بلد:
              </p>

              {CALCULATION_METHODS.map((method) => {
                const isSelected = method.id === settings.methodId;

                return (
                  <button
                    key={method.id}
                    onClick={() => {
                      onUpdateMethod(method.id);
                      setShowMethodModal(false);
                    }}
                    className={`w-full flex items-start justify-between p-3 rounded-2xl text-right transition ${
                      isSelected
                        ? 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40'
                        : 'hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{method.arabicName}</div>
                      {method.description && (
                        <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                          {method.description}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}

              {/* Juristic School (Asr) */}
              <div className="pt-3 mt-3 border-t border-stone-200 dark:border-stone-800">
                <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 mb-2">
                  المذهب الفقهي لحساب صلاة العصر:
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onUpdateAsrSchool('standard')}
                    className={`p-2.5 rounded-xl text-xs font-semibold transition ${
                      settings.asrSchool === 'standard'
                        ? 'bg-[#d4af37] text-stone-950 font-bold'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    الجمهور (شافعي، مالكي، حنبلي)
                  </button>
                  <button
                    onClick={() => onUpdateAsrSchool('hanafi')}
                    className={`p-2.5 rounded-xl text-xs font-semibold transition ${
                      settings.asrSchool === 'hanafi'
                        ? 'bg-[#d4af37] text-stone-950 font-bold'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    المذهب الحنفي
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
