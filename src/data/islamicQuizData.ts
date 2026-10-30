/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: string;
  points: number;
}

export const QUIZ_QUESTION_BANK: QuizQuestion[] = [
  // Tier 1: Easy (الأسئلة التمهيدية)
  {
    id: 'e1',
    difficulty: 'easy',
    category: 'القرآن الكريم',
    question: 'ما هي أعظم سورة في كتاب الله عز وجل؟',
    options: ['سورة البقرة', 'سورة الفاتحة', 'سورة الإخلاص', 'سورة الكهف'],
    correctIndex: 1,
    points: 10,
  },
  {
    id: 'e2',
    difficulty: 'easy',
    category: 'السيرة النبوية',
    question: 'أين ولد النبي محمد ﷺ؟',
    options: ['مكة المكرمة', 'المدينة المنورة', 'القدس الشريف', 'الطائف'],
    correctIndex: 0,
    points: 10,
  },
  {
    id: 'e3',
    difficulty: 'easy',
    category: 'قصص الأنبياء',
    question: 'من هو النبي الذي بنى الكعبة المشرفة مع ابنه إسماعيل عليهما السلام؟',
    options: ['نوح عليه السلام', 'إبراهيم عليه السلام', 'موسى عليه السلام', 'داود عليه السلام'],
    correctIndex: 1,
    points: 10,
  },
  {
    id: 'e4',
    difficulty: 'easy',
    category: 'القرآن الكريم',
    question: 'ما هي أقصر سورة في القرآن الكريم؟',
    options: ['سورة النصر', 'سورة الفلق', 'سورة الكوثر', 'سورة العصر'],
    correctIndex: 2,
    points: 10,
  },
  {
    id: 'e5',
    difficulty: 'easy',
    category: 'الصحابة الكرام',
    question: 'من هو أول الخلفاء الراشدين رضي الله عنهم؟',
    options: ['عمر بن الخطاب', 'عثمان بن عفان', 'علي بن أبي طالب', 'أبو بكر الصديق'],
    correctIndex: 3,
    points: 10,
  },
  {
    id: 'e6',
    difficulty: 'easy',
    category: 'القرآن الكريم',
    question: 'ما هي السورة التي تعدل ثلث القرآن الكريم؟',
    options: ['سورة الإخلاص', 'سورة الفاتحة', 'سورة يس', 'سورة الملك'],
    correctIndex: 0,
    points: 10,
  },
  {
    id: 'e7',
    difficulty: 'easy',
    category: 'السيرة النبوية',
    question: 'ما هو أول مسجد بُني في الإسلام؟',
    options: ['المسجد النبوي', 'المسجد الحرام', 'مسجد قباء', 'المسجد الأقصى'],
    correctIndex: 2,
    points: 10,
  },
  {
    id: 'e8',
    difficulty: 'easy',
    category: 'الفقه والعبادات',
    question: 'كم عدد ركعات صلاة الفجر المفروضة؟',
    options: ['ركعتان', 'ثلاث ركعات', 'أربع ركعات', 'ركعة واحدة'],
    correctIndex: 0,
    points: 10,
  },
  {
    id: 'e9',
    difficulty: 'easy',
    category: 'قصص الأنبياء',
    question: 'من هو النبي الذي أُلقي في النار فكانت عليه برداً وسلاماً؟',
    options: ['يونس عليه السلام', 'إبراهيم عليه السلام', 'يوسف عليه السلام', 'أيوب عليه السلام'],
    correctIndex: 1,
    points: 10,
  },
  {
    id: 'e10',
    difficulty: 'easy',
    category: 'القرآن الكريم',
    question: 'في أي شهر أُنزل القرآن الكريم لأول مرة؟',
    options: ['شهر رجب', 'شهر شعبان', 'شهر رمضان', 'شهر ذي الحجة'],
    correctIndex: 2,
    points: 10,
  },

  // Tier 2: Medium (المستوى المتوسط)
  {
    id: 'm1',
    difficulty: 'medium',
    category: 'القرآن الكريم',
    question: 'ما هي السورة الوحيدة في القرآن التي لا تبدأ بالبسملة؟',
    options: ['سورة النمل', 'سورة التوبة', 'سورة الأنفال', 'سورة يونس'],
    correctIndex: 1,
    points: 20,
  },
  {
    id: 'm2',
    difficulty: 'medium',
    category: 'السيرة النبوية',
    question: 'في أي عام هجري وقعت غزوة بدر الكبرى؟',
    options: ['العام الأول الهجري', 'العام الثاني الهجري', 'العام الثالث الهجري', 'العام الخامس الهجري'],
    correctIndex: 1,
    points: 20,
  },
  {
    id: 'm3',
    difficulty: 'medium',
    category: 'الصحابة الكرام',
    question: 'من الصحابي الجليل الذي لُقّب بـ «أمين هذه الأمة»؟',
    options: ['أبو عبيدة بن الجراح', 'خالد بن الوليد', 'معاذ بن جبل', 'سعد بن أبي وقاص'],
    correctIndex: 0,
    points: 20,
  },
  {
    id: 'm4',
    difficulty: 'medium',
    category: 'قصص الأنبياء',
    question: 'كم سنة لبث نبي الله نوح عليه السلام يدعو قومه؟',
    options: ['٥٠٠ عام', '٩٥٠ عاماً', '١٠٠٠ عام', '٣٠٠ عام'],
    correctIndex: 1,
    points: 20,
  },
  {
    id: 'm5',
    difficulty: 'medium',
    category: 'القرآن الكريم',
    question: 'ما هي السورة التي تحتوي على بسملتين؟',
    options: ['سورة النمل', 'سورة النحل', 'سورة النور', 'سورة النساء'],
    correctIndex: 0,
    points: 20,
  },
  {
    id: 'm6',
    difficulty: 'medium',
    category: 'السيرة النبوية',
    question: 'ما هي الغزوة التي أشار فيها سلمان الفارسي بحفر الخندق؟',
    options: ['غزوة أحد', 'غزوة تبوك', 'غزوة الأحزاب', 'غزوة خيبر'],
    correctIndex: 2,
    points: 20,
  },
  {
    id: 'm7',
    difficulty: 'medium',
    category: 'الصحابة الكرام',
    question: 'من هو الصحابي الذي تستحي منه ملائكة السماء؟',
    options: ['عثمان بن عفان', 'علي بن أبي طالب', 'عمر بن الخطاب', 'الزبير بن العوام'],
    correctIndex: 0,
    points: 20,
  },
  {
    id: 'm8',
    difficulty: 'medium',
    category: 'القرآن الكريم',
    question: 'ما هي أطول آية في كتاب الله الكريم؟',
    options: ['آية الكرسي', 'آية الدين (البقرة: ٢٨٢)', 'آية المداينة في النساء', 'آخر آية في البقرة'],
    correctIndex: 1,
    points: 20,
  },
  {
    id: 'm9',
    difficulty: 'medium',
    category: 'الفقه والعبادات',
    question: 'ما هي الصلاة التي ليس فيها ركوع ولا سجود؟',
    options: ['صلاة الكسوف', 'صلاة الجنازة', 'صلاة الاستسقاء', 'صلاة العيدين'],
    correctIndex: 1,
    points: 20,
  },
  {
    id: 'm10',
    difficulty: 'medium',
    category: 'قصص الأنبياء',
    question: 'من هو النبي الذي ألان الله له الحديد وسخر له الجبال تسبح معه؟',
    options: ['سليمان عليه السلام', 'داود عليه السلام', 'يحيى عليه السلام', 'زكريا عليه السلام'],
    correctIndex: 1,
    points: 20,
  },

  // Tier 3: Hard (المستوى المتقدم)
  {
    id: 'h1',
    difficulty: 'hard',
    category: 'القرآن الكريم',
    question: 'كم عدد السجدات المتفق عليها في القرآن الكريم؟',
    options: ['١٥ سجدة', '١٢ سجدة', '١٤ سجدة', '١٠ سجدات'],
    correctIndex: 0,
    points: 30,
  },
  {
    id: 'h2',
    difficulty: 'hard',
    category: 'الصحابة الكرام',
    question: 'من هو الصحابي الذي أمره النبي ﷺ بتعلم لغة السريانية فتعلمها في نصف شهر؟',
    options: ['زيد بن ثابت', 'عبد الله بن مسعود', 'معاوية بن أبي سفيان', 'أبي بن كعب'],
    correctIndex: 0,
    points: 30,
  },
  {
    id: 'h3',
    difficulty: 'hard',
    category: 'السيرة النبوية',
    question: 'من هي آخر زوجات النبي ﷺ وفاةً رضي الله عنهن؟',
    options: ['عائشة بنت أبي بكر', 'حفصة بنت عمر', 'أم سلمة (هند بنت أبي أمية)', 'سودة بنت زمعة'],
    correctIndex: 2,
    points: 30,
  },
  {
    id: 'h4',
    difficulty: 'hard',
    category: 'التاريخ الإسلامي',
    question: 'من هو القائد المسلم الذي قاد جيش المسلمين في معركة القادسية؟',
    options: ['خالد بن الوليد', 'سعد بن أبي وقاص', 'عمرو بن العاص', 'أبو عبيدة بن الجراح'],
    correctIndex: 1,
    points: 30,
  },
  {
    id: 'h5',
    difficulty: 'hard',
    category: 'القرآن الكريم',
    question: 'ما هي السورة التي تسمى «سورة بني إسرائيل»؟',
    options: ['سورة الإسراء', 'سورة يونس', 'سورة الأنبياء', 'سورة المائدة'],
    correctIndex: 0,
    points: 30,
  },
  {
    id: 'h6',
    difficulty: 'hard',
    category: 'الحديث الشريف',
    question: 'كم عدد أحاديث الأربعين النووية التي جمعها الإمام النووي رحمه الله؟',
    options: ['٤٠ حديثاً', '٤٢ حديثاً', '٤٥ حديثاً', '٥٠ حديثاً'],
    correctIndex: 1,
    points: 30,
  },
  {
    id: 'h7',
    difficulty: 'hard',
    category: 'قصص الأنبياء',
    question: 'من هو النبي الذي سأل الله أن يؤيده بأخيه هارون وزيراً له؟',
    options: ['عيسى عليه السلام', 'موسى عليه السلام', 'يوسف عليه السلام', 'إسحاق عليه السلام'],
    correctIndex: 1,
    points: 30,
  },
  {
    id: 'h8',
    difficulty: 'hard',
    category: 'التاريخ الإسلامي',
    question: 'في أي معركة لُقب خالد بن الوليد بـ «سيف الله المسلول»؟',
    options: ['غزوة أحد', 'معركة مؤتة', 'معركة اليرموك', 'فتح مكة'],
    correctIndex: 1,
    points: 30,
  },

  // Tier 4: Expert (المستوى المتخصص)
  {
    id: 'x1',
    difficulty: 'expert',
    category: 'علوم القرآن',
    question: 'ما هي السورة التي نزلت جملة واحدة وشيعها سبعون ألف ملك؟',
    options: ['سورة البقرة', 'سورة الأنعام', 'سورة الكهف', 'سورة يس'],
    correctIndex: 1,
    points: 40,
  },
  {
    id: 'x2',
    difficulty: 'expert',
    category: 'الصحابة والتابعين',
    question: 'من هو الصحابي الوحيد الذي ذُكر اسمه صراحةً في القرآن الكريم؟',
    options: ['أبو بكر الصديق', 'زيد بن حارثة', 'علي بن أبي طالب', 'عمر بن الخطاب'],
    correctIndex: 1,
    points: 40,
  },
  {
    id: 'x3',
    difficulty: 'expert',
    category: 'التاريخ الإسلامي',
    question: 'ما هي المعركة التي سُميت في التاريخ الإسلامي بـ «فتح الفتوح»؟',
    options: ['معركة اليرموك', 'معركة القادسية', 'معركة نهاوند', 'معركة حطين'],
    correctIndex: 2,
    points: 40,
  },
  {
    id: 'x4',
    difficulty: 'expert',
    category: 'علوم الحديث',
    question: 'من هو الصحابي الأكثر روايةً للحديث الشريف عن النبي ﷺ؟',
    options: ['عبد الله بن عمر', 'أنس بن مالك', 'أبو هريرة رضي الله عنه', 'عبد الله بن عباس'],
    correctIndex: 2,
    points: 40,
  },
  {
    id: 'x5',
    difficulty: 'expert',
    category: 'القرآن الكريم',
    question: 'ما هي السورة التي تنتهي جميع آياتها بحرف السين؟',
    options: ['سورة الناس', 'سورة الشمس', 'سورة عبس', 'سورة قريش'],
    correctIndex: 0,
    points: 40,
  },
  {
    id: 'x7',
    difficulty: 'expert',
    category: 'الفقه الإسلامي',
    question: 'ما هو الميقات المكاني لأهل مصر وبلاد الشام والمغرب في الحج والعمرة؟',
    options: ['الجحفة (رابغ)', 'ذو الحليفة (أبيار علي)', 'قرن المنازل (السيل الكبير)', 'يلملم'],
    correctIndex: 0,
    points: 40,
  },
  {
    id: 'x8',
    difficulty: 'expert',
    category: 'القرآن الكريم',
    question: 'كم عدد السور التي تبدأ بالحروف المقطعة (مثل الم، الر، حم)؟',
    options: ['٢٩ سورة', '٣٣ سورة', '٢٥ سورة', '٣٠ سورة'],
    correctIndex: 0,
    points: 40,
  },
  {
    id: 'x9',
    difficulty: 'expert',
    category: 'الصحابة والتابعين',
    question: 'من هو حواري رسول الله ﷺ وابن عمته صفية بنت عبد المطلب؟',
    options: ['الزبير بن العوام', 'طلحة بن عبيد الله', 'سعد بن أبي وقاص', 'عبد الرحمن بن عوف'],
    correctIndex: 0,
    points: 40,
  },
  {
    id: 'x10',
    difficulty: 'expert',
    category: 'السيرة النبوية',
    question: 'في أي سنة هجرية تم فتح مكة المكرمة؟',
    options: ['السنة السادسة للهجرة', 'السنة الثامنة للهجرة', 'السنة التاسعة للهجرة', 'السنة العاشرة للهجرة'],
    correctIndex: 1,
    points: 40,
  },
];

