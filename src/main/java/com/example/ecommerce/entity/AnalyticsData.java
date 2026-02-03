package com.example.ecommerce.entity;

import java.util.List;

public class AnalyticsData {
    private List<SalesData> salesData;
    private List<CategoryData> categoryData;

    public AnalyticsData(List<SalesData> salesData, List<CategoryData> categoryData) {
        this.salesData = salesData;
        this.categoryData = categoryData;
    }

    public List<SalesData> getSalesData() {
        return salesData;
    }

    public void setSalesData(List<SalesData> salesData) {
        this.salesData = salesData;
    }

    public List<CategoryData> getCategoryData() {
        return categoryData;
    }

    public void setCategoryData(List<CategoryData> categoryData) {
        this.categoryData = categoryData;
    }

    public static class SalesData {
        private String name;
        private int revenue;
        private int expenses;

        public SalesData(String name, int revenue, int expenses) {
            this.name = name;
            this.revenue = revenue;
            this.expenses = expenses;
        }

        public String getName() {
            return name;
        }

        public int getRevenue() {
            return revenue;
        }

        public int getExpenses() {
            return expenses;
        }
    }

    public static class CategoryData {
        private String name;
        private int value;

        public CategoryData(String name, int value) {
            this.name = name;
            this.value = value;
        }

        public String getName() {
            return name;
        }

        public int getValue() {
            return value;
        }
    }
}
