package com.example.backend.servlets.patient;

import com.example.backend.models.Patient;
import com.google.gson.Gson;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@WebServlet("/api/patient-register")
public class RegisterServlet extends HttpServlet {
    private String baseDir;

    @Override
    public void init() {
        baseDir = getServletContext().getInitParameter("dataFilePath");

        try {
            Files.createDirectories(Paths.get(baseDir, "patient_data"));
            Files.createDirectories(Paths.get(baseDir, "doctor_data")); // in case doctor data is in separate dir
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // ✅ Handle CORS preflight (OPTIONS) request
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json");

        BufferedReader reader = req.getReader();
        Gson gson = new Gson();
        Patient patient = gson.fromJson(reader, Patient.class);

        Path patientFile = Paths.get(baseDir, "patient_data", patient.username + "_data.txt");
        Path doctorFile = Paths.get(baseDir, "doctor_data", patient.username + "_data.txt");

        // ✅ Check if username already exists (as doctor or patient)
        if (Files.exists(patientFile) || Files.exists(doctorFile)) {
            resp.setStatus(HttpServletResponse.SC_CONFLICT);
            resp.getWriter().write("{\"error\":\"Username already in use\"}");
            return;
        }

        // ✅ Save new patient data
        try {
            Files.writeString(patientFile, gson.toJson(patient));
        } catch (IOException e) {
            e.printStackTrace();
            resp.setStatus(500);
            resp.getWriter().write("{\"error\":\"Failed to save patient data\"}");
            return;
        }

        resp.getWriter().write("{\"status\":\"registered\"}");
    }

    // ✅ Common CORS header setup
    private void setCorsHeaders(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
}
