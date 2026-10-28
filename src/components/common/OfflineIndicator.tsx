import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-emerald-800/95 border border-[#dfb76c]/40 text-[#f5ebd2] px-4 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-md">
      <WifiOff className="w-3.5 h-3.5 shrink-0 text-[#dfb76c]" />
      <span>وضع عدم الاتصال: التطبيق يعمل بكامل مميزاته محلياً 100%</span>
    </div>
  );
};
