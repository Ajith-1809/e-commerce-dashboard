package com.example.ecommerce.service;

import com.example.ecommerce.entity.Customer;
import com.example.ecommerce.repository.CustomerRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Long id, Customer customerDetails) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        customer.setName(customerDetails.getName());
        customer.setEmail(customerDetails.getEmail());
        customer.setPhone(customerDetails.getPhone());
        customer.setLocation(customerDetails.getLocation());
        customer.setOrders(customerDetails.getOrders());
        customer.setStatus(customerDetails.getStatus());
        return customerRepository.save(customer);
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

    @PostConstruct
    public void initData() {
        if (customerRepository.count() == 0) {
            List<Customer> customers = Arrays.asList(
                    new Customer("Alice Johnson", "alice@example.com", "123-456-7890", "New York, USA", 5, "Active"),
                    new Customer("Bob Smith", "bob@example.com", "987-654-3210", "London, UK", 2, "Inactive"),
                    new Customer("Charlie Brown", "charlie@example.com", "456-789-0123", "Paris, France", 8, "Active"),
                    new Customer("Diana Prince", "diana@dc.com", "111-222-3333", "Themyscira", 12, "Active"),
                    new Customer("Evan Wright", "evan@example.com", "555-666-7777", "Berlin, Germany", 1, "Pending"));
            customerRepository.saveAll(customers);
        }
    }
}
