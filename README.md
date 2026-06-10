# TrendyMarket – Shopping Catalog App

A modern shopping catalog application built with **Next.js 16**, **Redux Toolkit**, **TanStack Query**, and **Tailwind CSS v4**. Fetches products from the [Fake Store API](https://fakestoreapi.com/) and provides a premium shopping experience with persistent cart, micro-interactions, and responsive design.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux)

## Features

### Core
- **Catalog Page** – Product grid with loading skeletons, hover animations, and responsive layout
- **Product Detail Page** – Full product view with image zoom, ratings, and description
- **Persistent Cart** – Add/remove products; cart survives page refresh via `redux-persist` + `localStorage`
- **Cart Sidebar** – Slide-in drawer with quantity controls and order summary
- **Cart Page** – Full-page cart with shipping calculation and checkout flow

### Bonus
- **Category Filter** – Filter products by category with animated pill indicators
- **Search Bar** – Real-time product search with debounced filtering
- **Micro-interactions** – Framer Motion page transitions, button feedback, toast notifications
- **Responsive Design** – Mobile-first layout that works on all screen sizes

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) (App Router) | Framework, Server Components, file-based routing |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first CSS styling |
| [Redux Toolkit](https://redux-toolkit.js.org/) | Cart state management |
| [redux-persist](https://github.com/rt2zz/redux-persist) | Cart persistence to localStorage |
| [TanStack Query v5](https://tanstack.com/query) | Data fetching, caching, stale-while-revalidate |
| [Framer Motion](https://www.framer.com/motion/) | Animations and page transitions |
| [react-hot-toast](https://react-hot-toast.com/) | Toast notifications |
| [react-icons](https://react-icons.github.io/react-icons/) | Icon library |

## Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/frontend-challenge-dri.git
cd frontend-challenge-dri

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (Providers, AppShell)
│   ├── page.tsx            # Home/Catalog page
│   ├── cart/page.tsx       # Cart page
│   └── product/[id]/page.tsx  # Product detail page
├── components/
│   ├── layout/             # Navbar, Footer, HeroBanner, AppShell
│   ├── catalog/            # ProductGrid, ProductCard, CategoryFilter, SearchBar, Skeleton
│   ├── product/            # ProductDetail
│   ├── cart/               # CartSidebar, CartItem, CartPage
│   └── ui/                 # AddToCartButton, Rating, PageTransition
├── hooks/                  # TanStack Query hooks
├── lib/                    # API functions, utilities
├── store/                  # Redux store, cart slice, Providers
└── types/                  # TypeScript interfaces
```

## Handling Hydration Issues with Cart Persistence

When implementing cart persistence with `redux-persist` in Next.js, the main challenge is **SSR/client hydration mismatch**: the server renders with an empty cart, but the client rehydrates from `localStorage` with potentially non-empty cart data.

### Our Approach

1. **`PersistGate` with `loading={null}`**
   The `Providers` component wraps children in `PersistGate` from `redux-persist`. Setting `loading={null}` delays rendering until the persisted Redux state is fully rehydrated from `localStorage`, preventing the client from rendering with stale initial state.

   ```tsx
   <PersistGate loading={null} persistor={persistor}>
     {children}
   </PersistGate>
   ```

2. **`useEffect` for client-only UI**
   Components that display Redux-dependent data (like the cart count badge in the Navbar) use a `mounted` state pattern:

   ```tsx
   const [mounted, setMounted] = useState(false);
   useEffect(() => setMounted(true), []);

   // Only render cart count after hydration
   {mounted && cartCount > 0 && <Badge>{cartCount}</Badge>}
   ```

   This ensures the server renders `cartCount = 0` and the client updates to the real value after mount — no hydration mismatch.

3. **Client Component boundaries**
   All cart-interactive components (`Navbar`, `CartSidebar`, `AddToCartButton`) are marked as `"use client"` components, ensuring Redux hooks (`useSelector`, `useDispatch`) only run on the client.

4. **Serializable action filtering**
   `redux-persist` dispatches non-serializable actions internally. We configure the Redux middleware to ignore these:

   ```tsx
   middleware: (getDefaultMiddleware) =>
     getDefaultMiddleware({
       serializableCheck: {
         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
       },
     }),
   ```

## API Endpoints Used

| Endpoint | Purpose |
|---|---|
| `GET /products` | Fetch all products |
| `GET /products/{id}` | Fetch single product |
| `GET /products/categories` | Fetch category list |

## License

MIT
