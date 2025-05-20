package com.example.backend.servlets.doctor;

import com.example.backend.models.DoctorSchedule;
import com.google.gson.Gson;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.file.*;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.*;

@WebServlet("/api/doctor-schedule")
public class DoctorScheduleServlet extends HttpServlet {
    private String doctorDataPath;

    @Override
    public void init() {
        doctorDataPath = Paths.get(getServletContext().getInitParameter("dataFilePath"), "doctor_data").toString();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        resp.setContentType("application/json");
        // Allow cross-origin request from frontend
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");

        String username = req.getParameter("username");

        if (username == null || username.isBlank()) {
            resp.setStatus(400);
            resp.getWriter().write("{\"error\":\"Doctor username is required.\"}");
            return;
        }

        Gson gson = new Gson();
        Path schedulePath = Paths.get(doctorDataPath, username + "_schedule.txt");

        if (!Files.exists(schedulePath)) {
            resp.setStatus(404);
            resp.getWriter().write("{\"error\":\"Schedule not found for doctor.\"}");
            return;
        }

        DoctorSchedule schedule = gson.fromJson(Files.readString(schedulePath), DoctorSchedule.class);

        // Step 2: Filter schedule for the next 3 days
        Map<String, List<DoctorSchedule.Availability>> result = new LinkedHashMap<>();
        LocalDate today = LocalDate.now();

        for (int i = 0; i < 3; i++) {
            DayOfWeek day = today.plusDays(i).getDayOfWeek();
            String dayKey = day.name();
            List<DoctorSchedule.Availability> availabilities = getAvailabilityForDay(schedule, dayKey);

            if (availabilities != null && !availabilities.isEmpty()) {
                result.put(dayKey, availabilities);
            }
        }

        resp.getWriter().write(gson.toJson(result));
    }

    private List<DoctorSchedule.Availability> getAvailabilityForDay(DoctorSchedule sched, String dayName) {
        return switch (dayName.toUpperCase()) {
            case "MONDAY" -> sched.getAvailabilityList_Monday();
            case "TUESDAY" -> sched.getAvailabilityList_Tuesday();
            case "WEDNESDAY" -> sched.getAvailabilityList_Wednesday();
            case "THURSDAY" -> sched.getAvailabilityList_Thurs();
            case "FRIDAY" -> sched.getAvailabilityList_Friday();
            case "SATURDAY" -> sched.getAvailabilityList_Saturday();
            case "SUNDAY" -> sched.getAvailabilityList_Sunday();
            default -> Collections.emptyList();
        };
    }
}
