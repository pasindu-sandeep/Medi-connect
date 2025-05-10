package com.example.backend.servlets.patient;

import com.example.backend.models.Patient;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/api/patients-details")  // Note the leading slash
public class PatientsWithDetails extends HttpServlet {

    private String patientDataPath;

    @Override
    public void init() throws ServletException {
        patientDataPath = Paths.get(getServletContext().getInitParameter("dataFilePath"), "patient_data").toString();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCorsHeaders(resp);

        resp.setContentType("application/json");
        List<Patient> patientDetails = new ArrayList<>();
        Gson gson = new Gson();

        try (DirectoryStream<Path> stream = Files.newDirectoryStream(Paths.get(patientDataPath), "*_data.txt")) {
            for (Path file : stream) {
                Patient p = gson.fromJson(Files.readString(file), Patient.class);
                patientDetails.add(p);
            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"error\":\"Failed to read patient data.\"}");
            return;
        }

        resp.getWriter().write(gson.toJson(patientDetails));
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    private void setCorsHeaders(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
}
