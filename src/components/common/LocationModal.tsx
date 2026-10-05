import React, { useState } from 'react';
import { X, MapPin, Navigation, Search, Check } from 'lucide-react';
import { LocationConfig } from '../../types';
import { PRESET_LOCATIONS } from '../../utils/constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationConfig;
  onSelectLocation: (loc: LocationConfig) => void;
  onRequestGPS: () => void;
  isLocating: boolean;
  locationError: string | null;
}

export const LocationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
  onRequestGPS,
  isLocating,
  locationError,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [customCountry, setCustomCountry] = useState('');

  if (!isOpen) return null;

  const filteredPresets = PRESET_LOCATIONS.filter((loc) =>
    loc.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (loc.city && loc.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelect = (loc: LocationConfig) => {
    onSelectLocation(loc);
    onClose();
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCity.trim()) return;
    onSelectLocation({
      type: 'city',
      city: customCity.trim(),
      country: customCountry.trim(),
      label: `${customCity.trim()} ${customCountry.trim() ? `(${customCountry.trim()})` : ''}`,
      isCustom: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-stone-900 dark:text-white">
              تحديد الموقع ومواقيت الصلاة
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 space-y-4">
          {/* GPS Button */}
          <button
            onClick={onRequestGPS}
            disabled={isLocating}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-sm transition active:scale-[0.98] disabled:opacity-75"
          >
            <div className="flex items-center gap-2.5">
              <Navigation className={`w-4 h-4 text-amber-300 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'جاري تحديد موقعك عبر GPS...' : 'استخدام موقعي الحالي (GPS)'}</span>
            </div>
            <span className="text-xs bg-emerald-800/80 px-2 py-0.5 rounded-lg text-emerald-100">
              دقيق وتلقائي
            </span>
          </button>

          {locationError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
              {locationError}
            </div>
          )}

          {/* Search Presets */}
          <div className="relative">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="ابحث عن مدينة أو دولة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700/60 text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Preset list */}
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-stone-500 dark:text-stone-400 px-1 mb-1.5">
              المدن الأكثر استخداماً ({filteredPresets.length})
            </h3>
            <div className="max-h-48 overflow-y-auto space-y-1 pr-0.5">
              {filteredPresets.map((loc) => {
                const isSelected =
                  currentLocation.label === loc.label ||
                  (currentLocation.latitude === loc.latitude && currentLocation.longitude === loc.longitude);

                return (
                  <button
                    key={loc.label}
                    onClick={() => handleSelect(loc)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-right text-xs transition ${
                      isSelected
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800'
                        : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span>{loc.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom City Form */}
          <form onSubmit={handleAddCustom} className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-2">
            <h3 className="text-xs font-bold text-stone-600 dark:text-stone-300">
              أو أدخل اسم مدينتك يدوياً
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="المدينة (مثال: الإسكندرية)"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700/60 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
              <input
                type="text"
                placeholder="الدولة (مثال: مصر)"
                value={customCountry}
                onChange={(e) => setCustomCountry(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700/60 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
            <button
              type="submit"
              disabled={!customCity.trim()}
              className="w-full py-2 rounded-xl bg-stone-800 dark:bg-stone-700 hover:bg-stone-900 dark:hover:bg-stone-600 text-white font-medium text-xs transition disabled:opacity-50"
            >
              تأكيد وتطبيق
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
