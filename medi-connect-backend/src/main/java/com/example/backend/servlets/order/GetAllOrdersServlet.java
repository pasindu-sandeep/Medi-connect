package com.example.backend.servlets.order;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@WebServlet("/api/orders")
public class GetAllOrdersServlet extends HttpServlet {
    private String baseDir;
    private final Gson gson = new Gson();

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
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json");

        Path orderDir = Paths.get(baseDir, "order_data");
        File[] orderFiles = orderDir.toFile().listFiles((dir, name) -> name.endsWith(".json"));

        if (orderFiles == null || orderFiles.length == 0) {
            resp.getWriter().write("[]");
            return;
        }

        List<JsonElement> orders = new ArrayList<>();

        for (File file : orderFiles) {
            try {
                String content = Files.readString(file.toPath());
                JsonElement json = JsonParser.parseString(content);
                orders.add(json);
            } catch (IOException e) {
                e.printStackTrace(); // Log and skip bad file
            }
        }

        resp.getWriter().write(gson.toJson(orders));
    }

    private void setCorsHeaders(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
}
