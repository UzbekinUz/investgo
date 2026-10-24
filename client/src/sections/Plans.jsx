import { Reveal, useApi, fmt } from '../lib.jsx';

export function Tiers({ onPick }) {
  const { data, error } = useApi('/api/plans');
  return (
    <section id="tariflar" className="section bg-teal" aria-labelledby="tiers-h">
      <div className="wrap">
        <Reveal as="h2" id="tiers-h" className="h-lg max-w-5xl">
          Uch daraja, bittadan boshlang
        </Reveal>
        <Reveal as="p" delay={80} className="mt-8 max-w-2xl text-xl">
          Bepul tarif bozorni ko‘rsatadi, Plus sababini tushuntiradi, Premium esa soha mutaxassislaridan jonli o‘rgatadi. Narxlar
          namunaviy: ishga tushirishdan oldin tasdiqlanadi.
        </Reveal>
        {error && <p className="mt-12 text-xl">{error}</p>}
        <div className="mt-16 space-y-3">
          {(data || []).map((p, i) => {
            const premium = p.key === 'premium';
            return (
              <Reveal
                key={p.key}
                delay={i * 80}
                className={`grid gap-8 p-8 md:p-12 lg:grid-cols-12 ${premium ? 'bg-paper text-deep' : 'bg-deep'}`}
              >
                <div className="lg:col-span-5">
                  <h3 className="text-5xl md:text-6xl">{p.name}</h3>
                  <p className={`mt-4 text-xl font-bold tabular-nums ${premium ? '' : 'text-gold'}`}>
                    {p.price === 0 ? '0 so‘m' : `${fmt(p.price)} / oy`}
                  </p>
                  <p className="mt-3 max-w-sm text-lg">{p.tagline}</p>
                  <a
                    href="#join"
                    onClick={() => onPick(p.key)}
                    className={`btn mt-8 ${premium ? '!bg-deep !text-paper hover:!bg-teal' : ''}`}
                  >
                    {p.name} uchun yozilish
                  </a>
                </div>
                <ul className="space-y-4 text-lg lg:col-span-7 lg:pt-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-4">
                      <span className={`mt-2.5 size-3 shrink-0 ${premium ? 'bg-teal' : 'bg-gold'}`} aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const tierName = { free: 'Bepul', plus: 'Plus', premium: 'Premium' };

export function Curriculum() {
  const { data, error } = useApi('/api/modules');
  const total = (data || []).reduce((s, m) => s + m.lessons, 0);
  return (
    <section id="dastur" className="section bg-mist text-deep" aria-labelledby="dastur-h">
      <div className="wrap">
        <div>
          <Reveal as="h2" id="dastur-h" className="h-lg max-w-5xl">
            A dan Z gacha dastur
          </Reveal>
          <Reveal as="p" delay={80} className="mt-8 max-w-2xl text-xl">
            Pul nima ekanligidan boshlab o‘z virtual portfelingizni yig‘ishgacha. {total ? `Hozircha ${total} ta dars (namunaviy reja).` : ''}
          </Reveal>
        </div>
        <ol className="mt-16 grid gap-3 md:grid-cols-2">
          {error && <li className="text-xl">{error}</li>}
          {(data || []).map((m, i) => (
            <Reveal as="li" key={m.slug} delay={i * 50} className="flex min-h-48 flex-col justify-between gap-6 bg-paper p-6 transition-colors hover:bg-gold md:p-8">
              <span className="text-2xl font-extrabold tracking-tight md:text-3xl">{m.title}</span>
              <span className="shrink-0 text-lg font-medium">
                {m.lessons} dars · {tierName[m.tier]}
              </span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
