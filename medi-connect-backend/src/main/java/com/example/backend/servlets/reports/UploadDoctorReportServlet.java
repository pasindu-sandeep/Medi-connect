package com.example.backend.servlets.reports;

import com.example.backend.models.DoctorVisitReport;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.nio.file.*;

@WebServlet("/api/upload-report")
public class UploadDoctorReportServlet extends HttpServlet {
    private String baseDir;
    private final Gson gson = new GsonBuilder().setPrettyPrinting().create();

    @Override
    public void init() {
        baseDir = getServletContext().getInitParameter("dataFilePath");

        try {
            Files.createDirectories(Paths.get(baseDir, "patient_data"));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");

        try {
            DoctorVisitReport report = gson.fromJson(req.getReader(), DoctorVisitReport.class);
            Path reportFile = Paths.get(baseDir, "patient_data", report.getPatientUsername() + "_reports.txt");

            // Convert to JSON and append
            try (BufferedWriter writer = Files.newBufferedWriter(reportFile,
                    StandardOpenOption.CREATE, StandardOpenOption.APPEND)) {

                writer.write(gson.toJson(report));
                writer.newLine();
                writer.write("----------"); // optional separator
                writer.newLine();
            }

            resp.getWriter().write("{\"status\":\"report uploaded\"}");
        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"error\":\"Failed to upload report\"}");
        }
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}
