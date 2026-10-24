import { Reveal, useApi } from '../lib.jsx';
import { Spark, UP, DOWN, usd, pct } from '../components.jsx';

const points = [
  ['Onlayn jonli darslar', 'Goldman Sachs bilan hamkorlikda o‘tadigan darslarda savol berasiz, javobni o‘sha zahoti olasiz.'],
  ['Yozib olingan videodarslar', 'Qanday, qayerga va qachon investitsiya qilishni baholashni noldan, tartib bilan o‘rganasiz.'],
  ['Real bozor misollari', 'Har dars haqiqiy aksiya va haqiqiy grafik ustida: nega bunday qaror, qanday xavf.'],
];

export default function Partner() {
  const { data } = useApi('/api/ticker');
  const gs = data?.quotes?.find((q) => q.symbol === 'GS');
  return (
    <section id="hamkor" className="section bg-teal" aria-labelledby="partner-h">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal as="h2" id="partner-h" className="h-lg">
            Goldman Sachs bilan hamkorlikda
          </Reveal>
          <Reveal as="p" delay={80} className="mt-8 max-w-2xl text-xl">
            Goldman Sachs — dunyodagi yirik investitsiya banklaridan biri. Premium tarifdagi darslar shu hamkorlik doirasida tayyorlanadi va o‘tkaziladi.
          </Reveal>
          <ul className="mt-12 space-y-8">
            {points.map(([t, d], i) => (
              <Reveal as="li" key={t} delay={i * 90}>
                <h3 className="text-3xl md:text-4xl">{t}</h3>
                <p className="mt-2 max-w-xl text-lg">{d}</p>
              </Reveal>
            ))}
          </ul>
          <Reveal as="p" delay={100} className="mt-10 max-w-xl text-base">
            Ustozlar ro‘yxati va dars jadvali ishga tushishdan oldin e’lon qilinadi.
          </Reveal>
        </div>

        <Reveal delay={120} className="lg:col-span-5">
          <div className="bg-deep p-8 md:p-10">
            <p className="text-lg font-bold">GS · The Goldman Sachs Group</p>
            {gs ? (
              <>
                <p className="mt-4 text-[clamp(2.6rem,5vw,4.4rem)] font-extrabold leading-none tabular-nums">{usd(gs.price)}</p>
                <p className="mt-3 text-xl font-bold tabular-nums" style={{ color: gs.change >= 0 ? UP : DOWN }}>
                  {gs.change >= 0 ? '▲' : '▼'} {pct(gs.changePct)}
                </p>
                <div className="mt-8 h-40">
                  <Spark data={gs.spark} w={300} h={100} />
                </div>
                <p className="mt-4 text-base">So‘nggi 30 savdo kuni. Manba: Yahoo Finance.</p>
              </>
            ) : (
              <p className="mt-6 text-xl">Narx yuklanmoqda…</p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
