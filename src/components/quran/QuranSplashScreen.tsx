import React, { useEffect, useState } from 'react';

interface Props {
  onContinue: () => void;
  isDark?: boolean;
}

export const QuranSplashScreen: React.FC<Props> = ({ onContinue }) => {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Auto-advance after 2.5 seconds if user doesn't tap earlier
    const timer = setTimeout(() => {
      handleDismiss();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    if (fadingOut) return;
    setFadingOut(true);
    setTimeout(() => {
      onContinue();
    }, 280);
  };

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#fbf8f0] cursor-pointer select-none transition-opacity duration-300 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative w-full h-full max-w-md max-h-screen flex items-center justify-center p-3">
        <img
          src="/assets/aistudio/image_0b0ff41b.png"
          alt="المصحف الشريف"
          className="w-full h-full max-h-[96vh] object-contain drop-shadow-md animate-in fade-in zoom-in-95 duration-500"
        />
      </div>
    </div>
  );
};
