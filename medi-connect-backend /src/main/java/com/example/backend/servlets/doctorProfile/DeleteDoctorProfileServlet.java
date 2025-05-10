package com.example.backend.servlets.doctorProfile;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.Comparator;

@WebServlet("/api/doctor-profile/delete")
public class DeleteDoctorProfileServlet extends HttpServlet {
    private String doctorDataPath;

    @Override
    public void init() {
        doctorDataPath = Paths.get(
                getServletContext().getInitParameter("dataFilePath"),
                "doctor_data"
        ).toString();
    }

    // ✅ Reusable CORS header method
    private void setCorsHeaders(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    // ✅ Handle preflight OPTIONS requests
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json");

        String username = req.getParameter("username");

        if (username == null || username.isBlank()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\":\"Missing username parameter\"}");
            return;
        }

        Path profilePath = Paths.get(doctorDataPath, username + "_data.txt");
        Path schedulePath = Paths.get(doctorDataPath, username + "_schedule.txt");
        Path timeSlotsDir = Paths.get(doctorDataPath, username + "_timeSlots");

        try {
            Files.deleteIfExists(profilePath);
            Files.deleteIfExists(schedulePath);

            if (Files.exists(timeSlotsDir)) {
                Files.walk(timeSlotsDir)
                        .sorted(Comparator.reverseOrder())
                        .map(Path::toFile)
                        .forEach(File::delete);
            }

            resp.getWriter().write("{\"status\":\"deleted\"}");
        } catch (IOException e) {
            resp.setStatus(500);
            resp.getWriter().write("{\"error\":\"Failed to delete profile\"}");
        }
    }
}
