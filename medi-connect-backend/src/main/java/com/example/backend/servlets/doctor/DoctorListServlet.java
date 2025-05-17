package com.example.backend.servlets.doctor;

import com.google.gson.Gson;
import com.example.backend.models.Doctor;

import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@WebServlet("/api/doctors/names")
public class DoctorListServlet extends HttpServlet {
    private String doctorDataPath;

    public static List<Map<String, String>> getDoctorNamesAndSpecializations(String doctorDataPath) throws IOException {
        List<Map<String, String>> result = new ArrayList<>();
        Gson gson = new Gson();

        try (DirectoryStream<Path> stream = Files.newDirectoryStream(Paths.get(doctorDataPath), "*_data.txt")) {
            for (Path file : stream) {
                String content = Files.readString(file);
                Doctor doc = gson.fromJson(content, Doctor.class);

                Map<String, String> entry = new HashMap<>();
                entry.put("name", doc.name);
                entry.put("specialization", doc.Specialization);
                result.add(entry);
            }
        }

        return result;
    }

    @Override
    public void init() {
        doctorDataPath = Paths.get(getServletContext().getInitParameter("dataFilePath"), "doctor_data").toString();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        System.out.println("data path : " + doctorDataPath);
        // Allow cross-origin request from frontend
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
        resp.setContentType("application/json");

        List<Map<String, String>> doctors = getDoctorNamesAndSpecializations(doctorDataPath);
        resp.getWriter().write(new Gson().toJson(doctors));
    }
}


