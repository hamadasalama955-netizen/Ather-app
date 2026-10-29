/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavigationTab, PrayerTimesResponse } from './types';
import { useTheme } from './hooks/useTheme';
import { useSettings } from './hooks/useSettings';
import { fetchPrayerTimes } from './services/aladhanApi';
import { TopHeader } from './components/layout/TopHeader';
import { HomeTab } from './components/home/HomeTab';
import { PrayersTab } from './components/prayers/PrayersTab';
import { QuranTab } from './components/quran/QuranTab';
import { HisnMuslimTab } from './components/athkar/HisnMuslimTab';
import { TrackerTab, TrackerSubView } from './components/tracker/TrackerTab';
import { MoreTab } from './components/more/MoreTab';
import { PrayerReviewTab } from './components/review_prayer/PrayerReviewTab';
import { Hadith100Tab } from './components/hadith/Hadith100Tab';
import { LocationModal } from './components/common/LocationModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { ServicesGridModal } from './components/home/ServicesGridModal';
import { ShareForRewardModal } from './components/home/ShareForRewardModal';
import { IslamicHistoryModal } from './components/home/IslamicHistoryModal';
import { RamadanSectionModal } from './components/home/RamadanSectionModal';
import { HisnMuslimModal } from './components/home/HisnMuslimModal';
import { QiblaCompassModal } from './components/home/QiblaCompassModal';
import { cleanTimeString } from './utils/prayerUtils';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [trackerInitialSubView, setTrackerInitialSubView] = useState<TrackerSubView>('daily');
  const [athkarInitialSubTab, setAthkarInitialSubTab] = useState<'daily' | 'tahseen' | 'all' | 'sebha' | 'athkar'>('daily');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isGlobalServicesModalOpen, setIsGlobalServicesModalOpen] = useState(false);
  const [isGlobalShareOpen, setIsGlobalShareOpen] = useState(false);
  const [isGlobalHistoryOpen, setIsGlobalHistoryOpen] = useState(false);
  const [isGlobalRamadanOpen, setIsGlobalRamadanOpen] = useState(false);
  const [isGlobalHisnOpen, setIsGlobalHisnOpen] = useState(false);
  const [isGlobalQiblaOpen, setIsGlobalQiblaOpen] = useState(false);

  const handleOpenTracker = (subView: TrackerSubView = 'daily') => {
    setTrackerInitialSubView(subView);
    setActiveTab('tracker');
  };

  const handleOpenAthkar = (subTab: 'daily' | 'tahseen' | 'all' | 'sebha' | 'athkar' = 'daily') => {
    setAthkarInitialSubTab(subTab);
    setActiveTab('athkar');
  };

  const { theme, isDark, toggleTheme, updateTheme } = useTheme();
  const {
    settings,
    isLocating,
    locationError,
    updateMethodId,
    updateAsrSchool,
    updateTimeFormat,
    setLocation,
    requestGPSLocation,
  } = useSettings();

  const [prayerData, setPrayerData] = useState<PrayerTimesResponse | null>(null);
  const [isLoadingPrayers, setIsLoadingPrayers] = useState(true);
  const [prayerError, setPrayerError] = useState<string | null>(null);

  // Fetch prayer timings whenever location, calculation method, or asr school changes
  useEffect(() => {
    let isMounted = true;

    async function loadTimings() {
      setIsLoadingPrayers(true);
      setPrayerError(null);
      try {
        const data = await fetchPrayerTimes(
          settings.selectedLocation,
          settings.methodId,
          settings.asrSchool
        );
        if (isMounted) {
          setPrayerData(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'تعذر تحميل مواقيت الصلاة';
          setPrayerError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoadingPrayers(false);
        }
      }
    }

    loadTimings();

    return () => {
      isMounted = false;
    };
  }, [settings.selectedLocation, settings.methodId, settings.asrSchool]);

  return (
    <div className="min-h-screen bg-stone-200/60 dark:bg-[#0a0a0a] flex flex-col justify-between antialiased selection:bg-[#d4af37] selection:text-black transition-colors duration-200">
      {/* Mobile-first centered frame on desktop, full-width responsive on mobile */}
      <div className="w-full max-w-md mx-auto min-h-screen bg-[#fcfbf7] dark:bg-[#0f0f0f] flex flex-col relative shadow-xl sm:border-x sm:border-stone-300/40 dark:sm:border-[rgba(212,175,55,0.2)]">
        {/* Top App Header (Shown on other tabs, while Home has its dedicated HomeTopBar) */}
        {activeTab !== 'home' && (
          <TopHeader
            isDark={isDark}
            onToggleTheme={toggleTheme}
            location={settings.selectedLocation}
            hijriDate={prayerData?.date.hijri}
            onOpenLocationPicker={() => setIsLocationModalOpen(true)}
            onNavigateHome={() => setActiveTab('home')}
            onOpenServices={() => setIsGlobalServicesModalOpen(true)}
            activeTab={activeTab}
          />
        )}

        {/* Main Content Area */}
        <main className={`flex-1 px-4 ${activeTab === 'home' ? 'pt-1.5' : 'pt-3'} pb-8 overflow-y-auto`}>
          {activeTab === 'home' && (
            <HomeTab
              prayerData={prayerData}
              isLoadingPrayers={isLoadingPrayers}
              prayerError={prayerError}
              location={settings.selectedLocation}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenLocationModal={() => setIsLocationModalOpen(true)}
              is24h={settings.timeFormat24}
              onOpenTracker={handleOpenTracker}
              onOpenAthkar={handleOpenAthkar}
              isDark={isDark}
              onToggleTheme={toggleTheme}
            />
          )}

          {activeTab === 'prayers' && (
            <PrayersTab
              prayerData={prayerData}
              isLoading={isLoadingPrayers}
              error={prayerError}
              location={settings.selectedLocation}
              settings={settings}
              onUpdateMethod={updateMethodId}
              onUpdateAsrSchool={updateAsrSchool}
              onUpdateTimeFormat={updateTimeFormat}
              onOpenLocationModal={() => setIsLocationModalOpen(true)}
            />
          )}

          {activeTab === 'tracker' && (
            <TrackerTab
              hijriDate={prayerData?.date.hijri}
              onNavigateTab={(tab) => setActiveTab(tab)}
              initialSubView={trackerInitialSubView}
            />
          )}

          {activeTab === 'quran' && <QuranTab />}

          {(activeTab === 'athkar' || (activeTab as string) === 'hisn') && (
            <HisnMuslimTab
              initialSubTab={athkarInitialSubTab === 'sebha' ? 'sebha' : athkarInitialSubTab === 'tahseen' ? 'tahseen' : athkarInitialSubTab === 'all' ? 'all' : 'daily'}
              onNavigateHome={() => setActiveTab('home')}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'more' && (
            <MoreTab
              theme={theme}
              onUpdateTheme={updateTheme}
              settings={settings}
              location={settings.selectedLocation}
              onOpenLocationModal={() => setIsLocationModalOpen(true)}
              onUpdateMethod={updateMethodId}
              onUpdateAsrSchool={updateAsrSchool}
              onUpdateTimeFormat={updateTimeFormat}
              onOpenTracker={handleOpenTracker}
            />
          )}

          {activeTab === 'review_prayer' && (
            <PrayerReviewTab
              onNavigateHome={() => setActiveTab('home')}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'hadith' && (
            <Hadith100Tab
              onNavigateHome={() => setActiveTab('home')}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}
        </main>

        {/* Global Services Modal accessible from any tab */}
        <ServicesGridModal
          isOpen={isGlobalServicesModalOpen}
          onClose={() => setIsGlobalServicesModalOpen(false)}
          onNavigateTab={(tab) => {
            setActiveTab(tab);
            setIsGlobalServicesModalOpen(false);
          }}
          onOpenAthkar={(sub) => {
            handleOpenAthkar(sub);
            setIsGlobalServicesModalOpen(false);
          }}
          onOpenTracker={(sub) => {
            handleOpenTracker(sub);
            setIsGlobalServicesModalOpen(false);
          }}
          onOpenQibla={() => {
            setIsGlobalServicesModalOpen(false);
            setIsGlobalQiblaOpen(true);
          }}
          onOpenShareReward={() => {
            setIsGlobalServicesModalOpen(false);
            setIsGlobalShareOpen(true);
          }}
          onOpenIslamicHistory={() => {
            setIsGlobalServicesModalOpen(false);
            setIsGlobalHistoryOpen(true);
          }}
          onOpenRamadan={() => {
            setIsGlobalServicesModalOpen(false);
            setIsGlobalRamadanOpen(true);
          }}
          onOpenHisnMuslim={() => {
            setIsGlobalServicesModalOpen(false);
            setActiveTab('athkar');
            setAthkarInitialSubTab('daily');
          }}
        />

        <ShareForRewardModal
          isOpen={isGlobalShareOpen}
          onClose={() => setIsGlobalShareOpen(false)}
        />

        <IslamicHistoryModal
          isOpen={isGlobalHistoryOpen}
          onClose={() => setIsGlobalHistoryOpen(false)}
        />

        <RamadanSectionModal
          isOpen={isGlobalRamadanOpen}
          onClose={() => setIsGlobalRamadanOpen(false)}
          fajrTime={prayerData?.timings ? cleanTimeString(prayerData.timings.Fajr) : undefined}
          maghribTime={prayerData?.timings ? cleanTimeString(prayerData.timings.Maghrib) : undefined}
          location={settings.selectedLocation}
          prayerData={prayerData}
        />

        <HisnMuslimModal
          isOpen={isGlobalHisnOpen}
          onClose={() => setIsGlobalHisnOpen(false)}
        />

        <QiblaCompassModal
          isOpen={isGlobalQiblaOpen}
          onClose={() => setIsGlobalQiblaOpen(false)}
          location={settings.selectedLocation}
        />

        {/* Location & GPS Modal */}
        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          currentLocation={settings.selectedLocation}
          onSelectLocation={setLocation}
          onRequestGPS={requestGPSLocation}
          isLocating={isLocating}
          locationError={locationError}
        />
      </div>
    </div>
  );
}
