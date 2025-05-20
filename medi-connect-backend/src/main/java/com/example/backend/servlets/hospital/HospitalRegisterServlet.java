package com.example.backend.servlets.hospital;

import com.example.backend.models.Hospital;
import com.google.gson.Gson;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.nio.file.*;

@WebServlet("/api/hospital-register")
public class HospitalRegisterServlet extends HttpServlet {
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

    // ✅ Handle preflight CORS request
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    // ✅ Handle registration POST request
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json");

        BufferedReader reader = req.getReader();
        Gson gson = new Gson();
        Hospital hospital = gson.fromJson(reader, Hospital.class);

        // Normalize file name: remove spaces, lowercase
        String safeName = hospital.getHospitalName().replaceAll("\\s+", "_").toLowerCase();
        Path hospitalFilePath = Paths.get(hospitalDataPath, safeName + "_data.txt");

        if (Files.exists(hospitalFilePath)) {
            resp.setStatus(HttpServletResponse.SC_CONFLICT);
            resp.getWriter().write("{\"error\":\"Hospital already registered\"}");
            return;
        }

        try {
            Files.writeString(hospitalFilePath, gson.toJson(hospital));
        } catch (IOException e) {
            e.printStackTrace();
            resp.setStatus(500);
            resp.getWriter().write("{\"error\":\"Failed to save hospital data\"}");
            return;
        }

        resp.getWriter().write("{\"status\":\"registered\"}");
    }

    // ✅ Common CORS headers
    private void setCorsHeaders(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
}
