package com.example.ecommerce.service;

import com.example.ecommerce.entity.Order;
import com.example.ecommerce.repository.OrderRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order saveOrder(Order order) {
        if (order.getOrderId() == null || order.getOrderId().isEmpty()) {
            order.setOrderId("ORD-" + (System.currentTimeMillis() % 10000));
        }
        return orderRepository.save(order);
    }

    public Order updateOrder(Long id, Order orderDetails) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id " + id));
        order.setCustomer(orderDetails.getCustomer());
        order.setLocation(orderDetails.getLocation());
        order.setAmount(orderDetails.getAmount());
        order.setStatus(orderDetails.getStatus());
        order.setDate(orderDetails.getDate());
        // Do not update orderId or id
        return orderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    @PostConstruct
    public void initData() {
        if (orderRepository.count() == 0) {
            orderRepository.save(new Order("ORD-001", "Alice Johnson", "New York", "₹ 1,200", "Shipped", "2023-10-25"));
            orderRepository.save(new Order("ORD-002", "Bob Smith", "London", "₹ 850", "Processing", "2023-10-26"));
            orderRepository.save(new Order("ORD-003", "Charlie Brown", "Paris", "₹ 2,100", "Delivered", "2023-10-24"));
            orderRepository
                    .save(new Order("ORD-004", "Diana Prince", "Themyscira", "₹ 5,000", "Pending", "2023-10-27"));
            orderRepository.save(new Order("ORD-005", "Evan Wright", "Berlin", "₹ 300", "Delivered", "2023-10-23"));
        }
    }
}