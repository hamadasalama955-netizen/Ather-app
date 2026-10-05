import React from 'react';
import { Sparkles, LayoutGrid } from 'lucide-react';
import { NavigationTab } from '../../types';
import { useServicesList, ServiceGridActionProps } from './ServicesGridModal';

interface Props extends ServiceGridActionProps {
  onOpenAllServicesModal?: () => void;
}

export const QuickAccessGrid: React.FC<Props> = (props) => {
  const services = useServicesList(props);

  return (
    <div className="space-y-2.5">
      {/* Header title for the Quick Access Grid */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-4 rounded-full bg-gradient-to-b from-[#dfb76c] to-[#0d3b2e]" />
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
            <span>شبكة الخدمات الإسلامية</span>
            <span className="text-[10px] font-semibold text-[#0d3b2e] dark:text-[#dfb76c] bg-[#0d3b2e]/10 dark:bg-[#dfb76c]/15 px-2 py-0.5 rounded-full border border-[#0d3b2e]/20 dark:border-[#dfb76c]/30">
              ١٥ ميزة
            </span>
          </h3>
        </div>

        {props.onOpenAllServicesModal && (
          <button
            onClick={props.onOpenAllServicesModal}
            className="flex items-center gap-1 text-[11px] font-bold text-[#0d3b2e] dark:text-[#dfb76c] hover:underline"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>عرض موسع</span>
          </button>
        )}
      </div>

      {/* 4x4 Squircles Grid (4 items per row, 16 total) */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5" dir="rtl">
        {services.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className="group relative flex flex-col items-center justify-start p-2 rounded-2xl bg-[#fcfbf7] dark:bg-[#122e23] border border-stone-200/80 dark:border-stone-800 hover:border-[#dfb76c]/60 shadow-2xs hover:shadow-xs transition-all duration-150 active:scale-90 text-center"
          >
            {/* Optional Mini-Badge */}
            {item.badge && (
              <span className="absolute -top-1 -left-1 text-[8px] font-bold px-1 rounded-md bg-[#dfb76c] text-[#0b241c] shadow-xs">
                {item.badge}
              </span>
            )}

            {/* Squircle SVG Container */}
            <div
              className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-b ${item.bgGradient} border border-[#dfb76c]/20 flex items-center justify-center p-1.5 transition-transform group-hover:scale-105 shadow-2xs`}
            >
              {item.renderSvg()}
            </div>

            {/* Title */}
            <span className="text-[10px] sm:text-[11px] font-bold text-stone-800 dark:text-stone-100 group-hover:text-[#0d3b2e] dark:group-hover:text-[#dfb76c] leading-tight line-clamp-2 mt-1.5 px-0.5">
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
