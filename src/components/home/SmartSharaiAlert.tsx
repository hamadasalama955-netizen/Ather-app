import React from 'react';
import { AlertCircle, Moon, Sun, Clock, Info } from 'lucide-react';
import { PrayerTimesResponse } from '../../types';
import { cleanTimeString, parseTimeToDate } from '../../utils/prayerUtils';

interface Props {
  prayerData: PrayerTimesResponse | null;
  now: Date;
}

export interface SharaiStatus {
  type: 'nahy' | 'duaa' | 'duha' | 'night_prayer' | 'athkar_morning' | 'athkar_evening' | 'general';
  title: string;
  description: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: 'warning' | 'gold' | 'amber' | 'night';
}

export function getSharaiStatus(prayerData: PrayerTimesResponse | null, now: Date): SharaiStatus {
  if (!prayerData || !prayerData.timings) {
    return {
      type: 'general',
      title: 'ألا بذكر الله تطمئن القلوب',
      description: 'حافظ على صلواتك في وقتها واغتنم أوقات الاستجابة والذكر',
      badge: 'فائدة شرعية',
      icon: Info,
      tone: 'gold',
    };
  }

  const timings = prayerData.timings;
  const nowMs = now.getTime();

  // Helper to get today's Date from "HH:mm"
  const getTime = (key: string): Date | null => {
    if (!timings[key]) return null;
    return parseTimeToDate(cleanTimeString(timings[key]), now);
  };

  const fajr = getTime('Fajr');
  const sunrise = getTime('Sunrise');
  const dhuhr = getTime('Dhuhr');
  const asr = getTime('Asr');
  const maghrib = getTime('Maghrib');
  const isha = getTime('Isha');

  // Calculate Last Third of the Night
  // Night starts at Maghrib and ends at next Fajr
  let lastThirdDate: Date | null = null;
  if (maghrib && fajr) {
    const nextFajr = new Date(fajr);
    if (nowMs >= maghrib.getTime()) {
      nextFajr.setDate(nextFajr.getDate() + 1);
      const nightDuration = nextFajr.getTime() - maghrib.getTime();
      lastThirdDate = new Date(maghrib.getTime() + (nightDuration * 2) / 3);
    } else {
      const prevMaghrib = new Date(maghrib);
      prevMaghrib.setDate(prevMaghrib.getDate() - 1);
      const nightDuration = fajr.getTime() - prevMaghrib.getTime();
      lastThirdDate = new Date(prevMaghrib.getTime() + (nightDuration * 2) / 3);
    }
  }

  // 1. Check: Between Adhan and Iqamah (within 20 minutes after any 5 Fard prayers)
  const prayers = [
    { name: 'الفجر', date: fajr },
    { name: 'الظهر', date: dhuhr },
    { name: 'العصر', date: asr },
    { name: 'المغرب', date: maghrib },
    { name: 'العشاء', date: isha },
  ];

  for (const p of prayers) {
    if (p.date) {
      const pTime = p.date.getTime();
      // Between prayer call and 20 mins later
      if (nowMs >= pTime && nowMs <= pTime + 20 * 60 * 1000) {
        return {
          type: 'duaa',
          title: `وقت استجابة بعد أذان ${p.name}`,
          description: '«الدعاء لا يُرد بين الأذان والإقامة» — اغتنم هذه الدقائق المباركة بالدعاء والتضرع والذكر',
          badge: 'وقت إجابة',
          icon: Clock,
          tone: 'amber',
        };
      }
    }
  }

  // 2. Check: Prohibition time after Asr until Maghrib
  if (asr && maghrib && nowMs > asr.getTime() + 20 * 60 * 1000 && nowMs < maghrib.getTime()) {
    const minsToSunset = Math.max(1, Math.round((maghrib.getTime() - nowMs) / (60 * 1000)));
    return {
      type: 'nahy',
      title: 'وقت نهي عن صلاة النفل (بعد العصر)',
      description: `يُكره ويحرم التطوع غير ذوات الأسباب حتى تغرب الشمس (باقٍ ${minsToSunset} دقيقة حتى المغرب). ويُستحب الاشتغال بالذكر وقراءة القرآن.`,
      badge: 'تنبيه شرعي',
      icon: AlertCircle,
      tone: 'warning',
    };
  }

  // 3. Check: Prohibition time before Dhuhr (solar zenith - 15 minutes before Dhuhr)
  if (dhuhr && nowMs >= dhuhr.getTime() - 15 * 60 * 1000 && nowMs < dhuhr.getTime()) {
    return {
      type: 'nahy',
      title: 'وقت نهي عند قيام الشمس في كبد السماء',
      description: 'نهى النبي ﷺ عن الصلاة حين يقوم قائم الظهيرة حتى تزول الشمس ويدخل وقت الظهر.',
      badge: 'تنبيه شرعي',
      icon: AlertCircle,
      tone: 'warning',
    };
  }

  // 4. Check: Prohibition time after Fajr until Sunrise + 15 mins (قيد رمح)
  if (fajr && sunrise) {
    const sunriseShuruqPlus15 = sunrise.getTime() + 15 * 60 * 1000;
    if (nowMs >= fajr.getTime() + 20 * 60 * 1000 && nowMs <= sunriseShuruqPlus15) {
      return {
        type: 'nahy',
        title: 'وقت نهي عن النفل بعد الفجر',
        description: 'يُنهى عن صلاة التطوع بعد الفجر حتى تطلع الشمس وترتفع قيد رمح (حوالي ربع ساعة بعد الشروق).',
        badge: 'تنبيه شرعي',
        icon: AlertCircle,
        tone: 'warning',
      };
    }
  }

  // 5. Check: Duha prayer window (15 mins after Sunrise until 15 mins before Dhuhr)
  if (sunrise && dhuhr) {
    const duhaStart = sunrise.getTime() + 15 * 60 * 1000;
    const duhaEnd = dhuhr.getTime() - 15 * 60 * 1000;
    if (nowMs >= duhaStart && nowMs <= duhaEnd) {
      return {
        type: 'duha',
        title: 'وقت صلاة الضحى مفتوح (صلاة الأوّابين)',
        description: '«يُصبح على كل سُلامى من أحدكم صدقة... ويُجزئ من ذلك ركعتان يركعهما من الضحى».',
        badge: 'سنة مؤكدة',
        icon: Sun,
        tone: 'gold',
      };
    }
  }

  // 6. Check: Last Third of the Night (وقت السحر والتنزل الإلهي)
  if (fajr && lastThirdDate) {
    if (nowMs >= lastThirdDate.getTime() && nowMs < fajr.getTime()) {
      return {
        type: 'night_prayer',
        title: 'الثلث الأخير من الليل — وقت التنزل الإلهي',
        description: '«ينزل ربنا تبارك وتعالى كل ليلة حين يبقى ثلث الليل الآخر فيقول: من يدعوني فأستجيب له، من يسألني فأعطيه، من يستغفرني فأغفر له».',
        badge: 'قيام الليل',
        icon: Moon,
        tone: 'night',
      };
    }
  }

  // 7. Evening Athkar window (from Asr to Maghrib/Isha)
  if (asr && isha && nowMs >= asr.getTime() && nowMs < isha.getTime()) {
    return {
      type: 'athkar_evening',
      title: 'وقت أذكار المساء وحفظ النفس',
      description: 'أذكار المساء حصن حصين وسكينة للقلب — احرص على آية الكرسي والمعوذات ودعاء المساء.',
      badge: 'أذكار المساء',
      icon: Clock,
      tone: 'amber',
    };
  }

  // 8. Default fallback
  return {
    type: 'general',
    title: '«ألا بذكر الله تطمئن القلوب»',
    description: 'احرص على إسباغ الوضوء وحضور القلب في الصلاة وملازمة الاستغفار في سائر يومك.',
    badge: 'تذكرة مباركة',
    icon: Info,
    tone: 'gold',
  };
}

