package com.example.backend.servlets.patient;

import com.example.backend.models.Patient;
import com.google.gson.Gson;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.file.*;

@WebServlet("/api/user")
public class UserDataServlet extends HttpServlet {
    private String patientDataPath;

    @Override
    public void init() {
        String baseDir = getServletContext().getInitParameter("dataFilePath");
        this.patientDataPath = Paths.get(baseDir, "patient_data").toString();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        resp.setContentType("application/json");

        // Allow cross-origin request from frontend
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");

        // Read username from query string
        String username = req.getParameter("username");
        if (username == null || username.trim().isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\":\"Username query parameter is required\"}");
            return;
        }

        Path patientFilePath = Paths.get(patientDataPath, username + "_data.txt");

        if (!Files.exists(patientFilePath)) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            resp.getWriter().write("{\"error\":\"User not found\"}");
            return;
        }

        String content = Files.readString(patientFilePath);
        Patient patient = new Gson().fromJson(content, Patient.class);
        patient.password = null; // Hide password

        resp.getWriter().write(new Gson().toJson(patient));
    }
}
