package com.example.backend;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;

import com.google.gson.Gson;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

public class HelloServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        // Allow CORS if you're calling this from React
        resp.setHeader("Access-Control-Allow-Origin", "*");

        // Prepare JSON response
        Map<String, String> message = new HashMap<>();
        message.put("message", "Hello from Java backend!");

        // Convert to JSON and write
        String json = new Gson().toJson(message);
        PrintWriter out = resp.getWriter();
        out.print(json);
        out.flush();
    }
}
