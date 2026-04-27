# AmarShop — Full-Stack E-Commerce Platform

A premium, CMS-driven e-commerce platform built with **Laravel 13** (backend) and **React + Vite** (frontend). Features a Filament admin panel, role-based access control, dynamic product management, and a stunning mobile-first storefront.

---

## 🏗️ Architecture Overview

```
package_lapack5/
├── backend/             # Laravel 13 API + Filament Admin Panel
│   ├── app/
│   │   ├── Filament/    # Admin panel resources (Products, Orders, etc.)
│   │   ├── Http/        # API Controllers (Auth, Frontend, Orders)
│   │   ├── Mail/        # Mailable classes (OrderConfirmation, ContactNotification)
│   │   └── Models/      # Eloquent models (26 entities)
│   ├── database/
│   │   ├── migrations/  # Database schema definitions
│   │   └── seeders/     # Mock data seeders
│   └── routes/api.php   # RESTful API routes
│
├── src/                 # React + Vite Frontend
│   ├── components/      # Reusable UI components
│   ├── pages/           # Route-level page components
│   ├── lib/             # API client, hooks, utilities
│   └── data/            # Legacy mock data (deprecated)
│
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites

| Tool        | Version    | Notes                          |
|-------------|------------|--------------------------------|
| PHP         | ≥ 8.2      | With `pdo_mysql`, `gd`, `mbstring` extensions |
| Composer    | ≥ 2.x      |                                |
| Node.js     | ≥ 18.x     |                                |
| npm         | ≥ 9.x      |                                |
| MySQL       | ≥ 8.0      | Or MariaDB ≥ 10.6             |
| Laragon     | Latest     | Recommended for Windows        |

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
composer install

# Install frontend dependencies
cd ..
npm install
```

### 2. Configure Environment

```bash
# Backend
cp backend/.env.example backend/.env
cd backend
php artisan key:generate
```

Edit `backend/.env` and set your database credentials:

```env
DB_DATABASE=package_lapack5_db
DB_USERNAME=root
DB_PASSWORD=
```

```bash
# Frontend
cp .env.example .env
```

The frontend `.env` defaults to `VITE_API_BASE_URL=http://localhost:8000/api/v1`.

### 3. Database Setup

```bash
cd backend

# Create database (via MySQL CLI or phpMyAdmin)
# CREATE DATABASE package_lapack5_db;

# Run migrations
php artisan migrate

# Seed with demo data
php artisan db:seed

# Create admin user
php artisan make:filament-user
```

### 4. Start Development Servers

```bash
# Terminal 1: Backend (from backend/ directory)
cd backend
php artisan serve

# Terminal 2: Frontend (from root directory)
npm run dev
```

| Service       | URL                           |
|---------------|-------------------------------|
| Frontend      | http://localhost:5173          |
| Backend API   | http://localhost:8000/api/v1   |
| Admin Panel   | http://localhost:8000/admin    |

---

## 🔌 API Endpoints

### Public Endpoints

| Method | Endpoint                | Description              |
|--------|-------------------------|--------------------------|
| GET    | `/settings`             | Site-wide settings       |
| GET    | `/menus`                | Navigation menus         |
| GET    | `/sliders`              | Hero banner slides       |
| GET    | `/categories`           | Product categories       |
| GET    | `/products`             | Products (filterable)    |
| GET    | `/products/{slug}`      | Single product detail    |
| GET    | `/brands`               | Brand listing            |
| GET    | `/blogs`                | Blog posts (paginated)   |
| GET    | `/faqs`                 | Frequently asked questions |
| GET    | `/reviews`              | Client testimonials      |
| GET    | `/pages/{slug}`         | Dynamic CMS pages        |
| GET    | `/payment-methods`      | Active payment methods   |
| GET    | `/shipping-zones`       | Shipping zones & rates   |
| GET    | `/track-order`          | Track order by number    |
| POST   | `/subscribe`            | Newsletter signup        |
| POST   | `/contact`              | Contact form submission  |
| POST   | `/login`                | User authentication      |
| POST   | `/register`             | User registration        |

### Protected Endpoints (require Bearer token)

