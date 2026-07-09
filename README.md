# 🍔 Yummix — Multi-Restaurant Food Delivery Platform

<p align="center">

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-Backend-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)
![Stripe](https://img.shields.io/badge/Stripe-Payments-blueviolet?logo=stripe)
![Redis](https://img.shields.io/badge/Upstash_Redis-Caching-DC382D?logo=redis)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Vercel-Serverless-black?logo=vercel)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)
![License](https://img.shields.io/badge/License-MIT-yellow)

</p>

A production-grade **multi-restaurant food delivery platform** built on the **MERN stack** and deployed fully serverless on **Vercel**. Yummix lets customers discover nearby restaurants, order food (online or COD), track deliveries in real time, and cancel with automatic Stripe refunds — backed by a strict order-status ownership model, a decoupled refund state machine, cron-based rider assignment, and Redis-cached read paths.

Five independent apps, one shared backend:

| App | Purpose |
|

## 🌐 Live Demo

| Application | Deployment |
|---|---|
| Customer Frontend | https://yummix-frontend.vercel.app |
| Restaurant Panel | https://yummix-admin.vercel.app |
| Rider Portal | https://rider-eta-rust.vercel.app |
| Super Admin Panel | https://yummixsuperadmin.vercel.app |
| Backend API | https://yummix-backend.vercel.app |

## ✨ Key Highlights

- Production-grade multi-restaurant food delivery platform built with the MERN stack
- Four independent client applications with a shared backend API
- Role-based authentication (Customer, Restaurant, Rider, Super Admin)
- Stripe payments with automatic refund workflow
- Cron-driven rider assignment designed for serverless environments
- Upstash Redis caching for high-traffic read endpoints
- Real-time order lifecycle with strict status ownership
- Docker-ready local development and Vercel deployment

---|---|
| **Customer Frontend** | Browse, order, track, cancel, rate |
| **Restaurant Panel** | Accept/reject orders, manage menu, set location |
| **Rider Portal** | Accept deliveries, track earnings, update status |
| **Super Admin Panel** | Platform-wide oversight: restaurants, riders, orders, refunds, feedback |
| **Backend API** | Node/Express REST API on Vercel serverless functions |

---

## 📚 Table of Contents

* [Overview](#overview)
* [Order Lifecycle & Status Ownership](#order-lifecycle--status-ownership)
* [Cancellation & Refund System](#cancellation--refund-system)
* [Rider Assignment System](#rider-assignment-system)
* [Caching Layer (Redis / Upstash)](#caching-layer-redis--upstash)
* [Feature Breakdown by App](#feature-breakdown-by-app)
* [Architecture](#architecture)
* [Technology Stack](#technology-stack)
* [Project Structure](#project-structure)
* [Installation](#installation)
* [Environment Variables](#environment-variables)
* [Local Development](#local-development)
* [Admin Account Setup](#admin-account-setup)
* [Vercel Deployment Notes](#vercel-deployment-notes)
* [Docker Setup](#docker-setup)
* [API Endpoints](#api-endpoints)
* [Security Features](#security-features)
* [Future Improvements](#future-improvements)
* [Contributing](#contributing)
* [License](#license)
* [Author](#author)

---

## 🚀 Overview

Yummix went through a full production-readiness audit and rebuild cycle — moving from a straightforward CRUD delivery app to a system with explicit actor-ownership rules for every order transition, a payment-safe cancellation flow, and infrastructure choices that actually hold up on serverless (no `setTimeout`-based background jobs, no long-lived Redis connections).

Every design decision below was made to solve a specific real failure mode, not as a generic checklist item — see each section for the "why."

---

## 🔄 Order Lifecycle & Status Ownership

Every order status can only be changed by exactly one actor. No two roles can write to the same field, which eliminates an entire class of race conditions and regressions (e.g. a rider action silently reverting a restaurant's progress).

| Status | Set By |
|---|---|
| Order Placed | System (on order creation) |
| Confirmed | Restaurant |
| Preparing Food | Restaurant |
| Ready for Pickup | Restaurant |
| Waiting for Rider | System (no rider available yet) |
| Rider Assigned | System (auto-assignment) |
| Picked Up | Rider |
| Out for Delivery | Rider |
| Delivered | Rider |
| Cancelled | Customer / System / Admin |
| Rejected | Restaurant |

```
Order Placed
     ↓ (restaurant)
Confirmed
     ↓ (restaurant)               ← Customer cancellation allowed up to here
Preparing Food
     ↓ (restaurant)
Ready for Pickup                  ← Customer cancellation disabled from here
     ↓ (system: auto rider search)
Waiting for Rider  ─┐
     ↓               │ (system retries, capped)
Rider Assigned  ←────┘
     ↓ (rider accepts — no status change)
Picked Up
     ↓ (rider)
Out for Delivery
     ↓ (rider)
Delivered
```

The backend enforces this with an explicit transition table (`RESTAURANT_TRANSITIONS`) — the restaurant's status dropdown becomes **read-only** once an order passes "Ready for Pickup," and the rider's accept-delivery action never touches order status at all (only the assignment record).

---

## 💳 Cancellation & Refund System

Order status and payment/refund status are modeled as **two independent state machines** on the same document. A cancellation always transitions the order immediately — it is never blocked or delayed waiting on Stripe.

| Trigger | Cancel/Reject | Refund | If Refund Fails |
|---|---|---|---|
| Customer cancels *(Order Placed → Preparing Food only)* | Immediate | Auto (Stripe orders only) | Order stays cancelled, `refundFailed: true`, auto-retried, logged for admin |
| Restaurant rejects | Immediate | Auto | Same as above |
| No rider found after 5 attempts | Immediate (system) | Auto | Same as above |
| Admin force-cancels | Immediate | Auto | Same as above |

**Customer-facing states are intentionally minimal**, per product decision — no retry-count noise:
```
🔍 Searching for a delivery partner...
        ↓ (after 5 failed attempts)
We couldn't find a delivery partner.
Your order has been cancelled.
Your refund has been initiated successfully.
```

**Refund failure handling** — no external notification channel is wired up (deliberately, to avoid inventing an unused dependency). Failures are captured as durable, queryable records:
- `order.refundFailed`, `refundRetryCount`, `lastRefundError`, `refundNeedsManualReview` on the order itself
- A separate `adminAlert` collection logs every failed attempt, surfaced in the Super Admin panel's **Refund Alerts** page
- A Vercel Cron job retries failed refunds automatically (capped, then flagged for manual review)

---

## 🛵 Rider Assignment System

Originally built around `setTimeout`-based timeout/reassignment — this **does not work reliably on Vercel serverless**, since function instances are frozen or torn down after the response is sent. Rebuilt around a stateless, cron-driven sweep:

- `assignRiderToOrder` finds the nearest online/available/approved rider (Haversine distance) and creates a `pending` assignment with a `timeoutAt` timestamp — no timer is scheduled in-process.
- A Vercel Cron job (`GET /api/cron/process-assignments`) runs on a schedule, sweeping for:
  - Expired pending assignments → free the rider, try the next-nearest
  - Orders stuck in "Waiting for Rider" → retry assignment
  - Failed refunds → retry
- **`MAX_ASSIGNMENT_RETRIES = 5`** — after 5 failed attempts to find any rider, the order auto-cancels and auto-refunds rather than leaving the customer waiting indefinitely.
- Cron endpoint is protected by a `CRON_SECRET` bearer token, matching what Vercel automatically attaches to scheduled invocations.

---

## ⚡ Caching Layer (Redis / Upstash)

Two read-heavy, low-change-frequency endpoints are cached via **Upstash Redis** — chosen specifically because it's HTTP-REST based, not a persistent TCP connection, which is the correct fit for short-lived serverless functions (a standard `ioredis`-style client would re-establish connections every invocation).

| Cached Endpoint | Key | TTL | Invalidated On |
|---|---|---|---|
| `GET /api/restaurant/list` | `restaurant:list` | 300s | Restaurant register / approve / reject / profile update |
| `GET /api/food/restaurant/:id` | `restaurant:menu:<id>` | 300s | Food add / update / remove / availability toggle (per-restaurant) |

Implementation notes:
- Reusable helpers (`getCache`, `setCache`, `deleteCache`) centralize all Redis logic — no raw client calls scattered across controllers.
- **Redis failures never break the API** — any cache error is caught, logged, and falls straight back to MongoDB.
- Failed or empty responses are never cached — a cache write only happens after a confirmed successful DB read/write.

---

## 🧩 Feature Breakdown by App

### 👤 Customer Frontend
* JWT auth, restaurant discovery within 10km (Haversine), category browsing & search
* Single-restaurant cart enforcement, `FIRST15` coupon (case-normalized, single-use)
* Dynamic delivery fee (₹17 base + ₹4/km beyond 2km), synced between Cart and Checkout
* Stripe or Cash on Delivery
* Order cancellation with real-time refund status
* Full status timeline, live rider info + call button
* Star ratings on delivered items

### 🏪 Restaurant Panel
* Registration with admin approval gate (distinct pending / approved / rejected states)
* Pin exact location via Leaflet map (feeds delivery-fee and 10km-radius calculations)
* Food CRUD with Cloudinary image upload, categories, spice level, tags, availability toggle
* Status control **strictly limited** to Confirmed → Preparing Food → Ready for Pickup → Reject
* Read-only status view once an order passes to rider-owned stages

### 🛵 Rider Portal
* Registration with document upload (Aadhaar, License, Profile), admin-gated verification
* Online/offline toggle (blocked mid-delivery), GPS polling every 30s
* New-assignment alert with 60s accept/reject countdown (fixed: no longer re-vibrates every poll cycle)
* Earnings: ₹4/km + ₹100 bonus every 10 deliveries, 7-day chart
* Cannot alter order status beyond Picked Up → Out for Delivery → Delivered

### 🛡️ Super Admin Panel
* Dedicated `/super-admin` app, gated by `isAdmin: true` on the shared user model
* **Dashboard** — platform-wide revenue, orders, users, monthly chart
* **Restaurants** — view all (any status), approve, reject
* **Riders** — view pending, approve, reject
* **Orders** — view all, force-cancel with refund, retry rider search on stuck orders
* **Refund Alerts** — unresolved refund failures with retry count, mark resolved
* **Feedback** — customer feedback + restaurant partner-request inbox

---

## 🏗 Architecture

```text
        ┌───────────────────────────────────────────────────────┐
        │                  Client Applications                    │
        │  Customer   Restaurant   Rider     Super Admin          │
        │  (5173)     (5174)       (5175)    (5176)               │
        └───────────────────────────┬─────────────────────────────┘
                                     │ HTTPS / REST
                                     ▼
        ┌───────────────────────────────────────────────────────┐
        │        Express API — Vercel Serverless Functions        │
        │                                                         │
        │  Role-based JWT Auth   Order State Machine               │
        │  (user/restaurant/     Refund State Machine (decoupled)  │
        │   rider/admin)         Rider Assignment (cron-driven)    │
        └───────┬───────────────┬───────────────┬─────────────────┘
                ▼               ▼               ▼
        ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────┐
        │ MongoDB Atlas│ │  Cloudinary  │ │    Stripe    │ │ Upstash  │
        │  (Database)  │ │(Image Store) │ │  (Payments)  │ │  Redis   │
        └──────────────┘ └──────────────┘ └──────────────┘ └──────────┘
                                     ▲
                                     │ scheduled sweep
                          Vercel Cron (assignment retry,
                          refund retry, timeout sweep)
```

---

## 🛠 Technology Stack

| Category | Technologies |
|---|---|
| Frontend (all 4 apps) | React 18, Vite, React Router DOM |
| Rider / Customer Styling | Tailwind CSS v4 (rider), plain CSS (customer/restaurant/super-admin) |
| State Management | Context API (per app) |
| HTTP Client | Axios |
| Backend | Node.js, Express.js (Vercel serverless functions) |
| Database | MongoDB, Mongoose |
| Caching | Upstash Redis (`@upstash/redis`, HTTP-REST client) |
| Authentication | JWT, role-scoped (`user` / `restaurant` / `admin` / `rider`) |
| Password Security | bcrypt |
| File Uploads | Multer + Cloudinary |
| Payments | Stripe (Checkout Sessions + Refunds API) + Cash on Delivery |
| Scheduled Jobs | Vercel Cron |
| Maps | React Leaflet + Leaflet.js + OpenStreetMap (no API key required) |
| Notifications (in-app) | React Toastify |
| Deployment | Vercel (all 5 apps) |
| Containerization | Docker, Docker Compose (local dev) |

---

## 📁 Project Structure

```text
yummix/
│
├── frontend/                      # Customer app
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── Context/StoreContext.jsx
│       └── assets/
│
├── admin/                         # Restaurant panel
│   └── src/
│       ├── components/
│       └── pages/
│           ├── RestaurantLocation/
│           ├── Orders/
│           └── Dashboard/
│
├── rider/                         # Rider portal (Tailwind v4)
│   └── src/
│       ├── components/
│       │   ├── AssignmentAlert.jsx
│       │   ├── DeliveryMap.jsx
│       │   └── Layout.jsx
│       ├── pages/
│       ├── context/RiderContext.jsx
│       └── hooks/
│
├── super-admin/                   # Platform oversight panel
│   └── src/
│       ├── components/
│       │   ├── Navbar/
│       │   └── Sidebar/
│       ├── pages/
│       │   ├── Dashboard/
│       │   ├── Restaurants/
│       │   ├── Riders/
│       │   ├── Orders/
│       │   ├── RefundAlerts/
│       │   └── Feedback/
│       └── context/AdminContext.jsx
│
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   ├── cloudinary.js
│   │   └── redis.js
│   ├── controllers/
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── adminAuth.js
│   │   ├── restaurantAuth.js
│   │   └── riderAuth.js
│   ├── models/
│   │   ├── orderModel.js          # 11-state enum, refund fields
│   │   ├── restaurantModel.js     # isApproved + rejected
│   │   ├── riderModel.js
│   │   ├── riderAssignmentModel.js
│   │   ├── riderEarningsModel.js
│   │   ├── adminAlertModel.js     # refund failure log
│   │   └── feedbackModel.js
│   ├── routes/
│   │   └── cronRoute.js
│   ├── services/
│   │   ├── riderAssignmentService.js
│   │   └── refundService.js
│   ├── utils/
│   │   └── cacheHelper.js
│   ├── scripts/
│   │   └── createAdmin.js         # CLI-only admin seeding
│   └── vercel.json                # includes cron schedule
│
└── docker-compose.yml
```

---


## 📋 Prerequisites

Before running the project locally, ensure you have:

- Node.js 20+
- npm 10+
- MongoDB Atlas account
- Cloudinary account
- Stripe account
- Upstash Redis account
- Vercel account (optional for deployment)
- Git


## ⚡ Installation

```bash
git clone https://github.com/Soumitra-Sahoo/Yummix.git
cd Yummix

cd backend && npm install
cd ../frontend && npm install
cd ../admin && npm install
cd ../rider && npm install
cd ../super-admin && npm install
```

---

## 🔐 Environment Variables

### `backend/.env`
```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
UPSTASH_REDIS_REST_URL=your_upstash_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_rest_token
CRON_SECRET=your_random_cron_secret
```

### `frontend/.env`, `admin/.env`, `rider/.env`, `super-admin/.env`
```env
VITE_API_URL=http://localhost:4000
```

---

## 💻 Local Development

```bash
cd backend && npm start           # 4000
cd frontend && npm run dev        # 5173
cd admin && npm run dev           # 5174
cd rider && npm run dev           # 5175
cd super-admin && npm run dev     # 5176
```

---

## 👑 Admin Account Setup

Super-admin accounts are **never** created via an HTTP endpoint — only via a local CLI script, keeping account creation entirely off the deployed API surface.

```bash
cd backend
npm run create-admin
```
Prompts for name, email, and password (min. 8 chars), or pass them as flags:
```bash
node scripts/createAdmin.js --name "Jane Doe" --email jane@yummix.com --password "SomeStrongPass123"
```
If the email already belongs to an existing user, the script promotes that account to admin instead of creating a duplicate.

---

## ▲ Vercel Deployment Notes

- All 5 apps deploy as independent Vercel projects.
- The backend's `vercel.json` includes a `crons` entry pointing at `/api/cron/process-assignments`. **Vercel Hobby plan only supports daily cron schedules** — for the 5-minute interval this system is designed around, either upgrade to Pro or use an external scheduler (e.g. cron-job.org) hitting that endpoint with `Authorization: Bearer <CRON_SECRET>`.
- Set every environment variable (including `CRON_SECRET` and the two Upstash values) in the Vercel project dashboard, not just local `.env` — they are not inherited automatically.
- No `setTimeout`/`setInterval` is used anywhere in backend request handlers — all deferred/repeated work goes through the cron sweep, since serverless function instances are not guaranteed to stay alive after a response is sent.

---

## 🐳 Docker Setup

```bash
docker compose build
docker compose up -d
docker compose down
docker compose logs -f
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/user/register` | Register customer |
| POST | `/api/user/login` | Customer login |
| POST | `/api/admin/login` | Super admin login |
| POST | `/api/restaurant/login` | Restaurant login |
| POST | `/api/rider/login` | Rider login |

### Restaurants
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/restaurant/list` | Approved restaurants *(Redis-cached)* |
| GET | `/api/restaurant/all` | All restaurants, any status *(admin)* |
| GET | `/api/restaurant/pending` | Pending restaurants *(admin)* |
| POST | `/api/restaurant/register` | Register restaurant |
| POST | `/api/restaurant/approve` | Approve restaurant *(admin)* |
| POST | `/api/restaurant/reject` | Reject restaurant *(admin)* |
| POST | `/api/restaurant/location/update` | Set pin location |

### Foods
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/food/list` | All available food items |
| GET | `/api/food/restaurant/:restaurantId` | Restaurant menu *(Redis-cached)* |
| POST | `/api/food/add` | Add food item |
| POST | `/api/food/update` | Update / toggle availability |
| POST | `/api/food/remove` | Remove food item |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/order/place` | Place order (Stripe) |
| POST | `/api/order/place-cod` | Place order (COD) |
| POST | `/api/order/verify` | Verify Stripe payment |
| POST | `/api/order/cancel` | Customer cancellation + auto-refund |
| POST | `/api/order/userorders` | Customer order history |
| POST | `/api/order/restaurant-status` | Restaurant status update (ownership-enforced) |
| GET | `/api/order/restaurant-orders` | Restaurant's order list |
| GET | `/api/order/list` | All orders *(admin)* |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | Platform-wide stats |
| POST | `/api/admin/retry-assignment` | Force-retry rider search |
| POST | `/api/admin/cancel-order` | Force-cancel + refund |
| GET | `/api/admin/refund-alerts` | Unresolved refund failures |
| POST | `/api/admin/refund-alerts/resolve` | Resolve an alert |

### Rider
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/rider/register` | Register with documents |
| GET | `/api/rider/pending` | Pending rider verifications *(admin)* |
| POST | `/api/rider/approve` | Approve rider *(admin)* |
| POST | `/api/rider/reject` | Reject rider *(admin)* |
| POST | `/api/rider/toggle-online` | Go online/offline |
| POST | `/api/rider/update-location` | GPS ping (30s interval) |
| GET | `/api/rider-order/pending-assignment` | Poll for new assignment (8s) |
| POST | `/api/rider-order/accept` | Accept delivery |
| POST | `/api/rider-order/reject` | Reject delivery |
| POST | `/api/rider-order/update-status` | Picked Up / Out for Delivery / Delivered |
| GET | `/api/rider-dashboard` | Earnings + chart |

### Ratings & Feedback
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/rating/submit` | Submit food rating |
| POST | `/api/contact/feedback` | Submit customer feedback |
| POST | `/api/contact/partner` | Submit partner request |
| GET | `/api/contact/list` | All submissions *(admin)* |

### System
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cron/process-assignments` | Scheduled sweep: expired assignments, queued orders, failed refund retries |

---

## 🔒 Security Features

* JWT auth scoped by role (`user` / `restaurant` / `admin` / `rider`) — each middleware rejects tokens issued for a different role
* bcrypt password hashing across all four account types
* Admin accounts creatable only via a local CLI script — zero HTTP-reachable admin-creation surface
* Cron endpoint protected by a bearer-token secret, not publicly triggerable
* Refunds only ever issued server-side against a stored Stripe `payment_intent`, never client-specified
* CORS restricted to known frontend origins
* Cache layer fails closed to MongoDB — a Redis outage degrades performance, never correctness

---


## ⚡ Performance Optimizations

- Redis caching for frequently accessed restaurant and menu endpoints
- Automatic cache invalidation after data mutations
- Stateless serverless architecture optimized for Vercel
- Cron-based background processing instead of in-process timers
- Cloudinary-hosted image delivery
- Graceful fallback to MongoDB if Redis is unavailable

## 📈 Future Improvements

### 🚀 Real-Time Experience
- Socket.io for live rider GPS tracking
- Firebase FCM push notifications
- Live refund and admin alerts

### 💳 Payments & Finance
- Razorpay Payout API for automated rider settlements
- Digital wallet support

### 🤖 AI & Personalization
- AI-powered food recommendations
- Smart search and personalized offers

### 📱 Mobile & User Experience
- Progressive Web App (PWA)
- Multi-language support
- Native mobile application

### 📊 Scalability & DevOps
- k6 load testing and benchmarking
- Advanced monitoring and observability
- CI/CD enhancements


## 🤝 Contributing

```bash
git checkout -b feature/my-feature
git commit -m "Add new feature"
git push origin feature/my-feature
```
Then open a Pull Request describing your changes.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Soumitra Sahoo**

* GitHub: [Soumitra-Sahoo](https://github.com/Soumitra-Sahoo)
* Project: Yummix Food Delivery Platform

---

## ⭐ Support

If you found this project helpful:

* ⭐ Star the repository
* 🍴 Fork the project
* 🚀 Build something awesome with it

---

<p align="center">Built with ❤️ using the MERN Stack</p>