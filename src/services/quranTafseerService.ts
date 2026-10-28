/**
 * Service for fetching and caching Tafseer Al-Muyassar and Quranic Vocabulary
 */

const TAFSEER_CACHE_PREFIX = 'noor_tafseer_muyassar_';

export interface AyahTafseerResult {
  ayahNumber: number;
  tafseerText: string;
  wordMeanings: { word: string; meaning: string }[];
}

// Built-in offline vocabulary dictionary for frequent/notable difficult Quranic words
const QURAN_VOCABULARY_DICT: Record<string, string> = {
  // Al-Fatiha
  'الْحَمْدُ': 'الثناء التام بالجميل على الله تعالى مع حبه وإجلاله',
  'رَبِّ': 'الخالق المالك المدبّر لجميع شؤون خلقه',
  'الْعَالَمِينَ': 'كل ما سوى الله تعالى من أصناف المخلوقات',
  'الصِّرَاطَ': 'الطريق الواضح المستقيم وهو دين الإسلام',
  'الْمَغْضُوبِ': 'الذين عرفوا الحق وعاندوه ولم يعملوا به',
  'الضَّالِّينَ': 'الذين ضلوا عن الحق بجهلهم وتركهم لطلب العلم',
  
  // Al-Baqarah & general common terms
  'رَيْبَ': 'شك وشبهة',
  'هُدًى': 'إرشاد وتوفيق وبيان للحق',
  'لِّلْمُتَّقِينَ': 'الذين يتقون عذاب الله بفعل أوامره واجتناب نواهيه',
  'يُخَادِعُونَ': 'يُظهرون خلاف ما يُبطنون من المكر',
  'مَّرَضٌ': 'شك ونفاق وفساد في الباطن',
  'يَعْمَهُونَ': 'يتحيرون ويترددون في ضلالتهم',
  'صُمٌّ': 'عن سماع الحق سماع قبول وتدبر',
  'بُكْمٌ': 'عن النطق بالحق والإقرار به',
  'عُمْيٌ': 'عن رؤية آيات الله ودلائله',
  'كَصَيِّبٍ': 'كمطر شديد منصبّ من السماء',
  'رَعْدٌ': 'الصوت المصاحب للسحاب',
  'بَرْقٌ': 'الضوء اللامع المنبثق من السحاب',
  'يَخْطَفُ': 'يستلب وينزع بسرعة وشدة',
  'فِرَاشًا': 'بساطاً ممهداً صالحاً للاستقرار والمعاش',
  'أَندَادًا': 'شركاء وأمثالاً تعبدونها مع الله',
  'قُودُهَا': 'ما تُشعل به وتُضرم كالحطب',
  'مُتَشَابِهًا': 'متشابهاً في اللون والشكل ومختلفاً في الطعم واللذة',
  'فَاسْتَغْلَظَ': 'قوي واشتد وتصلّب',
  'سِنَةٌ': 'نُعاس وأول النوم',
  'كُرْسِيُّهُ': 'موضع قدمي الرب سبحانه، ولا يعلم قدره إلا هو',
  'يَؤُودُهُ': 'يُثقله ويعجزه ويكترثه',
  'الْعُرْوَةِ': 'السبب الوثيق المستمسك به، وهو الإيمان',
  'الْوُثْقَىٰ': 'المحكمة التي لا انقطاع لها',
  'انفِصَامَ': 'انقطاع وانفصال',
  'يَمْحَقُ': 'يُذهب بركته ويُهلكه تدريجياً',
  'تَارَةً': 'مرةً واحدة',
  'الْمَنَّ': 'مادة صمغية حلوة تنزل كالعسل',
  'السَّلْوَىٰ': 'طائر السماني اللذيذ الطيب',
  'رِجْزًا': 'عذاباً ورعباً من السماء',
  'فَانبَجَسَتْ': 'فانفجرت وسالت بالماء',
  'بَطَرًا': 'طغياناً وفخراً وجحوداً للنعمة',
  'شِقَاقٍ': 'خلاف وعداوة وتباعد عن الحق',
  'خَبَلًا': 'فساداً واضطراباً',
  'ضِيزَىٰ': 'جائرة ظالمة ناقصة',
  'الْوَسِيلَةَ': 'القربة والطاعة التي توصل لرضوان الله',
  'أَكِنَّةً': 'أغطية وحجب تمنع الفهم',
  'وَقْرًا': 'ثقلاً وصمماً يمنع السماع',
  'مَثْبُورًا': 'هالكاً ملعوناً مطروداً',
  'فَتِيلًا': 'الخيط الرقيق الذي في شق نواة التمر',
  'نَقِيرًا': 'النكتة الصغيرة التي في ظهر نواة التمر',
  'قِطْمِيرٍ': 'القشرة الرقيقة البيضاء المحيطة بنواة التمر',
  'قَسْوَرَةٍ': 'الأسد أو الرماة الصائدون',
  'حَصْحَصَ': 'ظهر وتبين وثبت بعد خفاء',
  'غَيْهَبٍ': 'ظلمة شديدة',
  'عَاهِدُوا': 'أوثقوا العهد والميثاق',
  'أَلْفَيْنَا': 'وجدنا وأدركنا',
  'عَاصِفٍ': 'شديد الهبوب والريح',
  'قَاصِفٍ': 'ريح شديدة تكسر ما مرت به وتُغرق السفن',
  'الْغَبَرَاتِ': 'السواد والكآبة المتربة',
  'تَرَهَّقُهَا': 'تغشاها وتغطيها',
  'سُجِّرَتْ': 'أُوقدت ناراً فالتهبت',
  'عَسْعَسَ': 'أدبر أو أقبل بظلامه',
  'تَنَفَّسَ': 'انبلج ضوؤه وأقبل الصباح',
  'الصَّاخَّةُ': 'صيحة القيامة الشديدة التي تصمّ الآذان',
  'الطَّامَّةُ': 'الداهية العظمى التي تعلو كل داهية وهي القيامة',
  'زُخْرُفَهَا': 'بهجتها وحليها وحسن نباتها',
  'الْفَلَقِ': 'الصبح إذا انفلق وانشق ضياؤه',
  'غَاسِقٍ': 'الليل إذا أظلم ودخل',
  'وَقَبَ': 'دخل ظلامه واشتد سواده',
  'النَّفَّاثَاتِ': 'الساحرات اللاتي ينفثن في عقد السحر',
  'الْوَسْوَاسِ': 'المُلقي للشر والخواطر الرديئة في القلب',
  'الْخَنَّاسِ': 'الذي يتأخر وينقبض إذا ذُكر الله تعالى',
  'الصَّمَدُ': 'السيد الذي كمل في سؤدده وتقصده الخلائق في حوائجها',
  'كَفُوًا': 'مكافئاً ومماثلاً ونظيراً',
  'تَبَّتْ': 'خسرت وهلكت وخابت',
  'حَبْلٌ': 'حبل من ليف مسد شُدّ به خناقها',
  'مَّسَدٍ': 'ليف النخل القوي الخشن',
  'الْكَوْثَرُ': 'الخير الكثير، ونهر عظيم في الجنة أُعطيه النبي ﷺ',
  'شَانِئَكَ': 'مبغضك وشانئ هداك',
  'الْأَبْتَرُ': 'المنقطع أثره وذكره من كل خير',
};

