# Shopcart - Full-Stack E-Commerce Platform

A complete, production-quality e-commerce website built for **Shopcart** with Next.js, React, TypeScript, Tailwind CSS, Node.js, Express.js, MongoDB, and Mongoose.

## Features

### Customer Features
- Product browsing with categories, search, filtering, and sorting
- Product detail pages with image gallery, specifications, and reviews
- Shopping cart with quantity management
- Wishlist functionality
- Multi-step checkout process
- User registration and authentication
- Order history and tracking
- Profile management and password changes
- Product reviews and ratings

### Admin Features
- Dashboard with sales, orders, customers, and products statistics
- Product management (CRUD with image upload)
- Category management (CRUD)
- Order management (status updates, payment status)
- User management (role changes, account activation/deactivation)

### Technical Features
- JWT authentication with httpOnly cookies
- Role-based authorization (customer/admin)
- RESTful API with proper error handling
- MongoDB with Mongoose ODM
- Image upload with Cloudinary integration
- Stripe payment integration (ready for production)
- Responsive design (mobile, tablet, desktop)
- Framer Motion animations
- SEO optimized with metadata

## Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 3**
- **Framer Motion** (animations)
- **React Icons**
- **Axios** (HTTP client)
- **React Hot Toast** (notifications)

### Backend
- **Node.js** with **Express 5**
- **TypeScript**
- **MongoDB** with **Mongoose 8**
- **JWT** authentication
- **bcryptjs** (password hashing)
- **Cloudinary** (image storage)
- **Stripe** (payment processing)
- **Helmet** (security headers)
- **CORS** (cross-origin resource sharing)
- **Morgan** (HTTP logging)

## Project Structure

```
ShopCart/
├── frontend/                    # Next.js frontend
│   ├── src/
│   │   ├── app/                # Next.js App Router pages
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── shop/           # Shop page
│   │   │   ├── products/       # Product detail
│   │   │   ├── cart/           # Shopping cart
│   │   │   ├── checkout/       # Checkout flow
│   │   │   ├── auth/           # Login/Register
│   │   │   ├── profile/        # User profile
│   │   │   ├── orders/         # Order history
│   │   │   ├── wishlist/       # Wishlist
│   │   │   ├── admin/          # Admin dashboard
│   │   │   ├── about/          # About page
│   │   │   ├── contact/        # Contact page
│   │   │   ├── privacy/        # Privacy policy
│   │   │   └── terms/          # Terms & conditions
│   │   ├── components/         # React components
│   │   │   ├── layout/         # Header, Footer
│   │   │   └── ui/             # ProductCard, StarRating, etc.
│   │   ├── contexts/           # Auth, Cart, Wishlist contexts
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # API client
│   │   └── types/              # TypeScript types
│   └── package.json
│
├── backend/                     # Express.js backend
│   ├── src/
│   │   ├── config/             # DB, Cloudinary, Stripe config
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/         # Auth, error handling, upload
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # API routes
│   │   ├── utils/              # Helpers
│   │   ├── seed.ts             # Database seeder
│   │   └── server.ts           # Entry point
│   └── package.json
│
├── package.json                 # Root package.json
├── .env                         # Environment variables
├── .env.example                 # Environment template
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone and Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables

Copy the example env file and configure:

```bash
cp .env.example .env
```

Edit `backend/.env` with your values:

```env
DATABASE_URI=mongodb://localhost:27017/shopcart
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:3000
```

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- Admin account: `admin@shopcart.com` / `Admin123!`
- Demo customer: `customer@example.com` / `Customer123!`
- 9 categories
- 24+ products with images
- Sample reviews

### 4. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Health Check**: http://localhost:8000/api/health

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| PUT | `/api/auth/change-password` | Change password |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (with filters) |
| GET | `/api/products/featured` | Featured products |
| GET | `/api/products/new-arrivals` | New arrivals |
| GET | `/api/products/best-sellers` | Best sellers |
| GET | `/api/products/search?q=` | Search products |
| GET | `/api/products/:id` | Get product by ID |
| GET | `/api/products/slug/:slug` | Get product by slug |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List categories |
| POST | `/api/categories` | Create category (admin) |
| PUT | `/api/categories/:id` | Update category (admin) |
| DELETE | `/api/categories/:id` | Delete category (admin) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get cart |
| POST | `/api/cart` | Add to cart |
| PUT | `/api/cart/:productId` | Update quantity |
| DELETE | `/api/cart/:productId` | Remove from cart |
| DELETE | `/api/cart` | Clear cart |

### Wishlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wishlist` | Get wishlist |
| POST | `/api/wishlist` | Add to wishlist |
| DELETE | `/api/wishlist/:productId` | Remove from wishlist |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order |
| GET | `/api/orders/my` | Get my orders |
| GET | `/api/orders/:id` | Get order by ID |
| GET | `/api/orders` | Get all orders (admin) |
| PUT | `/api/orders/:id/status` | Update order status (admin) |
| PUT | `/api/orders/:id/payment` | Update payment status (admin) |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews/product/:productId` | Get product reviews |
| POST | `/api/reviews/product/:productId` | Create review |
| PUT | `/api/reviews/:id` | Update review |
| DELETE | `/api/reviews/:id` | Delete review |

### Users (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List users |
| GET | `/api/users/dashboard/stats` | Dashboard statistics |
| GET | `/api/users/dashboard/recent-orders` | Recent orders |
| GET | `/api/users/dashboard/sales-chart` | Sales chart data |
| PUT | `/api/users/:id/role` | Update user role |
| PUT | `/api/users/:id/active` | Toggle user active |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create-payment-intent` | Create payment intent |
| POST | `/api/payments/create-checkout-session` | Create checkout session |
| POST | `/api/payments/webhook` | Stripe webhook |

## Cloudinary Setup

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Add them to your `.env` file

## Stripe Setup

1. Create account at [stripe.com](https://stripe.com)
2. Get your test keys from the dashboard
3. Add `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY` to `.env`
4. For webhooks, use Stripe CLI: `stripe listen --forward-to localhost:8000/api/payments/webhook`

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in environment
2. Use strong JWT secrets
3. Enable CORS only for your production domain
4. Use MongoDB Atlas or similar managed database
5. Set up proper Cloudinary and Stripe production keys

### Frontend
1. Deploy to Vercel, Netlify, or similar
2. Set `NEXT_PUBLIC_API_URL` to your production backend URL
3. Run `npm run build` to verify the build

## License

This project is built for Mc Joseph Moyo. All rights reserved.
