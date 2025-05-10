package com.example.backend.servlets.hospital;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.nio.file.*;

@WebServlet("/api/hospitals/details")
public class HospitalDetailsServlet extends HttpServlet {
    private String hospitalDataPath;

    @Override
    public void init() {
        hospitalDataPath = Paths.get(getServletContext().getInitParameter("dataFilePath"), "hospital_data").toString();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        // Allow cross-origin request from frontend
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
        String name = req.getParameter("name");

        if (name == null || name.isBlank()) {
            resp.setStatus(400);
            resp.getWriter().write("{\"error\":\"Hospital name is required\"}");
            return;
        }

        String safeName = name.replaceAll("\\s+", "_").toLowerCase();
        Path filePath = Paths.get(hospitalDataPath, safeName + "_data.txt");

        if (!Files.exists(filePath)) {
            resp.setStatus(404);
            resp.getWriter().write("{\"error\":\"Hospital not found\"}");
            return;
        }

        resp.getWriter().write(Files.readString(filePath));
    }
}
