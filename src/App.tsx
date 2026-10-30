/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { NavigationTab, PrayerTimesResponse } from './types';
import { useTheme } from './hooks/useTheme';
import { useSettings } from './hooks/useSettings';
import { fetchPrayerTimes } from './services/aladhanApi';
import { HomeTab } from './components/home/HomeTab';
import { PrayersTab } from './components/prayers/PrayersTab';
import { QuranTab } from './components/quran/QuranTab';
import { HisnMuslimTab } from './components/athkar/HisnMuslimTab';
import { TrackerTab, TrackerSubView } from './components/tracker/TrackerTab';
import { MoreTab } from './components/more/MoreTab';
import { PrayerReviewTab } from './components/review_prayer/PrayerReviewTab';
import { Hadith100Tab } from './components/hadith/Hadith100Tab';
import { LocationModal } from './components/common/LocationModal';
import { ServicesGridModal } from './components/home/ServicesGridModal';
import { ShareForRewardModal } from './components/home/ShareForRewardModal';
import { IslamicHistoryModal } from './components/home/IslamicHistoryModal';
import { RamadanSectionModal } from './components/home/RamadanSectionModal';
import { HisnMuslimModal } from './components/home/HisnMuslimModal';
import { QiblaCompassModal } from './components/home/QiblaCompassModal';
import { IslamicQuizModal } from './components/quiz/IslamicQuizModal';
import { ExitConfirmModal } from './components/common/ExitConfirmModal';
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
  const [isGlobalQuizOpen, setIsGlobalQuizOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  // References for popstate back button handler
  const stateRef = useRef({
    activeTab,
    isLocationModalOpen,
    isGlobalServicesModalOpen,
    isGlobalShareOpen,
    isGlobalHistoryOpen,
    isGlobalRamadanOpen,
    isGlobalHisnOpen,
    isGlobalQiblaOpen,
    isGlobalQuizOpen,
    isExitModalOpen,
  });

  useEffect(() => {
    stateRef.current = {
      activeTab,
      isLocationModalOpen,
      isGlobalServicesModalOpen,
      isGlobalShareOpen,
      isGlobalHistoryOpen,
      isGlobalRamadanOpen,
      isGlobalHisnOpen,
      isGlobalQiblaOpen,
      isGlobalQuizOpen,
      isExitModalOpen,
    };
  }, [
    activeTab,
    isLocationModalOpen,
    isGlobalServicesModalOpen,
    isGlobalShareOpen,
    isGlobalHistoryOpen,
    isGlobalRamadanOpen,
    isGlobalHisnOpen,
    isGlobalQiblaOpen,
    isGlobalQuizOpen,
    isExitModalOpen,
  ]);

  // Mobile Back Button interception
  useEffect(() => {
    // Seed initial history entry
    window.history.replaceState({ appState: 'root' }, '');
    window.history.pushState({ appState: 'active' }, '');

    const handlePopState = (event: PopStateEvent) => {
      const current = stateRef.current;

      // 1. If Exit Modal is open, close it
      if (current.isExitModalOpen) {
        setIsExitModalOpen(false);
        window.history.pushState({ appState: 'active' }, '');
        return;
      }

      // 2. If any other modal is open, close it instead of leaving
      if (
        current.isGlobalServicesModalOpen ||
        current.isGlobalShareOpen ||
        current.isGlobalHistoryOpen ||
        current.isGlobalRamadanOpen ||
        current.isGlobalHisnOpen ||
        current.isGlobalQiblaOpen ||
        current.isGlobalQuizOpen ||
        current.isLocationModalOpen
      ) {
        setIsGlobalServicesModalOpen(false);
        setIsGlobalShareOpen(false);
        setIsGlobalHistoryOpen(false);
        setIsGlobalRamadanOpen(false);
        setIsGlobalHisnOpen(false);
        setIsGlobalQiblaOpen(false);
        setIsGlobalQuizOpen(false);
        setIsLocationModalOpen(false);
        window.history.pushState({ appState: 'active' }, '');
        return;
      }

      // 3. If currently in a secondary tab, return to HomeTab
      if (current.activeTab !== 'home') {
        setActiveTab('home');
        window.history.pushState({ appState: 'active' }, '');
        return;
      }

      // 4. If in HomeTab, ask for confirmation to exit
      setIsExitModalOpen(true);
      window.history.pushState({ appState: 'active' }, '');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleConfirmExit = () => {
    setIsExitModalOpen(false);
    // Allow browser / webview to exit by going back to the root state
    window.history.go(-2);
  };

  const handleOpenTracker = (subView: TrackerSubView = 'daily') => {
    setTrackerInitialSubView(subView);
    setActiveTab('tracker');
    window.history.pushState({ appState: 'tracker' }, '');
  };

  const handleOpenAthkar = (subTab: 'daily' | 'tahseen' | 'all' | 'sebha' | 'athkar' = 'daily') => {
    setAthkarInitialSubTab(subTab);
    setActiveTab('athkar');
    window.history.pushState({ appState: 'athkar' }, '');
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
        {/* Main Content Area - Note: TopHeader on secondary tabs removed per user request */}
        <main className={`flex-1 px-4 ${activeTab === 'home' ? 'pt-1.5' : 'pt-2'} pb-8 overflow-y-auto`}>
          {activeTab === 'home' && (
            <HomeTab
              prayerData={prayerData}
              isLoadingPrayers={isLoadingPrayers}
              prayerError={prayerError}
              location={settings.selectedLocation}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                window.history.pushState({ appState: tab }, '');
              }}
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
              onNavigateHome={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'tracker' && (
            <TrackerTab
              hijriDate={prayerData?.date.hijri}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                window.history.pushState({ appState: tab }, '');
              }}
              onNavigateHome={() => setActiveTab('home')}
              initialSubView={trackerInitialSubView}
            />
          )}

          {activeTab === 'quran' && (
            <QuranTab onNavigateHome={() => setActiveTab('home')} />
          )}

          {(activeTab === 'athkar' || (activeTab as string) === 'hisn') && (
            <HisnMuslimTab
              initialSubTab={athkarInitialSubTab === 'sebha' ? 'sebha' : athkarInitialSubTab === 'tahseen' ? 'tahseen' : athkarInitialSubTab === 'all' ? 'all' : 'daily'}
              onNavigateHome={() => setActiveTab('home')}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                window.history.pushState({ appState: tab }, '');
              }}
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
              onNavigateHome={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'review_prayer' && (
            <PrayerReviewTab
              onNavigateHome={() => setActiveTab('home')}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                window.history.pushState({ appState: tab }, '');
              }}
            />
          )}

          {activeTab === 'hadith' && (
            <Hadith100Tab
              onNavigateHome={() => setActiveTab('home')}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                window.history.pushState({ appState: tab }, '');
              }}
            />
          )}
        </main>

        {/* Global Services Modal */}
        <ServicesGridModal
          isOpen={isGlobalServicesModalOpen}
          onClose={() => setIsGlobalServicesModalOpen(false)}
          onNavigateTab={(tab) => {
            setActiveTab(tab);
            setIsGlobalServicesModalOpen(false);
            window.history.pushState({ appState: tab }, '');
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
          onOpenQuiz={() => {
            setIsGlobalServicesModalOpen(false);
            setIsGlobalQuizOpen(true);
          }}
        />

        <IslamicQuizModal
          isOpen={isGlobalQuizOpen}
          onClose={() => setIsGlobalQuizOpen(false)}
          isDark={isDark}
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

        {/* Exit Confirmation Dialog when pressing Back on Home Tab */}
        <ExitConfirmModal
          isOpen={isExitModalOpen}
          onClose={() => setIsExitModalOpen(false)}
          onConfirmExit={handleConfirmExit}
        />
      </div>
    </div>
  );
}
