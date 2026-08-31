# ShopCart — Full-Stack E-Commerce Platform

> **Shopcart.reactbd.com clone** — a pixel-perfect, fully interactive online store for electronics, kitchen
> appliances, televisions, refrigerators, washing machines, tablets and gadget accessories.

![Stack](https://img.shields.io/badge/Next.js%2015-React%2019-TypeScript-blue) ![Stack](https://img.shields.io/badge/Tailwind%20CSS-Design%20System-38bdf8)

## Repo Layout

```
ShopCart/
├── frontend/   # ShopCart storefront — self-contained Next.js app (recommended)
└── backend/    # Optional Express + MongoDB API (legacy, kept for reference)
```

### frontend (recommended, self-contained)

- **Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS**
- **Zustand** state (cart, wishlist, theme, auth) persisted to `localStorage`
- **Next.js API Routes** for products & orders — no database required
- 36 sample products, 6 categories, 8 brands
- Homepage: hero carousel, perks bar, popular categories, brands, featured tabs, promo countdown
- Shop: search, category/brand filters, price slider, sorting
- Cart, Wishlist, multi-step Checkout with validation + order confirmation, Deals, About, Contact, Privacy, Terms, Login/Register
- Dark/light mode toggle, fully responsive

```bash
cd frontend
npm install
npm run dev      # → http://localhost:3000
```

### backend (optional)

- Node.js + Express + TypeScript + MongoDB (Mongoose), JWT auth, Stripe & Cloudinary scaffolding

```bash
cd backend
npm install
cp .env.example .env   # configure Mongo + secrets
npm run dev            # → http://localhost:8000
npm run seed           # seed categories/products/users
```

See `frontend/README.md` for full documentation of the storefront (features, structure, design system,
API routes, sample data).