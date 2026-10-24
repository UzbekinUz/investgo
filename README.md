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
