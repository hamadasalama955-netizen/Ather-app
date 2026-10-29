import React, { useState } from 'react';
import { Info, RefreshCw, CheckCircle2, Coins, ArrowUpRight, DollarSign, Scale } from 'lucide-react';

export const ZakatCalculatorSection: React.FC = () => {
  // Inputs
  const [cash, setCash] = useState<number | ''>('');
  const [goldSilver, setGoldSilver] = useState<number | ''>('');
  const [tradeGoods, setTradeGoods] = useState<number | ''>('');
  const [receivables, setReceivables] = useState<number | ''>('');
  const [debts, setDebts] = useState<number | ''>('');

  // Configurable gold price per gram (standard default around 320)
  const [goldPrice, setGoldPrice] = useState<number>(320);
  const [currency, setCurrency] = useState<string>('ريال / عملتك المحلية');

  // Nisab is 85 grams of 24k gold
  const nisabGoldWeight = 85;
  const currentNisab = nisabGoldWeight * goldPrice;

  // Calculation
  const totalAssets =
    (Number(cash) || 0) +
    (Number(goldSilver) || 0) +
    (Number(tradeGoods) || 0) +
    (Number(receivables) || 0);

  const netWealth = Math.max(0, totalAssets - (Number(debts) || 0));
  const hasReachedNisab = netWealth >= currentNisab && currentNisab > 0;
  const zakatDue = hasReachedNisab ? netWealth * 0.025 : 0; // 2.5% = 1/40

  const handleReset = () => {
    setCash('');
    setGoldSilver('');
    setTradeGoods('');
    setReceivables('');
    setDebts('');
  };

  return (
    <div className="space-y-4">
      {/* 1. Luxury Financial Banner with Gold & Platinum Theme */}
      <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-zinc-900 text-white p-5 sm:p-6 shadow-2xl border border-amber-500/30 relative overflow-hidden">
        {/* Subtle Gold Dust Glow in Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between text-xs mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center font-bold shadow-md shadow-amber-950/40">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-white text-sm">حاسبة الزكاة الذكية</span>
              <p className="text-[10px] text-amber-300/80">المعايير الشرعية المعتمدة (2.5%)</p>
            </div>
          </div>

          <span className="bg-stone-850 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 text-[11px] font-bold shadow-inner">
            ربع العُشر (1/40)
          </span>
        </div>

        {/* Big Display: Zakat Due Amount */}
        <div className="relative z-10 text-center py-4 bg-stone-950/50 rounded-2xl border border-amber-500/20 backdrop-blur-md">
          <div className="text-xs text-amber-200/90 font-medium flex items-center justify-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>مقدار الزكاة الشرعية الواجب إخراجها</span>
          </div>

          <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300 font-mono tabular-nums tracking-tight mt-1.5 drop-shadow-sm">
            {zakatDue.toLocaleString('ar-EG', { maximumFractionDigits: 2 })}
          </div>

          <div className="text-xs mt-2 font-medium">
            {hasReachedNisab ? (
              <span className="inline-flex items-center gap-1.5 text-[#d4af37] bg-[#d4af37]/15 px-3 py-1 rounded-full border border-[#d4af37]/30 text-[11px] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
                وجبت الزكاة (المال بلغ النصاب الشرعي المقدر بـ 85 جم ذهب)
              </span>
            ) : netWealth > 0 ? (
              <span className="text-stone-400 text-[11px]">
                إجمالي المال دون النصاب الشرعي الحالي ({currentNisab.toLocaleString()} تقريباً)
              </span>
            ) : (
              <span className="text-stone-400 text-[11px]">
                أدخل قيم مدخراتك وموجوداتك لحساب الزكاة فوراً
              </span>
            )}
          </div>
        </div>

        {/* Financial Split: Net Wealth vs Nisab Threshold */}
        <div className="relative z-10 mt-3 grid grid-cols-2 gap-2 text-center text-xs">
          <div className="bg-stone-950/70 p-3 rounded-2xl border border-stone-800">
            <div className="text-[10px] text-stone-400 font-medium">صافي الثروة الخاضعة للزكاة</div>
            <div className="text-base font-bold font-mono tabular-nums text-white mt-0.5">
              {netWealth.toLocaleString()}
            </div>
          </div>

          <div className="bg-stone-950/70 p-3 rounded-2xl border border-amber-500/30">
            <div className="text-[10px] text-amber-300/90 font-medium">النصاب الشرعي (85 جم ذهب 24)</div>
            <div className="text-base font-bold font-mono tabular-nums text-amber-300 mt-0.5">
              {currentNisab.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sleek Financial Input Card with Crisp Platinum/Silver Grayscale & Gold Accents */}
      <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <h4 className="text-xs font-bold text-stone-900 dark:text-white">
              بيانات الأموال والأصول الزكوية
            </h4>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 transition"
          >
            <RefreshCw className="w-3 h-3" />
            <span>تفريغ الحقول</span>
          </button>
        </div>

        {/* Inputs Grid */}
        <div className="space-y-3">
          {/* 1. Cash */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-800 dark:text-stone-200">
              <span>1. السيولة والنقد والودائع البنكية</span>
              <span className="text-[10px] text-stone-400">حسابات جارية وتوفير</span>
            </div>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={cash}
              onChange={(e) => setCash(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-white text-sm font-mono font-bold border border-stone-200 dark:border-stone-700/80 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition"
            />
          </div>

          {/* 2. Gold & Silver */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-800 dark:text-stone-200">
              <span>2. سبائك الذهب والفضة والعملات الثمينة</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400">بسعر الذهب الحالي</span>
            </div>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={goldSilver}
              onChange={(e) => setGoldSilver(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-white text-sm font-mono font-bold border border-stone-200 dark:border-stone-700/80 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition"
            />
            <p className="text-[10px] text-stone-400 leading-tight">
              تنبيه: حُلي المرأة المعدّ للزينة والاستعمال الشخصي المعتاد لا زكاة فيه عند جمهور الفقهاء.
            </p>
          </div>

          {/* 3. Trade Goods */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-800 dark:text-stone-200">
              <span>3. عروض التجارة والأسهم الاستثمارية</span>
              <span className="text-[10px] text-stone-400">بقيمتها السوقية الحالية</span>
            </div>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={tradeGoods}
              onChange={(e) => setTradeGoods(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-white text-sm font-mono font-bold border border-stone-200 dark:border-stone-700/80 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition"
            />
          </div>

          {/* 4. Receivables */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-800 dark:text-stone-200">
              <span>4. ديون مرجوة السداد لك عند الآخرين</span>
              <span className="text-[10px] text-stone-400">أموال موثوقة مرجوة</span>
            </div>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={receivables}
              onChange={(e) => setReceivables(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-white text-sm font-mono font-bold border border-stone-200 dark:border-stone-700/80 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition"
            />
          </div>

          {/* 5. Deductible Debts */}
          <div className="space-y-1 pt-2 border-t border-stone-100 dark:border-stone-800">
            <div className="flex items-center justify-between text-xs font-semibold text-rose-700 dark:text-rose-400">
              <span>مطروحاً منها: الديون والالتزامات العاجلة عليك</span>
              <span className="text-[10px] text-rose-500">تُخصم من الوعاء</span>
            </div>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={debts}
              onChange={(e) => setDebts(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 text-stone-900 dark:text-white text-sm font-mono font-bold border border-rose-200 dark:border-rose-900/40 focus:ring-2 focus:ring-rose-500 focus:outline-none transition"
            />
          </div>

          {/* Gold Price Tuning */}
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-700 dark:text-stone-300">
                سعر جرام الذهب عيار 24 في بلدك:
              </span>
              <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                {goldPrice} لكل جرام
              </span>
            </div>
            <input
              type="number"
              min="1"
              value={goldPrice}
              onChange={(e) => setGoldPrice(Math.max(1, Number(e.target.value) || 1))}
              className="w-full p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white text-xs font-mono font-bold border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Shariah Guidance Card */}
      <div className="p-4 rounded-3xl bg-amber-50/60 dark:bg-stone-900/60 border border-amber-200/80 dark:border-amber-900/40 space-y-2 text-xs leading-relaxed text-stone-700 dark:text-stone-300">
        <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300">
          <Info className="w-4 h-4 text-amber-600" />
          <span>شروط وجوب زكاة المال ومصارفها الثمانية</span>
        </div>
        <ul className="space-y-1.5 pr-2 list-disc list-inside text-[11px] text-stone-600 dark:text-stone-400">
          <li><strong>بلوغ النصاب:</strong> أن يبلغ المال ما قيمته 85 جراماً من الذهب عيار 24.</li>
          <li><strong>حولان الحول:</strong> مرور عام هجري كامل على ملك النصاب.</li>
          <li><strong>المصارف الثمانية:</strong> ﴿إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ وَالْعَامِلِينَ عَلَيْهَا وَالْمُؤَلَّفَةِ قُلُوبُهُمْ وَفِي الرِّقَابِ وَالْغَارِمِينَ وَفِي سَبِيلِ اللَّهِ وَابْنِ السَّبِيلِ﴾ [التوبة: 60].</li>
        </ul>
      </div>
    </div>
  );
};
