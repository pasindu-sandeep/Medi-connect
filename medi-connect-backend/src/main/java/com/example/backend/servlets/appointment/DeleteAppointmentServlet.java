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

        // Remove from patient's appointment file
        Path patientFile = Paths.get(baseDir, "appointments", appt.getPatientUsername() + "_appointment.txt");

        if (Files.exists(patientFile)) {
            JsonArray patientAppointments = JsonParser.parseString(Files.readString(patientFile)).getAsJsonArray();
            JsonArray updatedArray = new JsonArray();

            for (JsonElement el : patientAppointments) {
                JsonObject obj = el.getAsJsonObject();
                if (!(obj.get("doctorUsername").getAsString().equals(appt.getDoctorUsername())
                        && obj.get("date").getAsString().equals(appt.getDate())
                        && obj.get("timeSlot").getAsString().equals(appt.getTimeSlot()))) {
                    updatedArray.add(obj);
                }
            }

            Files.writeString(patientFile, gson.toJson(updatedArray));
            success = true;
        }

        // 2. Remove from doctor's slot file
        String day = LocalDate.parse(appt.getDate()).getDayOfWeek().name().toLowerCase();
        Path doctorSlotFile = Paths.get(baseDir, "doctor_data", appt.getDoctorUsername() + "_timeSlots", day);

        if (Files.exists(doctorSlotFile)) {
            JsonArray hospitalBlocks = JsonParser.parseString(Files.readString(doctorSlotFile)).getAsJsonArray();

            for (JsonElement element : hospitalBlocks) {
                JsonObject hospitalMap = element.getAsJsonObject();
                if (hospitalMap.has(appt.getHospitalName())) {
                    JsonObject slotData = hospitalMap.get(appt.getHospitalName()).getAsJsonObject();

                    if (slotData.get("time_slot").getAsString().equals(appt.getTimeSlot())) {
                        JsonArray appts = slotData.getAsJsonArray("appointments");
                        JsonArray updated = new JsonArray();

                        for (JsonElement e : appts) {
                            JsonObject a = e.getAsJsonObject();
                            if (!(a.get("patient_username").getAsString().equals(appt.getPatientUsername())
                                    && a.get("date").getAsString().equals(appt.getDate()))) {
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
