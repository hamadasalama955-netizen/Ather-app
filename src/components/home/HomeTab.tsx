import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Play,
  Pause,
  Copy,
  Check,
  RefreshCw,
  MapPin,
  Calendar,
  Clock,
  ChevronLeft,
} from 'lucide-react';
import {
  PrayerTimesResponse,
  AyahData,
  NavigationTab,
  LocationConfig,
} from '../../types';
import {
  calculateNextPrayer,
  getDailyPrayerList,
  formatArabicTime,
  cleanTimeString,
  parseTimeToDate,
} from '../../utils/prayerUtils';
import { fetchTodayAyah, fetchRandomAyah } from '../../services/quranApi';
import { MosqueTimeScene, TimeOfDayPeriod } from './MosqueTimeScene';
import { SmartSharaiAlert } from './SmartSharaiAlert';
import { PrayerTimelineStrip } from './PrayerTimelineStrip';
import { QuickAccessGrid } from './QuickAccessGrid';
import { PrayerVirtueCard } from './PrayerVirtueCard';
import { HomeTopBar } from './HomeTopBar';
import { ServicesGridModal } from './ServicesGridModal';
import { ShareForRewardModal } from './ShareForRewardModal';
import { toArabicDigits } from '../quran/MushafIlluminatedBorder';
import { IslamicHistoryModal } from './IslamicHistoryModal';
import { RamadanSectionModal } from './RamadanSectionModal';
import { QiblaCompassModal } from './QiblaCompassModal';
import { DuasComprehensiveModal } from './DuasComprehensiveModal';
import { QuranIntroModal } from './QuranIntroModal';
import { AllahNamesModal } from './AllahNamesModal';
import { HisnMuslimModal } from './HisnMuslimModal';
import { InstallAtharBanner } from '../common/InstallAtharBanner';

