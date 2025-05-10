package com.example.backend.servlets.doctorProfile;

import com.example.backend.models.Doctor;
import com.example.backend.models.DoctorSchedule;
import com.google.gson.Gson;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.nio.file.*;
import java.util.Map;

@WebServlet("/api/doctor-profile/data")
public class GetDoctorProfileServlet extends HttpServlet {
    private String doctorDataPath;

    @Override
    public void init() {
        doctorDataPath = Paths.get(getServletContext().getInitParameter("dataFilePath"), "doctor_data").toString();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String username = req.getParameter("username");
        resp.setContentType("application/json");
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (username == null || username.isBlank()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\":\"Missing username parameter\"}");
            return;
        }

        Path profilePath = Paths.get(doctorDataPath, username + "_data.txt");
        Path schedulePath = Paths.get(doctorDataPath, username + "_schedule.txt");

        if (!Files.exists(profilePath) || !Files.exists(schedulePath)) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            resp.getWriter().write("{\"error\":\"Doctor profile not found\"}");
            return;
        }

        Gson gson = new Gson();
        Doctor doctor = gson.fromJson(Files.readString(profilePath), Doctor.class);
        DoctorSchedule schedule = gson.fromJson(Files.readString(schedulePath), DoctorSchedule.class);

        String responseJson = gson.toJson(Map.of("doctor", doctor, "schedule", schedule));
        resp.getWriter().write(responseJson);
    }
}