export const SmartSharaiAlert: React.FC<Props> = ({ prayerData, now }) => {
  const status = getSharaiStatus(prayerData, now);
  const IconComponent = status.icon;

  const toneStyles = {
    warning: {
      card: 'bg-amber-950/10 dark:bg-[#141414] border-amber-600/30 dark:border-amber-500/30 text-stone-900 dark:text-amber-100',
      badge: 'bg-amber-600/15 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-600/30',
      iconBg: 'bg-amber-500/20 text-amber-700 dark:text-amber-300',
    },
    amber: {
      card: 'bg-[#faf8f5] dark:bg-[#141414] border-[#d4af37]/30 text-stone-900 dark:text-[#f5e6b8]',
      badge: 'bg-[#d4af37]/15 dark:bg-[#d4af37]/20 text-[#8c6b2d] dark:text-[#d4af37] border-[#d4af37]/30',
      iconBg: 'bg-[#d4af37]/20 text-[#d4af37]',
    },
    gold: {
      card: 'bg-[#faf8f5] dark:bg-[#141414] border-[#d4af37]/30 text-stone-900 dark:text-[#f5e6b8]',
      badge: 'bg-[#d4af37]/15 dark:bg-[#d4af37]/20 text-[#8c6b2d] dark:text-[#d4af37] border-[#d4af37]/30',
      iconBg: 'bg-[#d4af37]/20 text-[#d4af37]',
    },
    night: {
      card: 'bg-[#faf8f5] dark:bg-[#141414] border-[#d4af37]/35 text-stone-900 dark:text-[#f5e6b8] shadow-sm',
      badge: 'bg-[#d4af37]/20 text-[#8c6b2d] dark:text-[#d4af37] border-[#d4af37]/35 font-bold',
      iconBg: 'bg-[#d4af37]/20 text-[#d4af37]',
    },
  }[status.tone];

  return (
    <div
      className={`rounded-2xl p-3 border transition-all duration-300 backdrop-blur-xs flex items-start gap-2.5 ${toneStyles.card}`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${toneStyles.iconBg}`}>
        <IconComponent className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${toneStyles.badge}`}>
            {status.badge}
          </span>
          <h4 className="text-xs font-bold truncate">
            {status.title}
          </h4>
        </div>
        <p className="text-[11px] leading-relaxed opacity-90 font-medium">
          {status.description}
        </p>
      </div>
    </div>
  );
};
