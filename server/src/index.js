import 'dotenv/config';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Plan, Module, Waitlist } from './models.js';
import { plans, modules, knowledge } from './data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5055;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json({ limit: '10kb' }));

const dbReady = () => mongoose.connection.readyState === 1;

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tanga', {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('MongoDB ulandi');
  } catch {
    console.warn('MongoDB ulanmadi: namunaviy kontent va fayl asosidagi kutish ro‘yxati ishlatiladi');
  }
}

app.get('/api/health', (_req, res) => res.json({ ok: true, db: dbReady() }));

app.get('/api/plans', async (_req, res) => {
  const rows = dbReady() ? await Plan.find().lean() : [];
  res.json(rows.length ? rows : plans);
});

app.get('/api/modules', async (_req, res) => {
  const rows = dbReady() ? await Module.find().lean() : [];
  res.json(rows.length ? rows : modules);
});

// Rasmiy kurslar: Markaziy bank. 30 daqiqa keshlanadi.
const WANT = ['USD', 'EUR', 'RUB', 'GBP', 'CNY', 'KZT'];
let ratesCache = { at: 0, data: null };

app.get('/api/rates', async (_req, res) => {
  if (ratesCache.data && Date.now() - ratesCache.at < 30 * 60 * 1000) return res.json(ratesCache.data);
  try {
    const r = await fetch('https://cbu.uz/uz/arkhiv-kursov-valyut/json/', {
      signal: AbortSignal.timeout(6000),
    });
    if (!r.ok) throw new Error(String(r.status));
    const all = await r.json();
    const rates = WANT.map((c) => all.find((x) => x.Ccy === c))
      .filter(Boolean)
      .map((x) => ({
        code: x.Ccy,
        name: x.CcyNm_UZ,
        nominal: Number(x.Nominal) || 1,
        rate: Number(x.Rate),
        diff: Number(x.Diff),
        date: x.Date,
      }));
    ratesCache = { at: Date.now(), data: { ok: true, source: 'cbu.uz', rates } };
    res.json(ratesCache.data);
  } catch {
    if (ratesCache.data) return res.json({ ...ratesCache.data, stale: true });
    res.status(502).json({ ok: false, source: 'cbu.uz', message: 'Markaziy bank ma’lumotini hozir olib bo‘lmadi' });
  }
});

// Aksiyalar: Yahoo Finance (ommaviy, rasmiy bo'lmagan endpoint, kechikish bilan). Kalit talab qilinmaydi.
const SYMBOLS = ['GS', 'JPM', 'MS', 'AAPL', 'MSFT', 'NVDA', 'AMZN', 'TSLA'];
const RANGES = { '1mo': '1d', '3mo': '1d', '6mo': '1d', '1y': '1d', '5y': '1wk' };
const stockCache = new Map();

