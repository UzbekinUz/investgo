// Namunaviy kontent. MongoDB ulanmagan bo'lsa ham sayt shu ma'lumotlar bilan ishlaydi.
// Narxlar va dastur mazmuni — namuna, ishga tushirishdan oldin tasdiqlang.

export const plans = [
  {
    key: 'free',
    name: 'Bepul',
    price: 0,
    tagline: 'Bozorni ko‘ring va asoslarni o‘rganing',
    features: [
      'Markaziy bank kurslari — har kuni yangilanadi',
      'Manbali yordamchi: faqat rasmiy ma’lumotdan javob beradi',
      'Foiz hisoblagichi va asosiy lug‘at',
      'Virtual pul bilan mashq maydoni',
    ],
  },
  {
    key: 'plus',
    name: 'Plus',
    price: 79000,
    tagline: 'Nima uchun o‘sdi yoki tushdi — batafsil',
    features: [
      'Har bir harakat uchun sabablar tahlili, manbalari bilan',
      'To‘liq video kurs: noldan boshlab, tartib bilan',
      'Mashq topshiriqlari va natija bo‘yicha fikr-mulohaza',
      'Oylik bozor sharhi',
    ],
  },
  {
    key: 'premium',
    name: 'Premium',
    price: 249000,
    tagline: 'Goldman Sachs hamkorligida jonli o‘rganing',
    features: [
      'Goldman Sachs bilan hamkorlikda: onlayn jonli darslar',
      'A dan Z gacha yozib olingan videodarslar: qanday, qayerga va qachon investitsiya qilishni baholash usuli',
      'Kichik guruhlar: savol berish va uy vazifasini tekshirish',
      'Haqiqiy bozor misollari tahlili: nega shu qaror, qanday xavf',
    ],
  },
];

export const modules = [
  { slug: 'pul-nima', title: 'Pul nima va u qayerga ketadi', lessons: 6, tier: 'free' },
  { slug: 'byudjet', title: 'Byudjet va jamg‘arma odati', lessons: 8, tier: 'free' },
  { slug: 'foiz', title: 'Foiz, murakkab foiz va inflyatsiya', lessons: 7, tier: 'free' },
  { slug: 'bank', title: 'Bank, omonat va karta xavfsizligi', lessons: 8, tier: 'plus' },
  { slug: 'bozor', title: 'Bozorni o‘qish: kurs, aksiya, obligatsiya', lessons: 12, tier: 'plus' },
  { slug: 'risk', title: 'Xavf va diversifikatsiya', lessons: 8, tier: 'plus' },
  { slug: 'portfel', title: 'Virtual portfel yig‘ish', lessons: 10, tier: 'premium' },
  { slug: 'mutaxassis', title: 'Ustozlar bilan jonli amaliyot', lessons: 12, tier: 'premium' },
];

// Yordamchi faqat shu manbali yozuvlardan javob beradi. Manba topilmasa — javob yo'q.
export const knowledge = [
  {
    id: 'inflyatsiya',
    keys: ['inflyatsiya', 'narx', 'qimmatlashish', 'inflation'],
    title: 'Inflyatsiya',
    answer:
      'Inflyatsiya — tovar va xizmatlar narxining vaqt o‘tishi bilan umumiy oshishi. Narxlar oshganda bir xil summaga avvalgidan kamroq narsa sotib olinadi, shuning uchun jamg‘arma o‘sishi inflyatsiyadan past bo‘lsa, haqiqiy qiymat kamayadi.',
    sources: [
      { name: 'O‘zbekiston Respublikasi Markaziy banki', url: 'https://cbu.uz' },
      { name: 'Statistika agentligi', url: 'https://stat.uz' },
    ],
  },
  {
    id: 'omonat',
    keys: ['omonat', 'depozit', 'bank', 'foiz stavka', 'deposit'],
    title: 'Bank omonati',
    answer:
      'Omonat — pulni bankka belgilangan muddatga va foiz evaziga topshirish. Stavka va shartlar bankka qarab farq qiladi; qaror qilishdan oldin bankning rasmiy shartnomasini va Markaziy bank ma’lumotlarini tekshiring.',
    sources: [{ name: 'Markaziy bank', url: 'https://cbu.uz' }],
  },
  {
    id: 'murakkab-foiz',
    keys: ['murakkab', 'foiz', 'compound', 'o‘sish', 'osish'],
    title: 'Murakkab foiz',
    answer:
      'Murakkab foizda daromad asosiy summaga qo‘shiladi va keyingi davrda daromad butun yig‘ilgan summadan hisoblanadi. Shu sababli muddat qancha uzun bo‘lsa, o‘sish shuncha tez bo‘ladi — erta boshlash muhim. Bosh sahifadagi hisoblagich buni ko‘rsatadi.',
    sources: [{ name: 'Moliya vazirligi', url: 'https://mf.uz' }],
  },
  {
    id: 'kurs',
    keys: ['kurs', 'dollar', 'valyuta', 'usd', 'evro', 'ayirboshlash'],
    title: 'Valyuta kursi',
    answer:
      'Valyuta kursi — bir valyutaning boshqasiga nisbatan narxi. O‘zbekistonda rasmiy kurslarni Markaziy bank e’lon qiladi; “Bozor bugun” bo‘limidagi kurslar shu manbadan olinadi.',
    sources: [{ name: 'Markaziy bank — rasmiy kurslar', url: 'https://cbu.uz' }],
  },
  {
    id: 'aksiya',
    keys: ['aksiya', 'aksiyalar', 'birja', 'stock', 'share'],
    title: 'Aksiya',
    answer:
      'Aksiya — kompaniyaning bir ulushi. Aksiya egasi kompaniya foydasi va qiymati o‘zgarishida ishtirok etadi, ya’ni uning narxi ham oshishi, ham tushishi mumkin. Birjada savdo qilinadigan qimmatli qog‘ozlar haqidagi rasmiy ma’lumot birja saytida e’lon qilinadi.',
    sources: [{ name: 'Toshkent respublika fond birjasi', url: 'https://uzse.uz' }],
  },
  {
    id: 'obligatsiya',
    keys: ['obligatsiya', 'bond', 'qarz'],
    title: 'Obligatsiya',
    answer:
      'Obligatsiya — qarz qog‘ozi: uni sotib olgan odam chiqaruvchiga pul qarz beradi, chiqaruvchi esa belgilangan muddatda qaytarishni va shartlashilgan foizni to‘lashni va’da qiladi. Har bir chiqarilishning shartlari alohida bo‘ladi.',
    sources: [
      { name: 'Toshkent respublika fond birjasi', url: 'https://uzse.uz' },
      { name: 'Moliya vazirligi', url: 'https://mf.uz' },
    ],
  },
  {
    id: 'risk',
    keys: ['xavf', 'risk', 'diversifikatsiya', 'yo‘qotish', 'yoqotish'],
    title: 'Xavf va diversifikatsiya',
    answer:
      'Daromad imkoniyati bo‘lgan joyda yo‘qotish xavfi ham bo‘ladi. Diversifikatsiya — mablag‘ni bir nechta turli turdagi aktivga bo‘lish: bittasi tushganda boshqalari ta’sirni yumshatishi mumkin. Bu xavfni yo‘qotmaydi, faqat kamaytiradi.',
    sources: [{ name: 'Moliya vazirligi', url: 'https://mf.uz' }],
  },
];

export const sampleRates = null; // Markaziy bank javob bermasa, sayt aniq xabar ko'rsatadi, taxminiy son o'ylab topmaydi.
