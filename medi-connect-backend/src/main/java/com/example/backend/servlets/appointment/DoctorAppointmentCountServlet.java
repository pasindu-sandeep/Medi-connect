package com.example.backend.servlets.appointment;

import com.example.backend.models.Doctor;
import com.google.gson.*;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.nio.file.*;
import java.util.*;

@WebServlet("/api/appointments/doctor-count")
public class DoctorAppointmentCountServlet extends HttpServlet {
    private String baseDir;

    @Override
    public void init() {
        baseDir = getServletContext().getInitParameter("dataFilePath");
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    private void setCorsHeaders(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json");

        Path appointmentsDir = Paths.get(baseDir, "appointments");
        if (!Files.exists(appointmentsDir)) {
            resp.setStatus(404);
            resp.getWriter().write("{\"error\":\"No appointments directory found\"}");
            return;
        }

        Gson gson = new Gson();
        Map<String, Integer> doctorCounts = new HashMap<>();
        Map<String, String> doctorNames = new HashMap<>();

        try (DirectoryStream<Path> files = Files.newDirectoryStream(appointmentsDir)) {
            for (Path file : files) {
                String content = Files.readString(file);
                JsonArray userAppointments = JsonParser.parseString(content).getAsJsonArray();

                for (JsonElement appt : userAppointments) {
                    JsonObject obj = appt.getAsJsonObject();
                    String doctorUsername = obj.get("doctorUsername").getAsString();
                    doctorCounts.put(doctorUsername, doctorCounts.getOrDefault(doctorUsername, 0) + 1);
                }
            }
        }

        // Load doctor names for display
        for (String username : doctorCounts.keySet()) {
            Path doctorFile = Paths.get(baseDir, "doctor_data", username + "_data.txt");
            if (Files.exists(doctorFile)) {
                try {
                    Doctor doctor = gson.fromJson(Files.readString(doctorFile), Doctor.class);
                    doctorNames.put(username, doctor.name);
                } catch (Exception ignored) {}
            } else {
                doctorNames.put(username, username);
            }
        }

        JsonArray result = new JsonArray();
        for (Map.Entry<String, Integer> entry : doctorCounts.entrySet()) {
            JsonObject obj = new JsonObject();
            obj.addProperty("doctorUsername", entry.getKey());
            obj.addProperty("doctorName", doctorNames.get(entry.getKey()));
            obj.addProperty("appointmentCount", entry.getValue());
            result.add(obj);
        }

        resp.getWriter().write(new GsonBuilder().setPrettyPrinting().create().toJson(result));
    }
}
