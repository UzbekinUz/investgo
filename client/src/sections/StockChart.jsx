import { useMemo, useRef, useState } from 'react';
import { Reveal, useApi } from '../lib.jsx';
import { CandleBg, Spark, UP, DOWN, usd, pct, compact } from '../components.jsx';

const RANGES = [
  ['1mo', '1 oy'],
  ['3mo', '3 oy'],
  ['6mo', '6 oy'],
  ['1y', '1 yil'],
  ['5y', '5 yil'],
];
const W = 1000, PH = 340, VH = 70, PADR = 74, H = PH + VH + 34;
const dFmt = (t) => new Date(t).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });

function Candles({ candles, hover, onHover }) {
  const svg = useRef(null);
  const g = useMemo(() => {
    const lo = Math.min(...candles.map((c) => c.l));
    const hi = Math.max(...candles.map((c) => c.h));
    const pad = (hi - lo) * 0.06;
    const min = lo - pad, max = hi + pad;
    const vmax = Math.max(...candles.map((c) => c.v || 0)) || 1;
    return { min, max, vmax, step: (W - PADR) / candles.length };
  }, [candles]);
  const y = (v) => ((g.max - v) / (g.max - g.min)) * PH;
  const ticks = Array.from({ length: 5 }, (_, i) => g.min + ((g.max - g.min) * (i + 0.5)) / 5);
  const xl = [0, 0.33, 0.66, 0.98].map((p) => candles[Math.floor(p * (candles.length - 1))]);
  const last = candles[candles.length - 1];
  const hc = hover != null ? candles[hover] : null;

  const move = (e) => {
    const r = svg.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    onHover(Math.max(0, Math.min(candles.length - 1, Math.floor(x / g.step))));
  };

  return (
    <svg
      ref={svg}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full touch-pan-y select-none"
      onPointerMove={move}
      onPointerLeave={() => onHover(null)}
      role="img"
      aria-label="Aksiya narxining shamli grafigi"
    >
      {ticks.map((t) => (
        <g key={t}>
          <line x1="0" x2={W - PADR} y1={y(t)} y2={y(t)} stroke="#ffffff" strokeOpacity="0.07" />
          <text x={W - PADR + 10} y={y(t) + 5} fontSize="14" fill="#ffffff" fillOpacity="0.6">
            {t.toFixed(0)}
          </text>
        </g>
      ))}
      {candles.map((c, i) => {
        const x = i * g.step + g.step / 2;
        const up = c.c >= c.o;
        const col = up ? UP : DOWN;
        const bw = Math.max(1.2, g.step * 0.68);
        return (
          <g key={c.t}>
            <line x1={x} x2={x} y1={y(c.h)} y2={y(c.l)} stroke={col} strokeWidth="1.4" />
            <rect x={x - bw / 2} y={y(Math.max(c.o, c.c))} width={bw} height={Math.max(1.5, Math.abs(y(c.o) - y(c.c)))} fill={col} />
            <rect x={x - bw / 2} y={PH + 14 + VH - ((c.v || 0) / g.vmax) * VH} width={bw} height={((c.v || 0) / g.vmax) * VH} fill={col} fillOpacity="0.35" />
          </g>
        );
      })}
      <line x1="0" x2={W - PADR} y1={y(last.c)} y2={y(last.c)} stroke="#F5B72E" strokeDasharray="5 5" />
      <rect x={W - PADR + 2} y={y(last.c) - 12} width={PADR - 2} height="24" fill="#F5B72E" />
      <text x={W - PADR + 8} y={y(last.c) + 5} fontSize="14" fontWeight="700" fill="#040d10">
        {last.c.toFixed(0)}
      </text>
      {xl.map((c, i) => (
        <text key={i} x={Math.min(W - PADR - 4, (candles.indexOf(c) + 0.5) * g.step)} y={H - 4} fontSize="14" fill="#ffffff" fillOpacity="0.6" textAnchor={i === 0 ? 'start' : i === 3 ? 'end' : 'middle'}>
          {dFmt(c.t)}
        </text>
      ))}
      {hc && (
        <g pointerEvents="none">
          <line x1={hover * g.step + g.step / 2} x2={hover * g.step + g.step / 2} y1="0" y2={PH + VH + 14} stroke="#ffffff" strokeOpacity="0.5" strokeDasharray="3 4" />
          <line x1="0" x2={W - PADR} y1={y(hc.c)} y2={y(hc.c)} stroke="#ffffff" strokeOpacity="0.35" strokeDasharray="3 4" />
        </g>
      )}
    </svg>
  );
}

