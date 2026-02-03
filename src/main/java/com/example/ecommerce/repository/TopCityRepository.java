package com.example.ecommerce.repository;

import com.example.ecommerce.entity.TopCity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TopCityRepository extends JpaRepository<TopCity, Long> {
}