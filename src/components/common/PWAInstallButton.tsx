import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2, Copy, Check, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface Props {
  variant?: 'header' | 'card' | 'settings';
}

export const PWAInstallButton: React.FC<Props> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-pnfgdtixcyy4ixo3ukklm3-912110944440.europe-west2.run.app';
  const pwaBuilderUrl = `https://www.pwabuilder.com?url=${encodeURIComponent(appUrl)}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  // If already running standalone
  if (isInstalled) {
    if (variant === 'settings' || variant === 'card') {
      return (
        <div className="flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div className="space-y-0.5">
            <span className="font-bold">التطبيق مثبت ويعمل كـ تطبيق أصيل على جهازك</span>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">يدعم العمل بدون إنترنت والتشغيل بملء الشاشة مع حفظ البيانات محلياً.</p>
          </div>
        </div>
      );
    }
    return null;
  }

  // Header mini button
  if (variant === 'header') {
    if (isInstallable) {
      return (
        <button
          onClick={install}
          title="تثبيت التطبيق على جهازك"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-sm transition active:scale-95 whitespace-nowrap shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>تثبيت</span>
        </button>
      );
    }

    if (isIOS) {
      return (
        <>
          <button
            onClick={() => setShowIOSGuide(true)}
            title="تثبيت التطبيق على آيفون"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl border border-emerald-700/30 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition active:scale-95 whitespace-nowrap shrink-0"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>تثبيت PWA</span>
          </button>

          {showIOSGuide && renderIOSModal()}
        </>
      );
    }

    return (
      <>
        <button
          onClick={() => setShowAndroidGuide(true)}
          title="تثبيت التطبيق أو تحميل APK"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#0d3b2e] to-[#144f3e] text-[#dfb76c] border border-[#dfb76c]/40 transition active:scale-95 whitespace-nowrap shrink-0 shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-[#dfb76c]" />
          <span>تثبيت / APK</span>
        </button>
        {showAndroidGuide && renderAndroidModal()}
      </>
    );
  }

  function renderIOSModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200" dir="rtl">
        <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-right space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-stone-200 dark:border-stone-800">
            <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-amber-500" />
              <span>تثبيت على أجهزة iPhone / iPad</span>
            </h3>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-3 text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs shrink-0">1</span>
              <p>اضغط على زر <strong>مشاركة (Share)</strong> أسفل شريط متصفح سفاري Safari.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs shrink-0">2</span>
              <p>مرر للأسفل واضغط على <strong>إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong>.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs shrink-0">3</span>
              <p>اضغط <strong>إضافة (Add)</strong> لتثبيت التطبيق بأيقونته الأصلية وبملء الشاشة.</p>
            </div>
          </div>
          <button
            onClick={() => setShowIOSGuide(false)}
            className="w-full rounded-2xl bg-emerald-700 py-3 text-sm font-bold text-white hover:bg-emerald-800 transition"
          >
            فهمت ذلك
          </button>
        </div>
      </div>
    );
  }

  function renderAndroidModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200" dir="rtl">
        <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-right space-y-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b pb-3 border-stone-200 dark:border-stone-800">
            <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-[#dfb76c]" />
              <span>تثبيت التطبيق على أندرويد وملف APK</span>
            </h3>
            <button
              onClick={() => setShowAndroidGuide(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {/* Method 1: WebAPK (Best & Easiest) */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>الطريقة الأولى: التثبيت الفوري كـ WebAPK (مباشرة بهاتفك)</span>
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                من متصفح <strong>Chrome</strong> على هاتفك الأندرويد، اضغط خيارات القائمة <strong>(الثلاث نقاط ⋮)</strong> ثم اختر <strong>«تثبيت التطبيق»</strong>. سيقوم نظام أندرويد تلقائياً بإنشاء حزمة <strong>APK أصيلة</strong> وتثبيتها فوراً على جهازك.
              </p>
              {isInstallable && (
                <button
                  onClick={() => {
                    install();
                    setShowAndroidGuide(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center gap-2 transition active:scale-95 shadow-sm text-xs mt-2"
                >
                  <Download className="w-4 h-4" />
                  <span>تثبيت التطبيق على هاتفك الآن</span>
                </button>
              )}
            </div>

            {/* Method 2: Download Complete Android Project (Capacitor Native) */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0d3b2e]/10 to-[#dfb76c]/15 dark:from-[#122e23] dark:to-[#dfb76c]/20 border border-[#dfb76c]/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0d3b2e] dark:text-[#dfb76c] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#dfb76c]" />
                  <span>الطريقة الثانية: تحميل مشروع أندرويد الجاهز (Capacitor Android)</span>
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                قمنا بتجهيز وبناء مجلد مشروع الأندرويد الأصيل بالكامل مع كافة الملفات والبيانات أوفلاين. يمكنك تنزيل ملف ZIP وفتحه مباشرة في Android Studio واستخراج ملف APK بنقرة واحدة (Build &gt; Build APK).
              </p>

              <div className="pt-1">
                <a
                  href="/athar-android-project.zip"
                  download="athar-android-project.zip"
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#0d3b2e] to-[#144f3e] text-[#dfb76c] border border-[#dfb76c]/40 font-bold flex items-center justify-center gap-2 transition active:scale-95 shadow-xs text-xs"
                >
                  <Download className="w-4 h-4 text-[#dfb76c]" />
                  <span>تنزيل مشروع أندرويد الكامل (athar-android-project.zip)</span>
                </a>
              </div>
            </div>

            {/* Note on PWABuilder / Security Cookies */}
            <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-[11px] text-stone-600 dark:text-stone-300 space-y-1.5">
              <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                <span>💡 ملاحظة حول PWABuilder:</span>
              </span>
              <p className="leading-relaxed">
                رابط المعاينة التجريبي محمي بواسطة جدار حماية Google Cloud Session Cookies الذي يمنع روبوتات المسح التلقائية الخارجية. عند نشر التطبيق على رابط عام (مثل Vercel أو Netlify أو دومين مخصص) سيعمل PWABuilder بسلاسة بنسبة 100%.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAndroidGuide(false)}
            className="w-full rounded-2xl bg-stone-200 dark:bg-stone-800 py-3 text-xs font-bold text-stone-700 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-stone-700 transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    );
  }

  // Card or settings variant
  return (
    <div className="rounded-3xl border border-[#dfb76c]/30 dark:border-[#dfb76c]/20 bg-gradient-to-br from-stone-50 via-emerald-50/30 to-amber-50/40 dark:from-[#122e23] dark:via-[#0f281e] dark:to-[#0b1f18] p-4.5 shadow-xs space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
              <Download className="w-4 h-4 text-[#dfb76c]" />
              <span>تثبيت التطبيق على هاتفك (Android / iOS)</span>
            </span>
            <span className="text-[10px] font-bold text-[#0d3b2e] dark:text-[#dfb76c] bg-[#dfb76c]/20 px-2 py-0.5 rounded-full border border-[#dfb76c]/30">
              ملف APK أو PWA
            </span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300">
            تثبيت التطبيق كـ تطبيق أصيل بملء الشاشة مع أيقونة مستقلة ودعم العمل بدون إنترنت.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isInstallable && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>تثبيت مباشر</span>
            </button>
          )}

          <button
            onClick={() => (isIOS ? setShowIOSGuide(true) : setShowAndroidGuide(true))}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0d3b2e] to-[#144f3e] text-[#dfb76c] border border-[#dfb76c]/40 px-3.5 py-2 text-xs font-bold shadow-2xs transition active:scale-95"
          >
            <Smartphone className="w-4 h-4" />
            <span>خيارات التثبيت و APK</span>
          </button>
        </div>
      </div>

      {showIOSGuide && renderIOSModal()}
      {showAndroidGuide && renderAndroidModal()}
    </div>
  );
};
