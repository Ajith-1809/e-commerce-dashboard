CREATE DATABASE IF NOT EXISTS ecommerce_dashboard;
USE ecommerce_dashboard;

-- 1. Products Table
CREATE TABLE IF NOT EXISTS product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    price VARCHAR(50),
    stock INT,
    status VARCHAR(50)
);

INSERT INTO product (name, category, price, stock, status) VALUES
('Wireless Earbuds', 'Electronics', '₹ 2,499', 120, 'In Stock'),
('Smart Watch', 'Electronics', '₹ 3,999', 45, 'Low Stock'),
('Running Shoes', 'Fashion', '₹ 1,899', 80, 'In Stock'),
('Leather Wallet', 'Accessories', '₹ 899', 200, 'In Stock'),
('Gaming Mouse', 'Electronics', '₹ 1,299', 0, 'Out of Stock'),
('Backpack', 'Fashion', '₹ 1,499', 60, 'In Stock'),
('Sunglasses', 'Accessories', '₹ 999', 30, 'Low Stock'),
('Bluetooth Speaker', 'Electronics', '₹ 2,199', 90, 'In Stock');

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS customer_orders (
    id VARCHAR(50) PRIMARY KEY,
    customer VARCHAR(255),
    location VARCHAR(255),
    amount VARCHAR(50),
    status VARCHAR(50)
);

INSERT INTO customer_orders (id, customer, location, amount, status) VALUES
('#ORD-7782', 'Aarav Patel', 'Mumbai, MH', '₹ 12,500', 'Delivered'),
('#ORD-7783', 'Diya Sharma', 'Bengaluru, KA', '₹ 8,200', 'Processing'),
('#ORD-7784', 'Vihaan Singh', 'Delhi, DL', '₹ 45,000', 'Shipped'),
('#ORD-7785', 'Ananya Gupta', 'Jaipur, RJ', '₹ 2,100', 'Pending'),
('#ORD-7786', 'Aditya Kumar', 'Chennai, TN', '₹ 15,300', 'Delivered');

-- 3. Dashboard Stats Table (for the summary cards)
CREATE TABLE IF NOT EXISTS dashboard_stats (
    id INT PRIMARY KEY,
    revenue VARCHAR(50),
    revenue_trend VARCHAR(20),
    orders VARCHAR(50),
    orders_trend VARCHAR(20),
    customers VARCHAR(50),
    customers_trend VARCHAR(20),
    growth VARCHAR(50),
    growth_trend VARCHAR(20)
);

INSERT INTO dashboard_stats (id, revenue, revenue_trend, orders, orders_trend, customers, customers_trend, growth, growth_trend) VALUES 
(1, '₹ 45,23,000', '+12.5%', '1,240', '+5.2%', '345', '+18.0%', '24%', '+2.4%');

-- 4. Top Cities Table
CREATE TABLE IF NOT EXISTS top_cities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(100),
    sales INT
);

INSERT INTO top_cities (city, sales) VALUES 
('Mumbai', 85),
('Bengaluru', 72),
('Delhi', 65),
('Hyderabad', 45);