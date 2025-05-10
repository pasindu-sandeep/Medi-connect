package com.example.backend.servlets.appointment;

import com.google.gson.Gson;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.nio.file.*;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/system/stats")
public class GetSystemStatsServlet extends HttpServlet {
    private String baseDir;

    @Override
    public void init() {
        baseDir = getServletContext().getInitParameter("dataFilePath");
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json");

        Gson gson = new Gson();
        Map<String, Integer> stats = new HashMap<>();

        stats.put("doctors", countFiles(Paths.get(baseDir, "doctor_data"), "_data.txt"));
        stats.put("patients", countFiles(Paths.get(baseDir, "patient_data"), "_data.txt"));
        stats.put("hospitals", countFiles(Paths.get(baseDir, "hospital_data"), "_data.txt"));
        stats.put("appointments", countAppointments(Paths.get(baseDir, "appointments")));

        resp.getWriter().write(gson.toJson(stats));
    }

    private void setCorsHeaders(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    private int countFiles(Path dir, String suffix) {
        if (!Files.exists(dir)) return 0;
        try {
            return (int) Files.list(dir)
                    .filter(p -> p.getFileName().toString().endsWith(suffix))
                    .count();
        } catch (IOException e) {
            return 0;
        }
    }

    private int countAppointments(Path dir) {
        if (!Files.exists(dir)) return 0;
        int total = 0;
        try (DirectoryStream<Path> files = Files.newDirectoryStream(dir)) {
            for (Path file : files) {
                String content = Files.readString(file);
                total += new Gson().fromJson(content, com.google.gson.JsonArray.class).size();
            }
        } catch (IOException e) {
            return 0;
        }
        return total;
    }
}
