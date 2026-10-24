import { useEffect, useRef, useState } from 'react';

export const fmt = (n) => `${Math.round(n).toLocaleString('ru-RU').replace(/ /g, ' ')} so‘m`;

export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) return el.classList.add('in');
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('in');
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`rv ${className}`} style={{ '--d': `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}

export function useApi(url) {
  const [state, set] = useState({ data: null, error: null, loading: true });
  useEffect(() => {
    let live = true;
    fetch(url)
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.message || 'Xatolik');
        return j;
      })
      .then((data) => live && set({ data, error: null, loading: false }))
      .catch((e) => live && set({ data: null, error: e.message, loading: false }));
    return () => {
      live = false;
    };
  }, [url]);
  return state;
}

export function Coin({ className = '' }) {
  return (
    <svg viewBox="0 0 500 500" className={className} role="img" aria-label="Oltin tanga, sakkiz qirrali yulduz naqshi bilan">
      <circle cx="250" cy="250" r="244" fill="#F5B72E" />
      <circle cx="250" cy="250" r="206" fill="none" stroke="#0C4A52" strokeWidth="10" strokeDasharray="2 18" strokeLinecap="round" />
      <g className="coin-star">
        <rect x="135" y="135" width="230" height="230" fill="#0C4A52" />
        <rect x="135" y="135" width="230" height="230" fill="#0C4A52" transform="rotate(45 250 250)" />
        <rect x="175" y="175" width="150" height="150" fill="#F5B72E" />
        <rect x="175" y="175" width="150" height="150" fill="#F5B72E" transform="rotate(45 250 250)" />
      </g>
      <circle cx="250" cy="250" r="64" fill="#0C4A52" />
      <text x="250" y="273" textAnchor="middle" fontSize="66" fontWeight="800" fill="#F5B72E" fontFamily="Onest, sans-serif">
        IG
      </text>
    </svg>
  );
}
