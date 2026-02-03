package com.example.ecommerce.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "top_cities")
public class TopCity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String city;
    private Integer sales;
    private String percentage;

    public TopCity() {
    }

    public TopCity(String city, Integer sales, String percentage) {
        this.city = city;
        this.sales = sales;
        this.percentage = percentage;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Integer getSales() {
        return sales;
    }

    public void setSales(Integer sales) {
        this.sales = sales;
    }

    public String getPercentage() {
        return percentage;
    }

    public void setPercentage(String percentage) {
        this.percentage = percentage;
    }
}