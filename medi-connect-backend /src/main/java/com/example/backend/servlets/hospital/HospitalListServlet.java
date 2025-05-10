package com.example.backend.servlets.hospital;

import com.example.backend.models.Hospital;
import com.google.gson.Gson;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.nio.file.*;
import java.util.*;

@WebServlet("/api/hospitals")
public class HospitalListServlet extends HttpServlet {
    private String hospitalDataPath;

    @Override
    public void init() {
        hospitalDataPath = Paths.get(getServletContext().getInitParameter("dataFilePath"), "hospital_data").toString();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        // Allow cross-origin request from frontend
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
        List<String> hospitalNames = new ArrayList<>();
        Gson gson = new Gson();

        try (DirectoryStream<Path> stream = Files.newDirectoryStream(Paths.get(hospitalDataPath), "*_data.txt")) {
            for (Path file : stream) {
                Hospital h = gson.fromJson(Files.readString(file), Hospital.class);
                hospitalNames.add(h.hospitalName);
            }
        }

        resp.getWriter().write(gson.toJson(hospitalNames));
    }
}
