package com.example.backend.servlets.appointment;

import com.example.backend.models.Appointment;
import com.google.gson.*;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.nio.file.*;
import java.time.*;
import java.util.*;

@WebServlet("/api/appointments/delete")
public class DeleteAppointmentServlet extends HttpServlet {
    private String baseDir;

    @Override
    public void init() {
        baseDir = getServletContext().getInitParameter("dataFilePath");
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCors(resp);
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        Appointment appt = gson.fromJson(req.getReader(), Appointment.class);

        boolean success = false;

        // 1. Remove from patient's appointment file
        Path patientFile = Paths.get(baseDir, "appointments", appt.patientUsername + "_appointment.txt");

        if (Files.exists(patientFile)) {
            JsonArray patientAppointments = JsonParser.parseString(Files.readString(patientFile)).getAsJsonArray();
            JsonArray updatedArray = new JsonArray();

            for (JsonElement el : patientAppointments) {
                JsonObject obj = el.getAsJsonObject();
                if (!(obj.get("doctorUsername").getAsString().equals(appt.doctorUsername)
                        && obj.get("date").getAsString().equals(appt.date)
                        && obj.get("timeSlot").getAsString().equals(appt.timeSlot))) {
                    updatedArray.add(obj);
                }
            }

            Files.writeString(patientFile, gson.toJson(updatedArray));
            success = true;
        }

        // 2. Remove from doctor's slot file
        String day = LocalDate.parse(appt.date).getDayOfWeek().name().toLowerCase();
        Path doctorSlotFile = Paths.get(baseDir, "doctor_data", appt.doctorUsername + "_timeSlots", day);

        if (Files.exists(doctorSlotFile)) {
            JsonArray hospitalBlocks = JsonParser.parseString(Files.readString(doctorSlotFile)).getAsJsonArray();

            for (JsonElement element : hospitalBlocks) {
                JsonObject hospitalMap = element.getAsJsonObject();
                if (hospitalMap.has(appt.hospitalName)) {
                    JsonObject slotData = hospitalMap.get(appt.hospitalName).getAsJsonObject();

                    if (slotData.get("time_slot").getAsString().equals(appt.timeSlot)) {
                        JsonArray appts = slotData.getAsJsonArray("appointments");
                        JsonArray updated = new JsonArray();

                        for (JsonElement e : appts) {
                            JsonObject a = e.getAsJsonObject();
                            if (!(a.get("patient_username").getAsString().equals(appt.patientUsername)
                                    && a.get("date").getAsString().equals(appt.date))) {
                                updated.add(a);
                            }
                        }

                        slotData.add("appointments", updated);
                        slotData.addProperty("number_of_bookings", updated.size());
                        success = true;
                    }
                }
            }

            Files.writeString(doctorSlotFile, gson.toJson(hospitalBlocks));
        }

        if (success) {
            resp.getWriter().write("{\"status\":\"deleted\"}");
        } else {
            resp.setStatus(404);
            resp.getWriter().write("{\"error\":\"Appointment not found in records\"}");
        }
    }

    private void setCors(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCors(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}
