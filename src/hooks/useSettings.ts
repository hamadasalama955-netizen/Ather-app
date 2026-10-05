import { useState, useEffect } from 'react';
import { AppSettings, LocationConfig } from '../types';
import { PRESET_LOCATIONS } from '../utils/constants';

const SETTINGS_KEY = 'noor_app_settings';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  methodId: 4, // Umm al-Qura Makkah
  asrSchool: 'standard',
  timeFormat24: false,
  soundEnabled: true,
  selectedLocation: PRESET_LOCATIONS[0], // Makkah
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed reading settings from storage:', e);
    }
    return DEFAULT_SETTINGS;
  });

  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed writing settings:', e);
    }
  }, [settings]);

  const updateMethodId = (methodId: number) => {
    setSettings((prev) => ({ ...prev, methodId }));
  };

  const updateAsrSchool = (asrSchool: 'standard' | 'hanafi') => {
    setSettings((prev) => ({ ...prev, asrSchool }));
  };

  const updateTimeFormat = (timeFormat24: boolean) => {
    setSettings((prev) => ({ ...prev, timeFormat24 }));
  };

  const updateSoundEnabled = (soundEnabled: boolean) => {
    setSettings((prev) => ({ ...prev, soundEnabled }));
  };

  const setLocation = (location: LocationConfig) => {
    setLocationError(null);
    setSettings((prev) => ({ ...prev, selectedLocation: location }));
  };

  const requestGPSLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('خاصية تحديد الموقع غير مدعومة في متصفحك');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const lat = Number(position.coords.latitude.toFixed(4));
        const lng = Number(position.coords.longitude.toFixed(4));

        setLocation({
          type: 'coords',
          latitude: lat,
          longitude: lng,
          label: 'موقعي الحالي (GPS)',
          isCustom: true,
        });
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = 'تعذر الوصول إلى الموقع الجغرافي';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'تم رفض إذن تحديد الموقع. يرجى تفعيله من إعدادات المتصفح أو اختيار مدينة من القائمة.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'انتهت مهلة طلب تحديد الموقع.';
        }
        setLocationError(errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  return {
    settings,
    isLocating,
    locationError,
    updateMethodId,
    updateAsrSchool,
    updateTimeFormat,
    updateSoundEnabled,
    setLocation,
    requestGPSLocation,
  };
}
