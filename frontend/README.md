# ElectroCart — Frontend

A pixel-perfect, fully-interactive e-commerce storefront modelled after **shopcart.reactbd.com**, built with:

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 3** (custom design system — see `tailwind.config.ts`)
- **Zustand** for cart, wishlist, theme and auth state (persisted to `localStorage`)
- **React Icons**, **Framer Motion**, **React Hot Toast**
- Self-contained **Next.js API Routes** for products & orders

The app is **self-contained** — no external backend or database is required to run it. Cart, wishlist and theme persist across refreshes via `localStorage`.

---

## 🚀 Getting Started

### Prerequisites

- Node.js **18.18+** (built against 20+)
- npm (comes with Node)

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

### 3. Production build

```bash
npm run build
npm start
```

> Optional: copy `.env.local.example` → `.env.local`. The app works out of the box; only `NEXT_PUBLIC_API_URL` exists for compatibility with the optional Express backend in `../backend`.

---

## ✨ Features

| Feature | Detail |
|---|---|
| **Auto-sliding hero carousel** | 3 slides (Next-Gen Gadgets, Free Shipping, Money-Back Guarantee) with dots + autoplay |
| **Customer perks bar** | Free Delivery · Free Return · 27/7 Support · Money-Back Guarantee |
| **Popular categories** | 6 pastel category cards with item counts |
| **Shop by brands** | 8 brand tiles that deep-link into filtered shop pages |
| **Featured products** | Tabs: Best Sellers / New Arrivals / On Sale |
| **Promo banner** | Animated countdown timer + "Grab the Deal" CTA |
| **Search** | Header search + real-time filtering on the shop page by name / brand / category |
| **Shop filtering** | Category & brand checkboxes, dual-thumb price slider ($0–$1500), sort dropdown, active-filter chips |
| **Mini-cart dropdown** | Quantity steppers, remove, subtotal, **free-shipping progress bar** |
| **Wishlist** | Toggle hearts anywhere, dropdown preview + dedicated page |
| **Cart page** | Full line-items, quantity controls, order summary, suggestions |
| **Multi-step checkout** | Shipping → Payment → Review with per-field validation |
| **Order confirmation** | Random order ID (`SC-XXXX-XXXX-XXXX`), cart cleared, order posted to `/api/orders` |
| **Dark / Light mode** | Toggle in the header, persisted, no-flash on reload |
| **Responsive** | 4-col desktop → 2-col tablet → 1-col mobile with slide-out menu |
| **Product detail** | Gallery thumbnails, specs table, description tabs, related products |

---

## 🗂 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx                     # Homepage (all sections)
│   │   ├── api/
│   │   │   ├── products/route.ts        # GET /api/products (filtering/sort/pagination)
│   │   │   ├── products/[slug]/route.ts # GET /api/products/:slug
│   │   │   └── orders/route.ts          # POST/GET /api/orders
│   │   ├── shop/                        # Shop page + filter sidebar
│   │   ├── products/[slug]/             # Product detail
│   │   ├── cart/                        # Cart page
│   │   ├── checkout/                    # Multi-step checkout + success
│   │   ├── wishlist/                    # Wishlist page
│   │   ├── deals/                       # Hot Deals
│   │   ├── auth/                        # Login / Register
│   │   ├── about/ · contact/ · privacy/ · terms/ · not-found.tsx
│   │   ├── layout.tsx                   # Fonts, metadata, Toaster
│   │   └── globals.css                  # Base styles + component classes
│   ├── components/
│   │   ├── layout/                      # Header, Footer, LayoutWrapper
│   │   ├── home/                        # HeroCarousel, PerksBar, CategoriesGrid,
│   │   │                                # BrandsSection, FeaturedProducts, PromoBanner
│   │   └── ui/                          # ProductCard, StarRating, PriceRangeSlider
│   ├── store/                           # Zustand: cartStore, wishlistStore, themeStore, authStore
│   ├── data/                            # products.ts (36 items), categories.ts, brands.ts
│   ├── lib/                             # format/helpers
│   └── types/                           # Shared TypeScript types
├── tailwind.config.ts                   # Design system (colors, fonts, shadows)
└── next.config.ts
```

---

## 🎨 Design System

Defined in `tailwind.config.ts`:

- **Primary** `#0066CC` · hover `#004C99`
- **Accent** `#FF6B00` (sale tags, cart icons, highlights)
- **Navy** `#0A1A2F` (header / footer)
- **Body** `#F8FAFC` · **Text** `#1E293B` / muted `#64748B`
- **Borders** `#E2E8F0` · **Success** `#10B981` (free shipping) · **Stars** `#F59E0B`
- **Fonts**: Inter (UI) / Poppins (headings) / Roboto (body)

