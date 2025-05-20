package com.example.backend.servlets.doctor;

import com.example.backend.models.Doctor;
import com.example.backend.models.DoctorSchedule;
import com.example.backend.models.DoctorRegistrationRequest;
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
import java.time.Duration;
import java.time.LocalTime;
import java.util.*;

@WebServlet("/api/doctor-register")
public class RegisterServlet extends HttpServlet {
    private String baseDir;

    @Override
    public void init() {
        baseDir = getServletContext().getInitParameter("dataFilePath");

        try {
            Files.createDirectories(Paths.get(baseDir, "doctor_data"));
            Files.createDirectories(Paths.get(baseDir, "patient_data"));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void setCorsHeaders(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json");

        BufferedReader reader = req.getReader();
        Gson gson = new Gson();

        DoctorRegistrationRequest registration = gson.fromJson(reader, DoctorRegistrationRequest.class);
        Doctor doctor = registration.getDoctor();
        DoctorSchedule schedule = registration.getSchedule();

        Path doctorFilePath = Paths.get(baseDir, "doctor_data", doctor.getUsername() + "_data.txt");
        Path doctorSchedulePath = Paths.get(baseDir, "doctor_data", doctor.getUsername() + "_schedule.txt");
        Path patientCheckPath = Paths.get(baseDir, "patient_data", doctor.getUsername() + "_data.txt");

        if (Files.exists(doctorFilePath) || Files.exists(patientCheckPath)) {
            resp.setStatus(HttpServletResponse.SC_CONFLICT);
            resp.getWriter().write("{\"error\": \"Username already in use\"}");
            return;
        }

        try {
            // Save doctor data
            Files.writeString(doctorFilePath, gson.toJson(doctor));
            Files.writeString(doctorSchedulePath, gson.toJson(schedule));

            // Create timeSlots directory
            String timeSlotsDir = Paths.get(baseDir, "doctor_data", doctor.getUsername() + "_timeSlots").toString();
            Files.createDirectories(Paths.get(timeSlotsDir));

            // Safely build schedule map
            Map<String, List<DoctorSchedule.Availability>> scheduleByDay = new HashMap<>();
            if (schedule.getAvailabilityList_Monday() != null)
                scheduleByDay.put("monday", schedule.getAvailabilityList_Monday());
            if (schedule.getAvailabilityList_Tuesday() != null)
                scheduleByDay.put("tuesday", schedule.getAvailabilityList_Tuesday());
            if (schedule.getAvailabilityList_Wednesday() != null)
                scheduleByDay.put("wednesday", schedule.getAvailabilityList_Wednesday());
            if (schedule.getAvailabilityList_Thurs() != null)
                scheduleByDay.put("thursday", schedule.getAvailabilityList_Thurs());
            if (schedule.getAvailabilityList_Friday() != null)
                scheduleByDay.put("friday", schedule.getAvailabilityList_Friday());
            if (schedule.getAvailabilityList_Saturday() != null)
                scheduleByDay.put("saturday", schedule.getAvailabilityList_Saturday());
            if (schedule.getAvailabilityList_Sunday() != null)
                scheduleByDay.put("sunday", schedule.getAvailabilityList_Sunday());

            // Write time slot files
            for (Map.Entry<String, List<DoctorSchedule.Availability>> entry : scheduleByDay.entrySet()) {
                String day = entry.getKey();
                List<DoctorSchedule.Availability> availabilities = entry.getValue();

                if (availabilities != null && !availabilities.isEmpty()) {
                    Path dayFile = Paths.get(timeSlotsDir, day);
                    List<Map<String, Object>> hospitalSlots = new ArrayList<>();

                    for (DoctorSchedule.Availability slot : availabilities) {
                        Map<String, Object> hospitalMap = new HashMap<>();
                        int totalSlots = calculateSlots(slot.timeSlot);
                        Map<String, Object> slotData = new HashMap<>();
                        slotData.put("time_slot", slot.timeSlot);
                        slotData.put("total_appointments", totalSlots);
                        slotData.put("number_of_bookings", 0);
                        slotData.put("next_time_slot", getNthSlotTime(slot.timeSlot, 0));
                        slotData.put("appointments", new ArrayList<>());
                        hospitalMap.put(slot.hospitalName, slotData);
                        hospitalSlots.add(hospitalMap);
                    }

                    Files.writeString(dayFile, gson.toJson(hospitalSlots));
                }
            }

            resp.getWriter().write("{\"status\":\"registered\"}");

        } catch (IOException e) {
            e.printStackTrace();
            resp.setStatus(500);
            resp.getWriter().write("{\"error\": \"Failed to save doctor data.\"}");
        }
    }

    private int calculateSlots(String timeRange) {
        String[] times = timeRange.replace(" ", "").split("-");
        LocalTime start = LocalTime.parse(times[0]);
        LocalTime end = LocalTime.parse(times[1]);
        return (int) Duration.between(start, end).toMinutes() / 10;
    }

    private String getNthSlotTime(String timeRange, int n) {
        String[] times = timeRange.replace(" ", "").split("-");
        LocalTime start = LocalTime.parse(times[0]);
        return start.plusMinutes(n * 10).toString();
    }
}
