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
            if (doctor.getPassword().equals(password)) {
                JsonObject result = new JsonObject();
                result.addProperty("nameWithInitials", doctor.getName());
                result.addProperty("age", 0); // default if not in file
                result.addProperty("gender", "unknown");
                result.addProperty("address", "unknown");
                result.addProperty("username", doctor.getUsername());
                result.addProperty("password", doctor.getPassword());
                result.addProperty("phoneNumber", doctor.getPhoneNumber());
                result.addProperty("profilePicture", doctor.getProfilePicture());
                result.addProperty("role", "doctor");

                resp.getWriter().write(gson.toJson(result));
                return;
            }
        }

        // Check if patient
        Path patientFile = Paths.get(patientDataPath, username + "_data.txt");
        if (Files.exists(patientFile)) {
            Patient patient = gson.fromJson(Files.readString(patientFile), Patient.class);
            if (patient.getPassword().equals(password)) {
                JsonObject result = new JsonObject();
                result.addProperty("nameWithInitials", patient.getNameWithInitialsPatient());
                result.addProperty("age", patient.getAgePatient());
                result.addProperty("gender", patient.getGenderPatient());
                result.addProperty("address", patient.getAddressPatient());
                result.addProperty("username", patient.getUsername());
                result.addProperty("password", patient.getPassword());
                result.addProperty("phoneNumber", patient.getPhoneNumber());
                result.addProperty("profilePicture", patient.getProfilePicture());
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