---

## 🔌 API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/api/products` | Query: `search`, `category`, `brand`, `min`, `max`, `sort` (`price-asc`/`price-desc`/`rating`/`popular`), `featured`, `new`, `sale`, `page`, `limit` |
| GET | `/api/products/:slug` | Single product by slug |
| POST | `/api/orders` | Create an order (validates required fields + email format) |
| GET | `/api/orders` | List orders (in-memory demo) |

Example:

```bash
curl "http://localhost:3000/api/products?category=television&sort=price-desc"
```

---

## 🧪 Demo Accounts

Authentication is a lightweight demo layer (Zustand + `localStorage`):

- **Login**: any valid email + password ≥ 6 characters
- **Register**: any name, valid email, matching passwords

---

## 📦 Sample Data

`src/data/products.ts` ships **36 products** across 6 categories and 8 brands, using `picsum.photos` placeholder images. Each product has price, optional sale price, ratings, review counts, stock, sold counts, badges (`isNew` / `onSale` / `isFeatured`) and tags.

---

## 🛠 Admin / Seller Dashboard

A full admin + seller dashboard is served under the `/dashboard` route. It matches the storefront design system (same `#0066CC` primary, `#FF6B00` accent, `#0A1A2F` navy sidebar, Inter/Poppins/Roboto fonts).

### Access

- **Login page:** `/dashboard/login` — only `admin` or `seller` roles can sign in against the optional Express backend (`NEXT_PUBLIC_API_URL`).
- **Demo credential:** `admin@electrocart.com` / `Admin123!` (seeded in the backend).
- All dashboard routes are gated by the auth layout and redirect anonymous users to `/dashboard/login`.

### Routes

| Route | Page |
|---|---|
| `/dashboard` | Home — stats cards, revenue chart, performance list, rating distribution, stock & price table |
| `/dashboard/products` | All products (search, category filter, sort: New / Price L→H / Price H→L / Best Selling / Top Rated) |
| `/dashboard/products/new` | Add product form |
| `/dashboard/products/[id]` | Edit product form |
| `/dashboard/orders` | Orders list with live status management |
| `/dashboard/orders/[id]` | Order detail with progress timeline, items, shipping, status/payment updates |
| `/dashboard/customers` | Customer list (search, roles, status) |
| `/dashboard/customers/[id]` | Customer profile with order history, total spent, avg order value |
| `/dashboard/categories` | Category CRUD |
| `/dashboard/campaigns` | Discount campaigns with views/clicks/conversions |
| `/dashboard/shipping` | Shipping methods & tracking |
| `/dashboard/finance` | Revenue, AOV, refunds and transactions (CSV export) |
| `/dashboard/notifications` | New orders, low stock, deliveries and more |
| `/dashboard/settings` | Store & account settings, password change |

### Real-time data

The dashboard **records everything** from the backend and refreshes automatically:

- Dashboard home and header poll every **30 seconds** (products, orders, stats).
- **Low stock** (`stock < 10`) alerts appear on the dashboard, product tables, and drive the header notification badge.
- Notifications are derived from live orders + product stock levels.
- All page data comes from the Express + MongoDB backend via `src/lib/api.ts` (products, orders, users, categories, stats, sales chart).

### API integration

`src/lib/api.ts` exposes namespaced clients for every feature (`dashboardApi`, `productApi`, `orderApi`, `customerApi`, `categoryApi`, `campaignApi`, `shippingApi`, `notificationApi`, `transactionApi`, `settingsApi`, `reportApi`). Missing backend endpoints degrade gracefully with local/derived fallbacks so every page remains usable.

### Key files

```
src/app/dashboard/            # All dashboard pages (App Router)
src/components/dashboard/     # Sidebar, Header, Pagination, StatusBadge, StarRating
src/components/products/      # Shared ProductForm (Add/Edit)
src/lib/api.ts                # Axios API clients
src/lib/dashboardUtils.ts     # currency/date/status/perf helpers
src/store/adminAuthStore.ts   # Admin auth (role-gated)
src/store/dashboardStore.ts   # Shared dashboard state
src/types/dashboard.ts        # Dashboard types
```