async function yahoo(symbol, range) {
  const key = `${symbol}:${range}`;
  const hit = stockCache.get(key);
  if (hit && Date.now() - hit.at < 5 * 60 * 1000) return hit.data;
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${RANGES[range] || '1d'}`;
  let r;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(8000) });
      if (r.ok) break;
    } catch {
      r = null;
    }
    await new Promise((ok) => setTimeout(ok, 400));
  }
  if (!r?.ok) {
    if (hit) return hit.data; // eskirgan bo'lsa ham, ma'lumot yo'qdan yaxshi
    throw new Error('upstream');
  }
  const j = await r.json();
  const res = j.chart?.result?.[0];
  if (!res) throw new Error('empty');
  const q = res.indicators.quote[0];
  const candles = res.timestamp
    .map((t, i) => ({ t: t * 1000, o: q.open[i], h: q.high[i], l: q.low[i], c: q.close[i], v: q.volume[i] }))
    .filter((c) => [c.o, c.h, c.l, c.c].every((n) => typeof n === 'number'));
  const m = res.meta;
  const prev = candles.length > 1 ? candles[candles.length - 2].c : m.chartPreviousClose;
  const price = m.regularMarketPrice ?? candles[candles.length - 1].c;
  const data = {
    symbol: m.symbol,
    name: m.longName || m.shortName || m.symbol,
    currency: m.currency,
    exchange: m.fullExchangeName,
    price,
    prevClose: prev,
    change: price - prev,
    changePct: ((price - prev) / prev) * 100,
    dayHigh: m.regularMarketDayHigh,
    dayLow: m.regularMarketDayLow,
    volume: m.regularMarketVolume,
    high52: m.fiftyTwoWeekHigh,
    low52: m.fiftyTwoWeekLow,
    time: m.regularMarketTime ? m.regularMarketTime * 1000 : null,
    candles,
  };
  stockCache.set(key, { at: Date.now(), data });
  return data;
}

app.get('/api/stock/:symbol', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const range = RANGES[req.query.range] ? req.query.range : '6mo';
  if (!SYMBOLS.includes(symbol)) return res.status(400).json({ message: 'Noma’lum aksiya' });
  try {
    res.json({ ok: true, source: 'Yahoo Finance', ...(await yahoo(symbol, range)) });
  } catch {
    res.status(502).json({ ok: false, message: 'Aksiya ma’lumotini hozir olib bo‘lmadi' });
  }
});

app.get('/api/ticker', async (_req, res) => {
  const rows = await Promise.allSettled(SYMBOLS.map((s) => yahoo(s, '1mo')));
  const quotes = rows
    .filter((r) => r.status === 'fulfilled')
    .map(({ value: v }) => ({
      symbol: v.symbol,
      name: v.name,
      price: v.price,
      change: v.change,
      changePct: v.changePct,
      volume: v.volume,
      spark: v.candles.slice(-30).map((c) => c.c),
    }));
  if (!quotes.length) return res.status(502).json({ ok: false, message: 'Aksiya ma’lumotini hozir olib bo‘lmadi' });
  res.json({ ok: true, source: 'Yahoo Finance', quotes });
});

// Manbali yordamchi: faqat tasdiqlangan yozuvlar bo'yicha javob; topilmasa — rad etadi.
const norm = (s) => s.toLowerCase().replace(/[’'`ʻʼ‘]/g, '');
app.post('/api/ask', (req, res) => {
  const q = norm(String(req.body?.q || '')).slice(0, 300);
  if (q.length < 3) return res.status(400).json({ message: 'Savolni yozing' });
  if (/sotib ol|qaysi (aksiya|obligatsiya|valyuta)|qayerga (sol|invest)|nimaga (sol|invest)|nima olay/.test(q)) {
    return res.json({
      found: false,
      message:
        'Men shaxsiy investitsiya maslahati bermayman: qaysi aktivni olishni sizga kim aytsa ham, u sizning vaziyatingizni to‘liq bilmaydi. Buning o‘rniga tanlov qanday baholanishini tushuntiraman. “Xavf nima?” yoki “Diversifikatsiya nima?” deb so‘rang.',
    });
  }
  const scored = knowledge
    .map((k) => ({ k, score: k.keys.filter((w) => q.includes(norm(w))).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  if (!scored.length) {
    return res.json({
      found: false,
      message:
        'Bu savol bo‘yicha tekshirilgan rasmiy manbam yo‘q, shuning uchun javob bermayman. O‘ylab topilgan javobdan ko‘ra shu yaxshiroq.',
    });
  }
  const { k } = scored[0];
  res.json({ found: true, title: k.title, answer: k.answer, sources: k.sources });
});

// Kutish ro'yxati: Mongo bo'lsa o'sha yerda, bo'lmasa fayl.
const FILE = path.join(__dirname, '..', 'data', 'waitlist.json');
app.post('/api/waitlist', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const plan = ['free', 'plus', 'premium'].includes(req.body?.plan) ? req.body.plan : 'free';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(400).json({ message: 'Email manzilni to‘g‘ri kiriting' });
  }
  try {
    if (dbReady()) {
      await Waitlist.updateOne({ email }, { $set: { plan } }, { upsert: true });
    } else {
      fs.mkdirSync(path.dirname(FILE), { recursive: true });
      const list = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : [];
      if (!list.some((x) => x.email === email)) list.push({ email, plan, at: new Date().toISOString() });
      fs.writeFileSync(FILE, JSON.stringify(list, null, 2));
    }
    res.status(201).json({ ok: true });
  } catch {
    res.status(500).json({ message: 'Saqlab bo‘lmadi, keyinroq urinib ko‘ring' });
  }
});

// Production: build qilingan klientni xizmat qiladi
const dist = path.join(__dirname, '..', '..', 'client', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

connectDb().then(() => app.listen(PORT, () => console.log(`API: http://localhost:${PORT}`)));
