package com.example.backend.servlets.doctor;

import com.example.backend.models.DoctorSchedule;
import com.google.gson.Gson;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@WebServlet("/api/doctor-schedule/search")
public class DoctorScheduleByHospitalServlet extends HttpServlet {
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
        String hospital = req.getParameter("hospital");

        if (username == null || hospital == null || username.isBlank() || hospital.isBlank()) {
            resp.setStatus(400);
            resp.getWriter().write("{\"error\":\"Missing 'username' or 'hospital' query parameter.\"}");
            return;
        }

        Path scheduleFilePath = Paths.get(doctorDataPath, username + "_schedule.txt");

        if (!Files.exists(scheduleFilePath)) {
            resp.setStatus(404);
            resp.getWriter().write("{\"error\":\"Schedule not found for doctor.\"}");
            return;
        }

        Gson gson = new Gson();
        DoctorSchedule schedule = gson.fromJson(Files.readString(scheduleFilePath), DoctorSchedule.class);

        Map<String, List<DoctorSchedule.Availability>> filteredSchedule = new LinkedHashMap<>();

        // Iterate over all days
        Map<String, List<DoctorSchedule.Availability>> fullSchedule = Map.of(
                "MONDAY", schedule.getAvailabilityList_Monday(),
                "TUESDAY", schedule.getAvailabilityList_Tuesday(),
                "WEDNESDAY", schedule.getAvailabilityList_Wednesday(),
                "THURSDAY", schedule.getAvailabilityList_Thurs(),
                "FRIDAY", schedule.getAvailabilityList_Friday(),
                "SATURDAY", schedule.getAvailabilityList_Saturday(),
                "SUNDAY", schedule.getAvailabilityList_Sunday()
        );

        for (Map.Entry<String, List<DoctorSchedule.Availability>> entry : fullSchedule.entrySet()) {
            List<DoctorSchedule.Availability> matches = new ArrayList<>();

            if (entry.getValue() != null) {
                for (DoctorSchedule.Availability a : entry.getValue()) {
                    if (a.hospitalName.equalsIgnoreCase(hospital)) {
                        matches.add(a);
                    }
                }
            }

            if (!matches.isEmpty()) {
                filteredSchedule.put(entry.getKey(), matches);
            }
        }

        resp.getWriter().write(gson.toJson(filteredSchedule));
    }
}