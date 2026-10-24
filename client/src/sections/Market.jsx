import { Reveal, useApi, fmt } from '../lib.jsx';
import { CandleBg } from '../components.jsx';

export default function Market() {
  const { data, error, loading } = useApi('/api/rates');
  const rates = data?.rates || [];
  const usd = rates.find((r) => r.code === 'USD');
  const rest = rates.filter((r) => r.code !== 'USD');
  const date = rates[0]?.date;

  return (
    <section id="bozor" className="section relative overflow-hidden bg-deep" aria-labelledby="market-h">
      <CandleBg opacity={0.14} seed={11} speed={0.12} />
      <div className="wrap relative z-10">
        <Reveal as="h2" id="market-h" className="h-lg max-w-5xl">
          Bozor bugun, rasmiy manbadan
        </Reveal>
        <Reveal as="p" delay={80} className="mt-8 max-w-2xl text-xl">
          Bepul tarifda har kuni Markaziy bank e’lon qilgan kurslar. O‘ylab topilgan raqam yo‘q: manba va sana har doim ko‘rsatiladi.
        </Reveal>

        {loading && <p className="mt-16 text-xl">Yuklanmoqda…</p>}
        {error && (
          <p className="mt-16 max-w-xl bg-teal p-8 text-xl" role="alert">
            {error}. Taxminiy son ko‘rsatmaymiz, iltimos, keyinroq urinib ko‘ring.
          </p>
        )}

        {usd && (
          <div className="mt-16 grid gap-6 lg:grid-cols-12">
            <Reveal className="bg-gold p-8 text-deep md:p-12 lg:col-span-6">
              <p className="text-xl font-bold">1 AQSh dollari</p>
              <p className="mt-4 text-[clamp(3rem,7vw,6.5rem)] font-extrabold leading-none tracking-tight tabular-nums">{fmt(usd.rate)}</p>
              <p className="mt-6 text-lg font-medium">
                Kecha bilan farq: <b className="tabular-nums">{usd.diff > 0 ? '+' : ''}{usd.diff.toLocaleString('ru-RU')}</b> so‘m
              </p>
            </Reveal>
            <div className="grid gap-3 sm:grid-cols-2 lg:col-span-6">
              {rest.map((r, i) => (
                <Reveal key={r.code} delay={i * 70} className="flex flex-col justify-between bg-teal p-6">
                  <p className="text-lg font-bold">
                    {r.nominal > 1 ? `${r.nominal} ` : '1 '}
                    {r.code}
                  </p>
                  <p className="mt-6 text-3xl font-extrabold tabular-nums">{fmt(r.rate)}</p>
                  <p className={`mt-2 text-base font-medium tabular-nums ${r.diff > 0 ? 'text-gold' : ''}`}>
                    {r.diff > 0 ? '▲ +' : r.diff < 0 ? '▼ ' : ''}
                    {r.diff.toLocaleString('ru-RU')}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {usd && (
          <p className="mt-8 text-base">
            Manba:{' '}
            <a href="https://cbu.uz" target="_blank" rel="noreferrer" className="font-bold underline decoration-gold decoration-2 underline-offset-4">
              O‘zbekiston Respublikasi Markaziy banki, cbu.uz
            </a>
            {date ? `, ${date}` : ''}
            {data?.stale ? ' (oxirgi saqlangan ma’lumot)' : ''}
          </p>
        )}
      </div>
    </section>
  );
}
