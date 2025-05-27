package com.example.backend.servlets.appointment;

import com.example.backend.models.Appointment;
import com.google.gson.*;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.nio.file.*;
import java.time.*;
import java.util.*;

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
        resp.setHeader("Access-Control-Allow-Origin", "*");

        Gson gson = new Gson();
        Appointment appointment = gson.fromJson(req.getReader(), Appointment.class);

        LocalDate targetDate = LocalDate.parse(appointment.getDate());
        String day = targetDate.getDayOfWeek().name().toLowerCase(); // e.g., "monday"
        Path slotFilePath = Paths.get(baseDir, "doctor_data", appointment.getDoctorUsername() + "_timeSlots", day);

        if (!Files.exists(slotFilePath)) {
            resp.setStatus(404);
            resp.getWriter().write("{\"error\":\"Doctor is not available on this day\"}");
            return;
        }

        JsonArray hospitalBlocks = JsonParser.parseString(Files.readString(slotFilePath)).getAsJsonArray();
        boolean updated = false;

        for (JsonElement element : hospitalBlocks) {
            JsonObject hospitalMap = element.getAsJsonObject();

            if (hospitalMap.has(appointment.getHospitalName())) {
                JsonObject slotData = hospitalMap.get(appointment.getHospitalName()).getAsJsonObject();

                if (!slotData.get("time_slot").getAsString().equals(appointment.getTimeSlot())) continue;

                // 🧹 Clear all previous appointments and keep only for current date
                JsonArray currentAppointments = slotData.getAsJsonArray("appointments");
                JsonArray newAppointmentsList = new JsonArray();

                for (JsonElement apptEl : currentAppointments) {
                    JsonObject appt = apptEl.getAsJsonObject();
                    if (appt.has("date") && appointment.getDate().equals(appt.get("date").getAsString())) {
                        newAppointmentsList.add(appt);
                    }
                }

                // Check for duplicate for same patient and date
                for (JsonElement app : newAppointmentsList) {
                    if (app.getAsJsonObject().get("patient_username").getAsString()
                            .equals(appointment.getPatientUsername())) {
                        resp.setStatus(409);
                        resp.getWriter().write("{\"error\":\"Appointment already exists for this patient on this date.\"}");
                        return;
                    }
                }

                // Add new appointment
                JsonObject newAppt = new JsonObject();
                newAppt.addProperty("patient_username", appointment.getPatientUsername());
                newAppt.addProperty("urgency", appointment.getUrgency());
                newAppt.addProperty("booking_dateTime", System.currentTimeMillis());
                newAppt.addProperty("date", appointment.getDate());
                newAppointmentsList.add(newAppt);

                // Sort using Bubble Sort with queue
                List<JsonObject> tempList = new ArrayList<>();
                for (JsonElement e : newAppointmentsList) tempList.add(e.getAsJsonObject());

                Queue<JsonObject> sortedQueue = bubbleSortByUrgencyUsingQueue(tempList);
                JsonArray sortedAppointments = new JsonArray();
                while (!sortedQueue.isEmpty()) {
                    sortedAppointments.add(sortedQueue.poll());
                }

                slotData.add("appointments", sortedAppointments);
                slotData.addProperty("number_of_bookings", sortedAppointments.size());
                slotData.addProperty("next_time_slot", calculateNextTime(slotData.get("time_slot").getAsString(), sortedAppointments.size()));

                // Save patient appointment history
                Path userAppointmentFile = Paths.get(baseDir, "appointments", appointment.getPatientUsername() + "_appointment.txt");
                JsonArray userAppointments;
                if (Files.exists(userAppointmentFile)) {
                    userAppointments = JsonParser.parseString(Files.readString(userAppointmentFile)).getAsJsonArray();
                } else {
                    Files.createDirectories(userAppointmentFile.getParent());
                    userAppointments = new JsonArray();
                }

                JsonObject userApptEntry = new JsonObject();
                userApptEntry.addProperty("doctorUsername", appointment.getDoctorUsername());
                userApptEntry.addProperty("hospitalName", appointment.getHospitalName());
                userApptEntry.addProperty("timeSlot", appointment.getTimeSlot());
                userApptEntry.addProperty("date", appointment.getDate());
                userApptEntry.addProperty("urgency", appointment.getUrgency());
                userApptEntry.addProperty("status", "booked");
                userApptEntry.addProperty("bookedAt", System.currentTimeMillis());

                userAppointments.add(userApptEntry);
                Files.writeString(userAppointmentFile, new GsonBuilder().setPrettyPrinting().create().toJson(userAppointments));

                updated = true;
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

    private Queue<JsonObject> bubbleSortByUrgencyUsingQueue(List<JsonObject> appointmentList) {
        Queue<JsonObject> queue = new LinkedList<>(appointmentList);
        List<JsonObject> tempList = new ArrayList<>(queue);

        int n = tempList.size();
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                int urgency1 = tempList.get(j).get("urgency").getAsInt();
                int urgency2 = tempList.get(j + 1).get("urgency").getAsInt();
                if (urgency1 < urgency2) {
                    Collections.swap(tempList, j, j + 1);
                }
            }
        }

        Queue<JsonObject> sortedQueue = new LinkedList<>();
        sortedQueue.addAll(tempList);
        return sortedQueue;
    }
}