interface Props {
  prayerData: PrayerTimesResponse | null;
  isLoadingPrayers: boolean;
  prayerError: string | null;
  location: LocationConfig;
  onNavigateTab: (tab: NavigationTab) => void;
  onOpenLocationModal: () => void;
  is24h: boolean;
  onOpenTracker?: (subView: any) => void;
  onOpenAthkar?: (subTab: 'athkar' | 'sebha') => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

/**
 * Computes whether the current moment corresponds to:
 * 'fajr' (dawn), 'day' (sunrise to late afternoon), 'sunset' (golden twilight), or 'night' (night & tahajjud)
 */
function determineTimePeriod(prayerData: PrayerTimesResponse | null, now: Date): TimeOfDayPeriod {
  if (!prayerData || !prayerData.timings) {
    const hour = now.getHours();
    if (hour >= 4 && hour < 6) return 'fajr';
    if (hour >= 6 && hour < 8) return 'sunrise';
    if (hour >= 8 && hour < 15) return 'dhuhr';
    if (hour >= 15 && hour < 18) return 'asr';
    if (hour >= 18 && hour < 20) return 'maghrib';
    return 'night';
  }

  const timings = prayerData.timings;
  const nowMs = now.getTime();

  const fajrDate = parseTimeToDate(cleanTimeString(timings.Fajr), now);
  const sunriseDate = parseTimeToDate(cleanTimeString(timings.Sunrise), now);
  const dhuhrDate = parseTimeToDate(cleanTimeString(timings.Dhuhr), now);
  const asrDate = parseTimeToDate(cleanTimeString(timings.Asr), now);
  const maghribDate = parseTimeToDate(cleanTimeString(timings.Maghrib), now);
  const ishaDate = parseTimeToDate(cleanTimeString(timings.Isha), now);

  // 1. Fajr: From 45 mins before Fajr until Sunrise
  if (nowMs >= fajrDate.getTime() - 45 * 60 * 1000 && nowMs < sunriseDate.getTime()) {
    return 'fajr';
  }

  // 2. Sunrise: From Sunrise until 60 mins after Sunrise
  if (nowMs >= sunriseDate.getTime() && nowMs < sunriseDate.getTime() + 60 * 60 * 1000) {
    return 'sunrise';
  }

  // 3. Dhuhr: From morning after sunrise until Asr
  if (nowMs >= sunriseDate.getTime() + 60 * 60 * 1000 && nowMs < asrDate.getTime()) {
    return 'dhuhr';
  }

  // 4. Asr: From Asr until 20 mins before Maghrib
  if (nowMs >= asrDate.getTime() && nowMs < maghribDate.getTime() - 20 * 60 * 1000) {
    return 'asr';
  }

  // 5. Maghrib: From 20 mins before Maghrib until Isha
  if (nowMs >= maghribDate.getTime() - 20 * 60 * 1000 && nowMs < ishaDate.getTime()) {
    return 'maghrib';
  }

  // 6. Night: Isha until Fajr
  return 'night';
}

interface PrayerThemeConfig {
  name: string;
  cardBgLight: string;
  cardBgDark: string;
  cardBorderLight: string;
  cardBorderDark: string;
  badgeBgLight: string;
  badgeBgDark: string;
  badgeTextLight: string;
  badgeTextDark: string;
  pulseColor: string;
  titleColorLight: string;
  titleColorDark: string;
  nextLabelLight: string;
  nextLabelDark: string;
  timeColorLight: string;
  timeColorDark: string;
  btnBgLight: string;
  btnBgDark: string;
  btnTextLight: string;
  btnTextDark: string;
  timerBoxBgLight: string;
  timerBoxBgDark: string;
  timerBoxBorderLight: string;
  timerBoxBorderDark: string;
  unitBoxBgLight: string;
  unitBoxBgDark: string;
  unitBoxBorderLight: string;
  unitBoxBorderDark: string;
  digitColorLight: string;
  digitColorDark: string;
  labelColorLight: string;
  labelColorDark: string;
  colonColorLight: string;
  colonColorDark: string;
  progressTrackLight: string;
  progressTrackDark: string;
  progressFillLight: string;
  progressFillDark: string;
  progressTextLight: string;
  progressTextDark: string;
}

const PRAYER_THEMES: Record<TimeOfDayPeriod, PrayerThemeConfig> = {
  asr: {
    name: 'وقت العصر والبركة',
    cardBgLight: 'bg-gradient-to-b from-[#f3f9fe] via-[#fefbf6] to-[#faf6ef]',
    cardBgDark: 'bg-gradient-to-b from-[#141414] via-[#181818] to-[#101010]',
    cardBorderLight: 'border-amber-200/80',
    cardBorderDark: 'border-[#d4af37]/35',
    badgeBgLight: 'bg-white/90 shadow-xs border-stone-200/90',
    badgeBgDark: 'bg-[#1a1814] border-[#d4af37]/35',
    badgeTextLight: 'text-[#8c6b2d]',
    badgeTextDark: 'text-[#d4af37]',
    pulseColor: 'bg-[#d4af37]',
    titleColorLight: 'text-stone-900',
    titleColorDark: 'text-white',
    nextLabelLight: 'text-[#8c6b2d]',
    nextLabelDark: 'text-[#d4af37]',
    timeColorLight: 'text-stone-700',
    timeColorDark: 'text-stone-300',
    btnBgLight: 'bg-[#d4af37]/15 hover:bg-[#d4af37]/25 border-[#d4af37]/30',
    btnBgDark: 'bg-white/10 hover:bg-white/20 border-white/10',
    btnTextLight: 'text-[#8c6b2d]',
    btnTextDark: 'text-[#d4af37]',
    timerBoxBgLight: 'bg-white/90 shadow-xs',
    timerBoxBgDark: 'bg-[#141414]',
    timerBoxBorderLight: 'border-amber-200/70',
    timerBoxBorderDark: 'border-[#d4af37]/30',
    unitBoxBgLight: 'bg-[#fbf9f4] shadow-2xs',
    unitBoxBgDark: 'bg-[#1a1814]',
    unitBoxBorderLight: 'border-amber-200/60',
    unitBoxBorderDark: 'border-[#d4af37]/25',
    digitColorLight: 'text-stone-900',
    digitColorDark: 'text-[#d4af37]',
    labelColorLight: 'text-stone-500',
    labelColorDark: 'text-stone-300',
    colonColorLight: 'text-[#c5a059]',
    colonColorDark: 'text-[#d4af37]',
    progressTrackLight: 'bg-stone-200/80',
    progressTrackDark: 'bg-[#141414]',
    progressFillLight: 'bg-gradient-to-r from-[#c5a059] to-[#d4af37]',
    progressFillDark: 'bg-gradient-to-r from-[#aa7c11] to-[#d4af37]',
    progressTextLight: 'text-[#8c6b2d]',
    progressTextDark: 'text-[#d4af37]',
  },
  dhuhr: {
    name: 'وقت الظهر ونور النهار',
    cardBgLight: 'bg-gradient-to-b from-[#eef8ff] via-[#ffffff] to-[#f4f7f6]',
    cardBgDark: 'bg-gradient-to-b from-[#081d29] via-[#0d2e3e] to-[#0a232f]',
    cardBorderLight: 'border-sky-200/80',
    cardBorderDark: 'border-sky-500/35',
    badgeBgLight: 'bg-white/90 shadow-xs border-sky-200/80',
    badgeBgDark: 'bg-[#061721]/80 border-sky-400/30',
    badgeTextLight: 'text-[#0369a1]',
    badgeTextDark: 'text-[#38bdf8]',
    pulseColor: 'bg-sky-500',
    titleColorLight: 'text-[#063a2f]',
    titleColorDark: 'text-white',
    nextLabelLight: 'text-[#0284c7]',
    nextLabelDark: 'text-[#38bdf8]',
    timeColorLight: 'text-stone-700',
    timeColorDark: 'text-stone-300',
    btnBgLight: 'bg-sky-600/10 hover:bg-sky-600/15 border-sky-200',
    btnBgDark: 'bg-sky-400/15 hover:bg-sky-400/25 border-sky-400/20',
    btnTextLight: 'text-[#0284c7]',
    btnTextDark: 'text-[#38bdf8]',
    timerBoxBgLight: 'bg-white/90 shadow-xs',
    timerBoxBgDark: 'bg-[#051722]/80',
    timerBoxBorderLight: 'border-sky-200/70',
    timerBoxBorderDark: 'border-sky-400/30',
    unitBoxBgLight: 'bg-[#f4faff] shadow-2xs',
    unitBoxBgDark: 'bg-[#0c2838]/90',
    unitBoxBorderLight: 'border-sky-200/60',
    unitBoxBorderDark: 'border-sky-400/25',
    digitColorLight: 'text-[#063a2f]',
    digitColorDark: 'text-[#38bdf8]',
    labelColorLight: 'text-stone-500',
    labelColorDark: 'text-stone-300',
    colonColorLight: 'text-[#0284c7]',
    colonColorDark: 'text-[#38bdf8]',
    progressTrackLight: 'bg-stone-200/80',
    progressTrackDark: 'bg-[#061721]',
    progressFillLight: 'bg-gradient-to-r from-sky-400 to-[#063a2f]',
    progressFillDark: 'bg-gradient-to-r from-sky-400 to-[#38bdf8]',
    progressTextLight: 'text-[#063a2f]',
    progressTextDark: 'text-[#38bdf8]',
  },
  sunrise: {
    name: 'وقت الشروق والإشراق',
    cardBgLight: 'bg-gradient-to-b from-[#fef5ec] via-[#fffbf7] to-[#fcf6f0]',
    cardBgDark: 'bg-gradient-to-b from-[#241121] via-[#3d192f] to-[#1f0d1b]',
    cardBorderLight: 'border-orange-200/80',
    cardBorderDark: 'border-orange-500/35',
    badgeBgLight: 'bg-white/90 shadow-xs border-orange-200/80',
    badgeBgDark: 'bg-[#1b0a17]/80 border-orange-400/30',
    badgeTextLight: 'text-[#c2410c]',
    badgeTextDark: 'text-[#fb923c]',
    pulseColor: 'bg-orange-500',
    titleColorLight: 'text-[#431407]',
    titleColorDark: 'text-white',
    nextLabelLight: 'text-[#c2410c]',
    nextLabelDark: 'text-[#fb923c]',
    timeColorLight: 'text-stone-700',
    timeColorDark: 'text-stone-300',
    btnBgLight: 'bg-orange-600/10 hover:bg-orange-600/15 border-orange-200',
    btnBgDark: 'bg-orange-400/15 hover:bg-orange-400/25 border-orange-400/20',
    btnTextLight: 'text-[#c2410c]',
    btnTextDark: 'text-[#fb923c]',
    timerBoxBgLight: 'bg-white/90 shadow-xs',
    timerBoxBgDark: 'bg-[#1e0d1b]/80',
    timerBoxBorderLight: 'border-orange-200/70',
    timerBoxBorderDark: 'border-orange-400/30',
    unitBoxBgLight: 'bg-[#fffaf5] shadow-2xs',
    unitBoxBgDark: 'bg-[#311426]/90',
    unitBoxBorderLight: 'border-orange-200/60',
    unitBoxBorderDark: 'border-orange-400/25',
    digitColorLight: 'text-[#c2410c]',
    digitColorDark: 'text-[#fb923c]',
    labelColorLight: 'text-stone-500',
    labelColorDark: 'text-stone-300',
    colonColorLight: 'text-[#ea580c]',
    colonColorDark: 'text-[#fb923c]',
    progressTrackLight: 'bg-stone-200/80',
    progressTrackDark: 'bg-[#1b0a17]',
    progressFillLight: 'bg-gradient-to-r from-amber-400 to-[#c2410c]',
    progressFillDark: 'bg-gradient-to-r from-amber-400 to-[#fb923c]',
    progressTextLight: 'text-[#c2410c]',
    progressTextDark: 'text-[#fb923c]',
  },
  fajr: {
    name: 'وقت الفجر والتبكير',
    cardBgLight: 'bg-gradient-to-b from-[#eaf3fc] via-[#f7faff] to-[#f0f6fc]',
    cardBgDark: 'bg-gradient-to-b from-[#0b1f36] via-[#122b4a] to-[#0c1e33]',
    cardBorderLight: 'border-sky-300/80',
    cardBorderDark: 'border-sky-500/30',
    badgeBgLight: 'bg-white/90 shadow-xs border-sky-200/80',
    badgeBgDark: 'bg-[#08182a]/80 border-sky-400/30',
    badgeTextLight: 'text-[#0284c7]',
    badgeTextDark: 'text-[#7dd3fc]',
    pulseColor: 'bg-sky-400',
    titleColorLight: 'text-[#0f2d4a]',
    titleColorDark: 'text-white',
    nextLabelLight: 'text-[#0284c7]',
    nextLabelDark: 'text-[#7dd3fc]',
    timeColorLight: 'text-stone-700',
    timeColorDark: 'text-stone-300',
    btnBgLight: 'bg-sky-600/10 hover:bg-sky-600/15 border-sky-200',
    btnBgDark: 'bg-sky-400/15 hover:bg-sky-400/25 border-sky-400/20',
    btnTextLight: 'text-[#0284c7]',
    btnTextDark: 'text-[#7dd3fc]',
    timerBoxBgLight: 'bg-white/90 shadow-xs',
    timerBoxBgDark: 'bg-[#153255]/80',
    timerBoxBorderLight: 'border-sky-200/70',
    timerBoxBorderDark: 'border-sky-400/25',
    unitBoxBgLight: 'bg-[#f4f9ff] shadow-2xs',
    unitBoxBgDark: 'bg-[#193a62]/90',
    unitBoxBorderLight: 'border-sky-200/60',
    unitBoxBorderDark: 'border-sky-400/25',
    digitColorLight: 'text-[#0284c7]',
    digitColorDark: 'text-[#7dd3fc]',
    labelColorLight: 'text-stone-500',
    labelColorDark: 'text-stone-300',
    colonColorLight: 'text-[#38bdf8]',
    colonColorDark: 'text-[#38bdf8]',
    progressTrackLight: 'bg-stone-200/80',
    progressTrackDark: 'bg-[#08182a]',
    progressFillLight: 'bg-gradient-to-r from-sky-300 to-sky-600',
    progressFillDark: 'bg-gradient-to-r from-[#38bdf8] to-[#60a5fa]',
    progressTextLight: 'text-[#0284c7]',
    progressTextDark: 'text-[#7dd3fc]',
  },
  maghrib: {
    name: 'وقت المغرب والشفق الميمون',
    cardBgLight: 'bg-gradient-to-b from-[#fbf1f6] via-[#fff7fa] to-[#fdf3f0]',
    cardBgDark: 'bg-gradient-to-b from-[#220d36] via-[#35144b] to-[#1c0a2c]',
    cardBorderLight: 'border-rose-200/80',
    cardBorderDark: 'border-amber-400/35',
    badgeBgLight: 'bg-white/90 shadow-xs border-rose-200/80',
    badgeBgDark: 'bg-[#1a082b]/80 border-amber-400/30',
    badgeTextLight: 'text-[#be123c]',
    badgeTextDark: 'text-[#fde047]',
    pulseColor: 'bg-amber-400',
    titleColorLight: 'text-[#4c0519]',
    titleColorDark: 'text-white',
    nextLabelLight: 'text-[#be123c]',
    nextLabelDark: 'text-[#fde047]',
    timeColorLight: 'text-stone-700',
    timeColorDark: 'text-stone-300',
    btnBgLight: 'bg-rose-600/10 hover:bg-rose-600/15 border-rose-200',
    btnBgDark: 'bg-amber-400/15 hover:bg-amber-400/25 border-amber-400/20',
    btnTextLight: 'text-[#be123c]',
    btnTextDark: 'text-[#fde047]',
    timerBoxBgLight: 'bg-white/90 shadow-xs',
    timerBoxBgDark: 'bg-[#401858]/80',
    timerBoxBorderLight: 'border-rose-200/70',
    timerBoxBorderDark: 'border-amber-400/25',
    unitBoxBgLight: 'bg-[#fff5f8] shadow-2xs',
    unitBoxBgDark: 'bg-[#4e1d6b]/90',
    unitBoxBorderLight: 'border-rose-200/60',
    unitBoxBorderDark: 'border-amber-400/25',
    digitColorLight: 'text-[#be123c]',
    digitColorDark: 'text-[#fde047]',
    labelColorLight: 'text-stone-500',
    labelColorDark: 'text-stone-300',
    colonColorLight: 'text-[#f59e0b]',
    colonColorDark: 'text-[#f59e0b]',
    progressTrackLight: 'bg-stone-200/80',
    progressTrackDark: 'bg-[#1a082b]',
    progressFillLight: 'bg-gradient-to-r from-amber-400 to-[#be123c]',
    progressFillDark: 'bg-gradient-to-r from-[#f59e0b] to-[#ec4899]',
    progressTextLight: 'text-[#be123c]',
    progressTextDark: 'text-[#fde047]',
  },
  night: {
    name: 'وقت الليل والسكينة والقيام',
    cardBgLight: 'bg-gradient-to-b from-[#f2f6fa] via-[#fafbfd] to-[#edf3f8]',
    cardBgDark: 'bg-gradient-to-b from-[#081524] via-[#0d2338] to-[#071320]',
    cardBorderLight: 'border-blue-200/80',
    cardBorderDark: 'border-[#dfb76c]/35',
    badgeBgLight: 'bg-white/90 shadow-xs border-blue-200/80',
    badgeBgDark: 'bg-[#050f1a]/85 border-[#dfb76c]/30',
    badgeTextLight: 'text-[#1e3a8a]',
    badgeTextDark: 'text-[#dfb76c]',
    pulseColor: 'bg-[#dfb76c]',
    titleColorLight: 'text-[#0f172a]',
    titleColorDark: 'text-white',
    nextLabelLight: 'text-[#1e3a8a]',
    nextLabelDark: 'text-[#dfb76c]',
    timeColorLight: 'text-stone-700',
    timeColorDark: 'text-stone-300',
    btnBgLight: 'bg-blue-600/10 hover:bg-blue-600/15 border-blue-200',
    btnBgDark: 'bg-[#dfb76c]/15 hover:bg-[#dfb76c]/25 border-white/10',
    btnTextLight: 'text-[#1e3a8a]',
    btnTextDark: 'text-[#dfb76c]',
    timerBoxBgLight: 'bg-white/90 shadow-xs',
    timerBoxBgDark: 'bg-[#112d47]/85',
    timerBoxBorderLight: 'border-blue-200/70',
    timerBoxBorderDark: 'border-[#dfb76c]/25',
    unitBoxBgLight: 'bg-[#f8fafd] shadow-2xs',
    unitBoxBgDark: 'bg-[#163756]/90',
    unitBoxBorderLight: 'border-blue-200/60',
    unitBoxBorderDark: 'border-[#dfb76c]/25',
    digitColorLight: 'text-[#1e3a8a]',
    digitColorDark: 'text-[#dfb76c]',
    labelColorLight: 'text-stone-500',
    labelColorDark: 'text-stone-300',
    colonColorLight: 'text-[#2563eb]',
    colonColorDark: 'text-[#dfb76c]',
    progressTrackLight: 'bg-stone-200/80',
    progressTrackDark: 'bg-[#050f1a]',
    progressFillLight: 'bg-gradient-to-r from-blue-400 to-[#1e3a8a]',
    progressFillDark: 'bg-gradient-to-r from-[#c5a059] to-[#dfb76c]',
    progressTextLight: 'text-[#1e3a8a]',
    progressTextDark: 'text-[#dfb76c]',
  },
};

export const HomeTab: React.FC<Props> = ({
  prayerData,
  isLoadingPrayers,
  prayerError,
  location,
  onNavigateTab,
  onOpenLocationModal,
  is24h,
  onOpenTracker,
  onOpenAthkar,
  isDark = false,
  onToggleTheme = () => {},
}) => {
  const [now, setNow] = useState<Date>(new Date());
  const [ayah, setAyah] = useState<AyahData | null>(null);
  const [isLoadingAyah, setIsLoadingAyah] = useState(true);
  const [ayahError, setAyahError] = useState<string | null>(null);
  const [copiedAyah, setCopiedAyah] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Specialized spiritual modals states
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [isShareRewardOpen, setIsShareRewardOpen] = useState(false);
  const [isIslamicHistoryOpen, setIsIslamicHistoryOpen] = useState(false);
  const [isRamadanOpen, setIsRamadanOpen] = useState(false);
  const [isHisnMuslimOpen, setIsHisnMuslimOpen] = useState(false);
  const [isQiblaModalOpen, setIsQiblaModalOpen] = useState(false);
  const [isDuasModalOpen, setIsDuasModalOpen] = useState(false);
  const [isQuranIntroOpen, setIsQuranIntroOpen] = useState(false);
  const [isAllahNamesOpen, setIsAllahNamesOpen] = useState(false);

  // Live second clock for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Ayah of the day
  useEffect(() => {
    let isMounted = true;
    async function loadAyah() {
      setIsLoadingAyah(true);
      setAyahError(null);
      try {
        const data = await fetchTodayAyah();
        if (isMounted) {
          setAyah(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'تعذر تحميل الآية الكريمة';
          setAyahError(message);
        }
      } finally {
        if (isMounted) setIsLoadingAyah(false);
      }
    }
    loadAyah();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleFetchRandomAyah = async () => {
    setIsLoadingAyah(true);
    setAyahError(null);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
    try {
      const data = await fetchRandomAyah();
      setAyah(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'تعذر تحميل آية جديدة';
      setAyahError(message);
    } finally {
      setIsLoadingAyah(false);
    }
  };

  const handleCopyAyah = () => {
    if (!ayah) return;
    const textToCopy = `﴿${ayah.text}﴾ [${ayah.surah.name}: ${ayah.numberInSurah}]`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAyah(true);
    setTimeout(() => setCopiedAyah(false), 2500);
  };

  const handleToggleAudio = () => {
    if (!audioRef.current || !ayah?.audio) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch((e) => {
          console.warn('Audio play failed:', e);
          setIsPlayingAudio(false);
        });
    }
  };

  // Next prayer calculations
  const nextPrayerInfo = prayerData ? calculateNextPrayer(prayerData.timings, now) : null;
  const dailyPrayers = prayerData
    ? getDailyPrayerList(prayerData.timings, nextPrayerInfo?.nextPrayer, now)
    : [];

  const currentOrNextKey = nextPrayerInfo?.nextPrayer || 'Fajr';
  const currentOrNextArabic = nextPrayerInfo?.nextPrayerArabic || 'الفجر';

  // Determine current atmospheric period for the Mosque vector scene
  const timePeriod = determineTimePeriod(prayerData, now);

  // Hijri & Gregorian Dates
  const hijri = prayerData?.date.hijri;
  const gregorian = prayerData?.date.gregorian;
  const hijriDateString = hijri
    ? `${hijri.weekday.ar}، ${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`
    : '';
  const gregorianDateString = gregorian
    ? `${gregorian.day} ${gregorian.month.en} ${gregorian.year} م`
    : '';

  // Formatted countdown digits (e.g. 00:18:27)
  const hoursStr = nextPrayerInfo
    ? nextPrayerInfo.formattedCountdown.hours.toString().padStart(2, '0')
    : '00';
  const minutesStr = nextPrayerInfo
    ? nextPrayerInfo.formattedCountdown.minutes.toString().padStart(2, '0')
    : '00';
  const secondsStr = nextPrayerInfo
    ? nextPrayerInfo.formattedCountdown.seconds.toString().padStart(2, '0')
    : '00';

  // Current dynamic prayer theme
  const currentTheme = PRAYER_THEMES[timePeriod];

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300">
      {/* 1. Regal Top Bar (أثر - رفيق المسلم + القائمة + الإشعارات + قائمة الخدمات) */}
      <HomeTopBar
        location={location}
        onOpenLocationModal={onOpenLocationModal}
        onNavigateTab={onNavigateTab}
        onOpenServicesGrid={() => setIsServicesModalOpen(true)}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
      />

      {/* 2. Mosque Interactive Hero Card matching image_7280db7e.png */}
      <div
        className={`relative overflow-hidden rounded-[32px] p-4 sm:p-5 transition-all duration-300 ${
          isDark
            ? 'bg-[#141414] border-2 border-[#d4af37]/70 shadow-[0_0_25px_rgba(212,175,55,0.22)]'
            : 'bg-[#ffffff] border border-stone-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
        }`}
      >
        {/* Mosque Scene Illustration at Top with Rounded Corners */}
        <div className="w-full relative overflow-hidden rounded-2xl mb-3">
          <MosqueTimeScene period={timePeriod} isDark={isDark} className="w-full" />

          {/* Location Badge */}
          <div className="absolute top-2.5 right-2.5 z-10">
            <button
              onClick={onOpenLocationModal}
              title="تغيير المدينة"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md transition active:scale-95 shadow-xs ${
                isDark
                  ? 'bg-black/60 border-[#d4af37]/40 text-[#d4af37]'
                  : 'bg-white/80 border-[#2e4426]/20 text-[#2e4426]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
              <span className="truncate max-w-[140px]">{location.label.split('(')[0].trim()}</span>
            </button>
          </div>
        </div>

        {/* Prayer Name & Time matching image_7280db7e.png */}
        <div className="text-center space-y-1 mb-4">
          <h2
            className={`text-3xl sm:text-4xl font-black tracking-tight ${
              isDark ? 'text-[#d4af37]' : 'text-[#2e4426]'
            }`}
          >
            صلاة {currentOrNextArabic}
          </h2>
          <div
            className={`text-base sm:text-lg font-bold font-mono ${
              isDark ? 'text-[#c5a059]' : 'text-[#4a5f42]'
            }`}
          >
            {nextPrayerInfo
              ? formatArabicTime(nextPrayerInfo.nextPrayerTime, is24h)
              : '--:--'}
          </div>
        </div>

        {/* 3 Rounded Countdown Boxes matching image_7280db7e.png: [ 02 ] : [ 17 ] : [ 29 ] */}
        <div className="flex items-center justify-center gap-2 mb-3" dir="ltr">
          {/* Hours Box */}
          <div
            className={`w-16 sm:w-20 py-2 sm:py-2.5 rounded-2xl text-center border transition-all ${
              isDark
                ? 'bg-[#0a0a0a] border-[#d4af37]/60 shadow-inner'
                : 'bg-[#fdfcf9] border-[#2e4426]/30 shadow-2xs'
            }`}
          >
            <span
              className={`text-2xl sm:text-3xl font-black font-mono leading-none ${
                isDark ? 'text-[#d4af37]' : 'text-[#2e4426]'
              }`}
            >
              {hoursStr}
            </span>
          </div>

          <span className={`text-xl font-black ${isDark ? 'text-[#d4af37]' : 'text-[#2e4426]'}`}>:</span>

          {/* Minutes Box */}
          <div
            className={`w-16 sm:w-20 py-2 sm:py-2.5 rounded-2xl text-center border transition-all ${
              isDark
                ? 'bg-[#0a0a0a] border-[#d4af37]/60 shadow-inner'
                : 'bg-[#fdfcf9] border-[#2e4426]/30 shadow-2xs'
            }`}
          >
            <span
              className={`text-2xl sm:text-3xl font-black font-mono leading-none ${
                isDark ? 'text-[#d4af37]' : 'text-[#2e4426]'
              }`}
            >
              {minutesStr}
            </span>
          </div>

          <span className={`text-xl font-black ${isDark ? 'text-[#d4af37]' : 'text-[#2e4426]'}`}>:</span>

          {/* Seconds Box */}
          <div
            className={`w-16 sm:w-20 py-2 sm:py-2.5 rounded-2xl text-center border transition-all ${
              isDark
                ? 'bg-[#0a0a0a] border-[#d4af37]/60 shadow-inner'
                : 'bg-[#fdfcf9] border-[#2e4426]/30 shadow-2xs'
            }`}
          >
            <span
              className={`text-2xl sm:text-3xl font-black font-mono leading-none ${
                isDark ? 'text-[#d4af37]' : 'text-[#2e4426]'
              }`}
            >
              {secondsStr}
            </span>
          </div>
        </div>

        {/* Progress Bar towards next prayer */}
        {nextPrayerInfo && (
          <div className="w-full space-y-1.5 mb-2">
            <div
              className={`w-full h-2 rounded-full overflow-hidden ${
                isDark ? 'bg-[#222222]' : 'bg-stone-200'
              }`}
            >
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                  isDark
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#f5e6b8] shadow-[0_0_10px_rgba(212,175,55,0.6)]'
                    : 'bg-[#2e4426]'
                }`}
                style={{ width: `${nextPrayerInfo.progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Bottom Subtitle Label matching image_7280db7e.png */}
        <div
          className={`text-center text-xs sm:text-sm font-bold mt-2 ${
            isDark ? 'text-[#d4af37]' : 'text-[#2e4426]'
          }`}
        >
          وقت {currentOrNextArabic} والبركة
        </div>

        {prayerError && (
          <div className="text-xs text-rose-200 bg-rose-950/70 p-2.5 rounded-xl border border-rose-800 mt-2">
            {prayerError}
          </div>
        )}
      </div>

      {/* 3. Smart Shar'i Alert Bar (شريط التنبيه الشرعي الذكي لأوقات النهي والإجابة والضحى) */}
      <SmartSharaiAlert prayerData={prayerData} now={now} />

      {/* 4. Modern Flat Dual Date Bar (شريط التاريخ المزدوج: هجري وميلادي) */}
      <div className="rounded-2xl bg-[#faf8f5] dark:bg-[#141414] border border-[#d4af37]/25 p-3 shadow-2xs flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-stone-900 dark:text-stone-100">
              {hijriDateString || 'جاري تحميل التاريخ الهجري...'}
            </div>
            <div className="text-[10px] text-stone-500 dark:text-[#a39e93]">
              التقويم الهجري المعتمد
            </div>
          </div>
        </div>

        {gregorianDateString && (
          <div className="text-left shrink-0">
            <div className="font-mono text-stone-700 dark:text-stone-300 font-semibold text-[11px] tabular-nums">
              {gregorianDateString}
            </div>
            <div className="text-[10px] text-stone-400">ميلادي</div>
          </div>
        )}
      </div>

      {/* 5. Horizontal Prayer Timeline Strip (مواقيت الصلوات الخمس مع الشروق وقيام الليل) */}
      <PrayerTimelineStrip
        dailyPrayers={dailyPrayers}
        prayerData={prayerData}
        is24h={is24h}
        onNavigatePrayers={() => onNavigateTab('prayers')}
        now={now}
        isDark={isDark}
      />

      {/* 6. Custom Quick Access Grid (الخدمات الإسلامية الـ ١٥) */}
      <QuickAccessGrid
        onNavigateTab={onNavigateTab}
        onOpenAthkar={onOpenAthkar}
        onOpenTracker={onOpenTracker}
        onOpenQibla={() => setIsQiblaModalOpen(true)}
        onOpenShareReward={() => setIsShareRewardOpen(true)}
        onOpenIslamicHistory={() => setIsIslamicHistoryOpen(true)}
        onOpenRamadan={() => setIsRamadanOpen(true)}
        onOpenHisnMuslim={() => setIsHisnMuslimOpen(true)}
        onOpenDuas={() => setIsDuasModalOpen(true)}
        onOpenQuranIntro={() => setIsQuranIntroOpen(true)}
        onOpenAllahNames={() => setIsAllahNamesOpen(true)}
        isDark={isDark}
      />

      {/* 7. Spiritual Interactive Virtue Card (فضائل وقت الصلاة الحالية وأذكارها المأثورة) */}
      <PrayerVirtueCard
        currentOrNextPrayerKey={currentOrNextKey}
        prayerArabicName={currentOrNextArabic}
      />

      {/* 8. Ayah of the Day (آية اليوم من المصحف الشريف بتلاوة الشيخ مشاري العفاسي) */}
      <div className="rounded-3xl bg-[#faf8f5] dark:bg-[#141414] border border-[#d4af37]/25 p-5 shadow-2xs space-y-4">
        {/* Ayah Header */}
        <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                آية اليوم
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-[#a39e93]">
                من المصحف الشريف عبر API القرآن المعتمد
              </p>
            </div>
          </div>

          <button
            onClick={handleFetchRandomAyah}
            disabled={isLoadingAyah}
            title="عرض آية كريمة أخرى"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-xl text-[#8c6b2d] dark:text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37]/20 transition active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAyah ? 'animate-spin' : ''}`} />
            <span>آية أخرى</span>
          </button>
        </div>

        {/* Ayah Content */}
        {isLoadingAyah ? (
          <div className="py-8 space-y-3 animate-pulse text-center">
            <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-5/6 mx-auto" />
            <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-4/6 mx-auto" />
            <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-1/3 mx-auto mt-4" />
          </div>
        ) : ayahError ? (
          <div className="py-6 text-center space-y-2">
            <p className="text-xs text-rose-600 dark:text-rose-400">{ayahError}</p>
            <button
              onClick={handleFetchRandomAyah}
              className="text-xs font-semibold text-[#8c6b2d] dark:text-[#d4af37] underline"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : ayah ? (
          <div className="space-y-4">
            {/* Arabic Quranic Text in Amiri font */}
            <div className="relative text-center px-2 py-1">
              <p
                style={{ fontFamily: 'var(--font-quran), Amiri, serif' }}
                className="text-xl sm:text-2xl leading-[2.2] sm:leading-[2.4] text-stone-900 dark:text-[#f5e6b8] font-normal select-text"
              >
                <span className="text-[#d4af37] text-lg">﴿</span>
                {ayah.text}
                <span className="text-[#d4af37] text-lg">﴾</span>
              </p>
            </div>

            {/* Surah Reference Meta */}
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-[#a39e93] pt-2 border-t border-[#d4af37]/20">
              <div className="font-semibold text-stone-800 dark:text-[#d4af37]">
                {ayah.surah.name} · الآية {toArabicDigits(ayah.numberInSurah)}
              </div>

              <div className="flex items-center gap-1.5">
                {/* Audio Recitation button */}
                {ayah.audio && (
                  <>
                    <audio
                      ref={audioRef}
                      src={ayah.audio}
                      onEnded={() => setIsPlayingAudio(false)}
                      onError={() => setIsPlayingAudio(false)}
                    />
                    <button
                      onClick={handleToggleAudio}
                      title={isPlayingAudio ? 'إيقاف التلاوة' : 'الاستماع بصوت مشاري العفاسي'}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium transition ${
                        isPlayingAudio
                          ? 'bg-[#d4af37] text-stone-950 font-bold animate-pulse'
                          : 'bg-stone-100 dark:bg-[#1a1814] text-stone-700 dark:text-[#d4af37] hover:bg-stone-200'
                      }`}
                    >
                      {isPlayingAudio ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>إيقاف</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>استمع</span>
                        </>
                      )}
                    </button>
                  </>
                )}

                {/* Copy button */}
                <button
                  onClick={handleCopyAyah}
                  title="نسخ الآية الكريمة"
                  className="p-1.5 rounded-xl bg-stone-100 dark:bg-[#1a1814] text-stone-600 dark:text-[#d4af37] hover:bg-stone-200 transition"
                >
                  {copiedAyah ? (
                    <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* 8.5. Bottom PWA Install Banner */}
      <InstallAtharBanner variant="banner" />

      {/* 9. Specialized Modals */}
      <ServicesGridModal
        isOpen={isServicesModalOpen}
        onClose={() => setIsServicesModalOpen(false)}
        onNavigateTab={onNavigateTab}
        onOpenAthkar={onOpenAthkar}
        onOpenTracker={onOpenTracker}
        onOpenQibla={() => setIsQiblaModalOpen(true)}
        onOpenShareReward={() => setIsShareRewardOpen(true)}
        onOpenIslamicHistory={() => setIsIslamicHistoryOpen(true)}
        onOpenRamadan={() => setIsRamadanOpen(true)}
        onOpenHisnMuslim={() => onNavigateTab('athkar')}
      />

      <ShareForRewardModal
        isOpen={isShareRewardOpen}
        onClose={() => setIsShareRewardOpen(false)}
      />

      <IslamicHistoryModal
        isOpen={isIslamicHistoryOpen}
        onClose={() => setIsIslamicHistoryOpen(false)}
      />

      <RamadanSectionModal
        isOpen={isRamadanOpen}
        onClose={() => setIsRamadanOpen(false)}
        fajrTime={prayerData?.timings ? cleanTimeString(prayerData.timings.Fajr) : undefined}
        maghribTime={prayerData?.timings ? cleanTimeString(prayerData.timings.Maghrib) : undefined}
        location={location}
        prayerData={prayerData}
        isDark={isDark}
      />

      <HisnMuslimModal
        isOpen={isHisnMuslimOpen}
        onClose={() => setIsHisnMuslimOpen(false)}
      />

      <QiblaCompassModal
        isOpen={isQiblaModalOpen}
        onClose={() => setIsQiblaModalOpen(false)}
        location={location}
        isDark={isDark}
      />

      <DuasComprehensiveModal
        isOpen={isDuasModalOpen}
        onClose={() => setIsDuasModalOpen(false)}
        isDark={isDark}
      />

      <QuranIntroModal
        isOpen={isQuranIntroOpen}
        onClose={() => setIsQuranIntroOpen(false)}
        onOpenQuranIndex={() => onNavigateTab('quran')}
        onOpenMushafPage={(page) => {
          try {
            localStorage.setItem('noor_last_mushaf_page', page.toString());
          } catch {}
          onNavigateTab('quran');
        }}
        isDark={isDark}
      />

      <AllahNamesModal
        isOpen={isAllahNamesOpen}
        onClose={() => setIsAllahNamesOpen(false)}
        isDark={isDark}
      />
    </div>
  );
};
