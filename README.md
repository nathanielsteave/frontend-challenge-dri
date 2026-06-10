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

## Handling Hydration Issues — Cart Persistence di Next.js

Bagian ini membahas tantangan teknis yang muncul saat mengimplementasikan persistent cart menggunakan `redux-persist` di Next.js, beserta pendekatan yang digunakan untuk mengatasinya.

### Akar Permasalahan

Next.js menggunakan Server-Side Rendering (SSR) — HTML dirender di server terlebih dahulu sebelum dikirim ke browser. Permasalahannya terletak pada fakta bahwa **server tidak memiliki akses ke `localStorage`**. Akibatnya, saat server melakukan render, state cart selalu dalam kondisi kosong (`items: []`).

Ketika JavaScript mulai berjalan di browser, `redux-persist` membaca `localStorage` dan me-restore data cart yang sebelumnya tersimpan misalnya berisi 3 item. Kondisi ini menyebabkan HTML hasil render server (cart kosong) **tidak konsisten** dengan hasil render client (cart berisi 3 item). React mendeteksi inkonsistensi ini dan menghasilkan **hydration mismatch error**.

Sederhananya: output server dan output client tidak cocok, sehingga React tidak dapat melakukan hydration dengan benar.

### Pendekatan Solusi

#### 1. `PersistGate` — Menahan Render Hingga Rehydration Selesai

Pada file `Providers.tsx`, seluruh aplikasi dibungkus menggunakan `PersistGate` dari `redux-persist`:

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

Prop `loading={null}` memastikan bahwa **children tidak dirender sama sekali** hingga `redux-persist` selesai membaca data dari `localStorage` dan mengisi Redux store. Pendekatan ini mencegah terjadinya *flash of empty state* kondisi di mana UI sempat muncul dengan cart kosong, lalu tiba-tiba berubah saat data ter-restore.

Alasan menggunakan `null` alih-alih loading spinner: proses rehydrate dari `localStorage` berlangsung sangat cepat (umumnya < 50ms). Menampilkan spinner untuk durasi sesingkat itu justru memberikan pengalaman yang kurang baik bagi user.

#### 2. Pattern `mounted` — Conditional Render Pasca-Hydration

Komponen yang menampilkan data dari Redux store seperti badge jumlah item di Navbar menggunakan pattern `mounted` untuk menghindari mismatch:

```tsx
// src/components/layout/Navbar.tsx
const cartCount = useSelector(selectCartCount);
const [mounted, setMounted] = useState(false);

useEffect(() => setMounted(true), []);

// Badge hanya dirender setelah komponen ter-mount di client
{mounted && cartCount > 0 && (
  <span className="...badge-styles...">
    {cartCount > 99 ? '99+' : cartCount}
  </span>
)}
```

Mekanismenya:
- **Server render:** `mounted` bernilai `false`, sehingga badge **tidak dirender**. Server menghasilkan HTML tanpa elemen badge.
- **Client hydration:** React mencocokkan HTML dari server keduanya sama-sama tanpa badge, sehingga **tidak terjadi mismatch**.
- **Post-hydration:** `useEffect` dieksekusi, `mounted` berubah menjadi `true`, dan badge muncul dengan jumlah cart yang sesuai dari `localStorage`.

Pattern ini merupakan pendekatan standar di Next.js untuk komponen yang bergantung pada data client-only.

#### 3. Boundary `"use client"` yang Eksplisit

Seluruh komponen yang berinteraksi dengan Redux store ditandai dengan directive `"use client"` di baris pertama file:

- `Providers.tsx` — wrapper Redux Provider dan PersistGate
- `AppShell.tsx` — mengelola state buka/tutup cart sidebar
- `Navbar.tsx` — membaca `cartCount` dari store
- `CartSidebar.tsx` — membaca dan memodifikasi cart items
- `CartPage.tsx` — halaman cart full-page
- `AddToCartButton.tsx` — mendispatch action `addToCart`

Pemisahan boundary ini memastikan Next.js dapat membedakan komponen mana yang perlu dieksekusi di client dan mana yang cukup dirender di server. Komponen server seperti `layout.tsx` tidak menyentuh Redux — tugasnya hanya membungkus children dengan `<Providers>`.

#### 4. Mengabaikan Non-Serializable Action

`redux-persist` secara internal mendispatch action seperti `FLUSH`, `REHYDRATE`, `PAUSE`, dan lainnya. Action-action ini membawa value non-serializable, yang menyebabkan Redux Toolkit mengeluarkan warning di console.

Untuk mengatasi ini, middleware dikonfigurasi agar mengabaikan action tersebut:

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

Ini bukan workaround action-action tersebut memang *by design* non-serializable dari sisi `redux-persist`. Mengabaikannya pada serializable check merupakan pendekatan yang [direkomendasikan oleh dokumentasi Redux Toolkit](https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist).

### Ringkasan Flow

```
Server Render
  └─ Cart state = kosong (initialState default)
  └─ Badge cart = tidak dirender (mounted = false)
  └─ HTML dikirim ke browser

Client Hydration
  └─ React mencocokkan HTML — konsisten, tidak ada error
  └─ PersistGate menahan render hingga localStorage terbaca
  └─ redux-persist me-restore cart data dari localStorage
  └─ useEffect dieksekusi → mounted = true
  └─ Badge muncul dengan jumlah cart yang akurat
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