| Method | Endpoint                | Description              |
|--------|-------------------------|--------------------------|
| POST   | `/logout`               | Logout                   |
| GET    | `/profile`              | Get user profile         |
| PUT    | `/profile`              | Update profile           |
| GET    | `/orders`               | User order history       |
| GET    | `/orders/{id}`          | Order detail             |
| POST   | `/orders`               | Place new order          |

### Product Filters

```
GET /products?category=electronics      # Filter by category slug
GET /products?search=laptop             # Search by name
GET /products?collection=trending       # Collection: trending, new_arrivals, daily_offer, top_sale, best_deals
```

---

## 🛡️ Admin Panel (Filament)

Access: `http://localhost:8000/admin`

### Available Resources

- **Products** — Full CRUD with images, variations, specifications
- **Categories** — Hierarchical parent/child structure
- **Orders** — View, update status, manage items
- **Sliders** — Hero banner management
- **Blog Posts** — Rich text editor with featured images
- **FAQs** — Question & answer management
- **Client Reviews** — Testimonials with approval workflow
- **Brands** — Brand directory with logos
- **Site Settings** — Key-value global configuration
- **Navigation Menus** — Dynamic menu builder
- **Shipping Zones** — Regional shipping rates
- **Payment Methods** — Payment gateway configuration
- **Users** — Customer management
- **Roles & Permissions** — RBAC via Spatie

### Roles

| Role          | Access                                    |
|---------------|-------------------------------------------|
| Super Admin   | Full access to all resources               |
| Editor        | Content management (blogs, FAQs, reviews)  |
| Manager       | Products, orders, and inventory            |

---

## 📧 Email Notifications

The platform sends automated emails for:

1. **Order Confirmation** → Sent to customer after checkout
2. **Contact Form** → Sent to admin (from `site_email` setting)

### Configuration

In `backend/.env`, configure your mail driver:

```env
# Development (writes to storage/logs)
MAIL_MAILER=log

# Production (SMTP)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=postmaster@mg.yourdomain.com
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@amarshop.com.bd"
MAIL_FROM_NAME="AmarShop"
```

---

## 📦 File Storage

### Local Development

Files are stored in `backend/storage/app/public`. Run:

```bash
cd backend
php artisan storage:link
```

### Production (S3)

In `backend/.env`:

```env
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_DEFAULT_REGION=ap-southeast-1
AWS_BUCKET=amarshop-assets
```

---

## 🔍 SEO Features

- **JSON-LD Structured Data** on every page:
  - `Organization` schema (site-wide)
  - `WebSite` schema with search action
  - `Product` schema on product detail pages
  - `BreadcrumbList` schema for navigation
- **Meta Pixel / Tracking Scripts**: Injected dynamically from CMS settings (`tracking_scripts` key)
- **Semantic HTML**: Proper heading hierarchy, semantic elements throughout

---

## 🎨 Frontend Features

- **Mobile-first responsive design** with bottom navigation
- **Dynamic product grids** with collection-based filtering
- **Real-time cart & wishlist** with localStorage persistence
- **Purchase flow** with shipping zones and payment method selection
- **Auth system** with login/register modals (Sanctum tokens)
- **Order tracking** by order number
- **Blog section** with rich content rendering
- **Client testimonials** with video support
- **Newsletter subscription**
- **Contact form** with admin email notifications
- **Smooth animations** via Framer Motion

---

## 🚀 Production Deployment

### Backend

```bash
cd backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
```

### Frontend

```bash
npm run build
# Deploy dist/ folder to your hosting (Vercel, Netlify, S3, etc.)
```

### Environment Checklist

- [ ] `APP_ENV=production`, `APP_DEBUG=false`
- [ ] `APP_URL` set to your production domain
- [ ] Database credentials configured
- [ ] Mail driver set to SMTP with real credentials
- [ ] `FILESYSTEM_DISK=s3` if using cloud storage
- [ ] `FRONTEND_URL` set for CORS
- [ ] Run `php artisan storage:link` on server
- [ ] Set up queue worker: `php artisan queue:work`

---

## 📝 License

This project is proprietary. All rights reserved.
