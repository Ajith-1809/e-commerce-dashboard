package com.example.ecommerce.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "dashboard_stats")
public class DashboardStats {
    @Id
    private Integer id;

    private String revenue;

    @Column(name = "revenue_trend")
    private String revenueTrend;

    private String orders;

    @Column(name = "orders_trend")
    private String ordersTrend;

    private String customers;

    @Column(name = "customers_trend")
    private String customersTrend;

    private String growth;

    @Column(name = "growth_trend")
    private String growthTrend;

    public DashboardStats() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getRevenue() {
        return revenue;
    }

    public void setRevenue(String revenue) {
        this.revenue = revenue;
    }

    public String getRevenueTrend() {
        return revenueTrend;
    }

    public void setRevenueTrend(String revenueTrend) {
        this.revenueTrend = revenueTrend;
    }

    public String getOrders() {
        return orders;
    }

    public void setOrders(String orders) {
        this.orders = orders;
    }

    public String getOrdersTrend() {
        return ordersTrend;
    }

    public void setOrdersTrend(String ordersTrend) {
        this.ordersTrend = ordersTrend;
    }

    public String getCustomers() {
        return customers;
    }

    public void setCustomers(String customers) {
        this.customers = customers;
    }

    public String getCustomersTrend() {
        return customersTrend;
    }

    public void setCustomersTrend(String customersTrend) {
        this.customersTrend = customersTrend;
    }

    public String getGrowth() {
        return growth;
    }

    public void setGrowth(String growth) {
        this.growth = growth;
    }

    public String getGrowthTrend() {
        return growthTrend;
    }

    public void setGrowthTrend(String growthTrend) {
        this.growthTrend = growthTrend;
    }
}