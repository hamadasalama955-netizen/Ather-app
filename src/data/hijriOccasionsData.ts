import { HijriOccasion } from '../types';

export const HIJRI_MONTHS_NAMES = [
  'المُحَرَّم',
  'صَفَر',
  'رَبِيع الأَوَّل',
  'رَبِيع الآخِر',
  'جُمَادَى الأُولَى',
  'جُمَادَى الآخِرَة',
  'رَجَب',
  'شَعْبَان',
  'رَمَضَان',
  'شَوَّال',
  'ذُو القَعْدَة',
  'ذُو الحِجَّة',
];

export const HIJRI_MAJOR_OCCASIONS: HijriOccasion[] = [
  {
    id: 'hijri-new-year',
    hijriMonth: 1,
    hijriDay: 1,
    title: 'رأس السنة الهجرية',
    description: 'بداية العام الهجري الجديد واستذكار هجرة النبي ﷺ المباركة إلى المدينة المنورة.',
    badge: 'مناسبة إسلامية',
  },
  {
    id: 'tashua',
    hijriMonth: 1,
    hijriDay: 9,
    title: 'تاسوعاء',
    description: 'يوم التاسع من شهر محرم ويستحب صيامه مع عاشوراء لمخالفة أهل الكتاب.',
    isFastingRecommended: true,
    badge: 'صيام مستحب',
  },
  {
    id: 'ashura',
    hijriMonth: 1,
    hijriDay: 10,
    title: 'يوم عاشوراء',
    description: 'اليوم الذي نجى الله فيه موسى عليه السلام وقومه من فرعون. صومه يكفر ذنوب سنة ماضية.',
    isFastingRecommended: true,
    badge: 'صيام مؤكد',
  },
  {
    id: 'mawlid',
    hijriMonth: 3,
    hijriDay: 12,
    title: 'ذكرى المولد النبوي الشريف',
    description: 'مولد خير البرية نبينا محمد ﷺ والاعتناء بسيرته العطرة والتخلق بأخلاقه الفاضلة.',
    badge: 'سيرة عطرة',
  },
  {
    id: 'isra-miraj',
    hijriMonth: 7,
    hijriDay: 27,
    title: 'ذكرى الإسراء والمعراج',
    description: 'معجزة إلهية أسري فيها بالنبي ﷺ إلى المسجد الأقصى وعُرج به إلى السماوات وفرضت الصلاة.',
    badge: 'معجزة كبرى',
  },
  {
    id: 'nisf-shaaban',
    hijriMonth: 8,
    hijriDay: 15,
    title: 'ليلة النصف من شعبان',
    description: 'ليلة مباركة يُرجى فيها قبول التوبة والاستعداد لشهر رمضان المبارك بالإكثار من الطاعات.',
    isFastingRecommended: true,
    badge: 'نفحات شعبان',
  },
  {
    id: 'start-ramadan',
    hijriMonth: 9,
    hijriDay: 1,
    title: 'أول أيام شهر رمضان المبارك',
    description: 'شهر الصيام والقرآن، تفتح فيه أبواب الجنان وتغلق أبواب النيران وتصفد الشياطين.',
    isFastingRecommended: true,
    badge: 'شهر الصيام والقرآن',
  },
  {
    id: 'laylat-al-qadr',
    hijriMonth: 9,
    hijriDay: 27,
    title: 'ليلة القدر المباركة (العشر الأواخر)',
    description: 'خير من ألف شهر، نزل فيها القرآن الكريم وتتنزل فيها الملائكة بالرحمة والسلام.',
    badge: 'خير من ألف شهر',
  },
  {
    id: 'eid-al-fitr',
    hijriMonth: 10,
    hijriDay: 1,
    title: 'عيد الفطر المبارك',
    description: 'يوم الجائزة والفرح بإتمام صيام شهر رمضان المبارك وإخراج زكاة الفطر وصلة الأرحام.',
    badge: 'عيد مبارك',
  },
  {
    id: 'six-shawwal',
    hijriMonth: 10,
    hijriDay: 2,
    title: 'ستة أيام من شوال',
    description: 'قال ﷺ: "من صام رمضان ثم أتبعه ستاً من شوال كان كصيام الدهر كله".',
    isFastingRecommended: true,
    badge: 'أجر صيام الدهر',
  },
  {
    id: 'ashr-dhulhijjah',
    hijriMonth: 12,
    hijriDay: 1,
    title: 'العشر الأوائل من ذي الحجة',
    description: 'أفضل أيام الدنيا، العمل الصالح فيها أحب إلى الله من أي أيام أخرى، ويستحب صيامها.',
    isFastingRecommended: true,
    badge: 'أفضل أيام الدنيا',
  },
  {
    id: 'arafah',
    hijriMonth: 12,
    hijriDay: 9,
    title: 'يوم عرفة',
    description: 'ركن الحج الأعظم، وصيامه لغير الحاج يكفر سنة ماضية وسنة باقية وهو يوم مغفرة وعتق من النار.',
    isFastingRecommended: true,
    badge: 'أعظم أيام العام',
  },
  {
    id: 'eid-al-adha',
    hijriMonth: 12,
    hijriDay: 10,
    title: 'عيد الأضحى المبارك (يوم النحر)',
    description: 'يوم الحج الأكبر وذبح الأضاحي تقرباً لله تعالى وإحياء لسنة إبراهيم الخليل عليه السلام.',
    badge: 'عيد الأضحى',
  },
  {
    id: 'tashreeq',
    hijriMonth: 12,
    hijriDay: 11,
    title: 'أيام التشريق (11 و12 و13 ذو الحجة)',
    description: 'أيام أكل وشرب وذكر لله تعالى وتكبير مقيد بعد الصلوات للحجاج والمقيمين.',
    badge: 'أيام ذكر وتكبير',
  },
];

/**
 * Checks if a specific Hijri day is one of the White Days (الأيام البيض)
 */
export function isWhiteDay(day: number): boolean {
  return day === 13 || day === 14 || day === 15;
}

/**
 * Checks if a Gregorian day is Monday or Thursday (Sunnah fasting)
 */
export function isMondayOrThursday(date: Date): { isFastDay: boolean; dayNameAr: string } {
  const day = date.getDay(); // 0 is Sunday, 1 is Monday, 4 is Thursday
  if (day === 1) {
    return { isFastDay: true, dayNameAr: 'الإثنين' };
  }
  if (day === 4) {
    return { isFastDay: true, dayNameAr: 'الخميس' };
  }
  return { isFastDay: false, dayNameAr: '' };
}
