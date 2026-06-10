# Tjermin – Shopping Catalog App

Aplikasi katalog belanja berbasis **Next.js 16** (App Router) dengan **Redux Toolkit**, **TanStack Query**, dan **Tailwind CSS v4**. Data produk bersumber dari [Fake Store API](https://fakestoreapi.com/). Fitur utama meliputi persistent cart, micro-interaction, dan responsive design.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux)

---

## Technologies Used

Berikut daftar teknologi yang digunakan beserta alasan pemilihannya:

| Teknologi | Alasan Penggunaan |
|---|---|
| **Next.js 16** (App Router) | Framework utama. App Router dipilih karena mendukung React Server Components untuk rendering awal yang lebih cepat, serta menyediakan file-based routing yang membuat struktur halaman lebih terorganisir tanpa konfigurasi router tambahan. |
| **TypeScript** | Menjamin type safety di seluruh codebase. Kesalahan seperti typo pada props atau ketidaksesuaian tipe data dapat terdeteksi langsung di editor, sebelum masuk ke tahap production. |
| **Tailwind CSS v4** | Utility-first CSS framework yang memungkinkan styling langsung di dalam JSX tanpa perlu mengelola file CSS terpisah. Versi 4 dipilih karena sudah menggunakan CSS-first configuration yang lebih streamlined. |
| **Redux Toolkit** | State management untuk cart. `createSlice` secara signifikan mengurangi boilerplate dibanding Redux konvensional, dan Immer yang sudah built-in memungkinkan penulisan state mutation secara langsung tanpa nested spread operator. |
| **redux-persist** | Menyimpan state cart ke `localStorage` agar data tidak hilang saat halaman di-refresh. State secara otomatis di-restore ketika aplikasi dibuka kembali. |
| **TanStack Query v5** | Menangani data fetching dari API dengan fitur caching dan `staleTime`, sehingga tidak perlu melakukan fetch ulang setiap kali user berpindah halaman. Loading dan error state juga sudah ter-handle secara otomatis. |
| **Framer Motion** | Library animasi dengan API deklaratif untuk page transition dan micro-interaction. Cukup mendefinisikan prop `animate` tanpa perlu menulis CSS keyframe secara manual. |
| **react-hot-toast** | Komponen toast notification yang ringan dan mudah dikustomisasi, digunakan untuk feedback saat produk ditambahkan ke cart. |
| **react-icons** | Library icon (Feather Icons set) yang menghilangkan kebutuhan untuk mengelola file SVG secara individual atau memuat icon font yang berat. |

---

## Installation Steps

### Prasyarat

- **Node.js** versi 18.17 atau lebih baru
- **npm** versi 9 atau lebih baru

Jika belum ter-install, Node.js dapat diunduh dari [nodejs.org](https://nodejs.org/). npm akan otomatis ter-install bersama Node.js.

### Setup Project

1. **Clone repository**

   ```bash
   git clone https://github.com/nathanielsteave/frontend-challenge-dri.git
   cd frontend-challenge-dri
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   Perintah ini akan menginstall seluruh package yang tercantum di `package.json` — termasuk Next.js, Redux Toolkit, TanStack Query, Tailwind CSS, Framer Motion, dan dependency lainnya. Proses ini memerlukan waktu beberapa menit tergantung kecepatan koneksi internet.

3. **Jalankan development server**

   ```bash
   npm run dev
   ```

   Akses [http://localhost:3000](http://localhost:3000) di browser. Setiap perubahan pada file source code akan langsung ter-reflect di browser melalui hot reload.

### Build untuk Production

Untuk membuat production build:

```bash
npm run build
npm start
```

`npm run build` menghasilkan optimized bundle (minified, tree-shaken). `npm start` menjalankan production server di port 3000.

---

## Project Structure

```
src/
├── app/                       # Next.js App Router pages
│   ├── layout.tsx             # Root layout — wrapping Providers
│   ├── page.tsx               # Halaman utama (katalog produk)
│   ├── cart/page.tsx          # Halaman cart full-page
│   └── product/[id]/page.tsx  # Halaman detail produk (dynamic route)
├── components/
│   ├── layout/                # Navbar, Footer, HeroBanner, AppShell
│   ├── catalog/               # ProductGrid, ProductCard, CategoryFilter, SearchBar, Skeleton
│   ├── product/               # ProductDetail
│   ├── cart/                  # CartSidebar, CartItem, CartPage
│   └── ui/                    # AddToCartButton, Rating, PageTransition
├── hooks/                     # Custom hooks (TanStack Query wrapper)
├── lib/                       # API functions dan utility helpers
├── store/                     # Redux store, cart slice, Providers
└── types/                     # TypeScript interfaces
```

---

## Features

**Core:**
- Halaman katalog dengan product grid, loading skeleton, dan hover animation
- Halaman detail produk lengkap dengan gambar, rating, dan deskripsi
- Persistent cart — data cart tetap tersimpan meskipun browser di-refresh
- Cart sidebar (slide-in drawer) dengan quantity control dan order summary
- Halaman cart full-page dengan kalkulasi shipping dan alur checkout

**Bonus:**
- Filter produk berdasarkan kategori dengan animated pill indicator
- Search bar dengan debounced filtering
- Page transition menggunakan Framer Motion
- Toast notification saat produk ditambahkan ke cart
- Responsive layout (mobile-first approach)

---

## Handling Hydration Issues - Cart Persistence di Next.js

### Masalah

Server tidak punya akses ke `localStorage`, sehingga saat Server Side Rendering (SSR), cart selalu kosong. Ketika client me-restore data cart dari `localStorage` via `redux-persist`, terjadi perbedaan antara HTML server dan client React mendeteksi ini sebagai **hydration mismatch error**.

### Solusi

#### 1. `PersistGate` - Menahan Render Sampai Data Siap

```tsx
// src/store/Providers.tsx
<PersistGate loading={null} persistor={persistor}>
  {children}
</PersistGate>
```

`loading={null}` menunda render children hingga `redux-persist` selesai membaca `localStorage`. Proses ini sangat cepat (< 50ms), sehingga `null` lebih tepat daripada loading spinner.

#### 2. Pattern `mounted` - Render Data Client-Only Setelah Hydration

```tsx
// src/components/layout/Navbar.tsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);

{mounted && cartCount > 0 && <span>{cartCount}</span>}
```

Server dan client sama-sama merender tanpa badge → tidak ada mismatch. Setelah hydration selesai, `useEffect` mengubah `mounted` menjadi `true` dan badge muncul.

#### 3. Boundary `"use client"` yang Eksplisit

Semua komponen yang mengakses Redux store (`Providers`, `Navbar`, `CartSidebar`, `CartPage`, `AddToCartButton`, dll.) ditandai `"use client"`. Komponen server seperti `layout.tsx` hanya membungkus children dengan `<Providers>` tanpa menyentuh store.

#### 4. Mengabaikan Non-Serializable Action

`redux-persist` mendispatch action internal (`FLUSH`, `REHYDRATE`, dll.) yang non-serializable. Ini ditangani dengan mengecualikannya dari serializable check sesuai [rekomendasi resmi Redux Toolkit](https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist):

```tsx
// src/store/store.ts
middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
```

### Ringkasan Flow

```
Server  → Cart kosong, badge tidak dirender → kirim HTML ke browser
Client  → Hydration cocok (tanpa mismatch) → PersistGate restore localStorage → mounted = true → badge muncul
```

---

## API Endpoints

Data produk bersumber dari [Fake Store API](https://fakestoreapi.com/):

| Endpoint | Fungsi |
|---|---|
| `GET /products` | Mengambil seluruh daftar produk |
| `GET /products/{id}` | Mengambil detail satu produk berdasarkan ID |
| `GET /products/categories` | Mengambil daftar kategori produk |

---

## License

MIT