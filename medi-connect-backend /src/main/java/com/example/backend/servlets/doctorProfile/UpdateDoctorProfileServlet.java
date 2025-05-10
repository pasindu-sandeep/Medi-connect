package com.example.backend.servlets.doctorProfile;

import com.example.backend.models.Doctor;
import com.example.backend.models.DoctorSchedule;
import com.google.gson.Gson;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.nio.file.*;
import java.util.Map;

@WebServlet("/api/doctor-profile/update")
public class UpdateDoctorProfileServlet extends HttpServlet {
    private String doctorDataPath;

    @Override
    public void init() {
        doctorDataPath = Paths.get(
                getServletContext().getInitParameter("dataFilePath"),
                "doctor_data"
        ).toString();
    }

    // ✅ Add this to handle preflight OPTIONS request
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        setCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    // ✅ Reusable method to set CORS headers
    private void setCorsHeaders(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCorsHeaders(resp); // ✅ Apply CORS here too
        resp.setContentType("application/json");

        BufferedReader reader = req.getReader();
        Gson gson = new Gson();
        Map<?, ?> payload = gson.fromJson(reader, Map.class);

        Doctor doctor = gson.fromJson(gson.toJson(payload.get("doctor")), Doctor.class);
        DoctorSchedule schedule = gson.fromJson(gson.toJson(payload.get("schedule")), DoctorSchedule.class);

        Path profilePath = Paths.get(doctorDataPath, doctor.username + "_data.txt");
        Path schedulePath = Paths.get(doctorDataPath, doctor.username + "_schedule.txt");

        if (!Files.exists(profilePath)) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            resp.getWriter().write("{\"error\":\"Doctor profile not found\"}");
            return;
        }

        Files.writeString(profilePath, gson.toJson(doctor));
        Files.writeString(schedulePath, gson.toJson(schedule));

        resp.getWriter().write("{\"status\":\"updated\"}");
    }
}
