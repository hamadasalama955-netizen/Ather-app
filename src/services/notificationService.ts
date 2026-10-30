/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PrayerInfo } from '../types';
import { cleanTimeString, parseTimeToDate } from '../utils/prayerUtils';

const NOTIFICATION_ICON = '/assets/aistudio/image_fdb94482.png';
const NOTIFICATION_BADGE = '/icon-192.png';

let intervalId: any = null;
let lastNotifiedKey = '';

/**
 * Requests permission for device/browser notifications
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      sendTestNotification();
    }
    return permission;
  } catch (e) {
    console.warn('Failed to request notification permission:', e);
    return 'denied';
  }
}

/**
 * Sends a welcome/test notification
 */
export function sendTestNotification(): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  try {
    new Notification('أثَر | رفيق المسلم', {
      body: 'تم تفعيل تنبيهات مواقيت الصلاة والأذكار بنجاح 🕌',
      icon: NOTIFICATION_ICON,
      badge: NOTIFICATION_BADGE,
      dir: 'rtl',
      lang: 'ar',
    });
  } catch (e) {
    console.warn('Could not display notification:', e);
  }
}

/**
 * Checks prayer times and triggers notification if a prayer is within 15 minutes or now
 */
export function startPrayerNotificationWatcher(
  dailyPrayers: PrayerInfo[],
  isAdhanEnabled: boolean = true
): void {
  if (intervalId) {
    clearInterval(intervalId);
  }

  if (!isAdhanEnabled || typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  const check = () => {
    if (Notification.permission !== 'granted') return;

    const nextPrayer = dailyPrayers.find((p) => p.isNext);
    if (!nextPrayer) return;

    const now = new Date();
    const prayerDate = parseTimeToDate(cleanTimeString(nextPrayer.time), now);
    // If prayer time has passed for today and is wrapped around (e.g. Fajr next day)
    if (prayerDate.getTime() < now.getTime() - 1000 * 60 * 60) {
      prayerDate.setDate(prayerDate.getDate() + 1);
    }
    const diffMs = prayerDate.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / 60000);

    const todayDateStr = now.toISOString().split('T')[0];
    const notifyKey15 = `${todayDateStr}_${nextPrayer.key}_15min`;
    const notifyKeyNow = `${todayDateStr}_${nextPrayer.key}_now`;

    // 1. Approaching prayer alert (between 12 and 15 mins before)
    if (diffMins <= 15 && diffMins >= 10 && lastNotifiedKey !== notifyKey15) {
      lastNotifiedKey = notifyKey15;
      new Notification('اقترب موعد الصلاة 🕌', {
        body: `صلاة ${nextPrayer.arabicName} بعد قرابة ${diffMins} دقيقة. استعد بالوضوء وأذكار الإقبال على الصلاة.`,
        icon: NOTIFICATION_ICON,
        badge: NOTIFICATION_BADGE,
        dir: 'rtl',
        lang: 'ar',
      });
    }

    // 2. Exact Adhan alert (within 2 mins)
    if (diffMins <= 1 && diffMins >= -2 && lastNotifiedKey !== notifyKeyNow) {
      lastNotifiedKey = notifyKeyNow;
      new Notification(`حان الآن موعد صلاة ${nextPrayer.arabicName} 🕌`, {
        body: `حيّ على الصلاة، حيّ على الفلاح. أثَر | رفيق المسلم.`,
        icon: NOTIFICATION_ICON,
        badge: NOTIFICATION_BADGE,
        dir: 'rtl',
        lang: 'ar',
      });
    }
  };

  // Check immediately, then every 45 seconds
  check();
  intervalId = setInterval(check, 45000);
}

export function stopPrayerNotificationWatcher(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
