import React, { useState, useEffect, useRef } from 'react';
import {
  Trophy,
  Award,
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  Flame,
  CheckCircle2,
  HelpCircle,
  Zap,
} from 'lucide-react';
import {
  QuizQuestion,
  getNextEndlessQuestion,
} from '../../data/islamicQuizData';
import { ScreenBackButton } from '../common/ScreenBackButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

// Web Audio synthesizer for tactile harmonic chimes
function playChime(isSuccess: boolean) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (isSuccess) {
      // Pleasant rising major chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc1.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc1.frequency.setValueAtTime(1046.5, now + 0.3); // C6

      osc2.frequency.setValueAtTime(261.63, now);
      osc2.frequency.setValueAtTime(523.25, now + 0.2);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.7);
      osc2.stop(now + 0.7);
    } else {
      // Gentle soft low buzz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.12);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch {
    // ignore
  }
}

// Speaks aloud in authentic Arabic via Web Speech Synthesis as fallback
function speakArabicVoice(phrase: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = 'ar-SA';
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const arVoice =
      voices.find((v) => v.lang.startsWith('ar') || v.lang.includes('ar')) ||
      voices.find((v) => v.name.toLowerCase().includes('arabic'));

    if (arVoice) {
      utterance.voice = arVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error:', e);
  }
}

// Plays voice aloud with multi-layer guarantee (Local MP3 + Web Speech + Chime)
function playFeedbackVoice(isSuccess: boolean) {
  const audioSrc = isSuccess ? '/audio/ahsant.mp3' : '/audio/try_again.mp3';
  const phrase = isSuccess ? 'أحسنت!' : 'حاول مرة أخرى';

  // 1. Play offline-ready local audio file
  try {
    const audio = new Audio(audioSrc);
    audio.volume = 1.0;
    audio.play().catch(() => {
      // If browser blocked audio autoplay, use speech synthesis
      speakArabicVoice(phrase);
    });
  } catch {
    speakArabicVoice(phrase);
  }

  // 2. Play instant tactile musical chime
  playChime(isSuccess);

  // 3. Fallback Web Speech
  speakArabicVoice(phrase);
}

