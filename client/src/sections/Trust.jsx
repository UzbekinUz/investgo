import { Reveal } from '../lib.jsx';

const rules = [
  ['Qayerga va qachon — usulni o‘rgatamiz', 'Ustozlar qayerga va qachon investitsiya qilishni qanday baholashni o‘rgatadi: tahlil, xavf, muddat. Shaxsga “buni sotib oling” deb aytilmaydi, chunki hech kim sizning vaziyatingizni to‘liq bilmaydi.'],
  ['Haqiqiy pul ishtirok etmaydi', 'Mashq maydonida faqat virtual pul. Platforma o‘smirning pulini saqlamaydi ham, birjaga ham ulamaydi.'],
  ['Ustozlar mahsulot sotmaydi', 'Jonli dars o‘tkazuvchilar o‘z ish beruvchisining mahsulotini targ‘ib qila olmaydi. Ular o‘z tajribasi va usulini o‘rgatadi.'],
];

export default function Trust() {
  return (
    <section className="section bg-gold text-deep" aria-labelledby="trust-h">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal as="h2" id="trust-h" className="h-lg self-start lg:col-span-5">
          Biz nima qilmaymiz
        </Reveal>
        <div className="space-y-10 lg:col-span-7">
          {rules.map(([t, d], i) => (
            <Reveal key={t} delay={i * 80}>
              <h3 className="text-3xl md:text-4xl">{t}</h3>
              <p className="mt-3 max-w-xl text-xl">{d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
