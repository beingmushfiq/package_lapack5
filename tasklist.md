# AmarShop CMS & Frontend Integration Tasklist

This document serves as the master checklist for migrating the static AmarShop frontend to a dynamic, CMS-driven architecture powered by Laravel and Filament.

## Phase 1: Laravel Backend Setup & Architecture
- [x] Create Laravel project in `backend/` directory
- [x] Configure MySQL database in `.env`
- [x] Install core packages (Sanctum, Intervention Image, Spatie Permission)
- [x] Install and configure Filament Admin Panel v4
- [x] Create initial super-admin user
- [x] Generate initial Model & Migration files for all 26 entities
- [x] Write schema logic for all 26 migration files
- [x] Run migrations to establish the complete database structure
- [x] Create seeders with dummy/initial data (to match current frontend mock data)

## Phase 2: Role-Based Access Control (RBAC)
- [x] Set up `spatie/laravel-permission` models and traits
- [x] Create standard roles (Super Admin, Editor, Vendor/Manager)
- [x] Define granular permissions for all modules (e.g., `view_products`, `edit_products`)
- [x] Integrate RBAC UI into Filament (using a plugin or custom resource)
- [x] Secure all Filament resources based on user permissions

## Phase 3: Filament CMS Resources Construction
- [x] **Site Settings Resource**: Key-value pairs for global config (logo, phone, colors, threshold)
- [x] **Navigation Menu Resource**: Dynamic builder for top/bottom navigation menus
- [x] **Hero Slider Resource**: Image uploads, titles, text, and toggles
- [x] **Category Resource**: Hierarchical structure with parent/child relationships and images
- [x] **Product Resource**: 
    - Basic info (name, price, discount, stock)
    - Rich text description with HTML/JS/CSS support
    - Specifications repeater
    - Variations repeater (colors, sizes)
    - Multiple image uploads
- [x] **Brand Resource**: Name, logo, URL
- [x] **Blog Post Resource**: Title, author, rich text content, featured image
- [x] **FAQ Resource**: Question, answer, ordering
- [x] **Client Review Resource**: Text, reviewer name, rating, YouTube URL
- [x] **Promotional Banner Resource**: Image, link, visibility toggle
- [x] **Page & PageSection Resource**: Modular dynamic pages (for Contact, Help, Custom Pages)
- [x] **Order Management Resource**: View orders, update statuses, view items
- [x] **Customer/User Resource**: View registered users
- [x] **Shipping & Payment Methods Resource**: Configurable options for checkout

## Phase 4: RESTful API Development
- [x] Create `routes/api.php` structure
- [x] Build API Controllers / Resources for public endpoints:
    - [x] `GET /api/settings`
    - [x] `GET /api/menus`
    - [x] `GET /api/sliders`
    - [x] `GET /api/categories` (flat & tree)
    - [x] `GET /api/products` (with filters & pagination)
    - [x] `GET /api/products/{slug}`
    - [x] `GET /api/brands`, `/api/blogs`, `/api/faqs`, `/api/reviews`
    - [x] `GET /api/pages/{slug}`
- [x] Build API endpoints requiring Authentication (Sanctum):
    - [x] Auth: Login, Register, Logout, Profile GET/PUT
    - [x] Cart/Orders: Create Order, View Order History
    - [x] Interactions: Wishlist, Newsletter Subscribe, Contact Form Submit

## Phase 5: Frontend Integration (React/Vite)
- [x] Install API client (Axios) in the frontend application
- [x] Create API service layer (`src/lib/api.ts` or similar)
- [x] Setup global state/context for Site Settings & Auth
- [x] Replace `mockData.ts` with API calls across all components:
    - [x] Update `Navbar` & `Footer` to use dynamic menus & settings
    - [x] Update `HeroBanner`
    - [x] Update `CategorySidebar` and `CategoryList`
    - [x] Update `Home` page product grids
    - [x] Update `ProductDetails` page
    - [x] Update `BlogSection`, `BrandsSection`, `FAQSection`, `ClientReviews`
- [x] Implement Auth flows (Registration & Login modals/pages)
- [x] Connect `PurchasePopup` to the real Order API
- [x] Connect Contact Form & Newsletter to API
- [x] Ensure loading states, error boundaries, and toasts work smoothly
- [x] Connect `WishlistDrawer` to real state/API

## Phase 6: Tracking & Production Polish
- [x] Implement Meta Facebook Pixel integration via CMS `tracking_scripts` in `App.tsx`
- [x] Implement site-wide structured data (JSON-LD) for SEO
- [x] Configure proper local storage vs. S3 bucket behavior via `.env`
- [x] Set up email notifications (Contact forms -> Admin, Order Confirmations)
- [x] Final end-to-end testing of user flows (Checkout, Profile, Tracking)
- [x] Update project `README.md` with full deployment and environment setup instructions
