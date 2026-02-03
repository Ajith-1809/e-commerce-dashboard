package com.example.ecommerce.controller;

import com.example.ecommerce.entity.DashboardStats;
import com.example.ecommerce.entity.TopCity;
import com.example.ecommerce.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    public DashboardStats getStats() {
        return dashboardService.getStats();
    }

    @GetMapping("/top-cities")
    public List<TopCity> getTopCities() {
        return dashboardService.getTopCities();
    }

    @GetMapping("/analytics")
    public com.example.ecommerce.entity.AnalyticsData getAnalyticsData() {
        return dashboardService.getAnalyticsData();
    }
}