package com.example.backend.servlets.hospital;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.example.backend.models.Hospital;
import com.google.gson.Gson;

import javax.servlet.annotation.WebFilter;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.nio.file.*;
import java.util.*;

@WebServlet("/api/hospital-details")
public class HospitalsWithDetails extends HttpServlet {
    private String hospitalDataPath;

    @Override
    public void init() {
        hospitalDataPath = Paths.get(getServletContext().getInitParameter("dataFilePath"), "hospital_data").toString();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        // Allow cross-origin request from frontend
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");

        resp.setContentType("application/json");
        List<Hospital> hospitalDetails = new ArrayList<>();
        Gson gson = new Gson();

        try (DirectoryStream<Path> stream = Files.newDirectoryStream(Paths.get(hospitalDataPath), "*_data.txt")) {
            for (Path file : stream) {
                Hospital h = gson.fromJson(Files.readString(file), Hospital.class);
                hospitalDetails.add(h);
            }
        }

        resp.getWriter().write(gson.toJson(hospitalDetails));
    }
}

