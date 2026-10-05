import React, { useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Sun,
  Moon,
  Sunset,
  Sunrise,
  CheckCircle2,
  Circle,
  ListTodo,
} from 'lucide-react';
import { PrayerLog } from '../../types';

interface Props {
  log: PrayerLog;
  onUpdateLog: (updated: Partial<PrayerLog>) => void;
}

export const DailyPrayerCard: React.FC<Props> = ({ log, onUpdateLog }) => {
  const [showSunan, setShowSunan] = useState(false);

  const toggle = (field: keyof PrayerLog) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
    onUpdateLog({ [field]: !log[field] });
  };

  const fardList: {
    key: keyof PrayerLog;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    rakaat: string;
    timeHint: string;
  }[] = [
    { key: 'fajr', label: 'صلاة الفجر', icon: Sunrise, rakaat: 'ركعتان جهراً', timeHint: 'من طلوع الفجر الصادق' },
    { key: 'dhuhr', label: 'صلاة الظهر', icon: Sun, rakaat: '4 ركعات سراً', timeHint: 'عند زوال الشمس' },
    { key: 'asr', label: 'صلاة العصر', icon: Sun, rakaat: '4 ركعات سراً', timeHint: 'الصلاة الوسطى' },
    { key: 'maghrib', label: 'صلاة المغرب', icon: Sunset, rakaat: '3 ركعات', timeHint: 'عند غروب قرص الشمس' },
    { key: 'isha', label: 'صلاة العشاء', icon: Moon, rakaat: '4 ركعات', timeHint: 'بعد مغيب الشفق الأحمر' },
  ];

  const rawatibList: { key: keyof PrayerLog; label: string; detail: string; rakaat: string }[] = [
    { key: 'fajrSunnah', label: 'سنة الفجر القبلية', detail: 'ركعتا الفجر خير من الدنيا وما فيها', rakaat: 'ركعتان' },
    { key: 'dhuhrSunnahBefore', label: 'سنة الظهر القبلية', detail: 'أربع ركعات بتسليمتين قبل الظهر', rakaat: '4 ركعات' },
    { key: 'dhuhrSunnahAfter', label: 'سنة الظهر البعدية', detail: 'ركعتان بعد صلاة الظهر', rakaat: 'ركعتان' },
    { key: 'maghribSunnah', label: 'سنة المغرب البعدية', detail: 'ركعتان بعد صلاة المغرب', rakaat: 'ركعتان' },
    { key: 'ishaSunnah', label: 'سنة العشاء البعدية', detail: 'ركعتان بعد صلاة العشاء', rakaat: 'ركعتان' },
  ];

  const nawafilList: { key: keyof PrayerLog; label: string; detail: string; rakaat: string }[] = [
    { key: 'duha', label: 'صلاة الضحى', detail: 'صلاة الأوابين بعد الشروق بربع ساعة', rakaat: 'ركعتان فأكثر' },
    { key: 'witr', label: 'صلاة الوتر', detail: 'ختام صلاة الليل، أوتروا يا أهل القرآن', rakaat: 'ركعة أو 3' },
  ];

  const fardCompleted = fardList.filter((p) => log[p.key]).length;
  const rawatibCompleted = rawatibList.filter((p) => log[p.key]).length;
  const nawafilCompleted = nawafilList.filter((p) => log[p.key]).length;
  const allFardDone = fardCompleted === 5;

  return (
    <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header with modern checklist progress */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold">
              <ListTodo className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-stone-900 dark:text-white">
                قائمة متابعة صلوات اليوم
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                قائمة مهام تفاعلية لتثبيت الفروض والسنن
              </p>
            </div>
          </div>
        </div>

        <div className="text-left">
          <span
            className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
              allFardDone
                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
            }`}
          >
            {allFardDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : null}
            <span>{fardCompleted} من 5 فروض</span>
          </span>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-teal-500 via-emerald-500 to-amber-400 rounded-full transition-all duration-300"
          style={{ width: `${(fardCompleted / 5) * 100}%` }}
        />
      </div>

      {/* Modern Checklist: 5 Fard Prayers */}
      <div className="space-y-2">
        {fardList.map((item) => {
          const isDone = Boolean(log[item.key]);
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              onClick={() => toggle(item.key)}
              className={`w-full p-3 rounded-2xl border text-right transition-all duration-200 active:scale-[0.99] flex items-center justify-between gap-3 ${
                isDone
                  ? 'bg-teal-50/70 dark:bg-teal-950/30 border-teal-500/40 text-stone-900 dark:text-white shadow-xs'
                  : 'bg-stone-50/80 dark:bg-stone-800/40 border-stone-200/80 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100/70'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Modern Interactive Checkbox Indicator */}
                <div
                  className={`w-6 h-6 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 ${
                    isDone
                      ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30 scale-105'
                      : 'border-2 border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800'
                  }`}
                >
                  {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold ${
                        isDone
                          ? 'text-teal-900 dark:text-teal-200 line-through decoration-teal-600/60 decoration-2'
                          : 'text-stone-900 dark:text-white'
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium">({item.rakaat})</span>
                  </div>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
                    {item.timeHint}
                  </div>
                </div>
              </div>

              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isDone
                    ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Sunan & Nawafil Checklist Accordion */}
      <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
        <button
          onClick={() => setShowSunan(!showSunan)}
          className="w-full flex items-center justify-between py-2 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-teal-700 dark:hover:text-teal-400 transition"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>السنن الرواتب والنوافل (الوتر والضحى)</span>
            <span className="text-[11px] font-normal text-stone-500">
              ({rawatibCompleted + nawafilCompleted}/7 مكتملة)
            </span>
          </div>
          {showSunan ? (
            <ChevronUp className="w-4 h-4 text-stone-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-stone-400" />
          )}
        </button>

        {showSunan && (
          <div className="mt-3 space-y-3 animate-in fade-in duration-200">
            {/* Sunan Hadith Reminder */}
            <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
              قال رسول الله ﷺ: <strong>«مَا مِنْ عَبْدٍ مُسْلِمٍ يُصَلِّي لِلَّهِ كُلَّ يَوْمٍ ثِنْتَيْ عَشْرَةَ رَكْعَةً تَطَوُّعًا غَيْرَ فَرِيضَةٍ، إِلَّا بَنَى اللَّهُ لَهُ بَيْتًا فِي الْجَنَّةِ»</strong> [رواه مسلم]
            </div>

            {/* Rawatib Checklist */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-stone-500 dark:text-stone-400 px-1">
                السنن الرواتب الاثنتا عشرة:
              </div>
              {rawatibList.map((item) => {
                const isDone = Boolean(log[item.key]);
                return (
                  <button
                    key={item.key}
                    onClick={() => toggle(item.key)}
                    className={`w-full min-h-[44px] flex items-center justify-between p-2.5 rounded-xl border text-right transition active:scale-[0.99] ${
                      isDone
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/50 text-emerald-950 dark:text-emerald-200'
                        : 'bg-stone-50/70 dark:bg-stone-800/40 border-stone-200/60 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : 'border-2 border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800'
                        }`}
                      >
                        {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold">{item.label} ({item.rakaat})</div>
                        <div className="text-[10px] text-stone-500 dark:text-stone-400">{item.detail}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Nawafil: Duha & Witr */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-bold text-stone-500 dark:text-stone-400 px-1">
                صلاة الضحى والوتر:
              </div>
              {nawafilList.map((item) => {
                const isDone = Boolean(log[item.key]);
                return (
                  <button
                    key={item.key}
                    onClick={() => toggle(item.key)}
                    className={`w-full min-h-[44px] flex items-center justify-between p-2.5 rounded-xl border text-right transition active:scale-[0.99] ${
                      isDone
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500/50 text-amber-950 dark:text-amber-200'
                        : 'bg-stone-50/70 dark:bg-stone-800/40 border-stone-200/60 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isDone
                            ? 'bg-amber-500 text-stone-950'
                            : 'border-2 border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800'
                        }`}
                      >
                        {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold">{item.label} ({item.rakaat})</div>
                        <div className="text-[10px] text-stone-500 dark:text-stone-400">{item.detail}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
