package com.example.backend.servlets;

import com.example.backend.models.Doctor;
import com.example.backend.models.Patient;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.*;

@WebServlet("/api/login")
public class LoginServlet extends HttpServlet {
    private String doctorDataPath;
    private String patientDataPath;

    @Override
    public void init() {
        String baseDir = getServletContext().getInitParameter("dataFilePath");
        doctorDataPath = Paths.get(baseDir, "doctor_data").toString();
        patientDataPath = Paths.get(baseDir, "patient_data").toString();
    }

    // ✅ Handle CORS Preflight
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
        JsonObject input = JsonParser.parseReader(reader).getAsJsonObject();

        String username = input.get("username").getAsString();
        String password = input.get("password").getAsString();

        Gson gson = new Gson();

        // Check if doctor
        Path doctorFile = Paths.get(doctorDataPath, username + "_data.txt");
        if (Files.exists(doctorFile)) {
            Doctor doctor = gson.fromJson(Files.readString(doctorFile), Doctor.class);
            if (doctor.password.equals(password)) {
                JsonObject result = new JsonObject();
                result.addProperty("nameWithInitials", doctor.name);
                result.addProperty("age", 0); // default if not in file
                result.addProperty("gender", "unknown");
                result.addProperty("address", "unknown");
                result.addProperty("username", doctor.username);
                result.addProperty("password", doctor.password);
                result.addProperty("phoneNumber", doctor.phoneNumber);
                result.addProperty("profilePicture", doctor.profilePicture);
                result.addProperty("role", "doctor");

                resp.getWriter().write(gson.toJson(result));
                return;
            }
        }

        // Check if patient
        Path patientFile = Paths.get(patientDataPath, username + "_data.txt");
        if (Files.exists(patientFile)) {
            Patient patient = gson.fromJson(Files.readString(patientFile), Patient.class);
            if (patient.password.equals(password)) {
                JsonObject result = new JsonObject();
                result.addProperty("nameWithInitials", patient.nameWithInitials);
                result.addProperty("age", patient.age);
                result.addProperty("gender", patient.gender);
                result.addProperty("address", patient.address);
                result.addProperty("username", patient.username);
                result.addProperty("password", patient.password);
                result.addProperty("phoneNumber", patient.phoneNumber);
                result.addProperty("profilePicture", patient.profilePicture);
                result.addProperty("role", "patient");

                resp.getWriter().write(gson.toJson(result));
                return;
            }
        }

        // If no match found
        resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        resp.getWriter().write("{\"error\":\"Invalid username or password\"}");
    }

    // ✅ Set CORS headers
    private void setCorsHeaders(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
        resp.setHeader("Access-Control-Allow-Credentials", "true");
    }
}
