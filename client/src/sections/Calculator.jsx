import { useMemo, useState } from 'react';
import { Reveal, fmt } from '../lib.jsx';

const END_AGE = 30;

function grow(monthly, annualPct, years) {
  const r = annualPct / 100 / 12;
  const out = [];
  for (let y = 1; y <= years; y++) {
    const n = y * 12;
    const total = r === 0 ? monthly * n : monthly * ((Math.pow(1 + r, n) - 1) / r);
    out.push({ saved: monthly * n, total });
  }
  return out;
}

function Slider({ id, label, value, min, max, step, onChange, shown }) {
  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-lg font-bold">
          {label}
        </label>
        <output htmlFor={id} className="text-2xl font-extrabold tabular-nums">
          {shown}
        </output>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
    </div>
  );
}

export default function Calculator() {
  const [monthly, setMonthly] = useState(300000);
  const [age, setAge] = useState(15);
  const [rate, setRate] = useState(14);

  const years = END_AGE - age;
  const series = useMemo(() => grow(monthly, rate, years), [monthly, rate, years]);
  const last = series[series.length - 1];
  const late = useMemo(() => grow(monthly, rate, END_AGE - 25), [monthly, rate]);
  const lateLast = late[late.length - 1];
  const gain = last.total - last.saved;
  const max = last.total;

  const W = 720;
  const H = 280;
  const gap = 4;
  const bw = (W - gap * (series.length - 1)) / series.length;

  return (
    <section id="hisoblagich" className="section bg-mist text-deep" aria-labelledby="calc-h">
      <div className="wrap">
        <Reveal as="h2" id="calc-h" className="h-lg max-w-5xl">
          Erta boshlash — eng katta ustunlik
        </Reveal>
        <Reveal as="p" delay={80} className="mt-8 max-w-2xl text-xl">
          Oyiga bir xil summa, bir xil foiz. Faqat boshlash yoshi boshqacha. Slayderlarni suring va farqni o‘zingiz ko‘ring.
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="space-y-10 lg:col-span-5">
            <Slider id="m" label="Oyiga jamg‘arma" value={monthly} min={50000} max={2000000} step={50000} onChange={setMonthly} shown={fmt(monthly)} />
            <Slider id="a" label="Boshlash yoshi" value={age} min={13} max={20} step={1} onChange={setAge} shown={`${age} yosh`} />
            <Slider id="r" label="Yillik foiz (taxminiy)" value={rate} min={0} max={25} step={1} onChange={setRate} shown={`${rate}%`} />
            <p className="text-base">
              Foiz kafolatlangan emas — uni siz sozlaysiz. Haqiqiy stavkani bankning rasmiy shartnomasidan tekshiring. Natija nominal
              summa: inflyatsiya uning haqiqiy qiymatini kamaytiradi.
            </p>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-7">
            <p className="text-lg font-bold">{END_AGE} yoshga kelib</p>
            <p className="mt-2 text-[clamp(2.2rem,4.6vw,4.6rem)] font-extrabold leading-none tracking-tight tabular-nums" aria-live="polite">
              {fmt(last.total)}
            </p>
            <p className="mt-5 text-lg">
              Siz solgan: <b className="tabular-nums">{fmt(last.saved)}</b>. Foizdan o‘sgan: <b className="tabular-nums">{fmt(gain)}</b>.
            </p>

            <svg viewBox={`0 0 ${W} ${H + 28}`} className="mt-10 w-full" role="img" aria-label={`${age} yoshdan ${END_AGE} yoshgacha yillar bo‘yicha o‘sish diagrammasi`}>
              {series.map((s, i) => {
                const x = i * (bw + gap);
                const hTot = (s.total / max) * H;
                const hSaved = (s.saved / max) * H;
                return (
                  <g key={i}>
                    <rect x={x} y={H - hTot} width={bw} height={hTot} fill="#F5B72E" style={{ transition: 'all .35s ease' }} />
                    <rect x={x} y={H - hSaved} width={bw} height={hSaved} fill="#0C4A52" style={{ transition: 'all .35s ease' }} />
                  </g>
                );
              })}
              <text x="0" y={H + 22} fontSize="15" fontWeight="700" fill="#08262B">
                {age + 1} yosh
              </text>
              <text x={W} y={H + 22} fontSize="15" fontWeight="700" textAnchor="end" fill="#08262B">
                {END_AGE} yosh
              </text>
            </svg>
            <p className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-base font-medium">
              <span className="inline-flex items-center gap-2">
                <i className="inline-block size-4 bg-teal" /> Siz solgan
              </span>
              <span className="inline-flex items-center gap-2">
                <i className="inline-block size-4 bg-gold" /> Foizdan o‘sgan
              </span>
            </p>

            <div className="mt-10 bg-deep p-8 text-paper md:p-10">
              <p className="text-xl font-bold">Agar 25 yoshda boshlasangiz</p>
              <p className="mt-2 text-3xl font-extrabold tabular-nums md:text-4xl">{fmt(lateLast.total)}</p>
              <p className="mt-3 text-lg">
                Erta boshlash{' '}
                <b className="text-gold tabular-nums">{fmt(Math.max(0, last.total - lateLast.total))}</b> ko‘proq beradi.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
