DELETE FROM user_info WHERE name = 'admin';
INSERT INTO user_info (name, email, password, roles) VALUES ('admin', 'admin@example.com', 'admin', 'ROLE_ADMIN');

INSERT INTO product (name, category, price, stock, status) VALUES
('Wireless Earbuds', 'Electronics', '₹ 2,499', 120, 'In Stock'),
('Smart Watch', 'Electronics', '₹ 3,999', 45, 'Low Stock'),
('Running Shoes', 'Fashion', '₹ 1,899', 80, 'In Stock'),
('Leather Wallet', 'Accessories', '₹ 899', 200, 'In Stock'),
('Gaming Mouse', 'Electronics', '₹ 1,299', 0, 'Out of Stock'),
('Backpack', 'Fashion', '₹ 1,499', 60, 'In Stock'),
('Sunglasses', 'Accessories', '₹ 999', 30, 'Low Stock'),
('Bluetooth Speaker', 'Electronics', '₹ 2,199', 90, 'In Stock');

INSERT INTO customer_orders (order_id, customer, location, amount, status) VALUES
('#ORD-7782', 'Aarav Patel', 'Mumbai, MH', '₹ 12,500', 'Delivered'),
('#ORD-7783', 'Diya Sharma', 'Bengaluru, KA', '₹ 8,200', 'Processing'),
('#ORD-7784', 'Vihaan Singh', 'Delhi, DL', '₹ 45,000', 'Shipped'),
('#ORD-7785', 'Ananya Gupta', 'Jaipur, RJ', '₹ 2,100', 'Pending'),
('#ORD-7786', 'Aditya Kumar', 'Chennai, TN', '₹ 15,300', 'Delivered');

INSERT INTO dashboard_stats (id, revenue, revenue_trend, orders, orders_trend, customers, customers_trend, growth, growth_trend) VALUES 
(1, '₹ 45,23,000', '+12.5%', '1,240', '+5.2%', '345', '+18.0%', '24%', '+2.4%');

INSERT INTO top_cities (city, sales) VALUES 
('Mumbai', 85),
('Bengaluru', 72),
('Delhi', 65),
('Hyderabad', 45);
