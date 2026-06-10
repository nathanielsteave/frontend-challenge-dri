# Tjermin – Shopping Catalog App

Aplikasi katalog belanja yang dibangun pakai **Next.js 16** (App Router), **Redux Toolkit**, **TanStack Query**, dan **Tailwind CSS v4**. Data produk diambil dari [Fake Store API](https://fakestoreapi.com/). Fitur utamanya: persistent cart, animasi micro-interaction, dan layout responsive.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux)

---

## Technologies Used

Berikut teknologi yang dipakai di project ini beserta alasan kenapa dipilih:

| Teknologi | Kenapa Dipakai |
|---|---|
| **Next.js 16** (App Router) | Framework utama. Pakai App Router karena butuh Server Components buat rendering awal yang cepat, plus file-based routing yang bikin struktur halaman rapi tanpa harus setup router manual. |
| **TypeScript** | Supaya kalau ada typo di props atau salah passing data, ketahuan langsung di editor sebelum sempat jadi bug di production. |
| **Tailwind CSS v4** | Styling langsung di JSX, gak perlu bolak-balik file CSS terpisah. v4 dipilih karena sudah pakai CSS-first config, jadi lebih clean. |
| **Redux Toolkit** | State management buat cart. Dipilih karena `createSlice` bikin boilerplate Redux jadi jauh lebih sedikit, dan built-in Immer jadi bisa mutate state langsung tanpa spread operator bertingkat. |
| **redux-persist** | Supaya isi cart gak hilang pas user refresh halaman. Data cart disimpan ke `localStorage` dan otomatis di-restore saat aplikasi dibuka lagi. |
| **TanStack Query v5** | Fetching data produk dari API. Fitur caching dan `staleTime` bikin halaman gak perlu fetch ulang tiap navigasi, dan loading state-nya sudah di-handle otomatis. |
| **Framer Motion** | Animasi transisi halaman dan micro-interaction. Dipilih karena API-nya deklaratif — tinggal kasih prop `animate`, gak perlu nulis CSS keyframe manual. |
| **react-hot-toast** | Notifikasi "Added to cart!" yang muncul di pojok kanan bawah. Ringan dan gampang dikustomisasi style-nya. |
| **react-icons** | Library icon (Feather Icons). Biar gak perlu download SVG satu-satu atau pasang icon font yang berat. |

---

## Installation Steps

### Prasyarat

- **Node.js** versi 18.17 ke atas
- **npm** versi 9 ke atas

Kalau belum punya Node.js, download dari [nodejs.org](https://nodejs.org/). npm sudah otomatis ikut ter-install.

### Setup Project

1. **Clone repository**

   ```bash
   git clone https://github.com/your-username/frontend-challenge-dri.git
   cd frontend-challenge-dri
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   Proses ini akan menginstall semua package yang tercantum di `package.json`, termasuk Next.js, Redux Toolkit, TanStack Query, Tailwind CSS, Framer Motion, dan lainnya. Tunggu sampai selesai — biasanya beberapa menit tergantung koneksi internet.

3. **Jalankan development server**

   ```bash
   npm run dev
   ```

   Buka [http://localhost:3000](http://localhost:3000) di browser. Setiap kali kamu edit dan save file, halaman akan otomatis ter-update (hot reload).

### Build untuk Production

Kalau mau deploy atau test versi production-nya:

```bash
npm run build
npm start
```

`npm run build` akan membuat optimized build (minified, tree-shaken, dll). `npm start` menjalankan server production di port 3000.

---

## Project Structure

```
src/
├── app/                       # Next.js App Router — halaman-halaman
│   ├── layout.tsx             # Root layout, tempat Providers dibungkus
│   ├── page.tsx               # Halaman utama (katalog produk)
│   ├── cart/page.tsx          # Halaman cart full-page
│   └── product/[id]/page.tsx  # Halaman detail produk (dynamic route)
├── components/
│   ├── layout/                # Navbar, Footer, HeroBanner, AppShell
│   ├── catalog/               # ProductGrid, ProductCard, CategoryFilter, SearchBar, Skeleton
│   ├── product/               # ProductDetail
│   ├── cart/                  # CartSidebar, CartItem, CartPage
│   └── ui/                   # AddToCartButton, Rating, PageTransition
├── hooks/                     # Custom hooks (TanStack Query wrapper)
├── lib/                       # Fungsi API dan utilitas (formatPrice, dll.)
├── store/                     # Redux store, cart slice, Providers
└── types/                     # TypeScript interfaces (Product, CartItem, dll.)
```

---

## Features

**Core:**
- Halaman katalog dengan product grid, loading skeleton, dan hover animation
- Halaman detail produk dengan gambar, rating, dan deskripsi lengkap
- Cart yang persistent — isi cart tetap ada meskipun browser di-refresh
- Cart sidebar (slide-in drawer) dengan kontrol quantity dan ringkasan order
- Halaman cart full-page dengan kalkulasi shipping dan tombol checkout

**Bonus:**
- Filter kategori produk dengan animated pill indicator
- Search bar dengan debounced filtering
- Animasi transisi halaman pakai Framer Motion
- Toast notification saat produk ditambahkan ke cart
- Layout responsive (mobile-first)

---

## Handling Hydration Issues — Cart Persistence di Next.js

Bagian ini menjelaskan masalah yang muncul saat mengimplementasikan persistent cart pakai `redux-persist` di Next.js, dan bagaimana cara mengatasinya.

### Masalahnya Apa?

Next.js pakai Server-Side Rendering (SSR). Artinya, HTML halaman pertama kali di-render di server sebelum dikirim ke browser. Masalahnya: **server gak punya akses ke `localStorage`**. Jadi pas server render, cart selalu dalam keadaan kosong (`items: []`).

Tapi begitu JavaScript di browser jalan, `redux-persist` langsung baca `localStorage` dan me-restore data cart yang sebelumnya tersimpan — misalnya ada 3 item. Ini bikin HTML yang di-render server (cart kosong) **berbeda** dengan yang di-render client (cart ada isinya). React mendeteksi perbedaan ini dan melempar **hydration mismatch error**.

Intinya: server bilang "cart kosong", client bilang "cart ada 3 item", React bingung.

### Solusi yang Dipakai

#### 1. `PersistGate` — Tahan Render Sampai Data Siap

Di file `Providers.tsx`, seluruh app dibungkus pakai `PersistGate` dari `redux-persist`:

```tsx
// src/store/Providers.tsx
<Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </PersistGate>
</Provider>
```

`loading={null}` artinya: **jangan render children sama sekali** sampai `redux-persist` selesai membaca data dari `localStorage` dan mengisi Redux store. Ini mencegah situasi di mana UI muncul sebentar dengan cart kosong, lalu tiba-tiba berubah jadi ada isinya (flash of empty state).

Kenapa `null` dan bukan loading spinner? Karena proses rehydrate dari `localStorage` itu sangat cepat (biasanya < 50ms), jadi memunculkan spinner justru bikin pengalaman lebih jelek — user lihat loading indicator yang muncul cuma sekilas.

#### 2. Pattern `mounted` — Render Setelah Hydration Selesai

Untuk komponen yang menampilkan data dari Redux (contoh: badge jumlah item di Navbar), dipakai pattern `mounted`:

```tsx
// src/components/layout/Navbar.tsx
const cartCount = useSelector(selectCartCount);
const [mounted, setMounted] = useState(false);

useEffect(() => setMounted(true), []);

// Badge hanya muncul setelah komponen mount di client
{mounted && cartCount > 0 && (
  <span className="...badge-styles...">
    {cartCount > 99 ? '99+' : cartCount}
  </span>
)}
```

Logikanya begini:
- Saat server render, `mounted` = `false`, jadi badge **tidak di-render**. Server menghasilkan HTML tanpa badge.
- Saat client hydrate, React melihat HTML yang sama (tanpa badge) — **tidak ada mismatch**.
- Setelah hydration selesai, `useEffect` jalan, `mounted` jadi `true`, dan badge muncul dengan jumlah cart yang benar dari `localStorage`.

Ini trik klasik di Next.js untuk komponen yang bergantung pada data client-only. Gak elegan, tapi efektif.

#### 3. Boundary `"use client"` yang Jelas

Semua komponen yang berinteraksi dengan Redux store ditandai `"use client"` di baris pertama file:

- `Providers.tsx` — wrapper Redux + PersistGate
- `AppShell.tsx` — mengatur state buka/tutup cart sidebar
- `Navbar.tsx` — membaca `cartCount` dari store
- `CartSidebar.tsx` — membaca dan memodifikasi cart items
- `CartPage.tsx` — halaman cart full-page
- `AddToCartButton.tsx` — dispatch `addToCart` action

Dengan memisahkan boundary ini secara eksplisit, Next.js tahu mana komponen yang perlu dijalankan di client dan mana yang cukup di server. Komponen server (seperti `layout.tsx`) tidak menyentuh Redux sama sekali — dia cuma membungkus children dengan `<Providers>`.

#### 4. Menekan Warning Serializable Action

`redux-persist` secara internal mendispatch action seperti `FLUSH`, `REHYDRATE`, `PAUSE`, dll. Action-action ini membawa value yang non-serializable, dan Redux Toolkit secara default akan memunculkan warning di console.

Solusinya: konfigurasi middleware untuk mengabaikan action-action tersebut:

```tsx
// src/store/store.ts
export const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
```

Ini bukan "menyembunyikan masalah" — action-action ini memang by design non-serializable dari `redux-persist`, dan mengabaikannya di serializable check adalah praktek yang direkomendasikan di [dokumentasi Redux Toolkit](https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist).

### Ringkasan Flow

```
Server Render
  └─ Cart state = kosong (default initialState)
  └─ Badge cart = tidak di-render (mounted = false)
  └─ HTML dikirim ke browser

Client Hydrate
  └─ React cocokkan HTML — match, tidak ada error
  └─ PersistGate menahan render sampai localStorage terbaca
  └─ redux-persist restore cart data dari localStorage
  └─ useEffect jalan → mounted = true
  └─ Badge muncul dengan jumlah cart yang benar
```

---

## API Endpoints

Data produk diambil dari [Fake Store API](https://fakestoreapi.com/):

| Endpoint | Fungsi |
|---|---|
| `GET /products` | Ambil semua produk |
| `GET /products/{id}` | Ambil detail satu produk |
| `GET /products/categories` | Ambil daftar kategori |

---

## License

MIT
