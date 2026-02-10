package com.example.ecommerce.controller;

import com.example.ecommerce.entity.AuthRequest;
import com.example.ecommerce.entity.UserInfo;
import com.example.ecommerce.repository.UserInfoRepository;
import com.example.ecommerce.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserInfoRepository repository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/new")
    public String addNewUser(@RequestBody UserInfo userInfo) {
        userInfo.setPassword(userInfo.getPassword());
        repository.save(userInfo);
        return "User added successfully";
    }

    @PostMapping("/login")
    public org.springframework.http.ResponseEntity<String> authenticateAndGetToken(
            @RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));
            if (authentication.isAuthenticated()) {
                return org.springframework.http.ResponseEntity.ok(jwtService.generateToken(authRequest.getUsername()));
            } else {
                throw new UsernameNotFoundException("invalid user request !");
            }
        } catch (org.springframework.security.core.AuthenticationException e) {
            return org.springframework.http.ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}
