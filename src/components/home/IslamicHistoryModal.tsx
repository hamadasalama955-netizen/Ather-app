import React, { useState, useMemo } from 'react';
import {
  X,
  Calendar,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Search,
  Swords,
  Shield,
  Compass,
  ArrowRight,
  Star,
  Users,
} from 'lucide-react';

import { ScreenBackButton } from '../common/ScreenBackButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  inline?: boolean;
}

export type HistoryCategory = 'all' | 'prophetic' | 'rashidun' | 'major_battles';

export interface HistoricalStation {
  id: string;
  category: 'prophetic' | 'rashidun' | 'major_battles';
  categoryLabel: string;
  hijriDate: string;
  gregorianDate?: string;
  title: string;
  commander: string;
  era: string;
  story: string;
  lesson: string;
  significance: string;
}

export const HISTORICAL_STATIONS: HistoricalStation[] = [
  // 1. بدر الكبرى
  {
    id: 'badr',
    category: 'prophetic',
    categoryLabel: 'غزوات نبوية',
    hijriDate: '١٧ رمضان ٢ هـ',
    gregorianDate: '٦٢٤ م',
    title: 'غزوة بدر الكبرى (يوم الفرقان)',
    commander: 'رسول الله محمد ﷺ',
    era: 'العهد النبوي الشريف',
    story: 'أول معركة فاصلة بين الحق والباطل؛ خرج فيها المسلمون بعدد قليل (٣١٣ رجلاً) في مواجهة ما يقارب الألف من مشركي قريش. تنزلت ملائكة السماء تثبيتاً لجند الإيمان بعد دعاء النبي ﷺ وابتهاله الطويل، فكان نصراً مؤزراً أرسى دعائم الدولة الإسلامية.',
    lesson: 'النصر من عند الله وحده لا بالكثرة والعتاد، وأهمية الإخلاص والتوكل الكامل بعد استنفاد الأسباب.',
    significance: 'سماها الله في القرآن الكريم «يوم الفرقان يوم التقى الجمعان».',
  },
  // 2. أحد
  {
    id: 'uhud',
    category: 'prophetic',
    categoryLabel: 'غزوات نبوية',
    hijriDate: '٧ شوال ٣ هـ',
    gregorianDate: '٦٢٥ م',
    title: 'غزوة أحد وموقف الثبات والصبر',
    commander: 'رسول الله محمد ﷺ',
    era: 'العهد النبوي الشريف',
    story: 'التقى جيش المسلمين مع قريش عند جبل أحد، وبدأ النصر حليفاً للمؤمنين حتى خالف الرماة أمر النبي ﷺ بمغادرة الجبل لجمع الغنائم، فاستغل خالد بن الوليد (قبل إسلامه) الثغرة والتف حول الجيش، فاستشهد حمزة بن عبد المطلب وسبعون صحابياً.',
    lesson: 'طاعة القيادة النبوية والالتزام بالأوامر شرط جوهري للنصر، والتعلق بالدنيا سبب مباشر للانتكاسات.',
    significance: 'مدرسة في التوبة والتربية والرجوع إلى الله عند الشدائد.',
  },
  // 3. بني النضير
  {
    id: 'nadir',
    category: 'prophetic',
    categoryLabel: 'غزوات نبوية',
    hijriDate: 'ربيع الأول ٤ هـ',
    gregorianDate: '٦٢٥ م',
    title: 'غزوة بني النضير وجلاء الغدر',
    commander: 'رسول الله محمد ﷺ',
    era: 'العهد النبوي الشريف',
    story: 'تآمر يهود بني النضير لاغتيال رسول الله ﷺ بإلقاء صخرة عليه وهو جالس تحت جدارهم، فأخبره الوحي بغدرهم. حاصرهم النبي ﷺ حتى استسلموا وأُجلوا عن المدينة حمايةً للأمن الداخلي واستقرار المجتمع الإسلامي.',
    lesson: 'الحزم مع الخيانة ونقض العهود، وأثر الوحي والتأييد الإلهي في حماية النبي والمؤمنين.',
    significance: 'نزل في شأنها سورة الحشر كاملة.',
  },
  // 4. الخندق
  {
    id: 'khandaq',
    category: 'prophetic',
    categoryLabel: 'غزوات نبوية',
    hijriDate: 'شوال ٥ هـ',
    gregorianDate: '٦٢٧ م',
    title: 'غزوة الخندق (الأحزاب) وحصار المدينة',
    commander: 'رسول الله محمد ﷺ',
    era: 'العهد النبوي الشريف',
    story: 'احتشدت قبائل العرب واليهود بعشرة آلاف مقاتل لاستئصال الإسلام. استشار النبي ﷺ أصحابه، فأشار سلمان الفارسي رضي الله عنه بحفر خندق حول المدينة. ثبت المسلمون رغم الجوع والبرد والخوف الشديد وغدر بني قريظة، حتى أرسل الله ريحاً وجنوداً فرقت الأحزاب.',
    lesson: 'قيمة الشورى والأخذ بالوسائل والخطط الدفاعية العسكرية المبتكرة، وعظيم فرج الله بعد الشدة.',
    significance: 'قال النبي ﷺ بعدها: «الآن نغزوهم ولا يغزوننا، نحن نسير إليهم».',
  },
  // 5. صلح الحديبية
  {
    id: 'hudaibiyah',
    category: 'prophetic',
    categoryLabel: 'غزوات نبوية',
    hijriDate: 'ذو القعدة ٦ هـ',
    gregorianDate: '٦٢٨ م',
    title: 'صلح الحديبية (الفتح المبين)',
    commander: 'رسول الله محمد ﷺ',
    era: 'العهد النبوي الشريف',
    story: 'خرج المسلمون معتمرين سلميين، فصدتهم قريش عند الحديبية. بايع الصحابة بيعة الرضوان تحت الشجرة، وعقد النبي ﷺ معاهدة صلح بدت في ظاهرها شاقة لكنها حملت هدنة مكنت الإسلام من الانتشار السلمي ومخاطبة ملوك الأرض.',
    lesson: 'البصيرة الاستراتيجية في التفاوض وحقن الدماء، واليقين بأن ما يقضيه الله خير وإن خفي أمره.',
    significance: 'سماه القرآن فتحاً مبيناً في مطلع سورة الفتح: ﴿إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا﴾.',
  },
  // 6. خيبر
  {
    id: 'khaybar',
    category: 'prophetic',
    categoryLabel: 'غزوات نبوية',
    hijriDate: 'محرم ٧ هـ',
    gregorianDate: '٦٢٨ م',
    title: 'غزوة خيبر وفتح الحصون المنيعة',
    commander: 'رسول الله محمد ﷺ وعلي بن أبي طالب',
    era: 'العهد النبوي الشريف',
    story: 'توجه المسلمون لإنهاء خطر مركز المؤامرات في خيبر المحصنة. أعطى النبي ﷺ الراية لعلي بن أبي طالب رضي الله عنه قائلاً: «لأعطين الراية غداً رجلاً يحب الله ورسوله ويحبه الله ورسوله». فُتحت الحصون حصناً حصناً وغنم المسلمون وتأمنت حدود المدينة.',
    lesson: 'الشجاعة والإقدام ونقاء القيادة، وسلامة الدولة تبدأ بتطهير منابع الفتن والمؤامرات.',
    significance: 'قضاء نهائي على القوة العسكرية للغدر في شمال الجزيرة العربية.',
  },
  // 7. مؤتة
  {
    id: 'mutah',
    category: 'prophetic',
    categoryLabel: 'غزوات نبوية',
    hijriDate: 'جمادى الأولى ٨ هـ',
    gregorianDate: '٦٢٩ م',
    title: 'معركة مؤتة وبطولة القادة الثلاثة',
    commander: 'زيد بن حارثة، جعفر بن أبي طالب، عبد الله بن رواحة، خالد بن الوليد',
    era: 'العهد النبوي الشريف',
    story: 'أول مواجهة عسكرية كبرى مع إمبراطورية الروم على أرض الشام (٣ آلاف مسلم ضد ٢٠٠ ألف رومي وحلفائهم). استشهد القادة الثلاثة تباعاً وهم يحملون الراية بأمانة، ثم تولى خالد بن الوليد القيادة بحنكة عبقرية واستطاع الانسحاب بالجيش دون خسائر إضافية.',
    lesson: 'الافتداء والوفاء بالعهد، ومهارة القائد في المناورة التكتيكية وحماية جنوده عند عدم التكافؤ.',
    significance: 'لقّب النبي ﷺ خالد بن الوليد بعدها بـ «سيف الله المسلول».',
  },
  // 8. فتح مكة
  {
    id: 'makkah_fath',
    category: 'prophetic',
    categoryLabel: 'غزوات نبوية',
    hijriDate: '٢٠ رمضان ٨ هـ',
    gregorianDate: '٦٣٠ م',
    title: 'فتح مكة المكرمة وتطهير الكعبة',
    commander: 'رسول الله محمد ﷺ',
    era: 'العهد النبوي الشريف',
    story: 'بعد نقض قريش لصلح الحديبية، تحرك جيش المسلمين بقوام ١٠ آلاف مقاتل. دخل النبي ﷺ مكة خافضاً رأسه تواضعاً وشكراً لله، وحطم ٣٦٠ صنماً حول الكعبة وهو يتلو: ﴿جَاءَ الْحَقُّ وَزَهَقَ الْبَاطِلُ﴾ ثم قال لأهل مكة: «اذهبوا فأنتم الطلقاء».',
    lesson: 'العفو عند المقدرة، والتواضع عند النصر، وسمو الأخلاق النبوية في معاملة الأعداء.',
    significance: 'تحقق الوعد بدخول الناس في دين الله أفواجاً وتطهير قبلة المسلمين للأبد.',
  },
  // 9. حنين والطائف
  {
    id: 'hunayn',
    category: 'prophetic',
    categoryLabel: 'غزوات نبوية',
    hijriDate: 'شوال ٨ هـ',
    gregorianDate: '٦٣٠ م',
    title: 'غزوة حنين والدرس في عدم الغرور بالكثرة',
    commander: 'رسول الله محمد ﷺ',
    era: 'العهد النبوي الشريف',
    story: 'خرج المسلمون بجيش قوامه ١٢ ألف مقاتل، فقال بعضهم: «لن نُغلب اليوم من قلة». باغتهم هوازن وثقيف بكمائن وابل السهام، فاضطربت الصفوف، فوقف النبي ﷺ ثابتاً ينادي: «أنا النبي لا كذب، أنا ابن عبد المطلب»، حتى عاد المسلمون وثبتوا وانتصروا.',
    lesson: 'الغرور بالعدد والعتاد مهلكة، والثبات حول القائد المخلص أصل التحول من الهزيمة إلى النصر.',
    significance: 'ذكرها القرآن صراحة: ﴿وَيَوْمَ حُنَيْنٍ إِذْ أَعْجَبَتْكُمْ كَثْرَتُكُمْ فَلَمْ تُغْنِ عَنكُمْ شَيْئًا﴾.',
  },
  // 10. تبوك
  {
    id: 'tabuk',
    category: 'prophetic',
    categoryLabel: 'غزوات نبوية',
    hijriDate: 'رجب ٩ هـ',
    gregorianDate: '٦٣٠ م',
    title: 'غزوة تبوك (جيش العسرة)',
    commander: 'رسول الله محمد ﷺ',
    era: 'العهد النبوي الشريف',
    story: 'آخر غزوة غزاها النبي ﷺ بنفسه، خرج فيها في شدة القيظ وقحط الثمار لملاقاة حشود الروم شمالاً. تسابق الصحابة في الإنفاق وجهز عثمان رضي الله عنه ثلث الجيش، ولما وصل المسلمون تبوك ألقى الله الرعب في قلوب الروم فتفرقوا دون قتال.',
    lesson: 'البذل المالي والتضحية بالراحة في سبيل العقيدة، وكشف المنافقين وتمايز الصفوف.',
    significance: 'أثبتت هيبة الدولة الإسلامية كقوة عظمى ترهب إمبراطوريات العالم القديم.',
  },
  // 11. اليرموك
  {
    id: 'yarmouk',
    category: 'rashidun',
    categoryLabel: 'عهد الراشدين',
    hijriDate: 'رجب ١٥ هـ',
    gregorianDate: '٦٣٦ م',
    title: 'معركة اليرموك الخالدة وفتح بلاد الشام',
    commander: 'خالد بن الوليد وأبو عبيدة عامر بن الجراح',
    era: 'عهد الخليفة عمر بن الخطاب رضي الله عنه',
    story: 'أعظم معارك التاريخ الإسلامي في مواجهة الجيش البيزنطي الإمبراطوري (حوالي ٤٠ ألف مسلم ضد قرابة ٢٤٠ ألف رومي). نظّم خالد بن الوليد الجيش في كراديس لأول مرة وطبق خططاً عبقرية انتهت بسحق جيش الروم وهروب هرقل قائلاً: «عليكِ السلام يا سورية سلاماً لا لقاء بعده».',
    lesson: 'العبقرية العسكرية وتوحيد القيادة والراية، وتقديم طاعة الله وخفض الأنا عند عزل القائد.',
    significance: 'فُتحت إثرها كامل بلاد الشام وسقط النفوذ البيزنطي في المنطقة.',
  },
  // 12. القادسية
  {
    id: 'qadisiyyah',
    category: 'rashidun',
    categoryLabel: 'عهد الراشدين',
    hijriDate: 'شعبان ١٥ هـ',
    gregorianDate: '٦٣٦ م',
    title: 'معركة القادسية وكسر شوكة الفرس',
    commander: 'سعد بن أبي وقاص والقعقاع بن عمرو',
    era: 'عهد الخليفة عمر بن الخطاب رضي الله عنه',
    story: 'التقى جيش المسلمين (٣٠ ألف مقاتل) بجيش الإمبراطورية الفارسية الساسانية بقيادة رستم (أكثر من ١٠٠ ألف مع الفيلة المدربة). استمرت المعركة أياماً عصيبة حتى قتل القعقاع قائد الفرس رستم وانهارت صفوفهم.',
    lesson: 'عزة الإيمان كما لخصها ربعي بن عامر: «الله ابتعثنا لنخرج من شاء من عبادة العباد إلى عبادة رب العباد».',
    significance: 'سقوط عاصمة الفرس (المدائن) وفتح أبواب العراق وفارس أمام النور الإسلامي.',
  },
  // 13. فتح بيت المقدس
  {
    id: 'quds_fath',
    category: 'rashidun',
    categoryLabel: 'عهد الراشدين',
    hijriDate: 'ربيع الأول ١٦ هـ',
    gregorianDate: '٦٣٧ م',
    title: 'فتح بيت المقدس والعهدة العمرية',
    commander: 'أمير المؤمنين عمر بن الخطاب وأبو عبيدة',
    era: 'عهد الخليفة عمر بن الخطاب رضي الله عنه',
    story: 'حاصر المسلمون القدس، فاشترط بطريركها صفرونيوس تسليم مفاتيح المدينة لأمير المؤمنين شخصياً. قدم عمر راكباً دابته يتناوب عليها مع غلامه، وكتب لأهلها «العهدة العمرية» الخالدة التي ضمنت أمان أنفسهم وأموالهم وكنائسهم بحرية وعدل غير مسبوق في التاريخ.',
    lesson: 'العدالة الإسلامية والتسامح الإنساني الرفيع، ومكانة القدس ومسراها في قلب الأمة.',
    significance: 'استلام المسلمين للقدس الشريف والمسجد الأقصى سلماً ورعاية مقدساته.',
  },
  // 14. نهاوند
  {
    id: 'nahawand',
    category: 'rashidun',
    categoryLabel: 'عهد الراشدين',
    hijriDate: 'محرم ٢١ هـ',
    gregorianDate: '٦٤٢ م',
    title: 'معركة نهاوند (فتح الفتوح)',
    commander: 'النعمان بن مقرن المزني رضي الله عنه',
    era: 'عهد الخليفة عمر بن الخطاب رضي الله عنه',
    story: 'حشد الفرس آخر جيوشهم الجرارة (١٥٠ ألف مقاتل) في نهاوند الجبلية. استبسل المسلمون (٣٠ ألفاً)، واستشهد القائد النعمان بن مقرن فكتم أخوه خبر استشهاده حتى تم النصر الساحق وتحطمت الإمبراطورية الساسانية نهائياً.',
    lesson: 'الثبات حتى الشهادة، وحفظ الروح المعنوية للجيش في أحلك اللحظات.',
    significance: 'سُميت «فتح الفتوح» لأنه لم تقم للفرس بعدها قائمة حتى اليوم.',
  },
  // 15. فتح مصر
  {
    id: 'egypt_fath',
    category: 'rashidun',
    categoryLabel: 'عهد الراشدين',
    hijriDate: 'محرم ٢٠ هـ',
    gregorianDate: '٦٤١ م',
    title: 'فتح مصر وتأسيس مدينة الفسطاط',
    commander: 'عمرو بن العاص والزبير بن العوام',
    era: 'عهد الخليفة عمر بن الخطاب رضي الله عنه',
    story: 'توجه عمرو بن العاص بجيش لإنقاذ أهل مصر من بطش واضطهاد الرومان البيزنطيين. حاصر حصن بابليون العظيم، وفتح الإسكندرية، وأعاد بطريرك الأقباط بنيامين إلى كرسيه بعد سنوات من الملاحقة الرومانية، وأسس الفسطاط وجامعه الشهير.',
    lesson: 'الحرية الدينية والرحمة بالرعايا، وتحقيق وصية رسول الله ﷺ: «استوصوا بأهل مصر خيراً».',
    significance: 'انضمام كنانة الله في أرضه لحصن الإسلام وانطلاق الفتوحات غرباً.',
  },
  // 16. ذات الصواري
  {
    id: 'sawari',
    category: 'rashidun',
    categoryLabel: 'عهد الراشدين',
    hijriDate: '٣٤ هـ',
    gregorianDate: '٦٥٥ م',
    title: 'معركة ذات الصواري (أول أسطول بحري)',
    commander: 'عبد الله بن سعد بن أبي السرح',
    era: 'عهد الخليفة عثمان بن عفان رضي الله عنه',
    story: 'أول معركة بحرية كبرى خاضها المسلمون في البحر الأبيض المتوسط. التقى ٢٠٠ سفينة إسلامية مع ٥٠٠ سفينة رومية يقودها الإمبراطور قسطنطين الثاني. ربط المسلمون سفنهم ببعضها فقاتلوا كأنهم على أرض يابسة، وانتصروا نصراً ساحقاً كسر شوكة الروم البحرية.',
    lesson: 'مواكبة التطور التقني والعسكري وبناء أسطول حديث بعد أن كان العرب أمة برية.',
    significance: 'سيادة المسلمين على البحر المتوسط وفتح جزيرتي قبرص ورودس.',
  },
  // 17. حطين
  {
    id: 'hattin',
    category: 'major_battles',
    categoryLabel: 'معارك فاصلة وفتوحات',
    hijriDate: '٢٤ ربيع الثاني ٥٨٣ هـ',
    gregorianDate: '١١٨٧ م',
    title: 'معركة حطين وتحرير بيت المقدس',
    commander: 'السلطان الناصر صلاح الدين الأيوبي',
    era: 'الدولة الأيوبية',
    story: 'بعد عقود من الاحتلال الصليبي، استطاع صلاح الدين توحيد مصر والشام واستدراج جيش الصليبيين إلى هضبة حطين في حرارة الصيف الشديدة مع قطع المياه عنهم. أطبق عليهم المسلمون ودمروا جيشهم وأسروا كبار ملوكهم، ثم دخل القدس فاتحاً متسامحاً مطهراً للمسجد الأقصى.',
    lesson: 'وحدة الأمة الإسلامية هي المفتاح الأوحد لتحرير مقدساتها ومواجهة الغزاة.',
    significance: 'استرداد القدس وإنهاء أسطورة الممالك الصليبية في بلاد الشام.',
  },
  // 18. عين جالوت
  {
    id: 'ain_jalut',
    category: 'major_battles',
    categoryLabel: 'معارك فاصلة وفتوحات',
    hijriDate: '٢٥ رمضان ٦٥٨ هـ',
    gregorianDate: '١٢٦٠ م',
    title: 'معركة عين جالوت وكسر زحف المغول',
    commander: 'السلطان سيف الدين قطز والظاهر بيبرس',
    era: 'دولة المماليك',
    story: 'بعد سقوط بغداد وسحق العالم الإسلامي على يد التتار، وقف قطز في مصر وقال كلمته الخالدة: «من للإسلام إن لم نكن نحن؟!». التقى الجيشان عند عين جالوت بفلسطين، وحين اضطربت الصفوف ألقى خوذته وصرخ: «وا إسلاماه!» فقلب الموازين وسحق التتار لأول مرة في تاريخهم.',
    lesson: 'الشجاعة الفردية للقيادة وإحياء روح الجهاد كفيلة بإنقاذ الأمة في أحلك ساعاتها.',
    significance: 'إنقاذ مصر وبلاد الشام والحضارة الإسلامية والإنسانية من التدمير والاندثار.',
  },
  // 19. فتح القسطنطينية
  {
    id: 'constantinople',
    category: 'major_battles',
    categoryLabel: 'معارك فاصلة وفتوحات',
    hijriDate: '٢٠ جمادى الأولى ٨٥٧ هـ',
    gregorianDate: '١٤٥٣ م',
    title: 'فتح القسطنطينية وتحقيق البشرى النبوية',
    commander: 'السلطان محمد الفاتح (عمره ٢١ عاماً)',
    era: 'الدولة العثمانية',
    story: 'استعصت القسطنطينية على المسلمين لأكثر من ٨ قرون. جهز الشاب محمد الفاتح أحدث المدافع وسفن نقلت براً على جذوع الأشجار خلف أسوار القرن الذهبي في عبقرية تاريخية فريدة، ففُتحت المدينة وتحققت نبوءة النبي ﷺ: «لتفتحن القسطنطينية فلنعم الأمير أميرها ولنعم الجيش ذلك الجيش».',
    lesson: 'الجمع بين العلم والابتكار العسكري والتقوى وحسن التربية الإيمانية للشباب.',
    significance: 'نهاية الإمبراطورية البيزنطية وبداية عصر جديد في تاريخ العالم.',
  },
  // 20. ملاذكرد
  {
    id: 'malazgirt',
    category: 'major_battles',
    categoryLabel: 'معارك فاصلة وفتوحات',
    hijriDate: 'ذو القعدة ٤٦٣ هـ',
    gregorianDate: '١٠٧١ م',
    title: 'معركة ملاذكرد وفتح أبواب الأناضول',
    commander: 'السلطان السلجوقي ألب أرسلان',
    era: 'الدولة السلجوقية',
    story: 'واجه ألب أرسلان بجيشه (١٥ ألفاً) الإمبراطور البيزنطي رومانوس الرابع (أكثر من ٦٠ ألفاً). خطب في جنوده وهو يرتدي كفناً أبيض يوم الجمعة وقت صلاة المسلمين، وهزمهم وأسر الإمبراطور للمرة الأولى في تاريخ الروم، وفُتحت أبواب الأناضول للإسلام.',
    lesson: 'التضرع الصادق في أوقات الصلاة والنزول في كفن التضحية يمنح المقاتل عزيمة لا تقهر.',
    significance: 'تغيير الخارطة الديموغرافية والسياسية لآسيا الصغرى للأبد.',
  },
];