/**
 * Clean arabic word for dictionary lookup (remove tashkeel, prefix waws, etc.)
 */
function cleanWordForLookup(rawWord: string): string {
  return rawWord
    .replace(/[ً-ِّْـ]/g, '') // remove diacritics
    .replace(/^[وفلب]/, '') // remove prefix waws/fas/bas if attached
    .trim();
}

/**
 * Extract notable words from Ayah text that have defined meanings in the dictionary
 */
export function extractWordMeanings(ayahText: string): { word: string; meaning: string }[] {
  const words = ayahText.split(/\s+/);
  const found: { word: string; meaning: string }[] = [];
  const seen = new Set<string>();

  for (const raw of words) {
    const cleaned = cleanWordForLookup(raw);
    for (const [key, meaning] of Object.entries(QURAN_VOCABULARY_DICT)) {
      const cleanKey = cleanWordForLookup(key);
      if (cleanKey === cleaned || cleaned.includes(cleanKey) || cleanKey.includes(cleaned)) {
        if (!seen.has(key) && cleaned.length >= 3) {
          seen.add(key);
          found.push({ word: key, meaning });
        }
      }
    }
  }

  // If none matched from quick dict, extract the most notable lexical root words with general guidance
  if (found.length === 0) {
    const notableTokens = words.filter((w) => w.length >= 4).slice(0, 3);
    for (const token of notableTokens) {
      found.push({
        word: token.replace(/[ً-ِّْ]/g, ''),
        meaning: 'من المفردات القرآنية الجليلة، راجع تفصيلها وسياقها في التفسير الميسر أعلاه',
      });
    }
  }

  return found.slice(0, 4);
}

/**
 * Fetch Tafseer Al-Muyassar for an Ayah with caching and offline fallback
 */
export async function fetchAyahTafseer(ayahNumber: number, ayahText: string): Promise<AyahTafseerResult> {
  const cacheKey = `${TAFSEER_CACHE_PREFIX}${ayahNumber}`;

  // Check cache first
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      return {
        ayahNumber,
        tafseerText: parsed.tafseerText,
        wordMeanings: parsed.wordMeanings || extractWordMeanings(ayahText),
      };
    }
  } catch (e) {
    console.warn('Tafseer cache read error:', e);
  }

  let tafseerText = '';

  try {
    const res = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/ar.muyassar`);
    if (res.ok) {
      const json = await res.json();
      if (json.code === 200 && json.data?.text) {
        tafseerText = json.data.text;
      }
    }
  } catch (err) {
    console.warn('Tafseer API online fetch failed, using offline fallback', err);
  }

  // Fallback if network unavailable or offline
  if (!tafseerText) {
    tafseerText =
      'هذه الآية الكريمة من كلام الله العظيم؛ تتضمن هداية للمؤمنين وتثبيتاً للقلوب، وتوجيهاً لتقوى الله واستشعار عظمته وتدبر معاني كتابه الحكيم.';
  }

  const wordMeanings = extractWordMeanings(ayahText);

  const result: AyahTafseerResult = {
    ayahNumber,
    tafseerText,
    wordMeanings,
  };

  try {
    localStorage.setItem(cacheKey, JSON.stringify(result));
  } catch (e) {
    console.warn('Tafseer cache write error:', e);
  }

  return result;
}

/**
 * Format Ayah with Tafseer and vocabulary for copying or sharing as a stylish card
 */
export function formatAyahShareCard(
  surahName: string,
  ayahNumberInSurah: number,
  ayahText: string,
  tafseerText: string,
  wordMeanings: { word: string; meaning: string }[]
): string {
  let card = `﴿ ${ayahText} ﴾\n[سورة ${surahName} - الآية ${ayahNumberInSurah}]\n\n📖 التفسير الميسر:\n${tafseerText}\n`;

  if (wordMeanings.length > 0) {
    card += `\n🔍 معاني الكلمات:\n`;
    wordMeanings.forEach((m) => {
      card += `• ${m.word}: ${m.meaning}\n`;
    });
  }

  card += `\n— من تطبيق «أثر | رفيق المسلم»`;
  return card;
}
