import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Props {
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * Standardized circular golden return arrow button matching image_1d94b71d.png
 */
export const ScreenBackButton: React.FC<Props> = ({
  onClick,
  className = '',
  ariaLabel = 'رجوع',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#f4f4f4] dark:bg-[#1a1a1a] border border-stone-200/90 dark:border-[#d4af37]/35 shadow-xs flex items-center justify-center text-[#ca8a04] dark:text-[#facc15] hover:bg-stone-200 dark:hover:bg-[#262626] active:scale-95 transition-all shrink-0 cursor-pointer ${className}`}
    >
      <ArrowRight className="w-5 h-5 text-[#ca8a04] dark:text-[#facc15] stroke-[2.5]" />
    </button>
  );
};
