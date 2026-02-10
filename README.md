# 🚀 E-Commerce Dashboard System

![Project Banner](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-orange?style=for-the-badge)

> A modern, full-stack E-Commerce Administration Dashboard built for seamless business management, featuring real-time analytics, dynamic reporting, and a robust backend.

---

## 🛠️ Technology Stack

### Frontend 🎨
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Material UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

### Backend ⚙️
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Hibernate](https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=hibernate&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white)

---

## ✨ Key Features

### 📊 Dynamic Dashboard
- **Real-time Analytics**: Live calculation of Total Revenue, Active Orders, and Customer Growth directly from the database.
- **Interactive Charts**: Visual representation of sales trends and category distribution.
- **Top Cities**: Geolocated sales performance tracking.

### 💰 Global Currency & Settings
- **Multi-Currency Support**: Dynamically switch between ₹, $, €, £, ¥.
- **Consistent Formatting**: Selected currency symbol reflects instantly across all tables, reports, and inputs.
- **Persisted Settings**: User preferences are saved locally for a personalized experience.

### 📄 Advanced Reporting Functionality
- **PDF Generation**: Robust export of Order Invoices and Product Lists using `jspdf`.
- **Custom Templates**: Multiple invoice styles (Standard, Indian GST, Corporate, etc.).
- **Live Preview**: Preview document templates with real data before generating.

### 📦 Inventory & Order Management
- **Product Catalog**: Add, Edit, Delete, and View products with rich details.
- **Order Processing**: Comprehensive order workflow (Pending -> Processing -> Shipped -> Delivered).
- **Customer CRM**: Manage customer details and view purchase history.

---

## 📂 Project Structure

```bash
e-commerce-dashboard/
├── src/
│   ├── components/       # UI Components (Dashboard, Products, Orders, etc.)
│   ├── utils/            # Utilities (Report Generation, PDF Templates)
│   ├── App.jsx           # Main Application Entry
│   └── main/java/        # Spring Boot Backend Source
│       └── com/example/ecommerce/
│           ├── controller/   # REST API Controllers
│           ├── service/      # Business Logic & Calculations
│           ├── repository/   # JPA Repositories
│           └── entity/       # Database Entities (Order, Product, Customer)
└── pom.xml               # Maven Dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js & npm
- Java JDK 17+
- MySQL Server

### 1️⃣ Backend Setup (Spring Boot)
1.  Configure your MySQL database in `src/main/resources/application.properties`.
2.  Run the application:
    ```bash
    mvn spring-boot:run
    ```
    *The server will start on port `8080`.*

### 2️⃣ Frontend Setup (React + Vite)
1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```
    *The application will optionally open at `http://localhost:5173`.*

---

## REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Get aggregated revenue, orders, and customer stats |
| `GET` | `/api/products` | Retrieve all products |
| `POST` | `/api/orders` | Create a new order |
| `PUT` | `/api/customers/{id}` | Update customer details |
| `GET` | `/api/dashboard/top-cities` | Get sales performance by city |

---

## 🎨 UI & UX Design
- **Glassmorphism**: Modern, translucent UI elements using `backdrop-filter`.
- **Animations**: Smooth transitions powered by `framer-motion`.
- **Responsive**: Fully optimized for Desktop, Tablet, and Mobile layouts.

---

<p align="center">
  Made with ❤️ by the <b>Deepmind Advanced Coding Developer</b>
</p>
