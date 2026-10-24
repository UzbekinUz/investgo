import { useEffect, useRef } from 'react';
import { useApi } from './lib.jsx';

export const UP = '#3ddc97';
export const DOWN = '#ff6b6b';

export const usd = (n, d = 2) =>
  n == null ? '—' : `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })}`;
export const pct = (n) => `${n > 0 ? '+' : ''}${n.toFixed(2)}%`;
export const compact = (n) => (n == null ? '—' : Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n));

/* Harakatlanuvchi shamlar foni (canvas). Faqat ko'rinib turganda chiziladi. */
export function CandleBg({ opacity = 0.35, speed = 0.18, seed = 7, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    const ctx = cv.getContext('2d');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0, visible = true, off = 0;
    let s = seed;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const step = 14;
    let candles = [];
    let last = 0.5;
    const next = () => {
      const o = last;
      const c = Math.min(0.9, Math.max(0.1, o + (rnd() - 0.48) * 0.09));
      const hi = Math.max(o, c) + rnd() * 0.04;
      const lo = Math.min(o, c) - rnd() * 0.04;
      last = c;
      return { o, c, hi, lo };
    };
    const resize = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(2, devicePixelRatio || 1);
      w = r.width; h = r.height;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const need = Math.ceil(w / step) + 3;
      while (candles.length < need) candles.push(next());
      draw();
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const y = (v) => h * (1 - v);
      ctx.lineWidth = 1.5;
      candles.forEach((k, i) => {
        const x = i * step - off;
        const up = k.c >= k.o;
        ctx.strokeStyle = ctx.fillStyle = up ? UP : DOWN;
        ctx.beginPath(); ctx.moveTo(x + 4, y(k.hi)); ctx.lineTo(x + 4, y(k.lo)); ctx.stroke();
        const top = y(Math.max(k.o, k.c));
        ctx.fillRect(x, top, 8, Math.max(2, Math.abs(y(k.o) - y(k.c))));
      });
      ctx.strokeStyle = '#F5B72E'; ctx.lineWidth = 2; ctx.beginPath();
      candles.forEach((k, i) => { const x = i * step - off + 4; i ? ctx.lineTo(x, y(k.c)) : ctx.moveTo(x, y(k.c)); });
      ctx.stroke();
    };
    const tick = () => {
      if (visible) {
        off += speed * 4;
        if (off >= step) { off -= step; candles.shift(); candles.push(next()); }
        draw();
      }
      raf = requestAnimationFrame(tick);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(cv);
    resize();
    if (!reduce) raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [seed, speed]);
  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} style={{ opacity }} />;
}

export function Spark({ data, w = 120, h = 36, color }) {
  if (!data?.length) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * (h - 4) - 2}`).join(' ');
  const c = color || (data[data.length - 1] >= data[0] ? UP : DOWN);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={pts} fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* Yugurib turuvchi narxlar tasmasi */
export function Ticker() {
  const { data } = useApi('/api/ticker');
  const q = data?.quotes;
  if (!q) return <div className="h-12 bg-deep" aria-hidden="true" />;
  const items = (suffix) =>
    q.map((x) => (
      <span key={x.symbol + suffix} className="flex items-center gap-3 px-6 text-base font-bold tabular-nums">
        <span>{x.symbol}</span>
        <span className="font-medium">{usd(x.price)}</span>
        <span style={{ color: x.change >= 0 ? UP : DOWN }}>
          {x.change >= 0 ? '▲' : '▼'} {pct(x.changePct)}
        </span>
      </span>
    ));
  return (
    <div className="marquee-wrap bg-deep py-3" role="region" aria-label="Aksiya narxlari tasmasi">
      <div className="marquee flex w-max">
        {['a', 'b', 'c', 'd'].map((k, i) => (
          <div key={k} className="flex shrink-0" aria-hidden={i > 0 ? 'true' : undefined}>
            {items(k)}
          </div>
        ))}
      </div>
    </div>
  );
}
