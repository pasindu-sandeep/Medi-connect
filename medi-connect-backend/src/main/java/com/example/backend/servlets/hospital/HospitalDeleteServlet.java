package com.example.backend.servlets.hospital;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.nio.file.*;

@WebServlet("/api/hospital-delete")
public class HospitalDeleteServlet extends HttpServlet {
    private String hospitalDataPath;

    @Override
    public void init() {
        String baseDir = getServletContext().getInitParameter("dataFilePath");
        hospitalDataPath = Paths.get(baseDir, "hospital_data").toString();

        try {
            Files.createDirectories(Paths.get(hospitalDataPath));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // CORS support
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    // DELETE hospital by name (from query string)
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json");

        String hospitalName = req.getParameter("name");
        if (hospitalName == null || hospitalName.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\":\"Missing hospital name parameter\"}");
            return;
        }

        String safeName = hospitalName.replaceAll("\\s+", "_").toLowerCase();
        Path hospitalFilePath = Paths.get(hospitalDataPath, safeName + "_data.txt");

        if (!Files.exists(hospitalFilePath)) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            resp.getWriter().write("{\"error\":\"Hospital not found\"}");
            return;
        }

        try {
            Files.delete(hospitalFilePath);
            resp.getWriter().write("{\"status\":\"Hospital deleted successfully\"}");
        } catch (IOException e) {
            e.printStackTrace();
            resp.setStatus(500);
            resp.getWriter().write("{\"error\":\"Failed to delete hospital file\"}");
        }
    }

    private void setCorsHeaders(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
}
