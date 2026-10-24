import { Coin, Reveal } from '../lib.jsx';
import { CandleBg, Ticker } from '../components.jsx';

const links = [
  ['Grafik', '#grafik'],
  ['Hamkor', '#hamkor'],
  ['Hisoblagich', '#hisoblagich'],
  ['Yordamchi', '#yordamchi'],
  ['Tariflar', '#tariflar'],
  ['Dastur', '#dastur'],
];

export default function Hero() {
  return (
    <header className="relative overflow-hidden bg-teal">
      <CandleBg opacity={0.3} seed={3} speed={0.16} />
      <nav className="wrap relative z-10 flex items-center justify-between py-6" aria-label="Asosiy">
        <a href="#" className="text-3xl font-extrabold tracking-tight">
          InvestGo
        </a>
        <ul className="hidden items-center gap-8 text-base font-medium lg:flex">
          {links.map(([t, h]) => (
            <li key={h}>
              <a href={h} className="transition-opacity hover:opacity-70">
                {t}
              </a>
            </li>
          ))}
        </ul>
        <a href="#join" className="btn !min-h-11 !px-5 text-base">
          Yozilish
        </a>
      </nav>

      <div className="wrap relative z-10 grid items-center gap-10 pb-20 pt-10 md:grid-cols-12 md:pb-32 md:pt-16">
        <div className="md:col-span-7">
          <Reveal as="h1" className="h-xl">
            Pul haqida 15 yoshda o‘rganing
          </Reveal>
          <Reveal as="p" delay={90} className="mt-10 max-w-xl text-xl md:text-2xl">
            InvestGo — o‘zbek o‘smirlari uchun moliyaviy savodxonlik. Bozorni rasmiy manbalar bilan o‘rganing, virtual pul
            bilan mashq qiling.
          </Reveal>
          <Reveal delay={180} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a href="#join" className="btn">
              Kutish ro‘yxatiga yozilish
            </a>
            <a href="#hisoblagich" className="font-bold underline decoration-gold decoration-4 underline-offset-8">
              Hisoblagichni sinab ko‘rish
            </a>
          </Reveal>
          <Reveal as="p" delay={240} className="mt-8 max-w-xl text-lg font-bold text-gold">
            Premium darslar Goldman Sachs bilan hamkorlikda.
          </Reveal>
        </div>
        <Reveal delay={120} className="md:col-span-5">
          <Coin className="coin-drift mx-auto w-[78vw] max-w-[560px] md:mx-0 md:-mr-24 md:w-[44vw] md:max-w-none" />
        </Reveal>
      </div>
      <div className="relative z-10"><Ticker /></div>
    </header>
  );
}