/**
 * Shuffles an array randomly
 */
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Gets the next question in an infinite/endless sequence.
 * Difficulty scales dynamically:
 * - Questions 1 to 5: Easy
 * - Questions 6 to 12: Medium
 * - Questions 13 to 20: Hard
 * - Questions 21+: Expert
 */
export function getNextEndlessQuestion(questionNumber: number, usedIds: Set<string>): QuizQuestion {
  let targetDifficulty: QuizQuestion['difficulty'] = 'easy';

  if (questionNumber <= 5) {
    targetDifficulty = 'easy';
  } else if (questionNumber <= 12) {
    targetDifficulty = 'medium';
  } else if (questionNumber <= 20) {
    targetDifficulty = 'hard';
  } else {
    targetDifficulty = 'expert';
  }

  // Find unused questions matching the target difficulty
  let candidates = QUIZ_QUESTION_BANK.filter(
    (q) => q.difficulty === targetDifficulty && !usedIds.has(q.id)
  );

  // If all questions of this tier were used, pull from adjacent tiers
  if (candidates.length === 0) {
    candidates = QUIZ_QUESTION_BANK.filter((q) => !usedIds.has(q.id));
  }

  // If still exhausted, allow recycling from the full bank (randomized)
  if (candidates.length === 0) {
    candidates = QUIZ_QUESTION_BANK;
  }

  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  return chosen;
}

/**
 * Legacy support: Generates an initial progressive list
 */
export function generateProgressiveQuizSession(): QuizQuestion[] {
  const q1 = getNextEndlessQuestion(1, new Set());
  return [q1];
}
