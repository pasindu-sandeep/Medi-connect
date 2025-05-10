package com.example.backend.servlets.appointment;

import com.example.backend.models.Appointment;
import com.google.gson.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.nio.file.*;
import java.time.*;
import java.util.*;
import java.util.stream.*;

@WebServlet("/api/appointments/book")
public class PlaceAppointmentServlet extends HttpServlet {
    private String baseDir;

    @Override
    public void init() {
        baseDir = getServletContext().getInitParameter("dataFilePath");
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        // Allow cross-origin request from frontend
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");

        Gson gson = new Gson();
        Appointment appointment = gson.fromJson(req.getReader(), Appointment.class);

        String day = LocalDate.parse(appointment.date).getDayOfWeek().name().toLowerCase(); // e.g., "monday"
        Path slotFilePath = Paths.get(baseDir, "doctor_data", appointment.doctorUsername + "_timeSlots", day);

        if (!Files.exists(slotFilePath)) {
            resp.setStatus(404);
            resp.getWriter().write("{\"error\":\"Doctor is not available on this day\"}");
            return;
        }

        JsonArray hospitalBlocks = JsonParser.parseString(Files.readString(slotFilePath)).getAsJsonArray();
        boolean updated = false;

        for (JsonElement element : hospitalBlocks) {
            JsonObject hospitalMap = element.getAsJsonObject();

            if (hospitalMap.has(appointment.hospitalName)) {
                JsonObject slotData = hospitalMap.get(appointment.hospitalName).getAsJsonObject();

                // Check timeSlot matches
                if (!slotData.get("time_slot").getAsString().equals(appointment.timeSlot)) {
                    continue;
                }

                // Prepare new appointment
                JsonObject newAppt = new JsonObject();
                newAppt.addProperty("patient_username", appointment.patientUsername);
                newAppt.addProperty("urgency", appointment.urgency);
                newAppt.addProperty("booking_dateTime", System.currentTimeMillis());

                // Append and sort
                JsonArray apptArray = slotData.getAsJsonArray("appointments");

                // Check for duplicate
                boolean alreadyBooked = StreamSupport.stream(apptArray.spliterator(), false)
                        .anyMatch(json -> json.getAsJsonObject().get("patient_username").getAsString().equals(appointment.patientUsername));

                if (alreadyBooked) {
                    resp.setStatus(409); // Conflict
                    resp.getWriter().write("{\"error\":\"Appointment already exists for this patient in this time slot.\"}");
                    return;
                }

                apptArray.add(newAppt);

                List<JsonElement> sortedAppointments = StreamSupport.stream(apptArray.spliterator(), false)
                        .sorted((a, b) -> Integer.compare(
                                b.getAsJsonObject().get("urgency").getAsInt(),
                                a.getAsJsonObject().get("urgency").getAsInt()))
                        .collect(Collectors.toList());

                JsonArray sortedArray = new JsonArray();
                sortedAppointments.forEach(sortedArray::add);

                slotData.add("appointments", sortedArray);
                slotData.addProperty("number_of_bookings", sortedArray.size());

                // Update next_time_slot
                int nextSlotIndex = sortedArray.size();
                String nextTime = calculateNextTime(slotData.get("time_slot").getAsString(), nextSlotIndex);
                slotData.addProperty("next_time_slot", nextTime);

                updated = true;

                // Save to patient's appointment file
                Path userAppointmentFile = Paths.get(baseDir, "appointments", appointment.patientUsername + "_appointment.txt");

                JsonArray userAppointments;
                if (Files.exists(userAppointmentFile)) {
                    userAppointments = JsonParser.parseString(Files.readString(userAppointmentFile)).getAsJsonArray();
                } else {
                    Files.createDirectories(userAppointmentFile.getParent());
                    userAppointments = new JsonArray();
                }

                JsonObject userApptEntry = new JsonObject();
                userApptEntry.addProperty("doctorUsername", appointment.doctorUsername);
                userApptEntry.addProperty("hospitalName", appointment.hospitalName);
                userApptEntry.addProperty("timeSlot", appointment.timeSlot);
                userApptEntry.addProperty("date", appointment.date);
                userApptEntry.addProperty("urgency", appointment.urgency);
                userApptEntry.addProperty("status", "booked");
                userApptEntry.addProperty("bookedAt", System.currentTimeMillis());

                userAppointments.add(userApptEntry);
                Files.writeString(userAppointmentFile, new GsonBuilder().setPrettyPrinting().create().toJson(userAppointments));

                break;
            }
        }

        if (updated) {
            Files.writeString(slotFilePath, new GsonBuilder().setPrettyPrinting().create().toJson(hospitalBlocks));
            resp.getWriter().write("{\"status\":\"appointment booked\"}");
        } else {
            resp.setStatus(400);
            resp.getWriter().write("{\"error\":\"Matching hospital/time slot not found for this doctor on this day\"}");
        }
    }

    private String calculateNextTime(String timeSlot, int index) {
        String[] range = timeSlot.replace(" ", "").split("-");
        LocalTime start = LocalTime.parse(range[0]);
        LocalTime next = start.plusMinutes(index * 10L);
        return next.toString();
    }
}