export default function StockChart() {
  const [symbol, setSymbol] = useState('GS');
  const [range, setRange] = useState('6mo');
  const [hover, setHover] = useState(null);
  const stock = useApi(`/api/stock/${symbol}?range=${range}`);
  const list = useApi('/api/ticker');
  const d = stock.data;
  const shown = d && hover != null ? d.candles[hover] : d?.candles[d.candles.length - 1];
  const up = d ? d.change >= 0 : true;
  const pos = d && d.high52 > d.low52 ? ((d.price - d.low52) / (d.high52 - d.low52)) * 100 : 50;

  return (
    <section id="grafik" className="section relative overflow-hidden bg-deep" aria-labelledby="chart-h">
      <CandleBg opacity={0.12} seed={21} speed={0.1} />
      <div className="wrap relative z-10">
        <Reveal as="h2" id="chart-h" className="h-lg max-w-5xl">
          Real bozor, real grafik
        </Reveal>
        <Reveal as="p" delay={80} className="mt-8 max-w-2xl text-xl">
          Haqiqiy aksiyalar narxi. Shamni ustiga olib boring: o‘sha kunning ochilish, eng yuqori, eng past va yopilish narxi ko‘rinadi.
        </Reveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          <Reveal className="bg-teal p-5 md:p-8 lg:col-span-8">
            {stock.error && <p className="py-20 text-xl" role="alert">{stock.error}. Keyinroq urinib ko‘ring.</p>}
            {!d && !stock.error && <p className="py-20 text-xl">Yuklanmoqda…</p>}
            {d && (
              <>
                <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
                  <div>
                    <p className="text-lg font-bold">
                      {d.name} · {d.symbol}
                    </p>
                    <p className="mt-1 flex flex-wrap items-baseline gap-x-4 text-[clamp(2.4rem,5vw,4.4rem)] font-extrabold leading-none tabular-nums">
                      {usd(d.price)}
                      <span className="text-2xl" style={{ color: up ? UP : DOWN }}>
                        {up ? '▲' : '▼'} {usd(Math.abs(d.change))} ({pct(d.changePct)})
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Davr">
                    {RANGES.map(([k, t]) => (
                      <button key={k} type="button" aria-pressed={range === k} onClick={() => setRange(k)} className={`min-h-11 px-4 font-bold transition-colors ${range === k ? 'bg-gold text-deep' : 'bg-deep hover:bg-white/10'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="mt-6 min-h-7 text-base font-medium tabular-nums" aria-live="off">
                  {shown && (
                    <>
                      {dFmt(shown.t)} · Ochilish <b>{usd(shown.o)}</b> · Yuqori <b>{usd(shown.h)}</b> · Past <b>{usd(shown.l)}</b> · Yopilish <b>{usd(shown.c)}</b> · Hajm <b>{compact(shown.v)}</b>
                    </>
                  )}
                </p>
                <div className="mt-2">
                  <Candles candles={d.candles} hover={hover} onHover={setHover} />
                </div>
              </>
            )}
          </Reveal>

          <Reveal delay={100} className="flex flex-col gap-4 lg:col-span-4">
            {d && (
              <div className="grid grid-cols-2 gap-px bg-white/10">
                {[
                  ['Oldingi yopilish', usd(d.prevClose)],
                  ['Bugungi hajm', compact(d.volume)],
                  ['Kun yuqori', usd(d.dayHigh)],
                  ['Kun past', usd(d.dayLow)],
                ].map(([k, v]) => (
                  <div key={k} className="bg-teal p-5">
                    <p className="text-base">{k}</p>
                    <p className="mt-1 text-2xl font-extrabold tabular-nums">{v}</p>
                  </div>
                ))}
                <div className="col-span-2 bg-teal p-5">
                  <p className="text-base">52 haftalik oraliq</p>
                  <div className="relative mt-4 h-2 bg-white/15">
                    <i className="absolute top-1/2 block size-5 -translate-x-1/2 -translate-y-1/2 bg-gold" style={{ left: `${Math.min(100, Math.max(0, pos))}%` }} />
                  </div>
                  <p className="mt-3 flex justify-between text-lg font-bold tabular-nums">
                    <span>{usd(d.low52)}</span>
                    <span>{usd(d.high52)}</span>
                  </p>
                </div>
              </div>
            )}

            <div className="bg-teal p-3" role="list" aria-label="Kuzatuv ro‘yxati">
              <p className="px-3 pb-2 pt-3 text-lg font-bold">Kuzatuv ro‘yxati</p>
              {(list.data?.quotes || []).map((q) => (
                <button
                  key={q.symbol}
                  type="button"
                  role="listitem"
                  onClick={() => setSymbol(q.symbol)}
                  aria-pressed={symbol === q.symbol}
                  className={`grid w-full grid-cols-[3.5rem_1fr_5rem_5.5rem] items-center gap-2 px-3 py-3 text-left tabular-nums transition-colors ${symbol === q.symbol ? 'bg-gold text-deep' : 'hover:bg-white/10'}`}
                >
                  <b>{q.symbol}</b>
                  <span className="h-7"><Spark data={q.spark} color={symbol === q.symbol ? '#040d10' : undefined} /></span>
                  <span className="text-right font-medium">{usd(q.price)}</span>
                  <span className="text-right font-bold" style={symbol === q.symbol ? undefined : { color: q.change >= 0 ? UP : DOWN }}>
                    {pct(q.changePct)}
                  </span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <p className="mt-6 max-w-3xl text-base">
          Manba: Yahoo Finance, narxlar kechikish bilan bo‘lishi mumkin. Bu o‘rganish uchun namuna, aksiya sotib olish tavsiyasi emas.
        </p>
      </div>
    </section>
  );
}
