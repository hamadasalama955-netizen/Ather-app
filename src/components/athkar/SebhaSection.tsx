import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  Trophy,
  Check,
  Vibrate,
  History,
} from 'lucide-react';

const SEBHA_LOCAL_KEY = 'noor_sebha_records_v1';
const SEBHA_LIFETIME_TOTAL_KEY = 'noor_sebha_lifetime_total';

const QUICK_PHRASES = [
  'سُبْحَانَ اللَّهِ',
  'الْحَمْدُ لِلَّهِ',
  'لَا إِلَهَ إِلَّا اللَّهُ',
  'اللَّهُ أَكْبَرُ',
  'أَسْتَغْفِرُ اللَّهَ',
  'اللَّهُمَّ صَلِّ عَلَى نَبِيِّنَا مُحَمَّدٍ',
  'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
  'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
];

const TOTAL_BEADS = 33;

export const SebhaSection: React.FC = () => {
  const [phrases, setPhrases] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('noor_sebha_phrases');
      return stored ? JSON.parse(stored) : QUICK_PHRASES;
    } catch {
      return QUICK_PHRASES;
    }
  });

  const [selectedPhrase, setSelectedPhrase] = useState<string>(phrases[0] || QUICK_PHRASES[0]);
  const [count, setCount] = useState<number>(0);
  const [target, setTarget] = useState<number>(33);
  const [rounds, setRounds] = useState<number>(0);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isPressing, setIsPressing] = useState<boolean>(false);

  const [lifetimeTotal, setLifetimeTotal] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(SEBHA_LIFETIME_TOTAL_KEY);
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Sound and Vibrate toggles
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrateEnabled, setVibrateEnabled] = useState(true);

  // New phrase custom input
  const [newPhraseInput, setNewPhraseInput] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Audio Context ref for realistic bead strike click
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Save phrases on change
  useEffect(() => {
    try {
      localStorage.setItem('noor_sebha_phrases', JSON.stringify(phrases));
    } catch (e) {
      console.warn(e);
    }
  }, [phrases]);

  // Load count for selected phrase
  useEffect(() => {
    try {
      const recordsStr = localStorage.getItem(SEBHA_LOCAL_KEY);
      if (recordsStr) {
        const records: Record<string, { count: number; rounds: number; target: number }> =
          JSON.parse(recordsStr);
        if (records[selectedPhrase]) {
          const loadedCount = records[selectedPhrase].count || 0;
          setCount(loadedCount);
          setRounds(records[selectedPhrase].rounds || 0);
          setTarget(records[selectedPhrase].target || 33);
          setRotationAngle(loadedCount * (360 / TOTAL_BEADS));
          return;
        }
      }
    } catch (e) {
      console.warn(e);
    }
    setCount(0);
    setRounds(0);
    setRotationAngle(0);
  }, [selectedPhrase]);

  const saveCurrentRecord = (newCount: number, newRounds: number, newTarget: number) => {
    try {
      const recordsStr = localStorage.getItem(SEBHA_LOCAL_KEY);
      const records = recordsStr ? JSON.parse(recordsStr) : {};
      records[selectedPhrase] = { count: newCount, rounds: newRounds, target: newTarget };
      localStorage.setItem(SEBHA_LOCAL_KEY, JSON.stringify(records));
    } catch (e) {
      console.warn(e);
    }
  };

  const playBeadClickSound = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Realistic marble/wood bead strike sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(680, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.04);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, ctx.currentTime);
      filter.Q.setValueAtTime(2.5, ctx.currentTime);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.055);
    } catch {
      // Audio fallback
    }
  };

  const handleTap = () => {
    setIsPressing(true);
    setTimeout(() => setIsPressing(false), 120);

    // Audio sound
    playBeadClickSound();

    // Haptic vibration
    if (vibrateEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(18);
    }

    // Advance rotation angle smoothly
    const stepAngle = 360 / TOTAL_BEADS;
    setRotationAngle((prev) => prev + stepAngle);

    // Update totals
    const nextLifetime = lifetimeTotal + 1;
    setLifetimeTotal(nextLifetime);
    try {
      localStorage.setItem(SEBHA_LIFETIME_TOTAL_KEY, nextLifetime.toString());
    } catch (e) {
      console.warn(e);
    }

    const nextCount = count + 1;
    if (nextCount >= target) {
      const nextRounds = rounds + 1;
      setCount(0);
      setRounds(nextRounds);
      saveCurrentRecord(0, nextRounds, target);

      if (vibrateEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([45, 60, 45]);
      }
    } else {
      setCount(nextCount);
      saveCurrentRecord(nextCount, rounds, target);
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCount(0);
    setRounds(0);
    setRotationAngle(0);
    saveCurrentRecord(0, 0, target);
  };

  const handleAddCustomPhrase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhraseInput.trim()) return;
    const trimmed = newPhraseInput.trim();
    if (!phrases.includes(trimmed)) {
      const updated = [...phrases, trimmed];
      setPhrases(updated);
      setSelectedPhrase(trimmed);
    }
    setNewPhraseInput('');
    setShowAddModal(false);
  };

  const progressPercent = target > 0 ? Math.round((count / target) * 100) : 0;

  // Generate 33 beads coordinate positions on circle
  const radius = 105;
  const centerX = 135;
  const centerY = 135;
  const beads = Array.from({ length: TOTAL_BEADS }, (_, i) => {
    const angleDeg = (i * 360) / TOTAL_BEADS - 90;
    const angleRad = (angleDeg * Math.PI) / 180;
    const x = centerX + radius * Math.cos(angleRad);
    const y = centerY + radius * Math.sin(angleRad);
    const isMarker = i === 11 || i === 22; // traditional 11-bead dividers
    return { id: i, x, y, isMarker };
  });

  return (
    <div className="rounded-3xl bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 border border-stone-800 p-4 sm:p-5 shadow-xl space-y-4 text-center select-none">
      {/* 1. Quick Select Phrase Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-stone-300 px-1">
          <div className="flex items-center gap-1.5 text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>اختر الذكر المفضل</span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition"
          >
            <Plus className="w-3 h-3" />
            <span>إضافة صيغة</span>
          </button>
        </div>

        {/* Quick Phrase Pills Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {phrases.map((phrase) => {
            const isSelected = selectedPhrase === phrase;
            return (
              <button
                key={phrase}
                onClick={() => setSelectedPhrase(phrase)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 shrink-0 ${
                  isSelected
                    ? 'bg-amber-400 text-stone-950 shadow-md font-black'
                    : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700/80 border border-stone-700/50'
                }`}
              >
                {phrase}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Realistic 3D Interactive Tasbih Visual */}
      <div className="relative py-2 flex flex-col items-center justify-center">
        {/* Clickable Area wrapping the rotating beads */}
        <div
          onClick={handleTap}
          className="relative w-[280px] h-[280px] sm:w-[310px] sm:h-[310px] flex items-center justify-center cursor-pointer group active:scale-[0.98] transition-transform duration-100"
        >
          {/* SVG Beads String */}
          <svg
            className="w-full h-full drop-shadow-2xl overflow-visible pointer-events-none"
            viewBox="0 0 270 270"
          >
            <defs>
              {/* Golden Thread filter */}
              <linearGradient id="goldThreadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="50%" stopColor="#fde68a" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>

              {/* Realistic Ivory/Marble Bead Gradient */}
              <radialGradient id="marbleBead" cx="32%" cy="28%" r="68%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="25%" stopColor="#fdfaf3" />
                <stop offset="55%" stopColor="#e7dfd1" />
                <stop offset="85%" stopColor="#c5b7a1" />
                <stop offset="100%" stopColor="#8d7c66" />
              </radialGradient>

              {/* Active Golden Highlight Bead */}
              <radialGradient id="activeMarbleBead" cx="30%" cy="25%" r="70%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#fef08a" />
                <stop offset="65%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#92400e" />
              </radialGradient>

              {/* Gold Divider Bead Gradient */}
              <radialGradient id="goldMarkerBead" cx="30%" cy="25%" r="70%">
                <stop offset="0%" stopColor="#fef9c3" />
                <stop offset="40%" stopColor="#eab308" />
                <stop offset="80%" stopColor="#ca8a04" />
                <stop offset="100%" stopColor="#713f12" />
              </radialGradient>

              {/* Soft Drop Shadow for Beads */}
              <filter id="beadShadow" x="-20%" y="-20%" width="150%" height="150%">
                <feDropShadow dx="1" dy="2.5" stdDeviation="1.8" floodOpacity="0.45" />
              </filter>
            </defs>

            {/* Rotating Beads Ring Group */}
            <g
              style={{
                transformOrigin: '135px 135px',
                transform: `rotate(${rotationAngle}deg)`,
                transition: 'transform 0.22s cubic-bezier(0.34, 1.45, 0.7, 1)',
              }}
            >
              {/* Inner Golden Cord connecting beads */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke="url(#goldThreadGrad)"
                strokeWidth="2.8"
                strokeDasharray="4 2"
                opacity="0.85"
              />

              {/* Render 33 3D Marble Beads */}
              {beads.map((bead, idx) => {
                const isCurrent = idx === count % TOTAL_BEADS;
                const beadRadius = bead.isMarker ? 8.2 : 7.2;

                return (
                  <g key={bead.id} filter="url(#beadShadow)">
                    <circle
                      cx={bead.x}
                      cy={bead.y}
                      r={isCurrent ? beadRadius + 1.8 : beadRadius}
                      fill={
                        bead.isMarker
                          ? 'url(#goldMarkerBead)'
                          : isCurrent
                          ? 'url(#activeMarbleBead)'
                          : 'url(#marbleBead)'
                      }
                      stroke={isCurrent ? '#fef08a' : '#baa790'}
                      strokeWidth={isCurrent ? '1.8' : '0.6'}
                      className="transition-all duration-150"
                    />

                    {/* Specular Glint Reflection */}
                    <circle
                      cx={bead.x - beadRadius * 0.32}
                      cy={bead.y - beadRadius * 0.32}
                      r={beadRadius * 0.3}
                      fill="#ffffff"
                      opacity={isCurrent ? '0.9' : '0.75'}
                    />
                  </g>
                );
              })}
            </g>

            {/* Minaret / Imam Bead (شاهد المسبحة) & Golden Tassel at Top */}
            <g transform="translate(135, 12)" filter="url(#beadShadow)">
              {/* Imam Spire */}
              <path
                d="M-5,16 L-2,4 L0,-4 L2,4 L5,16 Z"
                fill="url(#goldMarkerBead)"
                stroke="#fef08a"
                strokeWidth="0.8"
              />
              <circle cx="0" cy="18" r="4" fill="url(#goldMarkerBead)" stroke="#fef08a" strokeWidth="0.6" />
              {/* Golden Silk Tassel */}
              <path
                d="M-3,22 Q-6,34 0,38 Q6,34 3,22 Z"
                fill="url(#goldThreadGrad)"
                opacity="0.95"
              />
            </g>
          </svg>

          {/* Central Interactive Tactile Touch Center */}
          <div
            className={`absolute w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-b from-stone-800/90 via-stone-900/90 to-black/95 border-2 ${
              isPressing ? 'border-amber-400 scale-95 shadow-amber-500/20' : 'border-amber-500/30'
            } shadow-2xl flex flex-col items-center justify-center p-3 transition-all duration-100 backdrop-blur-md`}
          >
            {/* Subtle Circular Progress indicator */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#292524"
                strokeWidth="3"
              />
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3.5"
                strokeDasharray="289"
                strokeDashoffset={289 - (289 * progressPercent) / 100}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.15s ease' }}
              />
            </svg>

            <span className="text-[10px] text-amber-300/80 font-bold uppercase tracking-wider mb-0.5">
              انقر للتسبيح
            </span>

            {/* Big Marble Digital Display Count */}
            <span className="text-4xl sm:text-5xl font-black font-mono tabular-nums text-white tracking-tight drop-shadow-md">
              {count}
            </span>

            <span className="text-[11px] text-stone-400 font-medium mt-1">
              الهدف: {target}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Luxury Digital Counter Display Bar */}
      <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800 text-stone-300 flex items-center justify-between text-xs">
        <div className="text-right space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400">الدورات المكتملة:</span>
            <span className="font-bold text-amber-400 font-mono text-sm">{rounds}</span>
          </div>
          <div className="text-[11px] text-stone-500">
            إجمالي التسبيحات الكلي: <span className="font-mono text-stone-300">{lifetimeTotal}</span>
          </div>
        </div>

        {/* Target Buttons (33, 100, 1000) & Reset */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-stone-900 p-0.5 rounded-xl border border-stone-800">
            {[33, 100, 1000].map((t) => (
              <button
                key={t}
                onClick={(e) => {
                  e.stopPropagation();
                  setTarget(t);
                  saveCurrentRecord(count, rounds, t);
                }}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                  target === t
                    ? 'bg-amber-400 text-stone-950 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-rose-950/60 text-stone-300 hover:text-rose-300 border border-stone-800 transition active:scale-95"
            title="تصفير العداد"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">تصفير</span>
          </button>
        </div>
      </div>

      {/* 4. Controls: Sound & Haptic Vibration toggles */}
      <div className="flex items-center justify-center gap-3 pt-1 text-xs">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition ${
            soundEnabled
              ? 'border-amber-500/50 text-amber-300 bg-amber-950/30'
              : 'border-stone-800 text-stone-500 bg-stone-900/50'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>صوت الخرزات</span>
        </button>

        <button
          onClick={() => setVibrateEnabled(!vibrateEnabled)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition ${
            vibrateEnabled
              ? 'border-amber-500/50 text-amber-300 bg-amber-950/30'
              : 'border-stone-800 text-stone-500 bg-stone-900/50'
          }`}
        >
          <Vibrate className="w-3.5 h-3.5" />
          <span>الاهتزاز اللمسي</span>
        </button>
      </div>

      {/* Add Custom Phrase Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-stone-900 border border-stone-800 p-5 shadow-2xl text-right space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>إضافة صيغة تسبيح أو ذكر جديدة</span>
            </h3>

            <form onSubmit={handleAddCustomPhrase} className="space-y-3">
              <input
                type="text"
                placeholder="اكتب صيغة الذكر هنا..."
                value={newPhraseInput}
                onChange={(e) => setNewPhraseInput(e.target.value)}
                autoFocus
                className="w-full p-3 rounded-2xl bg-stone-800 border border-stone-700 text-xs text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={!newPhraseInput.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs disabled:opacity-50 transition"
                >
                  إضافة وحفظ
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 text-stone-300 font-semibold text-xs"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
