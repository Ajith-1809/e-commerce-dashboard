package com.example.ecommerce.service;

import com.example.ecommerce.entity.DashboardStats;
import com.example.ecommerce.entity.Order;
import com.example.ecommerce.entity.TopCity;
import com.example.ecommerce.entity.UserInfo;
import com.example.ecommerce.repository.CustomerRepository;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserInfoRepository userInfoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public DashboardStats getStats() {
        List<Order> orders = orderRepository.findAll();
        long customerCount = customerRepository.count();
        long orderCount = orders.size();

        double totalRevenue = 0;
        for (Order order : orders) {
            if (order.getAmount() != null) {
                // Robust parsing: Remove all non-numeric characters except dot
                String amountStr = order.getAmount().replaceAll("[^\\d.]", "");
                if (!amountStr.isEmpty()) {
                    try {
                        totalRevenue += Double.parseDouble(amountStr);
                    } catch (NumberFormatException e) {
                        // ignore malformed amounts
                    }
                }
            }
        }

        DashboardStats stats = new DashboardStats();
        // we return raw numbers or formatted strings? The frontend expects strings with
        // symbols often,
        // but now frontend handles formatting. Let's return clean strings or formatted
        // with default.
        // Actually frontend `Dashboard.jsx` replaces '₹' with selected currency.
        // So we should send a generic format or just the number.
        // The current entity `DashboardStats` has String fields.
        // Let's send with a default symbol '₹' which frontend will replace, to maintain
        // compatibility.
        // Or better, send generic "$ " and frontend replaces it.
        // The frontend `formatValue` replaces `[₹$€£¥]` so sending `₹` is fine.

        stats.setRevenue(String.format("₹ %.2f", totalRevenue));
        stats.setOrders(String.valueOf(orderCount));
        stats.setCustomers(String.valueOf(customerCount));

        // Mock trends for now (requires historical data structure not present)
        stats.setRevenueTrend("+0%");
        stats.setOrdersTrend("+0%");
        stats.setCustomersTrend("+0%");
        stats.setGrowth("0%");
        stats.setGrowthTrend("+0%");

        return stats;
    }

    public List<TopCity> getTopCities() {
        List<Order> orders = orderRepository.findAll();
        if (orders.isEmpty())
            return new ArrayList<>();

        Map<String, Long> cityCounts = orders.stream()
                .filter(o -> o.getLocation() != null && !o.getLocation().isEmpty())
                .collect(Collectors.groupingBy(Order::getLocation, Collectors.counting()));

        long totalOrders = orders.size();

        return cityCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(entry -> {
                    long count = entry.getValue();
                    int percentage = (int) ((count * 100) / totalOrders);
                    return new TopCity(entry.getKey(), (int) count, percentage + "%");
                })
                .collect(Collectors.toList());
    }

    public com.example.ecommerce.entity.AnalyticsData getAnalyticsData() {
        // Keeping mock data for charts as implementing real time-series aggregation
        // requires more complex SQL/Logic not requested yet.
        List<com.example.ecommerce.entity.AnalyticsData.SalesData> salesData = List.of(
                new com.example.ecommerce.entity.AnalyticsData.SalesData("Jan", 4000, 2400),
                new com.example.ecommerce.entity.AnalyticsData.SalesData("Feb", 3000, 1398),
                new com.example.ecommerce.entity.AnalyticsData.SalesData("Mar", 2000, 9800),
                new com.example.ecommerce.entity.AnalyticsData.SalesData("Apr", 2780, 3908),
                new com.example.ecommerce.entity.AnalyticsData.SalesData("May", 1890, 4800),
                new com.example.ecommerce.entity.AnalyticsData.SalesData("Jun", 2390, 3800),
                new com.example.ecommerce.entity.AnalyticsData.SalesData("Jul", 3490, 4300));

        List<com.example.ecommerce.entity.AnalyticsData.CategoryData> categoryData = List.of(
                new com.example.ecommerce.entity.AnalyticsData.CategoryData("Electronics", 400),
                new com.example.ecommerce.entity.AnalyticsData.CategoryData("Clothing", 300),
                new com.example.ecommerce.entity.AnalyticsData.CategoryData("Groceries", 300),
                new com.example.ecommerce.entity.AnalyticsData.CategoryData("Furniture", 200));

        return new com.example.ecommerce.entity.AnalyticsData(salesData, categoryData);
    }

    @jakarta.annotation.PostConstruct
    public void initData() {
        // Only init Admin user if missing
        if (userInfoRepository.count() == 0) {
            UserInfo admin = new UserInfo();
            admin.setName("admin");
            admin.setEmail("admin@shopkart.in");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRoles("ROLE_ADMIN");
            userInfoRepository.save(admin);
        }
    }
}