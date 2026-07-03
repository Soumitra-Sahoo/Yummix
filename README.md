# 🍔 Yummix — Multi-Restaurant Food Delivery Platform

<p align="center">

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-Backend-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)
![Stripe](https://img.shields.io/badge/Stripe-Payments-blueviolet?logo=stripe)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)
![License](https://img.shields.io/badge/License-MIT-yellow)

</p>

A production-grade **multi-restaurant food delivery platform** built using the **MERN Stack**. Yummix enables customers to discover nearby restaurants, browse menus, place orders (online or COD), and track deliveries in real-time — while providing dedicated dashboards for restaurant owners, administrators, and delivery riders.

Designed with modern full-stack engineering practices: scalable REST APIs, JWT-based role authentication, auto rider assignment, dynamic delivery fee calculation, and Cloudinary media storage.

---

## 📚 Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Architecture](#architecture)
* [Technology Stack](#technology-stack)
* [Project Structure](#project-structure)
* [Installation](#installation)
* [Environment Variables](#environment-variables)
* [Local Development](#local-development)
* [Docker Setup](#docker-setup)
* [API Endpoints](#api-endpoints)
* [Security Features](#security-features)
* [Future Improvements](#future-improvements)
* [Contributing](#contributing)
* [License](#license)
* [Author](#author)

---

## 🚀 Overview

Yummix is a complete food delivery ecosystem consisting of four separate applications:

| App | Port | Description |
|-----|------|-------------|
| **Customer Frontend** | 5173 | Customer-facing ordering app |
| **Admin Panel** | 5174 | Restaurant owner dashboard |
| **Rider Portal** | 5175 | Delivery partner app (React + Tailwind v4) |
| **Backend API** | 4000 | Node.js + Express REST API |

The platform supports multi-restaurant ordering, real-time order tracking, automatic rider assignment, dynamic delivery fees, COD payments, and a full 7-step order status pipeline.

---

## ✨ Features

### 👤 Customer Features

* User Registration & Login (JWT)
* Browse Restaurants within **10km radius** (Haversine formula)
* Restaurant-specific menus with food categories, ratings, tags
* Food search and category filtering
* Add to cart (single restaurant enforcement)
* Dynamic delivery fee (₹17 base + ₹4/km beyond 2km)
* Coupon support (`FIRST15` — 15% off first order)
* **Two payment methods: Stripe (online) & Cash on Delivery (COD)**
* 7-step real-time order tracking timeline
* Live rider info (name, phone, vehicle number, call button)
* Rate delivered food items (star ratings)
* Order history with expandable details
* Empty cart state with Browse Menu CTA
* Auto-fill delivery address using GPS

---

### 🏪 Restaurant Features

* Restaurant Registration & Login
* Admin approval workflow
* **Set exact restaurant pin location** (Leaflet map, GPS button)
* Food CRUD with image upload (Cloudinary)
* 15 food categories, spice level, prep time, tags, availability toggle
* Full order management with **7-status dropdown**
* View rider assigned to each order
* Dashboard analytics (revenue, orders, top items)

---

### 👨‍💼 Admin Features

* Admin authentication
* Dashboard analytics (total revenue, orders, restaurants, users)
* Restaurant approval / rejection
* Food monitoring across all restaurants
* Order management with status control
* Revenue overview

---

### 🛵 Rider Portal Features

* Rider registration with document uploads (Aadhaar, License, Profile photo)
* JWT authentication with role-based access (`role: "rider"`)
* Manual verification via MongoDB (`verificationStatus: "approved"`)
* **Auto-assignment**: nearest available rider assigned on payment
* 60-second accept/reject countdown with reassignment on timeout
* Queued order processing when rider comes online
* Earnings: **₹4/km** (restaurant → customer) + **₹100 bonus** every 10 deliveries
* Leaflet.js delivery map (restaurant pin + customer pin)
* Google Maps navigation link
* GPS location polling every 30 seconds
* New order alert with vibration + sound
* Online/Offline toggle
* Delivery history, earnings chart (Recharts), profile management
* Withdrawal button (UI — payout integration ready)

---

### ⚙️ Backend Features

* RESTful API (MVC architecture)
* JWT authentication with role-based middleware (`user`, `restaurant`, `admin`, `rider`)
* MongoDB with Mongoose ODM
* Cloudinary image storage (multi-file upload for riders)
* Stripe payment integration
* **COD order flow** (skips Stripe, directly triggers rider assignment)
* Auto-assign nearest rider (Haversine sort)
* 60s timeout + reassignment service
* Queued order system for when no riders are available
* Dynamic delivery fee calculated server-side
* Input validation, error handling, CORS configuration

---

## 🏗 Architecture

```text
                    ┌─────────────────────────────────────┐
                    │         Client Applications          │
                    │                                     │
                    │  Frontend    Admin     Rider Portal  │
                    │  (5173)     (5174)     (5175)        │
                    └──────────────┬──────────────────────┘
                                   │ HTTP / REST
                                   ▼
                    ┌─────────────────────────────────────┐
                    │         Express.js REST API          │
                    │              (4000)                  │
                    │                                     │
                    │  ┌──────────┐  ┌─────────────────┐  │
                    │  │   Auth   │  │  Assignment Svc  │  │
                    │  │ JWT/Role │  │ Haversine + Queue│  │
                    │  └──────────┘  └─────────────────┘  │
                    └──────────────┬──────────────────────┘
                                   │
              ┌────────────────────┼─────────────────────┐
              ▼                    ▼                      ▼
     ┌──────────────┐    ┌──────────────────┐   ┌──────────────┐
     │ MongoDB Atlas│    │    Cloudinary    │   │    Stripe    │
     │  (Database)  │    │ (Image Storage)  │   │  (Payments)  │
     └──────────────┘    └──────────────────┘   └──────────────┘
```

---

## 🛠 Technology Stack

| Category | Technologies |
|----------|-------------|
| Frontend | React 18, Vite, React Router DOM, Plain CSS |
| Rider Portal | React 18, Vite, **Tailwind CSS v4**, Leaflet.js, Recharts |
| State Management | Context API |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT (role-based: user / restaurant / admin / rider) |
| Security | bcrypt.js |
| File Uploads | Multer + Cloudinary |
| Payments | Stripe + Cash on Delivery (COD) |
| Maps | Leaflet.js + OpenStreetMap (free, no API key) |
| Notifications | React Toastify |
| Deployment | Vercel (frontend/admin/rider), Railway/Render (backend) |
| Containerization | Docker, Docker Compose |
| Version Control | Git, GitHub |

---

## 📁 Project Structure

```text
food-delivery/
│
├── frontend/                     # Customer app (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── Context/StoreContext.jsx
│   │   └── assets/
│   └── package.json
│
├── admin/                        # Restaurant admin (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── RestaurantLocation/   # Leaflet pin map
│   │   │   ├── Orders/
│   │   │   └── Dashboard/
│   └── package.json
│
├── rider/                        # Rider portal (React + Vite + Tailwind v4)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AssignmentAlert.jsx   # New order popup with countdown
│   │   │   ├── DeliveryMap.jsx       # Leaflet map
│   │   │   └── Layout.jsx
│   │   ├── pages/
│   │   ├── context/RiderContext.jsx
│   │   └── hooks/
│   └── package.json
│
├── backend/                      # Express REST API
│   ├── config/
│   ├── controllers/
│   │   ├── orderController.js        # Stripe + COD
│   │   ├── riderController.js
│   │   ├── riderOrderController.js   # Accept/reject/status
│   │   └── riderDashboardController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── adminAuth.js
│   │   ├── restaurantAuth.js
│   │   └── riderAuth.js
│   ├── models/
│   │   ├── orderModel.js             # paymentMethod: stripe | cod
│   │   ├── riderModel.js
│   │   ├── riderEarningsModel.js     # Per-delivery earnings
│   │   └── riderAssignmentModel.js   # Assignment + timeout tracking
│   ├── routes/
│   ├── services/
│   │   └── riderAssignmentService.js # Haversine, auto-assign, queue
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## ⚡ Installation

### Clone Repository

```bash
git clone https://github.com/Soumitra-Sahoo/Yummix.git
cd Yummix
```

### Install Dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install

# Admin Panel
cd ../admin && npm install
# Install Leaflet for restaurant location map
npm install leaflet react-leaflet

# Rider Portal
cd ../rider && npm install
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
```

### `frontend/.env`

```env
VITE_API_URL=http://localhost:4000
```

### `rider/.env`

```env
VITE_API_URL=http://localhost:4000
```

---

## 💻 Local Development

```bash
# Backend (port 4000)
cd backend && npm start

# Frontend (port 5173)
cd frontend && npm run dev

# Admin Panel (port 5174)
cd admin && npm run dev

# Rider Portal (port 5175)
cd rider && npm run dev
```

---

## 🛵 Rider Setup (First Time)

1. Register at `http://localhost:5175/register` (upload Aadhaar, License, Profile photo)
2. In MongoDB Atlas → `riders` collection → set `verificationStatus: "approved"` manually
3. Login → click **Online** toggle → allow browser location permission
4. Place a test order from frontend — rider receives assignment alert within 8 seconds

---

## 🐳 Docker Setup

```bash
# Build and start all containers
docker compose build
docker compose up -d

# Stop containers
docker compose down

# View logs
docker compose logs -f
```

---

## 📡 API Endpoints

### User Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/user/register` | Register user |
| POST | `/api/user/login` | Login user |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/dashboard` | Dashboard stats |

### Restaurants

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/restaurant/list` | All approved restaurants |
| POST | `/api/restaurant/register` | Register restaurant |
| POST | `/api/restaurant/login` | Restaurant login |
| POST | `/api/restaurant/location/update` | Set pin location |

### Foods

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/food/list` | All food items |
| POST | `/api/food/add` | Add food (with image) |
| POST | `/api/food/remove` | Remove food |
| GET | `/api/food/restaurant/:id` | Restaurant menu |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/order/place` | Place order (Stripe) |
| POST | `/api/order/place-cod` | Place order (COD) |
| POST | `/api/order/verify` | Verify Stripe payment |
| POST | `/api/order/userorders` | User order history |
| POST | `/api/order/status` | Update status (admin) |

### Rider

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/rider/register` | Register with documents |
| POST | `/api/rider/login` | Rider login |
| GET | `/api/rider/profile` | Get profile |
| POST | `/api/rider/toggle-online` | Go online/offline |
| POST | `/api/rider/update-location` | Send GPS (every 30s) |
| GET | `/api/rider-order/pending-assignment` | Poll for new order (8s) |
| POST | `/api/rider-order/accept` | Accept delivery |
| POST | `/api/rider-order/reject` | Reject delivery |
| POST | `/api/rider-order/update-status` | Update delivery status |
| GET | `/api/rider-dashboard` | Dashboard stats + chart |

### Ratings

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/rating/submit` | Submit food rating |
| POST | `/api/rating/order/:orderId` | Get order ratings |

---

## 🔒 Security Features

* JWT authentication with role-based middleware
* Password hashing with bcrypt
* Protected API routes per role (user / restaurant / admin / rider)
* Secure environment variables
* Input validation
* CORS configured for all three frontend origins
* Multi-file upload validation (Cloudinary)

---

## 📈 Future Improvements

* **Socket.io** — real-time live rider GPS tracking
* **Firebase FCM** — push notifications for order updates
* **Razorpay Payout API** — automated weekly rider payouts
* **Redis** — caching for food list and restaurant data
* **Twilio / MSG91** — OTP verification for riders
* **PWA** — installable mobile app experience
* **AI recommendations** — personalized food suggestions
* **Multi-language** — Hindi and regional language support

---

## 🤝 Contributing

Contributions are welcome.

```bash
# Create a feature branch
git checkout -b feature/my-feature

# Commit changes
git commit -m "Add new feature"

# Push branch
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
