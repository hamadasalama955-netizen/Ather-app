import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2, Share2, PlusSquare, Zap, ShieldCheck } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface Props {
  variant?: 'banner' | 'card' | 'inline';
  className?: string;
  isDark?: boolean;
}

export const InstallAtharBanner: React.FC<Props> = ({ variant = 'banner', className = '', isDark: propIsDark }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('athar_install_banner_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const isDark = propIsDark !== undefined
    ? propIsDark
    : typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

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
    } else {
      setShowIOSModal(true);
    }
  };

  // If already installed as PWA on device
  if (isInstalled) {
    if (variant === 'card') {
      return (
        <div
          className={`flex items-center gap-3 p-3.5 rounded-3xl border text-xs shadow-xs transition-colors ${
            isDark
              ? 'bg-[#141414] border-[#d4af37]/30 text-[#d4af37]'
              : 'bg-[#faf8f5] border-amber-300/70 text-amber-800'
          } ${className}`}
          dir="rtl"
        >
          <div className="w-9 h-9 rounded-2xl bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-[#d4af37]" />
          </div>
          <div>
            <div className="font-bold text-sm text-stone-900 dark:text-white">
              تطبيق أثَر مثبت على هاتفك
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              يعمل بدون إنترنت بنسبة 100% بكامل الخصائص والبيانات المحفوظة.
            </p>
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
        className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-300 p-4 sm:p-5 shadow-lg select-none ${
          isDark
            ? 'bg-gradient-to-br from-[#1a1712] via-[#12110e] to-[#0a0a0a] border-[#d4af37]/45 text-white shadow-[0_8px_30px_rgba(0,0,0,0.7)]'
            : 'bg-gradient-to-br from-[#ffffff] via-[#fdfbf7] to-[#f7f3e8] border-[#c5a059] text-stone-900 shadow-[0_8px_25px_rgba(212,175,55,0.18)]'
        } ${className}`}
        dir="rtl"
      >
        {/* Ambient golden glow */}
        <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-[#d4af37]/15 blur-2xl pointer-events-none" />
        <div className="absolute right-0 top-0 w-28 h-28 bg-[#c5a059]/10 rounded-full blur-xl pointer-events-none" />

        {/* Dismiss button */}
        {variant === 'banner' && (
          <button
            onClick={handleDismiss}
            aria-label="إغلاق التنبيه"
            className={`absolute left-3 top-3 p-1.5 rounded-full transition ${
              isDark
                ? 'text-stone-400 hover:text-white hover:bg-white/10'
                : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          {/* Logo & Header */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-16 h-16 rounded-2xl p-0.5 bg-[#0a0a0a] border-2 border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.35)] shrink-0 flex items-center justify-center overflow-hidden">
              <img
                src="/assets/aistudio/image_fdb94482.png"
                alt="شعار أثَر"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <h3 className={`font-black text-base sm:text-lg ${isDark ? 'text-[#f5e6b8]' : 'text-stone-950'}`}>
                تثبيت تطبيق أثَر على الهاتف
              </h3>
              <p className={`text-xs ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                احصل على تجربة سريعة وتصفح كامل بدون إنترنت أو إعلانات
              </p>
            </div>
          </div>

          {/* 3 Key Badges */}
          <div className="flex items-center justify-center gap-2 flex-wrap text-[11px] font-bold">
            <span className="px-2.5 py-1 rounded-xl bg-[#d4af37]/15 text-[#b45309] dark:text-[#facc15] border border-[#d4af37]/35 flex items-center gap-1 shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-[#ca8a04]" />
              <span>تثبيت فوري</span>
            </span>

            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/35 flex items-center gap-1 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>يعمل بدون إنترنت 100%</span>
            </span>

            <span className="px-2.5 py-1 rounded-xl bg-blue-500/15 text-blue-800 dark:text-blue-300 border border-blue-500/35 flex items-center gap-1 shadow-2xs">
              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
              <span>شاشة كاملة بدون إعلانات</span>
            </span>
          </div>

          {/* Full-width Instant Install CTA Button */}
          <button
            onClick={handleInstallClick}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#facc15] to-[#ca8a04] hover:from-[#fef08a] hover:to-[#d4af37] text-stone-950 font-black text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2.5"
          >
            <Download className="w-5 h-5 stroke-[2.5]" />
            <span>تثبيت تطبيق أثَر على الهاتف فوراً</span>
          </button>
        </div>
      </div>

      {/* iOS & Browser Instruction Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200" dir="rtl">
          <div className="w-full max-w-sm rounded-3xl bg-[#faf8f5] dark:bg-[#141414] border-2 border-[#d4af37]/40 p-6 shadow-2xl text-right space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white">طريقة تثبيت تطبيق أثَر</h4>
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

            <div className="space-y-3 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-2xs">
                <div className="w-7 h-7 rounded-full bg-[#d4af37]/20 text-[#d4af37] font-black flex items-center justify-center text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <div className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <span>اضغط على زر المشاركة</span>
                    <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    في متصفح <strong>Safari</strong> أسفل الشاشة، أو قائمة الثلاث نقاط <strong>(⋮)</strong> في متصفح <strong>Chrome</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-2xs">
                <div className="w-7 h-7 rounded-full bg-[#d4af37]/20 text-[#d4af37] font-black flex items-center justify-center text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <div className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <span>إضافة إلى الشاشة الرئيسية</span>
                    <PlusSquare className="w-3.5 h-3.5 text-[#d4af37]" />
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    مرر للأسفل في القائمة واختر <strong>«إضافة إلى الشاشة الرئيسية» (Add to Home Screen)</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-2xs">
                <div className="w-7 h-7 rounded-full bg-[#d4af37]/20 text-[#d4af37] font-black flex items-center justify-center text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <div className="font-bold text-stone-900 dark:text-white">
                    اضغط إضافة (Add)
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    سيظهر تطبيق <strong>أثَر</strong> بأيقونته الرسمية على شاشة هاتفك ويعمل بملء الشاشة وبدون إنترنت.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#aa7c11] hover:from-[#e5c96b] hover:to-[#d4af37] text-stone-950 font-black text-xs sm:text-sm transition shadow-md"
            >
              فهمت ذلك، تم
            </button>
          </div>
        </div>
      )}
    </>
  );
};
