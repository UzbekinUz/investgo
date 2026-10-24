import { useState } from 'react';
import { Reveal } from '../lib.jsx';

const ideas = ['Inflyatsiya nima?', 'Murakkab foiz qanday ishlaydi?', 'Aksiya va obligatsiya farqi', 'Qaysi aksiyani sotib olay?'];

export default function Ask() {
  const [q, setQ] = useState('');
  const [state, setState] = useState({ status: 'idle' });

  async function submit(text) {
    const question = (text ?? q).trim();
    if (question.length < 3) return;
    setQ(question);
    setState({ status: 'loading' });
    try {
      const r = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: question }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message);
      setState({ status: 'done', ...j });
    } catch (e) {
      setState({ status: 'error', message: e.message || 'Xatolik' });
    }
  }

  return (
    <section id="yordamchi" className="section bg-paper text-deep" aria-labelledby="ask-h">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Reveal as="h2" id="ask-h" className="h-lg">
            Manbasiz javob bermaymiz
          </Reveal>
          <Reveal as="p" delay={80} className="mt-8 text-xl">
            Sun’iy intellekt adashishi mumkin. Shuning uchun yordamchi faqat tekshirilgan rasmiy ma’lumotdan javob beradi va har
            javobda manbani ko‘rsatadi. Manba topilmasa, “bilmayman” deydi.
          </Reveal>
          <Reveal delay={140} className="mt-8 flex flex-wrap gap-3">
            {ideas.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => submit(t)}
                className="bg-mist px-4 py-3 text-base font-medium transition-colors hover:bg-gold"
              >
                {t}
              </button>
            ))}
          </Reveal>
        </div>

        <Reveal delay={100} className="lg:col-span-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="q" className="sr-only">
              Savolingiz
            </label>
            <input
              id="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Masalan: inflyatsiya nima?"
              className="min-h-14 flex-1 bg-mist px-5 text-lg placeholder:text-deep/60"
              maxLength={300}
            />
            <button className="btn !bg-deep !text-paper hover:!bg-teal" type="submit">
              So‘rash
            </button>
          </form>

          <div className="mt-6 min-h-64 bg-deep p-8 text-paper md:p-10" aria-live="polite">
            {state.status === 'idle' && <p className="text-xl">Savol bering yoki yuqoridagi namunalardan birini tanlang.</p>}
            {state.status === 'loading' && <p className="text-xl">Manbalar tekshirilmoqda…</p>}
            {state.status === 'error' && <p className="text-xl">{state.message}</p>}
            {state.status === 'done' && state.found && (
              <>
                <h3 className="text-3xl">{state.title}</h3>
                <p className="mt-5 text-xl">{state.answer}</p>
                <p className="mt-8 text-base font-bold">Manbalar</p>
                <ul className="mt-2 space-y-1">
                  {state.sources.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} target="_blank" rel="noreferrer" className="font-medium text-gold underline underline-offset-4">
                        {s.name} · {s.url.replace('https://', '')}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {state.status === 'done' && !state.found && <p className="text-xl">{state.message}</p>}
          </div>
          <p className="mt-4 text-base">
            InvestGo hech kimga “nimani sotib oling” demaydi. U tushuntiradi, qaror esa har doim sizniki.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
