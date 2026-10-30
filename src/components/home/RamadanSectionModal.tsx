import React, { useState, useMemo } from 'react';
import {
  X,
  Moon,
  Share2,
  Printer,
  Calendar,
  Clock,
  Check,
  MapPin,
  Heart,
  ChevronDown,
} from 'lucide-react';
import { RamadanFanousSvg } from './ServicesSvgIcons';
import { LocationConfig, PrayerTimesResponse } from '../../types';
import { ScreenBackButton } from '../common/ScreenBackButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  fajrTime?: string;
  maghribTime?: string;
  location?: LocationConfig;
  prayerData?: PrayerTimesResponse | null;
  inline?: boolean;
  isDark?: boolean;
}

interface ImsakiyaRow {
  dayNumber: number;
  weekdayAr: string;
  gregorianDateStr: string;
  fajr: string;
  maghrib: string;
  isToday: boolean;
}

export const RamadanSectionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  fajrTime = '04:48',
  maghribTime = '18:14',
  location,
  prayerData,
  inline = false,
  isDark = false,
}) => {
  const [fastingToday, setFastingToday] = useState(() => {
    return localStorage.getItem('noor_fasting_today') === 'true';
  });

  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);

  const cityName = location?.label?.split('(')[0]?.trim() || 'مكة المكرمة';

  // Check if current Hijri month is Ramadan (month 9)
  const isCurrentlyRamadan = prayerData?.date?.hijri?.month?.number === 9;
  const currentRamadanDay = isCurrentlyRamadan
    ? parseInt(prayerData?.date?.hijri?.day || '1', 10)
    : 1;

  // Generate 30 days of Ramadan Imsakiya
  const imsakiyaDays: ImsakiyaRow[] = useMemo(() => {
    const weekdays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const rows: ImsakiyaRow[] = [];

    const now = new Date();
    const baseFajrParts = fajrTime.split(':').map((v) => parseInt(v, 10));
    const baseMaghribParts = maghribTime.split(':').map((v) => parseInt(v, 10));

    const fajrBaseMinutes = (baseFajrParts[0] || 4) * 60 + (baseFajrParts[1] || 48);
    const maghribBaseMinutes = (baseMaghribParts[0] || 18) * 60 + (baseMaghribParts[1] || 14);

    for (let day = 1; day <= 30; day++) {
      const rowDate = new Date(now.getFullYear(), 2, day);
      const weekdayAr = weekdays[rowDate.getDay()];
      const dayDiff = day - (isCurrentlyRamadan ? currentRamadanDay : 1);

      const fMin = fajrBaseMinutes - Math.round(dayDiff * 0.7);
      const mMin = maghribBaseMinutes + Math.round(dayDiff * 0.5);

      const fH = Math.floor(fMin / 60);
      const fM = fMin % 60;
      const mH = Math.floor(mMin / 60);
      const mM = mMin % 60;

      const fStr = `${fH.toString().padStart(2, '0')}:${fM.toString().padStart(2, '0')}`;
      const mStr = `${mH.toString().padStart(2, '0')}:${mM.toString().padStart(2, '0')}`;

      rows.push({
        dayNumber: day,
        weekdayAr,
        gregorianDateStr: `${day} مارس`,
        fajr: fStr,
        maghrib: mStr,
        isToday: isCurrentlyRamadan ? day === currentRamadanDay : day === 1,
      });
    }

    return rows;
  }, [fajrTime, maghribTime, isCurrentlyRamadan, currentRamadanDay]);

  if (!isOpen) return null;

  const handleToggleFasting = () => {
    const next = !fastingToday;
    setFastingToday(next);
    localStorage.setItem('noor_fasting_today', next ? 'true' : 'false');
  };

  // WhatsApp Share Handler
  const handleShareWhatsApp = () => {
    const text = `🌙 *إمساكية شهر رمضان المبارك*\n📍 المدينة: *${cityName}*\n\n` +
      `📅 مواقيت الصيام:\n` +
      `• الفجر (الإمساك والسحور): ${fajrTime}\n` +
      `• المغرب (موعد الإفطار): ${maghribTime}\n\n` +
      `«ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ»\n\n` +
      `من تطبيق *أثَر | Athar - رفيق المسلم* ✨`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // PDF Export / Print Handler
  const handlePrintPdf = () => {
    window.print();
  };

  const modalContent = (
    <div
      className={`w-full rounded-3xl shadow-2xl border flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 ${
        isDark
          ? 'bg-[#141414] text-[#fcfbf7] border-[#d4af37]/40'
          : 'bg-[#faf8f5] text-stone-900 border-[#d4af37]/35 shadow-xl'
      }`}
    >
      {/* 1. Header with Mosque and Title */}
      <div
        className={`relative p-4 sm:p-5 border-b overflow-hidden shrink-0 ${
          isDark
            ? 'bg-gradient-to-b from-[#0a0a0a] via-[#141414] to-[#1a1814] border-[#d4af37]/30 text-white'
            : 'bg-gradient-to-b from-white via-[#faf8f5] to-[#f4f1ea] border-[#d4af37]/25 text-stone-900'
        }`}
      >
        {/* Back / Exit button */}
        {!inline && (
          <div className="absolute top-3.5 left-3.5 z-20">
            <ScreenBackButton onClick={onClose} ariaLabel="خروج" />
          </div>
        )}

        {/* Header Content */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
          <div className="space-y-1">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold border ${
                isDark
                  ? 'bg-[#dfb76c]/20 border-[#dfb76c]/40 text-[#dfb76c]'
                  : 'bg-[#eef2e6] border-[#2e4426]/20 text-[#2e4426]'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>شهر القرآن والبركات</span>
            </div>
            <h2
              className={`text-xl sm:text-2xl font-black tracking-tight ${
                isDark ? 'text-white' : 'text-[#2e4426]'
              }`}
            >
              إمساكية شهر رمضان المبارك
            </h2>
            <div
              className={`flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold ${
                isDark ? 'text-[#dfb76c]' : 'text-stone-600'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{cityName}</span>
              <span>•</span>
              <span>١٤٤٧ هـ - ٢٠٢٦ م</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Fasting Summary Cards & Prophetic Duaa */}
      <div
        className={`p-3 sm:p-4 space-y-3 border-b shrink-0 ${
          isDark
            ? 'bg-[#161616] border-[#dfb76c]/20'
            : 'bg-[#f4f2ec] border-[#d4af37]/20'
        }`}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {/* Suhoor Card */}
          <div
            className={`p-2.5 rounded-2xl border flex items-center justify-between ${
              isDark
                ? 'bg-[#1a1814] border-[#dfb76c]/30 text-white'
                : 'bg-white border-stone-200 text-stone-800 shadow-2xs'
            }`}
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-stone-400 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#d4af37]" />
                <span>السحور والإمساك (الفجر)</span>
              </span>
              <div
                className={`text-base sm:text-lg font-black font-mono tabular-nums ${
                  isDark ? 'text-[#d4af37]' : 'text-[#2e4426]'
                }`}
              >
                {fajrTime}
              </div>
            </div>
            <span
              className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                isDark ? 'bg-[#dfb76c]/20 text-[#dfb76c]' : 'bg-[#eef2e6] text-[#2e4426]'
              }`}
            >
              إمساك
            </span>
          </div>

          {/* Iftar Card */}
          <div
            className={`p-2.5 rounded-2xl border flex items-center justify-between ${
              isDark
                ? 'bg-[#1a1814] border-amber-500/40 text-white'
                : 'bg-white border-stone-200 text-stone-800 shadow-2xs'
            }`}
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-stone-400 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-500" />
                <span>موعد الإفطار (المغرب)</span>
              </span>
              <div
                className={`text-base sm:text-lg font-black font-mono tabular-nums ${
                  isDark ? 'text-amber-400' : 'text-[#2e4426]'
                }`}
              >
                {maghribTime}
              </div>
            </div>
            <span
              className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-800'
              }`}
            >
              إفطار
            </span>
          </div>

          {/* Fasting Today Button */}
          <div
            className={`col-span-2 sm:col-span-1 p-2 rounded-2xl border flex items-center justify-between ${
              isDark
                ? 'bg-[#1a1814] border-[#dfb76c]/30 text-white'
                : 'bg-white border-stone-200 text-stone-800 shadow-2xs'
            }`}
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-stone-400">تسجيل صيام اليوم</span>
              <div
                className={`text-xs font-bold ${
                  isDark ? 'text-white' : 'text-stone-900'
                }`}
              >
                {fastingToday ? 'مُسجّل صائماً ✓' : 'هل أنت صائم اليوم؟'}
              </div>
            </div>
            <button
              onClick={handleToggleFasting}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                fastingToday
                  ? isDark
                    ? 'bg-[#dfb76c] text-[#051711] shadow-md font-black'
                    : 'bg-[#2e4426] text-white shadow-md font-black'
                  : isDark
                  ? 'bg-white/10 hover:bg-white/20 text-stone-200'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {fastingToday ? 'تم الصيام' : 'تسجيل'}
            </button>
          </div>
        </div>

        {/* Prophetic Duaa */}
        <div
          className={`px-3 py-2 rounded-2xl border flex items-center justify-between gap-2 text-xs ${
            isDark
              ? 'bg-[#1a1814] border-[#dfb76c]/20 text-white'
              : 'bg-white border-stone-200 text-stone-800 shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-1.5 text-[#d4af37] shrink-0 font-bold">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>دعاء الإفطار:</span>
          </div>
          <p
            style={{ fontFamily: 'var(--font-quran), Amiri, serif' }}
            className={`font-semibold truncate text-center sm:text-right ${
              isDark ? 'text-stone-100' : 'text-stone-900'
            }`}
          >
            «ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ»
          </p>
        </div>
      </div>

      {/* 3. Imsakiya Table */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 no-scrollbar print:overflow-visible">
        <div className="flex items-center justify-between px-1 mb-1">
          <span
            className={`text-xs font-bold flex items-center gap-1.5 ${
              isDark ? 'text-[#dfb76c]' : 'text-[#2e4426]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>جدول أيام الشهر الفضيل (٣٠ يوماً)</span>
          </span>
          <span className="text-[10px] text-stone-400">
            * تأكيد وقتي السحور والإفطار
          </span>
        </div>

        <div
          className={`rounded-2xl border overflow-hidden shadow-xs ${
            isDark ? 'border-[#d4af37]/30 bg-[#141414]' : 'border-stone-200 bg-white'
          }`}
        >
          {/* Table Header */}
          <div
            className={`grid grid-cols-5 text-center text-xs font-black py-2.5 px-1 border-b ${
              isDark
                ? 'bg-[#0a0a0a] text-[#d4af37] border-[#d4af37]/30'
                : 'bg-[#f4f2ec] text-[#2e4426] border-stone-200'
            }`}
          >
            <div>اليوم</div>
            <div>رمضان</div>
            <div>الميلادي</div>
            <div>الفجر (الإمساك)</div>
            <div>المغرب (الإفطار)</div>
          </div>

          {/* Table Rows */}
          <div
            className={`divide-y text-xs ${
              isDark ? 'divide-[#d4af37]/15' : 'divide-stone-100'
            }`}
          >
            {imsakiyaDays.map((row) => (
              <div
                key={row.dayNumber}
                className={`grid grid-cols-5 text-center items-center py-2 px-1 transition-all ${
                  row.isToday
                    ? isDark
                      ? 'bg-gradient-to-r from-[#d4af37]/30 via-[#1a1814] to-[#d4af37]/25 text-white font-extrabold'
                      : 'bg-gradient-to-r from-[#eef2e6] via-white to-[#eef2e6] text-[#2e4426] font-black'
                    : isDark
                    ? row.dayNumber % 2 === 0
                      ? 'bg-[#141414]/90'
                      : 'bg-[#0a0a0a]/90'
                    : row.dayNumber % 2 === 0
                    ? 'bg-white'
                    : 'bg-[#faf8f5]'
                }`}
              >
                {/* Weekday */}
                <div className="flex items-center justify-center gap-1 font-semibold">
                  {row.isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                  )}
                  <span>{row.weekdayAr}</span>
                </div>

                {/* Ramadan Day Number */}
                <div className="flex items-center justify-center">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold font-mono text-xs ${
                      row.isToday
                        ? 'bg-[#d4af37] text-stone-950 shadow-xs'
                        : isDark
                        ? 'bg-white/10 text-[#d4af37]'
                        : 'bg-stone-100 text-[#2e4426]'
                    }`}
                  >
                    {row.dayNumber}
                  </span>
                </div>

                {/* Gregorian Date */}
                <div
                  className={`font-mono text-[11px] ${
                    isDark ? 'text-stone-300' : 'text-stone-500'
                  }`}
                >
                  {row.gregorianDateStr}
                </div>

                {/* Fajr */}
                <div
                  className={`font-mono font-bold tabular-nums ${
                    isDark ? 'text-[#d4af37]' : 'text-[#2e4426]'
                  }`}
                >
                  {row.fajr}
                </div>

                {/* Maghrib */}
                <div
                  className={`font-mono font-bold tabular-nums ${
                    isDark ? 'text-amber-400' : 'text-[#8c6b2d]'
                  }`}
                >
                  {row.maghrib}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Action buttons */}
      <div
        className={`p-3 sm:p-4 border-t flex items-center justify-between gap-3 shrink-0 ${
          isDark
            ? 'bg-[#0a0a0a] border-[#d4af37]/30 text-stone-300'
            : 'bg-white border-stone-200 text-stone-800'
        }`}
      >
        <div className="text-xs">
          <span className={`font-bold ${isDark ? 'text-white' : 'text-[#2e4426]'}`}>
            إمساكية {cityName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareWhatsApp}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition active:scale-95 ${
              isDark
                ? 'bg-[#d4af37] text-stone-950 hover:bg-[#c5a059]'
                : 'bg-[#2e4426] text-white hover:bg-[#3b5531]'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>مشاركة</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition active:scale-95 ${
              isDark
                ? 'bg-[#1a1814] text-[#d4af37] border border-[#d4af37]/40'
                : 'bg-stone-100 text-stone-800 border border-stone-200'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (inline) {
    return <div className="space-y-4 pb-12 animate-in fade-in duration-200">{modalContent}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[94vh] overflow-y-auto no-scrollbar">
        {modalContent}
      </div>
    </div>
  );
};
