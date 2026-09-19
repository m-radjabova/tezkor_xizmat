# Tezkor Xizmat Frontend

Tezkor Xizmat - foydalanuvchilarga yaqin atrofdagi ishonchli xizmat ko'rsatuvchilarni topish, solishtirish va ular bilan tez bog'lanish imkonini beruvchi zamonaviy web ilova.

![Tezkor Xizmat preview](public/website.png)

## Asosiy Imkoniyatlar

- Xizmatlarni kategoriya bo'yicha ko'rish va qidirish
- Foydalanuvchi joylashuviga qarab eng yaqin xizmatlarni ko'rsatish
- Biznes sahifasida rasm, manzil, ish vaqti, reyting va izohlarni ko'rish
- Provider kabineti orqali xizmatlarni boshqarish
- Admin panel orqali foydalanuvchilar, kategoriyalar va xizmatlarni nazorat qilish
- Login, ro'yxatdan o'tish va Google orqali kirish
- SEO uchun tayyor meta teglar va social preview rasmi
- Responsive dizayn: desktop, planshet va mobil ekranlarga mos

## Texnologiyalar

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Material UI Icons
- TanStack Query
- React Router
- React Helmet Async
- Firebase Auth
- Axios
- Framer Motion

## Ishga Tushirish

Loyihani lokal kompyuterda ishga tushirish uchun:

```bash
npm install
npm run dev
```

Vite odatda ilovani quyidagi manzilda ochadi:

```bash
http://localhost:5173
```

## Environment Sozlamalari

Loyiha ildizida `.env` fayl yarating va kerakli qiymatlarni kiriting:

```env
VITE_API_ORIGIN=http://localhost:8000
VITE_SITE_URL=http://localhost:5173

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

`VITE_API_ORIGIN` ko'rsatilmasa, frontend avtomatik ravishda `http://localhost:8000` backend manzilidan foydalanadi.

## Scriptlar

```bash
npm run dev
```

Development serverni ishga tushiradi.

```bash
npm run build
```

TypeScript tekshiruvi bilan production build yaratadi.

```bash
npm run preview
```

Production buildni lokal ko'rish uchun preview serverni ishga tushiradi.

```bash
npm run lint
```

Kod sifatini ESLint orqali tekshiradi.

## Loyiha Tuzilishi

```text
src/
  apiClient/          API client va token refresh logikasi
  assets/             Lokal rasm va animatsiya fayllari
  components/         Qayta ishlatiladigan UI komponentlar
  context/            Global context
  hooks/              API va UI uchun custom hooklar
  layout/             Sahifa layoutlari
  pages/              Landing, auth, admin va provider sahifalari
  utils/              Yordamchi funksiyalar
public/
  circle.png          Favicon va app icon
  website.png         Social preview rasmi
```

## Build Holati

Oxirgi tekshiruv:

```bash
npm run build
```

Build muvaffaqiyatli yakunlandi. Vite dependency tomondan `lottie-web` ichidagi `eval` va katta chunklar haqida warning ko'rsatishi mumkin, lekin ular buildni to'xtatmaydi.

## Muallif

Tezkor Xizmat loyihasi xizmat topish jarayonini sodda, tez va ishonchli qilish uchun ishlab chiqilgan.
