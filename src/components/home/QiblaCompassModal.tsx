import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Compass, MapPin, Sparkles, AlertCircle, RotateCcw, CheckCircle2, ShieldCheck, Smartphone } from 'lucide-react';
import { LocationConfig } from '../../types';
import { calculateQiblaDegree } from '../../utils/prayerUtils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  location: LocationConfig;
  inline?: boolean;
}

// Haversine formula to compute great-circle distance to Makkah in KM
function getDistanceToMakkahKm(lat: number, lng: number): number {
  const makkahLat = 21.4225;
  const makkahLng = 39.8262;
  const R = 6371; // Earth radius in km
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

export const QiblaCompassModal: React.FC<Props> = ({ isOpen, onClose, location, inline = false }) => {
  const lat = location.latitude ?? 21.4225;
  const lng = location.longitude ?? 39.8262;
  const qiblaAngle = calculateQiblaDegree(lat, lng);
  const distanceToMakkah = getDistanceToMakkahKm(lat, lng);

  // Compass state
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [manualOffset, setManualOffset] = useState<number>(0);
  const [permissionState, setPermissionState] = useState<'granted' | 'prompt' | 'denied' | 'unsupported'>('prompt');
  const [hasSensors, setHasSensors] = useState<boolean>(false);
  const lastVibrateTime = useRef<number>(0);

  // Effective phone heading (either from hardware sensors or manual test offset)
  const currentHeading = deviceHeading !== null ? deviceHeading : manualOffset;

  // Relative deviation between device top and Qibla direction (0 = aligned)
  const angleDiff = ((qiblaAngle - currentHeading + 540) % 360) - 180;
  const isAligned = Math.abs(angleDiff) <= 4;

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

    // iOS WebKit Compass Heading (true north heading)
    if (typeof (event as any).webkitCompassHeading === 'number') {
      heading = (event as any).webkitCompassHeading;
    } else if (event.alpha !== null) {
      // Android standard: alpha is 0 when pointing to north in absolute mode
      // or compass heading = (360 - alpha) % 360
      if ((event as any).absolute) {
        heading = (360 - event.alpha) % 360;
      } else {
        heading = (360 - event.alpha) % 360;
      }
    }

    if (heading !== null && !isNaN(heading)) {
      setDeviceHeading((prev) => {
        if (prev === null) return Math.round(heading);
        // Smooth interpolation for jitter-free needle
        let diff = heading - prev;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        return Math.round((prev + diff * 0.35 + 360) % 360);
      });
    }
  }, []);

  // Request permission on iOS 13+ or start listening immediately
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
        // Android and standard browsers without explicit permission requirement
        setPermissionState('granted');
        const win = window as any;
        if ('ondeviceorientationabsolute' in win) {
          win.addEventListener('deviceorientationabsolute', handleOrientation, true);
        } else if ('ondeviceorientation' in win) {
          win.addEventListener('deviceorientation', handleOrientation, true);
        } else {
          setPermissionState('unsupported');
        }
      }
    } catch (err) {
      console.warn('Orientation permission error:', err);
      setPermissionState('unsupported');
    }
  }, [handleOrientation]);

  // Attempt auto-activation when opened
  useEffect(() => {
    if (!isOpen) return;

    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      // iOS requires user gesture click
      setPermissionState('prompt');
    } else {
      // Non-iOS: auto start listening
      requestCompassPermission();
    }

    return () => {
      const win = window as any;
      win.removeEventListener('deviceorientationabsolute', handleOrientation, true);
      win.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [isOpen, handleOrientation, requestCompassPermission]);

  if (!isOpen) return null;

  const modalBody = (
    <div className="w-full bg-[#092019] text-[#fcfbf7] rounded-3xl p-5 shadow-2xl border border-[#dfb76c]/40 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#dfb76c]/20">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#0d3b2e] border border-[#dfb76c]/40 flex items-center justify-center text-[#dfb76c] shadow-xs">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              <span>بوصلة القبلة الحية</span>
              <Sparkles className="w-3.5 h-3.5 text-[#dfb76c]" />
            </h3>
            <p className="text-[11px] text-[#dfb76c]/80 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{location.label.split('(')[0].trim()}</span>
              <span>•</span>
              <span>{distanceToMakkah.toLocaleString('ar-EG')} كم إلى مكة</span>
            </p>
          </div>
        </div>

        {!inline && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-stone-300 transition active:scale-95"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

        {/* Permission / Sensor Alert */}
        {permissionState === 'prompt' && !hasSensors && (
          <div className="p-3 rounded-2xl bg-[#0d3b2e] border border-[#dfb76c]/40 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs">
              <Smartphone className="w-5 h-5 text-[#dfb76c] shrink-0" />
              <div>
                <p className="font-bold text-white">تفعيل مستشعر الاتجاه بالهاتف</p>
                <p className="text-[10px] text-stone-300">انقر لتفعيل البوصلة ومستشعر الجيروسكوب تلقائياً</p>
              </div>
            </div>
            <button
              onClick={requestCompassPermission}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#dfb76c] to-amber-500 text-stone-950 text-xs font-bold shadow-md active:scale-95 shrink-0"
            >
              تفعيل
            </button>
          </div>
        )}

        {/* Alignment Banner Status */}
        <div
          className={`p-3 rounded-2xl transition-all duration-300 text-center flex items-center justify-center gap-2 border ${
            isAligned
              ? 'bg-emerald-900/80 border-emerald-400 text-white shadow-[0_0_20px_rgba(52,211,153,0.3)] animate-pulse'
              : 'bg-[#061813] border-[#dfb76c]/20 text-[#dfb76c]'
          }`}
        >
          {isAligned ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              <span className="text-xs sm:text-sm font-bold">
                أنت الآن باتجاه الكعبة المشرفة مباشرة 🕋
              </span>
            </>
          ) : (
            <span className="text-xs font-medium text-stone-300">
              ضع هاتفك أفقياً ودوّره حتى تتطابق الإبرة الذهبية مع مؤشر الكعبة
            </span>
          )}
        </div>

        {/* Real Dynamic Rotating Compass Dial */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto flex items-center justify-center my-2 select-none">
          {/* Outer Compass Housing Rings */}
          <div className="absolute inset-0 rounded-full border-4 border-[#dfb76c]/30 shadow-[0_0_30px_rgba(223,183,108,0.15)] bg-gradient-to-b from-[#0a2820] to-[#051611]" />
          <div className="absolute inset-2 rounded-full border border-dashed border-[#dfb76c]/25 pointer-events-none" />

          {/* 1. ROTATING COMPASS DIAL (Rotates by -currentHeading so N faces Real North) */}
          <div
            className="absolute inset-4 rounded-full transition-transform duration-200 ease-out"
            style={{ transform: `rotate(${-currentHeading}deg)` }}
          >
            {/* Cardinal Markers */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <span className="text-sm font-black text-rose-500 font-mono">N</span>
              <span className="text-[9px] font-bold text-rose-400">شمال</span>
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <span className="text-[10px] font-bold text-stone-400">جنوب</span>
              <span className="text-sm font-black text-stone-300 font-mono">S</span>
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center">
              <span className="text-sm font-black text-stone-300 font-mono">E</span>
              <span className="text-[9px] font-bold text-stone-400">شرق</span>
            </div>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col items-center">
              <span className="text-sm font-black text-stone-300 font-mono">W</span>
              <span className="text-[9px] font-bold text-stone-400">غرب</span>
            </div>

            {/* Intermediate Ticks Every 30 degrees */}
            {[30, 60, 120, 150, 210, 240, 300, 330].map((deg) => (
              <div
                key={deg}
                className="absolute inset-0 flex items-start justify-center"
                style={{ transform: `rotate(${deg}deg)` }}
              >
                <div className="w-0.5 h-2 bg-[#dfb76c]/40 mt-1" />
              </div>
            ))}

            {/* KAABA BADGE MARKER ON COMPASS DIAL AT EXACT QIBLA ANGLE */}
            <div
              className="absolute inset-0 flex items-start justify-center pointer-events-none"
              style={{ transform: `rotate(${qiblaAngle}deg)` }}
            >
              <div className="flex flex-col items-center -mt-3.5 animate-bounce">
                {/* 3D Kaaba Icon with Golden Aura */}
                <div className="w-7 h-7 rounded-lg bg-stone-950 border-2 border-[#dfb76c] flex items-center justify-center shadow-[0_0_15px_rgba(223,183,108,0.7)] text-[11px] font-bold text-[#dfb76c]">
                  🕋
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#dfb76c] mt-0.5" />
              </div>
            </div>
          </div>

          {/* 2. REAL-TIME QIBLA NEEDLE (Rotates to point directly to Qibla) */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-out pointer-events-none"
            style={{ transform: `rotate(${qiblaAngle - currentHeading}deg)` }}
          >
            {/* Top North/Qibla Pointer Half */}
            <div className="relative flex flex-col items-center h-28 -translate-y-14">
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[24px] border-b-[#dfb76c] filter drop-shadow-[0_0_8px_rgba(223,183,108,0.6)]" />
              <div className="w-2.5 h-20 bg-gradient-to-b from-[#dfb76c] via-amber-400 to-[#0d3b2e] rounded-t-sm" />
            </div>

            {/* Bottom Counter-weight Pointer Half */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 h-20 flex flex-col items-center">
              <div className="w-2 h-14 bg-gradient-to-b from-[#0d3b2e] to-stone-700/60 rounded-b-sm" />
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[14px] border-t-stone-700" />
            </div>

            {/* Central Pivot Jewel */}
            <div className="w-7 h-7 rounded-full bg-[#0a231b] border-2 border-[#dfb76c] shadow-md flex items-center justify-center z-20">
              <div className="w-2.5 h-2.5 rounded-full bg-[#dfb76c]" />
            </div>
          </div>

          {/* Fixed Phone Reference Top Indicator */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-emerald-400" />
            <span className="text-[8px] font-bold text-emerald-400 bg-[#092019] px-1 rounded-sm mt-0.5">
              مقدمة الهاتف
            </span>
          </div>
        </div>

        {/* Readouts & Metrics */}
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="p-3 rounded-2xl bg-[#061813] border border-[#dfb76c]/20 space-y-1">
            <div className="text-[10px] text-stone-400">زاوية القبلة لموقعك</div>
            <div className="text-xl font-black text-[#dfb76c] font-mono tabular-nums">
              {qiblaAngle}°
            </div>
            <div className="text-[10px] text-stone-500">من اتجاه الشمال الحقيقي</div>
          </div>

          <div className="p-3 rounded-2xl bg-[#061813] border border-[#dfb76c]/20 space-y-1">
            <div className="text-[10px] text-stone-400">اتجاه هاتفك الحالي</div>
            <div className="text-xl font-black text-white font-mono tabular-nums">
              {currentHeading}°
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold">
              {hasSensors ? 'المستشعر نشط' : 'محاكاة باللمس'}
            </div>
          </div>
        </div>

        {/* Desktop / Manual Slider fallback if sensors unavailable */}
        {!hasSensors && (
          <div className="p-3 rounded-2xl bg-[#08221b] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-300">
              <span>تدوير الهاتف تجريبياً (محاكاة):</span>
              <span className="font-mono text-[#dfb76c] font-bold">{manualOffset}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="359"
              value={manualOffset}
              onChange={(e) => setManualOffset(parseInt(e.target.value, 10))}
              className="w-full accent-[#dfb76c] cursor-pointer"
            />
            <p className="text-[10px] text-stone-400 text-center">
              💡 على هاتفك الذكي: البوصلة تدور تلقائياً في الوقت الحقيقي بمستشعر الجهاز
            </p>
          </div>
        )}
      </div>
    );

  if (inline) {
    return <div className="space-y-4 pb-12 animate-in fade-in duration-200">{modalBody}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md max-h-[92vh] overflow-y-auto no-scrollbar">
        {modalBody}
      </div>
    </div>
  );
};
