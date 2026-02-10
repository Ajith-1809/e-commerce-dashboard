DROP TABLE IF EXISTS customer_orders;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS dashboard_stats;
DROP TABLE IF EXISTS top_cities;
DROP TABLE IF EXISTS user_info;

CREATE TABLE IF NOT EXISTS user_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    roles VARCHAR(255)
);

-- 1. Products Table
CREATE TABLE IF NOT EXISTS product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    price VARCHAR(50),
    stock INT,
    status VARCHAR(50)
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS customer_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50),
    customer VARCHAR(255),
    location VARCHAR(255),
    amount VARCHAR(50),
    status VARCHAR(50)
);

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

-- 4. Top Cities Table
CREATE TABLE IF NOT EXISTS top_cities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(100),
    sales INT
);
