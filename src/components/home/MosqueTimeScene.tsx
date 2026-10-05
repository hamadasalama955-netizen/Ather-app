import React from 'react';

export type TimeOfDayPeriod = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'night';

interface Props {
  period: TimeOfDayPeriod;
  className?: string;
}

export const MosqueTimeScene: React.FC<Props> = ({ period, className = '' }) => {
  // 6 Dynamic Atmospheric Color Palettes (Daylight Asr matches the user's reference image!)
  const config = {
    // 1. وقت الفجر: سماء الفجر الهادئة وزرقة الفجر الصافي مع هلال وفوانيس مضيئة
    fajr: {
      skyGradient: {
        id: 'fajrSky',
        x1: '0',
        y1: '0',
        x2: '1',
        y2: '1',
        stops: [
          { offset: '0%', color: '#0b1d3a' },
          { offset: '40%', color: '#142c52' },
          { offset: '75%', color: '#1e4878' },
          { offset: '100%', color: '#68b4e0' },
        ],
      },
      starsOpacity: 0.7,
      celestial: {
        type: 'crescent' as const,
        cx: 310,
        cy: 42,
        color: '#f0f9ff',
        glow: '#7dd3fc',
      },
      sunGlow: false,
      birdsOpacity: 0.3,
      domeFill: '#132847',
      domeBorder: '#38bdf8',
      facadeFill: '#e2e8f0',
      facadeShadow: '#cbd5e1',
      blueTile: '#1d4ed8',
      goldArch: '#f59e0b',
      doorColor: '#78350f',
      windowGlass: '#fef08a',
      windowGlowOpacity: 0.8,
      treeColor: '#1e3a29',
      treeColorDark: '#14281c',
      courtyardFill: '#475569',
      basePlinth: '#1e293b',
    },

    // 2. وقت الشروق: ألوان الإشراق الوردية والذهبية الدافئة
    sunrise: {
      skyGradient: {
        id: 'sunriseSky',
        x1: '0',
        y1: '0',
        x2: '1',
        y2: '1',
        stops: [
          { offset: '0%', color: '#31103f' },
          { offset: '35%', color: '#7c1c4d' },
          { offset: '70%', color: '#c2410c' },
          { offset: '100%', color: '#fde047' },
        ],
      },
      starsOpacity: 0,
      celestial: {
        type: 'sun' as const,
        cx: 315,
        cy: 50,
        color: '#fef08a',
        glow: '#f97316',
      },
      sunGlow: true,
      birdsOpacity: 0.85,
      domeFill: '#241b35',
      domeBorder: '#fb923c',
      facadeFill: '#fef2f2',
      facadeShadow: '#fecaca',
      blueTile: '#1e3a8a',
      goldArch: '#f59e0b',
      doorColor: '#991b1b',
      windowGlass: '#fef08a',
      windowGlowOpacity: 0.5,
      treeColor: '#2b5138',
      treeColorDark: '#1c3625',
      courtyardFill: '#78350f',
      basePlinth: '#451a03',
    },

    // 3. وقت الظهر: سماء نهارية زرقاء صافية ناصعة وشمس ناصعة
    dhuhr: {
      skyGradient: {
        id: 'dhuhrSky',
        x1: '0',
        y1: '0',
        x2: '1',
        y2: '1',
        stops: [
          { offset: '0%', color: '#7dd3fc' },
          { offset: '50%', color: '#bae6fd' },
          { offset: '85%', color: '#e0f2fe' },
          { offset: '100%', color: '#f0f9ff' },
        ],
      },
      starsOpacity: 0,
      celestial: {
        type: 'bright-sun' as const,
        cx: 312,
        cy: 40,
        color: '#ffffff',
        glow: '#fef08a',
      },
      sunGlow: true,
      birdsOpacity: 0.95,
      domeFill: '#1b2d4f',
      domeBorder: '#60a5fa',
      facadeFill: '#ffffff',
      facadeShadow: '#e2e8f0',
      blueTile: '#255896',
      goldArch: '#f2d294',
      doorColor: '#b46654',
      windowGlass: '#0f172a',
      windowGlowOpacity: 0.25,
      treeColor: '#4d8c58',
      treeColorDark: '#35633e',
      courtyardFill: '#97816f',
      basePlinth: '#524338',
    },

    // 4. وقت العصر: (مطابق تماماً للصورة المرفقة - ألوان فاتحة دافئة وجميلة)
    asr: {
      skyGradient: {
        id: 'asrSky',
        x1: '0',
        y1: '0',
        x2: '1',
        y2: '1',
        stops: [
          { offset: '0%', color: '#bce4f7' },   // Soft pale sky blue (Left)
          { offset: '45%', color: '#d8edf8' },  // Gentle azure
          { offset: '75%', color: '#fcead2' },  // Warm soft golden peach
          { offset: '100%', color: '#fae1be' }, // Golden sunlight horizon (Right)
        ],
      },
      starsOpacity: 0,
      celestial: {
        type: 'sun' as const,
        cx: 312,
        cy: 40,                                // Positioned in open sky near dome
        color: '#fffbeb',
        glow: '#fde68a',
      },
      sunGlow: true,
      birdsOpacity: 0.95,
      domeFill: '#1b2d4f',                     // Deep navy blue dome as in image
      domeBorder: '#3b82f6',
      facadeFill: '#ffffff',                   // Crisp white mosque walls
      facadeShadow: '#e6edf5',
      blueTile: '#255896',                     // Iconic cobalt/royal blue mosaic borders
      goldArch: '#f2d294',                     // Sandstone/golden inner vaulted arches
      doorColor: '#b46654',                    // Terracotta arched doorway
      windowGlass: '#142037',                  // Dark navy arched window frames
      windowGlowOpacity: 0.25,
      treeColor: '#4d8c58',                    // Lush green trees behind walls
      treeColorDark: '#33613c',
      courtyardFill: '#97816f',                // Sandy courtyard floor
      basePlinth: '#524338',                   // Ground base plinth
    },

    // 5. وقت المغرب: شفق الغروب البنفسجي والأحمر الناري مع هلال رقيق
    maghrib: {
      skyGradient: {
        id: 'maghribSky',
        x1: '0',
        y1: '0',
        x2: '1',
        y2: '1',
        stops: [
          { offset: '0%', color: '#1e1035' },
          { offset: '30%', color: '#581c87' },
          { offset: '60%', color: '#9f1239' },
          { offset: '85%', color: '#c2410c' },
          { offset: '100%', color: '#f59e0b' },
        ],
      },
      starsOpacity: 0.4,
      celestial: {
        type: 'crescent' as const,
        cx: 310,
        cy: 42,
        color: '#fef3c7',
        glow: '#f97316',
      },
      sunGlow: false,
      birdsOpacity: 0.6,
      domeFill: '#1f1532',
      domeBorder: '#fb923c',
      facadeFill: '#fdf2f8',
      facadeShadow: '#fbcfe8',
      blueTile: '#1e3a8a',
      goldArch: '#f59e0b',
      doorColor: '#7f1d1d',
      windowGlass: '#fde047',
      windowGlowOpacity: 0.85,
      treeColor: '#233d2c',
      treeColorDark: '#16281d',
      courtyardFill: '#5b21b6',
      basePlinth: '#2e1065',
    },

    // 6. وقت العشاء والليل: سماء ليلية كحلية ساحرة مرصعة بالنجوم مع هلال لامع ونوافذ مضاءة
    night: {
      skyGradient: {
        id: 'nightSky',
        x1: '0',
        y1: '0',
        x2: '1',
        y2: '1',
        stops: [
          { offset: '0%', color: '#030c17' },
          { offset: '45%', color: '#07182c' },
          { offset: '80%', color: '#0e2b48' },
          { offset: '100%', color: '#163b5c' },
        ],
      },
      starsOpacity: 0.95,
      celestial: {
        type: 'crescent' as const,
        cx: 310,
        cy: 38,
        color: '#fef9c3',
        glow: '#fde047',
      },
      sunGlow: false,
      birdsOpacity: 0.15,
      domeFill: '#0d1f36',
      domeBorder: '#dfb76c',
      facadeFill: '#e2e8f0',
      facadeShadow: '#94a3b8',
      blueTile: '#1e3a8a',
      goldArch: '#f59e0b',
      doorColor: '#451a03',
      windowGlass: '#fde047',
      windowGlowOpacity: 0.95,
      treeColor: '#12251a',
      treeColorDark: '#0b1710',
      courtyardFill: '#334155',
      basePlinth: '#0f172a',
    },
  }[period];

  return (
    <div className={`relative w-full h-full overflow-hidden select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 380 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYEnd meet"
      >
        <defs>
          {/* Dynamic Sky Gradient */}
          <linearGradient
            id={config.skyGradient.id}
            x1={config.skyGradient.x1}
            y1={config.skyGradient.y1}
            x2={config.skyGradient.x2}
            y2={config.skyGradient.y2}
          >
            {config.skyGradient.stops.map((stop, i) => (
              <stop key={i} offset={stop.offset} stopColor={stop.color} />
            ))}
          </linearGradient>

          {/* Sun Glow Filter */}
          <radialGradient id={`sunHalo_${period}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#fef08a" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#fde68a" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>

          {/* Dome Lighting Gradient */}
          <linearGradient id={`domeGrad_${period}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2c4772" />
            <stop offset="60%" stopColor={config.domeFill} />
            <stop offset="100%" stopColor="#101c30" />
          </linearGradient>
        </defs>

        {/* 1. Sky Canvas */}
        <rect width="380" height="160" fill={`url(#${config.skyGradient.id})`} />

        {/* 2. Stars (Fajr, Maghrib, Night) */}
        {config.starsOpacity > 0 && (
          <g opacity={config.starsOpacity}>
            <circle cx="28" cy="18" r="0.8" fill="#ffffff" />
            <circle cx="56" cy="24" r="1.1" fill="#fef08a" />
            <circle cx="92" cy="14" r="0.7" fill="#ffffff" />
            <circle cx="128" cy="22" r="0.9" fill="#ffffff" />
            <circle cx="164" cy="16" r="0.8" fill="#ffffff" />
            <circle cx="210" cy="25" r="1.0" fill="#fef08a" />
            <circle cx="250" cy="15" r="0.7" fill="#ffffff" />
            <circle cx="280" cy="28" r="0.9" fill="#ffffff" />
            <circle cx="340" cy="18" r="0.8" fill="#ffffff" />
            <circle cx="75" cy="35" r="0.6" fill="#ffffff" />
            <circle cx="145" cy="32" r="0.7" fill="#ffffff" />
          </g>
        )}

        {/* 3. Celestial Body: Sun or Crescent Moon */}
        {config.celestial.type === 'crescent' ? (
          <g>
            {/* Crescent Outer Glow */}
            <circle cx={config.celestial.cx} cy={config.celestial.cy} r="16" fill={config.celestial.glow} opacity="0.3" />
            {/* Elegant Crescent Moon */}
            <path
              d={`M ${config.celestial.cx} ${config.celestial.cy - 11}
                  A 11 11 0 1 0 ${config.celestial.cx + 9} ${config.celestial.cy + 7}
                  A 9.5 9.5 0 1 1 ${config.celestial.cx} ${config.celestial.cy - 11} Z`}
              fill={config.celestial.color}
            />
            {/* Luminous Star Companion */}
            <circle cx={config.celestial.cx + 13} cy={config.celestial.cy - 6} r="1.4" fill={config.celestial.color} />
          </g>
        ) : (
          <g>
            {/* Radiant Sun with Soft Atmospheric Halo as in image */}
            <circle cx={config.celestial.cx} cy={config.celestial.cy} r="32" fill={`url(#sunHalo_${period})`} />
            <circle cx={config.celestial.cx} cy={config.celestial.cy} r="16" fill="#ffffff" opacity="0.85" />
            <circle cx={config.celestial.cx} cy={config.celestial.cy} r="11" fill={config.celestial.color} />
          </g>
        )}

        {/* 4. Flock of Swallows / Birds soaring in flight (As in the reference image!) */}
        <g opacity={config.birdsOpacity}>
          {/* High Sky Swallows */}
          <path d="M 148 48 Q 151 45 154 47 Q 157 45 160 48 Q 154 46 148 48 Z" fill="#1e293b" />
          <path d="M 164 42 Q 167 39 170 41 Q 173 39 176 42 Q 170 40 164 42 Z" fill="#1e293b" />
          <path d="M 180 46 Q 183 43 186 45 Q 189 43 192 46 Q 186 44 180 46 Z" fill="#1e293b" />
          <path d="M 196 52 Q 199 49 202 51 Q 205 49 208 52 Q 202 50 196 52 Z" fill="#1e293b" />

          {/* Mid Sky Swallows */}
          <path d="M 162 90 Q 165 87 168 89 Q 171 87 174 90 Q 168 88 162 90 Z" fill="#1e293b" />
          <path d="M 172 82 Q 175 79 178 81 Q 181 79 184 82 Q 178 80 172 82 Z" fill="#1e293b" />
          <path d="M 186 86 Q 188 84 191 85 Q 193 84 196 86 Q 191 85 186 86 Z" fill="#1e293b" />
          <path d="M 176 96 Q 178 94 181 95 Q 183 94 186 96 Q 181 95 176 96 Z" fill="#1e293b" />
          <path d="M 194 92 Q 196 90 198 91 Q 200 90 203 92 Q 198 91 194 92 Z" fill="#1e293b" />
          <path d="M 183 76 Q 185 74 187 75 Q 189 74 191 76 Q 187 75 183 76 Z" fill="#1e293b" />
        </g>

        {/* 5. Lush Green Foliage / Trees behind Mosque Walls (Left & Right) */}
        {/* Left Treetops */}
        <ellipse cx="28" cy="115" rx="22" ry="18" fill={config.treeColor} />
        <ellipse cx="44" cy="110" rx="16" ry="15" fill={config.treeColorDark} />
        <ellipse cx="14" cy="120" rx="15" ry="14" fill={config.treeColorDark} />
        {/* Center Foliage behind Gallery */}
        <ellipse cx="178" cy="112" rx="26" ry="16" fill={config.treeColor} />
        <ellipse cx="202" cy="115" rx="18" ry="14" fill={config.treeColorDark} />
        {/* Right Foliage behind Dome & Minaret */}
        <ellipse cx="340" cy="122" rx="24" ry="16" fill={config.treeColor} />
        <ellipse cx="360" cy="118" rx="20" ry="15" fill={config.treeColorDark} />
        <ellipse cx="320" cy="126" rx="16" ry="12" fill={config.treeColorDark} />

        {/* 6. Ground Base Plinth & Paved Courtyard (As in image) */}
        <rect x="0" y="138" width="380" height="22" fill={config.courtyardFill} />
        <rect x="0" y="146" width="380" height="14" fill={config.basePlinth} />

        {/* ======================================================== */}
        {/* 7. MOSQUE ARCHITECTURE: PRECISELY MATCHING THE USER IMAGE */}
        {/* ======================================================== */}

        {/* --- A. LEFT TALL MINARET --- */}
        <g>
          {/* Main White Shaft */}
          <rect x="49" y="72" width="13" height="66" fill={config.facadeFill} />
          {/* Decorative Blue Ring Band */}
          <rect x="49" y="80" width="13" height="2.5" fill={config.blueTile} />
          <rect x="49" y="96" width="13" height="2" fill={config.blueTile} />
          {/* Minaret Balcony with brackets */}
          <rect x="46" y="70" width="19" height="3" rx="0.5" fill={config.facadeShadow} />
          <rect x="47" y="67" width="17" height="3" fill={config.blueTile} />
          {/* Upper Lantern Chamber */}
          <rect x="50" y="58" width="11" height="9" fill={config.facadeFill} />
          {/* Arched Lantern Opening */}
          <path d="M 53 66 L 53 61 Q 55.5 59 58 61 L 58 66 Z" fill={config.windowGlass} opacity={config.windowGlowOpacity} />
          {/* Dark Navy Conical/Dome Roof */}
          <path d="M 48 58 Q 55.5 50 63 58 Z" fill={config.domeFill} />
          {/* Golden Finial & Crescent */}
          <line x1="55.5" y1="52" x2="55.5" y2="47" stroke="#dfb76c" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="55.5" cy="46" r="1.5" fill="#dfb76c" />
        </g>

        {/* --- B. LEFT COLONNADE WING (Low white building on the far left) --- */}
        <g>
          {/* Building Wall */}
          <rect x="30" y="112" width="46" height="26" fill={config.facadeFill} stroke={config.facadeShadow} strokeWidth="0.5" />
          {/* Blue Decorative Roof Cornice */}
          <rect x="29" y="110" width="48" height="2.5" fill={config.blueTile} />
          <rect x="29" y="108" width="48" height="2" fill={config.facadeShadow} />
          {/* Arched Windows (with blue frame and dark glass) */}
          <g>
            {/* Window 1 */}
            <rect x="37" y="117" width="9" height="15" fill={config.blueTile} rx="1" />
            <path d="M 39 130 L 39 122 Q 41.5 119 44 122 L 44 130 Z" fill={config.windowGlass} opacity={config.windowGlowOpacity} />
            {/* Window 2 */}
            <rect x="58" y="117" width="9" height="15" fill={config.blueTile} rx="1" />
            <path d="M 60 130 L 60 122 Q 62.5 119 65 122 L 65 130 Z" fill={config.windowGlass} opacity={config.windowGlowOpacity} />
          </g>
        </g>

        {/* --- C. GRAND MONUMENTAL IWAN / PORTAL (LEFT-CENTER - Standout Feature!) --- */}
        <g>
          {/* Main Tall Rectangular Pylon */}
          <rect x="76" y="80" width="60" height="58" fill={config.facadeFill} />
          {/* Upper Decorative Parapet Frieze */}
          <rect x="74" y="78" width="64" height="3" fill={config.blueTile} />
          <rect x="75" y="75" width="62" height="3" fill={config.facadeShadow} />
          {/* Ornate Cobalt Blue Mosaic Frame Band */}
          <rect x="80" y="84" width="52" height="54" fill="none" stroke={config.blueTile} strokeWidth="4" />
          {/* Inner Decorative Accent Line */}
          <rect x="83" y="87" width="46" height="51" fill="none" stroke={config.facadeShadow} strokeWidth="1" />

          {/* Grand Pointed Horseshoe Arch (with Golden Sandstone Vault) */}
          <path
            d="M 86 138 L 86 108 Q 86 92 106 92 Q 126 92 126 108 L 126 138 Z"
            fill={config.goldArch}
          />
          {/* Inner Vault Depth Shadow */}
          <path
            d="M 90 138 L 90 110 Q 90 97 106 97 Q 122 97 122 110 L 122 138 Z"
            fill="#e2ba6d"
            opacity="0.6"
          />

          {/* Terracotta/Wood Traditional Doorway */}
          <path
            d="M 98 138 L 98 118 Q 106 114 114 118 L 114 138 Z"
            fill={config.doorColor}
          />
          {/* Door Framing & Transom */}
          <rect x="97" y="117" width="18" height="1.5" fill={config.blueTile} />
          <line x1="106" y1="118" x2="106" y2="138" stroke="#522b22" strokeWidth="0.8" />
        </g>

        {/* --- D. CENTRAL CONNECTING GALLERY WING --- */}
        <g>
          {/* White Facade Wall */}
          <rect x="136" y="104" width="88" height="34" fill={config.facadeFill} />
          {/* Roof Parapet with Blue Decorative Inset */}
          <rect x="136" y="102" width="88" height="3" fill={config.blueTile} />
          <rect x="136" y="100" width="88" height="2" fill={config.facadeShadow} />
          {/* Lower Base Molding */}
          <rect x="136" y="136" width="88" height="2.5" fill="#524338" />

          {/* Row of 3 Elegant Arched Windows with Blue Surrounds */}
          {/* Window 1 */}
          <rect x="146" y="110" width="11" height="20" fill={config.blueTile} rx="1" />
          <path d="M 148 128 L 148 116 Q 151.5 113 155 116 L 155 128 Z" fill={config.windowGlass} opacity={config.windowGlowOpacity} />
          {/* Window 2 */}
          <rect x="174" y="110" width="11" height="20" fill={config.blueTile} rx="1" />
          <path d="M 176 128 L 176 116 Q 179.5 113 183 116 L 183 128 Z" fill={config.windowGlass} opacity={config.windowGlowOpacity} />
          {/* Window 3 */}
          <rect x="202" y="110" width="11" height="20" fill={config.blueTile} rx="1" />
          <path d="M 204 128 L 204 116 Q 207.5 113 211 116 L 211 128 Z" fill={config.windowGlass} opacity={config.windowGlowOpacity} />
        </g>

        {/* --- E. RIGHT-CENTER WING: GRAND NAVY DOME & SECONDARY IWAN --- */}
        {/* Massive Navy Dome (Positioned behind gallery as in image) */}
        <g>
          {/* Dome Drum */}
          <rect x="238" y="84" width="60" height="22" fill={config.facadeShadow} />
          {/* Row of Clerestory Windows on Drum */}
          <circle cx="246" cy="94" r="2.5" fill={config.windowGlass} opacity={config.windowGlowOpacity} />
          <circle cx="258" cy="94" r="2.5" fill={config.windowGlass} opacity={config.windowGlowOpacity} />
          <circle cx="270" cy="94" r="2.5" fill={config.windowGlass} opacity={config.windowGlowOpacity} />
          <circle cx="282" cy="94" r="2.5" fill={config.windowGlass} opacity={config.windowGlowOpacity} />

          {/* Grand Ribbed Navy Blue Dome */}
          <path
            d="M 234 86 C 234 50, 268 44, 268 44 C 268 44, 302 50, 302 86 Z"
            fill={`url(#domeGrad_${period})`}
            stroke={config.domeBorder}
            strokeWidth="1"
          />
          {/* Golden Finial & Crescent on Dome */}
          <line x1="268" y1="44" x2="268" y2="34" stroke="#dfb76c" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="268" cy="38" r="2" fill="#dfb76c" />
          <path
            d="M 268 33 A 3 3 0 1 0 270.5 29 A 2.5 2.5 0 1 1 268 33 Z"
            fill="#dfb76c"
          />
        </g>

        {/* Secondary Portal / Pavilion (In front of Dome on Left of Dome) */}
        <g>
          <rect x="206" y="92" width="46" height="46" fill={config.facadeFill} />
          <rect x="204" y="90" width="50" height="3" fill={config.blueTile} />
          {/* Mosaic Frame */}
          <rect x="210" y="95" width="38" height="43" fill="none" stroke={config.blueTile} strokeWidth="3" />
          {/* Golden Arch */}
          <path
            d="M 215 138 L 215 114 Q 215 102 229 102 Q 243 102 243 114 L 243 138 Z"
            fill={config.goldArch}
          />
          {/* Inner Niche */}
          <path
            d="M 218 138 L 218 116 Q 229 107 240 116 L 240 138 Z"
            fill="#e2ba6d"
            opacity="0.5"
          />
        </g>

        {/* Arcaded Colonnade Gallery (Below the Dome as in image) */}
        <g>
          <rect x="246" y="112" width="80" height="26" fill={config.facadeFill} />
          <rect x="246" y="110" width="80" height="2.5" fill={config.blueTile} />
          <rect x="246" y="108" width="80" height="2" fill={config.facadeShadow} />

          {/* Row of 8 Arched Blue Windows (0 0 0 0 0 0 0 0 as seen in the image!) */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
            const x = 252 + idx * 9;
            return (
              <g key={idx}>
                <rect x={x} y="116" width="6.5" height="16" fill={config.blueTile} rx="0.8" />
                <path
                  d={`M ${x + 1} 130 L ${x + 1} 121 Q ${x + 3.25} 118 ${x + 5.5} 121 L ${x + 5.5} 130 Z`}
                  fill={config.windowGlass}
                  opacity={config.windowGlowOpacity}
                />
              </g>
            );
          })}
        </g>

        {/* --- F. RIGHT TALL MINARET --- */}
        <g>
          {/* Minaret Shaft */}
          <rect x="326" y="68" width="13" height="70" fill={config.facadeFill} />
          <rect x="326" y="78" width="13" height="2.5" fill={config.blueTile} />
          <rect x="326" y="94" width="13" height="2" fill={config.blueTile} />
          {/* Balcony */}
          <rect x="323" y="66" width="19" height="3" rx="0.5" fill={config.facadeShadow} />
          <rect x="324" y="63" width="17" height="3" fill={config.blueTile} />
          {/* Lantern Chamber */}
          <rect x="327" y="54" width="11" height="9" fill={config.facadeFill} />
          <path d="M 330 62 L 330 57 Q 332.5 55 335 57 L 335 62 Z" fill={config.windowGlass} opacity={config.windowGlowOpacity} />
          {/* Dark Navy Dome Roof */}
          <path d="M 325 54 Q 332.5 46 340 54 Z" fill={config.domeFill} />
          {/* Finial & Crescent */}
          <line x1="332.5" y1="48" x2="332.5" y2="43" stroke="#dfb76c" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="332.5" cy="42" r="1.5" fill="#dfb76c" />
        </g>
      </svg>
    </div>
  );
};
