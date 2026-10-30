import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Compass, MapPin, CheckCircle2, Smartphone, ShieldCheck, Navigation } from 'lucide-react';
import { LocationConfig } from '../../types';
import { calculateQiblaDegree } from '../../utils/prayerUtils';
import { ScreenBackButton } from '../common/ScreenBackButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  location: LocationConfig;
  inline?: boolean;
  isDark?: boolean;
}

// Haversine formula to compute distance to Makkah in KM
function getDistanceToMakkahKm(lat: number, lng: number): number {
  const makkahLat = 21.4225;
  const makkahLng = 39.8262;
  const R = 6371;
  const dLat = ((makkahLat - lat) * Math.PI) / 180;
  const dLng = ((makkahLng - lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat * Math.PI) / 180) *
      Math.cos((makkahLat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export const QiblaCompassModal: React.FC<Props> = ({
  isOpen,
  onClose,
  location,
  inline = false,
  isDark: propIsDark,
}) => {
  const lat = location.latitude ?? 21.4225;
  const lng = location.longitude ?? 39.8262;
  const qiblaAngle = Math.round(calculateQiblaDegree(lat, lng));
  const distanceToMakkah = getDistanceToMakkahKm(lat, lng);

  // Compass state
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [manualOffset, setManualOffset] = useState<number>(0);
  const [permissionState, setPermissionState] = useState<'granted' | 'prompt' | 'denied' | 'unsupported'>('prompt');
  const [hasSensors, setHasSensors] = useState<boolean>(false);
  const lastVibrateTime = useRef<number>(0);

  // Check dark mode
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (propIsDark !== undefined) return propIsDark;
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  useEffect(() => {
    if (propIsDark !== undefined) {
      setIsDark(propIsDark);
    } else if (typeof document !== 'undefined') {
      const observer = new MutationObserver(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      return () => observer.disconnect();
    }
  }, [propIsDark]);

  // Heading calculation
  const currentHeading = deviceHeading !== null ? deviceHeading : manualOffset;
  const angleDiff = ((qiblaAngle - currentHeading + 540) % 360) - 180;
  const isAligned = Math.abs(angleDiff) <= 3;

  // Haptic feedback when aligned
  useEffect(() => {
    if (isAligned && isOpen) {
      const now = Date.now();
      if (now - lastVibrateTime.current > 1200) {
        lastVibrateTime.current = now;
        try {
          if ('vibrate' in navigator) {
            navigator.vibrate([40, 60, 40]);
          }
        } catch {
          // ignore
        }
      }
    }
  }, [isAligned, isOpen]);

  // Orientation event handler
  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    setHasSensors(true);
    let heading: number | null = null;

    if (typeof (event as any).webkitCompassHeading === 'number') {
      heading = (event as any).webkitCompassHeading;
    } else if (event.alpha !== null) {
      heading = (360 - event.alpha) % 360;
    }

    if (heading !== null && !isNaN(heading)) {
      setDeviceHeading((prev) => {
        if (prev === null) return Math.round(heading);
        let diff = heading - prev;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        return Math.round((prev + diff * 0.35 + 360) % 360);
      });
    }
  }, []);

  const requestCompassPermission = useCallback(async () => {
    try {
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof (DeviceOrientationEvent as any).requestPermission === 'function'
      ) {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setPermissionState('granted');
          window.addEventListener('deviceorientation', handleOrientation, true);
        } else {
          setPermissionState('denied');
        }
      } else {
        setPermissionState('granted');
        window.addEventListener('deviceorientationabsolute', handleOrientation, true);
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    } catch (e) {
      console.warn('Compass permission request failed:', e);
      setPermissionState('unsupported');
    }
  }, [handleOrientation]);

  useEffect(() => {
    if (!isOpen) return;

    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      setPermissionState('prompt');
    } else {
      requestCompassPermission();
    }

    return () => {
      const win = window as any;
      win.removeEventListener('deviceorientationabsolute', handleOrientation, true);
      win.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [isOpen, handleOrientation, requestCompassPermission]);

  if (!isOpen) return null;

  // Degrees list for astrolabe graduated rim (every 30 degrees)
  const majorDegrees = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  const modalBody = (
    <div
      className={`w-full max-w-sm sm:max-w-md rounded-3xl p-5 shadow-2xl border space-y-4 select-none ${
        isDark
          ? 'bg-[#121212] text-[#fcfbf7] border-[#d4af37]/40 shadow-[0_12px_45px_rgba(0,0,0,0.85)]'
          : 'bg-[#faf8f5] text-stone-900 border-[#c5a059] shadow-[0_12px_40px_rgba(212,175,55,0.2)]'
      }`}
      dir="rtl"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/25">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-10 h-10 rounded-2xl border flex items-center justify-center shadow-xs ${
              isDark
                ? 'bg-[#1f1b14] border-[#d4af37]/50 text-[#facc15]'
                : 'bg-white border-[#ca8a04]/30 text-amber-700'
            }`}
          >
            <Compass className="w-6 h-6 animate-pulse" />
          </div>

          <div>
            <h3
              className={`text-base font-black ${
                isDark ? 'text-[#f5e6b8]' : 'text-stone-900'
              }`}
            >
              بوصلة القبلة الاحترافية
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-amber-200/80 flex items-center gap-1 font-semibold">
              <MapPin className="w-3 h-3 text-[#d4af37]" />
              <span>{location.label.split('(')[0].trim()}</span>
              <span>•</span>
              <span>{distanceToMakkah.toLocaleString('ar-EG')} كم إلى مكة</span>
            </p>
          </div>
        </div>

        {!inline && (
          <ScreenBackButton onClick={onClose} ariaLabel="خروج" />
        )}
      </div>

      {/* Permission / Sensor Alert */}
      {permissionState === 'prompt' && !hasSensors && (
        <div
          className={`p-3 rounded-2xl border flex items-center justify-between gap-3 shadow-xs ${
            isDark
              ? 'bg-[#1c1811] border-[#d4af37]/50 text-white'
              : 'bg-white border-amber-300 text-stone-900'
          }`}
        >
          <div className="flex items-center gap-2 text-xs">
            <Smartphone className="w-5 h-5 text-[#facc15] shrink-0" />
            <div>
              <p className="font-bold">تفعيل مستشعر الاتجاه بالهاتف</p>
              <p className="text-[10px] text-stone-400 dark:text-stone-300">
                انقر لتفعيل الجيروسكوب وتحديد القبلة بدقة
              </p>
            </div>
          </div>
          <button
            onClick={requestCompassPermission}
            className="px-3 py-1.5 rounded-xl text-xs font-bold shadow-md active:scale-95 shrink-0 bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-stone-950"
          >
            تفعيل
          </button>
        </div>
      )}

      {/* Alignment Status Banner */}
      <div
        className={`p-3 rounded-2xl transition-all duration-300 text-center flex items-center justify-center gap-2 border-2 ${
          isAligned
            ? isDark
              ? 'bg-[#1f2714] border-[#84cc16] text-[#bef264] shadow-[0_0_25px_rgba(132,204,22,0.4)] animate-pulse'
              : 'bg-[#ecfccb] border-[#65a30d] text-[#365314] shadow-sm font-bold'
            : isDark
            ? 'bg-[#181818] border-[#d4af37]/30 text-stone-200'
            : 'bg-white border-stone-200 text-stone-700 shadow-2xs'
        }`}
      >
        {isAligned ? (
          <>
            <CheckCircle2 className="w-5 h-5 text-lime-400 shrink-0" />
            <span className="text-xs sm:text-sm font-extrabold">
              أنت الآن باتجاه الكعبة المشرفة مباشرة 🕋
            </span>
          </>
        ) : (
          <span className="text-xs font-bold">
            وجّه هاتفك أفقياً حتى تتطابق الإبرة مع مؤشر الكعبة ({Math.abs(angleDiff)}° متبقية)
          </span>
        )}
      </div>

      {/* Luxury Professional Marine/Astrolabe Compass Dial */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto flex items-center justify-center my-1 select-none">
        {/* Outer Heavy Brass/Gold Nautical Bezel */}
        <div
          className={`absolute inset-0 rounded-full border-4 shadow-xl transition-colors ${
            isDark
              ? 'border-[#ca8a04] bg-radial from-[#1e1b15] via-[#111111] to-[#070707] shadow-[0_0_35px_rgba(202,138,4,0.35)]'
              : 'border-[#ca8a04] bg-radial from-[#ffffff] via-[#fbf9f4] to-[#ede6d4] shadow-md'
          }`}
        />

        {/* Outer Fine Millimeter Graduation Ring */}
        <div className="absolute inset-2 rounded-full border border-[#ca8a04]/40 pointer-events-none" />
        <div className="absolute inset-3 rounded-full border border-dashed border-[#ca8a04]/25 pointer-events-none" />

        {/* 1. ROTATING COMPASS ROSE & DEGREE GRADUATIONS */}
        <div
          className="absolute inset-4 rounded-full transition-transform duration-200 ease-out"
          style={{ transform: `rotate(${-currentHeading}deg)` }}
        >
          {/* Astrolabe Fine Tick Marks (360 degrees) */}
          {Array.from({ length: 72 }).map((_, i) => {
            const deg = i * 5;
            const isMajor = deg % 30 === 0;
            const isMedium = deg % 15 === 0;
            return (
              <div
                key={deg}
                className="absolute inset-0 flex items-start justify-center pointer-events-none"
                style={{ transform: `rotate(${deg}deg)` }}
              >
                <div
                  className={`${
                    isMajor
                      ? 'w-1 h-3 bg-[#eab308]'
                      : isMedium
                      ? 'w-0.5 h-2 bg-[#ca8a04]/70'
                      : 'w-px h-1.5 bg-[#ca8a04]/40'
                  } mt-0.5`}
                />
              </div>
            );
          })}

          {/* Major Degree Numbers around dial */}
          {majorDegrees.map((deg) => (
            <div
              key={`num-${deg}`}
              className="absolute inset-0 flex items-start justify-center pointer-events-none"
              style={{ transform: `rotate(${deg}deg)` }}
            >
              <span
                className="text-[9px] font-mono font-bold mt-4 text-[#ca8a04] dark:text-[#fef08a]"
                style={{ transform: `rotate(${-deg + currentHeading}deg)` }}
              >
                {deg}°
              </span>
            </div>
          ))}

          {/* Cardinal Directions */}
          {/* North */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className="text-base font-black text-red-500 font-mono tracking-wider">N</span>
            <span className="text-[10px] font-extrabold text-red-500">شمال</span>
          </div>

          {/* South */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className="text-[10px] font-bold text-stone-400">جنوب</span>
            <span className="text-sm font-black font-mono text-stone-400">S</span>
          </div>

          {/* East */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center">
            <span className="text-sm font-black font-mono text-stone-400">E</span>
            <span className="text-[9px] font-bold text-stone-400">شرق</span>
          </div>

          {/* West */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col items-center">
            <span className="text-sm font-black font-mono text-stone-400">W</span>
            <span className="text-[9px] font-bold text-stone-400">غرب</span>
          </div>

          {/* Sacred Astrolabe Geometric Octagram in Background */}
          <div className="absolute inset-16 flex items-center justify-center opacity-20 pointer-events-none">
            <div className="w-full h-full border border-[#ca8a04] rotate-0" />
            <div className="absolute w-full h-full border border-[#ca8a04] rotate-45" />
          </div>

          {/* 3. KAABA DIRECTION BEACON AT EXACT QIBLA ANGLE */}
          <div
            className="absolute inset-0 flex items-start justify-center pointer-events-none"
            style={{ transform: `rotate(${qiblaAngle}deg)` }}
          >
            {/* Golden Radiating Trajectory towards Kaaba */}
            <div className="flex flex-col items-center -mt-5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-transform ${
                  isAligned
                    ? 'scale-110 bg-black border-2 border-lime-400 shadow-[0_0_20px_rgba(132,204,22,0.8)]'
                    : 'bg-black border-2 border-[#ca8a04] shadow-[0_0_15px_rgba(202,138,4,0.6)]'
                }`}
              >
                <span className="text-lg">🕋</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#facc15] mt-1 shadow-sm shadow-[#facc15]" />
            </div>
          </div>
        </div>

        {/* 2. LIVE STEERING NEEDLE (Points directly to Qibla relative to phone top) */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-150 ease-out pointer-events-none"
          style={{ transform: `rotate(${qiblaAngle - currentHeading}deg)` }}
        >
          {/* Top Arrow: Precision Gold-Tipped Needle pointing to Kaaba */}
          <div className="relative flex flex-col items-center h-32 -translate-y-16">
            <div
              className={`w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[28px] ${
                isAligned
                  ? 'border-b-[#84cc16] filter drop-shadow-[0_0_12px_rgba(132,204,22,0.9)]'
                  : 'border-b-[#ca8a04] filter drop-shadow-[0_0_10px_rgba(202,138,4,0.7)]'
              }`}
            />
            <div className="w-2.5 h-20 bg-gradient-to-b from-[#eab308] via-[#ca8a04] to-[#78350f] rounded-t-sm" />
          </div>

          {/* Bottom Needle Counter-Weight */}
          <div className="relative flex flex-col items-center h-28 translate-y-14">
            <div className="w-2 h-16 bg-gradient-to-b from-[#78350f] to-stone-500 rounded-b-sm" />
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[16px] border-t-stone-500" />
          </div>
        </div>

        {/* Center Astrolabe Golden Pivot Cap */}
        <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-[#fef08a] via-[#ca8a04] to-[#78350f] border-2 border-white/60 shadow-lg flex items-center justify-center pointer-events-none z-10">
          <div className="w-2.5 h-2.5 rounded-full bg-stone-900 shadow-inner" />
        </div>

        {/* Top Fixed Aiming Notch / Reticle at 12 o'clock */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20 flex flex-col items-center">
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-red-500 filter drop-shadow-md" />
        </div>
      </div>

      {/* Telemetry Readouts (Live Heading, Target Qibla, Difference) */}
      <div className="grid grid-cols-3 gap-2 pt-2 text-center" dir="rtl">
        {/* Current Heading */}
        <div
          className={`p-2.5 rounded-2xl border ${
            isDark ? 'bg-[#181818] border-stone-800' : 'bg-white border-stone-200'
          }`}
        >
          <p className="text-[10px] font-bold text-stone-500 dark:text-stone-400">
            اتجاه هاتفك
          </p>
          <p className="text-sm font-black font-mono text-[#d4af37] mt-0.5">
            {currentHeading}°
          </p>
        </div>

        {/* Exact Qibla Target */}
        <div
          className={`p-2.5 rounded-2xl border ${
            isDark ? 'bg-[#1f1b14] border-[#ca8a04]/40' : 'bg-amber-50 border-amber-300'
          }`}
        >
          <p className="text-[10px] font-bold text-[#ca8a04]">
            زاوية القبلة
          </p>
          <p className="text-sm font-black font-mono text-[#ca8a04] dark:text-[#fef08a] mt-0.5">
            {qiblaAngle}°
          </p>
        </div>

        {/* Distance to Makkah */}
        <div
          className={`p-2.5 rounded-2xl border ${
            isDark ? 'bg-[#181818] border-stone-800' : 'bg-white border-stone-200'
          }`}
        >
          <p className="text-[10px] font-bold text-stone-500 dark:text-stone-400">
            المسافة لمكة
          </p>
          <p className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
            {distanceToMakkah} كم
          </p>
        </div>
      </div>

      {/* Manual Compass Calibration / Simulator slider for desktop users without gyroscope */}
      {!hasSensors && (
        <div className="pt-1 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
            <span>تجربة محاكاة التدوير:</span>
            <span className="font-mono font-bold text-[#d4af37]">{manualOffset}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="359"
            value={manualOffset}
            onChange={(e) => setManualOffset(Number(e.target.value))}
            className="w-full h-1.5 bg-stone-300 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
          />
        </div>
      )}
    </div>
  );

  if (inline) {
    return modalBody;
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div onClick={(e) => e.stopPropagation()}>{modalBody}</div>
    </div>
  );
};
