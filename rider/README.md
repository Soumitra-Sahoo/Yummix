# Yummix Rider Portal — Complete Folder Structure

## Install Dependencies First

```bash
# Inside rider/ folder
npm install
```

## rider/ Folder Structure

```
rider/
├── .env                          ← VITE_API_URL=https:/yummix-backend.vercel.app
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── context/
    │   └── RiderContext.jsx      ← Auth, polling, token, online toggle
    ├── hooks/
    │   ├── useDashboard.js       ← Fetch dashboard stats + chart
    │   └── useHistory.js         ← Fetch delivery history
    ├── pages/
    │   ├── Login.jsx
    │   ├── Register.jsx          ← With document uploads
    │   ├── Dashboard.jsx         ← Stats, chart, bonus progress
    │   ├── Orders.jsx            ← Active delivery + map + status update
    │   ├── History.jsx           ← Completed deliveries list
    │   ├── Earnings.jsx          ← Earning breakdown + payout UI
    │   └── Profile.jsx           ← Edit profile + change password
    └── components/
        ├── Layout.jsx            ← Bottom nav + header + online toggle
        ├── StatCard.jsx          ← Reusable stat card
        ├── EarningsChart.jsx     ← Recharts bar chart
        ├── CurrentOrderCard.jsx  ← Active order mini card on dashboard
        ├── DeliveryMap.jsx       ← Leaflet map (restaurant + customer pins)
        └── AssignmentAlert.jsx   ← Full-screen new order popup with 60s timer
```

## backend/ New Files Added

```
backend/
├── models/
│   ├── riderModel.js             ← Rider profile, location, earnings, status
│   ├── riderEarningsModel.js     ← Per-delivery earnings record (₹4/km + bonus)
│   ├── riderAssignmentModel.js   ← Tracks assignment attempts + timeout
│   └── orderModel.js             ← Updated: riderId, customerLocation, extended status
├── controllers/
│   ├── riderController.js        ← Register, login, profile, toggle online, location
│   ├── riderOrderController.js   ← Accept, reject, status update, history
│   └── riderDashboardController.js ← Stats, earnings, chart data
├── middleware/
│   └── riderAuth.js              ← JWT role="rider" verification
├── routes/
│   ├── riderRoute.js
│   ├── riderOrderRoute.js
│   └── riderDashboardRoute.js
└── services/
    └── riderAssignmentService.js ← Auto-assign, haversine, timeout, queue
```

## frontend/ Files Updated

```
frontend/src/
├── Context/
│   └── StoreContext.jsx          ← Added nearbyRestaurants (30km filter), userLocation
├── pages/
│   ├── PlaceOrder/PlaceOrder.jsx ← Sends customerLocation with order
│   └── MyOrders/
│       ├── MyOrders.jsx          ← 7-step timeline + rider info card
│       └── MyOrders.css          ← Timeline + rider card styles
└── components/
    └── RestaurantDisplay/
        ├── RestaurantDisplay.jsx ← Uses nearbyRestaurants, empty state
        └── RestaurantDisplay.css ← Updated with radius note + empty state
```

## admin/ Files Added

```
admin/src/pages/
└── RestaurantLocation/
    └── RestaurantLocation.jsx    ← Map to set restaurant pin location
```

## Key API Endpoints Added

| Method | Endpoint                          | Auth            | Description                    |
|--------|-----------------------------------|-----------------|--------------------------------|
| POST   | /api/rider/register               | None            | Register with documents        |
| POST   | /api/rider/login                  | None            | Login                          |
| GET    | /api/rider/profile                | riderAuth       | Get profile                    |
| POST   | /api/rider/profile/update         | riderAuth       | Update profile                 |
| POST   | /api/rider/change-password        | riderAuth       | Change password                |
| POST   | /api/rider/toggle-online          | riderAuth       | Go online/offline              |
| POST   | /api/rider/update-location        | riderAuth       | Send GPS (every 30s)           |
| GET    | /api/rider-order/pending-assignment | riderAuth     | Poll for new assignment (8s)   |
| GET    | /api/rider-order/assigned         | riderAuth       | Current active order           |
| POST   | /api/rider-order/accept           | riderAuth       | Accept delivery                |
| POST   | /api/rider-order/reject           | riderAuth       | Reject (triggers reassign)     |
| POST   | /api/rider-order/update-status    | riderAuth       | Picked Up / Out / Delivered    |
| GET    | /api/rider-order/history          | riderAuth       | Completed deliveries           |
| GET    | /api/rider-dashboard              | riderAuth       | Dashboard stats + chart        |
| POST   | /api/restaurant/location/update   | restaurantAuth  | Set restaurant pin location    |

## Earning Logic

- **₹4 per km** (restaurant → customer, haversine formula)
- **₹100 bonus** every 10 deliveries (tracked via lifetimeDeliveries % 10)
- Distance fallback: 1km minimum if coordinates missing

## 30km Radius Logic

- On app load, browser asks for user GPS
- All restaurants fetched from backend
- Frontend filters: only restaurants within 30km shown
- Restaurants with no location set → shown to everyone (safe fallback)
- Restaurant sets their pin in admin panel → RestaurantLocation page

## Auto-Assignment Flow

1. Payment verified → `verifyOrder` calls `assignRiderToOrder()`
2. `findNearestRider()` → haversine sort → nearest online+available rider
3. Assignment saved → rider marked unavailable → 60s timeout scheduled
4. Rider polls `/pending-assignment` every 8s → sees new order alert
5. If accepted → order proceeds → status updates flow
6. If rejected/timeout → `findNearestRider()` excludes that rider → next rider assigned
7. If no riders → order queued (`isQueued: true`)
8. When any rider goes online → `processQueuedOrders()` runs

## npm install command for rider/

```bash
cd rider
npm install react react-dom react-router-dom axios react-toastify leaflet react-leaflet recharts lucide-react
npm install -D @vitejs/plugin-react vite tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
