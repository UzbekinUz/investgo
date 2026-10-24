import { useState } from 'react';
import { Reveal } from '../lib.jsx';

export default function Join({ plan, setPlan }) {
  const [email, setEmail] = useState('');
  const [st, setSt] = useState({ s: 'idle' });

  async function submit(e) {
    e.preventDefault();
    setSt({ s: 'loading' });
    try {
      const r = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plan }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message);
      setSt({ s: 'ok' });
    } catch (err) {
      setSt({ s: 'err', m: err.message || 'Xatolik' });
    }
  }

  const field = 'min-h-14 w-full bg-teal px-5 text-lg text-paper placeholder:text-paper/60';

  return (
    <>
      <section id="join" className="section bg-deep" aria-labelledby="join-h">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Reveal as="h2" id="join-h" className="h-lg">
              Birinchilardan bo‘lib kiring
            </Reveal>
            <Reveal as="p" delay={80} className="mt-8 max-w-lg text-xl">
              Ishga tushganda xabar beramiz. Hozircha faqat email so‘raymiz, boshqa hech narsa yo‘q.
            </Reveal>
          </div>

          <Reveal delay={100} className="lg:col-span-6">
            {st.s === 'ok' ? (
              <div className="bg-gold p-10 text-deep" role="status">
                <p className="text-4xl font-extrabold tracking-tight">Rahmat, yozildingiz.</p>
                <p className="mt-4 text-xl">Platforma tayyor bo‘lganda {email} manziliga xabar yuboramiz.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-6" noValidate>
                <div>
                  <label htmlFor="email" className="mb-2 block text-lg font-bold">
                    Email
                  </label>
                  <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ism@pochta.uz" className={field} />
                </div>
                <div>
                  <label htmlFor="plan" className="mb-2 block text-lg font-bold">
                    Qiziqtirgan tarif
                  </label>
                  <select id="plan" value={plan} onChange={(e) => setPlan(e.target.value)} className={field}>
                    <option value="free">Bepul</option>
                    <option value="plus">Plus</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <button className="btn w-full sm:w-auto" disabled={st.s === 'loading'}>
                  {st.s === 'loading' ? 'Yuborilmoqda…' : 'Yozilish'}
                </button>
                {st.s === 'err' && (
                  <p className="text-lg font-bold text-gold" role="alert">
                    {st.m}
                  </p>
                )}
              </form>
            )}
          </Reveal>
        </div>
      </section>

      <footer className="overflow-hidden bg-teal pb-6 pt-16 md:pt-24">
        <p className="wrap select-none text-[clamp(4rem,20vw,26rem)] font-extrabold leading-[0.8] tracking-[-0.06em] text-gold" aria-hidden="true">
          InvestGo
        </p>
        <div className="wrap mt-8 flex flex-col justify-between gap-3 text-base md:flex-row">
          <p>InvestGo ta’lim platformasi. Moliyaviy maslahat yoki investitsiya tavsiyasi emas.</p>
          <p>Kurs ma’lumoti: Markaziy bank, cbu.uz</p>
        </div>
      </footer>
    </>
  );
}
