package com.example.backend.servlets.order;

import com.google.gson.*;
import com.google.gson.reflect.TypeToken;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.lang.reflect.Type;
import java.nio.file.*;
import java.util.*;

@WebServlet("/api/order")
public class OrderServlet extends HttpServlet {
    private String baseDir;
    private final Gson gson = new GsonBuilder().setPrettyPrinting().create();
    private final Type cartItemListType = new TypeToken<List<Map<String, Object>>>() {}.getType();

    @Override
    public void init() {
        baseDir = getServletContext().getInitParameter("dataFilePath");

        try {
            Files.createDirectories(Paths.get(baseDir, "order_data"));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json");

        JsonObject orderRequest = gson.fromJson(req.getReader(), JsonObject.class);

        String username = orderRequest.get("username").getAsString();
        JsonObject pickupDetails = orderRequest.getAsJsonObject("pickupDetails");
        JsonArray cartItems = orderRequest.getAsJsonArray("cart");
        String orderType = orderRequest.get("orderType").getAsString();

        if (username == null || username.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\":\"Username required\"}");
            return;
        }

        Path orderDir = Paths.get(baseDir, "order_data");
        String orderId = UUID.randomUUID().toString();
        Path orderFile = orderDir.resolve(username + "_order_" + orderId + ".json");

        JsonObject orderData = new JsonObject();
        orderData.addProperty("username", username);
        orderData.addProperty("orderType", orderType);
        orderData.add("pickupDetails", pickupDetails);
        orderData.add("cart", cartItems);
        orderData.addProperty("orderId", orderId);
        orderData.addProperty("timestamp", System.currentTimeMillis());

        Files.writeString(orderFile, gson.toJson(orderData));

        // Delete cart file
        Path cartFile = Paths.get(baseDir, "cart_data", username + "_cart.txt");
        try {
            Files.deleteIfExists(cartFile);
        } catch (IOException e) {
            e.printStackTrace();
        }

        resp.getWriter().write("{\"status\":\"order placed\"}");
    }

    private void setCorsHeaders(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
}
