package com.example.backend.servlets.appointment;

import com.google.gson.*;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.nio.file.*;
import java.util.*;

@WebServlet("/api/appointments/doctor")
public class GetDoctorAppointmentsServlet extends HttpServlet {
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

        String doctorUsername = req.getParameter("username");
        if (doctorUsername == null || doctorUsername.isBlank()) {
            resp.setStatus(400);
            resp.getWriter().write("{\"error\":\"Missing doctor username\"}");
            return;
        }

        Path doctorSlotDir = Paths.get(baseDir, "doctor_data", doctorUsername + "_timeSlots");
        if (!Files.exists(doctorSlotDir)) {
            resp.setStatus(404);
            resp.getWriter().write("{\"error\":\"No slot data found for this doctor\"}");
            return;
        }

        JsonArray result = new JsonArray();
        Gson gson = new GsonBuilder().setPrettyPrinting().create();

        try (DirectoryStream<Path> days = Files.newDirectoryStream(doctorSlotDir)) {
            for (Path dayFile : days) {
                String day = dayFile.getFileName().toString();
                JsonArray hospitalBlocks = JsonParser.parseString(Files.readString(dayFile)).getAsJsonArray();

                for (JsonElement element : hospitalBlocks) {
                    JsonObject hospitalMap = element.getAsJsonObject();
                    for (Map.Entry<String, JsonElement> entry : hospitalMap.entrySet()) {
                        String hospitalName = entry.getKey();
                        JsonObject slot = entry.getValue().getAsJsonObject();
                        JsonArray appointments = slot.getAsJsonArray("appointments");

                        for (JsonElement a : appointments) {
                            JsonObject appt = a.getAsJsonObject();
                            JsonObject record = new JsonObject();
                            record.addProperty("hospitalName", hospitalName);
                            record.addProperty("day", day);
                            record.addProperty("timeSlot", slot.get("time_slot").getAsString());
                            record.add("details", appt);
                            result.add(record);
                        }
                    }
                }
            }
        }

        resp.getWriter().write(gson.toJson(result));
    }
}