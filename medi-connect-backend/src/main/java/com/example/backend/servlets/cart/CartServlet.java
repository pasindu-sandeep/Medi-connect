package com.example.backend.servlets.cart;

import com.example.backend.models.CartItemRequest;
import com.google.gson.*;
import com.google.gson.reflect.TypeToken;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.lang.reflect.Type;
import java.nio.file.*;
import java.util.*;

@WebServlet("/api/cart")
public class CartServlet extends HttpServlet {
    private String baseDir;
    private final Gson gson = new GsonBuilder().setPrettyPrinting().create();
    private final Type cartItemListType = new TypeToken<List<Map<String, Object>>>() {}.getType();

    @Override
    public void init() {
        baseDir = getServletContext().getInitParameter("dataFilePath");

        try {
            Files.createDirectories(Paths.get(baseDir, "cart_data"));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    // ✅ Add or update a single item in the cart
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json");

        CartItemRequest itemRequest = gson.fromJson(req.getReader(), CartItemRequest.class);

        if (itemRequest == null || itemRequest.username == null || itemRequest.item == null) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\":\"Invalid request\"}");
            return;
        }

        Path cartFile = Paths.get(baseDir, "cart_data", itemRequest.username + "_cart.txt");

        List<Map<String, Object>> cart = new ArrayList<>();
        if (Files.exists(cartFile)) {
            String existing = Files.readString(cartFile);
            cart = gson.fromJson(existing, cartItemListType);
            if (cart == null) {
                cart = new ArrayList<>();
            }
        }

        // Update or add item
        boolean updated = false;
        for (Map<String, Object> item : cart) {
            if (item.get("sku").equals(itemRequest.item.get("sku"))) {
                Object existingQtyObj = item.get("qty");
                Object newQtyObj = itemRequest.item.get("qty");

                double existingQty = existingQtyObj instanceof Number ? ((Number) existingQtyObj).doubleValue() : 0;
                double newQty = newQtyObj instanceof Number ? ((Number) newQtyObj).doubleValue() : 0;

                item.put("qty", existingQty + newQty); // ✅ increment
                updated = true;
                break;
            }
        }

        if (!updated) {
            cart.add(itemRequest.item);
        }

        // Save to file
        Files.writeString(cartFile, gson.toJson(cart, cartItemListType));
        resp.getWriter().write("{\"status\":\"item saved\"}");
    }

    // ✅ Get entire cart
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json");

        String username = req.getParameter("username");
        if (username == null || username.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\":\"Username required\"}");
            return;
        }

        Path cartFile = Paths.get(baseDir, "cart_data", username + "_cart.txt");

        if (!Files.exists(cartFile)) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            resp.getWriter().write("{\"error\":\"Cart not found\"}");
            return;
        }

        String json = Files.readString(cartFile);
        resp.getWriter().write(json);
    }

    // ✅ Delete one item from the cart
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json");

        String username = req.getParameter("username");
        String sku = req.getParameter("sku");

        if (username == null || username.isEmpty() || sku == null || sku.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\":\"Username and SKU required\"}");
            return;
        }

        Path cartFile = Paths.get(baseDir, "cart_data", username + "_cart.txt");

        if (!Files.exists(cartFile)) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            resp.getWriter().write("{\"error\":\"Cart not found\"}");
            return;
        }

        List<Map<String, Object>> cart = gson.fromJson(Files.readString(cartFile), cartItemListType);

        boolean removed = cart.removeIf(item -> sku.equals(item.get("sku")));
        if (!removed) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            resp.getWriter().write("{\"error\":\"Item not found in cart\"}");
            return;
        }

        Files.writeString(cartFile, gson.toJson(cart, cartItemListType));
        resp.getWriter().write("{\"status\":\"item deleted\"}");
    }

    private void setCorsHeaders(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

}
