import { useState } from 'react';
import { PrayerLog, WeeklyAnalytics } from '../types';
import {
  getPrayerLog,
  savePrayerLog,
  getTodayDateKey,
  getWeeklyAnalytics,
  getHijriAdjustment,
  setHijriAdjustment,
} from '../services/trackerService';

export function useTrackerData() {
  const [todayLog, setTodayLog] = useState<PrayerLog>(getPrayerLog());
  const [analytics, setAnalytics] = useState<WeeklyAnalytics>(getWeeklyAnalytics());
  const [hijriAdjustment, setAdjustment] = useState<number>(getHijriAdjustment());

  const handleUpdateLog = (updated: Partial<PrayerLog>) => {
    const nextLog = { ...todayLog, ...updated };
    setTodayLog(nextLog);
    savePrayerLog(getTodayDateKey(), nextLog);
    setAnalytics(getWeeklyAnalytics());
  };

  const handleUpdateAdjustment = (offset: number) => {
    setAdjustment(offset);
    setHijriAdjustment(offset);
  };

  return {
    todayLog,
    analytics,
    hijriAdjustment,
    handleUpdateLog,
    handleUpdateAdjustment,
  };
}
