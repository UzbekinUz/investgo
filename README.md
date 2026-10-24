# InvestGo — o'smirlar uchun moliyaviy savodxonlik

Stack: React + Tailwind (Vite) · Express · MongoDB (Mongoose)

```bash
npm run install:all
cp server/.env.example server/.env   # MONGODB_URI ni kiriting
npm run seed --prefix server         # ixtiyoriy: tarif va modullarni Mongo'ga yozadi
npm run dev                          # web: :5173, api: :5055
```

MongoDB ulanmasa API namunaviy kontent bilan ishlaydi, kutish ro'yxati `server/data/waitlist.json` ga yoziladi.
Production: `npm run build && npm start` (Express `client/dist` ni o'zi beradi).

API: `GET /api/rates` (cbu.uz), `GET /api/plans`, `GET /api/modules`, `POST /api/ask`, `POST /api/waitlist`.

## Render'ga deploy

1. Kodni GitHub'ga yuklang (`.env`, `node_modules`, `dist` `.gitignore` da).
2. MongoDB Atlas'da bepul klaster oching, ulanish satrini oling (`mongodb+srv://...`), Network Access'da Render uchun `0.0.0.0/0` ruxsat bering.
3. Render → New → Blueprint → repo'ni tanlang (`render.yaml` o'qiladi).
4. `MONGODB_URI` qiymatini dashboard'da kiriting. Deploy tugagach: `/api/health` → `{"ok":true,"db":true}`.
