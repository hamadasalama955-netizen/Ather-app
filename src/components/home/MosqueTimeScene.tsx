import React from 'react';

export type TimeOfDayPeriod = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'night';

interface Props {
  period: TimeOfDayPeriod;
  isDark?: boolean;
  className?: string;
}

export const MosqueTimeScene: React.FC<Props> = ({ period, isDark = false, className = '' }) => {
  // If in dark mode, or during night periods (maghrib, night, fajr), display the luxurious night scene
  const isNightScene = isDark || period === 'maghrib' || period === 'night' || period === 'fajr';

  if (isNightScene) {
    // 1. NIGHT SCENE (مطابق للوحة الهاتف في الوضع الليلي - صورة image_7280db7e.png)
    // سماء ليلية كحلية/سوداء متدرجة، نجوم تتلألأ، هلال ذهبي مضيء في الأعلى، ومسجد فخم بإضاءة نوافذ وقباب ذهبية صفراء
    return (
      <div className={`relative w-full h-44 sm:h-52 overflow-hidden select-none pointer-events-none rounded-2xl ${className}`}>
        <svg
          viewBox="0 0 380 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Night Sky Gradient */}
            <linearGradient id="royalNightSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#050811" />
              <stop offset="40%" stopColor="#0a1222" />
              <stop offset="75%" stopColor="#111c30" />
              <stop offset="100%" stopColor="#1a2538" />
            </linearGradient>

            {/* Radiant Crescent Glow */}
            <radialGradient id="crescentGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#fde047" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#d4af37" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Window Glow Filter */}
            <radialGradient id="windowGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fffbeb" stopOpacity="1" />
              <stop offset="50%" stopColor="#fef08a" stopOpacity="0.95" />
              <stop offset="90%" stopColor="#f59e0b" stopOpacity="0.8" />
            </radialGradient>

            {/* Central Portal Inner Warmth */}
            <linearGradient id="portalWarmth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Background Sky */}
          <rect width="380" height="200" fill="url(#royalNightSky)" />

          {/* Twinkling Stars */}
          <g opacity="0.85">
            <circle cx="35" cy="25" r="0.8" fill="#ffffff" />
            <circle cx="75" cy="40" r="1.1" fill="#fef08a" />
            <circle cx="110" cy="20" r="0.7" fill="#ffffff" />
            <circle cx="145" cy="45" r="0.9" fill="#ffffff" />
            <circle cx="170" cy="18" r="1.2" fill="#fef08a" />
            <circle cx="215" cy="35" r="0.8" fill="#ffffff" />
            <circle cx="260" cy="22" r="1.0" fill="#fef08a" />
            <circle cx="305" cy="42" r="0.7" fill="#ffffff" />
            <circle cx="345" cy="26" r="0.9" fill="#ffffff" />
            <circle cx="90" cy="65" r="0.6" fill="#ffffff" />
            <circle cx="280" cy="60" r="0.7" fill="#ffffff" />
            <circle cx="50" cy="80" r="0.8" fill="#ffffff" />
            <circle cx="330" cy="75" r="0.8" fill="#ffffff" />
          </g>

          {/* Golden Crescent Moon with Outer Halo (Centered at Top) */}
          <g>
            <circle cx="190" cy="46" r="32" fill="url(#crescentGlow)" />
            {/* Elegant Golden Crescent */}
            <path
              d="M 190 28 A 17 17 0 1 0 205 56 A 15 15 0 1 1 190 28 Z"
              fill="#fef08a"
              stroke="#fde047"
              strokeWidth="0.5"
            />
          </g>

          {/* Distant Mosque Silhouettes (Layer 1 - Background depth) */}
          <path
            d="M 60 160 L 60 120 Q 75 110 90 120 L 90 160 Z M 290 160 L 290 120 Q 305 110 320 120 L 320 160 Z"
            fill="#08101a"
            opacity="0.6"
          />

          {/* Main Mosque Silhouettes with Golden Window Illumination */}
          {/* Main Mosque Base Wall */}
          <rect x="70" y="125" width="240" height="75" fill="#121824" stroke="#d4af37" strokeWidth="0.5" strokeOpacity="0.3" />

          {/* Central Grand Dome */}
          <path
            d="M 145 125 C 145 80, 190 68, 190 68 C 190 68, 235 80, 235 125 Z"
            fill="#161f30"
            stroke="#d4af37"
            strokeWidth="1.2"
          />
          {/* Dome Ribs in Gold */}
          <path d="M 190 68 Q 165 95 165 125" stroke="#d4af37" strokeWidth="0.7" strokeOpacity="0.6" fill="none" />
          <path d="M 190 68 Q 215 95 215 125" stroke="#d4af37" strokeWidth="0.7" strokeOpacity="0.6" fill="none" />
          <line x1="190" y1="68" x2="190" y2="125" stroke="#d4af37" strokeWidth="0.7" strokeOpacity="0.6" />

          {/* Golden Finial & Crescent on Central Dome */}
          <line x1="190" y1="68" x2="190" y2="52" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="190" cy="58" r="2" fill="#d4af37" />
          <path d="M 190 52 A 3 3 0 1 0 192.5 48 A 2.5 2.5 0 1 1 190 52 Z" fill="#d4af37" />

          {/* Left Dome */}
          <path
            d="M 95 125 C 95 95, 125 86, 125 86 C 125 86, 155 95, 155 125 Z"
            fill="#141c2c"
            stroke="#d4af37"
            strokeWidth="0.8"
          />
          <line x1="125" y1="86" x2="125" y2="74" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="125" cy="78" r="1.5" fill="#d4af37" />

          {/* Right Dome */}
          <path
            d="M 225 125 C 225 95, 255 86, 255 86 C 255 86, 285 95, 285 125 Z"
            fill="#141c2c"
            stroke="#d4af37"
            strokeWidth="0.8"
          />
          <line x1="255" y1="86" x2="255" y2="74" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="255" cy="78" r="1.5" fill="#d4af37" />

          {/* Left Tall Minaret */}
          <g>
            <rect x="74" y="65" width="14" height="100" fill="#131b2a" stroke="#d4af37" strokeWidth="0.6" strokeOpacity="0.4" />
            <rect x="71" y="62" width="20" height="4" rx="1" fill="#d4af37" />
            {/* Minaret Balcony Opening with Light */}
            <path d="M 78 72 L 78 68 Q 81 65 84 68 L 84 72 Z" fill="url(#windowGlow)" />
            {/* Upper Conical Spire */}
            <path d="M 73 62 Q 81 48 89 62 Z" fill="#1a2538" stroke="#d4af37" strokeWidth="0.8" />
            <line x1="81" y1="48" x2="81" y2="40" stroke="#d4af37" strokeWidth="1.2" />
            <circle cx="81" cy="40" r="1.5" fill="#d4af37" />
          </g>

          {/* Right Tall Minaret */}
          <g>
            <rect x="292" y="65" width="14" height="100" fill="#131b2a" stroke="#d4af37" strokeWidth="0.6" strokeOpacity="0.4" />
            <rect x="289" y="62" width="20" height="4" rx="1" fill="#d4af37" />
            {/* Minaret Balcony Opening with Light */}
            <path d="M 296 72 L 296 68 Q 299 65 302 68 L 302 72 Z" fill="url(#windowGlow)" />
            {/* Upper Conical Spire */}
            <path d="M 291 62 Q 299 48 307 62 Z" fill="#1a2538" stroke="#d4af37" strokeWidth="0.8" />
            <line x1="299" y1="48" x2="299" y2="40" stroke="#d4af37" strokeWidth="1.2" />
            <circle cx="299" cy="40" r="1.5" fill="#d4af37" />
          </g>

          {/* Outer Far Left Small Minaret */}
          <rect x="42" y="92" width="10" height="70" fill="#0f1622" />
          <path d="M 41 92 Q 47 80 53 92 Z" fill="#161f30" stroke="#d4af37" strokeWidth="0.5" />

          {/* Outer Far Right Small Minaret */}
          <rect x="328" y="92" width="10" height="70" fill="#0f1622" />
          <path d="M 327 92 Q 333 80 339 92 Z" fill="#161f30" stroke="#d4af37" strokeWidth="0.5" />

          {/* Glowing Mosque Windows on Facade (الشبابيك المضيئة الفخمة كما بالصورة) */}
          {/* Row of Arched Windows Left Wing */}
          <g>
            {[90, 106, 122].map((x) => (
              <g key={`w_left_${x}`}>
                <path
                  d={`M ${x} 145 L ${x} 134 Q ${x + 4} 130 ${x + 8} 134 L ${x + 8} 145 Z`}
                  fill="url(#windowGlow)"
                  filter="drop-shadow(0px 0px 4px #f59e0b)"
                />
                {/* Window Arch Frame */}
                <path
                  d={`M ${x} 145 L ${x} 134 Q ${x + 4} 130 ${x + 8} 134 L ${x + 8} 145 Z`}
                  stroke="#d4af37"
                  strokeWidth="0.8"
                  fill="none"
                />
              </g>
            ))}
          </g>

          {/* Grand Illuminated Center Portal (المحراب والبوابة الوسطى المضيئة بنور ذهبي دافئ) */}
          <g>
            {/* Grand Arch Frame */}
            <path
              d="M 168 185 L 168 140 Q 190 120 212 140 L 212 185 Z"
              fill="#182132"
              stroke="#d4af37"
              strokeWidth="2"
            />
            {/* Inner Golden Radiant Vault */}
            <path
              d="M 174 185 L 174 145 Q 190 128 206 145 L 206 185 Z"
              fill="url(#portalWarmth)"
              filter="drop-shadow(0px 0px 8px #f59e0b)"
            />
            {/* Traditional Arch Motif inside */}
            <path
              d="M 180 185 L 180 152 Q 190 140 200 152 L 200 185 Z"
              fill="#fffbeb"
              opacity="0.9"
            />
          </g>

          {/* Row of Arched Windows Right Wing */}
          <g>
            {[250, 266, 282].map((x) => (
              <g key={`w_right_${x}`}>
                <path
                  d={`M ${x} 145 L ${x} 134 Q ${x + 4} 130 ${x + 8} 134 L ${x + 8} 145 Z`}
                  fill="url(#windowGlow)"
                  filter="drop-shadow(0px 0px 4px #f59e0b)"
                />
                <path
                  d={`M ${x} 145 L ${x} 134 Q ${x + 4} 130 ${x + 8} 134 L ${x + 8} 145 Z`}
                  stroke="#d4af37"
                  strokeWidth="0.8"
                  fill="none"
                />
              </g>
            ))}
          </g>

          {/* Ground Silhouette & Courtyard Base */}
          <rect x="0" y="180" width="380" height="20" fill="#080c14" />
          <line x1="0" y1="180" x2="380" y2="180" stroke="#d4af37" strokeWidth="0.8" strokeOpacity="0.4" />
        </svg>
      </div>
    );
  }

  // 2. DAYLIGHT SCENE (مطابق للوحة الهاتف في الوضع النهاري - صورة image_7280db7e.png)
  // سماء ذهبية نهارية دافئة، شمس وضاءة، غيوم لطيفة، ومسجد أبيض عريق بقباب زرقاء ملكية ومآذن رشيقة
  return (
    <div className={`relative w-full h-44 sm:h-52 overflow-hidden select-none pointer-events-none rounded-2xl ${className}`}>
      <svg
        viewBox="0 0 380 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Daytime Warm Sky Gradient */}
          <linearGradient id="daySkyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="40%" stopColor="#fde68a" />
            <stop offset="75%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#fed7aa" />
          </linearGradient>

          {/* Radiant Sun Glow */}
          <radialGradient id="daySunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#fef08a" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#fde047" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>

          {/* Blue Dome Gradient */}
          <linearGradient id="blueDomeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4a8bc2" />
            <stop offset="45%" stopColor="#255d8f" />
            <stop offset="100%" stopColor="#183b5e" />
          </linearGradient>
        </defs>

        {/* Sky Canvas */}
        <rect width="380" height="200" fill="url(#daySkyGrad)" />

        {/* Soft Fluffy Clouds in Sky */}
        <g fill="#ffffff" opacity="0.6">
          <ellipse cx="65" cy="55" rx="35" ry="12" />
          <ellipse cx="85" cy="48" rx="25" ry="14" />
          <ellipse cx="310" cy="50" rx="40" ry="13" />
          <ellipse cx="330" cy="42" rx="25" ry="15" />
        </g>

        {/* Radiant Warm Sun Behind Dome */}
        <g>
          <circle cx="190" cy="90" r="50" fill="url(#daySunGlow)" />
          <circle cx="190" cy="90" r="28" fill="#ffffff" opacity="0.8" />
        </g>

        {/* Distant Hills / Mountains */}
        <path d="M 0 160 Q 90 135 180 155 Q 270 140 380 160 L 380 200 L 0 200 Z" fill="#e2c88f" opacity="0.5" />

        {/* Mosque Architecture (White Facades with Royal Blue Domes) */}
        {/* Main Base Wall */}
        <rect x="75" y="125" width="230" height="65" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />

        {/* Central Grand Blue Dome */}
        <path
          d="M 150 125 C 150 82, 190 70, 190 70 C 190 70, 230 82, 230 125 Z"
          fill="url(#blueDomeGrad)"
          stroke="#1d4ed8"
          strokeWidth="1"
        />
        {/* Golden Crescent on Central Dome */}
        <line x1="190" y1="70" x2="190" y2="56" stroke="#d4af37" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="190" cy="62" r="1.8" fill="#d4af37" />
        <path d="M 190 56 A 2.5 2.5 0 1 0 192.2 52 A 2 2 0 1 1 190 56 Z" fill="#d4af37" />

        {/* Left Blue Dome */}
        <path
          d="M 100 125 C 100 98, 125 90, 125 90 C 125 90, 150 98, 150 125 Z"
          fill="url(#blueDomeGrad)"
          stroke="#1d4ed8"
          strokeWidth="0.8"
        />
        <line x1="125" y1="90" x2="125" y2="80" stroke="#d4af37" strokeWidth="1.2" />
        <circle cx="125" cy="80" r="1.4" fill="#d4af37" />

        {/* Right Blue Dome */}
        <path
          d="M 230 125 C 230 98, 255 90, 255 90 C 255 90, 280 98, 280 125 Z"
          fill="url(#blueDomeGrad)"
          stroke="#1d4ed8"
          strokeWidth="0.8"
        />
        <line x1="255" y1="90" x2="255" y2="80" stroke="#d4af37" strokeWidth="1.2" />
        <circle cx="255" cy="80" r="1.4" fill="#d4af37" />

        {/* Left Minaret */}
        <g>
          <rect x="76" y="68" width="13" height="100" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.6" />
          <rect x="74" y="66" width="17" height="3" fill="#2563eb" />
          <path d="M 75 66 Q 82.5 54 90 66 Z" fill="url(#blueDomeGrad)" />
          <line x1="82.5" y1="54" x2="82.5" y2="47" stroke="#d4af37" strokeWidth="1.2" />
          <circle cx="82.5" cy="47" r="1.5" fill="#d4af37" />
        </g>

        {/* Right Minaret */}
        <g>
          <rect x="291" y="68" width="13" height="100" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.6" />
          <rect x="289" y="66" width="17" height="3" fill="#2563eb" />
          <path d="M 290 66 Q 297.5 54 305 66 Z" fill="url(#blueDomeGrad)" />
          <line x1="297.5" y1="54" x2="297.5" y2="47" stroke="#d4af37" strokeWidth="1.2" />
          <circle cx="297.5" cy="47" r="1.5" fill="#d4af37" />
        </g>

        {/* Outer Far Minarets */}
        <rect x="46" y="95" width="9" height="70" fill="#f1f5f9" />
        <path d="M 45 95 Q 50.5 84 56 95 Z" fill="url(#blueDomeGrad)" />
        <rect x="325" y="95" width="9" height="70" fill="#f1f5f9" />
        <path d="M 324 95 Q 329.5 84 335 95 Z" fill="url(#blueDomeGrad)" />

        {/* Arched Windows with Blue Borders */}
        {[92, 108, 124, 252, 268, 284].map((x) => (
          <g key={`day_win_${x}`}>
            <path
              d={`M ${x} 146 L ${x} 136 Q ${x + 3.5} 133 ${x + 7} 136 L ${x + 7} 146 Z`}
              fill="#1e293b"
            />
            <path
              d={`M ${x} 146 L ${x} 136 Q ${x + 3.5} 133 ${x + 7} 136 L ${x + 7} 146 Z`}
              stroke="#2563eb"
              strokeWidth="0.8"
              fill="none"
            />
          </g>
        ))}

        {/* Grand Arched Center Entrance */}
        <g>
          <path
            d="M 172 185 L 172 144 Q 190 126 208 144 L 208 185 Z"
            fill="#1e293b"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          <path
            d="M 177 185 L 177 148 Q 190 134 203 148 L 203 185 Z"
            fill="#0f172a"
          />
        </g>

        {/* Courtyard Floor */}
        <rect x="0" y="180" width="380" height="20" fill="#cbd5e1" />
        <rect x="0" y="185" width="380" height="15" fill="#94a3b8" />
      </svg>
    </div>
  );
};
