import React, { useState, useMemo } from 'react';
import {
  X,
  Moon,
  Sparkles,
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

interface Props {
  isOpen: boolean;
  onClose: () => void;
  fajrTime?: string;
  maghribTime?: string;
  location?: LocationConfig;
  prayerData?: PrayerTimesResponse | null;
  inline?: boolean;
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
    // Parse base fajr & maghrib
    const [fajrH, fajrM] = fajrTime.split(':').map((n) => parseInt(n, 10));
    const [magH, magM] = maghribTime.split(':').map((n) => parseInt(n, 10));

    const weekdays = [
      'الأحد',
      'الإثنين',
      'الثلاثاء',
      'الأربعاء',
      'الخميس',
      'الجمعة',
      'السبت',
    ];

    const rows: ImsakiyaRow[] = [];
    const now = new Date();

    for (let day = 1; day <= 30; day++) {
      // Small seasonal progression: Fajr gets ~1 min earlier every 3 days, Maghrib ~1 min later
      const fajrDelta = -Math.floor((day - 1) / 3);
      const magDelta = Math.floor((day - 1) / 3);

      const totalFajrM = fajrH * 60 + fajrM + fajrDelta;
      const totalMagM = magH * 60 + magM + magDelta;

      const calcFajrH = Math.floor(totalFajrM / 60);
      const calcFajrM = totalFajrM % 60;

      const calcMagH = Math.floor(totalMagM / 60);
      const calcMagM = totalMagM % 60;

      const formattedFajr = `${calcFajrH.toString().padStart(2, '0')}:${calcFajrM
        .toString()
        .padStart(2, '0')}`;
      const formattedMaghrib = `${calcMagH.toString().padStart(2, '0')}:${calcMagM
        .toString()
        .padStart(2, '0')}`;

      // Weekday progression
      const dateForDay = new Date(now.getFullYear(), 2, day); // approximate Ramadan frame
      const weekdayAr = weekdays[(dateForDay.getDay() + day - 1) % 7];
      const gregorianDateStr = `${day} مارس`;

      rows.push({
        dayNumber: day,
        weekdayAr,
        gregorianDateStr,
        fajr: formattedFajr,
        maghrib: formattedMaghrib,
        isToday: day === currentRamadanDay,
      });
    }

    return rows;
  }, [fajrTime, maghribTime, currentRamadanDay]);

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
    <div className="w-full bg-[#071d16] text-[#fcfbf7] rounded-3xl shadow-2xl border border-[#dfb76c]/40 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
      {/* ========================================================
          1. TOP REGAL NIGHT HEADER WITH MOSQUE & WARM GLOW
         ======================================================== */}
      <div className="relative bg-gradient-to-b from-[#04120e] via-[#09251d] to-[#0d3429] p-4 sm:p-5 border-b border-[#dfb76c]/30 overflow-hidden shrink-0">
        {/* Background Stars / Sparkles */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <span className="absolute top-3 left-10 text-[#fef08a] text-xs">✦</span>
          <span className="absolute top-7 right-14 text-white text-[10px]">★</span>
          <span className="absolute top-12 left-1/3 text-[#dfb76c] text-[9px]">✦</span>
          <span className="absolute top-4 right-1/4 text-white text-xs">★</span>
        </div>

        {/* Close button */}
        {!inline && (
          <button
            onClick={onClose}
            className="absolute top-3.5 left-3.5 z-20 p-2 rounded-2xl bg-[#04120e]/80 hover:bg-white/10 text-stone-300 border border-white/10 transition active:scale-95"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        )}

          {/* Header Content */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#dfb76c]/20 border border-[#dfb76c]/40 text-[#dfb76c] text-[11px] font-bold">
                <Moon className="w-3.5 h-3.5" />
                <span>شهر القرآن والبركات</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                إمساكية شهر رمضان المبارك
              </h2>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-[#dfb76c]">
                <MapPin className="w-3.5 h-3.5" />
                <span className="font-semibold text-white">{cityName}</span>
                <span>•</span>
                <span className="text-stone-300">١٤٤٧ هـ - ٢٠٢٦ م</span>
              </div>
            </div>

            {/* Glowing Mosque Night Vector Stamp */}
            <div className="relative w-28 h-18 sm:w-36 sm:h-20 flex items-center justify-center">
              <svg viewBox="0 0 160 80" className="w-full h-full drop-shadow-[0_0_12px_rgba(223,183,108,0.4)]">
                {/* Night Glow */}
                <circle cx="80" cy="40" r="35" fill="#dfb76c" opacity="0.15" />
                {/* Crescent Moon */}
                <path d="M125 15 A 9 9 0 1 0 133 30 A 8 8 0 1 1 125 15 Z" fill="#fef08a" />
                {/* Minaret Left */}
                <rect x="25" y="25" width="8" height="55" fill="#061c16" />
                <path d="M25 25 L29 12 L33 25 Z" fill="#dfb76c" />
                <circle cx="29" cy="11" r="1.5" fill="#fef08a" />
                {/* Minaret Right */}
                <rect x="127" y="25" width="8" height="55" fill="#061c16" />
                <path d="M127 25 L131 12 L135 25 Z" fill="#dfb76c" />
                <circle cx="131" cy="11" r="1.5" fill="#fef08a" />
                {/* Central Grand Dome */}
                <path d="M50 80 L50 50 C50 30, 80 20, 80 20 C80 20, 110 30, 110 50 L110 80 Z" fill="#09261e" stroke="#dfb76c" strokeWidth="1.2" />
                <line x1="80" y1="20" x2="80" y2="10" stroke="#dfb76c" strokeWidth="1.5" />
                <circle cx="80" cy="9" r="1.5" fill="#fef08a" />
                {/* Illuminated Keyhole Door */}
                <path d="M72 80 L72 65 C72 60, 76 58, 80 58 C84 58, 88 60, 88 65 L88 80 Z" fill="#fef08a" opacity="0.85" />
              </svg>
            </div>
          </div>
        </div>

        {/* ========================================================
            2. FASTING SUMMARY CARDS & PROPHETIC DUAA
           ======================================================== */}
        <div className="p-3 sm:p-4 space-y-3 bg-[#061812] border-b border-[#dfb76c]/20 shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {/* Suhoor Card */}
            <div className="p-2.5 rounded-2xl bg-[#09251d] border border-[#dfb76c]/30 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-stone-300 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#dfb76c]" />
                  <span>السحور والإمساك (الفجر)</span>
                </span>
                <div className="text-base sm:text-lg font-black text-[#dfb76c] font-mono tabular-nums">
                  {fajrTime}
                </div>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#dfb76c]/20 text-[#dfb76c] font-bold">
                إمساك
              </span>
            </div>

            {/* Iftar Card */}
            <div className="p-2.5 rounded-2xl bg-[#09251d] border border-amber-500/40 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-stone-300 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>موعد الإفطار (المغرب)</span>
                </span>
                <div className="text-base sm:text-lg font-black text-amber-400 font-mono tabular-nums">
                  {maghribTime}
                </div>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                إفطار
              </span>
            </div>

            {/* Fasting Today Button */}
            <div className="col-span-2 sm:col-span-1 p-2 rounded-2xl bg-[#0d3429] border border-[#dfb76c]/30 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-stone-300">تسجيل صيام اليوم</span>
                <div className="text-xs font-bold text-white">
                  {fastingToday ? 'مُسجّل صائماً ✓' : 'هل أنت صائم اليوم؟'}
                </div>
              </div>
              <button
                onClick={handleToggleFasting}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                  fastingToday
                    ? 'bg-[#dfb76c] text-[#051711] shadow-md font-black'
                    : 'bg-white/10 hover:bg-white/20 text-stone-200'
                }`}
              >
                {fastingToday ? 'تم الصيام' : 'تسجيل'}
              </button>
            </div>
          </div>

          {/* Prophetic Duaa */}
          <div className="px-3 py-2 rounded-2xl bg-[#0b2b21] border border-[#dfb76c]/20 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-[#dfb76c] shrink-0 font-bold">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>دعاء الإفطار:</span>
            </div>
            <p
              style={{ fontFamily: 'var(--font-quran), Amiri, serif' }}
              className="text-stone-100 font-semibold truncate text-center sm:text-right"
            >
              «ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ»
            </p>
          </div>
        </div>

        {/* ========================================================
            3. LUXURIOUS IMSAKIYA TABLE (اليوم | رمضان | الميلادي | الفجر | المغرب)
           ======================================================== */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 no-scrollbar print:overflow-visible">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-xs font-bold text-[#dfb76c] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>جدول أيام الشهر الفضيل (٣٠ يوماً)</span>
            </span>
            <span className="text-[10px] text-stone-400">
              * تم تمييز اليوم الحالي وتأكيد وقتي السحور والإفطار
            </span>
          </div>

          <div className="rounded-2xl border border-[#dfb76c]/30 overflow-hidden shadow-md">
            {/* Table Header */}
            <div className="grid grid-cols-5 text-center text-xs font-black bg-[#04120e] text-[#dfb76c] py-2.5 px-1 border-b border-[#dfb76c]/30">
              <div>اليوم</div>
              <div>رمضان</div>
              <div>الميلادي</div>
              <div>الفجر (الإمساك)</div>
              <div>المغرب (الإفطار)</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-[#dfb76c]/15 text-xs">
              {imsakiyaDays.map((row) => (
                <div
                  key={row.dayNumber}
                  className={`grid grid-cols-5 text-center items-center py-2 px-1 transition-all ${
                    row.isToday
                      ? 'bg-gradient-to-r from-[#dfb76c]/30 via-[#0e3b2e] to-[#dfb76c]/25 text-white font-extrabold shadow-inner'
                      : row.dayNumber % 2 === 0
                      ? 'bg-[#09221a]/60 hover:bg-[#0c2f24]'
                      : 'bg-[#061812]/70 hover:bg-[#0c2f24]'
                  }`}
                >
                  {/* Weekday */}
                  <div className="flex items-center justify-center gap-1 font-semibold">
                    {row.isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#dfb76c] animate-pulse" />
                    )}
                    <span>{row.weekdayAr}</span>
                  </div>

                  {/* Ramadan Day Number */}
                  <div className="flex items-center justify-center">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold font-mono text-xs ${
                        row.isToday
                          ? 'bg-[#dfb76c] text-[#051711] shadow-xs'
                          : 'bg-white/10 text-[#dfb76c]'
                      }`}
                    >
                      {row.dayNumber}
                    </span>
                  </div>

                  {/* Gregorian Date */}
                  <div className="text-stone-300 font-mono text-[11px]">
                    {row.gregorianDateStr}
                  </div>

                  {/* Fajr (Suhoor) */}
                  <div className="font-mono font-bold text-[#dfb76c] tabular-nums">
                    {row.fajr}
                  </div>

                  {/* Maghrib (Iftar) */}
                  <div className="font-mono font-bold text-amber-400 tabular-nums">
                    {row.maghrib}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================
            4. BOTTOM CIRCULAR INTERACTIVE ACTION BUTTONS
           ======================================================== */}
        <div className="p-3 sm:p-4 bg-[#04120e] border-t border-[#dfb76c]/30 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-stone-300">
            <span className="font-bold text-white">إمساكية {cityName}</span>
            <span className="text-stone-500 mr-1.5">جاهزة للمشاركة والطباعة</span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Circular Button: WhatsApp Share */}
            <button
              onClick={handleShareWhatsApp}
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition active:scale-95"
              title="مشاركة الإمساكية عبر واتساب"
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Share2 className="w-3.5 h-3.5" />
              </div>
              <span className="hidden sm:inline">مشاركة عبر واتساب</span>
              <span className="sm:hidden">مشاركة</span>
            </button>

            {/* Circular Button: PDF Export / Print */}
            <button
              onClick={handlePrintPdf}
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-[#dfb76c] hover:bg-amber-400 text-stone-950 text-xs font-extrabold shadow-lg transition active:scale-95"
              title="تصدير وطباعة الإمساكية بصيغة PDF"
            >
              <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Printer className="w-3.5 h-3.5" />
              </div>
              <span className="hidden sm:inline">تصدير / طباعة PDF</span>
              <span className="sm:hidden">طباعة</span>
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
