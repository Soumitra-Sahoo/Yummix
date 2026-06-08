# 🍔 Yummix — Multi-Restaurant Food Delivery Platform

<p align="center">

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-Backend-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)
![License](https://img.shields.io/badge/License-MIT-yellow)

</p>

A full-stack **multi-restaurant food delivery platform** built using the **MERN Stack**. Yummix enables customers to discover restaurants, browse menus, place orders, manage carts, and track order history while providing dedicated dashboards for restaurant owners and administrators.

Designed with modern full-stack engineering practices, Yummix focuses on scalability, maintainability, responsive design, and secure API architecture.

---

## 📚 Table of Contents

* Overview
* Features
* Architecture
* Technology Stack
* Project Structure
* Installation
* Environment Variables
* Local Development
* Docker Setup
* API Endpoints
* Security Features
* Future Improvements
* Contributing
* License
* Author

---

## 🚀 Overview

Yummix is a complete food delivery ecosystem consisting of:

* Customer Application
* Restaurant Dashboard
* Admin Panel
* REST API Backend

The platform supports multi-restaurant ordering workflows, menu management, secure authentication, image uploads, and order lifecycle management.

---

## ✨ Features

### 👤 Customer Features

* User Registration & Login
* JWT Authentication
* Browse Restaurants
* Restaurant-Specific Menus
* Food Search
* Category Filtering
* Add to Cart
* Update Cart Quantity
* Remove Items from Cart
* Quick Checkout
* Coupon Support
* Place Orders
* Order History
* Responsive Design

---

### 🏪 Restaurant Features

* Restaurant Registration
* Restaurant Authentication
* Restaurant Approval Workflow
* Food Inventory Management
* Food CRUD Operations
* Menu Management
* Image Upload Support
* Restaurant Order Management
* Dashboard Analytics

---

### 👨‍💼 Admin Features

* Admin Authentication
* Dashboard Analytics
* Restaurant Approval System
* Restaurant Monitoring
* Food Monitoring
* Order Management
* Revenue Overview

---

### ⚙️ Backend Features

* RESTful API Architecture
* JWT Security
* Authentication Middleware
* MongoDB Integration
* Cloudinary Image Storage
* Multer File Uploads
* Error Handling
* Environment-Based Configuration

---

## 🏗 Architecture

```text
Frontend (React + Vite)
          │
          ▼
   Express.js API
          │
          ▼
MongoDB Atlas Database

          │
          ├── JWT Authentication
          ├── Cloudinary Storage
          └── Stripe Payment Integration
```

---

## 🛠 Technology Stack

| Category         | Technologies                     |
| ---------------- | -------------------------------- |
| Frontend         | React.js, Vite, React Router DOM |
| State Management | Context API                      |
| HTTP Client      | Axios                            |
| Backend          | Node.js, Express.js              |
| Database         | MongoDB, Mongoose                |
| Authentication   | JWT                              |
| Security         | bcrypt.js                        |
| File Uploads     | Multer                           |
| Media Storage    | Cloudinary                       |
| Payments         | Stripe                           |
| Notifications    | React Toastify                   |
| Deployment       | Vercel, Render, Railway          |
| Containerization | Docker, Docker Compose           |
| Version Control  | Git, GitHub                      |

---

## 📁 Project Structure

```text
food-delivery/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── admin/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── package.json
│
├── docker-compose.yml
├── package.json
└── README.md
```

---

## ⚡ Installation

### Clone Repository

```bash
git clone https://github.com/Soumitra-Sahoo/Yummix.git

cd Yummix
```

---

### Install Dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd backend
npm install
```

#### Admin Panel

```bash
cd admin
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=4000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

STRIPE_SECRET_KEY=your_stripe_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

---

## 💻 Local Development

### Start Backend

```bash
cd backend
npm start
```

Runs on:

```text
http://localhost:4000
```

---

### Start Frontend

```bash
cd frontend
npm run dev
```

Runs on:

```text
http://localhost:5173
```

---

### Start Admin Panel

```bash
cd admin
npm run dev
```

Runs on:

```text
http://localhost:5174
```

---

## 🐳 Docker Setup

### Build Containers

```bash
docker compose build
```

### Start Containers

```bash
docker compose up -d
```

### Stop Containers

```bash
docker compose down
```

### View Running Containers

```bash
docker ps
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint             | Description   |
| ------ | -------------------- | ------------- |
| POST   | `/api/user/register` | Register User |
| POST   | `/api/user/login`    | Login User    |
| POST   | `/api/admin/login`   | Admin Login   |

---

### Restaurants

| Method | Endpoint                   | Description         |
| ------ | -------------------------- | ------------------- |
| GET    | `/api/restaurant/list`     | Get Restaurants     |
| POST   | `/api/restaurant/register` | Register Restaurant |
| POST   | `/api/restaurant/login`    | Restaurant Login    |

---

### Foods

| Method | Endpoint                   | Description     |
| ------ | -------------------------- | --------------- |
| GET    | `/api/food/list`           | Get All Foods   |
| POST   | `/api/food/add`            | Add Food        |
| POST   | `/api/food/remove`         | Remove Food     |
| GET    | `/api/food/restaurant/:id` | Restaurant Menu |

---

### Orders

| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| POST   | `/api/order/place`      | Place Order         |
| POST   | `/api/order/userorders` | User Orders         |
| POST   | `/api/order/status`     | Update Order Status |
| POST   | `/api/order/verify`     | Verify Payment      |

---

## 🔒 Security Features

* JWT Authentication
* Password Hashing with bcrypt
* Protected API Routes
* Secure Environment Variables
* Input Validation
* Secure Database Access
* Authentication Middleware

---

## 📈 Future Improvements

* Redis Caching
* Push Notifications
* AI-Powered Food Recommendations
* Progressive Web App (PWA)
* Advanced Restaurant Analytics
* Live Delivery Tracking
* Multi-Language Support

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

Then create a Pull Request describing your changes.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

### Soumitra Sahoo

* GitHub: https://github.com/Soumitra-Sahoo
* Project: Yummix Food Delivery Platform

---

## ⭐ Support

If you found this project helpful:

* ⭐ Star the repository
* 🍴 Fork the project
* 🚀 Build something awesome with it

---

<p align="center">
Built with ❤️ using the MERN Stack
</p>
