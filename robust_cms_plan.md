# Robust CMS & Future-Proofing Implementation Plan

This plan outlines the steps to transform AmarShop into a production-grade e-commerce platform with automated logistics, communication, and advanced management features.

## 1. Advanced Order Management & Logistics
### Goal: Automate shipping and status tracking.

- [ ] **Database Schema Upgrade**:
    - Add customer details directly to `orders` (name, phone, email, district, area).
    - Add courier fields: `courier_id`, `courier_tracking_id`, `courier_status`.
    - Add financial fields: `shipping_cost`, `discount`, `tax`.
- [ ] **Courier API Integration (Steadfast/Pathao/RedX)**:
    - Create a `CourierService` to handle different providers.
    - Add a "Send to Courier" button in the Filament Order Resource.
    - Automate tracking ID retrieval and status updates via Webhooks.
- [ ] **Webhook Infrastructure**:
    - Create an endpoint `api/v1/webhooks/courier` to receive status updates.
    - Update order status automatically (e.g., Shipped -> Delivered).

## 2. Communication & Automation (SMS API)
### Goal: Instant customer notifications.

- [ ] **SMS API Service**:
    - Integrate with a BD provider (e.g., BulkSMSBD or BoomCast).
    - Create `SmsService` with templates.
- [ ] **Event-Driven Notifications**:
    - `OrderPlaced`: SMS to customer with Order #.
    - `OrderConfirmed`: SMS with expected delivery time.
    - `OrderShipped`: SMS with Tracking Link.
- [ ] **SMS Logs Resource**:
    - Monitor sent/failed SMS messages in Filament.

## 3. Advanced CMS Settings & Configuration
### Goal: Give admin full control without code changes.

- [ ] **Logistics Settings Page**:
    - Configure Courier API Keys, Store ID, and Default Shipping Policy.
- [ ] **SMS Settings Page**:
    - API Credentials, Sender ID, and toggle switches for different notification types.
- [ ] **Webhook Settings**:
    - View/Rotate Webhook Secret keys for security.

## 4. Future-Proofing & Robustness
### Goal: Scalability and stability.

- [ ] **Inventory System**:
    - Automated stock decrement on order placement.
    - Restock logic for cancelled/returned orders.
    - Low stock alerts in Filament Dashboard.
- [ ] **Advanced Analytics Dashboard**:
    - Top selling products/categories.
    - Revenue trends (Daily/Weekly/Monthly).
    - Order conversion rates.
- [ ] **Customer Profile & Auth**:
    - Full React components for `OrderHistory`, `AddressBook`, and `AccountSettings`.
    - Secure JWT/Sanctum based authentication flow.
- [ ] **Invoice Generation**:
    - PDF Invoice generation for both Admin (printing) and Customer (download).

## 5. Security & Maintenance
- [ ] **Role Based Access Control (RBAC)**:
    - Separate permissions for `Super Admin`, `Manager` (no settings access), and `Order Processor` (only order list).
- [ ] **Action Logging**:
    - Track which admin changed an order status or edited a product.

---

## Tasklist for Immediate Execution
1. [ ] **Phase 1: Database & Model Preparation** (Orders & Courier fields).
2. [ ] **Phase 2: Courier & SMS Service Foundations**.
3. [ ] **Phase 3: Filament Settings Pages (Logistics & SMS)**.
4. [ ] **Phase 4: Automated Workflows (Status -> SMS)**.
5. [ ] **Phase 5: Frontend Customer Panel (Order History)**.