export const IslamicQuizModal: React.FC<Props> = ({ isOpen, onClose, isDark: propIsDark }) => {
  const isDark = propIsDark !== undefined
    ? propIsDark
    : typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  const [currentQ, setCurrentQ] = useState<QuizQuestion | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [usedIds, setUsedIds] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('athar_quiz_high_score') || '0', 10);
    } catch {
      return 0;
    }
  });

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [status, setStatus] = useState<'answering' | 'correct' | 'wrong'>('answering');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Initialize a fresh endless session whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      startNewSession();
    }
  }, [isOpen]);

  const startNewSession = () => {
    const initialUsed = new Set<string>();
    const firstQ = getNextEndlessQuestion(1, initialUsed);
    initialUsed.add(firstQ.id);

    setCurrentQ(firstQ);
    setUsedIds(initialUsed);
    setQuestionNumber(1);
    setScore(0);
    setStreak(0);
    setSelectedOption(null);
    setStatus('answering');
  };

  if (!isOpen) return null;

  const handleSelectOption = (idx: number) => {
    if (status !== 'answering' || !currentQ) return;

    setSelectedOption(idx);
    const isCorrect = idx === currentQ.correctIndex;

    if (isCorrect) {
      // Correct answer!
      setStatus('correct');
      const earnedPoints = currentQ.points;
      const newScore = score + earnedPoints;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);

      if (newScore > highScore) {
        setHighScore(newScore);
        try {
          localStorage.setItem('athar_quiz_high_score', newScore.toString());
        } catch {
          // ignore
        }
      }

      // Voice Speaks Aloud "أحسنت!"
      if (voiceEnabled) {
        playFeedbackVoice(true);
      }

      // Haptic
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(35);
      }

      // Automatically advance to the next endless question with increasing difficulty!
      setTimeout(() => {
        const nextNum = questionNumber + 1;
        const nextQ = getNextEndlessQuestion(nextNum, usedIds);
        setUsedIds((prev) => new Set([...prev, nextQ.id]));
        setCurrentQ(nextQ);
        setQuestionNumber(nextNum);
        setSelectedOption(null);
        setStatus('answering');
      }, 1100);
    } else {
      // Wrong answer!
      setStatus('wrong');
      setStreak(0);

      // Voice Speaks Aloud "حاول مرة أخرى"
      if (voiceEnabled) {
        playFeedbackVoice(false);
      }

      // Haptic
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([60, 50, 60]);
      }
    }
  };

  const getDifficultyBadge = (diff: QuizQuestion['difficulty']) => {
    switch (diff) {
      case 'easy':
        return { label: 'المستوى: تمهيدي', color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 border-emerald-500/30' };
      case 'medium':
        return { label: 'المستوى: متوسط', color: 'text-sky-700 dark:text-sky-400 bg-sky-500/15 border-sky-500/30' };
      case 'hard':
        return { label: 'المستوى: متقدم', color: 'text-amber-700 dark:text-amber-400 bg-amber-500/15 border-amber-500/30' };
      case 'expert':
        return { label: 'المستوى: خبير إسلامي', color: 'text-rose-700 dark:text-rose-400 bg-rose-500/15 border-rose-500/30' };
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#fcfbf7] dark:bg-[#0c0c0c] text-stone-900 dark:text-stone-100 select-none animate-in fade-in duration-200"
      dir="rtl"
    >
      {/* 1. Header with Golden Circular Return Arrow matching image_1d94b71d.png */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#faf8f5]/95 dark:bg-[#121212]/95 backdrop-blur-md border-b border-[#d4af37]/25 shadow-xs">
        <div className="flex items-center gap-3">
          <ScreenBackButton onClick={onClose} ariaLabel="خروج من المسابقة" />

          <div>
            <h2 className="text-base sm:text-lg font-black text-stone-900 dark:text-[#f5e6b8] flex items-center gap-1.5">
              <span>مسابقة أثَر الدينية</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-[#facc15] font-bold">
                تحدي لا نهائي
              </span>
            </h2>
            <p className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400">
              أسئلة متجددة تزداد صعوبة بالصوت التفاعلي
            </p>
          </div>
        </div>

        {/* Voice Audio Toggle Button */}
        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`p-2 rounded-2xl border transition ${
            voiceEnabled
              ? 'bg-[#d4af37]/15 border-[#d4af37] text-amber-700 dark:text-[#facc15]'
              : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-400'
          }`}
          title={voiceEnabled ? 'كتم الصوت التفاعلي' : 'تشغيل الصوت التفاعلي'}
        >
          {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </header>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 max-w-xl mx-auto w-full flex flex-col justify-between">
        {/* 2. Top Stats Bar (Score, Streak, High Score) */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-white dark:bg-[#141414] border border-stone-200 dark:border-[#d4af37]/25 shadow-xs text-center mb-4">
          <div className="space-y-0.5">
            <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-bold flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>مجموع النقاط</span>
            </span>
            <span className="text-base font-black font-mono text-[#b45309] dark:text-[#facc15] mt-0.5 block">
              {score}
            </span>
          </div>

          <div className="space-y-0.5 border-x border-stone-100 dark:border-stone-800">
            <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-bold flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>إجابات متتالية</span>
            </span>
            <span className="text-base font-black font-mono text-rose-600 dark:text-rose-400 mt-0.5 block">
              {streak}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-bold flex items-center justify-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-[#ca8a04]" />
              <span>أعلى رقم قياسي</span>
            </span>
            <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block">
              {highScore}
            </span>
          </div>
        </div>

        {/* 3. Question Screen or Wrong Answer Screen */}
        {status === 'wrong' ? (
          /* Wrong Answer Screen: Voice said "حاول مرة أخرى", restart from Question 1 with fresh questions! */
          <div className="my-auto p-6 rounded-3xl bg-white dark:bg-[#141414] border-2 border-rose-500/40 text-center space-y-5 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <RotateCcw className="w-8 h-8 animate-spin-once" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-rose-600 dark:text-rose-400">
                فرصة أخرى لكسب الأجر والمعرفة!
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 max-w-sm mx-auto leading-relaxed">
                الإجابة الصحيحة كانت: <strong className="text-amber-700 dark:text-[#facc15]">{currentQ?.options[currentQ.correctIndex]}</strong>
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400 pt-1">
                جمعت في هذه الجولة <strong className="font-mono text-amber-600">{score}</strong> نقطة وبلغت السؤال رقم {questionNumber}.
              </p>
            </div>

            <button
              onClick={startNewSession}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#facc15] to-[#ca8a04] hover:from-[#fef08a] hover:to-[#d4af37] text-stone-950 font-black text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
              <span>محاولة جديدة بأسئلة مختلفة تماماً</span>
            </button>
          </div>
        ) : currentQ ? (
          /* Active Question Card (Endless series with no limit displayed) */
          <div className="space-y-4 my-auto">
            {/* Question Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#141414] border-2 border-stone-200 dark:border-[#d4af37]/30 shadow-md space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${getDifficultyBadge(currentQ.difficulty).color}`}>
                  {getDifficultyBadge(currentQ.difficulty).label}
                </span>

                {/* Endless Question Counter: e.g. "السؤال 1", "السؤال 2"... no total number! */}
                <span className="text-xs font-mono font-black text-amber-700 dark:text-[#facc15] bg-[#d4af37]/15 px-3 py-1 rounded-full border border-[#d4af37]/30">
                  السؤال {questionNumber}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-amber-600 dark:text-[#facc15] tracking-wide block">
                  [{currentQ.category}]
                </span>

                <h3
                  className="text-lg sm:text-xl font-black text-stone-900 dark:text-white leading-relaxed"
                  style={{ fontFamily: "'Traditional Arabic', 'Amiri', serif" }}
                >
                  {currentQ.question}
                </h3>
              </div>

              {/* Endless Streak Visual Indicator */}
              <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400 font-semibold pt-1 border-t border-stone-100 dark:border-stone-800">
                <Zap className="w-3.5 h-3.5 text-[#ca8a04]" />
                <span>كل إجابة صحيحة تمنحك نقاطاً وتصعّد مستوى الأسئلة</span>
              </div>
            </div>

            {/* 4 Choices */}
            <div className="space-y-2.5">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let btnStyle = 'bg-white dark:bg-[#161616] border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-[#d4af37]';

                if (status === 'correct' && isCorrect) {
                  btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-[1.02] font-black';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={status !== 'answering'}
                    className={`w-full p-4 rounded-2xl border-2 text-right transition-all flex items-center justify-between text-xs sm:text-sm font-bold shadow-2xs active:scale-98 ${btnStyle}`}
                  >
                    <span className="leading-relaxed">{option}</span>

                    <span className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-500 flex items-center justify-center text-xs shrink-0 font-mono">
                      {idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* 4. Bottom Motivational Hint */}
        <div className="text-center text-[11px] text-stone-400 dark:text-stone-500 py-2">
          مسابقة أثَر · تحدَّ معرفتك الدينية واستمع للنطق الصوتي الفوري
        </div>
      </div>
    </div>
  );
};