export const IslamicHistoryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<HistoryCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<HistoricalStation | null>(null);

  const filteredStations = useMemo(() => {
    return HISTORICAL_STATIONS.filter((station) => {
      const matchesCategory =
        selectedCategory === 'all' || station.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        station.title.includes(searchQuery) ||
        station.story.includes(searchQuery) ||
        station.commander.includes(searchQuery) ||
        station.hijriDate.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#fcfbf7] dark:bg-[#0c0c0c] text-stone-900 dark:text-stone-100 select-none animate-in fade-in duration-200"
      dir="rtl"
    >
      {/* 1. Full Mobile Screen Top Navigation Bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#faf8f5]/95 dark:bg-[#121212]/95 backdrop-blur-md border-b border-[#d4af37]/25 shadow-xs">
        <div className="flex items-center gap-3">
          <ScreenBackButton
            onClick={selectedStation ? () => setSelectedStation(null) : onClose}
            ariaLabel="رجوع"
          />

          <div>
            <h2 className="text-base sm:text-lg font-black text-stone-900 dark:text-[#f5e6b8] flex items-center gap-1.5">
              <span>محطات إسلامية وغزوات خالدة</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-[#facc15] font-bold">
                {HISTORICAL_STATIONS.length} محطة
              </span>
            </h2>
            <p className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400">
              سجل موثوق للغزوات والفتوحات والعبر الإيمانية عبر التاريخ
            </p>
          </div>
        </div>
      </header>

      {/* 2. Detailed View if a station is selected */}
      {selectedStation ? (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-2xl mx-auto w-full space-y-5 animate-in slide-in-from-bottom-3 duration-200">
          <button
            onClick={() => setSelectedStation(null)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-[#facc15] hover:underline"
          >
            <ChevronRight className="w-4 h-4" />
            <span>العودة لجميع المحطات التاريخية</span>
          </button>

          {/* Banner Card */}
          <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#1c1811] via-[#12110e] to-[#0a0a0a] border-2 border-[#d4af37]/40 text-white shadow-xl space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#facc15] font-bold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{selectedStation.hijriDate}</span>
                {selectedStation.gregorianDate && (
                  <span className="opacity-70">({selectedStation.gregorianDate})</span>
                )}
              </span>

              <span className="text-stone-300 font-semibold bg-white/10 px-2.5 py-0.5 rounded-lg">
                {selectedStation.era}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-[#fef08a] leading-tight">
              {selectedStation.title}
            </h1>

            <div className="flex items-center gap-2 text-xs text-stone-300 pt-1">
              <Users className="w-4 h-4 text-[#d4af37]" />
              <span className="font-bold text-amber-200">القيادة:</span>
              <span>{selectedStation.commander}</span>
            </div>
          </div>

          {/* Story Content */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#141414] border border-stone-200 dark:border-[#d4af37]/25 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-sm font-black text-stone-900 dark:text-[#facc15]">
              <BookOpen className="w-4 h-4 text-[#d4af37]" />
              <span>وقائع المعركة والمحطة التاريخية:</span>
            </div>
            <p className="text-sm sm:text-base text-stone-700 dark:text-stone-200 leading-relaxed font-medium">
              {selectedStation.story}
            </p>
          </div>

          {/* Spiritual Lesson */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 to-[#d4af37]/5 border-2 border-[#d4af37]/35 space-y-2">
            <div className="flex items-center gap-2 text-sm font-black text-amber-800 dark:text-[#facc15]">
              <Star className="w-4 h-4 text-[#d4af37] fill-current" />
              <span>العبرة والدلالة الإيمانية الخالدة:</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-bold">
              {selectedStation.lesson}
            </p>
          </div>

          {/* Significance */}
          <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-900 text-xs text-stone-600 dark:text-stone-400 border border-stone-200/80 dark:border-stone-800">
            <span className="font-bold text-stone-900 dark:text-stone-200">الأثر في تاريخ الأمة: </span>
            {selectedStation.significance}
          </div>
        </div>
      ) : (
        /* 3. Main List View (Full Screen) */
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 max-w-2xl mx-auto w-full space-y-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن غزوة، معركة، أو قائد إسلامي..."
              className="w-full py-2.5 pr-10 pl-4 rounded-2xl bg-white dark:bg-[#141414] border border-stone-200 dark:border-[#d4af37]/30 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-hidden focus:border-[#d4af37] shadow-xs"
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'prophetic', label: 'الغزوات النبوية' },
              { id: 'rashidun', label: 'عهد الراشدين' },
              { id: 'major_battles', label: 'معارك فاصلة وفتوحات' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as HistoryCategory)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition active:scale-95 ${
                  selectedCategory === tab.id
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-stone-950 shadow-xs'
                    : 'bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Stations List */}
          <div className="space-y-3 pb-8">
            {filteredStations.map((station) => (
              <div
                key={station.id}
                onClick={() => setSelectedStation(station)}
                className="group p-4 rounded-3xl bg-white dark:bg-[#141414] border border-stone-200 dark:border-[#d4af37]/25 hover:border-[#d4af37] shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-[0.99] space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-[#facc15] border border-[#d4af37]/30 font-bold flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3 h-3" />
                    <span>{station.hijriDate}</span>
                  </span>

                  <span className="text-[11px] font-semibold text-stone-400">
                    {station.era}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm sm:text-base font-black text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-[#fef08a] transition-colors">
                    {station.title}
                  </h3>
                  <ChevronLeft className="w-5 h-5 text-stone-400 group-hover:text-[#d4af37] transition-transform group-hover:-translate-x-1 shrink-0" />
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-2">
                  {station.story}
                </p>

                <div className="flex items-center justify-between text-[11px] pt-1 text-stone-500 dark:text-stone-400 border-t border-stone-100 dark:border-stone-800/80">
                  <span className="truncate max-w-[200px]">القيادة: {station.commander}</span>
                  <span className="text-amber-700 dark:text-[#facc15] font-bold">عرض التفاصيل ←</span>
                </div>
              </div>
            ))}

            {filteredStations.length === 0 && (
              <div className="text-center py-12 text-stone-400 text-xs">
                لا توجد نتائج مطابقة لبحثك
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
