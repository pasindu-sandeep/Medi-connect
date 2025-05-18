package com.example.backend.servlets.appointment;

import com.example.backend.models.Doctor;
import com.example.backend.models.Patient;
import com.google.gson.*;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.nio.file.*;
import java.util.*;

@WebServlet("/api/appointments/all")
public class GetAllAppointmentsByDateServlet extends HttpServlet {
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

        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        JsonArray allAppointments = new JsonArray();

        try (DirectoryStream<Path> files = Files.newDirectoryStream(appointmentsDir)) {
            for (Path file : files) {
                try {
                    if (Files.size(file) == 0) continue; // skip empty

                    String content = Files.readString(file, java.nio.charset.StandardCharsets.UTF_8);
                    JsonArray userAppointments = JsonParser.parseString(content).getAsJsonArray();

                    String patientUsername = file.getFileName().toString().replace("_appointment.txt", "");

                    // Load patient details
                    Path patientFile = Paths.get(baseDir, "patient_data", patientUsername + "_data.txt");
                    String patientName = patientUsername;
                    if (Files.exists(patientFile) && Files.size(patientFile) > 0) {
                        try {
                            Patient patient = gson.fromJson(Files.readString(patientFile, java.nio.charset.StandardCharsets.UTF_8), Patient.class);
                            patientName = patient.nameWithInitials;
                        } catch (Exception ignored) {}
                    }

                    for (JsonElement appt : userAppointments) {
                        JsonObject obj = appt.getAsJsonObject();
                        obj.addProperty("patientUsername", patientUsername);
                        obj.addProperty("patientName", patientName);

                        // Load doctor name
                        String doctorUsername = obj.get("doctorUsername").getAsString();
                        Path doctorFile = Paths.get(baseDir, "doctor_data", doctorUsername + "_data.txt");

                        if (Files.exists(doctorFile) && Files.size(doctorFile) > 0) {
                            try {
                                Doctor doctor = gson.fromJson(Files.readString(doctorFile, java.nio.charset.StandardCharsets.UTF_8), Doctor.class);
                                obj.addProperty("doctorName", doctor.name);
                            } catch (Exception ignored) {}
                        }

                        allAppointments.add(obj);
                    }
                } catch (Exception e) {
                    System.err.println("Skipping invalid appointment file: " + file.getFileName() + " - " + e.getMessage());
                }
            }
        }

        // Sort appointments by date
        List<JsonElement> sorted = new ArrayList<>();
        for (JsonElement appt : allAppointments) sorted.add(appt);

        sorted.sort(Comparator.comparing(a -> a.getAsJsonObject().get("date").getAsString()));

        JsonArray sortedArray = new JsonArray();
        sorted.forEach(sortedArray::add);

        resp.getWriter().write(gson.toJson(sortedArray));
    }

}
