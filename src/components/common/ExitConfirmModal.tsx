import React from 'react';
import { LogOut, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
}

export const ExitConfirmModal: React.FC<Props> = ({ isOpen, onClose, onConfirmExit }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 select-none"
      dir="rtl"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl bg-[#faf8f5] dark:bg-[#141414] text-stone-900 dark:text-stone-100 p-6 border border-[#d4af37]/40 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between pb-2 border-b border-stone-200/80 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-[#d4af37] flex items-center justify-center">
              <LogOut className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-stone-900 dark:text-[#f5e6b8]">
                مغادرة التطبيق
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-[#a39e93]">
                تطبيق أثَر · رفيق المسلم
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed text-center py-2">
          هل أنت متأكد من رغبتك في إغلاق أو الخروج من تطبيق أثَر؟
        </p>

        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-stone-950 font-bold text-xs shadow-md hover:from-[#f0cf8e] hover:to-[#d4af37] transition active:scale-95"
          >
            البقاء في التطبيق
          </button>

          <button
            onClick={onConfirmExit}
            className="py-2.5 px-4 rounded-2xl bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700 font-bold text-xs transition active:scale-95 border border-stone-300 dark:border-stone-700"
          >
            تأكيد الخروج
          </button>
        </div>
      </div>
    </div>
  );
};
