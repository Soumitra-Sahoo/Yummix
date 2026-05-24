# 🍔 Yummix — Full-Stack Food Delivery Platform

Yummix is a production-ready food delivery platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js). The application provides a complete food ordering ecosystem for customers, administrators, and delivery management through secure authentication, real-time order tracking, online payment integration, and scalable backend architecture.

Designed with modern full-stack engineering practices, Yummix focuses on responsiveness, modular architecture, secure API workflows, and seamless user experience across devices.

---

# 🚀 Key Features

## Customer Application
- Secure JWT-based authentication and authorization
- Browse restaurants and dynamic food categories
- Advanced food search and filtering
- Real-time order tracking and status updates
- Secure online payment integration
- Responsive UI optimized for desktop and mobile devices
- Delivery address and order management

---

## Admin Dashboard
- Restaurant, menu, and category management
- Food item CRUD operations
- Order lifecycle management
- Real-time order monitoring
- User and delivery personnel management
- Operational analytics and activity tracking

---

## Backend System
- RESTful API architecture using Express.js
- Modular backend structure for scalability
- MongoDB database integration
- WebSocket-powered real-time communication
- Secure authentication and protected API routes
- Environment-based configuration management

---

# 🏗️ Project Architecture

Yummix follows a modular full-stack architecture designed for maintainability, scalability, and production-level development workflows.

## Frontend (`client/`)
- Component-driven React architecture
- Reusable UI components
- Responsive design system
- API integration layer
- Optimized state management

```bash
client/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   └── utils/
```

## Backend (`server/`)
- RESTful Express.js backend
- Controller-route architecture
- Middleware-based request handling
- Secure JWT authentication
- Real-time update workflows

```bash
server/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
```

## Admin Panel (`admin/`)
- Centralized operational dashboard
- Restaurant and order management system
- Real-time monitoring interface

```bash
admin/
├── components/
└── pages/
```

---

# ⚡ System Design Highlights

- Modular MERN architecture
- Real-time order tracking workflows
- Secure authentication lifecycle
- Scalable REST API design
- Responsive cross-device UI
- Payment gateway integration
- WebSocket-based live updates

---

# 🛠️ Tech Stack

## Frontend
- React.js
- React Router DOM
- Axios
- CSS3
- Tailwind CSS

## Backend
- Node.js
- Express.js
- REST API Architecture

## Database
- MongoDB
- Mongoose

## Authentication & Security
- JWT Authentication
- bcrypt.js Password Hashing
- Protected API Routes

## Payments
- Stripe Payment Gateway

## Cloud & Media Storage
- Cloudinary
- Multer

## Notifications & UI
- React Toastify

## Deployment
- Vercel (Frontend & Admin Panel)
- Render / Vercel (Backend)

## Version Control
- Git & GitHub

---

# 📦 Installation & Setup

## Clone Repository

```bash
git clone <repo-url>
```

## Install Dependencies

### Client
```bash
cd client
npm install
```

### Server
```bash
cd server
npm install
```

### Admin Panel
```bash
cd admin
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file and configure:

```env
MONGODB_URI=
JWT_SECRET=
STRIPE_SECRET_KEY=
PAYPAL_CLIENT_ID=
```

---

# ▶️ Run Application

## Start Frontend
```bash
npm run dev
```

## Start Backend
```bash
npm start
```

## Start Admin Panel
```bash
npm run dev
```

---

# 📌 Future Improvements

- Redis caching layer
- Dockerized deployment
- Kubernetes support
- Push notification system
- AI-powered food recommendations
- Advanced analytics dashboard
- Microservices migration

---

# 🤝 Contribution

Contributions are welcome. Feel free to fork the repository, create a feature branch, and submit a pull request following standard development practices.

---

# 📄 License

This project is licensed under the MIT License.
