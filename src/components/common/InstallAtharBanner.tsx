import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2, ShieldCheck, Sparkles, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface Props {
  variant?: 'banner' | 'card' | 'inline';
  className?: string;
}

export const InstallAtharBanner: React.FC<Props> = ({ variant = 'banner', className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('athar_install_banner_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('athar_install_banner_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // If not yet captured or not supported, show prompt guide
      setShowIOSModal(true);
    }
  };

  // If already installed as PWA on device
  if (isInstalled) {
    if (variant === 'card') {
      return (
        <div className={`flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs shadow-xs ${className}`}>
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="font-bold text-sm">تطبيق أثر مثبت على هاتفك</div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">يعمل بدون إنترنت 100% بكامل الخصائص والبيانات المحفوظة.</p>
          </div>
        </div>
      );
    }
    return null;
  }

  if (isDismissed && variant === 'banner') {
    return null;
  }

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-3xl border border-[#dfb76c]/40 bg-gradient-to-br from-[#0a3528] via-[#0d4434] to-[#06291e] p-4 text-white shadow-md ${className}`}
        dir="rtl"
      >
        {/* Islamic Subtle Background Pattern */}
        <div className="absolute -left-10 -bottom-10 w-36 h-36 rounded-full bg-[#dfb76c]/10 blur-2xl pointer-events-none" />
        <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-xl pointer-events-none" />

        {/* Dismiss button for banner */}
        {variant === 'banner' && (
          <button
            onClick={handleDismiss}
            aria-label="إغلاق التنبيه"
            className="absolute left-3 top-3 p-1.5 rounded-full text-emerald-300/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div className="flex items-start gap-3">
            {/* App Icon */}
            <div className="w-12 h-12 rounded-2xl p-1 bg-gradient-to-b from-[#dfb76c] to-[#99732b] shadow-sm shrink-0 flex items-center justify-center overflow-hidden">
              <img
                src="/icon.svg"
                alt="أثر"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#f5ebd2] flex items-center gap-1.5">
                  <span>تثبيت تطبيق أثر على الهاتف</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#dfb76c]" />
                </h3>
                <span className="text-[10px] font-semibold bg-[#dfb76c]/20 text-[#dfb76c] px-2 py-0.5 rounded-full border border-[#dfb76c]/30">
                  Offline 100%
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 leading-relaxed max-w-md">
                تثبيت فوري على شاشة هاتفك الرئيسية • يفتح ويعمل بدون إنترنت نهائياً • شاشة كاملة وسريعة بدون إعلانات.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0 pt-1 sm:pt-0">
            <button
              onClick={handleInstallClick}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#dfb76c] to-[#c99d4e] hover:from-[#ebd296] hover:to-[#dfb76c] text-[#062b20] font-bold text-xs sm:text-sm shadow-sm transition active:scale-95"
            >
              <Download className="w-4 h-4 text-[#062b20]" />
              <span>تثبيت تطبيق أثر على الهاتف</span>
            </button>
          </div>
        </div>
      </div>

      {/* iOS & Browser Instruction Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200" dir="rtl">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-2xl text-right space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white">طريقة تثبيت تطبيق أثر</h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">على أجهزة iPhone و Android</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <div className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <span>اضغط على زر المشاركة</span>
                    <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    في متصفح <strong>Safari</strong> أسفل الشاشة، أو قائمة الثلاث نقاط <strong>(⋮)</strong> في متصفح <strong>Chrome</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <div className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <span>إضافة إلى الشاشة الرئيسية</span>
                    <PlusSquare className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    مرر للأسفل في القائمة واختر <strong>«إضافة إلى الشاشة الرئيسية» (Add to Home Screen)</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <div className="font-bold text-stone-900 dark:text-white">
                    اضغط إضافة (Add)
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    سيظهر تطبيق <strong>أثر</strong> بأيقونته الرسمية على شاشة هاتفك ويعمل بملء الشاشة بدون إنترنت 100%.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition shadow-sm"
            >
              فهمت ذلك، تم
            </button>
          </div>
        </div>
      )}
    </>
  );
};
