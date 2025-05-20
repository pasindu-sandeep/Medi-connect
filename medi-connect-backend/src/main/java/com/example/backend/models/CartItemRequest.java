package com.example.backend.models;

import java.util.Map;

public class CartItemRequest {
    private String username;
    private Map<String, Object> item;

    public CartItemRequest(String username, Map<String, Object> item) {
        this.username = username;
    }
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
    public Map<String, Object> getItem() {
        return item;
    }
}
